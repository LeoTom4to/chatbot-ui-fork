<!-- ──────────────────────────────────────────────────────────── -->
<!--  AI 断案：金融诈骗速判所 · README                          -->
<!--  Anti‑Scam Chatbot  · Jiutian‑Workflow × Next.js × Docker  -->
<!-- ──────────────────────────────────────────────────────────── -->

<p align="center">
  <img src="public/screenshot.png" width="780" alt="AI 断案：金融诈骗速判所 · 首屏示意">
</p>

<p align="center">
  <a href="https://anti‑scam-demo.vercel.app"><img alt="在线演示" src="https://img.shields.io/badge/Live‑Demo-在线体验‑›-10b981?style=flat&logo=vercel"></a>
  <img alt="语言" src="https://img.shields.io/github/languages/top/LigengLiu/anti‑scam-ui?color=0ea5e9">
  <img alt="License" src="https://img.shields.io/github/license/LigengLiu/anti‑scam-ui?color=f97316">
</p>

> **一句话**：把“国家反诈中心客服”搬进类 ChatGPT 界面，  
>  3 秒输出诈骗判定、风险等级、趋势数据与防骗指南。  
>  Demo、路演、竞赛皆可一键 Mock 离线演示。

---

## 🏆 项目亮点
| 模块 | 创新 | 价值 |
|------|------|------|
| **多工作流串接** | 聊天引导 → 结构化判断 → 深度分析 | 兼顾自然对话与结构化 JSON |
| **右栏六件套** | 判定卡 / 关键词雷达 / 统计 / 趋势 / Tips / 权威链接 | 一屏掌握风险全貌 |
| **Mock △ 真接口切换** | `.env NEXT_PUBLIC_USE_MOCK=true` | 赛场弱网也能跑 |
| **霓虹 HUD 视觉** | 绿色安全卡 & 动态风险指数 | 技术分 + 设计分 |
| **Docker 镜像** | `docker run -p 3000:3000 antiscam-ui` | 部署 0 运维 |

---

## ✨ 功能一览

| 功能               | 说明                                             |
|--------------------|--------------------------------------------------|
| 🌐 **九天 LLM 工作流** | 三条 Flow 串联，输出 `fraud_judgment / stats / tips …` |
| ⚡ **流式对话**       | 支持 *typing…*、Stop、Regenerate                |
| 📊 **风险面板**       | RiskCard · KeywordRadar · RiskStats · RiskTrend |
| 🔌 **Mock 驱动**      | 离线模式 100 % 复现前端                         |
| 🛠 **Type‑Safe**      | TS + Zustand Store 按领域拆分                   |
| 🐳 **Docker Ready**  | Dockerfile & GitHub Action 构建镜像              |

---

## 📂 目录结构

.
├─ components/
│ ├─ Chat/ # 主聊天窗
│ └─ Promptbar/ # 右侧风险栏
│ ├─ modules/… # Six Panels
│ └─ Promptbar.tsx
├─ pages/api/jiutian/
│ ├─ chat.ts # Chat Flow
│ ├─ structured-judgment.ts# Judge Flow
│ └─ chatflow.ts # Analysis Flow
├─ mocks/ # Mock 数据
├─ lib/ # jiutian.ts / config.ts
├─ store/ # Zustand risk store
└─ docker/ # Dockerfile

---

## 🚀 快速开始

```bash
# 1️⃣ 安装依赖
corepack enable           # 首次安装 pnpm 时执行
pnpm i

# 2️⃣ 环境变量
cp .env.example .env      # -> 默认 MOCK=true 可离线跑

# 3️⃣ 本地启动
pnpm dev                  # http://localhost:3000
```

连接真接口
.env 改为：

```
NEXT_PUBLIC_USE_MOCK=false
JIUTIAN_JWT_TOKEN=xxx.yyy.zzz
JIUTIAN_CHATFLOW_ID=68763c…
JIUTIAN_JUDGEFLOW_ID=687892…
JIUTIAN_ANALYSISFLOW_ID=687898…
```

生产构建

```bash
pnpm build && pnpm start
```

🐳 Docker 快速部署

```bash
# 构建镜像
docker build -t antiscam-ui .

# Mock 演示
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_USE_MOCK=true \
  antiscam-ui
```

连接真接口时加 4 个 Jiutian 变量即可。

🖥️ 线上托管选项

| 方案    | 步骤                        | 适合   |
|---------|-----------------------------|--------|
| Vercel  | Import → 填 Env → Deploy    | Demo   |
| Railway | GitHub 部署或直接 Dockerfile | 短期   |
| 云主机  | docker run -d … + Nginx 反代 | 生产   |

⚙️ 环境变量一览

| 名称                   | 说明                 | 必填 |
|------------------------|----------------------|------|
| JIUTIAN_JWT_TOKEN      | 九天 JWT             | ✅   |
| JIUTIAN_CHATFLOW_ID    | 聊天 Flow ID         | ✅   |
| JIUTIAN_JUDGEFLOW_ID   | 结构化判断 Flow ID   | ✅   |
| JIUTIAN_ANALYSISFLOW_ID| 深度分析 Flow ID     | ✅   |
| NEXT_PUBLIC_USE_MOCK   | "true" → 走 Mock 数据；false → 真接口 | ⬜   |

📦 常见问题

| ❓                | 解决                                      |
|-------------------|-------------------------------------------|
| Module not found: dayjs | pnpm i dayjs                        |
| 九天接口 401           | JWT 过期 → 重新生成 & 更新 .env         |
| 端口 3000 被占         | pnpm dev -p 4000 或 Docker -p 8080:3000 |
| Vercel Edge 报 fetch 错 | API Route 使用 fetch 而非 node-fetch   |

👀 屏幕动图
对话进行中	风险六件套	AI 分析 Loading
<img src="docs/chat.gif" width="230">	<img src="docs/analysis.gif" width="230">	<img src="docs/loading.gif" width="230">

🤝 Credits

Jiutian LLM & Workflow

国家反诈中心 数据支持

Next.js / React / TailwindCSS

Lucide‑React · Day.js · Chart.js

Made with ❤️ for 2025 信息安全创新大赛

---

### 贴心说明

- **截图占位**：把 `docs/*` GIF/PNG 换成你的实际文件名或删掉行。  
- **Docker 镜像名**、Live‑Demo URL、GitHub badge `your‑name/anti‑scam-ui` 替换为真实值。  
- 若比赛不允许暴露 JWT，可在 README 里只列变量名，不给示例值。
