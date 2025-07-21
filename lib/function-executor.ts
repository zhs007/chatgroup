import { MeetingManager } from './meeting-manager';
import { getAIRole } from '@/config/ai-roles';

export interface FunctionCallResult {
  success: boolean;
  result?: any;
  error?: string;
  nextSpeaker?: string;
  shouldHandoverToUser?: boolean;
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
        case 'invite_expert':
          return this.inviteExpert(sessionId, parameters);
        
        case 'request_iteration':
          return this.requestIteration(sessionId, parameters);
        
        case 'check_consensus':
          return this.checkConsensus(sessionId, parameters);
        
        case 'get_expert_info':
          return await this.getExpertInfo(parameters);
        
        case 'pause_expert':
          return this.pauseExpert(sessionId, parameters);
        
        case 'resume_expert':
          return this.resumeExpert(sessionId, parameters);
        
        case 'get_discussion_summary':
          return this.getDiscussionSummary(sessionId);
        
        case 'handover_to_user':
          return this.handoverToUser(parameters);
        
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

  private inviteExpert(sessionId: string, params: { 
    roleId: string; 
    reason: string; 
    context: string;
    collaboration_type: string;
  }): FunctionCallResult {
    const { roleId, reason, context, collaboration_type } = params;
    
    const success = this.meetingManager.setNextSpeaker(sessionId, roleId);
    
    if (success) {
      let collaborationNote = '';
      switch (collaboration_type) {
        case 'initial_proposal':
          collaborationNote = '（初始提案阶段）';
          break;
        case 'review_feedback':
          collaborationNote = '（评估反馈阶段）';
          break;
        case 'iterate_design':
          collaborationNote = '（迭代设计阶段）';
          break;
        case 'final_approval':
          collaborationNote = '（最终确认阶段）';
          break;
      }
      
      return {
        success: true,
        result: `已邀请 ${roleId} 参与讨论${collaborationNote}。原因: ${reason}。背景: ${context}`,
        nextSpeaker: roleId
      };
    } else {
      return {
        success: false,
        error: `无法邀请 ${roleId}，可能该角色不存在或未激活`
      };
    }
  }

  private requestIteration(sessionId: string, params: { 
    roleId: string; 
    feedback_summary: string;
    iteration_focus: string;
  }): FunctionCallResult {
    const { roleId, feedback_summary, iteration_focus } = params;
    
    const success = this.meetingManager.setNextSpeaker(sessionId, roleId);
    
    if (success) {
      return {
        success: true,
        result: `已请求 ${roleId} 进行迭代设计。反馈摘要: ${feedback_summary}。迭代重点: ${iteration_focus}`,
        nextSpeaker: roleId
      };
    } else {
      return {
        success: false,
        error: `无法请求 ${roleId} 迭代设计`
      };
    }
  }

  private checkConsensus(sessionId: string, params: { 
    topic: string;
    participants: string[];
  }): FunctionCallResult {
    const { topic, participants } = params;
    
    const session = this.meetingManager.getSession(sessionId);
    if (!session) {
      return {
        success: false,
        error: '会话不存在'
      };
    }

    const activeParticipants = session.participants
      .filter(p => participants.includes(p.roleId) && p.isActive);
    
    return {
      success: true,
      result: {
        message: `正在检查关于"${topic}"的共识`,
        topic,
        participants: participants,
        activeCount: activeParticipants.length,
        needsConsensus: true
      }
    };
  }

  private async getExpertInfo(params: { roleId?: string }): Promise<FunctionCallResult> {
    const { roleId } = params;
    
    if (roleId) {
      const role = await getAIRole(roleId);
      if (!role) {
        return {
          success: false,
          error: `找不到专家 ${roleId}`
        };
      }
      
      return {
        success: true,
        result: {
          expert: {
            id: role.id,
            name: role.name,
            description: role.description,
            specialties: this.getExpertSpecialties(role.id)
          }
        }
      };
    } else {
      // 返回所有专家信息
      const expertIds = ['tom', 'ash', 'peter', 'ani', 'jerry'];
      const experts = (await Promise.all(
        expertIds.map(async id => {
          const role = await getAIRole(id);
          return role ? {
            id: role.id,
            name: role.name,
            description: role.description,
            specialties: this.getExpertSpecialties(role.id)
          } : null;
        })
      )).filter(Boolean);
      
      return {
        success: true,
        result: {
          message: "当前可用专家列表",
          experts
        }
      };
    }
  }

  private getExpertSpecialties(roleId: string): string[] {
    const specialties: Record<string, string[]> = {
      tom: [
        "游戏创意设计", "玩法机制设计", "主题概念", "市场分析", 
        "游戏特色功能", "玩家体验设计", "游戏平衡性"
      ],
      ash: [
        "数学模型验证", "RTP计算", "波动性分析", "奖励频率设计",
        "概率分布", "支付表设计", "数学可行性评估"
      ],
      peter: [
        "游戏体验分析", "市场热门游戏", "玩家需求分析", "游戏对比",
        "玩法评价", "用户痛点识别", "游戏趋势"
      ],
      ani: [
        "美术风格设计", "主题视觉概念", "色彩搭配", "UI设计",
        "角色设计", "场景设计", "艺术风格建议"
      ],
      jerry: [
        "图像描述生成", "AI绘图prompt", "技术参数建议", "视觉效果描述",
        "图像构图", "绘图工具使用", "视觉呈现"
      ]
    };
    
    return specialties[roleId] || [];
  }

  private pauseExpert(sessionId: string, params: { roleId: string; reason: string }): FunctionCallResult {
    const { roleId, reason } = params;
    
    const success = this.meetingManager.pauseParticipant(sessionId, roleId);
    
    if (success) {
      return {
        success: true,
        result: `已暂停 ${roleId} 的参与。原因: ${reason}`
      };
    } else {
      return {
        success: false,
        error: `无法暂停 ${roleId}`
      };
    }
  }

  private resumeExpert(sessionId: string, params: { roleId: string; reason: string }): FunctionCallResult {
    const { roleId, reason } = params;
    
    const success = this.meetingManager.resumeParticipant(sessionId, roleId);
    
    if (success) {
      return {
        success: true,
        result: `已重新邀请 ${roleId} 参与讨论。原因: ${reason}`
      };
    } else {
      return {
        success: false,
        error: `无法恢复 ${roleId}`
      };
    }
  }

  private getDiscussionSummary(sessionId: string): FunctionCallResult {
    const stats = this.meetingManager.getSpeakingStats(sessionId);
    const session = this.meetingManager.getSession(sessionId);
    
    return {
      success: true,
      result: {
        message: "讨论摘要",
        participationStats: stats,
        sessionStatus: session?.status,
        activeParticipants: session?.participants.filter(p => p.isActive).length
      }
    };
  }

  private handoverToUser(params: { 
    summary: string;
    final_proposal: string;
    options?: string[];
  }): FunctionCallResult {
    const { summary, final_proposal, options } = params;
    
    return {
      success: true,
      result: {
        message: "经过专家迭代协作，设计方案已完成",
        summary,
        final_proposal,
        options: options || []
      },
      shouldHandoverToUser: true
    };
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
