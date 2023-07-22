import Tag from './Tag'
import { lang, locals } from '../content/locals'

export default class Signature {
  nodeInfo: FrameNode
  nodeLogotype: FrameNode
  nodeVector: VectorNode
  node: FrameNode

  makeNodeInfo = () => {
    // base
    this.nodeInfo = figma.createFrame()
    this.nodeInfo.name = '_info'
    this.nodeInfo.fills = []

    // layout
    this.nodeInfo.layoutMode = 'VERTICAL'
    this.nodeInfo.primaryAxisSizingMode = 'AUTO'
    this.nodeInfo.counterAxisSizingMode = 'FIXED'
    this.nodeInfo.layoutGrow = 1
    this.nodeInfo.itemSpacing = 4

    // insert
    this.nodeInfo.appendChild(
      new Tag('_tagline', locals[lang].tagline, 10).makeNodeTag()
    )
    this.nodeInfo.appendChild(
      new Tag(
        '_url',
        locals[lang].url,
        8,
        'https://ui-color-palette.com'
      ).makeNodeTag()
    )

    return this.nodeInfo
  }

  makeNodeLogotype = () => {
    // base
    this.nodeLogotype = figma.createFrame()
    this.nodeLogotype.name = '_logotype'
    this.nodeLogotype.fills = []

    // layout
    this.nodeLogotype.layoutMode = 'VERTICAL'
    this.nodeLogotype.primaryAxisSizingMode = 'AUTO'
    this.nodeLogotype.counterAxisSizingMode = 'FIXED'
    this.nodeLogotype.counterAxisAlignItems = 'MAX'
    this.nodeLogotype.layoutGrow = 1
    this.nodeLogotype.verticalPadding = this.nodeLogotype.horizontalPadding = 2

    // insert
    this.nodeLogotype.appendChild(this.makeNodeVector())

    return this.nodeLogotype
  }

