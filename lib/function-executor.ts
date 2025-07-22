import { MeetingManager } from './meeting-manager';
import { documentManager } from './document-manager';
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
    parameters: any,
    currentRoleId?: string
  ): Promise<FunctionCallResult> {
    try {
      switch (functionName) {
        // 会议管理函数
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

        // 文档管理函数
        case 'create_document':
          return this.createDocument(parameters, currentRoleId || 'system');
        
        case 'read_document':
          return this.readDocument(parameters);
        
        case 'update_document':
          return this.updateDocument(parameters, currentRoleId || 'system');
        
        case 'search_documents':
          return this.searchDocuments(parameters);
        
        case 'list_documents':
          return this.listDocuments(parameters);
        
        case 'get_document_versions':
          return this.getDocumentVersions(parameters);
        
        case 'restore_document_version':
          return this.restoreDocumentVersion(parameters, currentRoleId || 'system');
        
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

  // === 文档管理相关方法 ===

  private async createDocument(params: { 
    title: string;
    content: string;
    format: 'markdown' | 'json' | 'yaml' | 'text';
    tags?: string[];
    metadata?: Record<string, any>;
  }, createdBy: string): Promise<FunctionCallResult> {
    try {
      const document = await documentManager.createDocument({
        ...params,
        createdBy
      });
      
      return {
        success: true,
        result: {
          message: `文档 "${document.title}" 已创建`,
          document: {
            id: document.id,
            title: document.title,
            format: document.format,
            tags: document.tags,
            createdAt: document.createdAt
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `创建文档失败: ${error}`
      };
    }
  }

  private async readDocument(params: { documentId: string }): Promise<FunctionCallResult> {
    try {
      const document = await documentManager.getDocument(params.documentId);
      
      if (!document) {
        return {
          success: false,
          error: `文档 ${params.documentId} 不存在`
        };
      }
      
      return {
        success: true,
        result: {
          message: `文档 "${document.title}" 内容`,
          document: {
            id: document.id,
            title: document.title,
            content: document.content,
            format: document.format,
            tags: document.tags,
            metadata: document.metadata,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
            createdBy: document.createdBy,
            lastModifiedBy: document.lastModifiedBy,
            version: document.version
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `读取文档失败: ${error}`
      };
    }
  }

  private async updateDocument(params: { 
    documentId: string;
    title?: string;
    content?: string;
    tags?: string[];
    changeDescription?: string;
  }, lastModifiedBy: string): Promise<FunctionCallResult> {
    try {
      const document = await documentManager.updateDocument(params.documentId, {
        ...params,
        lastModifiedBy
      });
      
      if (!document) {
        return {
          success: false,
          error: `文档 ${params.documentId} 不存在`
        };
      }
      
      return {
        success: true,
        result: {
          message: `文档 "${document.title}" 已更新到版本 ${document.version}`,
          document: {
            id: document.id,
            title: document.title,
            version: document.version,
            updatedAt: document.updatedAt,
            lastModifiedBy: document.lastModifiedBy
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `更新文档失败: ${error}`
      };
    }
  }

  private async searchDocuments(params: {
    query?: string;
    tags?: string[];
    format?: string;
    createdBy?: string;
  }): Promise<FunctionCallResult> {
    try {
      const documents = await documentManager.searchDocuments(params);
      
      return {
        success: true,
        result: {
          message: `找到 ${documents.length} 个文档`,
          documents: documents.map(doc => ({
            id: doc.id,
            title: doc.title,
            format: doc.format,
            tags: doc.tags,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            createdBy: doc.createdBy,
            version: doc.version,
            isArchived: doc.isArchived
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `搜索文档失败: ${error}`
      };
    }
  }

  private async listDocuments(params: { includeArchived?: boolean }): Promise<FunctionCallResult> {
    try {
      const documents = await documentManager.listDocuments(params.includeArchived || false);
      
      return {
        success: true,
        result: {
          message: `当前有 ${documents.length} 个文档`,
          documents: documents.map(doc => ({
            id: doc.id,
            title: doc.title,
            format: doc.format,
            tags: doc.tags,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            createdBy: doc.createdBy,
            version: doc.version,
            isArchived: doc.isArchived
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `获取文档列表失败: ${error}`
      };
    }
  }

  private async getDocumentVersions(params: { documentId: string }): Promise<FunctionCallResult> {
    try {
      const versions = await documentManager.getDocumentVersions(params.documentId);
      
      return {
        success: true,
        result: {
          message: `文档有 ${versions.length} 个版本`,
          versions: versions.map(version => ({
            versionId: version.versionId,
            version: version.version,
            createdAt: version.createdAt,
            createdBy: version.createdBy,
            changeDescription: version.changeDescription
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `获取文档版本失败: ${error}`
      };
    }
  }

  private async restoreDocumentVersion(params: { 
    documentId: string;
    version: number;
  }, restoredBy: string): Promise<FunctionCallResult> {
    try {
      const document = await documentManager.restoreDocumentVersion(
        params.documentId, 
        params.version, 
        restoredBy
      );
      
      if (!document) {
        return {
          success: false,
          error: `无法恢复文档版本，文档或版本不存在`
        };
      }
      
      return {
        success: true,
        result: {
          message: `文档 "${document.title}" 已恢复到版本 ${params.version}，当前版本为 ${document.version}`,
          document: {
            id: document.id,
            title: document.title,
            version: document.version,
            updatedAt: document.updatedAt,
            lastModifiedBy: document.lastModifiedBy
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `恢复文档版本失败: ${error}`
      };
    }
  }
}
