import {
  Button,
  ConsentConfiguration,
  FormItem,
  HexModel,
  Input,
  Message,
  SectionTitle,
  SortableList,
} from '@a_ng_d/figmug-ui'
import React from 'react'
import { uid } from 'uid'

import { locals } from '../../content/locals'
import { EditorType, Language, PlanStatus } from '../../types/app'
import {
  PresetConfiguration,
  ScaleConfiguration,
  ThemeConfiguration,
} from '../../types/configurations'
import { ThemesMessage } from '../../types/messages'
import { ActionsList, DispatchProcess } from '../../types/models'
import { Identity } from '../../types/user'
import features from '../../utils/config'
import doLightnessScale from '../../utils/doLightnessScale'
import { trackColorThemesManagementEvent } from '../../utils/eventsTracker'
import isBlocked from '../../utils/isBlocked'
import type { AppStates } from '../App'
import Feature from '../components/Feature'
import Actions from '../modules/Actions'
import Dispatcher from '../modules/Dispatcher'

interface ThemesProps {
  preset: PresetConfiguration
  scale: ScaleConfiguration
  themes: Array<ThemeConfiguration>
  identity?: Identity
  userConsent: Array<ConsentConfiguration>
  planStatus: PlanStatus
  editorType: EditorType
  lang: Language
  figmaUserId: string
  onChangeThemes: React.Dispatch<Partial<AppStates>>
  onSyncLocalStyles: () => void
  onSyncLocalVariables: () => void
  onPublishPalette: () => void
}

export default class Themes extends React.Component<ThemesProps> {
  themesMessage: ThemesMessage
  dispatch: { [key: string]: DispatchProcess }

  constructor(props: ThemesProps) {
    super(props)
    this.themesMessage = {
      type: 'UPDATE_THEMES',
      data: [],
      isEditedInRealTime: false,
    }
    this.dispatch = {
      themes: new Dispatcher(
        () => parent.postMessage({ pluginMessage: this.themesMessage }, '*'),
        500
      ) as DispatchProcess,
    }
  }

  // Handlers
  themesHandler = (e: any) => {
    let id: string | null
    const element: HTMLElement | null = (e.target as HTMLElement).closest(
        '.draggable-item'
      ),
      currentElement = e.currentTarget as HTMLInputElement

    element !== null ? (id = element.getAttribute('data-id')) : (id = null)

    this.themesMessage.isEditedInRealTime = false

    const addTheme = () => {
      const hasAlreadyNewUITheme = this.props.themes.filter((color) =>
        color.name.includes(locals[this.props.lang].themes.new)
      )

      this.themesMessage.data = this.props.themes.map((theme) => {
        theme.isEnabled = false
        return theme
      })
      this.themesMessage.data.push({
        name: `${locals[this.props.lang].themes.new} ${hasAlreadyNewUITheme.length + 1}`,
        description: '',
        scale: doLightnessScale(
          this.props.preset.scale,
          this.props.preset.min === undefined ? 10 : this.props.preset.min,
          this.props.preset.max === undefined ? 90 : this.props.preset.max
        ),
        paletteBackground: '#FFFFFF',
        isEnabled: true,
        id: uid(),
        type: 'custom theme',
      })

      this.props.onChangeThemes({
        scale:
          this.themesMessage.data.find((theme) => theme.isEnabled)?.scale ?? {},
        themes: this.themesMessage.data,
        onGoingStep: 'themes changed',
      })

      parent.postMessage({ pluginMessage: this.themesMessage }, '*')
      trackColorThemesManagementEvent(
        this.props.figmaUserId,
        this.props.userConsent.find((consent) => consent.id === 'mixpanel')
          ?.isConsented ?? false,
        {
          feature: 'ADD_THEME',
        }
      )
    }

    const renameTheme = () => {
      const hasSameName = this.props.themes.filter(
        (color) => color.name === currentElement.value
      )

      this.themesMessage.data = this.props.themes.map((item) => {
        if (item.id === id)
          item.name =
            hasSameName.length > 1
              ? currentElement.value + ' 2'
              : currentElement.value
        return item
      })

      this.props.onChangeThemes({
        scale:
          this.themesMessage.data.find((theme) => theme.isEnabled)?.scale ?? {},
        themes: this.themesMessage.data,
        onGoingStep: 'themes changed',
      })

      if (e.type === 'blur' || e.code === 'Enter') {
        parent.postMessage({ pluginMessage: this.themesMessage }, '*')
        trackColorThemesManagementEvent(
          this.props.figmaUserId,
          this.props.userConsent.find((consent) => consent.id === 'mixpanel')
            ?.isConsented ?? false,
          {
            feature: 'RENAME_THEME',
          }
        )
      }
    }

    const updatePaletteBackgroundColor = () => {
      const code: HexModel =
        currentElement.value.indexOf('#') === -1
          ? '#' + currentElement.value
          : currentElement.value

      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(code)) {
        this.themesMessage.data = this.props.themes.map((item) => {
          if (item.id === id) item.paletteBackground = code
          return item
        })

        this.props.onChangeThemes({
          scale:
            this.themesMessage.data.find((theme) => theme.isEnabled)?.scale ??
            {},
          themes: this.themesMessage.data,
          onGoingStep: 'themes changed',
        })
      }

      if (e.type === 'blur') {
        this.dispatch.themes.on.status = false
        parent.postMessage({ pluginMessage: this.themesMessage }, '*')
        trackColorThemesManagementEvent(
          this.props.figmaUserId,
          this.props.userConsent.find((consent) => consent.id === 'mixpanel')
            ?.isConsented ?? false,
          {
            feature: 'UPDATE_BACKGROUND',
          }
        )
      } else {
        this.themesMessage.isEditedInRealTime = true
        this.dispatch.themes.on.status = true
      }
    }

