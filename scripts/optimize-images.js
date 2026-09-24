import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const dirs = [
  'public/cabanas',
  'public/tinajas',
  'public/paisajes'
]

async function optimizeFolder(folder) {
  const dirPath = path.resolve(folder)
  if (!fs.existsSync(dirPath)) return

  const files = fs.readdirSync(dirPath)
  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
      const inputPath = path.join(dirPath, file)
      const parsed = path.parse(file)
      const outputPath = path.join(dirPath, `${parsed.name}.webp`)

      const originalStats = fs.statSync(inputPath)
      
      await sharp(inputPath)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath)

      const newStats = fs.statSync(outputPath)
      const savings = (((originalStats.size - newStats.size) / originalStats.size) * 100).toFixed(1)
      console.log(`[OPTIMIZED] ${file} (${(originalStats.size / 1024).toFixed(0)} KB) -> ${parsed.name}.webp (${(newStats.size / 1024).toFixed(0)} KB) [${savings}% saved]`)
    }
  }
}

async function run() {
  console.log('Starting image optimization to WebP...')
  for (const dir of dirs) {
    await optimizeFolder(dir)
  }
  console.log('Finished image optimization!')
}

run().catch(console.error)
