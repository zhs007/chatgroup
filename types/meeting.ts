export interface MeetingParticipant {
  roleId: string;
  name: string;
  isActive: boolean;
  lastSpeakTime?: Date;
  messageCount: number;
}

export interface MeetingSession {
  id: string;
  participants: MeetingParticipant[];
  currentSpeaker?: string;
  nextSpeaker?: string;
  topic?: string;
  status: 'waiting' | 'active' | 'paused' | 'ended';
  createdAt: Date;
  updatedAt: Date;
}

export interface SpeakerAction {
  action: 'invite_speaker' | 'set_next_speaker' | 'pause_meeting' | 'resume_meeting' | 'end_meeting';
  roleId?: string;
  reason?: string;
}
