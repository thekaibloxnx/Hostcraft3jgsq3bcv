'use server'

import {
  listFiles as listFilesFn,
  readFile as readFileFn,
  writeFile as writeFileFn,
  deleteFile as deleteFileFn,
  createFolder as createFolderFn,
  uploadFile as uploadFileFn,
} from '@/lib/file-manager'
import { loadServers } from '@/lib/server-mock'

export async function listFiles(serverId: string, subPath: string = '') {
  try {
    const servers = await loadServers()
    const server = servers.find((s) => s.id === serverId)
    
    if (!server) {
      throw new Error('Server not found')
    }

    return await listFilesFn(server.path, subPath)
  } catch (error) {
    console.error('[v0] Error listing files:', error)
    return []
  }
}

export async function readFile(serverId: string, filePath: string) {
  try {
    const servers = await loadServers()
    const server = servers.find((s) => s.id === serverId)
    
    if (!server) {
      throw new Error('Server not found')
    }

    const content = await readFileFn(server.path, filePath)
    return { success: true, content }
  } catch (error) {
    console.error('[v0] Error reading file:', error)
    return { success: false, error: String(error) }
  }
}

export async function writeFile(serverId: string, filePath: string, content: string) {
  try {
    const servers = await loadServers()
    const server = servers.find((s) => s.id === serverId)
    
    if (!server) {
      throw new Error('Server not found')
    }

    await writeFileFn(server.path, filePath, content)
    console.log('[v0] File written:', filePath)
    return { success: true }
  } catch (error) {
    console.error('[v0] Error writing file:', error)
    return { success: false, error: String(error) }
  }
}

export async function deleteFile(serverId: string, filePath: string) {
  try {
    const servers = await loadServers()
    const server = servers.find((s) => s.id === serverId)
    
    if (!server) {
      throw new Error('Server not found')
    }

    await deleteFileFn(server.path, filePath)
    console.log('[v0] File deleted:', filePath)
    return { success: true }
  } catch (error) {
    console.error('[v0] Error deleting file:', error)
    return { success: false, error: String(error) }
  }
}

export async function createFolder(serverId: string, folderPath: string) {
  try {
    const servers = await loadServers()
    const server = servers.find((s) => s.id === serverId)
    
    if (!server) {
      throw new Error('Server not found')
    }

    await createFolderFn(server.path, folderPath)
    console.log('[v0] Folder created:', folderPath)
    return { success: true }
  } catch (error) {
    console.error('[v0] Error creating folder:', error)
    return { success: false, error: String(error) }
  }
}

export async function uploadFile(serverId: string, filePath: string, formData: FormData) {
  try {
    const servers = await loadServers()
    const server = servers.find((s) => s.id === serverId)
    
    if (!server) {
      throw new Error('Server not found')
    }

    const file = formData.get('file') as File
    if (!file) {
      throw new Error('No file provided')
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    await uploadFileFn(server.path, filePath, buffer)
    
    console.log('[v0] File uploaded:', filePath)
    return { success: true }
  } catch (error) {
    console.error('[v0] Error uploading file:', error)
    return { success: false, error: String(error) }
  }
}
