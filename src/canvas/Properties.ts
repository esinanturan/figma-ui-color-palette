import type { TextColorsThemeHexModel } from '../utils/types'
import chroma from 'chroma-js'
import { APCAcontrast, sRGBtoY, fontLookupAPCA } from 'apca-w3'
import Tag from './Tag'

export default class Properties {
  name: string
  rgb: Array<number>
  textColorsTheme: TextColorsThemeHexModel
  hex: string
  lch: Array<number>
  nodeTopProps: FrameNode
  nodeBottomProps: FrameNode
  nodeBaseProps: FrameNode
  nodeContrastScoresProps: FrameNode
  nodeProperties: TextNode
  nodeDetailedBaseProps: FrameNode
  nodeDetailedWCAGScoresProps: FrameNode
  nodeDetailedAPCAScoresProps: FrameNode
  nodeColumns: FrameNode
  nodeLeftColumn: FrameNode
  nodeRightColumn: FrameNode
  node: FrameNode

  constructor(
    name: string,
    rgb: Array<number>,
    textColorsTheme: TextColorsThemeHexModel
  ) {
    this.name = name
    this.rgb = rgb
    this.textColorsTheme = textColorsTheme
    this.hex = chroma(rgb).hex()
    this.lch = chroma(rgb).lch()
    this.node = figma.createFrame()
  }

  getContrast(textColor: string) {
    return chroma.contrast(
      this.rgb,
      textColor === 'DARK'
        ? this.textColorsTheme.darkColor
        : this.textColorsTheme.lightColor
    )
  }

  getAPCAContrast(textColor: string) {
    return APCAcontrast(
      sRGBtoY(
        textColor === 'DARK'
          ? chroma(this.textColorsTheme.darkColor).rgb()
          : chroma(this.textColorsTheme.lightColor).rgb()
      ),
      sRGBtoY(this.rgb)
    )
  }

  getLevel(textColor: string) {
    return this.getContrast(textColor) < 4.5
      ? 'A'
      : this.getContrast(textColor) >= 4.5 && this.getContrast(textColor) < 7
      ? 'AA'
      : 'AAA'
  }

  getMinFontSizes(textColor: string) {
    return fontLookupAPCA(this.getAPCAContrast(textColor))
  }

  makeNodeTopProps() {
    // base
    this.nodeTopProps = figma.createFrame()
    this.nodeTopProps.name = '_top'
    this.nodeTopProps.fills = []

    // layout
    this.nodeTopProps.layoutMode = 'HORIZONTAL'
    this.nodeTopProps.primaryAxisSizingMode = 'FIXED'
    this.nodeTopProps.counterAxisSizingMode = 'AUTO'
    this.nodeTopProps.layoutAlign = 'STRETCH'

    return this.nodeTopProps
  }

  makeNodeBottomProps() {
    // base
    this.nodeBottomProps = figma.createFrame()
    this.nodeBottomProps.name = '_bottom'
    this.nodeBottomProps.fills = []

    // layout
    this.nodeBottomProps.layoutMode = 'VERTICAL'
    this.nodeBottomProps.primaryAxisSizingMode = 'AUTO'
    this.nodeBottomProps.counterAxisSizingMode = 'FIXED'
    this.nodeBottomProps.layoutAlign = 'STRETCH'

    // insert
    this.nodeBottomProps.appendChild(this.makeNodeContrastScoresProps())

    return this.nodeBottomProps
  }

  makeNodeBaseProps() {
    // base
    this.nodeBaseProps = figma.createFrame()
    this.nodeBaseProps.name = '_base'
    this.nodeBaseProps.fills = []

    // layout
    this.nodeBaseProps.layoutMode = 'VERTICAL'
    this.nodeBaseProps.primaryAxisSizingMode = 'AUTO'
    this.nodeBaseProps.counterAxisSizingMode = 'FIXED'
    this.nodeBaseProps.counterAxisAlignItems = 'MAX'
    this.nodeBaseProps.layoutGrow = 1
    this.nodeBaseProps.itemSpacing = 4

    // insert
    this.nodeBaseProps.appendChild(
      new Tag('_hex', this.hex.toUpperCase()).makeNodeTag()
    )
    this.nodeBaseProps.appendChild(
      new Tag(
        '_lch',
        `L ${Math.floor(this.lch[0])} • C ${Math.floor(
          this.lch[1]
        )} • H ${Math.floor(this.lch[2])}`
      ).makeNodeTag()
    )

    return this.nodeBaseProps
  }

