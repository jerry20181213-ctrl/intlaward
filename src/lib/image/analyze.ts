/**
 * Client-side image analysis using Canvas API.
 * Zero-cost checks for basic content validation.
 */

export interface ImageAnalysis {
  valid: boolean
  issues: string[]
  dimensions: { width: number; height: number }
  colorRichness: number // 0-100, how varied the colors are
  isMonochrome: boolean
  isTooSmall: boolean
}

export async function analyzeImage(file: File): Promise<ImageAnalysis> {
  const issues: string[] = []
  const img = await loadImage(file)

  const width = img.naturalWidth
  const height = img.naturalHeight

  // Check dimensions
  const isTooSmall = width < 200 || height < 200
  if (isTooSmall) {
    issues.push('图片尺寸过小（至少 200×200 像素）')
  }

  // Analyze pixel data
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)

  const { colorRichness, isMonochrome } = analyzePixels(ctx, width, height)

  if (isMonochrome) {
    issues.push('图片颜色单一，可能是无关图片')
  }

  if (colorRichness < 15) {
    issues.push('图片色彩丰富度较低，建议上传清晰的设计作品照片')
  }

  return {
    valid: issues.length === 0,
    issues,
    dimensions: { width, height },
    colorRichness,
    isMonochrome,
    isTooSmall,
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片加载失败'))
    }
    img.src = url
  })
}

function analyzePixels(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): { colorRichness: number; isMonochrome: boolean } {
  // Sample pixels at stride to keep it fast
  const stride = Math.max(1, Math.floor(Math.min(width, height) / 100))
  const sampleSize = Math.floor((width * height) / (stride * stride))
  if (sampleSize === 0) return { colorRichness: 0, isMonochrome: true }

  const sampleW = Math.min(width, 200)
  const sampleH = Math.min(height, 200)
  const pixelData = ctx.getImageData(0, 0, sampleW, sampleH).data

  let rTotal = 0, gTotal = 0, bTotal = 0
  let r2Total = 0, g2Total = 0, b2Total = 0
  let pixelCount = 0
  const colorBuckets = new Set<number>()

  for (let i = 0; i < pixelData.length; i += 4 * stride) {
    const r = pixelData[i]
    const g = pixelData[i + 1]
    const b = pixelData[i + 2]

    rTotal += r
    gTotal += g
    bTotal += b
    r2Total += r * r
    g2Total += g * g
    b2Total += b * b
    pixelCount++

    // Quantize color to a bucket (reduce precision to 32 levels per channel)
    const bucket = (Math.floor(r / 32) << 10) | (Math.floor(g / 32) << 5) | Math.floor(b / 32)
    colorBuckets.add(bucket)
  }

  // Color richness = normalized unique color bucket count
  const maxBuckets = 32 * 32 * 32 // 32768
  const colorRichness = Math.round((colorBuckets.size / Math.min(maxBuckets, pixelCount)) * 100)

  // Check monochrome: low variance in RGB channels
  const rVariance = (r2Total / pixelCount) - (rTotal / pixelCount) ** 2
  const gVariance = (g2Total / pixelCount) - (gTotal / pixelCount) ** 2
  const bVariance = (b2Total / pixelCount) - (bTotal / pixelCount) ** 2
  const avgVariance = (rVariance + gVariance + bVariance) / 3
  const isMonochrome = avgVariance < 500 && colorBuckets.size < 20

  return { colorRichness, isMonochrome }
}
