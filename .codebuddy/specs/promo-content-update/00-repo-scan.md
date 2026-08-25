# 仓库架构与集成点扫描报告 (UltraThink Repository Scan)

**项目名称**：松博教育科技集团官方网站（Songbo AI）  
**分析日期**：2025-03-24  
**扫描版本/提交分支**：Astro 7 + Tailwind CSS v4 静态构建体系  
**扫描范围**：`src/`、`public/`、配置与部署文档  

---

## 1. 项目概况与架构定位

- **项目类型**：纯静态营销展示型官网 (SSG - Static Site Generation)
- **业务定位**：松博网络科技有限公司（松博教育科技集团）的企业品牌官网，覆盖素质教育、升学辅导、教育科技三大类业务宣传、团队专家介绍、发展历程展示及客户留资咨询。
- **架构特点**：
  - **零运行时 JS 开销**：Astro 7 原生静态编译，页面交互通过原生极简 Vanilla JS 实现（Header 滚动透明度与移动端菜单展开），无需 React/Vue 等框架运行时。
  - **集中化数据驱动**：业务宣传内容 90% 以上通过 `src/data/site.ts` 集中管理导出，组件消费统一解耦。
  - **现代化原子样式**：Tailwind CSS v4（基于 `@tailwindcss/vite`），使用 `@theme` 定义品牌色令牌与阴影。

---

## 2. 技术栈与工程配置

| 分类 | 技术选型 | 版本/规范 | 说明 |
| :--- | :--- | :--- | :--- |
| **主框架** | Astro | `^7.2.0` | 静态编译生成 HTML/CSS/JS |
| **样式系统** | Tailwind CSS + Vite 插件 | `tailwindcss ^4.3.3`, `@tailwindcss/vite ^4.3.3` | Tailwind v4 原生引擎，通过 `@theme` 定义令牌 |
| **运行时引擎** | Node.js | `>=22.12.0` (ES Modules) | `package.json` 强约束 `engines` |
| **TypeScript** | TypeScript Strict | 继承 `astro/tsconfigs/strict` | 强类型模式验证 `site.ts` 与组件属性 |
| **构建工具** | Vite | `^8.2.1` (Astro 内置) | 静态资源打包到 `dist/` |

---

## 3. 目录组织结构

```text
songboai/
├── public/                     # 静态资源与图片 (favicon, 宝塔部署指南截图)
│   ├── deployment-guide/       # 部署图解素材
│   ├── favicon.ico / favicon.svg
├── src/
│   ├── data/
│   │   └── site.ts             # 【核心】全站宣传内容集中数据源 (Single Source of Truth)
│   ├── layouts/
│   │   └── BaseLayout.astro    # 统一 HTML 结构、SEO Meta、Google 字体与 Header/Footer 挂载
│   ├── styles/
│   │   └── global.css          # Tailwind v4 主题色令牌 (--color-brand-*, --color-accent-*)、动画与全局样式
│   ├── components/             # 页面可复用展示区块组件
│   │   ├── Header.astro        # 顶部吸顶渐变导航栏 + 移动端折叠抽屉
│   │   ├── Footer.astro        # 底部多列导航、联系方式、版权及工信部 ICP 备案号
│   │   ├── Hero.astro          # 首页首屏大 Banner、标语与主数据指标条
│   │   ├── AboutSection.astro  # 首页"关于我们"摘要图文区 + 业务标签
│   │   ├── ServiceGrid.astro   # 十二大服务板块网格（内嵌 iconMap SVG 图标字典）
│   │   ├── TeamSection.astro   # 专家团队四列卡片（带首字大头像与专长标签）
│   │   ├── SubsidiarySection.astro # 五大业务板块卡片（暗色背景 + 序号装饰）
│   │   ├── VisionSection.astro # 愿景、使命与三利价值观 (利国/利民/利教)
│   │   ├── StatsBar.astro      # 独立四列核心统计数据条
│   │   ├── PageBanner.astro    # 次级页面统一顶部深色通栏
│   │   ├── SectionTitle.astro  # 统一区块标题组件（主副标题、高亮字、渐变分割线）
│   │   ├── ContactForm.astro   # 静态咨询预约表单（客户端交互）
│   │   └── CTASection.astro    # 底部统一转化召唤条（咨询按钮 + 电话拨号链接）
│   └── pages/                  # 静态路由（4个主页面）
│       ├── index.astro         # 首页 (Hero → About → Service → Team → Subsidiary → Vision → CTA)
│       ├── about.astro         # 关于我们 (Banner → 品牌故事/发展历程时间线 → Team → Subsidiary → Vision → CTA)
│       ├── courses.astro       # 课程中心 (Banner → 按 category 分组展示 12 大服务详细卡片 → CTA)
│       └── contact.astro       # 联系我们 (Banner → 3大联系卡片 → 在线表单 → 详细地址/交通/咨询流程)
├── astro.config.mjs            # Astro 配置（仅集成 Tailwind Vite 插件）
├── package.json                # 项目依赖与 scripts
└── tsconfig.json               # TS strict 规范
```

---

## 4. 宣传内容集成点与依赖关系分析 (Integration Points)

全站内容高度依赖 `src/data/site.ts`。以下为各字段在组件与页面中的引用关系与修改影响评级：

### 4.1 字段引用分布表

