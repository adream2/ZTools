import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'ipa-table',
  title: '英语音标表',
  summary: '44 个音标与例词对照',
  category: 'edu',
  subcategory: '语言',
  keywords: ['音标', 'ipa', '英语发音', '国际音标', '元音', '辅音', '英语学习'],
  order: 9,
  kind: 'lookup',
  tips: [
    '英式与美式音标数量不同，这里按英式（RP）的 44 个音素整理，美音少一个 /ɒ/、多一个 /ɜr/。',
    '音标只是近似，同一个字母在不同单词里读音不同，别拿音标去反推拼写。',
  ],
})