  makeNodeContrastScoresProps() {
    // base
    this.nodeContrastScoresProps = figma.createFrame()
    this.nodeContrastScoresProps.name = '_contrast-scores'
    this.nodeContrastScoresProps.fills = []

    // layout
    this.nodeContrastScoresProps.layoutMode = 'VERTICAL'
    this.nodeContrastScoresProps.primaryAxisSizingMode = 'AUTO'
    this.nodeContrastScoresProps.counterAxisSizingMode = 'FIXED'
    this.nodeContrastScoresProps.layoutAlign = 'STRETCH'
    this.nodeContrastScoresProps.itemSpacing = 4

    // insert
    this.nodeContrastScoresProps.appendChild(
      new Tag(
        '_wcag21-light',
        `${this.getContrast('LIGHT').toFixed(2)} • ${this.getLevel('LIGHT')}`
      ).makeNodeTag(chroma(this.textColorsTheme.lightColor).gl(), true)
    )
    this.nodeContrastScoresProps.appendChild(
      new Tag(
        '_wcag21-dark',
        `${this.getContrast('DARK').toFixed(2)} • ${this.getLevel('DARK')}`
      ).makeNodeTag(chroma(this.textColorsTheme.darkColor).gl(), true)
    )
    this.nodeContrastScoresProps.appendChild(
      new Tag(
        '_apca-light',
        `Lc ${this.getAPCAContrast('LIGHT').toFixed(1)} • ${
          this.getMinFontSizes('LIGHT')[4]
        }pt (400)`
      ).makeNodeTag(chroma(this.textColorsTheme.lightColor).gl(), true)
    )
    this.nodeContrastScoresProps.appendChild(
      new Tag(
        '_apca-dark',
        `Lc ${this.getAPCAContrast('DARK').toFixed(1)} • ${
          this.getMinFontSizes('DARK')[4]
        }pt (400)`
      ).makeNodeTag(chroma(this.textColorsTheme.darkColor).gl(), true)
    )

    return this.nodeContrastScoresProps
  }

  makeNodeDetailedBaseProps() {
    this.nodeDetailedBaseProps = figma.createFrame()
    this.nodeDetailedBaseProps.name = '_base'
    this.nodeDetailedBaseProps.fills = []

    // layout
    this.nodeDetailedBaseProps.layoutMode = 'VERTICAL'
    this.nodeDetailedBaseProps.primaryAxisSizingMode = 'AUTO'
    this.nodeDetailedBaseProps.layoutAlign = 'STRETCH'
    this.nodeDetailedBaseProps.itemSpacing = 4

    // insert
    this.nodeDetailedBaseProps.appendChild(
      new Tag('_title', 'Base', 10).makeNodeTag()
    )
    this.nodeDetailedBaseProps.appendChild(
      new Tag('_hex', this.hex.toUpperCase()).makeNodeTag()
    )
    this.nodeDetailedBaseProps.appendChild(
      new Tag(
        '_lch',
        `L ${Math.floor(this.lch[0])} • C ${Math.floor(
          this.lch[1]
        )} • H ${Math.floor(this.lch[2])}`
      ).makeNodeTag()
    )

    return this.nodeDetailedBaseProps
  }

