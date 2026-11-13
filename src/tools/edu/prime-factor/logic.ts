import type { CalcLogic, CalcResult } from '@/components/templates/types'

const FIELDS = [{ key: 'n', label: '正整数', type: 'number' as const, default: 360, min: 2, max: 1000000000 }]

function factorize(n: number): Array<[number, number]> {
  const out: Array<[number, number]> = []
  let rest = n
  for (let p = 2; p * p <= rest; p += p === 2 ? 1 : 2) {
    if (rest % p !== 0) continue
    let e = 0
    while (rest % p === 0) {
      rest /= p
      e += 1
    }
    out.push([p, e])
  }
  if (rest > 1) out.push([rest, 1])
  return out
}

function compute(values: Record<string, string | number>): CalcResult[] {
  const n = Math.round(Number(values.n))
  if (!Number.isFinite(n) || n < 2) return [{ label: '结果', value: '请输入 2 以上的整数', emphasis: true }]
  if (n > 1e9) return [{ label: '结果', value: '为了不卡浏览器，上限 10 亿', emphasis: true }]

  const factors = factorize(n)
  const expression = factors.map(([p, e]) => (e === 1 ? `${p}` : `${p}^${e}`)).join(' × ')

  const divisorCount = factors.reduce((acc, [, e]) => acc * (e + 1), 1)
  const divisorSum = factors.reduce((acc, [p, e]) => acc * ((p ** (e + 1) - 1) / (p - 1)), 1)
  const isPrime = factors.length === 1 && factors[0]![1] === 1

  return [
    { label: '质因数分解', value: `${n} = ${expression}`, emphasis: true, hint: isPrime ? '本身是质数' : `${factors.length} 种质因数` },
    { label: '约数个数', value: String(divisorCount), hint: factors.map(([, e]) => e + 1).join(' × ') },
    { label: '约数之和', value: String(Math.round(divisorSum)) },
    { label: '平方根', value: Math.sqrt(n).toFixed(6).replace(/0+$/, '').replace(/\.$/, '') },
    { label: '奇偶性', value: n % 2 === 0 ? '偶数' : '奇数', hint: n % 2 === 0 ? '含质因数 2' : '不含质因数 2' },
  ]
}

const logic: CalcLogic = {
  FIELDS,
  compute,
  note: '1 既不是质数也不是合数，不参与分解',
}

export default logic
