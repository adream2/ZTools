import type { GeneratorLogic } from '@/components/templates/types'

const LATIN = `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum`.split(' ')

const CN_CHARS = '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞'

const MIXED_WORDS = ['设计', '系统', '工具', '数据', '接口', '体验', '组件', '性能', '结构', '文档', '流程', '方案']

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

function latinSentence(): string {
  const words = Array.from({ length: rand(6, 14) }, () => pick(LATIN))
  const s = words.join(' ')
  return s.charAt(0).toUpperCase() + s.slice(1) + '.'
}

function cnSentence(): string {
  const parts: string[] = []
  const len = rand(4, 9)
  for (let i = 0; i < len; i++) {
    if (Math.random() < 0.22) parts.push(pick(MIXED_WORDS))
    else parts.push(Array.from({ length: rand(1, 3) }, () => pick([...CN_CHARS])).join(''))
  }
  return parts.join('') + (Math.random() < 0.15 ? '？' : '。')
}

function build(lang: string, unit: string, count: number): string {
  const sentence = () => (lang === 'cn' ? cnSentence() : latinSentence())

  if (unit === 'word') {
    if (lang === 'cn') {
      return Array.from({ length: count }, () => Array.from({ length: rand(1, 2) }, () => pick([...CN_CHARS])).join('')).join(' ')
    }
    return Array.from({ length: count }, () => pick(LATIN)).join(' ')
  }

  if (unit === 'sentence') {
    return Array.from({ length: count }, sentence).join(lang === 'cn' ? '' : ' ')
  }

  return Array.from({ length: count }, () => {
    const sentences = rand(3, 6)
    return Array.from({ length: sentences }, sentence).join(lang === 'cn' ? '' : ' ')
  }).join('\n\n')
}

const FIELDS = [
  {
    key: 'lang',
    label: '语言',
    type: 'select' as const,
    default: 'cn',
    options: [
      { label: '中文', value: 'cn' },
      { label: '英文（Lorem）', value: 'en' },
    ],
  },
  {
    key: 'unit',
    label: '单位',
    type: 'select' as const,
    default: 'paragraph',
    options: [
      { label: '段落', value: 'paragraph' },
      { label: '句子', value: 'sentence' },
      { label: '词', value: 'word' },
    ],
  },
  { key: 'count', label: '数量', type: 'number' as const, default: 3, min: 1, max: 50 },
  { key: 'flat', label: '合并为一行', type: 'switch' as const, default: false },
]

function generate(values: Record<string, string | number | boolean>): string {
  const text = build(String(values.lang), String(values.unit), Math.min(50, Math.max(1, Number(values.count) || 1)))
  return values.flat ? text.replace(/\n+/g, ' ') : text
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: '中文为随机字词组合，仅用于排版占位，没有语义',
  resultLabel: '占位文本',
}

export default logic
