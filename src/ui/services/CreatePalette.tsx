import * as React from 'react'
import chroma from 'chroma-js'
import type {
  Language,
  PresetConfiguration,
  SourceColorConfiguration,
  TextColorsThemeHexModel,
} from '../../utils/types'
import Message from '../components/Message'
import Bar from '../components/Bar'
import Tabs from '../components/Tabs'
import Scale from '../modules/Scale'
import Settings from '../modules/Settings'
import { palette } from '../../utils/palettePackage'
import features from '../../utils/config'
import { locals } from '../../content/locals'
import Actions from '../modules/Actions'
import doLightnessScale from '../../utils/doLightnessScale'
import Input from '../components/Input'
import FormItem from '../components/FormItem'

interface Props {
  sourceColors: Array<SourceColorConfiguration> | []
  name: string
  description: string
  preset: PresetConfiguration
  colorSpace: string
  view: string
  textColorsTheme: TextColorsThemeHexModel
  planStatus: 'UNPAID' | 'PAID'
  lang: Language
  onImportCoolors: (sourceColorsFromCoolers: Array<SourceColorConfiguration>) => void
  onChangePreset: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
  onCustomPreset: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
  onChangeSettings: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
}

export default class CreatePalette extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {
      context:
        features.filter(
          (feature) =>
            feature.type === 'CONTEXT' &&
            feature.service.includes('CREATE') &&
            feature.isActive
        )[0] != undefined
          ? features.filter(
              (feature) =>
                feature.type === 'CONTEXT' &&
                feature.service.includes('CREATE') &&
                feature.isActive
            )[0].name
          : '',
      coolorsUrl: ''
    }
  }

  // Handlers
  navHandler = (e: React.SyntheticEvent) =>
    this.setState({
      context: (e.target as HTMLElement).dataset.feature,
    })
  
  importCoolorsHandler = (e: React.SyntheticEvent) => {
    const url = (e.target as HTMLInputElement).value,
      domain = url.split('/')[3],
      hexs = url.split('/').at(-1)

    if (hexs != undefined)
      if (/[A-Za-z0-9]+-[A-Za-z0-9]+/i.test(hexs)) {
        this.props.onImportCoolors(
          hexs.split('-').map(hex => {
            const gl = chroma(hex).gl()
            return {
              name: hex,
              rgb: {
                r: gl[0],
                g: gl[1],
                b: gl[2]
              },
              source: 'COOLORS'
            }
          }
        ))
      }

  }

  // Direct actions
  onCreatePalette = () =>
    parent.postMessage({
      pluginMessage: {
        type: 'CREATE_PALETTE',
        data: {
          sourceColors: this.props.sourceColors,
          palette: palette,
        }
      }},
      '*'
    )

  setContexts = () => {
    const contexts: Array<{
      label: string
      id: string
    }> = []
    if (features.find((feature) => feature.name === 'SOURCE')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.source,
        id: 'SOURCE',
      })
    if (features.find((feature) => feature.name === 'SCALE')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.scale,
        id: 'SCALE',
      })
    if (features.find((feature) => feature.name === 'SETTINGS')?.isActive)
      contexts.push({
        label: locals[this.props.lang].contexts.settings,
        id: 'SETTINGS',
      })
    return contexts
  }

  // Renders
  render() {
    palette.preset = this.props.preset
    palette.scale = doLightnessScale(
      this.props.preset.scale,
      this.props.preset.min ?? 0,
      this.props.preset.max ?? 100
    )
    let controls

    switch (this.state['context']) {
      case 'SOURCE': {
        controls = (
          <>
            <div className="controls__control controls__control--horizontal">
              <div className="control__block control__block--list">
                <div className="section-controls">
                  <div className="section-controls__left-part">
                    <div className="section-title">
                      {locals[this.props.lang].source.canvas.title}
                    </div>
                    <div className="type">{`(${this.props.sourceColors.filter(sourceColor => sourceColor.source === 'CANVAS').length})`}</div>
                  </div>
                  <div className="section-controls__right-part">
                  </div>
                </div>
                {
                  this.props.sourceColors.filter(sourceColor => sourceColor.source === 'CANVAS').length > 0
                  ? (
                    <ul className="list">
                      {this.props.sourceColors.filter(sourceColor => sourceColor.source === 'CANVAS').map((sourceColor, index) => {
                        return (
                          <li
                            key={index}
                            className="list__item"
                          >
                            <div className="source-colors">
                              <div
                                className="source-colors__thumbnail"
                                style={{
                                  backgroundColor: `rgb(${sourceColor.rgb.r * 255}, ${sourceColor.rgb.g * 255}, ${sourceColor.rgb.b * 255})`
                                }}
                              ></div>
                              <div className="source-colors__name">
                                <div className="type">
                                  {sourceColor.name}
                                </div>
                                <div className="type type--secondary">
                                  {`(${
                                    chroma(sourceColor.rgb.r * 255, sourceColor.rgb.g * 255, sourceColor.rgb.b * 255)
                                      .hex()
                                      .toUpperCase()
                                  })`}
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )
                  : (
                    <Message
                      icon="list-tile"
                      messages={[locals[this.props.lang].onboarding.selectColor]}
                    />
                  )
                }   
              </div>
              <div className="control__block control__block--list">
                <div className="section-controls">
                  <div className="section-controls__left-part">
                    <div className="section-title">
                      {locals[this.props.lang].source.coolors.title}
                    </div>
                    <div className="type">{`(${this.props.sourceColors.filter(sourceColor => sourceColor.source === 'COOLORS').length})`}</div>
                  </div>
                  <div className="section-controls__right-part">
                  </div>
                </div>
                <div>
                  <FormItem
                    id="coolors-palette-urn"
                    label="Paste your palette URL"
                  >
                    <Input
                      type="TEXT"
                      placeholder="https://coolors.co/…"
                      value={this.state['coolorsUrl']}
                      onChange={(e: React.SyntheticEvent) => this.setState({
                        coolorsUrl: (e.target as HTMLInputElement).value
                      })}
                      onFocus={() => null}
                      onBlur={this.importCoolorsHandler}
                      onConfirm={() => null}
                    />
                  </FormItem>
                </div>
                <ul className="list">
                  {this.props.sourceColors.filter(sourceColor => sourceColor.source === 'COOLORS').map((sourceColor, index) => {
                    return (
                      <li
                        key={index}
                        className="list__item"
                      >
                        <div className="source-colors">
                          <div
                            className="source-colors__thumbnail"
                            style={{
                              backgroundColor: `rgb(${sourceColor.rgb.r * 255}, ${sourceColor.rgb.g * 255}, ${sourceColor.rgb.b * 255})`
                            }}
                          ></div>
                          <div className="source-colors__name">
                            <div className="type">
                              {sourceColor.name}
                            </div>
                            <div className="type type--secondary">
                              {`(${
                                chroma(sourceColor.rgb.r * 255, sourceColor.rgb.g * 255, sourceColor.rgb.b * 255)
                                  .hex()
                                  .toUpperCase()
                              })`}
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
            <Actions
              context="CREATE"
              sourceColors={this.props.sourceColors}
              planStatus={this.props.planStatus}
              lang={this.props.lang}
              onCreatePalette={this.props.sourceColors.length > 0 ? this.onCreatePalette : () => null}
            />
          </>
        )
        break
      }
      case 'SCALE': {
        controls = (
          <Scale
            sourceColors={this.props.sourceColors}
            hasPreset={true}
            preset={this.props.preset}
            planStatus={this.props.planStatus}
            lang={this.props.lang}
            onChangePreset={this.props.onChangePreset}
            onChangeScale={() => null}
            onAddStop={this.props.onCustomPreset}
            onRemoveStop={this.props.onCustomPreset}
            onCreatePalette={this.onCreatePalette}
          />
        )
        break
      }
      case 'SETTINGS': {
        controls = (
          <Settings
            context="CREATE"
            sourceColors={this.props.sourceColors}
            name={this.props.name}
            description={this.props.description}
            colorSpace={this.props.colorSpace}
            textColorsTheme={this.props.textColorsTheme}
            view={this.props.view}
            planStatus={this.props.planStatus}
            lang={this.props.lang}
            onChangeSettings={this.props.onChangeSettings}
            onCreatePalette={this.onCreatePalette}
          />
        )
        break
      }
    }

    return (
      <>
        <Bar
          leftPart={
            <Tabs
              tabs={this.setContexts()}
              active={this.state['context']}
              action={this.navHandler}
            />
          }
          border={['BOTTOM']}
          isOnlyText={true}
        />
        <section className="controller">
          <div className="controls">{controls}</div>
        </section>
      </>
    )
  }
}
