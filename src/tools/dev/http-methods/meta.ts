import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'http-methods',
  title: 'HTTP 方法速查',
  summary: '九个方法的幂等性与语义',
  category: 'dev',
  subcategory: '参考',
  keywords: ['http', '请求方法', 'get', 'post', 'put', 'patch', '幂等', 'rest'],
  order: 67,
  kind: 'lookup',
  tips: [
    '幂等说的是「重复请求结果一样」，不是「没有副作用」；DELETE 有副作用但幂等。',
    'PUT 是整体替换，PATCH 是局部修改，表单提交习惯用 POST 不代表必须用 POST。',
  ],
})
