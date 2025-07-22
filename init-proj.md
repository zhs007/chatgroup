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
