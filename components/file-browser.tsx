'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Folder,
  File,
  ChevronRight,
  Upload,
  FolderPlus,
  Trash2,
  FileEdit,
  Home,
} from 'lucide-react'
import { listFiles, deleteFile, createFolder, uploadFile } from '@/app/actions/file-actions'
import { ServerFile } from '@/lib/types'
import { formatFileSize } from '@/lib/file-manager'
import { FileEditor } from './file-editor'

interface FileBrowserProps {
  serverId: string
}

export function FileBrowser({ serverId }: FileBrowserProps) {
  const [files, setFiles] = useState<ServerFile[]>([])
  const [currentPath, setCurrentPath] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingFile, setEditingFile] = useState<{ path: string; name: string } | null>(null)

  useEffect(() => {
    loadFiles()
  }, [currentPath])

  async function loadFiles() {
    setLoading(true)
    const fileList = await listFiles(serverId, currentPath)
    setFiles(fileList)
    setLoading(false)
  }

  function navigateToFolder(folderPath: string) {
    setCurrentPath(folderPath)
  }

  function navigateUp() {
    if (!currentPath) return
    const parts = currentPath.split('/').filter(Boolean)
    parts.pop()
    setCurrentPath(parts.join('/'))
  }

  async function handleDelete(filePath: string) {
    if (!confirm('Are you sure you want to delete this file?')) return
    await deleteFile(serverId, filePath)
    loadFiles()
  }

  async function handleCreateFolder() {
    const folderName = prompt('Enter folder name:')
    if (!folderName) return

    const folderPath = currentPath ? `${currentPath}/${folderName}` : folderName
    await createFolder(serverId, folderPath)
    loadFiles()
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const filePath = currentPath ? `${currentPath}/${file.name}` : file.name
    await uploadFile(serverId, filePath, formData)
    loadFiles()
  }

  const pathParts = currentPath.split('/').filter(Boolean)

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b p-4">
        <Button size="sm" variant="outline" onClick={() => setCurrentPath('')}>
          <Home className="h-4 w-4" />
        </Button>
        {currentPath && (
          <Button size="sm" variant="outline" onClick={navigateUp}>
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
        )}

        <div className="flex-1">
          <Input
            value={currentPath || '/'}
            onChange={(e) => setCurrentPath(e.target.value)}
            placeholder="Path..."
            className="font-mono text-sm"
          />
        </div>

        <Button size="sm" onClick={handleCreateFolder}>
          <FolderPlus className="mr-2 h-4 w-4" />
          New Folder
        </Button>

        <Button size="sm" asChild>
          <label>
            <Upload className="mr-2 h-4 w-4" />
            Upload
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        </Button>
      </div>

      {/* Breadcrumb */}
      {pathParts.length > 0 && (
        <div className="flex items-center gap-2 border-b px-4 py-2 text-sm text-muted-foreground">
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={() => setCurrentPath('')}
          >
            Root
          </Button>
          {pathParts.map((part, index) => {
            const path = pathParts.slice(0, index + 1).join('/')
            return (
              <div key={path} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() => setCurrentPath(path)}
                >
                  {part}
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {/* File list */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading files...
          </div>
        ) : files.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No files in this directory
          </div>
        ) : (
          <div className="divide-y">
            {files.map((file) => (
              <div
                key={file.path}
                className="flex items-center justify-between p-3 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  {file.type === 'folder' ? (
                    <Folder className="h-5 w-5 text-primary" />
                  ) : (
                    <File className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <button
                      onClick={() =>
                        file.type === 'folder'
                          ? navigateToFolder(file.path)
                          : setEditingFile({ path: file.path, name: file.name })
                      }
                      className="text-left font-medium hover:underline"
                    >
                      {file.name}
                    </button>
                    {file.size && (
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {file.type === 'file' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingFile({ path: file.path, name: file.name })}
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(file.path)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingFile && (
        <FileEditor
          serverId={serverId}
          filePath={editingFile.path}
          fileName={editingFile.name}
          onClose={() => {
            setEditingFile(null)
            loadFiles()
          }}
        />
      )}
    </div>
  )
}