  makeDetailedWCAGScoresProps() {
    this.nodeDetailedWCAGScoresProps = figma.createFrame()
    this.nodeDetailedWCAGScoresProps.name = '_wcag-score'
    this.nodeDetailedWCAGScoresProps.fills = []

    // layout
    this.nodeDetailedWCAGScoresProps.layoutMode = 'VERTICAL'
    this.nodeDetailedWCAGScoresProps.primaryAxisSizingMode = 'AUTO'
    this.nodeDetailedWCAGScoresProps.layoutAlign = 'STRETCH'
    this.nodeDetailedWCAGScoresProps.itemSpacing = 4

    // insert
    this.nodeDetailedWCAGScoresProps.appendChild(
      new Tag('_title', 'WCAG scores', 10).makeNodeTag()
    )
    this.nodeDetailedWCAGScoresProps.appendChild(
      new Tag(
        '_wcag21-light',
        `${this.getContrast('LIGHT').toFixed(2)} • ${this.getLevel('LIGHT')}`
      ).makeNodeTag(chroma(this.textColorsTheme.lightColor).gl(), true)
    )
    this.nodeDetailedWCAGScoresProps.appendChild(
      new Tag(
        '_wcag21-dark',
        `${this.getContrast('DARK').toFixed(2)} • ${this.getLevel('DARK')}`
      ).makeNodeTag(chroma(this.textColorsTheme.darkColor).gl(), true)
    )

    return this.nodeDetailedWCAGScoresProps
  }

  makeNodeDetailedAPCAScoresProps() {
    this.nodeDetailedAPCAScoresProps = figma.createFrame()
    this.nodeDetailedAPCAScoresProps.name = '_wcag-score'
    this.nodeDetailedAPCAScoresProps.fills = []
    const
      minimumDarkFontSize: Array<string | number> = this.getMinFontSizes('DARK'),
      minimumLightFontSize: Array<string | number> = this.getMinFontSizes('LIGHT')

    // layout
    this.nodeDetailedAPCAScoresProps.layoutMode = 'VERTICAL'
    this.nodeDetailedAPCAScoresProps.primaryAxisSizingMode = 'AUTO'
    this.nodeDetailedAPCAScoresProps.counterAxisSizingMode = 'FIXED'
    this.nodeDetailedAPCAScoresProps.layoutAlign = 'STRETCH'
    this.nodeDetailedAPCAScoresProps.itemSpacing = 4

    // insert
    this.nodeDetailedAPCAScoresProps.appendChild(
      new Tag('_title', 'APCA scores', 10).makeNodeTag()
    )
    this.nodeDetailedAPCAScoresProps.appendChild(
      this.makeNodeColumns(
        [
          new Tag(
            '_apca-light',
            `Lc ${this.getAPCAContrast('LIGHT').toFixed(1)}`,
          ).makeNodeTag(chroma(this.textColorsTheme.lightColor).gl(), true),
          new Tag(
            '_minimum-font-sizes',
            'Minimum font sizes',
          ).makeNodeTag(),
          new Tag(
            '_200',
            `${minimumLightFontSize[2]}pt (200)`,
          ).makeNodeTag(),
          new Tag(
            '_300',
            `${minimumLightFontSize[3]}pt (300)`,
          ).makeNodeTag(),
          new Tag(
            '_400',
            `${minimumLightFontSize[4]}pt (400)`,
          ).makeNodeTag(),
          new Tag(
            '_500',
            `${minimumLightFontSize[5]}pt (500)`,
          ).makeNodeTag(),
          new Tag(
            '_500',
            `${minimumLightFontSize[5]}pt (500)`,
          ).makeNodeTag(),
          new Tag(
            '_700',
            `${minimumLightFontSize[7]}pt (700)`
          ).makeNodeTag()
        ],
        [
          new Tag(
            '_apca-dark',
            `Lc ${this.getAPCAContrast('DARK').toFixed(1)}`
          ).makeNodeTag(chroma(this.textColorsTheme.darkColor).gl(), true),
          new Tag(
            '_minimum-font-sizes',
            'Minimum font sizes'
          ).makeNodeTag(),
          new Tag(
            '_200',
            `${minimumDarkFontSize[2]}pt (200)`
          ).makeNodeTag(),
          new Tag(
            '_300',
            `${minimumDarkFontSize[3]}pt (300)`
          ).makeNodeTag(),
          new Tag(
            '_400',
            `${minimumDarkFontSize[4]}pt (400)`
          ).makeNodeTag(),
          new Tag(
            '_500',
            `${minimumDarkFontSize[5]}pt (500)`
          ).makeNodeTag(),
          new Tag(
            '_600',
            `${minimumDarkFontSize[6]}pt (600)`
          ).makeNodeTag(),
          new Tag(
            '_700',
            `${minimumDarkFontSize[7]}pt (700)`
          ).makeNodeTag()
        ]
      )
    )

    return this.nodeDetailedAPCAScoresProps
  }

