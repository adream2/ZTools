import type { LookupLogic, LookupItem } from '@/components/templates/types'

const SIZES: [string, number, number][] = [
  ['A0', 841, 1189],
  ['A1', 594, 841],
  ['A2', 420, 594],
  ['A3', 297, 420],
  ['A4', 210, 297],
  ['A5', 148, 210],
  ['A6', 105, 148],
  ['A7', 74, 105],
  ['A8', 52, 74],
  ['B0', 1000, 1414],
  ['B1', 707, 1000],
  ['B2', 500, 707],
  ['B3', 353, 500],
  ['B4', 250, 353],
  ['B5', 176, 250],
  ['B6', 125, 176],
  ['C4', 229, 324],
  ['C5', 162, 229],
  ['C6', 114, 162],
]

const DATASET: LookupItem[] = SIZES.map(([name, w, h]) => ({
  key: name,
  title: `${name} · ${w} × ${h} mm`,
  desc: `${(w / 10).toFixed(1)} × ${(h / 10).toFixed(1)} cm，比例 ${(h / w).toFixed(3)}`,
  tags: [name.startsWith('A') ? 'A 系列' : name.startsWith('B') ? 'B 系列' : 'C 系列'],
  rows: [
    { label: '尺寸', value: `${w} × ${h} mm` },
    { label: '厘米', value: `${(w / 10).toFixed(1)} × ${(h / 10).toFixed(1)} cm` },
    { label: '英寸', value: `${(w / 25.4).toFixed(1)} × ${(h / 25.4).toFixed(1)} in` },
    { label: '面积', value: `${((w * h) / 100).toFixed(1)} cm²` },
    { label: '长宽比', value: (h / w).toFixed(4) },
  ],
}))

const logic: LookupLogic = {
  DATASET,
  placeholder: '搜索 a4、b5、打印…',
  note: 'ISO 216 标准，长宽比均为 1:√2，对折后仍是同系列',
}

export default logic
