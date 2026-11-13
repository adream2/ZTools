import type { LookupLogic } from '@/components/templates/types'

/** 原形|过去式|过去分词|释义 */
const RAW = `
be|was/were|been|是
bear|bore|borne|承受 / 生育
beat|beat|beaten|打
become|became|become|变成
begin|began|begun|开始
bend|bent|bent|弯曲
bet|bet|bet|打赌
bind|bound|bound|捆绑
bite|bit|bitten|咬
bleed|bled|bled|流血
blow|blew|blown|吹
break|broke|broken|打破
breed|bred|bred|繁殖
bring|brought|brought|带来
build|built|built|建造
burn|burnt/burned|burnt/burned|燃烧
buy|bought|bought|买
catch|caught|caught|抓住
choose|chose|chosen|选择
come|came|come|来
cost|cost|cost|花费
cut|cut|cut|切
deal|dealt|dealt|处理
dig|dug|dug|挖
do|did|done|做
draw|drew|drawn|画
dream|dreamt/dreamed|dreamt/dreamed|做梦
drink|drank|drunk|喝
drive|drove|driven|驾驶
eat|ate|eaten|吃
fall|fell|fallen|落下
feed|fed|fed|喂养
feel|felt|felt|感觉
fight|fought|fought|打斗
find|found|found|找到
fly|flew|flown|飞
forget|forgot|forgotten|忘记
forgive|forgave|forgiven|原谅
freeze|froze|frozen|结冰
get|got|got/gotten|得到
give|gave|given|给
go|went|gone|去
grow|grew|grown|生长
hang|hung|hung|悬挂
have|had|had|有
hear|heard|heard|听见
hide|hid|hidden|藏
hit|hit|hit|打中
hold|held|held|握住
hurt|hurt|hurt|受伤
keep|kept|kept|保持
know|knew|known|知道
lay|laid|laid|放置
lead|led|led|领导
leave|left|left|离开
lend|lent|lent|借出
let|let|let|让
lie|lay|lain|躺
light|lit/lighted|lit/lighted|点燃
lose|lost|lost|丢失
make|made|made|制作
mean|meant|meant|意味
meet|met|met|遇见
pay|paid|paid|付款
put|put|put|放
read|read|read|读
ride|rode|ridden|骑
ring|rang|rung|响铃
rise|rose|risen|上升
run|ran|run|跑
say|said|said|说
see|saw|seen|看见
sell|sold|sold|卖
send|sent|sent|发送
set|set|set|设置
shake|shook|shaken|摇
shine|shone|shone|发光
shoot|shot|shot|射击
show|showed|shown|展示
shut|shut|shut|关闭
sing|sang|sung|唱歌
sink|sank|sunk|下沉
sit|sat|sat|坐
sleep|slept|slept|睡觉
speak|spoke|spoken|说
spend|spent|spent|花费
stand|stood|stood|站
steal|stole|stolen|偷
swim|swam|swum|游泳
take|took|taken|拿
teach|taught|taught|教
tell|told|told|告诉
think|thought|thought|想
throw|threw|thrown|扔
understand|understood|understood|理解
wake|woke|woken|醒来
wear|wore|worn|穿
win|won|won|赢
write|wrote|written|写
`

const logic: LookupLogic = {
  DATASET: RAW.trim()
    .split('\n')
    .map((line) => {
      const [base, past, pp, meaning] = line.split('|')
      return {
        key: base!.trim(),
        title: base!.trim(),
        desc: `${past!.trim()} · ${pp!.trim()}`,
        tags: [meaning!.trim()],
        rows: [
          { label: '原形', value: base!.trim() },
          { label: '过去式', value: past!.trim() },
          { label: '过去分词', value: pp!.trim() },
          { label: '释义', value: meaning!.trim() },
        ],
      }
    }),
  placeholder: '搜索 break、过去式、解释',
  note: '共 95 个高频不规则动词，含英美两种过去式写法',
}

export default logic
