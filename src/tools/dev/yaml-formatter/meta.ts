import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'yaml-formatter',
  title: 'YAML 转换',
  summary: 'YAML 与 JSON 互转，校验语法',
  category: 'dev',
  keywords: ['yaml', 'yml', 'json', '转换', 'convert', '格式化', 'k8s', '配置文件'],
  order: 11,
})
