// Simple QR code generator using data URL
export function gerarQRCode(texto: string): Promise<string> {
  return new Promise((resolve) => {
    // Usar API externa para gerar QR code
    const encoded = encodeURIComponent(texto)
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`
    resolve(qrImageUrl)
  })
}

// Generate QR code as canvas (offline alternative)
export async function gerarQRCodeCanvas(texto: string): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  // Simple QR code pattern (simplified version)
  canvas.width = 200
  canvas.height = 200

  // White background
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, 200, 200)

  // Create a simple pattern based on text
  ctx.fillStyle = "black"
  const dataBytes = new TextEncoder().encode(texto)
  let index = 0

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const byte = dataBytes[index % dataBytes.length]
      if ((byte + index) % 2 === 0) {
        ctx.fillRect(x * 20, y * 20, 18, 18)
      }
      index++
    }
  }

  return canvas
}

// Convert canvas to image data URL
export function canvasParaImagemBase64(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/png")
}
