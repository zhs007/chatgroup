# AI Chat Group - Slot Game Design 项目设计文档

## 项目概述

这是一个支持多个 AI角色 一起讨论 slot game 设计的项目，用户可以和多个 AI角色 在一个群里聊天。通过智能的会议管理系统，实现专业化的游戏设计协作流程。

## 技术架构

### 后端技术栈
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **AI模型**: Gemini 2.0 Flash Exp（第一阶段），后期支持 ChatGPT 等
- **环境配置**: API KEY 配置在环境变量 (.env.local)
- **网络**: 使用 undici 库支持代理访问 Gemini API
- **样式**: Tailwind CSS + PostCSS + Autoprefixer

### 前端架构
- **页面路由**: App Router 结构
  - `/` - 角色选择页面
  - `/chat` - 聊天页面
- **状态管理**: React Hooks (useState, useEffect, useRef)
- **实时通信**: Server-Sent Events (SSE) 实现打字机效果
- **响应式设计**: 移动端友好的渐变背景和卡片布局

### 核心功能特性
1. **智能会议管理**: Jarvis 主持人通过 Function Call 智能管理讨论流程
2. **实时聊天**: SSE 流式响应，AI 处理状态显示
3. **角色管理系统**: 模块化的角色配置和动态加载
4. **迭代协作**: 支持专家间多轮反馈和改进循环
5. **发言统计**: 实时监控各角色参与情况
6. **会议状态管理**: 完整的会话生命周期管理

## 角色配置系统

每个 AI 角色都有独立的配置文件，采用模块化设计：
- 配置位置: `/config/roles/` 目录
- 统一接口: `AIRole` 类型定义
- 动态加载: 通过 `RoleManager` 类管理
- 角色索引: `/config/roles/index.ts` 集中导出

### 角色配置结构
```typescript
interface AIRole {
  id: string;          // 角色唯一标识
  name: string;        // 显示名称
  description: string; // 角色描述
  model: string;       // 使用的AI模型
  prompt: string;      // 角色提示词
  avatar: string;      // 头像图标
  color: string;       // 主题色彩
}
```

## AI 角色设计

### 第一阶段角色配置

#### 主持人 Jarvis （必选角色）
- **职责**: 智能主持会议，通过 Function Call 管理发言顺序和讨论流程
- **模型**: gemini-2.0-flash-exp
- **核心能力**: 
  - 分析讨论内容，自动邀请合适专家参与
  - 管理迭代协作流程（设计→反馈→改进→再评估）
  - 监控发言平衡，确保所有角色充分参与
  - 最终整合各专家意见，交还完整方案
- **Function Call 工具**: invite_expert, request_iteration, check_consensus, handover_to_user 等

#### 资深 Slot Game 制作人 Tom
- **职责**: 提出具体的游戏创意和玩法机制设计
- **模型**: gemini-2.0-flash-exp
- **专业领域**: 游戏机制、特色功能、市场趋势分析
- **协作关系**: 与 Ash 协作玩法数学验证，与 Ani 协作美术整合

#### 资深数学制作人 Ash
- **职责**: 从数学角度评判设计可行性，属于反思者角色
- **模型**: gemini-2.0-flash-exp
- **专业领域**: RTP 计算、波动性控制、数学模型验证
- **核心价值**: 确保游戏的数学平衡和商业可行性

#### 资深 Slot 游戏玩家 Peter
- **职责**: 了解大量 Slot 游戏，提供玩家视角的见解
- **模型**: gemini-2.0-flash-exp
- **专业领域**: 游戏体验分析、市场热门游戏对比
- **使用场景**: 当用户提到"像什么游戏"时，由他来提供参考和分析

#### 资深美术设计师 Ani
- **职责**: 快速输出美术概念，精通各种艺术风格
- **模型**: gemini-2.0-flash-exp
- **专业领域**: 艺术风格设计、色彩搭配、UI/UX、AI 绘图 prompt 创作
- **核心技能**: 输出精准的美术方向指导

#### 制图师 Jerry
- **职责**: 根据 Ani 的美术概念，生成具体的图像描述和技术参数
- **模型**: gemini-2.0-flash-exp
- **专业领域**: AI 绘图 prompt 优化、技术参数建议
- **工作流程**: 接收 Ani 的概念 → 转化为可执行的图像生成指令

## 智能会议管理系统

### 迭代协作流程
项目的核心创新在于实现了真正的 AI 专家间协作，而不是简单的对话：

```
用户输入想法 → Tom 初始设计 → 专家评估反馈 → Tom 迭代改进 → 循环直到共识 → 交还最终方案
```

#### 具体协作示例：
1. **玩法设计循环**: Tom 提出创意 → Ash 评估数学可行性 → 如有问题，Tom 调整 → Ash 再评估 → 循环直到确认 OK
2. **美术设计循环**: Tom 提出主题 → Ani 给美术建议 → Tom 优化整合 → Ani 再评估 → 循环直到满意
3. **最终整合**: 所有专业领域都达成共识后，Jarvis 交还完整方案给用户

