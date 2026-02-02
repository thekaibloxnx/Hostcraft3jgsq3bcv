// Mock server implementation for browser preview
// This provides simulated data when running in preview mode
// Real implementation uses Server Actions and API routes

import { MinecraftServer, ServerStats, ConsoleLog } from './types'

const mockServers: MinecraftServer[] = [
  {
    id: '1',
    name: 'Survival World',
    type: 'paper',
    version: '1.21.4',
    port: 25565,
    ram: 4096,
    status: 'offline',
    path: '/servers/1',
    createdAt: new Date().toISOString(),
    maxPlayers: 20,
  },
]

const mockLogs: Map<string, ConsoleLog[]> = new Map([
  [
    '1',
    [
      { timestamp: new Date().toISOString(), message: '[Server thread/INFO]: Starting minecraft server version 1.21.4', level: 'info' },
      { timestamp: new Date().toISOString(), message: '[Server thread/INFO]: Loading properties', level: 'info' },
      { timestamp: new Date().toISOString(), message: '[Server thread/INFO]: Default game type: SURVIVAL', level: 'info' },
    ],
  ],
])

export async function loadServers(): Promise<MinecraftServer[]> {
  return mockServers
}

export async function createServer(config: {
  name: string
  type: string
  version: string
  port: number
  ram: number
}): Promise<MinecraftServer> {
  const id = Date.now().toString()
  const server: MinecraftServer = {
    id,
    name: config.name,
    type: config.type as any,
    version: config.version,
    port: config.port,
    ram: config.ram,
    status: 'offline',
    path: `/servers/${id}`,
    createdAt: new Date().toISOString(),
    maxPlayers: 20,
  }
  mockServers.push(server)
  return server
}

export async function deleteServer(serverId: string) {
  const index = mockServers.findIndex((s) => s.id === serverId)
  if (index > -1) mockServers.splice(index, 1)
}

export async function startServer(serverId: string) {
  const server = mockServers.find((s) => s.id === serverId)
  if (server) {
    server.status = 'online'
  }
}

export async function stopServer(serverId: string) {
  const server = mockServers.find((s) => s.id === serverId)
  if (server) {
    server.status = 'offline'
  }
}

export async function executeCommand(serverId: string, command: string) {
  const logs = mockLogs.get(serverId) || []
  logs.push({
    timestamp: new Date().toISOString(),
    message: `> ${command}`,
    level: 'info',
  })
  mockLogs.set(serverId, logs)
}

export async function getServerLogs(serverId: string, limit: number = 100): Promise<ConsoleLog[]> {
  const logs = mockLogs.get(serverId) || []
  return logs.slice(-limit)
}

export async function getServerStats(serverId: string): Promise<ServerStats | null> {
  const server = mockServers.find((s) => s.id === serverId)
  if (!server || server.status !== 'online') return null

  return {
    players: Math.floor(Math.random() * 10),
    tps: 19.8 + Math.random() * 0.4,
    cpu: Math.floor(Math.random() * 40) + 10,
    ram: Math.floor(Math.random() * 4096),
  }
}

export async function getServerStatus(serverId: string): Promise<string> {
  const server = mockServers.find((s) => s.id === serverId)
  return server?.status || 'offline'
}
