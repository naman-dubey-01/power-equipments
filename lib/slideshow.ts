import { readdirSync } from 'node:fs'
import { join } from 'node:path'

export interface FolderSlide {
  src: string
  alt: string
}

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])

/**
 * Lists images inside `public/slides/`. Drop any image in that folder and it
 * will automatically appear in the homepage slideshow. Returns an empty array
 * when there are no images yet (the hero then falls back to a static banner).
 */
export function getFolderSlides(): FolderSlide[] {
  try {
    const directory = join(process.cwd(), 'public', 'slides')
    const files = readdirSync(directory)
      .filter((file) => IMAGE_EXTENSIONS.has(file.slice(file.lastIndexOf('.'))))
      .sort()
    return files.map((file) => ({
      src: `/slides/${file}`,
      alt: `Power Equipments showcase slide ${file}`,
    }))
  } catch {
    return []
  }
}