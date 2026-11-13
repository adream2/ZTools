export interface Topic {
  id: string
  title: string
  summary: string
  /** 2–3 段导语，段落之间用空行分隔 */
  intro: string
  /** 推荐顺序即使用顺序 */
  tools: string[]
  /** 相关指南 slug */
  guides?: string[]
  icon: string
  tone: string
}

export const TOPICS: Topic[] = [
  {
    id: 'image-workflow',
    title: '图片处理一条龙',
    summary: '从压缩、裁剪到九宫格与图标，一条链路走完',
    intro:
      '图片处理的顺序很关键：先裁剪构图，再缩放尺寸，最后压缩质量。顺序反了会重复损失细节，尤其是 JPEG 反复另存会让画面发糊。\n\n下面按「拍完到发布」的实际流程排列。所有处理都在浏览器里完成，图片不会上传到任何服务器。',
    tools: [
      'image-compress',
      'image-batch-compress',
      'image-crop',
      'image-resize',
      'image-format',
      'image-rotate',
      'image-watermark-batch',
      'image-nine-grid',
      'image-frame',
      'image-merge-long',
      'image-long-split',
      'image-circle',
      'image-rounded',
      'svg-to-png',
      'png-to-ico',
      'image-base64',
    ],
    icon: 'M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5',
    tone: 'var(--c-cat-content)',
  },
  {
    id: 'json-config',
    title: 'JSON 与配置文件',
    summary: '格式化、转换、取值、反推 Schema',
    intro:
      '日常处理配置和接口数据，绕不开这几步：先格式化看清楚结构，再转成目标格式，必要时用路径取值或反推一份 Schema。\n\n如果只想快速定位报错，直接看「JSON 格式化」；如果要把一份样例变成接口文档，用「JSON 转 Schema」再手工删掉可选字段。',
    tools: [
      'json-formatter',
      'json-to-ts',
      'json-flatten',
      'json-path',
      'json-schema',
      'json-to-csv',
      'json-escape',
      'yaml-formatter',
      'xml-formatter',
      'toml-to-json',
      'ini-json',
      'yaml-to-env',
      'csv-to-sql',
    ],
    icon: 'M9 4 4 12l5 8M15 4l5 8-5 8',
    tone: 'var(--c-cat-dev)',
  },
  {
    id: 'frontend-debug',
    title: '前端排查工具包',
    summary: '时间戳、哈希、正则、状态码，一次找齐',
    intro:
      '排查问题时最耗时的不是修，而是「确认现象」。这一组工具解决的就是确认：这个时间戳到底对应几点、这段密文是不是 SHA-256、这条正则为什么匹配不上、401 和 403 差在哪。\n\n全部本地计算，贴进去的日志和密钥不会离开浏览器。',
    tools: [
      'regex-tester',
      'timestamp',
      'timestamp-batch',
      'cron',
      'hash',
      'file-hash',
      'base64',
      'url-codec',
      'jwt',
      'text-diff',
      'http-status',
      'http-methods',
      'uuid',
    ],
    icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 8v4l3 2',
    tone: 'var(--c-cat-webmaster)',
  },
  {
    id: 'health-calc',
    title: '身体数据计算',
    summary: 'BMI、体脂、血压、血糖与热量',
    intro:
      '这些公式都只是估算，价值在于「趋势」而不是「绝对值」。同一个体脂秤早晚能差 3 个百分点，血压更是随情绪和姿势波动。\n\n建议固定时间、固定条件测量，把数字记下来看四周的变化。任何异常值都应该以医院的检查结果为准。',
    tools: [
      'bmi',
      'body-fat',
      'bmr',
      'blood-pressure',
      'blood-sugar',
      'water-intake',
      'alcohol-intake',
      'sleep-cycle',
      'child-height',
      'running-pace',
      'food-calorie',
    ],
    guides: ['body-fat-error-sources'],
    icon: 'M12 20.5S4 15.8 4 10.2A4.3 4.3 0 0 1 12 7.8a4.3 4.3 0 0 1 8 2.4c0 5.6-8 10.3-8 10.3z',
    tone: 'var(--c-cat-life)',
  },
  {
    id: 'student-tools',
    title: '中学理科工具',
    summary: '方程、配平、行列式、统计与数列',
    intro:
      '这一组覆盖中学数理化最常卡住的计算：解方程、配平化学方程式、算行列式、求统计量。它们不替你写过程，但结果和中间量都给全，适合对答案。\n\n考试时步骤仍然要自己写，这里更适合「做完之后验算」和「搞不懂某一步时反推」。',
    tools: [
      'quadratic',
      'cubic-equation',
      'linear-system',
      'sequence',
      'logarithm',
      'trig-table',
      'matrix-determinant',
      'chemical-balance',
      'molar-mass',
      'statistics',
      'binomial-distribution',
      'gcd-lcm',
      'prime-factor',
      'fraction-calc',
      'triangle-calc',
      'multiplication-table',
    ],
    guides: ['chemical-balance-method'],
    icon: 'M12 6.4C10 4.9 7.2 4.4 4 5v13c3.2-.6 6 0 8 1.6 2-1.6 4.8-2.2 8-1.6V5c-3.2-.6-6 0-8 1.4zM12 6.4V19',
    tone: 'var(--c-cat-edu)',
  },
  {
    id: 'geo-tools',
    title: '地图与坐标',
    summary: '三套坐标系互转、球面距离与方位角',
    intro:
      '国内做地图相关的事，坐标系是第一个坑：GPS 给 WGS84，高德腾讯要 GCJ02，百度还要再偏一次。混用的结果就是整条轨迹平移几百米。\n\n先用坐标转换把数据统一，再用距离工具算里程。两者都不联网，输入的经纬度不会被记录。',
    tools: ['coordinate-convert', 'geo-distance'],
    guides: ['coordinate-offset-explained'],
    icon: 'M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    tone: 'var(--c-cat-calc)',
  },
]

export function getTopic(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id)
}

/** 某个工具属于哪些专题，用于工具页的「同专题」推荐 */
export function topicsOfTool(toolId: string): Topic[] {
  return TOPICS.filter((t) => t.tools.includes(toolId))
}
