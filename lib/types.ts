export type ServerStatus = 'online' | 'offline' | 'starting' | 'stopping' | 'crashed'
export type ServerType = 'vanilla' | 'paper' | 'spigot' | 'forge' | 'fabric'

export interface MinecraftServer {
  id: string
  name: string
  type: ServerType
  version: string
  status: ServerStatus
  port: number
  maxPlayers: number
  allocatedRam: number
  path: string
  autoStart: boolean
  createdAt: string
  lastStarted?: string
}

export interface ServerStats {
  cpu: number
  ram: number
  tps: number
  uptime: number
  players: number
}

export interface Player {
  uuid: string
  name: string
  isOnline: boolean
  lastSeen?: string
  isOp: boolean
  isWhitelisted: boolean
  isBanned: boolean
}

export interface ConsoleLog {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
}

export interface ServerFile {
  name: string
  path: string
  type: 'file' | 'folder'
  size?: number
  modified?: string
}

export interface BackupConfig {
  enabled: boolean
  interval: number // hours
  maxBackups: number
  lastBackup?: string
}
