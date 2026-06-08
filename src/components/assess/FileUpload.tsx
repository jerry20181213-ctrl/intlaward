'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  maxFiles?: number
  maxSizeMB?: number
  files: File[]
  onFilesChange: (files: File[]) => void
}

export function FileUpload({ maxFiles = 5, maxSizeMB = 5, files, onFilesChange }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateAndAdd = useCallback((newFiles: File[]) => {
    setError(null)
    const validFiles: File[] = []
    const remaining = maxFiles - files.length

    for (const file of newFiles.slice(0, remaining)) {
      if (!file.type.startsWith('image/')) {
        setError('仅支持图片文件')
        continue
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`单张图片不能超过 ${maxSizeMB}MB`)
        continue
      }
      validFiles.push(file)
    }

    if (newFiles.length > remaining) {
      setError(`最多上传 ${maxFiles} 张图片`)
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles])
    }
  }, [files, maxFiles, maxSizeMB, onFilesChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    validateAndAdd(droppedFiles)
  }, [validateAndAdd])

  const handleSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndAdd(Array.from(e.target.files))
      e.target.value = ''
    }
  }, [validateAndAdd])

  const removeFile = useCallback((index: number) => {
    const updated = files.filter((_, i) => i !== index)
    onFilesChange(updated)
    setError(null)
  }, [files, onFilesChange])

  return (
    <div className="space-y-4">
      <label className="block text-[11px] font-medium tracking-wider uppercase text-[var(--text-secondary)]">
        上传作品照片
        <span className="font-normal normal-case text-[var(--text-tertiary)] ml-2">（可选，最多{maxFiles}张，每张{maxSizeMB}MB以内）</span>
      </label>

      {/* Drop zone */}
      <div
        className={cn(
          'border border-[var(--border)] p-8 text-center cursor-pointer transition-colors',
          dragOver ? 'bg-[var(--bg-tertiary)] border-black' : 'bg-white hover:bg-[var(--bg-secondary)]',
          files.length >= maxFiles && 'opacity-40 pointer-events-none'
        )}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mx-auto h-6 w-6 text-[var(--text-tertiary)] mb-3" />
        <p className="text-sm text-[var(--text-secondary)]">
          {files.length >= maxFiles ? '已满，无法继续上传' : '拖拽图片到此处，或点击选择'}
        </p>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">支持 JPG、PNG、WebP</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleSelect}
        />
      </div>

      {error && <p className="text-[11px] text-[var(--text-secondary)]">{error}</p>}

      {/* Thumbnails */}
      {files.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="relative group aspect-square overflow-hidden bg-[var(--bg-tertiary)]">
              <img
                src={URL.createObjectURL(file)}
                alt={`作品照片 ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                className="absolute top-1 right-1 bg-black/60 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.stopPropagation(); removeFile(index) }}
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
          {Array.from({ length: maxFiles - files.length }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square border border-dashed border-[var(--border)] flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-[var(--border)]" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
