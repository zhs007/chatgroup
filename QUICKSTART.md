# 快速开始指南

## 1. 环境配置

复制环境变量文件：
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，添加您的 Gemini API 密钥：
```bash
GEMINI_API_KEY=your_actual_api_key_here
```

## 2. 获取 Gemini API 密钥

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登录您的 Google 账户
3. 点击 "Create API Key" 创建新的 API 密钥
4. 复制生成的密钥到 `.env.local` 文件中

## 3. 启动项目

```bash
npm run dev
```

## 4. 访问应用

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 5. 使用流程

1. **选择AI角色**: 在首页选择您希望参与讨论的AI角色
2. **开始聊天**: 点击"开始讨论"进入聊天页面
3. **描述想法**: 输入您对slot游戏的想法或需求
4. **AI讨论**: 多个AI角色会轮流发言，形成自然的讨论

## 注意事项

- 主持人 Jarvis 会自动参与每次讨论
- 建议至少选择2-3个AI角色以获得更丰富的讨论
- 如果在中国大陆使用，可能需要配置代理访问

## 故障排除

如果遇到API请求失败：
1. 检查API密钥是否正确
2. 确认网络连接正常
3. 如在中国大陆，配置代理：
   ```bash
   PROXY_URL=http://your-proxy-host:port
   ```
