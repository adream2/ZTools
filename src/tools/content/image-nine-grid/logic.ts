export interface Tile {
  index: number
  url: string
  blob: Blob
}

export interface SplitResult {
  tiles: Tile[]
  side: number
  tileSize: number
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片解码失败，换一张试试'))
    }
    img.src = url
  })
}

function toBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('导出失败'))),
      mime,
      quality,
    )
  })
}

export async function splitNine(file: File, mime = 'image/jpeg'): Promise<SplitResult> {
  const img = await loadImage(file)
  const side = Math.min(img.naturalWidth, img.naturalHeight)
  if (!side) throw new Error('图片尺寸异常')

  const tileSize = Math.floor(side / 3)
  if (tileSize < 30) throw new Error('图片太小，切出来看不清')

  const offsetX = Math.floor((img.naturalWidth - side) / 2)
  const offsetY = Math.floor((img.naturalHeight - side) / 2)

  const tiles: Tile[] = []
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const canvas = document.createElement('canvas')
      canvas.width = tileSize
      canvas.height = tileSize
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('当前浏览器不支持 Canvas')
      if (mime === 'image/jpeg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, tileSize, tileSize)
      }
      ctx.drawImage(img, offsetX + col * tileSize, offsetY + row * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize)
      const blob = await toBlob(canvas, mime, 0.92)
      tiles.push({ index: row * 3 + col + 1, blob, url: URL.createObjectURL(blob) })
    }
  }

  return { tiles, side, tileSize }
}
