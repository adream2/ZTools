export type KeySize = 2048 | 3072 | 4096

export interface KeyPairPem {
  publicKey: string
  privateKey: string
  bits: KeySize
  createdAt: string
}

function toPem(buffer: ArrayBuffer, label: string): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  const base64 = btoa(binary).replace(/(.{64})/g, '$1\n').trimEnd()
  return `-----BEGIN ${label}-----\n${base64}\n-----END ${label}-----`
}

export async function generateKeyPair(bits: KeySize = 2048): Promise<KeyPairPem> {
  const pair = await crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: bits,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  )

  const [spki, pkcs8] = await Promise.all([
    crypto.subtle.exportKey('spki', pair.publicKey),
    crypto.subtle.exportKey('pkcs8', pair.privateKey),
  ])

  return {
    publicKey: toPem(spki, 'PUBLIC KEY'),
    privateKey: toPem(pkcs8, 'PRIVATE KEY'),
    bits,
    createdAt: new Date().toISOString(),
  }
}

export function downloadPem(content: string, name: string): void {
  const blob = new Blob([content], { type: 'application/x-pem-file' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1200)
}

/** 供命令行校验：openssl rsa -in private.pem -check */
export const OPENSSL_HINT = 'openssl rsa -in private.pem -check -noout'
