export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  aiRoleId?: string;
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  selectedRoles: string[];
  messages: Message[];
  createdAt: Date;
  isActive: boolean;
}

export interface StreamResponse {
  content: string;
  done: boolean;
  aiRoleId: string;
}
