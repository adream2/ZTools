import type { LookupLogic } from '@/components/templates/types'

/** 命令|说明|场景 */
const RAW = `
git init|初始化仓库|新项目
git clone <url>|克隆远程仓库|拿到别人的项目
git status|查看工作区与暂存区状态|动手前先看一眼
git add -p|分块暂存|只想提交部分改动
git add .|暂存全部改动|小步提交时慎用
git commit -m "msg"|提交暂存区|日常
git commit --amend|修改最后一次提交|漏文件或写错信息，未推送时用
git log --oneline --graph|图形化提交历史|看分支结构
git log -p <file>|查看某文件的改动历史|定位问题引入点
git diff|工作区与暂存区差异|提交前自查
git diff --staged|暂存区与上次提交差异|确认要提交什么
git restore <file>|撤销工作区改动|改坏了想回退
git restore --staged <file>|取消暂存|add 多了
git reset --soft HEAD~1|撤销提交但保留改动|提交信息写错、想重新拆
git reset --hard HEAD~1|丢弃提交与改动|危险，未推送才考虑
git revert <sha>|生成反向提交|撤销已推送的提交
git stash|暂存未提交改动|临时切分支
git stash pop|恢复暂存的改动|切回来继续
git branch -a|列出所有分支|确认远程分支
git switch -c <name>|新建并切换分支|开功能分支
git switch <name>|切换分支|日常
git merge <branch>|合并分支|保留分支历史
git rebase main|把当前分支变基到 main|整理线性历史，已推送的分支别做
git rebase -i HEAD~3|交互式整理最近三次提交|合并 / 改信息 / 排序
git cherry-pick <sha>|挑单个提交到当前分支|热修复回合并
git remote -v|查看远程地址|确认推送到哪
git fetch --prune|拉取并清理失效远程分支|分支列表越来越乱时
git pull --rebase|拉取并变基|保持线性历史
git push -u origin <branch>|首次推送并建立跟踪|新分支
git push --force-with-lease|安全强推|改写过历史后，比 --force 安全
git tag -a v1.0 -m "msg"|打附注标签|发版
git blame <file>|逐行看最后修改者|追溯问题来源
git bisect start|二分定位坏提交|不知道哪次引入的 bug
git reflog|查看 HEAD 移动记录|误 reset 后的救命命令
git clean -nd|预览要删的未跟踪文件|清理前先看
git clean -fd|删除未跟踪文件|危险，不可恢复
git worktree add ../dir branch|多工作区并行|同时开两个分支干活
git submodule update --init|初始化子模块|拉取带 submodule 的仓库
git config --global alias.st status|配置别名|提高手速
git rm --cached <file>|停止跟踪但保留文件|误提交了大文件
git commit --fixup <sha>|生成待压缩提交|配合 rebase --autosquash
`

const logic: LookupLogic = {
  DATASET: RAW.trim()
    .split('\n')
    .map((line) => {
      const [command, desc, scene] = line.split('|')
      return {
        key: command!.trim(),
        title: command!.trim(),
        desc: desc!.trim(),
        tags: [scene!.trim()],
        rows: [
          { label: '命令', value: command!.trim() },
          { label: '作用', value: desc!.trim() },
          { label: '场景', value: scene!.trim() },
        ],
      }
    }),
  placeholder: '搜索 撤销、rebase、stash',
  note: '命令以 Git 2.23+ 为准，switch / restore 替代了部分 checkout 用法',
}

export default logic
