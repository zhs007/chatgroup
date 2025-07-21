import { NextRequest, NextResponse } from 'next/server'
import { MeetingManager } from '@/lib/meeting-manager'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    const meetingManager = MeetingManager.getInstance()
    const session = meetingManager.getSession(sessionId)
    
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const stats = meetingManager.getSpeakingStats(sessionId)
    const activeParticipants = meetingManager.getActiveParticipants(sessionId)

    return NextResponse.json({
      session,
      stats,
      activeParticipants
    })

  } catch (error) {
    console.error('Meeting status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, selectedRoles } = await request.json()
    
    if (!sessionId || !selectedRoles) {
      return NextResponse.json({ error: 'Session ID and roles required' }, { status: 400 })
    }

    const meetingManager = MeetingManager.getInstance()
    
    // 创建或更新会话
    let session = meetingManager.getSession(sessionId)
    if (!session) {
      session = await meetingManager.createSession(sessionId, selectedRoles)
    }

    return NextResponse.json({ session })

  } catch (error) {
    console.error('Meeting creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
