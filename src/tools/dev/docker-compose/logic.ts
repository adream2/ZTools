import type { TextOpLogic } from '@/components/templates/types'

const OPS = [
  { id: 'convert', label: '生成 compose', group: '转换' },
]

interface RunConfig {
  image: string
  name: string
  ports: string[]
  volumes: string[]
  env: string[]
  restart: string
  network: string
  command: string
  detach: boolean
}

function tokenize(cmd: string): string[] {
  const src = cmd.replace(/\\\r?\n/g, ' ').trim()
  const tokens: string[] = []
  let i = 0
  while (i < src.length) {
    if (/\s/.test(src[i]!)) {
      i++
      continue
    }
    if (src[i] === '"' || src[i] === "'") {
      const quote = src[i]
      let j = i + 1
      let buf = ''
      while (j < src.length && src[j] !== quote) {
        buf += src[j]
        j++
      }
      tokens.push(buf)
      i = j + 1
      continue
    }
    let j = i
    while (j < src.length && !/\s/.test(src[j]!)) j++
    tokens.push(src.slice(i, j))
    i = j
  }
  return tokens
}

export function parseDockerRun(cmd: string): RunConfig {
  const tokens = tokenize(cmd)
  const cfg: RunConfig = { image: '', name: '', ports: [], volumes: [], env: [], restart: '', network: '', command: '', detach: false }
  const positional: string[] = []

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!
    if (t === 'docker' || t === 'run' || t === 'container') continue
    if (t === '-d' || t === '--detach') {
      cfg.detach = true
      continue
    }
    if (t === '-p' || t === '--publish') {
      cfg.ports.push(tokens[++i] ?? '')
      continue
    }
    if (t === '-v' || t === '--volume') {
      cfg.volumes.push(tokens[++i] ?? '')
      continue
    }
    if (t === '-e' || t === '--env') {
      cfg.env.push(tokens[++i] ?? '')
      continue
    }
    if (t === '--name') {
      cfg.name = tokens[++i] ?? ''
      continue
    }
    if (t === '--restart') {
      cfg.restart = tokens[++i] ?? ''
      continue
    }
    if (t === '--network') {
      cfg.network = tokens[++i] ?? ''
      continue
    }
    if (t === '--rm' || t === '-it' || t === '-i' || t === '-t' || t === '--interactive' || t === '--tty') continue
    if (t.startsWith('-')) continue
    positional.push(t)
  }

  cfg.image = positional[0] ?? ''
  cfg.command = positional.slice(1).join(' ')
  if (!cfg.image) throw new Error('没找到镜像名')
  return cfg
}

function serviceName(cfg: RunConfig): string {
  if (cfg.name) return cfg.name.replace(/[^a-zA-Z0-9_.-]/g, '-')
  return cfg.image.split('/').pop()?.split(':')[0]?.replace(/[^a-zA-Z0-9_.-]/g, '-') || 'app'
}

function toCompose(cfg: RunConfig): string {
  const name = serviceName(cfg)
  const lines: string[] = ['services:', `  ${name}:`, `    image: ${cfg.image}`]
  if (cfg.name) lines.push(`    container_name: ${cfg.name}`)

  if (cfg.ports.length) {
    lines.push('    ports:')
    for (const p of cfg.ports) lines.push(`      - "${p}"`)
  }
  if (cfg.volumes.length) {
    lines.push('    volumes:')
    for (const v of cfg.volumes) lines.push(`      - "${v}"`)
  }
  if (cfg.env.length) {
    lines.push('    environment:')
    for (const e of cfg.env) {
      const idx = e.indexOf('=')
      if (idx > 0) lines.push(`      ${e.slice(0, idx)}: "${e.slice(idx + 1)}"`)
      else lines.push(`      - ${e}`)
    }
  }
  if (cfg.command) lines.push(`    command: ${JSON.stringify(cfg.command)}`)
  if (cfg.restart) lines.push(`    restart: ${cfg.restart}`)
  if (cfg.network) {
    lines.push('    networks:')
    lines.push(`      - ${cfg.network}`)
  }
  lines.push('    # 可选：健康检查、资源限制、日志驱动')
  lines.push('    logging:')
  lines.push('      driver: json-file')
  lines.push('      options:')
  lines.push('        max-size: "10m"')

  if (cfg.network) {
    lines.push('')
    lines.push('networks:')
    lines.push(`  ${cfg.network}:`)
    lines.push('    external: true')
  }

  return lines.join('\n')
}

function apply(text: string, _op: string): string {
  const cfg = parseDockerRun(text)
  return `# 由 docker run 转换，命名与默认值请按需调整\n${toCompose(cfg)}`
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: 'docker run -d --name web -p 8080:80 -v /data/html:/usr/share/nginx/html:ro -e TZ=Asia/Shanghai --restart always nginx:alpine',
  note: '支持 -p / -v / -e / --name / --restart / --network；不认识的参数会被忽略',
  inputLabel: 'docker run 命令',
  outputLabel: 'compose.yaml',
  noChain: true,
}

export default logic
