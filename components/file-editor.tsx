'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Save, X } from 'lucide-react'
import { readFile, writeFile } from '@/app/actions/file-actions'

interface FileEditorProps {
  serverId: string
  filePath: string
  fileName: string
  onClose: () => void
}

export function FileEditor({ serverId, filePath, fileName, onClose }: FileEditorProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadFile()
  }, [filePath])

  async function loadFile() {
    setLoading(true)
    const result = await readFile(serverId, filePath)
    if (result.success) {
      setContent(result.content || '')
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    await writeFile(serverId, filePath, content)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="flex h-[80vh] w-[80vw] flex-col rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">{fileName}</h2>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4">
          {loading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Loading file...
            </div>
          ) : (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-full font-mono text-sm"
              placeholder="File content..."
            />
          )}
        </div>
      </div>
    </div>
  )
}
