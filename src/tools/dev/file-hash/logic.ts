import { formatBytes, hashFile, type HashAlgo } from '@/tools/dev/hash/logic'
import type { FileOpLogic } from '@/components/templates/types'

const logic: FileOpLogic = {
  accept: '*/*',
  multiple: true,
  maxSize: 200 * 1024 * 1024,
  dropHint: '选择一个或多个文件',
  actionLabel: '计算哈希',
  fields: [
    {
      key: 'algo',
      label: '算法',
      type: 'select',
      default: 'SHA-256',
      options: [
        { label: 'MD5', value: 'MD5' },
        { label: 'SHA-1', value: 'SHA-1' },
        { label: 'SHA-256', value: 'SHA-256' },
        { label: 'SHA-384', value: 'SHA-384' },
        { label: 'SHA-512', value: 'SHA-512' },
      ],
    },
  ],
  run: async (files, values) => {
    const algo = String(values.algo) as HashAlgo
    const outputs = []
    for (const file of files) {
      const digest = await hashFile(file, algo)
      outputs.push({
        name: file.name,
        text: digest,
        meta: `${algo} · ${formatBytes(file.size)}`,
      })
    }
    return outputs
  },
  note: '点击结果右侧按钮可单独复制校验值',
}

export default logic
