import { NextResponse } from 'next/server'
import { getServerLogs } from '@/lib/server-mock'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    
    const logs = getServerLogs(id, limit)
    return NextResponse.json(logs)
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json({ error: 'Failed to get server logs' }, { status: 500 })
  }
}
