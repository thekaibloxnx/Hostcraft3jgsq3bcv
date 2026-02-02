import { NextResponse } from 'next/server'
import { loadServers } from '@/lib/server-mock'

export async function GET() {
  try {
    const servers = await loadServers()
    return NextResponse.json(servers)
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json({ error: 'Failed to load servers' }, { status: 500 })
  }
}
