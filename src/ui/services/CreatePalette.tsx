import { Bar, ConsentConfiguration, HexModel, Tabs } from '@a_ng_d/figmug-ui'
import chroma from 'chroma-js'
import { PureComponent } from 'preact/compat'
import React from 'react'
import { uid } from 'uid'

import { FeatureStatus } from '@a_ng_d/figmug-utils'
import features, { algorithmVersion } from '../../config'
import {
  Context,
  ContextItem,
  Easing,
  Language,
  NamingConvention,
  PlanStatus,
  ThirdParty,
} from '../../types/app'
import {
  ColorSpaceConfiguration,
  ExtractOfPaletteConfiguration,
  PresetConfiguration,
  ScaleConfiguration,
  SourceColorConfiguration,
  UserConfiguration,
  ViewConfiguration,
  VisionSimulationModeConfiguration,
} from '../../types/configurations'
import { TextColorsThemeHexModel } from '../../types/models'
import { UserSession } from '../../types/user'
import { trackActionEvent } from '../../utils/eventsTracker'
import { palette } from '../../utils/palettePackage'
import { setContexts } from '../../utils/setContexts'
import type { AppStates } from '../App'
import Feature from '../components/Feature'
import Palettes from '../contexts/Palettes'
import Scale from '../contexts/Scale'
import Settings from '../contexts/Settings'
import Source from '../contexts/Source'
import Preview from '../modules/Preview'

interface CreatePaletteProps {
  sourceColors: Array<SourceColorConfiguration> | []
  name: string
  description: string
  preset: PresetConfiguration
  namingConvention: NamingConvention
  distributionEasing: Easing
  scale: ScaleConfiguration
  colorSpace: ColorSpaceConfiguration
  visionSimulationMode: VisionSimulationModeConfiguration
  view: ViewConfiguration
  textColorsTheme: TextColorsThemeHexModel
  userIdentity: UserConfiguration
  userSession: UserSession
  userConsent: Array<ConsentConfiguration>
  palettesList: Array<ExtractOfPaletteConfiguration>
  planStatus: PlanStatus
  lang: Language
  onChangeColorsFromImport: React.Dispatch<Partial<AppStates>>
  onChangeScale: React.Dispatch<Partial<AppStates>>
  onChangePreset: React.Dispatch<Partial<AppStates>>
  onCustomPreset: React.Dispatch<Partial<AppStates>>
  onChangeSettings: React.Dispatch<Partial<AppStates>>
  onConfigureExternalSourceColors: React.Dispatch<Partial<AppStates>>
  onResetSourceColors: React.Dispatch<Partial<AppStates>>
}

interface CreatePaletteStates {
  context: Context | ''
}

export default class CreatePalette extends PureComponent<
  CreatePaletteProps,
  CreatePaletteStates
> {
  private contexts: Array<ContextItem>

  static features = (planStatus: PlanStatus) => ({
    PREVIEW: new FeatureStatus({
      features: features,
      featureName: 'PREVIEW_WCAG',
      planStatus: planStatus,
    }),
  })

  constructor(props: CreatePaletteProps) {
    super(props)
    this.contexts = setContexts(
      ['PALETTES', 'SOURCE', 'SCALE', 'SETTINGS'],
      props.planStatus
    )
    this.state = {
      context:
        this.contexts[0] !== undefined
          ? this.contexts[this.props.sourceColors.length === 0 ? 1 : 2].id
          : '',
    }
  }

  // Handlers
  navHandler = (e: Event) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature as Context,
    })

  colorsFromImportHandler = (
    sourceColorsFromImport: Array<SourceColorConfiguration>,
    source: ThirdParty
  ) => {
    this.props.onChangeColorsFromImport({
      sourceColors: this.props.sourceColors
        .filter(
          (sourceColors: SourceColorConfiguration) =>
            sourceColors.source !== source
        )
        .concat(sourceColorsFromImport),
    })
  }

  resetSourceColorsHandler = () => {
    this.props.onResetSourceColors({
      sourceColors: this.props.sourceColors.filter(
        (sourceColors: SourceColorConfiguration) =>
          sourceColors.source === 'CANVAS'
      ),
    })
  }

  slideHandler = () =>
    this.props.onChangeScale({
      scale: palette.scale,
      onGoingStep: 'scale changed',
    })

  // Direct actions
  onCreatePalette = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'CREATE_PALETTE',
          data: {
            sourceColors: this.props.sourceColors,
            palette: {
              ...palette,
              algoritmVersion: algorithmVersion,
            },
          },
        },
      },
      '*'
    )
    trackActionEvent(
      this.props.userIdentity.id,
      this.props.userConsent.find((consent) => consent.id === 'mixpanel')
        ?.isConsented ?? false,
      {
        feature: 'CREATE_PALETTE',
      }
    )
  }

  onConfigureExternalSourceColors = (name: string, colors: Array<HexModel>) => {
    palette.name = name
    this.setState({
      context: 'SOURCE',
    })
    this.props.onConfigureExternalSourceColors({
      name: name,
      sourceColors: colors.map((color, index) => {
        const gl = chroma(color).gl()
        return {
          name: `Color ${index + 1}`,
          rgb: {
            r: gl[0],
            g: gl[1],
            b: gl[2],
          },
          source: 'REMOTE',
          id: uid(),
          isRemovable: false,
        }
      }),
    })
  }

  // Renders
  render() {
    let fragment

    switch (this.state.context) {
      case 'PALETTES': {
        fragment = (
          <Palettes
            {...this.props}
            onConfigureExternalSourceColors={
              this.onConfigureExternalSourceColors
            }
          />
        )
        break
      }
      case 'SOURCE': {
        fragment = (
          <Source
            {...this.props}
            onChangeColorsFromImport={this.colorsFromImportHandler}
            onCreatePalette={this.onCreatePalette}
          />
        )
        break
      }
      case 'SCALE': {
        fragment = (
          <Scale
            {...this.props}
            hasPreset={true}
            onAddStop={this.props.onCustomPreset}
            onRemoveStop={this.props.onCustomPreset}
            onChangeNamingConvention={this.props.onCustomPreset}
            onChangeDistributionEasing={this.props.onCustomPreset}
            onChangeScale={this.slideHandler}
            onCreatePalette={this.onCreatePalette}
          />
        )
        break
      }
      case 'SETTINGS': {
        fragment = (
          <Settings
            {...this.props}
            service="CREATE"
            onCreatePalette={this.onCreatePalette}
          />
        )
        break
      }
    }

    return (
      <>
        <Bar
          leftPartSlot={
            <Tabs
              tabs={this.contexts}
              active={this.state.context ?? ''}
              action={this.navHandler}
            />
          }
          border={['BOTTOM']}
          isOnlyText={true}
        />
        <section className="controller">
          <div className="controls">{fragment}</div>
        </section>
        <Feature
          isActive={
            CreatePalette.features(this.props.planStatus).PREVIEW.isActive() &&
            this.state.context !== 'PALETTES'
          }
        >
          <Preview
            {...this.props}
            key="preview"
            colors={this.props.sourceColors}
            algorithmVersion={algorithmVersion}
            onResetSourceColors={this.resetSourceColorsHandler}
          />
        </Feature>
      </>
    )
  }
}
