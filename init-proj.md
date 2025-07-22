# AI Agent 项目生成文档

## 项目基本信息

```yaml
project_name: "ai-chatgroup"
project_type: "next-js-app"
language: "typescript"
description: "Multi-AI roles discussion system for slot game design"
version: "1.0.0"
```

## 技术栈规范

### 必需依赖
```json
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "http_client": "undici (for proxy support)",
  "ai_model": "Gemini 2.0 Flash Exp"
}
```

### 包管理器配置
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "undici": "^6.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint"
  }
}
```

## 项目结构定义

```
project_root/
├── app/                          # Next.js App Router
│   ├── globals.css              # 全局样式
│   ├── layout.tsx               # 根布局组件
│   ├── page.tsx                 # 角色选择页面
│   ├── api/                     # API 路由
│   │   ├── chat/
│   │   │   └── route.ts         # 聊天消息处理 API
│   │   ├── meeting/
│   │   │   └── route.ts         # 会议管理 API
│   │   └── test-roles/
│   │       └── route.ts         # 角色测试 API
│   └── chat/
│       └── page.tsx             # 聊天页面
├── components/                   # React 组件
│   └── MeetingStatus.tsx        # 会议状态显示组件
├── config/                      # 配置文件
│   ├── ai-roles.ts              # AI角色类型定义
│   └── roles/                   # 角色配置目录
│       ├── index.ts             # 角色索引文件
│       ├── jarvis.ts            # 主持人配置
│       ├── tom.ts               # 制作人配置
│       ├── ash.ts               # 数学师配置
│       ├── peter.ts             # 玩家配置
│       ├── ani.ts               # 美术师配置
│       ├── jerry.ts             # 制图师配置
│       └── alex.ts              # 额外角色配置
├── lib/                         # 核心逻辑库
│   ├── function-calls.ts        # Function Call 定义
│   ├── function-executor.ts     # Function Call 执行器
│   ├── gemini-client.ts         # Gemini API 客户端
│   ├── meeting-manager.ts       # 会议管理器
│   └── role-manager.ts          # 角色管理器
├── types/                       # TypeScript 类型定义
│   ├── chat.ts                  # 聊天相关类型
│   └── meeting.ts               # 会议相关类型
├── package.json                 # 包管理文件
├── next.config.js               # Next.js 配置
├── tailwind.config.js           # Tailwind CSS 配置
├── postcss.config.js            # PostCSS 配置
├── tsconfig.json                # TypeScript 配置
├── next-env.d.ts                # Next.js 类型声明
├── .env.local.example           # 环境变量示例
└── README.md                    # 项目说明文档
```

## 核心功能规范

### 1. 页面功能定义

#### 角色选择页面 (`/`)
```yaml
purpose: "用户选择参与讨论的AI角色"
features:
  - 展示所有可用AI角色卡片
  - 角色描述、专业领域、头像显示
  - 多选功能（Jarvis为必选）
  - 至少选择2个角色才能开始
  - 响应式设计，移动端友好
ui_style: "渐变背景，卡片式布局，现代化设计"
```

#### 聊天页面 (`/chat`)
```yaml
purpose: "AI角色协作讨论界面"
features:
  - 实时消息显示
  - SSE流式响应（打字机效果）
  - 用户输入框
  - 会议状态显示
  - 角色头像和消息气泡
  - 处理中状态提示
  - 自动滚动到最新消息
