import type { TextOpLogic } from '@/components/templates/types'

const MAP: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '@': '.--.-.', '$': '...-..-',
}

const REVERSE: Record<string, string> = Object.fromEntries(Object.entries(MAP).map(([k, v]) => [v, k]))

const OPS = [
  { id: 'encode', label: '转摩尔斯', group: '转换' },
  { id: 'decode', label: '摩尔斯转文本', group: '转换' },
]

function encode(text: string): string {
  return text
    .toUpperCase()
    .split(/\r?\n/)
    .map((line) =>
      line
        .split(/\s+/)
        .filter(Boolean)
        .map((word) =>
          [...word]
            .map((ch) => MAP[ch] ?? '')
            .filter(Boolean)
            .join(' '),
        )
        .join(' / '),
    )
    .join('\n')
}

function decode(code: string): string {
  return code
    .split(/\r?\n/)
    .map((line) =>
      line
        .trim()
        .split(/\s*\/\s*/)
        .map((word) =>
          word
            .split(/\s+/)
            .filter(Boolean)
            .map((token) => REVERSE[token] ?? '?')
            .join(''),
        )
        .join(' '),
    )
    .join('\n')
}

function apply(text: string, op: string): string {
  return op === 'decode' ? decode(text) : encode(text)
}

const logic: TextOpLogic = {
  OPS,
  apply,
  sample: 'SOS ZT TOOLS\n2026',
  note: '字母之间用空格，单词之间用 /；不认识的符号会被跳过',
  inputLabel: '文本或电码',
  outputLabel: '结果',
}

export default logic
