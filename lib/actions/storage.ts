'use server'

import { requireAdmin } from '@/lib/auth'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export type UploadResult = { success: boolean; url?: string; error?: string }

function buildStoragePath(folder: string, fileName: string): string {
  const safeExt = (fileName.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const base = fileName
    .replace(/\.[^.]*$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  const timestamp = Date.now()
  const rand = Math.random().toString(36).slice(2, 8)
  return `${folder}/${timestamp}-${rand}-${base || 'file'}.${safeExt}`
}

export async function uploadFileToBucket(
  bucket: string,
  folder: string,
  file: File
): Promise<UploadResult> {
  try {
    if (!bucket || !folder) return { success: false, error: 'Missing bucket or folder.' }
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'File is too large (max 10 MB).' }
    }
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      return { success: false, error: 'Only image or PDF files are allowed.' }
    }

    const { supabase } = await requireAdmin()
    const path = buildStoragePath(folder, file.name)
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    })

    if (error) return { success: false, error: error.message }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return { success: true, url: data.publicUrl }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteFileFromBucket(bucket: string, path: string): Promise<UploadResult> {
  try {
    const { supabase } = await requireAdmin()
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}