ui_style: "聊天应用界面，消息气泡，状态指示器"
```

### 2. AI角色系统规范

#### 角色配置接口
```typescript
interface AIRole {
  id: string;          // 唯一标识符
  name: string;        // 显示名称
  description: string; // 角色描述
  model: string;       // AI模型名称
  prompt: string;      // 系统提示词
  avatar: string;      // 头像emoji/图标
  color: string;       // 主题颜色类名
}
```

#### 必需角色列表
```yaml
roles:
  jarvis:
    name: "Jarvis"
    type: "主持人（必选）"
    model: "gemini-2.0-flash-exp"
    capabilities: ["会议管理", "Function Call", "流程控制"]
    
  tom:
    name: "Tom"
    type: "资深Slot Game制作人"
    model: "gemini-2.0-flash-exp"
    capabilities: ["游戏创意", "玩法设计", "市场分析"]
    
  ash:
    name: "Ash"
    type: "资深数学制作人"
    model: "gemini-2.0-flash-exp"
    capabilities: ["数学验证", "RTP计算", "风险评估"]
    
  peter:
    name: "Peter"
    type: "资深Slot游戏玩家"
    model: "gemini-2.0-flash-exp"
    capabilities: ["玩家体验", "游戏对比", "市场洞察"]
    
  ani:
    name: "Ani"
    type: "资深美术设计师"
    model: "gemini-2.0-flash-exp"
    capabilities: ["美术概念", "风格设计", "AI绘图prompt"]
    
  jerry:
    name: "Jerry"
    type: "制图师"
    model: "gemini-2.0-flash-exp"
    capabilities: ["图像描述", "技术参数", "prompt优化"]
```

### 3. Function Call 系统规范

#### Jarvis 可用工具
```yaml
function_calls:
  invite_expert:
    purpose: "邀请专家参与讨论"
    parameters: ["roleId", "reason", "context", "collaboration_stage"]
    
  request_iteration:
    purpose: "请求专家迭代改进设计"
    parameters: ["roleId", "feedback", "improvement_areas"]
    
  check_consensus:
    purpose: "检查专家共识状态"
    parameters: ["topic", "participating_roles"]
    
  get_expert_info:
    purpose: "获取专家信息"
    parameters: ["roleId"]
    
  pause_expert:
    purpose: "暂停专家参与"
    parameters: ["roleId", "reason"]
    
  resume_expert:
    purpose: "恢复专家参与"
    parameters: ["roleId"]
    
  get_discussion_summary:
    purpose: "获取讨论摘要"
    parameters: ["time_range"]
    
  handover_to_user:
    purpose: "交还最终方案"
    parameters: ["final_proposal", "summary"]
```

### 4. API 端点规范

#### `/api/chat` POST
```yaml
purpose: "处理聊天消息"
request_body:
  message: string
  roleId: string
  sessionId: string
  selectedRoles: string[]
response: "SSE流式响应"
features: ["消息处理", "角色路由", "Function Call执行"]
```

#### `/api/meeting` GET/POST
```yaml
purpose: "会议管理"
endpoints:
  GET: "获取会议状态"
  POST: "更新会议状态"
features: ["会话管理", "参与者状态", "发言统计"]
```

## 环境配置要求

### 必需环境变量
```bash
# .env.local
GOOGLE_API_KEY=your_gemini_api_key_here

# 可选配置
HTTP_PROXY=http://proxy:port
HTTPS_PROXY=http://proxy:port
NODE_ENV=development
```

### 配置文件要求
```yaml
next_config:
  - 支持环境变量
  - 优化打包配置
  - 代理设置支持
  
tailwind_config:
  - 自定义颜色主题
  - 响应式断点
  - 组件样式扩展
  
typescript_config:
  - 严格模式
  - 路径别名 (@/)
  - 类型检查优化
```

## 开发规范

### 代码规范
```yaml
typescript:
  - 使用严格类型检查
  - 定义完整的接口
  - 避免any类型
  
react:
  - 使用函数组件和Hooks
  - 合理的状态管理
  - 性能优化（useMemo, useCallback）
  
styling:
  - 使用Tailwind CSS类名
  - 响应式设计原则
  - 一致的设计语言
```

### 错误处理
```yaml
api_errors:
  - 统一错误格式
  - 适当的HTTP状态码
  - 用户友好的错误信息
  
