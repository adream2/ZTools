import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'text-to-speech',
  title: '文字转语音',
  summary: '用系统语音朗读，不上传文本',
  category: 'content',
  subcategory: '文本',
  keywords: ['语音', '朗读', 'tts', '文字转语音', '配音', '发音', '播报'],
  order: 28,
  tips: [
    '用的是系统自带语音包，文本不出浏览器；语音包里没有中文时，只能读出字母。',
    '语速 1.0 是正常，1.3 以上适合听资料，0.8 适合跟读练发音。',
    '手机上离开页面前要手动点停止，否则有些浏览器会继续朗读。',
  ],
})
