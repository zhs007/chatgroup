export interface FunctionCall {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

// 文档管理函数
export const DOCUMENT_FUNCTIONS: FunctionCall[] = [
  {
    name: "create_document",
    description: "创建新的项目文档，用于记录设计方案、会议纪要、技术规格等。支持多种格式(markdown/json/yaml/text)。",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "文档标题，应该简洁明确"
        },
        content: {
          type: "string",
          description: "文档内容，可以是文本、JSON、YAML等格式"
        },
        format: {
          type: "string",
          description: "文档格式",
          enum: ["markdown", "json", "yaml", "text"]
        },
        tags: {
          type: "array",
          items: {
            type: "string"
          },
          description: "文档标签，用于分类和搜索"
        },
        metadata: {
          type: "object",
          description: "文档元数据，如类型、优先级等"
        }
      },
      required: ["title", "content", "format"]
    }
  },
  {
    name: "read_document",
    description: "读取指定的项目文档内容。",
    parameters: {
      type: "object",
      properties: {
        documentId: {
          type: "string",
          description: "要读取的文档ID"
        }
      },
      required: ["documentId"]
    }
  },
  {
    name: "update_document",
    description: "更新现有文档内容，会自动创建版本历史。",
    parameters: {
      type: "object",
      properties: {
        documentId: {
          type: "string",
          description: "要更新的文档ID"
        },
        title: {
          type: "string",
          description: "新的文档标题（可选）"
        },
        content: {
          type: "string",
          description: "新的文档内容（可选）"
        },
        tags: {
          type: "array",
          items: {
            type: "string"
          },
          description: "新的标签列表（可选）"
        },
        changeDescription: {
          type: "string",
          description: "本次修改的描述"
        }
      },
      required: ["documentId"]
    }
  },
  {
    name: "search_documents",
    description: "搜索项目文档，支持按关键词、标签、创建者等条件筛选。",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "搜索关键词，会在标题和内容中查找"
        },
        tags: {
          type: "array",
          items: {
            type: "string"
          },
          description: "按标签筛选"
        },
        format: {
          type: "string",
          description: "按格式筛选",
          enum: ["markdown", "json", "yaml", "text"]
        },
        createdBy: {
          type: "string",
          description: "按创建者筛选（角色ID）"
        }
      },
      required: []
    }
  },
  {
    name: "list_documents",
    description: "列出所有可用的项目文档。",
    parameters: {
      type: "object",
      properties: {
        includeArchived: {
          type: "boolean",
          description: "是否包含已归档的文档"
        }
      },
      required: []
    }
  },
  {
    name: "get_document_versions",
    description: "获取文档的版本历史。",
    parameters: {
      type: "object",
      properties: {
        documentId: {
          type: "string",
          description: "文档ID"
        }
      },
      required: ["documentId"]
    }
  },
  {
    name: "restore_document_version",
    description: "将文档恢复到指定版本。",
    parameters: {
      type: "object",
      properties: {
        documentId: {
          type: "string",
          description: "文档ID"
        },
        version: {
          type: "number",
          description: "要恢复的版本号"
        }
      },
      required: ["documentId", "version"]
    }
  }
];

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
作为会议主持人，你需要管理迭代协作流程和项目文档，确保专家们通过多轮讨论达成最佳方案：

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

项目文档管理：
- 所有重要的设计决策、创意方案、技术规格都应记录在项目文档中
- 使用create_document创建新文档（支持markdown/json/yaml/text格式）
- 使用update_document更新文档，系统会自动维护版本历史
- 使用search_documents和list_documents查找相关文档
- 专家可以通过read_document查阅之前的设计方案
- 当需要回顾或参考之前的决策时，使用get_document_versions查看历史版本

可用工具（会议管理）：
${MEETING_FUNCTIONS.map(func => `
- ${func.name}: ${func.description}
`).join('\n')}

可用工具（文档管理）：
${DOCUMENT_FUNCTIONS.map(func => `
- ${func.name}: ${func.description}
`).join('\n')}

关键原则：
1. 识别何时需要迭代：专家提出具体问题或建议时
2. 使用request_iteration明确要求改进
3. 使用check_consensus确认是否达成共识
4. 重要讨论结果应记录到项目文档中
5. 专家应参考已有文档避免重复工作
6. 只有在所有相关专家都满意后才进入下一阶段
7. 最终使用handover_to_user交还完整的设计方案

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
