'use server'

import { spawn, ChildProcess } from 'child_process'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as os from 'os'
import { MinecraftServer, ServerStats, ServerStatus, ConsoleLog, Player } from './types'

const SERVERS_DIR = path.join(os.homedir(), 'crafthost-servers')
const SERVERS_CONFIG = path.join(SERVERS_DIR, 'servers.json')

let runningServers: Map<string, ChildProcess> = new Map()
let serverLogs: Map<string, ConsoleLog[]> = new Map()

export async function ensureServersDir() {
  try {
    await fs.mkdir(SERVERS_DIR, { recursive: true })
    await fs.mkdir(path.join(SERVERS_DIR, 'mods'), { recursive: true })
    await fs.mkdir(path.join(SERVERS_DIR, 'plugins'), { recursive: true })
  } catch (error) {
    console.error('Error creating servers directory:', error)
  }
}

export async function loadServers(): Promise<MinecraftServer[]> {
  try {
    await ensureServersDir()
    const data = await fs.readFile(SERVERS_CONFIG, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function saveServers(servers: MinecraftServer[]) {
  await fs.writeFile(SERVERS_CONFIG, JSON.stringify(servers, null, 2))
}

export async function createServer(config: {
  name: string
  type: string
  version: string
  port: number
  ram: number
}): Promise<MinecraftServer> {
  const id = Date.now().toString()
  const serverPath = path.join(SERVERS_DIR, id)
  
  await fs.mkdir(serverPath, { recursive: true })
  await fs.mkdir(path.join(serverPath, 'mods'), { recursive: true })
  await fs.mkdir(path.join(serverPath, 'plugins'), { recursive: true })
  await fs.mkdir(path.join(serverPath, 'world'), { recursive: true })

  const server: MinecraftServer = {
    id,
    name: config.name,
    type: config.type as any,
    version: config.version,
    port: config.port,
    ram: config.ram,
    status: 'offline',
    path: serverPath,
    createdAt: new Date().toISOString(),
    maxPlayers: 20,
  }

  const servers = await loadServers()
  servers.push(server)
  await saveServers(servers)

  return server
}

export async function deleteServer(serverId: string) {
  const servers = await loadServers()
  const server = servers.find((s) => s.id === serverId)
  
  if (server) {
    await stopServer(serverId)
    await fs.rm(server.path, { recursive: true, force: true })
    await saveServers(servers.filter((s) => s.id !== serverId))
  }
}

export async function startServer(serverId: string) {
  let servers = await loadServers() // Changed from const to let
  const server = servers.find((s) => s.id === serverId)
  
  if (!server) throw new Error('Server not found')
  if (runningServers.has(serverId)) return

  const jarPath = path.join(server.path, 'server.jar')
  const jarExists = await fs.stat(jarPath).catch(() => null)
  
  if (!jarExists) {
    throw new Error('server.jar not found. Please download and place the server JAR in the server directory.')
  }

  const proc = spawn('java', [
    `-Xmx${server.ram}M`,
    `-Xms${Math.floor(server.ram / 2)}M`,
    '-jar',
    jarPath,
    'nogui',
  ], {
    cwd: server.path,
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  runningServers.set(serverId, proc)
  if (!serverLogs.has(serverId)) serverLogs.set(serverId, [])

  proc.stdout?.on('data', (data) => {
    const log: ConsoleLog = {
      timestamp: new Date().toISOString(),
      message: data.toString(),
      level: 'info',
    }
    serverLogs.get(serverId)?.push(log)
  })

  proc.stderr?.on('data', (data) => {
    const log: ConsoleLog = {
      timestamp: new Date().toISOString(),
      message: data.toString(),
      level: 'error',
    }
    serverLogs.get(serverId)?.push(log)
  })

  proc.on('close', () => {
    runningServers.delete(serverId)
  })

  // Update server status
  servers = servers.map((s) =>
    s.id === serverId ? { ...s, status: 'online' } : s
  )
  await saveServers(servers)
}

export async function stopServer(serverId: string) {
  const proc = runningServers.get(serverId)
  if (proc) {
    proc.stdin?.write('stop\n')
    runningServers.delete(serverId)
  }

  let servers = await loadServers() // Changed from const to let
  const updated = servers.map((s) =>
    s.id === serverId ? { ...s, status: 'offline' } : s
  )
  await saveServers(updated)
}

export async function executeCommand(serverId: string, command: string) {
  const proc = runningServers.get(serverId)
  if (!proc) throw new Error('Server not running')
  
  proc.stdin?.write(command + '\n')
}

export async function getServerLogs(serverId: string, limit: number = 100): Promise<ConsoleLog[]> {
  const logs = serverLogs.get(serverId) || []
  return logs.slice(-limit)
}

export async function getServerStats(serverId: string): Promise<ServerStats | null> {
  const running = runningServers.has(serverId)
  if (!running) return null

  return {
    players: Math.floor(Math.random() * 10),
    tps: 19.8 + Math.random() * 0.4,
    cpu: Math.floor(Math.random() * 40) + 10,
    ram: Math.floor(Math.random() * 4096),
  }
}

export async function getServerStatus(serverId: string): Promise<ServerStatus> {
  if (runningServers.has(serverId)) return 'online'
  return 'offline'
}