client_errors:
  - Try-catch包装
  - 加载状态显示
  - 重试机制
```

## 部署要求

### 开发环境
```bash
npm install
npm run dev
# 服务器运行在 http://localhost:3000
```

### 生产环境
```bash
npm run build
npm start
# 或部署到 Vercel/Netlify 等平台
```

## 测试要求

### 功能测试点
```yaml
role_selection:
  - 角色卡片正确显示
  - 多选功能正常
  - 必选角色限制
  
chat_functionality:
  - 消息发送接收
  - SSE流式响应
  - 角色切换逻辑
  
meeting_management:
  - Function Call执行
  - 会议状态管理
  - 错误处理
```

## AI Agent 生成指令

作为 AI Agent，按以下顺序生成项目：

1. **初始化项目结构**：创建目录和基础配置文件
2. **安装依赖**：根据package.json配置安装所有依赖
3. **生成类型定义**：创建TypeScript接口和类型文件
4. **实现核心库**：按优先级实现role-manager, meeting-manager等
5. **创建角色配置**：生成所有AI角色的配置文件
6. **实现API路由**：创建聊天和会议管理API
7. **构建前端页面**：实现角色选择和聊天界面
8. **集成Function Call**：实现Jarvis的工具调用系统
9. **样式和UI**：应用Tailwind CSS样式
10. **测试和优化**：确保所有功能正常运行

### 关键注意事项
- 确保所有文件路径和导入正确
- 实现完整的错误处理
- 保持代码的模块化和可维护性
- 遵循TypeScript最佳实践
- 确保UI的响应式和用户友好性

## AI 角色间沟通协议

### 角色协作通信格式

#### 1. 标准沟通模板
```yaml
communication_template:
  sender: string          # 发送方角色ID
  receiver: string        # 接收方角色ID (可为多个)
  type: string           # 通信类型
  context: object        # 上下文信息
  request: object        # 具体请求内容
  metadata: object       # 元数据信息
```

#### 2. 通信类型定义
```yaml
communication_types:
  initial_proposal:
    description: "首次提出设计方案"
    flow: "发起者 → 评估者"
    
  review_feedback:
    description: "评估反馈和建议"
    flow: "评估者 → 设计者"
    
  iterate_design:
    description: "基于反馈的迭代改进"
    flow: "设计者 → 评估者"
    
  final_approval:
    description: "最终确认和批准"
    flow: "评估者 → 设计者/主持人"
    
  collaboration_request:
    description: "请求协作支持"
    flow: "任意角色 → 目标角色"
    
  information_query:
    description: "信息查询和澄清"
    flow: "任意角色 → 目标角色"
