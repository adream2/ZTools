import type { GeneratorLogic } from '@/components/templates/types'

const RULES: Record<string, string[]> = {
  common: ['# 系统与编辑器', '.DS_Store', 'Thumbs.db', '.idea/', '.vscode/', '*.swp', '*.log'],
  node: ['# Node', 'node_modules/', 'dist/', 'build/', '.cache/', '.nuxt/', '.next/', 'coverage/', '*.tsbuildinfo'],
  python: ['# Python', '__pycache__/', '*.py[cod]', '.venv/', 'venv/', '*.egg-info/', '.mypy_cache/', '.pytest_cache/'],
  go: ['# Go', 'bin/', '*.exe', '*.test', '*.out'],
  java: ['# Java', 'target/', '*.class', '*.jar', '.gradle/'],
  env: ['# 环境变量', '.env', '.env.local', '.env.*.local', '!.env.example'],
  vite: ['# Vite', 'dist/', '.vite/', '*.local'],
  mac: ['# macOS', '.AppleDouble', '.LSOverride', 'Icon?'],
}

const FIELDS = [
  {
    key: 'stack',
    label: '主技术栈',
    type: 'select' as const,
    default: 'node',
    options: [
      { label: 'Node / 前端', value: 'node' },
      { label: 'Python', value: 'python' },
      { label: 'Go', value: 'go' },
      { label: 'Java', value: 'java' },
      { label: '纯静态', value: 'common' },
    ],
  },
  { key: 'env', label: '忽略 .env', type: 'switch' as const, default: true },
  { key: 'vite', label: '含 Vite 产物', type: 'switch' as const, default: true },
  { key: 'mac', label: '含 macOS 文件', type: 'switch' as const, default: true },
]

function generate(values: Record<string, string | number | boolean>): string {
  const stack = String(values.stack)
  const blocks: string[] = [RULES.common!.join('\n')]
  if (RULES[stack]) blocks.push(RULES[stack]!.join('\n'))
  if (values.env) blocks.push(RULES.env!.join('\n'))
  if (values.vite) blocks.push(RULES.vite!.join('\n'))
  if (values.mac) blocks.push(RULES.mac!.join('\n'))
  return blocks.join('\n\n')
}

const logic: GeneratorLogic = {
  FIELDS,
  generate,
  note: '生成后按项目实际情况删减，别把需要提交的文件也忽略掉',
  resultLabel: '.gitignore',
}

export default logic
