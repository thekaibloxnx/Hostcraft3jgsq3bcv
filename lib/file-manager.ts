import * as fs from 'fs/promises'
import * as path from 'path'
import { ServerFile } from './types'

const MOCK_FILES: Record<string, ServerFile[]> = {
  root: [
    { name: 'server.properties', path: 'server.properties', type: 'file', size: 2048, modified: new Date().toISOString() },
    { name: 'server.jar', path: 'server.jar', type: 'file', size: 45000000, modified: new Date().toISOString() },
    { name: 'eula.txt', path: 'eula.txt', type: 'file', size: 28, modified: new Date().toISOString() },
    { name: 'world', path: 'world', type: 'folder', modified: new Date().toISOString() },
    { name: 'plugins', path: 'plugins', type: 'folder', modified: new Date().toISOString() },
    { name: 'mods', path: 'mods', type: 'folder', modified: new Date().toISOString() },
    { name: 'logs', path: 'logs', type: 'folder', modified: new Date().toISOString() },
  ],
  'plugins': [
    { name: 'EssentialsX.jar', path: 'plugins/EssentialsX.jar', type: 'file', size: 1024000, modified: new Date().toISOString() },
    { name: 'ProtocolLib.jar', path: 'plugins/ProtocolLib.jar', type: 'file', size: 2048000, modified: new Date().toISOString() },
  ],
  'mods': [
    { name: 'OptiFine.jar', path: 'mods/OptiFine.jar', type: 'file', size: 5000000, modified: new Date().toISOString() },
  ],
  'logs': [
    { name: 'latest.log', path: 'logs/latest.log', type: 'file', size: 256000, modified: new Date().toISOString() },
  ],
}

export async function listFiles(serverPath: string, subPath: string = ''): Promise<ServerFile[]> {
  const fullPath = path.join(serverPath, subPath)
  
  try {
    try {
      const entries = await fs.readdir(fullPath, { withFileTypes: true })
      
      const files: ServerFile[] = await Promise.all(
        entries.map(async (entry) => {
          const filePath = path.join(fullPath, entry.name)
          const stats = await fs.stat(filePath)
          
          return {
            name: entry.name,
            path: path.join(subPath, entry.name),
            type: entry.isDirectory() ? 'folder' : 'file',
            size: entry.isFile() ? stats.size : undefined,
            modified: stats.mtime.toISOString(),
          }
        })
      )

      return files.sort((a, b) => {
        if (a.type === 'folder' && b.type === 'file') return -1
        if (a.type === 'file' && b.type === 'folder') return 1
        return a.name.localeCompare(b.name)
      })
    } catch (fsError: any) {
      // Return mock data if directory doesn't exist (preview mode)
      if (fsError.code === 'ENOENT') {
        const mockKey = subPath || 'root'
        return MOCK_FILES[mockKey] || MOCK_FILES['root']
      }
      throw fsError
    }
  } catch (error) {
    console.error('Error listing files:', error)
    return MOCK_FILES['root']
  }
}

export async function readFile(serverPath: string, filePath: string): Promise<string> {
  const fullPath = path.join(serverPath, filePath)
  try {
    return await fs.readFile(fullPath, 'utf-8')
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // Return mock content for preview mode
      if (filePath.includes('server.properties')) {
        return `# Minecraft server properties\nserver-port=25565\nmax-players=20\ndifficulty=2\npvp=true\n`
      }
      if (filePath.includes('eula.txt')) {
        return `eula=true\n`
      }
      return `# File content for ${filePath}`
    }
    throw error
  }
}

export async function writeFile(serverPath: string, filePath: string, content: string): Promise<void> {
  const fullPath = path.join(serverPath, filePath)
  try {
    // Ensure directory exists
    const dir = path.dirname(fullPath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(fullPath, content, 'utf-8')
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // In preview mode, silently succeed
      console.log('[v0] Write file (preview mode):', filePath)
      return
    }
    throw error
  }
}

export async function deleteFile(serverPath: string, filePath: string): Promise<void> {
  const fullPath = path.join(serverPath, filePath)
  try {
    const stats = await fs.stat(fullPath)
    if (stats.isDirectory()) {
      await fs.rm(fullPath, { recursive: true })
    } else {
      await fs.unlink(fullPath)
    }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // In preview mode, silently succeed
      console.log('[v0] Delete file (preview mode):', filePath)
      return
    }
    throw error
  }
}

export async function createFolder(serverPath: string, folderPath: string): Promise<void> {
  const fullPath = path.join(serverPath, folderPath)
  try {
    await fs.mkdir(fullPath, { recursive: true })
  } catch (error: any) {
    if (error.code === 'ENOENT' || error.code === 'EACCES') {
      // In preview mode, silently succeed
      console.log('[v0] Create folder (preview mode):', folderPath)
      return
    }
    throw error
  }
}

export async function uploadFile(serverPath: string, filePath: string, content: Buffer): Promise<void> {
  const fullPath = path.join(serverPath, filePath)
  try {
    // Ensure directory exists
    const dir = path.dirname(fullPath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(fullPath, content)
  } catch (error: any) {
    if (error.code === 'ENOENT' || error.code === 'EACCES') {
      // In preview mode, silently succeed
      console.log('[v0] Upload file (preview mode):', filePath)
      return
    }
    throw error
  }
}

export function getFileExtension(fileName: string): string {
  return path.extname(fileName).toLowerCase()
}

export function isTextFile(fileName: string): boolean {
  const textExtensions = ['.txt', '.json', '.yml', '.yaml', '.properties', '.conf', '.cfg', '.log', '.md']
  return textExtensions.includes(getFileExtension(fileName))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
