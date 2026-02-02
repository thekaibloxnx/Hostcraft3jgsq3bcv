import { NextResponse } from 'next/server'
import { getServerStats } from '@/lib/server-mock'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const stats = getServerStats(id)
    
    if (!stats) {
      return NextResponse.json({ error: 'Server not running or not found' }, { status: 404 })
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json({ error: 'Failed to get server stats' }, { status: 500 })
  }
}
