import { defineTool } from '@/core/defineTool'

export default defineTool({
  id: 'git-cheatsheet',
  title: 'Git 命令速查',
  summary: '常用命令、撤销与分支操作',
  category: 'dev',
  subcategory: '参考',
  keywords: ['git', '命令', '速查', '撤销', 'rebase', 'reset', '分支', '冲突'],
  order: 69,
  kind: 'lookup',
  tips: [
    'reset --hard 会直接丢掉未提交的改动，且不进 reflog 的只有工作区内容；执行前先 git stash 更稳。',
    'revert 生成一个新提交来抵消旧提交，已经推送过的历史用 revert，别用 reset 强推。',
  ],
})