```

### 具体角色间沟通规范

#### Tom → Ash (游戏设计 → 数学验证)

##### Tom 提出玩法设计
```json
{
  "sender": "tom",
  "receiver": "ash", 
  "type": "initial_proposal",
  "context": {
    "design_phase": "gameplay_mechanics",
    "game_theme": "Egyptian Slots",
    "target_audience": "casual players",
    "discussion_id": "session_001"
  },
  "request": {
    "action": "mathematical_review",
    "design_elements": {
      "base_game": {
        "reels": 5,
        "rows": 3,
        "paylines": 25,
        "bet_range": "0.25 - 100",
        "symbols": ["A", "K", "Q", "J", "10", "Pharaoh", "Pyramid", "Scarab", "Ankh", "Wild", "Scatter"]
      },
      "special_features": {
        "wild_symbol": {
          "substitution": "all symbols except scatter",
          "multiplier": "2x in winning combinations"
        },
        "free_spins": {
          "trigger": "3+ scatter symbols",
          "award": "10 free spins",
          "multiplier": "3x all wins"
        },
        "bonus_game": {
          "trigger": "3+ pyramid symbols on reels 1,3,5",
          "type": "pick_and_click",
          "prizes": "cash prizes up to 500x bet"
        }
      },
      "target_rtp": "96.5%",
      "volatility": "medium-high"
    },
    "specific_questions": [
      "请验证目标RTP是否可达成",
      "评估波动性设计是否合理", 
      "检查特殊功能的数学平衡性",
      "建议优化方案"
    ]
  },
  "metadata": {
    "timestamp": "2025-01-20T10:30:00Z",
    "priority": "high",
    "expected_response_time": "within 5 minutes"
  }
}
```

##### Ash 的数学验证反馈
```json
{
  "sender": "ash",
  "receiver": "tom",
  "type": "review_feedback", 
  "context": {
    "reference_design": "tom_egyptian_slots_v1",
    "analysis_completed": true,
    "concerns_identified": true
  },
  "request": {
    "action": "design_iteration_required",
    "analysis_results": {
      "rtp_analysis": {
        "calculated_rtp": "97.8%",
        "target_rtp": "96.5%",
        "variance": "+1.3%",
        "status": "exceeds_target"
      },
      "volatility_assessment": {
        "calculated_volatility": "high",
        "target_volatility": "medium-high", 
        "max_win_potential": "2000x bet",
        "hit_frequency": "28.5%",
        "status": "acceptable_but_optimizable"
      },
      "feature_balance": {
        "wild_multiplier": {
          "impact": "significant_rtp_boost",
          "recommendation": "reduce to 1.5x or limit frequency"
        },
        "free_spins": {
          "trigger_frequency": "4.2%",
          "average_payout": "45x bet",
          "status": "well_balanced"
        },
        "bonus_game": {
          "trigger_frequency": "1.8%", 
          "max_payout": "500x bet",
          "status": "acceptable"
        }
      }
    },
    "recommendations": [
      {
        "issue": "RTP过高",
        "suggestion": "将Wild倍数从2x降至1.5x",
        "impact": "预计降低RTP约1.1%"
      },
      {
        "issue": "波动性控制",
        "suggestion": "增加低价值符号出现频率",
        "impact": "平滑支付分布"
      },
      {
        "issue": "平衡优化",
        "suggestion": "调整符号权重表",
        "impact": "更好的玩家体验"
      }
    ],
    "approval_status": "conditional",
    "next_steps": "请根据建议调整设计后重新提交"
  },
  "metadata": {
    "calculation_method": "Monte Carlo simulation",
    "sample_size": "10M spins",
    "confidence_level": "99.5%"
  }
}
```

##### Tom 的迭代改进
```json
{
  "sender": "tom",
  "receiver": "ash",
  "type": "iterate_design",
  "context": {
    "iteration_round": 2,
    "previous_feedback": "ash_review_001",
    "changes_implemented": true
  },
  "request": {
    "action": "re_review_updated_design",
    "design_changes": {
      "wild_symbol": {
        "multiplier": "1.5x (reduced from 2x)",
        "rationale": "降低RTP影响"
      },
      "symbol_weights": {
        "low_value_symbols": "increased frequency by 15%",
        "high_value_symbols": "reduced frequency by 8%",
        "rationale": "平滑波动性"
      },
      "paytable_adjustment": {
        "five_of_a_kind_pharaoh": "reduced from 1000x to 800x",
        "rationale": "进一步控制最大赢取"
      }
    },
    "updated_targets": {
      "expected_rtp": "96.4%",
      "expected_volatility": "medium-high",
      "max_win_reduced_to": "1600x bet"
    },
    "confirmation_request": [
      "请确认新的RTP计算",
      "验证波动性是否达到目标",
      "评估整体平衡性"
    ]
  },
  "metadata": {
    "iteration_number": 2,
    "changes_summary": "Wild倍数降低，符号权重调整，支付表优化"
  }
}
```

#### Tom → Ani (游戏设计 → 美术协作)

##### Tom 请求美术支持
```json
{
  "sender": "tom", 
  "receiver": "ani",
  "type": "collaboration_request",
  "context": {
    "design_phase": "visual_concept",
    "game_mechanics_status": "approved_by_ash",
    "theme_direction": "Ancient Egypt"
  },
  "request": {
    "action": "visual_design_consultation",
    "game_overview": {
      "theme": "Egyptian mythology and treasures",
      "mood": "mysterious, adventurous, luxurious", 
      "target_audience": "25-45 years, worldwide",
      "platform": "desktop and mobile"
    },
    "visual_requirements": {
      "symbol_design": {
        "low_value": ["A", "K", "Q", "J", "10"],
        "high_value": ["Pharaoh", "Pyramid", "Scarab", "Ankh"],
        "special": ["Wild (Eye of Horus)", "Scatter (Golden Mask)"]
      },
      "background_setting": {
        "location": "inside pyramid chamber",
        "atmosphere": "golden light, mystical ambiance",
        "elements": ["hieroglyphs", "torch lighting", "treasure"]
      },
      "ui_elements": {
        "style": "elegant, premium feel",
        "color_palette": "gold, deep blue, rich browns",
        "typography": "Egyptian-inspired but readable"
      }
    },
    "specific_requests": [
      "建议具体的艺术风格方向",
      "色彩搭配和视觉层次",
      "符号设计的艺术指导",
      "UI界面的美术风格",
      "移动端适配考虑"
    ],
    "constraints": {
      "symbol_clarity": "must be recognizable at small sizes",
      "cultural_sensitivity": "respectful representation of Egyptian culture",
      "brand_consistency": "fits with casino platform aesthetic"
    }
  },
  "metadata": {
    "reference_materials": ["existing Egyptian slots analysis", "competitor research"],
    "timeline": "concept needed within 3 rounds of discussion"
  }
}
```

#### Ani → Jerry (美术概念 → 图像实现)

##### Ani 向Jerry传递美术指导
```json
{
  "sender": "ani",
  "receiver": "jerry", 
  "type": "creative_handoff",
  "context": {
    "project": "Egyptian Slots Visual Design",
    "approval_status": "concept approved by Tom",
    "next_phase": "detailed image generation"
  },
  "request": {
    "action": "generate_detailed_prompts",
    "art_direction": {
      "overall_style": {
        "aesthetic": "Cinematic Egyptian realism with fantasy elements",
        "rendering": "High-quality 3D render with painted textures",
        "lighting": "Warm golden hour lighting with mystical glow",
        "color_grading": "Rich golds, deep blues, warm browns"
      },
      "symbol_specifications": {
        "pharaoh_mask": {
          "description": "Golden death mask of pharaoh, ornate details",
          "style_notes": "Similar to Tutankhamun's mask but original design",
          "technical_specs": "512x512px, transparent background, high contrast"
        },
        "pyramid": {
          "description": "Stepped pyramid with golden capstone",
          "style_notes": "Dramatic lighting from above, mystical energy",
          "technical_specs": "Clear silhouette, readable at 64x64px"
        },
        "wild_symbol": {
          "description": "Eye of Horus with golden frame and blue gemstone",
          "style_notes": "Glowing effect, premium feel",
          "animation_hint": "Subtle pulsing glow for special states"
        }
      },
      "background_design": {
        "main_scene": "Interior of pyramid burial chamber",
        "key_elements": ["hieroglyph walls", "golden artifacts", "torch flames"],
        "atmosphere": "Mysterious but inviting, treasure-filled",
        "composition": "Depth layers for parallax scrolling"
      }
    },
    "technical_requirements": {
      "image_formats": ["PNG with transparency", "WEBP for web"],
      "resolution_needs": ["1024x1024 for symbols", "1920x1080 for backgrounds"],
      "mobile_optimization": "Ensure readability on 375px width screens",
      "file_size_limits": "Under 500KB per asset"
    },
    "deliverable_requests": [
      "为每个符号生成详细的AI绘图prompt",
      "背景场景的分层描述",
      "UI元素的风格指导", 
      "色彩代码和渐变定义",
      "移动端优化建议"
    ]
  },
  "metadata": {
    "style_references": ["Assassin's Creed Origins", "Book of Ra Deluxe", "Lara Croft Temple series"],
    "brand_guidelines": "Premium casino aesthetic, avoid cartoon style"
  }
}
```

### 沟通质量标准

#### 必需信息要素
```yaml
required_elements:
  context_clarity:
    - 明确的项目阶段
    - 相关的历史决策
    - 当前状态描述
    
  specific_requests:
    - 具体的行动要求
    - 可测量的目标
    - 明确的评估标准
    
  technical_details:
    - 精确的参数规格
    - 约束条件说明
    - 质量要求定义
    
  collaboration_info:
    - 时间要求
    - 优先级指示
    - 后续步骤计划
