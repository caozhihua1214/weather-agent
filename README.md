# 天气查询 Agent

基于火山引擎豆包大语言模型的智能天气查询助手，支持长时任务处理（最长5分钟），适合部署在 Vercel 上。

## 功能特性

- 🌤️ 实时天气查询
- 🤖 集成火山引擎豆包大语言模型
- ⏱️ 支持长时任务处理（最长5分钟）
- 📱 响应式前端界面
- ☁️ 适合 Vercel 部署

## 技术栈

- Next.js 14 + TypeScript
- Tailwind CSS 3
- 火山引擎豆包 API
- WeatherAPI

## 环境变量

在 `.env.local` 文件中配置以下环境变量：

```bash
DOUBAO_API_KEY=your_doubao_api_key_here
DOUBAO_SECRET_KEY=your_doubao_secret_key_here
WEATHER_API_KEY=your_weather_api_key_here
WEATHER_API_URL=https://api.weatherapi.com/v1/current.json
```

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## API 接口

### POST /api/weather

创建天气查询任务

**请求体：**
```json
{
  "location": "北京"
}
```

**响应：**
```json
{
  "taskId": "uuid",
  "status": "pending",
  "message": "任务已创建，正在处理中"
}
```

### GET /api/weather?taskId=xxx

查询任务状态

**响应：**
```json
{
  "taskId": "uuid",
  "status": "completed",
  "createdAt": 1234567890,
  "completedAt": 1234567895,
  "result": {...},
  "error": null
}
```

### POST /api/weather/long-task

长时任务接口（最长5分钟）

**请求体：**
```json
{
  "location": "北京",
  "delay": 0
}
```

## 部署到 Vercel

1. 确保已配置所有环境变量
2. 安装 Vercel CLI：`npm install -g vercel`
3. 部署：`vercel`

## License

MIT
