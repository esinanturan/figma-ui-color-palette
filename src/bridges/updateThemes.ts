import type {
  AlgorithmVersionConfiguration,
  ColorConfiguration,
  ColorSpaceConfiguration,
  PresetConfiguration,
  ScaleConfiguration,
  TextColorsThemeHexModel,
  ViewConfiguration,
} from '../utils/types'
import Colors from '../canvas/Colors'
import {
  previousSelection,
  currentSelection,
  isSelectionChanged,
} from './processSelection'
import { locals, lang } from '../content/locals'

const updateThemes = (msg, palette) => {
  palette = isSelectionChanged ? previousSelection[0] : currentSelection[0]

  if (palette.children.length == 1) {
    const name: string =
        palette.getPluginData('name') === ''
          ? locals[lang].name
          : palette.getPluginData('name'),
      preset: PresetConfiguration = JSON.parse(palette.getPluginData('preset')),
      scale: ScaleConfiguration = JSON.parse(palette.getPluginData('scale')),
      colors: Array<ColorConfiguration> = JSON.parse(
        palette.getPluginData('colors')
      ),
      colorSpace: ColorSpaceConfiguration = palette.getPluginData('colorSpace'),
      view: ViewConfiguration = palette.getPluginData('view'),
      textColorsTheme: TextColorsThemeHexModel = JSON.parse(
        palette.getPluginData('textColorsTheme')
      ),
      algorithmVersion: AlgorithmVersionConfiguration =
        palette.getPluginData('algorithmVersion')

    palette.setPluginData('themes', JSON.stringify(msg.data))

    palette.children[0].remove()
    palette.appendChild(
      new Colors(
        {
          name: palette.getPluginData('name'),
          preset: preset,
          scale: scale,
          colors: colors,
          colorSpace: colorSpace,
          themes: msg.data,
          view:
            msg.isEditedInRealTime && view === 'PALETTE_WITH_PROPERTIES'
              ? 'PALETTE'
              : msg.isEditedInRealTime && view === 'SHEET'
              ? 'SHEET_SAFE_MODE'
              : view,
          textColorsTheme: textColorsTheme,
          algorithmVersion: algorithmVersion,
          service: 'EDIT',
        },
        palette
      ).makeNode()
    )

    // palette migration
    palette.counterAxisSizingMode = 'AUTO'
    palette.name = `${name}﹒${preset.name}﹒${colorSpace} ${
      view.includes('PALETTE') ? 'Palette' : 'Sheet'
    }`
  } else figma.notify(locals[lang].error.corruption)
}

export default updateThemes