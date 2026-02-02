'use server'

import {
  loadServers,
  createServer as createServerFn,
  startServer as startServerFn,
  stopServer as stopServerFn,
  deleteServer as deleteServerFn,
  executeCommand,
  getServerLogs as getServerLogsFn,
  getServerStats as getServerStatsFn,
} from '@/lib/server-mock'

export async function getServers() {
  try {
    return await loadServers()
  } catch (error) {
    console.error('[v0] Error loading servers:', error)
    return []
  }
}

export async function createServer(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const version = formData.get('version') as string
    const port = parseInt(formData.get('port') as string)
    const ram = parseInt(formData.get('ram') as string)

    const server = await createServerFn({
      name,
      type,
      version,
      port,
      ram,
    })
    console.log('[v0] Server created:', server.id)
    return { success: true, server }
  } catch (error) {
    console.error('[v0] Error creating server:', error)
    return { success: false, error: String(error) }
  }
}

export async function startServer(serverId: string) {
  try {
    await startServerFn(serverId)
    console.log('[v0] Server started:', serverId)
    return { success: true }
  } catch (error) {
    console.error('[v0] Error starting server:', error)
    return { success: false, error: String(error) }
  }
}

export async function stopServer(serverId: string) {
  try {
    await stopServerFn(serverId)
    console.log('[v0] Server stopped:', serverId)
    return { success: true }
  } catch (error) {
    console.error('[v0] Error stopping server:', error)
    return { success: false, error: String(error) }
  }
}

export async function deleteServer(serverId: string) {
  try {
    await deleteServerFn(serverId)
    console.log('[v0] Server deleted:', serverId)
    return { success: true }
  } catch (error) {
    console.error('[v0] Error deleting server:', error)
    return { success: false, error: String(error) }
  }
}

export async function sendCommand(serverId: string, command: string) {
  try {
    await executeCommand(serverId, command)
    console.log('[v0] Command sent to server:', serverId, command)
    return { success: true }
  } catch (error) {
    console.error('[v0] Error sending command:', error)
    return { success: false, error: String(error) }
  }
}

export async function getServerLogs(serverId: string, limit = 100) {
  try {
    return await getServerLogsFn(serverId, limit)
  } catch (error) {
    console.error('[v0] Error getting logs:', error)
    return []
  }
}

export async function getServerStats(serverId: string) {
  try {
    return await getServerStatsFn(serverId)
  } catch (error) {
    console.error('[v0] Error getting stats:', error)
    return null
  }
}
