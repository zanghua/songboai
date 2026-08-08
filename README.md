# 松博教育官方网站

松博教育科技集团官方网站，基于 Astro + Tailwind CSS 构建。

## 技术栈

- **Astro 7** — 静态站点生成框架，零 JS 运行时开销
- **Tailwind CSS v4** — 原子化 CSS 框架
- **Node.js >= 22.12.0**

## 本地开发

### 1. 环境要求

确保已安装 Node.js 22 或更高版本：

```sh
node -v   # 应输出 v22.x.x 或更高
```

如未安装，前往 [Node.js 官网](https://nodejs.org/) 下载 LTS 版本。

### 2. 克隆仓库

```sh
git clone https://gitee.com/songboai/songboai.git
cd songboai
```

### 3. 安装依赖

```sh
npm install
```

### 4. 启动开发服务器

```sh
npm run dev
```

浏览器访问 **http://localhost:4321** 即可预览。修改代码后页面会自动刷新。

### 常用命令

| 命令              | 说明                          |
| :---------------- | :---------------------------- |
| `npm run dev`     | 启动本地开发服务器 (端口 4321) |
| `npm run build`   | 构建生产版本到 `./dist/` 目录  |
| `npm run preview` | 本地预览构建后的网站           |

## 部署指南（宝塔面板）

本项目为纯静态网站，构建后生成 HTML/CSS/JS 静态文件，无需 Node.js 运行环境，直接通过宝塔面板的 Nginx 托管即可。

### 第一步：本地构建

在本地项目根目录执行：

```sh
npm run build
```

构建完成后，`dist/` 目录中就是所有可部署的静态文件。

### 第二步：宝塔面板创建站点

1. 登录宝塔面板
2. 进入 **网站 → 添加站点**
3. 域名填写你的域名（如 `www.songboai.com`）
4. 根目录选择默认路径（如 `/www/wwwroot/www.songboai.com`）
5. PHP 版本选择 **纯静态**
6. 点击 **提交** 创建站点

### 第三步：上传文件

1. 进入 **文件** 管理
2. 导航到刚创建的站点根目录（如 `/www/wwwroot/www.songboai.com`）
3. 删除目录下默认生成的 `index.html`（如有）
4. 将本地 `dist/` 目录内的**所有文件**上传到站点根目录

   > 注意：上传的是 `dist/` 目录**里面的内容**，不是 `dist/` 目录本身。

   最终目录结构应为：
   ```
   /www/wwwroot/www.songboai.com/
   ├── index.html
   ├── about/
   │   └── index.html
   ├── contact/
   │   └── index.html
   ├── courses/
   │   └── index.html
   ├── _astro/
   │   └── *.css, *.js
   └── favicon.svg
   ```

### 第四步：验证访问

浏览器访问你的域名，确认网站正常打开。

### 后续更新

每次修改代码后，重复以下步骤：

1. 本地执行 `npm run build` 重新构建
2. 将新的 `dist/` 内容上传覆盖服务器文件
3. 浏览器强制刷新（Ctrl + F5）查看更新

## 项目结构

```
songboai/
├── public/                  # 静态资源（favicon 等）
├── src/
│   ├── components/          # 页面组件
│   │   ├── Header.astro     # 导航栏
│   │   ├── Footer.astro     # 页脚
│   │   ├── Hero.astro       # 首页品牌区
│   │   ├── ServiceGrid.astro# 12大服务板块
│   │   ├── TeamSection.astro# 专家团队
│   │   └── ...
│   ├── data/
│   │   └── site.ts          # 业务数据集中管理（品牌/服务/团队等）
│   ├── layouts/
│   │   └── BaseLayout.astro  # 基础布局模板
│   ├── pages/
│   │   ├── index.astro      # 首页
│   │   ├── about.astro      # 关于我们
│   │   ├── courses.astro     # 课程中心
│   │   └── contact.astro    # 联系我们
│   └── styles/
│       └── global.css       # 全局样式 + Tailwind 配置
├── astro.config.mjs         # Astro 配置
├── package.json
└── tsconfig.json
```

## 数据修改

所有网站内容（品牌信息、服务板块、专家团队、子公司等）统一集中在 `src/data/site.ts` 中管理，修改后重新构建即可生效。