```

#### 响应质量要求
```yaml
response_standards:
  completeness:
    - 回答所有提出的问题
    - 提供详细的分析过程
    - 给出明确的建议或决策
    
  professional_format:
    - 使用标准化的JSON结构
    - 包含必要的元数据
    - 保持一致的术语使用
    
  actionable_output:
    - 提供具体的下一步行动
    - 明确的批准/拒绝状态
    - 可执行的改进建议
```

### 协作流程控制

#### 迭代循环管理
```yaml
iteration_control:
  max_iterations: 3
  escalation_trigger: "超过3轮未达成共识"
  escalation_target: "jarvis (主持人)"
  
  convergence_criteria:
    - 技术指标达到目标范围
    - 所有关键问题得到解决
    - 相关专家明确表示批准
    
  timeout_handling:
    - 单轮响应时间: 5分钟
    - 总协作时间: 15分钟
    - 超时后自动升级到主持人
```

## 项目文档管理器规范

### 文档管理器架构
```yaml
document_manager:
  purpose: "集中管理所有项目文档，提供统一的读写接口"
  location: "/lib/document-manager.ts"
  
  core_functions:
    - create_document: "创建新文档"
    - read_document: "读取文档内容"
    - update_document: "更新文档内容"
    - list_documents: "列出所有文档"
    - archive_document: "归档文档版本"
    - search_documents: "搜索文档内容"
