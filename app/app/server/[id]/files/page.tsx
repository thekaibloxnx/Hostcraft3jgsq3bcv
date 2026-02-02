'use client'

import { AppHeader } from '@/components/app/app-header'
import { FileBrowser } from '@/components/file-browser'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getServers } from '@/app/actions/server-actions'
import { MinecraftServer } from '@/lib/types'

export default function FilesPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [server, setServer] = useState<MinecraftServer | null>(null)

  useEffect(() => {
    loadServer()
  }, [id])

  async function loadServer() {
    const servers = await getServers()
    const found = servers.find((s) => s.id === id)
    setServer(found || null)
  }

  return (
    <>
      <AppHeader title={server ? `${server.name} - Files` : 'Server Files'}>
        <Link href="/app">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </AppHeader>
      <div className="flex-1 overflow-hidden">
        {server ? (
          <FileBrowser serverId={id} />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading server...
          </div>
        )}
      </div>
    </>
  )
}
