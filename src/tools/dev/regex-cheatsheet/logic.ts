import type { LookupLogic } from '@/components/templates/types'

interface Row {
  name: string
  pattern: string
  desc: string
  example: string
  tag: string
}

const ROWS: Row[] = [
  { name: '邮箱', pattern: '^[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+$', desc: '只做基本结构校验', example: 'me@example.com', tag: '表单' },
  { name: '中国大陆手机号', pattern: '^1[3-9]\\d{9}$', desc: '11 位，1 开头，第二位 3–9', example: '13800138000', tag: '表单' },
  { name: '中国大陆身份证（18 位）', pattern: '^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$', desc: '只校验结构，末位需另算校验码', example: '11010519491231002X', tag: '表单' },
  { name: 'URL', pattern: '^https?://[\\w.-]+(:\\d+)?(/[^\\s]*)?$', desc: 'http/https 基本形态', example: 'https://example.com/a?b=1', tag: '表单' },
  { name: 'IPv4', pattern: '^((25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)$', desc: '0–255 每段', example: '192.168.1.1', tag: '网络' },
  { name: 'IPv6（简版）', pattern: '^([\\da-fA-F]{1,4}:){7}[\\da-fA-F]{1,4}$', desc: '不含 :: 压缩写法', example: '2001:db8:0:0:0:0:0:1', tag: '网络' },
  { name: '域名', pattern: '^([a-z0-9-]+\\.)+[a-z]{2,}$', desc: '小写域名，不含协议', example: 'www.example.com', tag: '网络' },
  { name: '端口号', pattern: '^([1-9]\\d{0,3}|[1-5]\\d{4}|6[0-4]\\d{3}|65[0-4]\\d{2}|655[0-2]\\d|6553[0-5])$', desc: '1–65535', example: '8080', tag: '网络' },
  { name: 'MAC 地址', pattern: '^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$', desc: '冒号或横杠分隔', example: '00:1A:2B:3C:4D:5E', tag: '网络' },
  { name: '日期 YYYY-MM-DD', pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', desc: '不判断大小月与闰年', example: '2026-11-13', tag: '日期' },
  { name: '时间 HH:MM', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$', desc: '24 小时制', example: '23:59', tag: '日期' },
  { name: '日期时间', pattern: '^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}(:\\d{2})?$', desc: '秒可选', example: '2026-11-13 09:30', tag: '日期' },
  { name: '中文汉字', pattern: '^[\\u4e00-\\u9fa5]+$', desc: '基本区汉字，不含生僻字', example: '张三丰', tag: '文本' },
  { name: '中文姓名', pattern: '^[\\u4e00-\\u9fa5]{2,6}(·[\\u4e00-\\u9fa5]{2,6})?$', desc: '含少数民族译名', example: '阿依古丽·买买提', tag: '表单' },
  { name: '英文姓名', pattern: '^[A-Z][a-z]+( [A-Z][a-z]+)*$', desc: '首字母大写', example: 'John Smith', tag: '表单' },
  { name: '用户名（字母数字下划线）', pattern: '^[a-zA-Z][a-zA-Z0-9_]{2,15}$', desc: '3–16 位，字母开头', example: 'zt_user01', tag: '表单' },
  { name: '强密码', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,}$', desc: '大小写+数字+符号，至少 8 位', example: 'Zt@2026pass', tag: '安全' },
  { name: '十六进制颜色', pattern: '^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$', desc: '3 位或 6 位', example: '#2f6bff', tag: '前端' },
  { name: 'HTML 标签', pattern: '</?[a-zA-Z][^>]*>', desc: '匹配开闭标签', example: '<div class="a">', tag: '前端' },
  { name: '价格（两位小数）', pattern: '^\\d+(\\.\\d{1,2})?$', desc: '最多两位小数', example: '19.90', tag: '表单' },
  { name: '正整数', pattern: '^[1-9]\\d*$', desc: '不含 0 与负数', example: '1024', tag: '数字' },
  { name: '整数（含负）', pattern: '^-?\\d+$', desc: '可带负号', example: '-42', tag: '数字' },
  { name: '浮点数', pattern: '^-?\\d+(\\.\\d+)?$', desc: '不含科学计数法', example: '3.14', tag: '数字' },
  { name: '千分位数字', pattern: '^\\d{1,3}(,\\d{3})*(\\.\\d+)?$', desc: '1,234,567.89', example: '1,234,567.89', tag: '数字' },
  { name: '车牌号（含新能源）', pattern: '^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$', desc: '蓝牌 7 位、绿牌 8 位', example: '京A12345', tag: '表单' },
  { name: '邮政编码', pattern: '^[1-9]\\d{5}$', desc: '6 位，非 0 开头', example: '100000', tag: '表单' },
  { name: 'QQ 号', pattern: '^[1-9]\\d{4,11}$', desc: '5–12 位', example: '10001', tag: '表单' },
  { name: '微信号', pattern: '^[a-zA-Z][-_a-zA-Z0-9]{5,19}$', desc: '6–20 位，字母开头', example: 'zt_tools01', tag: '表单' },
  { name: 'JSON 键值对', pattern: '"(\\w+)":\\s*"([^"]*)"', desc: '提取简单的字符串字段', example: '"name": "zt"', tag: '文本' },
  { name: 'Markdown 链接', pattern: '\\[([^\\]]+)\\]\\(([^)]+)\\)', desc: '取标题与地址', example: '[官网](https://a.com)', tag: '文本' },
  { name: '重复词', pattern: '\\b(\\w+)\\s+\\1\\b', desc: '查找连续重复的单词', example: 'the the', tag: '文本' },
  { name: '空白行', pattern: '^\\s*$', desc: '匹配空行，配合 multiline', example: '（空行）', tag: '文本' },
  { name: '行尾空格', pattern: '[ \\t]+$', desc: '清理行尾多余空格', example: 'abc␠␠', tag: '文本' },
  { name: '中国行政区划代码', pattern: '^[1-9]\\d{5}$', desc: '6 位，前两位为省级', example: '110105', tag: '表单' },
]

const logic: LookupLogic = {
  DATASET: ROWS.map((r) => ({
    key: r.name,
    title: r.name,
    desc: r.pattern,
    tags: [r.tag],
    rows: [
      { label: '正则', value: r.pattern },
      { label: '说明', value: r.desc },
      { label: '示例', value: r.example },
      { label: '类别', value: r.tag },
    ],
  })),
  placeholder: '搜索 邮箱、手机号、日期',
  note: '正则只做格式校验，业务规则（如身份证校验码）需要额外计算',
}

export default logic
