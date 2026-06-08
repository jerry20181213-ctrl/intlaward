'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, ImageIcon, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { analyzeImage } from '@/lib/image/analyze'

interface FileInfo {
  file: File
  analysis?: {
    valid: boolean
    issues: string[]
    dimensions: { width: number; height: number }
  }
  analyzing: boolean
}

interface FileUploadProps {
  maxFiles?: number
  minFiles?: number
  maxSizeMB?: number
  files: File[]
  onFilesChange: (files: File[]) => void
  filesInfo?: FileInfo[]
  onFilesInfoChange?: (info: FileInfo[]) => void
}

export function FileUpload({
  maxFiles = 5,
  minFiles = 3,
  maxSizeMB = 5,
  files,
  onFilesChange,
  filesInfo: externalFilesInfo,
  onFilesInfoChange,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [internalFilesInfo, setInternalFilesInfo] = useState<FileInfo[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Use external state if provided, otherwise internal
  const filesInfo = externalFilesInfo ?? internalFilesInfo
  const setFilesInfo = onFilesInfoChange ?? setInternalFilesInfo

  const validateAndAdd = useCallback(async (newFiles: File[]) => {
    setError(null)
    const validFiles: File[] = []
    const newInfos: FileInfo[] = []
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
      newInfos.push({ file, analyzing: true })
    }

    if (newFiles.length > remaining) {
      setError(`最多上传 ${maxFiles} 张图片`)
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles]
      onFilesChange(updatedFiles)

      // Add new infos to the existing list
      const updatedInfos = [...filesInfo, ...newInfos]
      setFilesInfo(updatedInfos)

      // Run analysis on each new file (non-blocking)
      for (let i = 0; i < validFiles.length; i++) {
        const idx = filesInfo.length + i
        try {
          const analysis = await analyzeImage(validFiles[i])
          updatedInfos[filesInfo.length + i] = {
            file: validFiles[i],
            analysis: {
              valid: analysis.valid,
              issues: analysis.issues,
              dimensions: analysis.dimensions,
            },
            analyzing: false,
          }
        } catch {
          updatedInfos[filesInfo.length + i] = {
            file: validFiles[i],
            analysis: { valid: true, issues: [], dimensions: { width: 0, height: 0 } },
            analyzing: false,
          }
        }
        setFilesInfo([...filesInfo, ...updatedInfos.slice(filesInfo.length)])
      }
    }
  }, [files, filesInfo, maxFiles, maxSizeMB, onFilesChange, setFilesInfo])

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
    const updatedInfos = filesInfo.filter((_, i) => i !== index)
    setFilesInfo(updatedInfos)
    setError(null)
  }, [files, filesInfo, onFilesChange, setFilesInfo])

  return (
    <div className="space-y-4">
      <label className="block text-[11px] font-medium tracking-wider uppercase text-[var(--text-secondary)]">
        上传作品照片
        <span className="font-normal normal-case text-[var(--text-tertiary)] ml-2">
          （至少 {minFiles} 张，最多 {maxFiles} 张，每张 {maxSizeMB}MB 以内）
        </span>
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
          {files.length >= maxFiles
            ? '已满，无法继续上传'
            : '拖拽图片到此处，或点击选择'}
        </p>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">
          至少上传 3 张作品照片 · 请勿上传无关图片
        </p>
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

      {/* Min files warning */}
      {files.length > 0 && files.length < minFiles && (
        <p className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          至少需要 {minFiles} 张作品照片（已上传 {files.length} 张）
        </p>
      )}

      {/* Thumbnails */}
      {files.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {files.map((file, index) => {
            const info = filesInfo[index]
            const hasIssue = info && !info.analyzing && info.analysis && !info.analysis.valid

            return (
              <div key={`${file.name}-${index}`} className="relative">
                <div className="relative group aspect-square overflow-hidden bg-[var(--bg-tertiary)]">
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
                  {info && !info.analyzing && hasIssue && (
                    <div className="absolute bottom-1 left-1 bg-yellow-500/80 p-0.5">
                      <AlertTriangle className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {info && !info.analyzing && !hasIssue && (
                    <div className="absolute bottom-1 left-1 bg-green-600/80 p-0.5">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {info?.analyzing && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full" />
                    </div>
                  )}
                </div>
                {info && !info.analyzing && hasIssue && info.analysis && (
                  <p className="text-[10px] text-yellow-600 mt-1 leading-tight">
                    {info.analysis.issues[0]}
                  </p>
                )}
              </div>
            )
          })}
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
