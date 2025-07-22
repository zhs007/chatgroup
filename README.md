# AI 聊天群组 - Slot 游戏设计协### 3. 智能协作流程
- 🔄 迭代设计循环：Tom 提案 → Ash 评估 → Tom 调整 → 最终确认
- 🎨 美术协作循环：Tom 创意 → Ani 建议 → Tom 优化 → 美术确认  
- 📝 自动文档记录和版本管理
- 🤝 专家间通过函数调用交换结构化数据

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 环境配置
创建 `.env.local` 文件并配置：
```
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_PROXY_URL=https://your-proxy-url.com/v1beta  # 可选代理
```

### 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 开始使用

## 📚 使用指南

### 1. 开始新的设计讨论
1. 在首页选择参与的 AI 角色
2. 点击"开始讨论"进入聊天页面
3. 描述您的 Slot 游戏想法
4. Jarvis 会自动邀请合适的专家参与

### 2. 文档管理
1. 点击"📁 项目文档管理"进入文档系统
2. 创建新文档记录设计方案
3. 搜索和查看历史文档
4. 查看版本历史和变更记录

### 3. AI 协作工作流
```
用户描述想法 
    ↓
Jarvis 邀请 Tom 提出设计方案
    ↓
Tom 创建设计文档 (create_document)
    ↓
Jarvis 邀请 Ash 验证数学可行性
    ↓
Ash 阅读设计文档 (read_document) 并评估
    ↓
如有问题 → Tom 迭代优化 (update_document)
    ↓
Ash 确认 → 进入美术设计阶段
    ↓
Ani 提供美术建议并更新文档
    ↓
最终方案确认并交还用户
```

## 📄 文档管理功能

### 支持的文档格式
- **Markdown** - 设计方案、会议纪要
- **JSON** - 数学模型、配置数据
- **YAML** - 结构化设计规格
- **Text** - 简单文本记录

### 版本控制
- 自动版本号管理
- 变更描述记录
- 历史版本查看
- 版本恢复功能

## 🧪 测试

运行文档管理器测试：
```bash
node test-document-manager.js
```

---

**享受与 AI 专家团队的协作设计体验！** 🎉这是一个支持多个 AI 角色协作设计 Slot 游戏的系统，具备完整的项目文档管理功能。AI专家们通过函数调用进行结构化协作，所有设计决策都会被记录到项目文档中，支持版本管理和历史追踪。

## 🎯 核心功能

### 1. 多AI角色协作
- 🤖 **主持人 Jarvis** - 管理会议流程和迭代协作
- 🎮 **制作人 Tom** - 负责游戏创意和设计
- 📊 **数学专家 Ash** - 验证数学模型和可行性
- 🎨 **美术师 Ani** - 提供美术设计建议
- 🖼️ **制图师 Jerry** - 生成图像描述
- 🎯 **玩家专家 Peter** - 提供游戏体验分析

### 2. 项目文档管理系统
- ✅ 多格式文档支持 (Markdown, JSON, YAML, Text)
- ✅ 版本控制和历史记录
- ✅ 搜索和标签管理
- ✅ 文档归档和恢复
- ✅ 实时协作和同步
- ✅ 函数调用集成

### 3. 智能协作流程
- � 迭代设计循环：Tom 提案 → Ash 评估 → Tom 调整 → 最终确认
- 🎨 美术协作循环：Tom 创意 → Ani 建议 → Tom 优化 → 美术确认  
- 📝 自动文档记录和版本管理
- 🤝 专家间通过函数调用交换结构化数据
- 🔄 **自动角色切换**: 主持人根据讨论内容自动邀请合适的专家发言
- 🎨 **现代化UI**: 使用Tailwind CSS构建的美观界面
- 🌐 **代理支持**: 支持通过代理访问Gemini API

## AI角色介绍

### 主持人 Jarvis (必选)
- **职责**: 主持会议，通过Function Call智能管理发言顺序
- **模型**: gemini-2.0-flash-exp
- **特点**: 
  - 智能分析讨论内容，自动邀请合适的专家
  - 监控发言平衡，确保所有角色都有参与机会
  - 使用工具管理会议流程

### 资深Slot Game制作人 Tom
- **职责**: 提出具体的游戏创意和玩法设计
- **专长**: 游戏机制设计、市场趋势分析
- **模型**: gemini-2.0-flash-exp