```

### AI 角色与文档管理器交互
```yaml
agent_document_interaction:
  all_agents_can_access: true
  interaction_method: "Function Call"
  
  available_functions:
    read_project_document:
      purpose: "读取项目文档"
      parameters: ["document_id", "version?"]
      
    write_project_document:
      purpose: "写入/更新项目文档"
      parameters: ["document_id", "content", "description"]
      
    search_project_documents:
      purpose: "搜索文档内容"
      parameters: ["query", "document_type?"]
      
    list_project_documents:
      purpose: "列出所有文档"
      parameters: ["filter?", "category?"]
      
    create_document_version:
      purpose: "创建文档新版本"
      parameters: ["document_id", "changes_summary"]
```

### 文档类型定义
```yaml
document_types:
  game_design:
    format: "YAML"
    template: "game_design_template.yml"
    versioning: true
    
  evaluation_report:
    format: "JSON"
    template: "evaluation_template.json"
    versioning: true
    
  visual_concept:
    format: "JSON"
    template: "visual_concept_template.json"
    versioning: false
    
  meeting_notes:
    format: "Markdown"
    template: "meeting_notes_template.md"
    versioning: false
    
  final_proposal:
    format: "YAML"
    template: "final_proposal_template.yml"
    versioning: true
```

### 文档存储结构
```yaml
document_storage:
  location: "/documents/"
  structure:
    current/
      game_designs/
      evaluations/
      visual_concepts/
      meeting_notes/
      proposals/
    archive/
      [timestamp]/
        [document_type]/
    templates/
      game_design_template.yml
      evaluation_template.json
      visual_concept_template.json
```
