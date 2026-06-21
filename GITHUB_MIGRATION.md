# Lunora-Gather 组织迁移与 GitHub Pages 部署指南

本指南将帮助您在 GitHub 上创建名为 `Lunora-Gather` 的组织，并将本地的各个游戏项目上传、迁移并配置为通过统一的 `lunora` 平台（即当前门户网站）在线运行。

---

## 第一步：创建 GitHub 组织 `Lunora-Gather`

1. 登录您的 GitHub 个人账户。
2. 点击右上角您的头像，选择 **Your organizations**。
3. 点击页面右上角的 **New organization** 按钮。
4. 选择免费版计划（**Create a free organization**）。
5. 输入组织名称：`Lunora-Gather`。
6. 输入您的联系邮箱，并选择此组织属于“My personal account”。
7. 完成验证码校验，点击 **Next**，即可成功创建组织！

---

## 第二步：迁移/推送游戏仓库到新组织

您需要将现有的扫雷、数独等仓库迁移至 `Lunora-Gather` 组织下。有两种方法：

### 方法 A：在 GitHub 网页上“转移”已有仓库（推荐，可保留历史提交记录和 Stars）
1. 在 GitHub 上打开您的个人仓库页面（例如：`https://github.com/Lunora-Gather/sudoku-game`）。
2. 点击仓库右上角的 **Settings** 选项卡。
3. 滚动到页面最底部的 **Danger Zone**。
4. 点击 **Transfer ownership**。
5. 在弹出框中：
   * 输入需要转移的仓库名确认。
   * 新所有者填写：`Lunora-Gather`。
6. 点击 **Transfer this repository**。该仓库会立刻转移至 `Lunora-Gather` 组织名下，链接也会自动重定向。

### 方法 B：直接新建仓库并推送本地代码
如果您想全新开始，可以直接在 `Lunora-Gather` 组织下创建新仓库，然后配置本地 Git 推送：
```bash
# 在 Lunora-Gather 下新建同名仓库后，在本地终端执行：
git remote set-url origin https://github.com/Lunora-Gather/项目名.git
git branch -M main
git push -u origin main
```

---

## 第三步：部署各个游戏的 GitHub Pages

为了让 Lunora 平台能够在 Iframe 中成功加载您的游戏，每个游戏都需要启用 GitHub Pages。

### 1. 对于 React 项目（如 `sudoku-game` / `minesweeper-game`）
由于这两个项目已经配置了 `gh-pages` 部署工具，您只需：
1. 打开项目根目录的 `package.json`，将 `homepage` 修改为新组织的地址：
   * **数独游戏**：`"homepage": "https://Lunora-Gather.github.io/sudoku-game"`
   * **扫雷游戏** `"homepage": "https://Lunora-Gather.github.io/minesweeper-game"`
2. 在本地项目目录下运行：
   ```bash
   npm run deploy
   ```
   这会自动编译代码并推送到 `gh-pages` 分支。
3. 进入 GitHub 仓库设置 (**Settings** -> **Pages**)，确保 **Build and deployment** 下的 Source 设为 **Deploy from a branch**，分支选择 **gh-pages**，目录选择 `/ (root)`。

### 2. 对于 Vite 项目（如 `YunShenChu` / `astra-voxel-ark`）
1. 确保 `vite.config.ts` 中的 `base` 配置为相对路径或具体子路径（例如：`base: './'` 或 `base: '/YunShenChu/'`）。
2. 可以配置 GitHub Action 进行自动化部署，或者使用本地 `gh-pages` 依赖手动发布：
   ```bash
   # 安装 gh-pages 依赖
   npm install gh-pages --save-dev
   
   # 在 package.json 的 scripts 中添加：
   # "predeploy": "npm run build",
   # "deploy": "gh-pages -d dist"
   
   # 执行部署
   npm run deploy
   ```
3. 同样在 GitHub 仓库设置的 **Pages** 页面，指定部署分支为 **gh-pages**。

### 3. 对于静态/Canvas 项目（如 `summit-spark`）
因为 `summit-spark` 本身就是一个完全静态的网页，无需编译，因此可以直接将 `main` 分支作为部署分支：
1. 打开 `summit-spark` 仓库设置的 **Pages** 页面。
2. 在 **Branch** 下选择 `main` 分支，路径选择 `/ (root)`。
3. 点击 **Save**，稍等两分钟即可直接在线访问 `https://Lunora-Gather.github.io/summit-spark/`！

---

## 第四步：部署 Lunora 主平台门户网站

这是整个平台的大本营。为了让您的门户网站直接在组织的根域名（`https://Lunora-Gather.github.io`）上访问，必须将主入口项目的仓库命名为 **`Lunora-Gather.github.io`**：

1. 在 `Lunora-Gather` 组织下，创建一个名为 **`Lunora-Gather.github.io`** 的仓库。
2. 将当前的 `lunora-portal` 本地项目推送到该仓库的 `main` 分支。
3. 编译并部署：
   * 您可以安装 `gh-pages` 插件进行部署，或者直接在 GitHub 仓库中配置 GitHub Actions（搜索 "Vite" 或 "Static HTML" 模板），让其在每次提交至 `main` 时自动完成编译并发布到 GitHub Pages。
4. 部署成功后，全球玩家即可通过 **`https://Lunora-Gather.github.io`** 统一入口，在一个精美的暗黑霓虹风格网页中一键切换、玩遍您的所有作品！