### 资深数学制作人 Ash
- **职责**: 从数学角度评判设计的可行性
- **专长**: RTP计算、波动性控制、数学模型验证
- **模型**: gemini-2.0-flash-exp
- **角色**: 反思者，确保设计的数学平衡

### 资深Slot游戏玩家 Peter
- **职责**: 从玩家角度提供见解和建议
- **专长**: 游戏体验分析、市场热门游戏了解
- **模型**: gemini-2.0-flash-exp

### 资深美术设计师 Ani
- **职责**: 提供美术概念和视觉设计建议
- **专长**: 艺术风格设计、UI/UX、AI绘图prompt创作
- **模型**: gemini-2.0-flash-exp

### 制图师 Jerry
- **职责**: 根据美术概念生成具体的图像描述
- **专长**: AI绘图prompt优化、技术参数建议
- **模型**: gemini-2.0-flash-exp

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **开发语言**: TypeScript
- **样式框架**: Tailwind CSS
- **AI模型**: Google Gemini (gemini-2.0-flash-exp)
- **网络库**: undici (支持代理)
- **流式响应**: Server-Sent Events (SSE)

## 安装和运行

### 1. 环境要求

- Node.js 18+ 
- npm 或 yarn

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

复制环境变量模板：
```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入必要的配置：
```bash
# 必填：Gemini API密钥
GEMINI_API_KEY=your_gemini_api_key_here

# 可选：如果需要代理访问
PROXY_URL=http://your-proxy-url:port
```

### 4. 获取Gemini API密钥

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建新的API密钥
3. 将密钥复制到 `.env.local` 文件中

### 5. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用说明

### 1. 选择AI角色
- 在首页选择您希望参与讨论的AI角色
- 主持人Jarvis会自动参与
- 建议至少选择2-3个角色以获得更丰富的讨论

### 2. 开始讨论
- 描述您对slot游戏的想法或需求
- Jarvis会智能分析您的需求，自动邀请最合适的专家参与
- 系统会自动管理发言顺序，确保讨论的连贯性

### 3. 智能互动
- Jarvis会根据讨论内容使用Function Call工具
- 自动邀请相关专家，如：游戏设计问题邀请Tom，数学问题邀请Ash
- 监控发言平衡，确保每个角色都有发言机会
- 支持实时查看发言统计

## 项目结构

```
chatgroup/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── chat/          # 聊天API路由
│   │   └── meeting/       # 会议管理API
│   ├── chat/              # 聊天页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页(角色选择)
├── components/
│   └── MeetingStatus.tsx  # 会议状态组件
├── config/
│   └── ai-roles.ts        # AI角色配置
├── lib/
│   ├── gemini-client.ts   # Gemini API客户端
│   ├── meeting-manager.ts # 会议管理器
│   ├── function-calls.ts  # Function Call定义
│   └── function-executor.ts # Function Call执行器
├── types/
│   ├── chat.ts            # 聊天类型定义
│   └── meeting.ts         # 会议类型定义
└── ...配置文件
```

## 部署

### Vercel部署

1. 推送代码到GitHub
2. 在Vercel中导入项目
3. 设置环境变量：
   - `GEMINI_API_KEY`
   - `PROXY_URL` (如需要)
4. 部署

### 其他平台

项目是标准的Next.js应用，可以部署到任何支持Node.js的平台：
- Netlify
- Railway
- Heroku
- 自有服务器

## 扩展计划

- 🔄 **多模型支持**: 后续将支持ChatGPT、Claude等其他AI模型
- 📝 **会话保存**: 支持保存和恢复聊天记录
- 🎨 **图片生成**: 集成图片生成功能
- 📊 **数据分析**: 提供讨论内容的分析和总结
- 🌍 **多语言**: 支持英文等其他语言

## 故障排除

### 常见问题

1. **API请求失败**
   - 检查API密钥是否正确
   - 确认网络连接正常
   - 如在中国大陆，确保代理配置正确

2. **打字机效果不显示**
   - 确认浏览器支持Server-Sent Events
   - 检查网络连接稳定性

3. **角色选择后无法开始聊天**
   - 确保至少选择了一个AI角色（除了Jarvis）
   - 检查浏览器控制台是否有错误信息

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！
