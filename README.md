# 🌌 LUNORA

🚀 **[LUNORA 门户网站入口 / Play Live Demo](https://Lunora-Gather.github.io)**

---

## 🛠️ 项目定位与功能实现 / Project Overview & Implementation

LUNORA 是一个用于聚合和展示独立网页游戏的导航门户网站。

### 1. 前置欢迎入口屏 (Landing Entry Page)
* **功能**：前置欢迎过渡界面，提供进入主站的操作引导。
* **实现**：采用 CSS 径向渐变背景与 CSS 动画（呼吸灯与浮动动效），并通过 React 的状态管理与 `sessionStorage` 结合控制转场动效及淡出状态，避免用户重复刷新时重复触发欢迎页。

### 2. 瀑布流大厅布局 (Masonry Game Lobby)
* **功能**：展示游戏卡片列表，高度根据各游戏的描述文本长度自适应，卡片标题统一在单行展示双语名字。
* **实现**：采用 CSS Multi-column layout (`column-count` 与 `column-gap`）实现响应式瀑布流布局。结合 `@media` 查询在桌面端（3列）、平板端（2列）和移动端（1列）之间自动伸缩，并使用 `break-inside: avoid` 防止卡片折断。

### 3. 全局中英文多语言 (Bilingual Localization)
* **功能**：设置面板支持中英文切换，翻译范围包括大厅分类过滤、搜索框占位符、过滤计数、游戏分类及详情描述、成就提示系统。大标题与特定 slogan 仍保持中英文对照样式。
* **实现**：基于 React 状态机与本地静态字典对象（`LOCALIZED_TEXTS` / `CATEGORIES_MAP`）进行文字实时替换，并将所选语言持久化存储于 `localStorage`。

### 4. 开发者配置与数据统计 (Developer Utilities & Stats)
* **功能**：支持配置每个游戏在本地开发调试时的端口；实时统计页面驻留时长、启动游戏次数以及勋章成就。
* **实现**：
  * 通过 `isDevMode` 状态控制本地端口输入框的显隐，并以键值对形式保存在 React 状态中。
  * 使用 `setInterval` 累加驻留秒数，并在触发特定节点时解锁成就（例如 novice / hardcore / collector 等 ID），数据持久化保存在 `localStorage` 中。

---

## 🛠️ 技术栈 / Technology Stack

* **前端核心**：React 19, TypeScript
* **构建工具**：Vite 6
* **样式方案**：Vanilla CSS 3
* **图标资源**：Lucide React
* **部署发布**：GitHub Actions & GitHub Pages

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
