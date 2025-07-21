import { MeetingSession, MeetingParticipant, SpeakerAction } from '@/types/meeting';
import { getAIRole } from '@/config/ai-roles';

export class MeetingManager {
  // ...existing code...
  private static instance: MeetingManager;
  private sessions: Map<string, MeetingSession> = new Map();

  static getInstance(): MeetingManager {
    if (!MeetingManager.instance) {
      MeetingManager.instance = new MeetingManager();
    }
    return MeetingManager.instance;
  }

  async createSession(sessionId: string, selectedRoleIds: string[]): Promise<MeetingSession> {
    const participants: MeetingParticipant[] = await Promise.all(
      selectedRoleIds.map(async roleId => {
        const role = await getAIRole(roleId);
        return {
          roleId,
          name: role?.name || roleId,
          isActive: true,
          messageCount: 0
        };
      })
    );

    const session: MeetingSession = {
      id: sessionId,
      participants,
      status: 'waiting',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId: string): MeetingSession | undefined {
    return this.sessions.get(sessionId);
  }

  updateSession(sessionId: string, updates: Partial<MeetingSession>): MeetingSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: new Date()
    };

    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  addMessageCount(sessionId: string, roleId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const participant = session.participants.find(p => p.roleId === roleId);
    if (participant) {
      participant.messageCount++;
      participant.lastSpeakTime = new Date();
      session.updatedAt = new Date();
    }
  }

  setCurrentSpeaker(sessionId: string, roleId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const participant = session.participants.find(p => p.roleId === roleId);
    if (!participant || !participant.isActive) return false;

    session.currentSpeaker = roleId;
    session.updatedAt = new Date();
    return true;
  }

  setNextSpeaker(sessionId: string, roleId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const participant = session.participants.find(p => p.roleId === roleId);
    if (!participant || !participant.isActive) return false;

    session.nextSpeaker = roleId;
    session.updatedAt = new Date();
    return true;
  }

  getNextSpeaker(sessionId: string): string | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    if (session.nextSpeaker) {
      const nextSpeaker = session.nextSpeaker;
      session.nextSpeaker = undefined; // 清除下一个发言者
      session.updatedAt = new Date();
      return nextSpeaker;
    }

    return null;
  }

  pauseParticipant(sessionId: string, roleId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const participant = session.participants.find(p => p.roleId === roleId);
    if (!participant) return false;

    participant.isActive = false;
    session.updatedAt = new Date();
    return true;
  }

  resumeParticipant(sessionId: string, roleId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const participant = session.participants.find(p => p.roleId === roleId);
    if (!participant) return false;

    participant.isActive = true;
    session.updatedAt = new Date();
    return true;
  }

  getActiveParticipants(sessionId: string): MeetingParticipant[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    return session.participants.filter(p => p.isActive);
  }

  getSpeakingStats(sessionId: string): Record<string, number> {
    const session = this.sessions.get(sessionId);
    if (!session) return {};

    const stats: Record<string, number> = {};
    session.participants.forEach(p => {
      stats[p.roleId] = p.messageCount;
    });

    return stats;
  }

  // 获取建议的下一个发言者（基于发言频率平衡）
  getSuggestedNextSpeaker(sessionId: string, excludeRoles: string[] = []): string | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const activeParticipants = session.participants
      .filter(p => p.isActive && !excludeRoles.includes(p.roleId))
      .sort((a, b) => a.messageCount - b.messageCount); // 按发言次数升序

    return activeParticipants[0]?.roleId || null;
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }
}
