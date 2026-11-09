import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'json-formatter',
  title: 'JSON 格式化',
  summary: '格式化、压缩、校验、排序键名，大文件交给独立线程',
  category: 'dev',
  keywords: ['json', '格式化', '美化', 'beautify', 'format', '压缩', 'minify', '校验', 'validate', '排序', 'sort', '转义'],
  order: 1,
  tips: [
    '超过 2MB 的 JSON 浏览器解析会明显卡顿，建议先拆成子对象再处理；超过 20MB 工具会直接拒绝。',
    '「键名排序」会递归重排所有层级，适合比对两份配置的差异；日常格式化不用开。',
    '报错里的 position 是字符偏移，不是行号，工具已经把它换算成了行列和上下文。',
  ],
})