  makeNodeVector = () => {
    // base
    this.nodeVector = figma.createVector()
    this.nodeVector.name = '_vector'
    this.nodeVector.fills = [
      {
        type: 'SOLID',
        color: {
          r: 0 / 255,
          g: 39 / 255,
          b: 47 / 255,
        },
      },
    ]
    this.nodeVector.strokes = [
      {
        type: 'SOLID',
        color: {
          r: 1,
          g: 1,
          b: 1,
        },
      },
    ]
    this.nodeVector.strokeAlign = 'OUTSIDE'
    this.nodeVector.strokeWeight = 5
    this.nodeVector.vectorPaths = [
      {
        windingRule: 'EVENODD',
        data: 'M 28 0 C 12.536027908325195 0 0 12.536025047302246 0 27.999998092651367 L 0 100 C 0 115.46397399902344 12.536029815673828 128 28.000001907348633 128 L 92 128 C 107.46397399902344 128 120 115.46397399902344 120 100 L 120 28 C 120 12.536027908325195 107.46397399902344 0 92 0 L 28 0 Z M 8 27.999998092651367 C 8 16.954303741455078 16.95430564880371 8 28 8 L 38.999996185302734 8 L 38.999996185302734 28 L 38 28 C 34.6862907409668 28 32 30.686290740966797 32 34 L 32 41.999969482421875 L 8 41.999977111816406 L 8 27.999998092651367 Z M 32 45.999969482421875 L 8 45.999977111816406 L 8 81.9999771118164 L 32 82 L 32 45.999969482421875 Z M 32 86 L 8 85.9999771118164 L 8 100 C 8 111.04569244384766 16.954307556152344 120 28.000001907348633 120 L 38.999996185302734 120 L 38.999996185302734 100 L 38 100 C 34.6862907409668 100 32 97.31370544433594 32 94 L 32 86 Z M 42.999996185302734 100 L 42.999996185302734 120 L 77 120 L 77 100 L 42.999996185302734 100 Z M 81 100 L 81 120 L 92 120 C 103.04569244384766 120 112 111.04569244384766 112 100 L 112 85.99996948242188 L 88 85.99996948242188 L 88 94 C 88 97.31371307373047 85.31370544433594 100 82 100 L 81 100 Z M 88 81.99996948242188 L 112 81.99996948242188 L 112 45.999969482421875 L 88 45.999969482421875 L 88 81.99996948242188 Z M 88 41.999969482421875 L 112 41.999969482421875 L 112 28 C 112 16.95430564880371 103.04569244384766 8 92 8 L 81 8 L 81 28 L 82 28 C 85.31370544433594 28 88 30.68629264831543 88 34 L 88 41.999969482421875 Z M 77 28 L 77 8 L 42.999996185302734 8 L 42.999996185302734 28 L 77 28 Z',
      },
      {
        windingRule: 'EVENODD',
        data: 'M 185.5999755859375 104.86400604248047 C 179.77597618103027 104.86400604248047 174.6986484527588 103.66933989524841 170.36798095703125 101.2800064086914 C 166.03731441497803 98.8906729221344 162.67731285095215 95.5306715965271 160.28797912597656 91.20000457763672 C 157.89864587783813 86.86933755874634 156.7039794921875 81.79200172424316 156.7039794921875 75.96800231933594 L 156.7039794921875 25.231998443603516 L 175.96798706054688 25.231998443603516 L 175.96798706054688 75.96800231933594 C 175.96798706054688 79.47733616828918 176.82664239406586 82.31467008590698 178.54397583007812 84.4800033569336 C 180.2613092660904 86.57066988945007 182.6133096218109 87.61599731445312 185.5999755859375 87.61599731445312 C 188.5866415500641 87.61599731445312 190.9386419057846 86.57066988945007 192.65597534179688 84.4800033569336 C 194.37330877780914 82.31467008590698 195.2319793701172 79.47733616828918 195.2319793701172 75.96800231933594 L 195.2319793701172 25.231998443603516 L 214.49598693847656 25.231998443603516 L 214.49598693847656 75.96800231933594 C 214.49598693847656 81.79200172424316 213.3013210296631 86.86933755874634 210.9119873046875 91.20000457763672 C 208.5226535797119 95.5306715965271 205.16265201568604 98.8906729221344 200.8319854736328 101.2800064086914 C 196.57598447799683 103.66933989524841 191.49864196777344 104.86400604248047 185.5999755859375 104.86400604248047 Z',
      },
      {
        windingRule: 'EVENODD',
        data: 'M 229.68423461914062 103.63200378417969 L 229.68423461914062 87.50399780273438 L 248.72422790527344 87.50399780273438 L 248.72422790527344 41.3599967956543 L 229.68423461914062 41.3599967956543 L 229.68423461914062 25.231998443603516 L 287.0282287597656 25.231998443603516 L 287.0282287597656 41.3599967956543 L 267.98822021484375 41.3599967956543 L 267.98822021484375 87.50399780273438 L 287.0282287597656 87.50399780273438 L 287.0282287597656 103.63200378417969 L 229.68423461914062 103.63200378417969 Z',
      },
      {
        windingRule: 'EVENODD',
        data: 'M 332.23248291015625 104.86400604248047 C 326.3338165283203 104.86400604248047 320.9951581954956 103.29600381851196 316.21649169921875 100.16000366210938 C 311.5124912261963 97.02400326728821 307.7418134212494 92.46933603286743 304.90447998046875 86.49600219726562 C 302.1418135166168 80.44800233840942 300.760498046875 73.09333324432373 300.760498046875 64.43199920654297 C 300.760498046875 55.77066612243652 302.1418135166168 48.45333528518677 304.90447998046875 42.480003356933594 C 307.7418134212494 36.4320011138916 311.5124912261963 31.839998245239258 316.21649169921875 28.703998565673828 C 320.9951581954956 25.5679988861084 326.3338165283203 24 332.23248291015625 24 C 336.9364848136902 24 341.3044877052307 25.04533314704895 345.33648681640625 27.13599967956543 C 349.3684883117676 29.22666621208191 352.80316829681396 32.28799819946289 355.6405029296875 36.31999969482422 C 358.55250096321106 40.27733111381531 360.60581147670746 45.13066625595093 361.80047607421875 50.880001068115234 L 344.88848876953125 55.24800109863281 C 344.21649074554443 50.54399919509888 342.7231457233429 47.034667015075684 340.4084777832031 44.720001220703125 C 338.1684777736664 42.33066749572754 335.6298129558563 41.13600158691406 332.79248046875 41.13600158691406 C 330.4031467437744 41.13600158691406 328.2378133535385 41.92000067234039 326.2964782714844 43.48800277709961 C 324.42981231212616 45.05600035190582 322.9364672899246 47.55733370780945 321.81646728515625 50.992000579833984 C 320.6964672803879 54.352001905441284 320.136474609375 58.83200025558472 320.136474609375 64.43199920654297 C 320.136474609375 69.95733261108398 320.6964672803879 74.43733358383179 321.81646728515625 77.87200164794922 C 322.9364672899246 81.30666756629944 324.42981231212616 83.8080061674118 326.2964782714844 85.37600708007812 C 328.2378133535385 86.94400691986084 330.4031467437744 87.72799682617188 332.79248046875 87.72799682617188 C 335.6298129558563 87.72799682617188 338.1684777736664 86.57066369056702 340.4084777832031 84.25599670410156 C 342.7231457233429 81.86666297912598 344.21649074554443 78.31999683380127 344.88848876953125 73.61599731445312 L 361.80047607421875 77.98400115966797 C 360.60581147670746 83.65866804122925 358.55250096321106 88.5119981765747 355.6405029296875 92.54399871826172 C 352.80316829681396 96.57599925994873 349.3684883117676 99.63733768463135 345.33648681640625 101.7280044555664 C 341.3044877052307 103.81867122650146 336.9364848136902 104.86400604248047 332.23248291015625 104.86400604248047 Z',
      },
      {
        windingRule: 'EVENODD',
        data: 'M 376.6527099609375 103.63200378417969 L 376.6527099609375 25.231998443603516 L 406.5567321777344 25.231998443603516 C 412.1567335128784 25.231998443603516 417.01006269454956 26.351998567581177 421.1167297363281 28.59200096130371 C 425.2980647087097 30.831998825073242 428.50875091552734 33.893330812454224 430.7487487792969 37.7760009765625 C 433.06341671943665 41.65866661071777 434.2207336425781 46.10133695602417 434.2207336425781 51.10400390625 C 434.2207336425781 55.808003425598145 433.06341671943665 60.06400179862976 430.7487487792969 63.87200164794922 C 428.50875091552734 67.68000149726868 425.2980647087097 70.70400023460388 421.1167297363281 72.94400024414062 C 417.01006269454956 75.18400025367737 412.1567335128784 76.30400085449219 406.5567321777344 76.30400085449219 L 395.916748046875 76.30400085449219 L 395.916748046875 103.63200378417969 L 376.6527099609375 103.63200378417969 Z M 395.916748046875 60.847999572753906 L 403.19671630859375 60.847999572753906 C 407.07938408851624 60.847999572753906 409.95407259464264 59.914669036865234 411.82073974609375 58.048004150390625 C 413.7620725631714 56.10666906833649 414.73272705078125 53.75466728210449 414.73272705078125 50.992000579833984 C 414.73272705078125 48.15466809272766 413.7620725631714 45.80266630649567 411.82073974609375 43.935997009277344 C 409.95407259464264 42.069332122802734 407.07938408851624 41.13600158691406 403.19671630859375 41.13600158691406 L 395.916748046875 41.13600158691406 L 395.916748046875 60.847999572753906 Z',
      },
    ]
    this.nodeVector.rescale(1 / this.nodeVector.strokeWeight)

    return this.nodeVector
  }

  makeNode = () => {
    // base
    this.node = figma.createFrame()
    this.node.name = '_signature'
    this.node.fills = []

    // layout
    this.node.layoutMode = 'HORIZONTAL'
    this.node.primaryAxisSizingMode = 'FIXED'
    this.node.counterAxisSizingMode = 'AUTO'
    this.node.layoutAlign = 'STRETCH'

    // insert
    this.node.appendChild(this.makeNodeInfo())
    this.node.appendChild(this.makeNodeLogotype())

    return this.node
  }
}
