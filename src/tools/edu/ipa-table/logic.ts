import type { LookupLogic } from '@/components/templates/types'

interface Row {
  symbol: string
  kind: string
  word: string
  note: string
}

const ROWS: Row[] = [
  { symbol: 'iː', kind: '长元音', word: 'see /siː/', note: '嘴角向两边拉开，比 /ɪ/ 长' },
  { symbol: 'ɪ', kind: '短元音', word: 'sit /sɪt/', note: '短促、嘴形放松' },
  { symbol: 'e', kind: '短元音', word: 'bed /bed/', note: '开口比 /ɪ/ 大' },
  { symbol: 'æ', kind: '短元音', word: 'cat /kæt/', note: '下巴压低，介于 a 与 e 之间' },
  { symbol: 'ɑː', kind: '长元音', word: 'car /kɑː/', note: '口腔张开，舌位靠后' },
  { symbol: 'ɒ', kind: '短元音', word: 'hot /hɒt/', note: '英式短 o，美音多读 /ɑː/' },
  { symbol: 'ɔː', kind: '长元音', word: 'door /dɔː/', note: '圆唇，舌位后' },
  { symbol: 'ʊ', kind: '短元音', word: 'book /bʊk/', note: '短促、嘴唇略圆' },
  { symbol: 'uː', kind: '长元音', word: 'food /fuːd/', note: '圆唇向前突出' },
  { symbol: 'ʌ', kind: '短元音', word: 'cup /kʌp/', note: '口形放松，声音短' },
  { symbol: 'ɜː', kind: '长元音', word: 'bird /bɜːd/', note: '舌中部抬起，卷舌不明显' },
  { symbol: 'ə', kind: '弱元音', word: 'about /əˈbaʊt/', note: '最轻的元音，重读非重读音节' },
  { symbol: 'eɪ', kind: '双元音', word: 'day /deɪ/', note: '从 /e/ 滑向 /ɪ/' },
  { symbol: 'aɪ', kind: '双元音', word: 'my /maɪ/', note: '从 /a/ 滑向 /ɪ/' },
  { symbol: 'ɔɪ', kind: '双元音', word: 'boy /bɔɪ/', note: '从 /ɔ/ 滑向 /ɪ/' },
  { symbol: 'aʊ', kind: '双元音', word: 'now /naʊ/', note: '从 /a/ 滑向 /ʊ/' },
  { symbol: 'əʊ', kind: '双元音', word: 'go /ɡəʊ/', note: '英式，美音读 /oʊ/' },
  { symbol: 'ɪə', kind: '双元音', word: 'here /hɪə/', note: '滑向弱元音 /ə/' },
  { symbol: 'eə', kind: '双元音', word: 'hair /heə/', note: '滑向 /ə/，美音常带 r' },
  { symbol: 'ʊə', kind: '双元音', word: 'tour /tʊə/', note: '滑向 /ə/，现代英音多并入 /ɔː/' },
  { symbol: 'p', kind: '爆破音', word: 'pen /pen/', note: '双唇送气清音' },
  { symbol: 'b', kind: '爆破音', word: 'bad /bæd/', note: '双唇不送气浊音' },
  { symbol: 't', kind: '爆破音', word: 'tea /tiː/', note: '舌尖齿龈清音' },
  { symbol: 'd', kind: '爆破音', word: 'did /dɪd/', note: '舌尖齿龈浊音' },
  { symbol: 'k', kind: '爆破音', word: 'cat /kæt/', note: '舌根清音' },
  { symbol: 'g', kind: '爆破音', word: 'get /ɡet/', note: '舌根浊音' },
  { symbol: 'tʃ', kind: '破擦音', word: 'chair /tʃeə/', note: '清音，像「吃」的开头' },
  { symbol: 'dʒ', kind: '破擦音', word: 'job /dʒɒb/', note: '浊音，像「知」的开头' },
  { symbol: 'f', kind: '摩擦音', word: 'fall /fɔːl/', note: '上齿轻触下唇' },
  { symbol: 'v', kind: '摩擦音', word: 'very /ˈveri/', note: '与 /f/ 同口形，加声带振动' },
  { symbol: 'θ', kind: '摩擦音', word: 'think /θɪŋk/', note: '舌尖轻触上齿，不振动' },
  { symbol: 'ð', kind: '摩擦音', word: 'this /ðɪs/', note: '与 /θ/ 同口形，振动' },
  { symbol: 's', kind: '摩擦音', word: 'see /siː/', note: '舌尖靠近齿龈' },
  { symbol: 'z', kind: '摩擦音', word: 'zoo /zuː/', note: '与 /s/ 对应，声带振动' },
  { symbol: 'ʃ', kind: '摩擦音', word: 'she /ʃiː/', note: '像「西」的声母，圆唇' },
  { symbol: 'ʒ', kind: '摩擦音', word: 'measure /ˈmeʒə/', note: '与 /ʃ/ 对应，浊音' },
  { symbol: 'h', kind: '摩擦音', word: 'how /haʊ/', note: '纯呼气，不摩擦' },
  { symbol: 'm', kind: '鼻音', word: 'man /mæn/', note: '双唇闭合，气流走鼻腔' },
  { symbol: 'n', kind: '鼻音', word: 'no /nəʊ/', note: '舌尖抵齿龈' },
  { symbol: 'ŋ', kind: '鼻音', word: 'sing /sɪŋ/', note: '舌根抵软腭，词尾常见' },
  { symbol: 'l', kind: '流音', word: 'leg /leɡ/', note: '舌尖抵齿龈，气流从两侧出' },
  { symbol: 'r', kind: '流音', word: 'red /red/', note: '舌尖卷起但不碰任何位置' },
  { symbol: 'j', kind: '半元音', word: 'yes /jes/', note: '像汉语「耶」的声母' },
  { symbol: 'w', kind: '半元音', word: 'we /wiː/', note: '圆唇滑向元音' },
]

const logic: LookupLogic = {
  DATASET: ROWS.map((r) => ({
    key: r.symbol,
    title: `/${r.symbol}/`,
    desc: r.word,
    tags: [r.kind],
    rows: [
      { label: '音标', value: `/${r.symbol}/` },
      { label: '类别', value: r.kind },
      { label: '例词', value: r.word },
      { label: '要点', value: r.note },
    ],
  })),
  placeholder: '搜索音标或例词，如 /æ/、cat、鼻音',
  note: '共 44 个音素：20 个元音 + 24 个辅音（英式 RP）',
}

export default logic
