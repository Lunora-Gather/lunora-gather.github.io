# 🌌 LUNORA

> **在灵感与现实的交界处，开启独立灵魂的游历。**  
> *Where inspiration meets reality, embark on a journey of independent minds.*

LUNORA 是一个专为独立游戏开发者打造的**极客复古未来主义门户平台**。它将散落的创意作品聚合在一个沉浸式、高表现力的中控终端中。通过精心打磨的毛玻璃感界面、三层电影级环境光效以及响应式瀑布流布局，为游历者提供仪式感十足的跨端游戏入口。

---

## 🎨 核心设计美学与亮点 / Key Features

### 📡 1. 沉浸式前置欢迎终端 (Cinematic Portal Entry)
* **电影级欢迎屏**：采用多层暗色径向渐变环境光与三维极光漫反射，通过高精度贝塞尔缓动转场，提供极佳的进入仪式感。
* **浮空 ZYM 标志**：呼吸感光圈与 ZYM 像素几何线条 Logo 在卡片中心起伏，完美展现极客浪漫。

### 📊 2. 响应式瀑布流展示 (Masonry Game Lobby)
* **内容高度自适应**：抛弃了传统的呆板网格，采用自适应 **Masonry 瀑布流布局**。各游戏卡片高度完全根据内容文字与标签长度上下自然延展，使排版更具呼吸感与有机感。
* **完美同行呈现**：游戏标题统一以 `英文/中文` 双语置于同一行，避免了行高的断裂。

### 🌐 3. 全局多语言本地化系统 (Bilingual System)
* **中文与 EN 双向无损切换**：内置国际化文本映射，一键在设置中切换全站标签、过滤器、成就及统计面板。
* **特定视觉元素免除翻译**：平台标志性的主 Slogan 恒定为中文，完美保护品牌视觉的纯净性。

### ⚙️ 4. 极客开发者工具与统计 (Developer Utilities)
* **本地端口联动**：在“设置”中开启开发者模式，支持为每个可玩游戏配置本地运行端口，实现无缝的本端调试与热更预览。
* **状态与成就追踪**：内置留存时长、游玩次数及勋章成就追踪系统，并在底层实现了语言中性 ID 存储与旧数据无缝迁移。

---

## 🛠️ 技术底座 / Technical Stack

* **核心框架**：React 19 & TypeScript & Vite
* **UI 组件库**：Lucide React（轻量级图标）
* **布局与动效**：Vanilla CSS 3（瀑布流布局、高透磨砂玻璃态、自适应动画）
* **部署集成**：GitHub Actions（自动化构建与 Pages 发布）

---

## ⚙️ 本地快速开始 / Setup & Development

### 1. 安装依赖
```bash
npm install
```

### 2. 运行本地开发服务器
```bash
npm run dev
```
启动后可在浏览器中访问：`http://localhost:3000`。

### 3. 构建生产包
```bash
npm run build
```
编译产物将输出至 `dist` 目录。

---

## 🌐 GitHub Pages 部署 / Production Deployment

本项目已预配置了 GitHub Actions 自动化工作流。

1. 在 GitHub 上将此仓库重命名为 **`Lunora-Gather.github.io`**（或部署为组织的根页面）。
2. 在仓库 **Settings** -> **Pages** -> **Build and deployment** 下，选择使用 **GitHub Actions** 作为部署源。
3. 每次向 `main` 分支推送（`git push`）时，工作流会自动完成类型检查、编译构建，并将编译产物发布到 `https://Lunora-Gather.github.io`。

详细的子项目迁移和部署配置说明，请参阅 [组织迁移与 Pages 部署指南 (GITHUB_MIGRATION.md)](./GITHUB_MIGRATION.md)。

---

## 📄 开源许可 / License
This project is open-source software licensed under the [MIT License](LICENSE).
