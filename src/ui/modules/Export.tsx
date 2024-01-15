import * as React from 'react'
import type { ActionsList, Language } from '../../utils/types'
import { Input } from '@a-ng-d/figmug.inputs.input'
import { Dropdown } from '@a-ng-d/figmug.inputs.dropdown'
import Actions from './Actions'
import { texts } from '@a-ng-d/figmug.stylesheets.texts'
import features from '../../utils/config'
import isBlocked from '../../utils/isBlocked'
import { locals } from '../../content/locals'
import { Menu } from '@a-ng-d/figmug.navigation.menu'

interface Props {
  exportPreview: string
  planStatus: 'UNPAID' | 'PAID'
  exportType: string
  lang: Language
  onExportPalette: () => void
}

export default class Export extends React.Component<Props, any> {
  counter: number

  static defaultProps = {
    exportPreview: '',
  }

  constructor(props: Props) {
    super(props)
    this.counter = 0
    this.state = {
      format: 'EXPORT_JSON',
      colorSpace: {
        selected: '',
        options: [],
      },
    }
  }

  // Handlers
  exportHandler = (e: React.SyntheticEvent) => {
    const actions: ActionsList = {
      EXPORT_JSON: () => {
        this.setState({
          format: 'EXPORT_JSON',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'JSON' } },
          '*'
        )
      },
      EXPORT_JSON_AMZN_STYLE_DICTIONARY: () => {
        this.setState({
          format: 'EXPORT_JSON_AMZN_STYLE_DICTIONARY',
        })
        parent.postMessage(
          {
            pluginMessage: {
              type: 'EXPORT_PALETTE',
              export: 'JSON_AMZN_STYLE_DICTIONARY',
            },
          },
          '*'
        )
      },
      EXPORT_JSON_TOKENS_STUDIO: () => {
        this.setState({
          format: 'EXPORT_JSON_TOKENS_STUDIO',
        })
        parent.postMessage(
          {
            pluginMessage: {
              type: 'EXPORT_PALETTE',
              export: 'JSON_TOKENS_STUDIO',
            },
          },
          '*'
        )
      },
      EXPORT_CSS: () => {
        this.setState({
          format: 'EXPORT_CSS',
          colorSpace: {
            selected: 'RGB',
            options: [
              {
                label: locals[this.props.lang].export.colorSpace.label,
                value: null,
                feature: null,
                position: 0,
                type: 'TITLE',
                isActive: true,
                isBlocked: false,
                children: [],
                action: () => null,
              },
              {
                label: locals[this.props.lang].export.colorSpace.rgb,
                value: 'EXPORT_CSS_RGB',
                feature: 'SELECT_COLOR_SPACE',
                position: 0,
                type: 'OPTION',
                isActive: features.find(
                  (feature) => feature.name === 'EXPORT_CSS_RGB'
                )?.isActive,
                isBlocked: isBlocked('EXPORT_CSS_RGB', this.props.planStatus),
                children: [],
                action: this.exportHandler,
              },
              {
                label: locals[this.props.lang].export.colorSpace.hex,
                value: 'EXPORT_CSS_HEX',
                feature: 'SELECT_COLOR_SPACE',
                position: 1,
                type: 'OPTION',
                isActive: features.find(
                  (feature) => feature.name === 'EXPORT_CSS_HEX'
                )?.isActive,
                isBlocked: isBlocked('EXPORT_CSS_HEX', this.props.planStatus),
                children: [],
                action: this.exportHandler,
              },
              {
                label: locals[this.props.lang].export.colorSpace.lch,
                value: 'EXPORT_CSS_LCH',
                feature: 'SELECT_COLOR_SPACE',
                position: 2,
                type: 'OPTION',
                isActive: features.find(
                  (feature) => feature.name === 'EXPORT_CSS_LCH'
                )?.isActive,
                isBlocked: isBlocked('EXPORT_CSS_LCH', this.props.planStatus),
                children: [],
                action: this.exportHandler,
              },
              {
                label: locals[this.props.lang].export.colorSpace.p3,
                value: 'EXPORT_CSS_P3',
                feature: 'SELECT_COLOR_SPACE',
                position: 3,
                type: 'OPTION',
                isActive: features.find(
                  (feature) => feature.name === 'EXPORT_CSS_P3'
                )?.isActive,
                isBlocked: isBlocked('EXPORT_CSS_P3', this.props.planStatus),
                children: [],
                action: this.exportHandler,
              },
            ],
          },
        })
        parent.postMessage(
          {
            pluginMessage: {
              type: 'EXPORT_PALETTE',
              export: 'CSS',
              colorSpace: 'RGB',
            },
          },
          '*'
        )
      },
      EXPORT_CSS_RGB: () => {
        this.setState({
          colorSpace: {
            selected: 'RGB',
            options: this.state['colorSpace'].options,
          },
        })
        parent.postMessage(
          {
            pluginMessage: {
              type: 'EXPORT_PALETTE',
              export: 'CSS',
              colorSpace: 'RGB',
            },
          },
          '*'
        )
      },
      EXPORT_CSS_LCH: () => {
        this.setState({
          colorSpace: {
            selected: 'LCH',
            options: this.state['colorSpace'].options,
          },
        })
        parent.postMessage(
          {
            pluginMessage: {
              type: 'EXPORT_PALETTE',
              export: 'CSS',
              colorSpace: 'LCH',
            },
          },
          '*'
        )
      },
      EXPORT_CSS_P3: () => {
        this.setState({
          colorSpace: {
            selected: 'P3',
            options: this.state['colorSpace'].options,
          },
        })
        parent.postMessage(
          {
            pluginMessage: {
              type: 'EXPORT_PALETTE',
              export: 'CSS',
              colorSpace: 'P3',
            },
          },
          '*'
        )
      },
      EXPORT_CSS_HEX: () => {
        this.setState({
          colorSpace: {
            selected: 'HEX',
            options: this.state['colorSpace'].options,
          },
        })
        parent.postMessage(
          {
            pluginMessage: {
              type: 'EXPORT_PALETTE',
              export: 'CSS',
              colorSpace: 'HEX',
            },
          },
          '*'
        )
      },
      EXPORT_TAILWIND: () => {
        this.setState({
          format: 'EXPORT_TAILWIND',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'TAILWIND' } },
          '*'
        )
      },
      EXPORT_SWIFT: () => {
        this.setState({
          format: 'EXPORT_SWIFT',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'SWIFT' } },
          '*'
        )
      },
      EXPORT_ANDROID_COMPOSE: () => {
        this.setState({
          format: 'EXPORT_ANDROID_COMPOSE',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'KT' } },
          '*'
        )
      },
      EXPORT_ANDROID_XML: () => {
        this.setState({
          format: 'EXPORT_ANDROID_XML',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'XML' } },
          '*'
        )
      },
      EXPORT_CSV: () => {
        this.setState({
          format: 'EXPORT_CSV',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'CSV' } },
          '*'
        )
      },
      NULL: () => null,
    }

    return actions[(e.target as HTMLElement).dataset.value ?? 'NULL']?.()
  }

  // Direct actions
  setFirstPreview = () => {
    this.counter == 0
      ? parent.postMessage(
          {
            pluginMessage: {
              type: 'EXPORT_PALETTE',
              export: this.state['format'].replace('EXPORT_', ''),
            },
          },
          '*'
        )
      : null
    this.counter = 1
  }

  selectPreview = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => e.target.select()

  deSelectPreview = () => window.getSelection()?.removeAllRanges()

  // Render
  render() {
    this.setFirstPreview()
    return (
      <div className="controls__control">
        <div className="control__block">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <div className={`section-title ${texts['section-title']}`}>
                {locals[this.props.lang].export.format}
                <div className={`type ${texts.type}`}>(7)</div>
              </div>
            </div>
            <div className="section-controls__right-part">
              <Dropdown
                id="exports-list"
                options={[
                  {
                    label: locals[this.props.lang].export.tokens.label,
                    value: 'TOKENS_GROUP',
                    feature: 'SELECT_EXPORT_FILE',
                    position: 0,
                    type: 'OPTION',
                    isActive: features.find(
                      (feature) => feature.name === 'EXPORT_TOKENS'
                    )?.isActive,
                    isBlocked: isBlocked(
                      'EXPORT_TOKENS',
                      this.props.planStatus
                    ),
                    children: [
                      {
                        label: locals[this.props.lang].export.tokens.global,
                        value: 'EXPORT_JSON',
                        feature: 'SELECT_EXPORT_FILE',
                        position: 0,
                        type: 'OPTION',
                        isActive: features.find(
                          (feature) => feature.name === 'EXPORT_TOKENS_JSON'
                        )?.isActive,
                        isBlocked: isBlocked(
                          'EXPORT_TOKENS_JSON',
                          this.props.planStatus
                        ),
                        children: [],
                        action: this.exportHandler,
                      },
                      {
                        label:
                          locals[this.props.lang].export.tokens.amznStyleDictionary,
                        value: 'EXPORT_JSON_AMZN_STYLE_DICTIONARY',
                        feature: 'SELECT_EXPORT_FILE',
                        position: 0,
                        type: 'OPTION',
                        isActive: features.find(
                          (feature) =>
                            feature.name === 'EXPORT_TOKENS_JSON_AMZN_STYLE_DICTIONARY'
                        )?.isActive,
                        isBlocked: isBlocked(
                          'EXPORT_TOKENS_JSON_AMZN_STYLE_DICTIONARY',
                          this.props.planStatus
                        ),
                        children: [],
                        action: this.exportHandler,
                      },
                      {
                        label: locals[this.props.lang].export.tokens.tokensStudio,
                        value: 'EXPORT_JSON_TOKENS_STUDIO',
                        feature: 'SELECT_EXPORT_FILE',
                        position: 0,
                        type: 'OPTION',
                        isActive: features.find(
                          (feature) =>
                            feature.name === 'EXPORT_TOKENS_JSON_TOKENS_STUDIO'
                        )?.isActive,
                        isBlocked: isBlocked(
                          'EXPORT_TOKENS_JSON_TOKENS_STUDIO',
                          this.props.planStatus
                        ),
                        children: [],
                        action: this.exportHandler,
                      },
                    ],
                    action: () => null,
                  },
                  {
                    label: locals[this.props.lang].export.css.customProperties,
                    value: 'EXPORT_CSS',
                    feature: 'SELECT_EXPORT_FILE',
                    position: 1,
                    type: 'OPTION',
                    isActive: features.find(
                      (feature) => feature.name === 'EXPORT_CSS'
                    )?.isActive,
                    isBlocked: isBlocked('EXPORT_CSS', this.props.planStatus),
                    children: [],
                    action: this.exportHandler,
                  },
                  {
                    label: locals[this.props.lang].export.tailwind.config,
                    value: 'EXPORT_TAILWIND',
                    feature: 'SELECT_EXPORT_FILE',
                    position: 2,
                    type: 'OPTION',
                    isActive: features.find(
                      (feature) => feature.name === 'EXPORT_TAILWIND'
                    )?.isActive,
                    isBlocked: isBlocked(
                      'EXPORT_TAILWIND',
                      this.props.planStatus
                    ),
                    children: [],
                    action: this.exportHandler,
                  },
                  {
                    label: locals[this.props.lang].export.apple.swift,
                    value: 'EXPORT_SWIFT',
                    feature: 'SELECT_EXPORT_FILE',
                    position: 3,
                    type: 'OPTION',
                    isActive: features.find(
                      (feature) => feature.name === 'EXPORT_SWIFT'
                    )?.isActive,
                    isBlocked: isBlocked('EXPORT_SWIFT', this.props.planStatus),
                    children: [],
                    action: this.exportHandler,
                  },
                  {
                    label: locals[this.props.lang].export.android.label,
                    value: 'ANDROID_GROUP',
                    feature: 'SELECT_EXPORT_FILE',
                    position: 4,
                    type: 'OPTION',
                    isActive: features.find(
                      (feature) => feature.name === 'EXPORT_ANDROID'
                    )?.isActive,
                    isBlocked: isBlocked('EXPORT_ANDROID', this.props.planStatus),
                    children: [
                      {
                        label:
                          locals[this.props.lang].export.android.compose,
                        value: 'EXPORT_ANDROID_COMPOSE',
                        feature: 'SELECT_EXPORT_FILE',
                        position: 0,
                        type: 'OPTION',
                        isActive: features.find(
                          (feature) =>
                            feature.name === 'EXPORT_ANDROID_COMPOSE'
                        )?.isActive,
                        isBlocked: isBlocked(
                          'EXPORT_ANDROID_COMPOSE',
                          this.props.planStatus
                        ),
                        children: [],
                        action: this.exportHandler,
                      },
                      {
                        label:
                          locals[this.props.lang].export.android.xml,
                        value: 'EXPORT_ANDROID_XML',
                        feature: 'SELECT_EXPORT_FILE',
                        position: 0,
                        type: 'OPTION',
                        isActive: features.find(
                          (feature) =>
                            feature.name === 'EXPORT_ANDROID_XML'
                        )?.isActive,
                        isBlocked: isBlocked(
                          'EXPORT_ANDROID_XML',
                          this.props.planStatus
                        ),
                        children: [],
                        action: this.exportHandler,
                      },
                    ],
                    action: this.exportHandler,
                  },
                  {
                    label: locals[this.props.lang].export.csv,
                    value: 'EXPORT_CSV',
                    feature: 'SELECT_EXPORT_FILE',
                    position: 5,
                    type: 'OPTION',
                    isActive: features.find(
                      (feature) => feature.name === 'EXPORT_CSV'
                    )?.isActive,
                    isBlocked: isBlocked('EXPORT_CSV', this.props.planStatus),
                    children: [],
                    action: this.exportHandler,
                  },
                ]}
                selected={this.state['format'] ?? ''}
                parentClassName="controls"
                alignment="RIGHT"
              />
              {this.state['format'] === 'EXPORT_CSS' ? (
                <Menu
                  icon="adjust"
                  id="select-color-space"
                  options={this.state['colorSpace'].options}
                  selected={`${this.state['format']}_${this.state['colorSpace'].selected}`}
                  alignment="BOTTOM_RIGHT"
                />
              ) : null}
            </div>
          </div>
          <div className="export-palette__preview">
            <Input
              id="code-snippet-dragging"
              type="CODE"
              value={this.props.exportPreview}
            />
          </div>
        </div>
        <Actions
          context="EXPORT"
          exportType={this.props.exportType}
          lang={this.props.lang}
          onExportPalette={this.props.onExportPalette}
        />
      </div>
    )
  }
}