| 数据对象 / 字段 | 消费组件 / 页面 | 展示位置与用途 | 修改影响度 |
| :--- | :--- | :--- | :--- |
| **`brand.name`** / **`brand.nameEn`** | `BaseLayout`, `Header`, `Footer`, `Hero`, `AboutSection`, `about.astro`, `courses.astro`, `contact.astro` | 网站 `<title>`、Meta 描述、导航 Logo、Hero 标题、页脚版权、各页介绍文案 | 🟢 **安全**（纯文本替换） |
| **`brand.slogan`** | `BaseLayout`, `Hero` | 首页 SEO 标题、Hero 次级标语 | 🟢 **安全**（纯文本替换） |
| **`brand.description`** | `BaseLayout`, `Hero`, `Footer` | SEO Description、Hero 简介段落、Footer 品牌简介 | 🟢 **安全**（建议字数保持在 80~150 字以内以维持排版） |
| **`brand.phone`** / **`brand.email`** / **`brand.address`** | `Footer`, `CTASection`, `contact.astro` | Footer 联系方式、全站 CTA `tel:` 拨号链接、联系我们页面卡片与明细 | 🟢 **安全**（纯文本/外链替换） |
| **`brand.icp`** | `Footer` | 底部工信部备案链接与文字展示 | 🟢 **安全**（纯文本替换） |
| **`navItems`** | `Header`, `Footer` | 顶部桌面导航、顶部移动菜单、Footer 快速导航 | 🟡 **中度影响**（新增/删除路由项需保证对应 `src/pages/*.astro` 存在） |
| **`stats`** (4项) | `Hero`, `StatsBar` | 首屏底部指标与独立数据条（4列 Grid） | 🟡 **中度影响**（数量若非 4 个，需调整 `grid-cols-2 lg:grid-cols-4` 响应式网格布局） |
| **`services`** (12项) | `ServiceGrid`, `Footer`, `courses.astro` | ① 首页 12 宫格卡片<br>② Footer 取前 6 项列表<br>③ `courses.astro` 按 `category` 自动聚合分组 | 🔴 **结构性影响**（见下文分析） |
| **`team`** (4项) | `TeamSection` | 首页及关于页专家卡片（姓名/职位/履历/专长标签） | 🟡 **中度影响**（4人最佳；若增减人数需确认 `grid sm:grid-cols-2 lg:grid-cols-4` 排版效果） |
| **`subsidiaries`** (5项) | `SubsidiarySection` | 首页及关于页业务板块展示（序号/名称/定位/简介） | 🟡 **中度影响**（当前写有 `i === subsidiaries.length - 1 && "lg:col-start-2"` 居中最后单项逻辑） |
| **`vision`** (愿景/使命/3项价值观) | `VisionSection` | 企业愿景卡片、使命卡片、利国/利民/利教三列卡片 | 🟡 **中度影响**（`values` 建议保持 3 项以匹配 3 列网格） |
| **`milestones`** (5项) | `about.astro` | 关于我们页面纵向时间线 (年份/标题/说明) | 🟢 **安全**（支持灵活增减，竖线自动随项目数伸缩） |

### 4.2 结构性影响与断裂风险提示（重点关注）

1. **`services` 图标映射 (`iconMap`)**：
   - `ServiceGrid.astro` 与 `courses.astro` 内部维护了本地 `iconMap` 字典（Key 对应 `consultation`, `planning`, `quality`, `exam`, `college`, `postgrad`, `upgrade`, `ielts`, `study-abroad`, `tech`, `psychology`, `comprehensive`）。
   - **风险**：如果在 `site.ts` 中为 `service.icon` 指定了不在字典中的值，会导致卡片 SVG 图标空白或渲染报错。
2. **`services.category` 分类分组机制**：
   - `src/pages/courses.astro` 使用 `[...new Set(services.map(s => s.category))]` 动态聚合分组。
   - **安全项**：新增分类或调整 category 文本会自动创建新版块。
   - **注意项**：需确保同一类别名称精确一致，避免出现“基础教育”和“基础教育类”等非预期拆分。
3. **`AboutSection.astro` 内嵌硬编码标签与文本**：
   - 首页 `AboutSection.astro` 第 20~26 行与第 32 行标签数组存在部分硬编码业务文本（如 `["教育咨询", "生涯规划", "素质教育", ...]`），若全站业务线发生重大更名，需同步检查此组件。

---

## 5. 开发与部署工作流

- **本地开发**：
  - 安装依赖：`npm install`
  - 启动热重载服务器：`npm run dev`（默认端口 `http://localhost:4321`）
  - 后台运行模式：`astro dev --background`（可通过 `astro dev logs` 查看日志）
- **静态构建**：
  - 执行：`npm run build`
  - 产物目录：`./dist/`
- **生产部署机制（宝塔面板 Nginx 静态托管）**：
  - 目标主机：阿里云 ECS (`116.62.55.62`)，OS：Alibaba Cloud Linux 3
  - 网站根目录：`/www/wwwroot/songboai.cn`
  - 部署方式：无需 Node.js 运行环境，直接将本地生成的 `dist/*` 内容全量上传覆盖服务器根目录。
  - 域名/HTTPS：主域名 `songboai.cn`（www 301 重定向至主域名），Let's Encrypt SSL 证书，静态 Nginx 托管。

---

## 6. 后续协同建议 (Downstream Guidance)

1. **宣传内容更新 (PO / Content Editor)**：
   - 优先在 `src/data/site.ts` 集中更新 `brand`、`stats`、`team`、`subsidiaries`、`vision`、`milestones`。
   - 若需调整 `services` 列表，如新增服务类型，需同时在 `ServiceGrid.astro` 与 `courses.astro` 的 `iconMap` 中补充对应 SVG 路径定义。
2. **样式调整 (Dev)**：
   - 遵循 Tailwind v4 规范，主题色与阴影变更在 `src/styles/global.css` 的 `@theme` 块内修改。
3. **验证与交付 (QA / Review)**：
   - 任何内容修改后，必须执行 `npm run build` 进行 TypeScript 严格类型与静态编译校验，确保无路径或字段断裂。
