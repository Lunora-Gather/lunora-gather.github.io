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

### 3. 简体中文、繁體中文与英文 (Trilingual Localization)
* **功能**：设置面板支持简体中文、繁體中文和英文切换，覆盖欢迎页、分类过滤、搜索、游戏标题与描述、空状态、设置及成就提示。
* **实现**：基于 React 状态与本地静态字典对象（`LOCALIZED_TEXTS` / `CATEGORIES_MAP`）实时替换文字，并将所选语言持久化存储于 `localStorage`，同时同步页面 `lang` 属性。

### 4. 开发者配置与数据统计 (Developer Utilities & Stats)
* **功能**：支持配置每个游戏在本地开发调试时的端口；实时统计页面驻留时长、启动游戏次数以及勋章成就。
* **实现**：
  * 通过 `isDevMode` 状态控制本地端口输入框的显隐，并以键值对形式保存在 React 状态中。
  * 使用 `setInterval` 累加驻留秒数，并在触发特定节点时解锁成就（例如 novice / hardcore / collector 等 ID），数据持久化保存在 `localStorage` 中。

### 5. 收藏与最近游玩 (Favorites & Recent Games)
* **功能**：支持收藏常玩的游戏，并按最近启动顺序快速返回最多 6 款游戏。
* **实现**：使用独立的 `localStorage` 数据键持久化收藏与最近游玩 ID；筛选逻辑可与分类和全文搜索组合使用。

### 6. 游戏目录自检 (Catalog Validation)
* **功能**：在开发及构建阶段检查重复 ID、缺失标题、非法难度、颜色与链接。
* **实现**：游戏数据模块加载时执行轻量校验，错误数据会直接中断构建，避免损坏的入口发布上线。

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