### Function Call 工具集
主持人 Jarvis 通过以下工具实现智能会议管理：

- `invite_expert`: 根据讨论内容邀请最合适的专家参与
- `request_iteration`: 请求专家根据反馈迭代改进设计  
- `check_consensus`: 检查专家是否达成共识，可否进入下一阶段
- `get_expert_info`: 获取专家的详细信息和专业领域
- `pause_expert` / `resume_expert`: 动态管理专家参与状态
- `get_discussion_summary`: 获取当前讨论的关键要点摘要
- `handover_to_user`: 交还最终完整方案给用户

## 技术实现细节

### 项目结构
```
/app                     # Next.js App Router
  /api                   # API 路由
    /chat/route.ts      # 聊天消息处理
    /meeting/route.ts   # 会议管理 API
  /chat/page.tsx        # 聊天页面
  /globals.css          # 全局样式
  /layout.tsx           # 根布局
  /page.tsx             # 角色选择页面

/components              # React 组件
  /MeetingStatus.tsx    # 会议状态显示组件

/config                 # 配置文件
  /ai-roles.ts          # 角色类型定义
  /roles/               # 各角色配置文件
    /index.ts           # 角色索引
    /jarvis.ts          # 主持人配置
    /tom.ts             # 制作人配置
    /ash.ts             # 数学师配置
    /peter.ts           # 玩家配置
    /ani.ts             # 美术师配置
    /jerry.ts           # 制图师配置

/lib                    # 核心逻辑库
  /function-calls.ts    # Function Call 定义
  /function-executor.ts # Function Call 执行器
  /gemini-client.ts     # Gemini API 客户端
  /meeting-manager.ts   # 会议管理器
  /role-manager.ts      # 角色管理器

/types                  # TypeScript 类型定义
  /chat.ts              # 聊天相关类型
  /meeting.ts           # 会议相关类型
```

### 核心功能实现

#### 1. SSE 流式响应
```typescript
// 实现打字机效果的 SSE 流
const response = new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  },
});
```

#### 2. 角色动态加载
```typescript
// 通过 RoleManager 实现角色的动态加载和管理
const roleManager = RoleManager.getInstance();
await roleManager.loadRoles();
const role = await roleManager.getRole(roleId);
```

#### 3. 会议状态管理
```typescript
// MeetingManager 管理整个会话的生命周期
const meetingManager = MeetingManager.getInstance();
const session = await meetingManager.createSession(sessionId, roleIds);
```

#### 4. Function Call 执行
```typescript
// FunctionExecutor 处理 Jarvis 的工具调用
const executor = new FunctionExecutor(sessionId);
const result = await executor.executeFunction(functionCall);
```

## 环境配置

### 必需的环境变量
```bash
# .env.local
GOOGLE_API_KEY=your_gemini_api_key_here

# 可选: 代理配置（如需要）
HTTP_PROXY=http://your-proxy:port
HTTPS_PROXY=http://your-proxy:port
```

### 开发依赖
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0", 
    "react-dom": "^18.2.0",
    "undici": "^6.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0"
  }
}
```

## 开发指南

### 启动开发服务器
```bash
npm install
npm run dev
```

### 添加新角色
1. 在 `/config/roles/` 创建新的角色配置文件
2. 在 `/config/roles/index.ts` 中导出新角色
3. 配置角色的 prompt、模型和专业能力

### 扩展 Function Call 
1. 在 `/lib/function-calls.ts` 中定义新的工具
2. 在 `/lib/function-executor.ts` 中实现执行逻辑
3. 更新 Jarvis 的 prompt 以包含新工具的使用说明

### 支持新的 AI 模型
1. 在 `/lib/` 目录下创建新的客户端文件
2. 更新角色配置中的 model 字段
3. 在 API 路由中添加模型选择逻辑

## 未来规划

### 第二阶段功能
- [ ] 支持 ChatGPT、Claude 等更多 AI 模型
- [ ] 增加图像生成集成 (Jerry 角色的实际出图功能)
- [ ] 会话历史保存和回放
- [ ] 更多专业角色 (音效师、程序员等)
- [ ] 多语言支持

### 技术优化
- [ ] 数据库持久化存储
- [ ] 更精细的错误处理和重试机制
- [ ] 性能监控和分析
- [ ] 单元测试和集成测试
- [ ] Docker 容器化部署

## 特色亮点

1. **真正的 AI 协作**: 不是简单的多轮对话，而是有明确分工和协作流程的专家团队
2. **智能流程管理**: Jarvis 通过 Function Call 实现真正的会议主持和流程控制
3. **迭代驱动**: 支持多轮反馈和改进，确保设计质量
4. **专业化分工**: 每个角色都有明确的专业领域和职责边界
5. **现代化技术栈**: 使用最新的 Next.js 14、TypeScript、Tailwind CSS 等技术
