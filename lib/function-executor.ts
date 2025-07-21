import { MeetingManager } from './meeting-manager';

export interface FunctionCallResult {
  success: boolean;
  result?: any;
  error?: string;
  nextSpeaker?: string;
}

export class FunctionCallExecutor {
  private meetingManager: MeetingManager;

  constructor() {
    this.meetingManager = MeetingManager.getInstance();
  }

  async executeFunctionCall(
    sessionId: string,
    functionName: string,
    parameters: any
  ): Promise<FunctionCallResult> {
    try {
      switch (functionName) {
        case 'invite_next_speaker':
          return this.inviteNextSpeaker(sessionId, parameters);
        
        case 'pause_participant':
          return this.pauseParticipant(sessionId, parameters);
        
        case 'resume_participant':
          return this.resumeParticipant(sessionId, parameters);
        
        case 'get_speaking_stats':
          return this.getSpeakingStats(sessionId);
        
        case 'suggest_balanced_speaker':
          return this.suggestBalancedSpeaker(sessionId, parameters);
        
        default:
          return {
            success: false,
            error: `Unknown function: ${functionName}`
          };
      }
    } catch (error) {
      return {
        success: false,
        error: `Function execution error: ${error}`
      };
    }
  }

  private inviteNextSpeaker(sessionId: string, params: { roleId: string; reason: string }): FunctionCallResult {
    const { roleId, reason } = params;
    
    const success = this.meetingManager.setNextSpeaker(sessionId, roleId);
    
    if (success) {
      return {
        success: true,
        result: `已邀请 ${roleId} 作为下一个发言者。原因: ${reason}`,
        nextSpeaker: roleId
      };
    } else {
      return {
        success: false,
        error: `无法邀请 ${roleId}，可能该角色不存在或未激活`
      };
    }
  }

  private pauseParticipant(sessionId: string, params: { roleId: string; reason: string }): FunctionCallResult {
    const { roleId, reason } = params;
    
    const success = this.meetingManager.pauseParticipant(sessionId, roleId);
    
    if (success) {
      return {
        success: true,
        result: `已暂停 ${roleId} 的发言权限。原因: ${reason}`
      };
    } else {
      return {
        success: false,
        error: `无法暂停 ${roleId}`
      };
    }
  }

  private resumeParticipant(sessionId: string, params: { roleId: string }): FunctionCallResult {
    const { roleId } = params;
    
    const success = this.meetingManager.resumeParticipant(sessionId, roleId);
    
    if (success) {
      return {
        success: true,
        result: `已恢复 ${roleId} 的发言权限`
      };
    } else {
      return {
        success: false,
        error: `无法恢复 ${roleId}`
      };
    }
  }

  private getSpeakingStats(sessionId: string): FunctionCallResult {
    const stats = this.meetingManager.getSpeakingStats(sessionId);
    
    return {
      success: true,
      result: {
        message: "当前发言统计",
        stats
      }
    };
  }

  private suggestBalancedSpeaker(sessionId: string, params: { excludeRoles?: string[] }): FunctionCallResult {
    const { excludeRoles = [] } = params;
    
    const suggested = this.meetingManager.getSuggestedNextSpeaker(sessionId, excludeRoles);
    
    if (suggested) {
      return {
        success: true,
        result: `建议邀请 ${suggested} 发言（基于发言频率平衡）`,
        nextSpeaker: suggested
      };
    } else {
      return {
        success: false,
        error: "没有可用的发言者建议"
      };
    }
  }

  // 解析回复中的函数调用
  parseFunctionCalls(content: string): Array<{ name: string; parameters: any }> {
    const functionCalls: Array<{ name: string; parameters: any }> = [];
    const regex = /<function_call>\s*([\s\S]*?)\s*<\/function_call>/g;
    
    let match;
    while ((match = regex.exec(content)) !== null) {
      try {
        const functionCall = JSON.parse(match[1].trim());
        if (functionCall.name && functionCall.parameters) {
          functionCalls.push(functionCall);
        }
      } catch (error) {
        console.error('Failed to parse function call:', error);
      }
    }
    
    return functionCalls;
  }

  // 移除回复中的函数调用标签，只保留文字内容
  cleanContent(content: string): string {
    return content.replace(/<function_call>[\s\S]*?<\/function_call>/g, '').trim();
  }
}
