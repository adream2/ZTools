import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'toml-to-json',
  title: 'TOML 转 JSON',
  summary: 'Cargo / pyproject 配置一键转 JSON',
  category: 'dev',
  subcategory: '转换',
  keywords: ['toml', 'json', '转换', 'cargo', 'pyproject', '配置文件', '配置'],
  order: 60,
  kind: 'text-op',
  tips: [
    '支持常用子集：表 [a.b]、键值、字符串、数字、布尔、数组；不支持内联表 {…}、多行字符串 """…""" 与 [[数组表]]。',
    '遇到不支持的语法会报出行号，而不是悄悄丢掉那一段配置。',
  ],
})