  makeNodeColumns(leftNodes: Array<FrameNode>, rightNodes: Array<FrameNode>) {
    this.nodeColumns = figma.createFrame()
    this.nodeLeftColumn = figma.createFrame()
    this.nodeRightColumn = figma.createFrame()
    this.nodeColumns.name = '_columns'
    this.nodeLeftColumn.name = '_left-column'
    this.nodeRightColumn.name = '_right-column'
    //this.nodeColumns.fills = this.nodeLeftColumn.fills = this.nodeRightColumn.fills = []

    // layout
    this.nodeColumns.layoutMode = 'HORIZONTAL'
    this.nodeColumns.primaryAxisSizingMode = 'FIXED'
    this.nodeColumns.counterAxisSizingMode = 'AUTO'
    this.nodeColumns.layoutAlign = 'STRETCH'
    this.nodeColumns.itemSpacing = 8

    this.nodeLeftColumn.layoutMode = this.nodeRightColumn.layoutMode = 'VERTICAL'
    this.nodeLeftColumn.primaryAxisSizingMode = this.nodeRightColumn.primaryAxisSizingMode = 'AUTO'
    this.nodeLeftColumn.counterAxisSizingMode = this.nodeRightColumn.counterAxisSizingMode = 'FIXED'
    this.nodeLeftColumn.layoutGrow = this.nodeRightColumn.layoutGrow = 1
    this.nodeLeftColumn.itemSpacing = this.nodeRightColumn.itemSpacing = 4

    // insert
    leftNodes.forEach(node => this.nodeLeftColumn.appendChild(node))
    rightNodes.forEach(node => this.nodeRightColumn.appendChild(node))
    this.nodeColumns.appendChild(this.nodeLeftColumn)
    this.nodeColumns.appendChild(this.nodeRightColumn)

    return this.nodeColumns   
  }

  makeNodeDetailed() {
    // base
    this.node.name = '_properties'
    this.node.fills = []

    // layout
    this.node.layoutMode = 'VERTICAL'
    this.node.primaryAxisSizingMode = 'FIXED'
    this.node.counterAxisSizingMode = 'FIXED'
    this.node.layoutAlign = 'STRETCH'
    this.node.layoutGrow = 1
    this.node.itemSpacing = 16

    // insert
    this.node.appendChild(
      this.makeNodeColumns(
        [
          this.makeNodeDetailedBaseProps(),
        ],
        [
          this.makeDetailedWCAGScoresProps()
        ]
      )
    )
    this.node.appendChild(this.makeNodeDetailedAPCAScoresProps())

    return this.node
  }

  makeNode() {
    // base
    this.node.name = '_properties'
    this.node.fills = []

    // layout
    this.node.layoutMode = 'VERTICAL'
    this.node.primaryAxisSizingMode = 'FIXED'
    this.node.counterAxisSizingMode = 'FIXED'
    this.node.primaryAxisAlignItems = 'SPACE_BETWEEN'
    this.node.layoutAlign = 'STRETCH'
    this.node.layoutGrow = 1

    // insert
    this.node.appendChild(this.makeNodeTopProps())
    this.nodeTopProps.appendChild(new Tag('_scale', this.name, 10).makeNodeTag())
    this.nodeTopProps.appendChild(this.makeNodeBaseProps())
    this.node.appendChild(this.makeNodeBottomProps())

    return this.node
  }
}
