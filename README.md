# AI Chat Group - Slot Game Design

这是一个支持多个AI角色一起讨论slot游戏设计的项目，用户可以和多个AI角色在一个群里聊天。

## 功能特色

- 🤖 **多AI角色支持**: 包含主持人、游戏制作人、数学师、玩家、美术师、制图师等专业角色
- 💬 **实时聊天**: 支持SSE流式响应，实现AI打字机效果
- 🎯 **角色选择**: 用户可以自由选择参与讨论的AI角色
- 🎨 **现代化UI**: 使用Tailwind CSS构建的美观界面
- 🌐 **代理支持**: 支持通过代理访问Gemini API

## AI角色介绍

### 主持人 Jarvis (必选)
- **职责**: 主持会议，决定发言顺序，引导讨论方向
- **模型**: gemini-2.0-flash-exp
- **特点**: 善于总结和引导，控制讨论节奏

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
- Jarvis会引导讨论并邀请合适的专家参与
- 每个AI角色会根据其专业领域提供建议

### 3. 互动方式
- 直接输入您的想法和问题
- AI角色会轮流发言，形成自然的讨论
- 支持实时打字效果，提供沉浸式体验

## 项目结构

```
chatgroup/
├── app/                    # Next.js App Router
│   ├── api/chat/          # API路由
│   ├── chat/              # 聊天页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页(角色选择)
├── config/
│   └── ai-roles.ts        # AI角色配置
├── lib/
│   └── gemini-client.ts   # Gemini API客户端
├── types/
│   └── chat.ts            # 类型定义
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
