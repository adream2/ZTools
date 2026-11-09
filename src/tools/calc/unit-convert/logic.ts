export interface Unit {
  id: string
  label: string
  /** 相对基准单位的倍数 */
  factor: number
}

export interface UnitCategory {
  id: string
  label: string
  base: string
  units: Unit[]
  /** 温度等非线性换算走自定义函数 */
  special?: boolean
}

export const CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    label: '长度',
    base: 'm',
    units: [
      { id: 'mm', label: '毫米 mm', factor: 0.001 },
      { id: 'cm', label: '厘米 cm', factor: 0.01 },
      { id: 'm', label: '米 m', factor: 1 },
      { id: 'km', label: '千米 km', factor: 1000 },
      { id: 'in', label: '英寸 in', factor: 0.0254 },
      { id: 'ft', label: '英尺 ft', factor: 0.3048 },
      { id: 'yd', label: '码 yd', factor: 0.9144 },
      { id: 'mi', label: '英里 mi', factor: 1609.344 },
      { id: 'nmi', label: '海里 nmi', factor: 1852 },
      { id: 'li', label: '里', factor: 500 },
      { id: 'chi', label: '尺', factor: 1 / 3 },
    ],
  },
  {
    id: 'weight',
    label: '重量',
    base: 'kg',
    units: [
      { id: 'mg', label: '毫克 mg', factor: 1e-6 },
      { id: 'g', label: '克 g', factor: 0.001 },
      { id: 'kg', label: '千克 kg', factor: 1 },
      { id: 't', label: '吨 t', factor: 1000 },
      { id: 'jin', label: '斤', factor: 0.5 },
      { id: 'liang', label: '两', factor: 0.05 },
      { id: 'oz', label: '盎司 oz', factor: 0.028349523125 },
      { id: 'lb', label: '磅 lb', factor: 0.45359237 },
      { id: 'stone', label: '英石 st', factor: 6.35029318 },
    ],
  },
  {
    id: 'temperature',
    label: '温度',
    base: 'c',
    special: true,
    units: [
      { id: 'c', label: '摄氏度 °C', factor: 1 },
      { id: 'f', label: '华氏度 °F', factor: 1 },
      { id: 'k', label: '开尔文 K', factor: 1 },
    ],
  },
  {
    id: 'area',
    label: '面积',
    base: 'm2',
    units: [
      { id: 'mm2', label: '平方毫米 mm²', factor: 1e-6 },
      { id: 'cm2', label: '平方厘米 cm²', factor: 1e-4 },
      { id: 'm2', label: '平方米 m²', factor: 1 },
      { id: 'km2', label: '平方千米 km²', factor: 1e6 },
      { id: 'ha', label: '公顷 ha', factor: 10000 },
      { id: 'mu', label: '亩', factor: 666.6666667 },
      { id: 'ft2', label: '平方英尺 ft²', factor: 0.09290304 },
      { id: 'yd2', label: '平方码 yd²', factor: 0.83612736 },
      { id: 'acre', label: '英亩 acre', factor: 4046.8564224 },
    ],
  },
  {
    id: 'volume',
    label: '体积',
    base: 'l',
    units: [
      { id: 'ml', label: '毫升 ml', factor: 0.001 },
      { id: 'l', label: '升 L', factor: 1 },
      { id: 'm3', label: '立方米 m³', factor: 1000 },
      { id: 'cm3', label: '立方厘米 cm³', factor: 0.001 },
      { id: 'gal', label: '美制加仑 gal', factor: 3.785411784 },
      { id: 'qt', label: '美制夸脱 qt', factor: 0.946352946 },
      { id: 'pt', label: '美制品脱 pt', factor: 0.473176473 },
      { id: 'cup', label: '美制杯 cup', factor: 0.2365882365 },
      { id: 'floz', label: '美制液盎司 fl oz', factor: 0.0295735295625 },
    ],
  },
  {
    id: 'speed',
    label: '速度',
    base: 'ms',
    units: [
      { id: 'ms', label: '米/秒 m/s', factor: 1 },
      { id: 'kmh', label: '千米/时 km/h', factor: 1 / 3.6 },
      { id: 'mph', label: '英里/时 mph', factor: 0.44704 },
      { id: 'kn', label: '节 kn', factor: 0.514444 },
    ],
  },
  {
    id: 'data',
    label: '数据存储',
    base: 'mb',
    units: [
      { id: 'bit', label: '比特 bit', factor: 1 / 8 / 1024 / 1024 },
      { id: 'b', label: '字节 B', factor: 1 / 1024 / 1024 },
      { id: 'kb', label: '千字节 KB', factor: 1 / 1024 },
      { id: 'mb', label: '兆字节 MB', factor: 1 },
      { id: 'gb', label: '吉字节 GB', factor: 1024 },
      { id: 'tb', label: '太字节 TB', factor: 1024 * 1024 },
      { id: 'pb', label: '拍字节 PB', factor: 1024 * 1024 * 1024 },
    ],
  },
  {
    id: 'time',
    label: '时间',
    base: 's',
    units: [
      { id: 'ms', label: '毫秒 ms', factor: 0.001 },
      { id: 's', label: '秒 s', factor: 1 },
      { id: 'min', label: '分钟 min', factor: 60 },
      { id: 'h', label: '小时 h', factor: 3600 },
      { id: 'd', label: '天 d', factor: 86400 },
      { id: 'wk', label: '周 wk', factor: 604800 },
      { id: 'mo', label: '月（30 天）', factor: 2592000 },
      { id: 'yr', label: '年（365 天）', factor: 31536000 },
    ],
  },
]

function temperatureTo(value: number, from: string, to: string): number {
  const celsius = from === 'c' ? value : from === 'f' ? ((value - 32) * 5) / 9 : value - 273.15
  if (to === 'c') return celsius
  if (to === 'f') return (celsius * 9) / 5 + 32
  return celsius + 273.15
}

export function convert(value: number, from: string, to: string, categoryId: string): number {
  const category = CATEGORIES.find((c) => c.id === categoryId)
  if (!category) throw new Error('未知单位类别')

  if (category.special) return temperatureTo(value, from, to)

  const fromUnit = category.units.find((u) => u.id === from)
  const toUnit = category.units.find((u) => u.id === to)
  if (!fromUnit || !toUnit) throw new Error('未知单位')

  return (value * fromUnit.factor) / toUnit.factor
}

/** 以最大 8 位有效数字展示，避免浮点尾数 */
export function pretty(n: number): string {
  if (!Number.isFinite(n)) return '—'
  if (n === 0) return '0'
  const abs = Math.abs(n)
  if (abs >= 1e15 || abs < 1e-6) return n.toExponential(6).replace(/\.?0+e/, 'e')
  return String(Number(n.toPrecision(10)))
}

export function allConversions(value: number, from: string, categoryId: string): { unit: Unit; value: string }[] {
  const category = CATEGORIES.find((c) => c.id === categoryId)
  if (!category) return []
  return category.units.map((unit) => ({
    unit,
    value: pretty(convert(value, from, unit.id, categoryId)),
  }))
}
