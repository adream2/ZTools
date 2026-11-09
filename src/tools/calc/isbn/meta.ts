import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'isbn',
  title: 'ISBN 校验',
  summary: '书号校验与 10 / 13 位互转',
  category: 'calc',
  subcategory: '生活',
  keywords: ['isbn', '书号', '校验', '图书', '出版', 'isbn10', 'isbn13'],
  order: 19,
  kind: 'calc',
})
