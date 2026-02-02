'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { AppHeader } from '@/components/app/app-header'
import { StatsCards } from '@/components/app/stats-cards'
import { Button } from '@/components/ui/button'
import { Plus, Play, Square, RotateCw, Trash2, Settings, Terminal, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import {
  getServers,
  startServer,
  stopServer,
  deleteServer,
  createServer,
  getServerStats,
} from '@/app/actions/server-actions'
import { MinecraftServer } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function DashboardPage() {
  const [servers, setServers] = useState<MinecraftServer[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [stats, setStats] = useState<Record<string, any>>({})

  useEffect(() => {
    loadServers()
    const interval = setInterval(() => {
      loadServers()
      loadStats()
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  async function loadServers() {
    const data = await getServers()
    setServers(data)
    setLoading(false)
  }

  async function loadStats() {
    const data = await getServers()
    const newStats: Record<string, any> = {}
    for (const server of data) {
      if (server.status === 'online' || server.status === 'starting') {
        const stat = await getServerStats(server.id)
        if (stat) newStats[server.id] = stat
      }
    }
    setStats(newStats)
  }

  async function handleStartServer(id: string) {
    await startServer(id)
    await loadServers()
  }

  async function handleStopServer(id: string) {
    await stopServer(id)
    await loadServers()
  }

  async function handleRestartServer(id: string) {
    await stopServer(id)
    setTimeout(() => startServer(id), 2000)
  }

  async function handleDeleteServer(id: string) {
    if (!confirm('Are you sure you want to delete this server? This cannot be undone.')) return
    await deleteServer(id)
    await loadServers()
  }

  async function handleCreateServer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await createServer(formData)
    
    if (result.success) {
      setCreateDialogOpen(false)
      await loadServers()
    }
  }

  const runningServers = servers.filter((s) => s.status === 'online').length
  const totalPlayers = Object.values(stats).reduce((acc: number, s: any) => acc + (s?.players || 0), 0)
  const avgCpu = runningServers > 0
    ? Object.values(stats).reduce((acc: number, s: any) => acc + (s?.cpu || 0), 0) / runningServers
    : 0

  function getStatusColor(status: string) {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'starting':
        return 'bg-yellow-500 animate-pulse'
      case 'stopping':
        return 'bg-orange-500 animate-pulse'
      case 'crashed':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <>
      <AppHeader title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        <StatsCards
          totalServers={servers.length}
          runningServers={runningServers}
          totalPlayers={totalPlayers}
          cpuUsage={Math.round(avgCpu)}
          ramUsage={{ used: 0, total: 16 }}
        />

        {/* Servers Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Your Servers</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage and monitor your Minecraft servers
              </p>
            </div>
            
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Server
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Server</DialogTitle>
                  <DialogDescription>
                    Set up a new Minecraft server on your PC
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateServer} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Server Name</Label>
                    <Input id="name" name="name" placeholder="My Server" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Server Type</Label>
                    <Select name="type" defaultValue="vanilla" required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vanilla">Vanilla</SelectItem>
                        <SelectItem value="paper">Paper (Optimized)</SelectItem>
                        <SelectItem value="spigot">Spigot (Plugins)</SelectItem>
                        <SelectItem value="forge">Forge (Mods)</SelectItem>
                        <SelectItem value="fabric">Fabric (Lightweight Mods)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="version">Minecraft Version</Label>
                    <Input id="version" name="version" placeholder="1.21.4" defaultValue="1.21.4" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="port">Server Port</Label>
                    <Input id="port" name="port" type="number" placeholder="25565" defaultValue="25565" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="ram">Allocated RAM (MB)</Label>
                    <Input id="ram" name="ram" type="number" placeholder="4096" defaultValue="4096" required />
                  </div>
                  
                  <Button type="submit" className="w-full">Create Server</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-muted-foreground">Loading servers...</div>
          ) : servers.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed p-12 text-center">
              <h3 className="text-lg font-medium">No servers yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your first Minecraft server to get started
              </p>
              <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Server
              </Button>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {servers.map((server) => {
                const serverStats = stats[server.id]
                return (
                  <div
                    key={server.id}
                    className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`h-3 w-3 rounded-full ${getStatusColor(server.status)}`} />
                          <h3 className="font-semibold">{server.name}</h3>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {server.type} {server.version}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">Port: {server.port}</p>
                      </div>
                    </div>

                    {serverStats && (
                      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Players</p>
                          <p className="font-medium">{serverStats.players}/{server.maxPlayers}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">CPU</p>
                          <p className="font-medium">{Math.round(serverStats.cpu)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">TPS</p>
                          <p className="font-medium">{serverStats.tps.toFixed(1)}</p>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {server.status === 'offline' && (
                        <Button size="sm" onClick={() => handleStartServer(server.id)}>
                          <Play className="mr-1 h-3 w-3" />
                          Start
                        </Button>
                      )}
                      {(server.status === 'online' || server.status === 'starting') && (
                        <Button size="sm" variant="destructive" onClick={() => handleStopServer(server.id)}>
                          <Square className="mr-1 h-3 w-3" />
                          Stop
                        </Button>
                      )}
                      {server.status === 'online' && (
                        <Button size="sm" variant="outline" onClick={() => handleRestartServer(server.id)}>
                          <RotateCw className="mr-1 h-3 w-3" />
                          Restart
                        </Button>
                      )}
                      <Link href={`/app/server/${server.id}/console`}>
                        <Button size="sm" variant="outline">
                          <Terminal className="mr-1 h-3 w-3" />
                          Console
                        </Button>
                      </Link>
                      <Link href={`/app/server/${server.id}/files`}>
                        <Button size="sm" variant="outline">
                          <FolderOpen className="mr-1 h-3 w-3" />
                          Files
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteServer(server.id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold">Getting Started</h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>1. Download server.jar:</strong> After creating a server, download the appropriate
              server JAR file and place it in the server directory (minecraft-servers/server-ID/server.jar)
            </p>
            <p>
              <strong>2. Add mods/plugins:</strong> Place mod files in the mods/ folder, or plugins in the
              plugins/ folder depending on your server type
            </p>
            <p>
              <strong>3. Port forwarding:</strong> To allow others to join, forward port {servers[0]?.port || 25565} in your router settings
            </p>
            <p>
              <strong>4. Share your IP:</strong> Give players your public IP address and port to connect
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
