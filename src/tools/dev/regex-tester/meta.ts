import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'regex-tester',
  title: '正则测试',
  summary: '实时匹配高亮、分组查看，超时自动中断',
  category: 'dev',
  keywords: ['regex', 'regexp', '正则', '表达式', '匹配', 'match', 'test', 'replace', '分组'],
  order: 8,
  tips: [
    '嵌套量词如 (a+)+$ 会触发灾难性回溯，工具设了 3 秒强制超时，超时会终止计算而不是卡死页面。',
    '全局匹配时零宽匹配（如 a*）会原地循环，工具内部已做 lastIndex 前移处理。',
    '写正则前先限制输入长度，用户能控制的数据没有上限就是隐患。',
  ],
})
