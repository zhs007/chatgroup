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
    name: "invite_next_speaker",
    description: "邀请指定的AI角色作为下一个发言者。作为主持人，你可以根据讨论内容选择最合适的专家来回应。",
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
          description: "邀请该角色发言的原因，例如'需要游戏设计专家的建议'或'需要数学分析'"
        }
      },
      required: ["roleId", "reason"]
    }
  },
  {
    name: "pause_participant",
    description: "暂停某个参与者的发言权限，通常在他们偏离主题或需要休息时使用。",
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
    name: "resume_participant",
    description: "恢复某个参与者的发言权限。",
    parameters: {
      type: "object",
      properties: {
        roleId: {
          type: "string",
          description: "要恢复的AI角色ID"
        }
      },
      required: ["roleId"]
    }
  },
  {
    name: "get_speaking_stats",
    description: "获取当前会议中各个角色的发言统计，帮助平衡讨论。",
    parameters: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "suggest_balanced_speaker",
    description: "获取建议的下一个发言者，基于发言频率平衡算法。",
    parameters: {
      type: "object",
      properties: {
        excludeRoles: {
          type: "array",
          items: {
            type: "string"
          },
          description: "要排除的角色ID列表"
        }
      },
      required: []
    }
  }
];

export function getFunctionCallPrompt(): string {
  return `
作为会议主持人，你可以使用以下工具来管理讨论：

可用工具：
${MEETING_FUNCTIONS.map(func => `
- ${func.name}: ${func.description}
  参数: ${JSON.stringify(func.parameters.properties, null, 2)}
`).join('\n')}

使用方法：
在你的回复中包含函数调用，格式如下：
<function_call>
{
  "name": "function_name",
  "parameters": {
    "param1": "value1",
    "param2": "value2"
  }
}
</function_call>

注意：
1. 每次回复可以包含多个函数调用
2. 函数调用应该在你的文字回复之后
3. 邀请发言者时要说明原因
4. 要注意平衡各个角色的发言机会
`;
}
