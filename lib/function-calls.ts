export interface FunctionCall {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

export const MEETING_FUNCTIONS: FunctionCall[] = [
  {
    name: "invite_expert",
    description: "根据当前讨论内容邀请最合适的专家参与。支持迭代协作：Tom提出创意→Ash评估→Tom调整→Ash再评估，直到达成一致。",
    parameters: {
      type: "object",
      properties: {
        roleId: {
          type: "string",
          description: "要邀请的AI角色ID (tom, ash, peter, ani, jerry)",
          enum: ["tom", "ash", "peter", "ani", "jerry"]
        },
        reason: {
          type: "string",
          description: "邀请该专家的具体原因和期望他们回应的问题"
        },
        context: {
          type: "string",
          description: "当前讨论的关键信息摘要"
        },
        collaboration_type: {
          type: "string",
          description: "协作类型：initial_proposal(初始提案), review_feedback(评估反馈), iterate_design(迭代设计), final_approval(最终确认)",
          enum: ["initial_proposal", "review_feedback", "iterate_design", "final_approval"]
        }
      },
      required: ["roleId", "reason", "context", "collaboration_type"]
    }
  },
  {
    name: "request_iteration",
    description: "请求专家根据反馈迭代改进设计。用于Tom根据Ash或Ani的建议调整创意的场景。",
    parameters: {
      type: "object",
      properties: {
        roleId: {
          type: "string",
          description: "需要迭代设计的专家ID（通常是tom）"
        },
        feedback_summary: {
          type: "string",
          description: "需要解决的反馈问题总结"
        },
        iteration_focus: {
          type: "string",
          description: "本次迭代的重点，如'数学可行性优化'或'美术风格调整'"
        }
      },
      required: ["roleId", "feedback_summary", "iteration_focus"]
    }
  },
  {
    name: "check_consensus",
    description: "检查专家们是否已达成共识，可以进入下一阶段。例如确认Ash对Tom的创意没有数学问题后，可以进入美术设计阶段。",
    parameters: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description: "要确认共识的主题，如'玩法机制的数学可行性'或'主题的美术设计'"
        },
        participants: {
          type: "array",
          items: {
            type: "string"
          },
          description: "参与该主题讨论的专家ID列表"
        }
      },
      required: ["topic", "participants"]
    }
  },
  {
    name: "get_expert_info",
    description: "获取当前可用专家的详细信息，包括他们的专业领域和最适合处理的问题类型。",
    parameters: {
      type: "object",
      properties: {
        roleId: {
          type: "string",
          description: "特定专家的ID，如果不指定则返回所有专家信息",
          enum: ["tom", "ash", "peter", "ani", "jerry"]
        }
      },
      required: []
    }
  },
  {
    name: "pause_expert",
    description: "暂时让某个专家退出讨论，通常在他们的专业领域不再相关时使用。",
    parameters: {
      type: "object",
      properties: {
        roleId: {
          type: "string",
          description: "要暂停的AI角色ID"
        },
        reason: {
          type: "string",
          description: "暂停的原因"
        }
      },
      required: ["roleId", "reason"]
    }
  },
  {
    name: "resume_expert",
    description: "重新邀请之前暂停的专家参与讨论。",
    parameters: {
      type: "object",
      properties: {
        roleId: {
          type: "string",
          description: "要恢复的AI角色ID"
        },
        reason: {
          type: "string",
          description: "重新邀请的原因"
        }
      },
      required: ["roleId", "reason"]
    }
  },
  {
    name: "get_discussion_summary",
    description: "获取当前讨论的摘要，包括主要观点、已达成的共识和待解决的问题。",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "handover_to_user",
    description: "在专家们达成共识并完成设计后，将决策权交还给用户。",
    parameters: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "所有专家建议和达成共识的总结"
        },
        final_proposal: {
          type: "string",
          description: "经过迭代优化的最终设计方案"
        },
        options: {
          type: "array",
          items: {
            type: "string"
          },
          description: "为用户提供的选项或下一步建议"
        }
      },
      required: ["summary", "final_proposal"]
    }
  }
];

export function getFunctionCallPrompt(): string {
  return `
作为会议主持人，你需要管理迭代协作流程，确保专家们通过多轮讨论达成最佳方案：

迭代协作流程：
1. **玩法设计循环**：
   - Tom提出玩法创意 (collaboration_type: "initial_proposal")
   - Ash评估数学可行性 (collaboration_type: "review_feedback")
   - 如Ash指出问题 → 使用request_iteration让Tom调整
   - Tom调整后 → 再次邀请Ash评估 (collaboration_type: "iterate_design")
   - 重复直到Ash确认没问题 (collaboration_type: "final_approval")

2. **美术设计循环**：
   - Tom提出主题创意 (collaboration_type: "initial_proposal")
   - Ani提供美术建议 (collaboration_type: "review_feedback")
   - 如Ani建议调整 → 使用request_iteration让Tom优化
   - Tom调整后 → 再次邀请Ani评估 (collaboration_type: "iterate_design")
   - 重复直到Ani满意 (collaboration_type: "final_approval")

3. **图像生成阶段**：
   - 设计确定后 → 邀请Jerry生成图像描述

可用工具：
${MEETING_FUNCTIONS.map(func => `
- ${func.name}: ${func.description}
`).join('\n')}

关键原则：
1. 识别何时需要迭代：专家提出具体问题或建议时
2. 使用request_iteration明确要求改进
3. 使用check_consensus确认是否达成共识
4. 只有在所有相关专家都满意后才进入下一阶段
5. 最终使用handover_to_user交还完整的设计方案

使用格式：
<function_call>
{
  "name": "function_name",
  "parameters": {
    "param1": "value1"
  }
}
</function_call>
`;
}