    const updateThemeDescription = () => {
      this.themesMessage.data = this.props.themes.map((item) => {
        if (item.id === id) item.description = currentElement.value
        return item
      })

      this.props.onChangeThemes({
        scale:
          this.themesMessage.data.find((theme) => theme.isEnabled)?.scale ?? {},
        themes: this.themesMessage.data,
        onGoingStep: 'themes changed',
      })

      if (e.type === 'blur' || e.key === 'Enter') {
        parent.postMessage({ pluginMessage: this.themesMessage }, '*')
        trackColorThemesManagementEvent(
          this.props.figmaUserId,
          this.props.userConsent.find((consent) => consent.id === 'mixpanel')
            ?.isConsented ?? false,
          {
            feature: 'DESCRIBE_THEME',
          }
        )
      }
    }

    const actions: ActionsList = {
      ADD_THEME: () => addTheme(),
      RENAME_THEME: () => renameTheme(),
      UPDATE_PALETTE_BACKGROUND: () => updatePaletteBackgroundColor(),
      UPDATE_DESCRIPTION: () => updateThemeDescription(),
      NULL: () => null,
    }

    return actions[currentElement.dataset.feature ?? 'NULL']?.()
  }

  // Direct actions
  onAddTheme = () => {
    const hasAlreadyNewUITheme = this.props.themes.filter((color) =>
      color.name.includes(locals[this.props.lang].themes.new)
    )
    this.themesMessage.data = this.props.themes.map((theme) => {
      theme.isEnabled = false
      return theme
    })
    this.themesMessage.data.push({
      name: `${locals[this.props.lang].themes.new} ${hasAlreadyNewUITheme.length + 1}`,
      description: '',
      scale: doLightnessScale(
        this.props.preset.scale,
        this.props.preset.min === undefined ? 10 : this.props.preset.min,
        this.props.preset.max === undefined ? 90 : this.props.preset.max
      ),
      paletteBackground: '#FFFFFF',
      isEnabled: true,
      id: uid(),
      type: 'custom theme',
    })
    this.props.onChangeThemes({
      scale:
        this.themesMessage.data.find((theme) => theme.isEnabled)?.scale ?? {},
      themes: this.themesMessage.data,
      onGoingStep: 'themes changed',
    })

    parent.postMessage({ pluginMessage: this.themesMessage }, '*')
    trackColorThemesManagementEvent(
      this.props.figmaUserId,
      this.props.userConsent.find((consent) => consent.id === 'mixpanel')
        ?.isConsented ?? false,
      {
        feature: 'ADD_THEME_FROM_DROPDOWN',
      }
    )
  }

  onChangeOrder = (themes: Array<ThemeConfiguration>) => {
    const defaultTheme = this.props.themes.filter(
      (item) => item.type === 'default theme'
    )

    if (themes.length === 0) {
      defaultTheme[0].isEnabled = true
      this.themesMessage.data = defaultTheme
    } else if (themes.find((item) => item.isEnabled) === undefined) {
      themes[0].isEnabled = true
      this.themesMessage.data = defaultTheme.concat(themes)
    } else {
      this.themesMessage.data = defaultTheme.concat(themes)
    }

    this.props.onChangeThemes({
      scale:
        this.themesMessage.data.find((theme) => theme.isEnabled)?.scale ?? {},
      themes: this.themesMessage.data,
      onGoingStep: 'themes changed',
    })

    parent.postMessage({ pluginMessage: this.themesMessage }, '*')
    trackColorThemesManagementEvent(
      this.props.figmaUserId,
      this.props.userConsent.find((consent) => consent.id === 'mixpanel')
        ?.isConsented ?? false,
      {
        feature: 'REORDER_THEME',
      }
    )
  }

  // Render
  render() {
    const customThemes = this.props.themes.filter(
      (item) => item.type === 'custom theme'
    )

    return (
      <div className="controls__control">
        <div className="control__block control__block--list">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <SectionTitle
                label={locals[this.props.lang].themes.title}
                indicator={customThemes.length.toString()}
              />
            </div>
            <div className="section-controls__right-part">
              <Button
                type="icon"
                icon="plus"
                isBlocked={isBlocked('THEMES', this.props.planStatus)}
                isDisabled={isBlocked('THEMES', this.props.planStatus)}
                feature="ADD_THEME"
                action={
                  isBlocked('THEMES', this.props.planStatus)
                    ? () => null
                    : this.themesHandler
                }
              />
            </div>
          </div>
          {customThemes.length === 0 ? (
            <div className="onboarding__callout--centered">
              <Message
                icon="theme"
                messages={[locals[this.props.lang].themes.callout.message]}
              />
              <div className="onboarding__actions">
                <Button
                  type="primary"
                  feature="ADD_THEME"
                  label={locals[this.props.lang].themes.callout.cta}
                  isBlocked={isBlocked('THEMES', this.props.planStatus)}
                  isDisabled={isBlocked('THEMES', this.props.planStatus)}
                  action={
                    isBlocked('THEMES', this.props.planStatus)
                      ? () => null
                      : this.themesHandler
                  }
                />
              </div>
            </div>
          ) : (
            <SortableList
              data={customThemes as Array<ThemeConfiguration>}
              primarySlot={customThemes.map((theme) => {
                return (
                  <>
                    <Feature
                      isActive={
                        features.find(
                          (feature) => feature.name === 'THEMES_NAME'
                        )?.isActive
                      }
                    >
                      <div className="list__item__param--compact">
                        <Input
                          type="TEXT"
                          value={theme.name}
                          feature="RENAME_THEME"
                          charactersLimit={24}
                          onBlur={this.themesHandler}
                          onConfirm={this.themesHandler}
                        />
                      </div>
                    </Feature>
                    <Feature
                      isActive={
                        features.find(
                          (feature) => feature.name === 'THEMES_PARAMS'
                        )?.isActive
                      }
                    >
                      <div className="list__item__param">
                        <FormItem
                          id="palette-background-color"
                          label={
                            locals[this.props.lang].themes
                              .paletteBackgroundColor.label
                          }
                          shouldFill={false}
                        >
                          <Input
                            id="palette-background-color"
                            type="COLOR"
                            value={theme.paletteBackground}
                            feature="UPDATE_PALETTE_BACKGROUND"
                            onChange={this.themesHandler}
                            onBlur={this.themesHandler}
                          />
                        </FormItem>
                      </div>
                    </Feature>
                  </>
                )
              })}
              secondarySlot={customThemes.map((theme) => (
                <>
                  <Feature
                    isActive={
                      features.find(
                        (feature) => feature.name === 'THEMES_DESCRIPTION'
                      )?.isActive
                    }
                  >
                    <div className="list__item__param">
                      <FormItem
                        id="theme-description"
                        label={locals[this.props.lang].global.description.label}
                      >
                        <Input
                          id="theme-description"
                          type="LONG_TEXT"
                          value={theme.description}
                          placeholder={
                            locals[this.props.lang].global.description
                              .placeholder
                          }
                          feature="UPDATE_DESCRIPTION"
                          isGrowing={true}
                          onBlur={this.themesHandler}
                          onConfirm={this.themesHandler}
                        />
                      </FormItem>
                    </div>
                  </Feature>
                </>
              ))}
              isScrollable={true}
              onChangeSortableList={this.onChangeOrder}
            />
          )}
        </div>
        <Actions
          context="DEPLOY"
          {...this.props}
        />
      </div>
    )
  }
}
