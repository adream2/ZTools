import type { LookupLogic } from '@/components/templates/types'

/** 名称|公式|说明|单位 */
const RAW = `
速度|v = s / t|匀速直线运动|m/s
平均速度|v̄ = 总位移 / 总时间|不看中途快慢|m/s
加速度|a = (v − v₀) / t|速度变化率|m/s²
匀变速位移|s = v₀t + ½at²|初速度 v₀ 已知|m
速度位移关系|v² − v₀² = 2as|不含时间的场合|m²/s²
牛顿第二定律|F = ma|合力与加速度同向|N
重力|G = mg|g 取 9.8 或 10|N
摩擦力|f = μN|滑动摩擦，μ 为摩擦因数|N
功|W = Fs·cosθ|力与位移有夹角时|J
功率|P = W / t = Fv|瞬时或平均|W
动能|Eₖ = ½mv²|与速度平方成正比|J
重力势能|Eₚ = mgh|以参考面为零点|J
机械能守恒|Eₖ₁ + Eₚ₁ = Eₖ₂ + Eₚ₂|只有重力做功时成立|J
动量|p = mv|矢量，有方向|kg·m/s
动量定理|Ft = Δp|冲量等于动量变化|N·s
密度|ρ = m / V|物质属性|kg/m³
压强|p = F / S|固体压强|Pa
液体压强|p = ρgh|只与深度有关|Pa
浮力|F = ρ液gV排|阿基米德原理|N
胡克定律|F = kx|弹性限度内|x 为形变量
热量的吸收|Q = cmΔt|c 为比热容|J
热值|Q = mq|q 为燃料热值|J
欧姆定律|I = U / R|纯电阻电路|A
电功率|P = UI = I²R = U²/R|直流与纯电阻|W
电能|W = UIt|一度电 = 3.6×10⁶ J|J
电阻串联|R = R₁ + R₂|电流相同|Ω
电阻并联|1/R = 1/R₁ + 1/R₂|电压相同|Ω
焦耳定律|Q = I²Rt|电流的热效应|J
波速|v = λf|波速 = 波长 × 频率|m/s
光的折射|n = sin i / sin r|n 为折射率，无单位|—
凸透镜成像|1/f = 1/u + 1/v|u 物距、v 像距|m
`

const logic: LookupLogic = {
  DATASET: RAW.trim()
    .split('\n')
    .map((line) => {
      const [name, formula, note, unit] = line.split('|')
      return {
        key: name!.trim(),
        title: name!.trim(),
        desc: formula!.trim(),
        tags: [unit!.trim() === '—' ? '无单位' : unit!.trim()],
        rows: [
          { label: '公式', value: formula!.trim() },
          { label: '说明', value: note!.trim() },
          { label: '结果单位', value: unit!.trim() },
        ],
      }
    }),
  placeholder: '搜索 速度、功率、欧姆、浮力',
  note: '公式按中学物理范围整理，代入前先统一单位',
}

export default logic
