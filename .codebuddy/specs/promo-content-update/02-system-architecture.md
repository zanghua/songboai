# System Architecture Document: 松博教育官网宣传内容重构（promo-content-update）

## Executive Summary

本架构文档承接 PRD《01-product-requirements.md》，为松博教育官网宣传内容重构提供技术实现方案。项目为 **Astro 7 + Tailwind CSS v4 纯静态站（SSG，零后端、零运行时 JS 框架）**，本次改动不涉及任何架构层技术选型变化，聚焦于**「内容数据层（src/data/site.ts）与展示组件层的重构方案」**。

核心设计判断：

1. **site.ts 作为唯一权威数据源（Single Source of Truth）的架构假设保持不变**——品牌/成果/业务板块/新增内容全部收敛到数据文件，组件保持"数据消费方"角色。
2. **布局守恒策略**——`stats=4`、`team=4`、`subsidiaries=5`、`vision.values=3` 等数组尺寸与现有 Tailwind 栅格的耦合关系保持不变；`services` 12→9 是与栅格的**唯一解耦点**（4 列→3 列），需显式设计。
3. **iconMap 双处维护是既有架构债**（ServiceGrid.astro 与 courses.astro 各自内嵌一份字典）——本次不重构为共享模块（保持 PRD 范围最小化），但采用**「双处同步 + fallback 兜底 + 验收强检」三重防护**管控风险。
4. **合规内建于数据层**——所有敏感表述在 site.ts 文案落地时即按替换规则表完成改写，组件不承载合规逻辑。

## Architecture Overview

### System Context

```
┌────────────────────────────────────────────────────────────┐
│   songboai.cn（宝塔面板 Nginx 静态托管，阿里云 ECS）          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ npm run build（Astro 7 SSG + Tailwind v4 + TS strict）│  │
│  │                                                      │  │
│  │  src/data/site.ts  ──SSOT─────────────────────────┐  │  │
│  │     │brand │stats │services │featuredProduct │    │  │  │
│  │     │cases │puyangZone │team │subsidiaries ...│    │  │  │
│  │     ▼                                              │  │  │
│  │  src/components/*.astro  ←── 数据消费（只读 import）│  │  │
│  │     Hero / StatsBar / About / ServiceGrid +        │  │  │
│  │     [NEW] FeaturedProduct / Cases / Puyang +       │  │  │
│  │     Team / Subsidiary / Vision / CTA / Footer      │  │  │
│  │     ▼                                              │  │  │
│  │  src/pages/index.astro 等 4 页面（路由不变）         │  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **数据即内容，组件即模板**：一切文案属于 site.ts（或页面级极少量展示性文案），组件禁止硬编码业务事实（品牌名、电话、数据、板块名）。新组件对接新数据对象，一律 `import` 消费。
2. **栅格守恒，显式解耦**：现有数组长度与栅格列数的耦合是隐式契约。本次唯一解耦点 `services 12→9` 通过显式调整 `ServiceGrid` 网格（`lg:grid-cols-4` → `lg:grid-cols-3`）完成，其余数组尺寸不变。
3. **合规前置（Compliance at Authoring Time）**：合规改写发生于数据录入时，规则表（见「合规改写文案规范」）是录入规范，不是运行时过滤。
4. **图标字典防御性渲染**：iconMap 取值必须带 fallback，杜绝字典缺 key 导致 `d={undefined}` 的空白 SVG。
5. **最小改动面**：不新增路由、不动 navItems、不引入依赖、不新增全局样式令牌；新组件严格复用现有视觉语言（rounded-2xl/3xl、brand 色阶、SectionTitle、`--shadow-card` 引用、fadeInUp 动画）。

### High-Level Architecture（改动后首页）

```
index.astro
 ├─ <Hero />            消费 brand + stats（修改：纯数据层改动）
 ├─ <AboutSection />    消费 brand + StatsBar（修改：硬编码文案/标签/数字卡片同步）
 ├─ <ServiceGrid />     消费 services(9) + 本地 iconMap（重构：网格 4列→3列、iconMap 对齐）
 ├─ <FeaturedProduct /> ★新增，消费 featuredProduct
 ├─ <CasesSection />    ★新增，消费 cases（区块内嵌统一声明）
 ├─ <PuyangSection />   ★新增，消费 puyangZone + brand
 ├─ <TeamSection />     消费 team（仅后移 + 文案弱化）
 ├─ <SubsidiarySection /> 消费 subsidiaries（仅后移 + 标题弱化）
 ├─ <VisionSection />   消费 vision（仅后移 + 引言弱化）
 └─ <CTASection />      消费 brand.phone（修改：硬编码品牌名替换）
```

## Data Layer 变更设计（site.ts 字段级 diff）

### 3.1 brand 对象 diff

| 字段 | 变更 | 现值 | 新值 | 类型影响 |
| :--- | :--- | :--- | :--- | :--- |
| `name` | 改 | `"松博网络"` | `"松博教育"` | 无（string） |
| `nameEn` | 改 | `"SONGBO NETWORK"` | `"SONGBO EDUCATION"` | 无 |
| `slogan` | 改 | `"启智铸梦 · 博学致远"` | `"科学规划 · 能力提升"`（PPT 核心定位口径） | 无 |
| `description` | 改 | 旧简介 | 见下文建议文案 | 无（保持 80~150 字） |
| `phone` | 改 | `"400-888-0000"` | `"18135773531"` | 无 |
| **`wechat`** | **新增** | — | `"1990990789"` | **新增字段**。brand 当前为对象字面量推断类型，无显式接口，新增 string 字段不破坏任何消费方（TS strict 下新增键只对读取端生效，既有引用不受影响） |
| `email` | 不变 | `songboai@189.cn` | — | — |
| `address` | 改 | `"河南省濮阳市华龙区尚城大厦11层"` | `"濮阳市华龙区胜利路尚城大厦1105室"` | 无 |
| `icp` | 不变 | `豫ICP备2026038031号-1` | — | — |

`description` 建议文案（97 字，含 SEO 关键词）：

> 松博教育以"科学规划 + 能力提升"为核心，是覆盖从小学到博士全学段的教育服务培训指导提供商。业务涵盖生源对接、生涯规划、自主学习力培养、技巧提分、定向升学培训、单招规划与国际本硕博留学等多元服务。

`brand.wechat` 消费点（均为本次新增引用，无遗留消费方）：Footer 联系方式 li 第 4 项、contact.astro 联系卡片区第 4 项 + 详细地址区文案、PuyangSection 本地联系方式条。

### 3.2 stats 数组 diff（保持 4 项，`{value,label}` 结构不变）

| # | value | label | 限定语约束 |
| :-- | :--- | :--- | :--- |
| 1 | `超500名` | `学员能力提升` | "超"字保留，禁止改为"500+" |
| 2 | `平均30分` | `学员平均提分`（或 value=`30分`/label=`平均提分`，二选一，确保"平均"字样不丢） | "平均"限定必须呈现 |
| 3 | `200名` | `学生输送留学海外` | 禁止放大为"200+" |
| 4 | `小—博` | `全学段覆盖` | "小—博"用一字线呈现 |

消费者 Hero（`grid-cols-2 md:grid-cols-4`）与 StatsBar（`grid-cols-2 lg:grid-cols-4`）布局不受影响。

**取舍说明**：PRD 建议 value/label 配对为 `超500名/学员能力提升` 等；实现时推荐将被限定语修饰的词（"平均"）放入 value 或拆到 label 其一并保持可见，Dev 按表内两种落法择一即可，验收以"平均可见"为准。

### 3.3 services 数组 diff（12 → 9 项，`ServiceItem` 接口不变）

接口 `ServiceItem { icon: string; title: string; description: string; category: string }` 保持不动，**仅替换数组内容**：

| # | title | description 建议（PPT 口径浓缩） | category | icon key |
| :-- | :--- | :--- | :--- | :--- |
| 1 | 幼小衔接 | 趣味识字、经典熏陶与全脑潜能训练，帮助孩子平稳过渡到小学，奠定成长基石。 | 能力培养 | `bridge`（新增） |
| 2 | 初高中自主学习能力培养 | 传授目标拆解、时间管理、错题复盘等高效自学法，助力从"被动接受"转向"主动学习"。 | 能力培养 | `postgrad`（复用：打开的书） |
| 3 | 云伴学（小初高） | 调结构、提效率、真减负，抓住学习主动权，让孩子每天早睡 1 小时。 | 能力培养 | `cloud`（新增） |
| 4 | 脑象测评 | 一对一检测与分析，定位学习状态，找到最佳学习方法，辅助科目选择与志愿填报。 | 能力培养 | `brain`（新增） |
| 5 | 技巧提分 | 提炼初高中科目应试技巧与高频考点解题思路，结合学情定制方案，突破学业瓶颈。 | 能力培养 | `exam`（复用：文档） |
| 6 | 定向择校 | 幼升小/小升初/初升高：选定目标学校、针对性定制方案、方案实施与达成入学。 | 升学规划 | `college`（复用：学士帽） |
| 7 | 单招规划 | 深入解读单招政策，制定笔试面试备考策略，为成绩中等或偏科学生提供差异化升学路径。 | 升学规划 | `route`（新增） |
| 8 | 国际留学 | 热门地区院校申请指导与全程服务、一站式规划及高起本至硕升博的名校定制申请与背景提升服务。 | 国际留学 | `study-abroad`（复用：地球） |
| 9 | 生源与升学规划 | 全学段个性化对接与长期路径规划，让成长路径更清晰、升学更有方向。 | 升学规划 | `planning`（复用：剪贴板） |

**约束固化**：
- category 取值集合 = `{能力培养, 升学规划, 国际留学}`，逐字一致（禁同义词）。courses.astro 的 `[...new Set(...)]` 将自然聚出 3 组，与 PRD 验收"分组数与 category 种类一致"对应。
- 9 项顺序即 Footer 服务列表（`services.slice(0,6)`）与课程中心分组内顺序的依据，按上表顺序排布。

### 3.4 新增数据对象与 TypeScript 接口

```ts
// ============ 666 特色产品（PPT 幻灯片8） ============
export interface FeaturedProductStep {
  title: string;        // 步骤名，如 "划重点"
  detail?: string;      // 步骤补充，如 "定义/定理/定律/公式/问句/例题"
}

export interface FeaturedProduct {
  badge: string;          // "666 特色产品"
  name: string;           // "四天学会一本数学书"
  tagline: string;        // "不讲课、不讲题，章章自主学、卷卷满分过"
  efficiency: string;     // "学习效率可提升 5-20 倍"（区间限定口径保留）
  overview: string;       // 以"网状整合力"为核心的一段总述
  coreAbilities: string[];      // 3 项：自主学习力/网状整合力/提分答题力
  methodSteps: FeaturedProductStep[]; // 10 项，见 FR-4
  problems: string[];           // 7 项，见 FR-4
  gains: string[];              // 7 项，见 FR-4
}
export const featuredProduct: FeaturedProduct = { /* PRD FR-4 全文 */ };

// ============ 学员提分案例（PPT 幻灯片17，匿名化） ============
export interface CaseItem {
  name: string;          // "傅同学" / "程同学" / "某同学"
  stage: string;         // "高三"
  highlight: string;     // 主成果："高考 526 分" / "高考总分 534 分" / "英语 111 分"
  before?: string;       // 起点："报课前 429 分"（无起点则缺省）
  improvement: string;   // "提升近 100 分，录取江西农林大学" / 单科明细 / "提升 26 分"
  detail?: string;       // 分科明细（案例2：语115/数112/英96/物53/化75/生83）
}
export const cases: CaseItem[] = [ /* 3 项，FR-5 数据 */ ];

// 区块级统一声明（组件常量，确保三案例共用一句）
export const caseDisclaimer = "个案效果，因人而异";

// ============ 濮阳专区（PPT 幻灯片26，合规化） ============
export interface PuyangProgram {
  title: string;         // "小升初" / "中考冲刺" / "单招"
  description: string;   // "考前学习规划 + 目标学校政策详解" 等
}
export interface PuyangZone {
  programs: PuyangProgram[];  // 3 项，FR-6
  guarantee: string;          // "签约保障，未达目标按协议退费"（唯一合规表述）
}
export const puyangZone: PuyangZone = { /* FR-6 数据 */ };
```

**设计要点**：
- 声明文案放入 site.ts（`caseDisclaimer`），而非组件硬编码——保持"文案即数据"架构原则；组件仅引用。
- `CaseItem.before` 可选：案例3 只有冲刺时长与结果，避免编造起点。
- 濮阳专区的电话/微信/地址**不**复制进 `puyangZone`，由 PuyangSection 直接 `import { brand }` 消费，杜绝双源。

### 3.5 既有对象的文案弱化 diff（仅改值，不改接口/数量）

| 对象.字段 | 现值问题 | 新值方向 |
| :--- | :--- | :--- |
| `team[3].description` | "开拓亿万市场""登顶商业巅峰" | "拥有二十年教育行业运营经验，专注教育服务体系构建与区域市场深耕" |
| `team[0].description` | "松博网络课程体系" | "松博教育课程体系" |
| `vision.vision` | "立足全球教育新标杆"（夸大） | "让每个孩子找到适合自己的学业成长路径，提升终身竞争力"（PPT 使命口径） |
| `vision.mission` | "赋能教育创业者"（偏离） | "致力打造从小学到博士全教育阶段的直通专列" |
| `milestones[4].description` | "全国校区持续扩张，累计服务学员超50万"（虚构） | "深耕濮阳本地教学服务，累计帮助超500名学员实现能力提升" |
| `milestones[2].description` | "五大业务板块"（与9大口径冲突风险） | "完成能力培养与升学规划双线业务体系建设" |
| `milestones[3].description` | "全面布局教育科技" | "云伴学与脑象测评等服务体系落地" |

## 组件层变更设计

### 4.1 iconMap 策略（ServiceGrid.astro 与 courses.astro 双处同步）

**key 全集 = 4 新增 + 5 复用 = 9 个**（旧 key 中 consultation/quality/upgrade/ielts/tech/psychology/comprehensive 不再被引用，但保留于字典无妨，不影响渲染；建议保留以减少 diff 面）。

| icon key | 视觉语义建议（SVG path 由 Dev 阶段实现，24×24 stroke 风格，与现有 Heroicons outline 一致） |
| :--- | :--- |
| `bridge`（幼小衔接） | 破土双叶幼苗/起跑线：一片小苗从Seedling中长出——"平稳过渡、奠定基石" |
| `cloud`（云伴学） | 云朵内含对勾或书本——"陪伴、减负、轻量在线" |
| `brain`（脑象测评） | 侧脑轮廓+脑纹曲线，或大脑轮廓内含放大镜——"测评、脑象、分析" |
| `route`（单招规划） | 分岔路标/指南针罗盘——"差异化路径、多元通道" |

**复用 key 的语义校准**：`postgrad`（打开的书）→ 自主学习（共读语义成立）；`exam`（文档）→ 技巧提分（试卷语义）；`college`（学士帽）→ 择校；`study-abroad`（地球）→ 留学；`planning`（剪贴板对勾）→ 规划。

**Fallback 防护（两处 iconMap 统一实现）**：

```ts
const fallbackIcon = iconMap.comprehensive; // 星星图标作兜底
// 渲染处：d={iconMap[service.icon] ?? fallbackIcon}
```

效果：任何漏配 key 渲染为兜底星星图标而非空 SVG，同时浏览器不报错；验收再靠人工目检兜底图标的异常出现。

### 4.2 既有组件修改点清单

| 组件/文件 | 修改点 | 说明 |
| :--- | :--- | :--- |
| `BaseLayout.astro` | meta `keywords` 硬编码 `"松博网络,教育公司,网络科技,..."` → `"松博教育,全学段教育规划,能力提升,幼小衔接,定向择校,单招规划,国际留学,脑象测评"` | title/description 由默认值链路自动继承新 brand，无需改模板 |
| `Header.astro` | 无代码改动 | Logo 文案经 `brand.name`/`brand.nameEn` 自动更新 |
| `Footer.astro` | ①联系方式 ul 新增微信 li（对话/微信语义 SVG + `{brand.wechat}`）②版权行 `© {year} {brand.name}科技有限公司` → `© {year} {brand.name} · All Rights Reserved`（"松博教育科技有限公司"为未证实主体名，去除后缀规避风险） | 服务列表自动取 services 前 6 项，无需手动维护 |
| `Hero.astro` | 顶部徽章硬编码"综合性教育科技公司" → "专注全学段教育规划与能力培养"（PPT 幻灯片1 口径） | 其余品牌/数据字段自动同步 |
| `AboutSection.astro` | ①标签数组 `["教育咨询","生涯规划","素质教育","应试教育","出国留学","教育科技"]` → `["幼小衔接","云伴学","脑象测评","技巧提分","定向择校","国际留学"]`（从 9 大板块中选取各 category 代表项）②正文"科技公司"语境弱化（首段 `{brand.name}科技有限公司` → `{brand.name}`）③右列 4 张硬编码数字卡片：`20+年深耕教育`→`全学段`覆盖、`5大业务协同运营`→`4天`学会一本数学书、`12大服务板块全覆盖`→`9大`业务板块、`全国30+校区布局`→`濮阳`本地深耕 | 消除旧口径数字残留；服务数量口径 12→9 |
| `ServiceGrid.astro` | ①SectionTitle `title="十二大服务板块"` → `title="九大业务"` + `highlight=" 板块"`（或等价改法）②网格 `lg:grid-cols-4` → `lg:grid-cols-3`（9=3×3 完美方阵），`grid-cols-2 md:grid-cols-3` 保留 ③iconMap 加 4 新 key + fallback | 移动端 2 列时 9 项尾行单卡可接受（现有 hover/动画结构不变） |
| `courses.astro` | ①iconMap 同步（与 ServiceGrid 一致）②BaseLayout description 硬编码"松博网络十二大服务板块详解，涵盖基础教育、升学辅导、教育科技…" → "松博教育九大业务板块详解，涵盖能力培养、升学规划与国际留学服务。" | 分组逻辑 `[...new Set(...)]` 零代码改动 |
| `CTASection.astro` | 描述硬编码"松博网络资深顾问" → "松博教育规划师" | tel 链路自动随 brand.phone 更新 |
| `contact.astro` | `contactCards` 数组由 3 项扩为 4 项（新增 `{title:"微信咨询", value: brand.wechat, sub:"工作时间随时沟通", icon: <对话/微信语义 path>}`），网格 `grid md:grid-cols-3` → `grid sm:grid-cols-2 lg:grid-cols-4` | 详见 §4.4 |
| `about.astro` | ①`PageBanner highlight="松博网络"` → `"松博教育"` ②品牌故事两处"松博网络课程"→"松博教育课程"；`<strong>{brand.name}科技有限公司</strong>` → `<strong>{brand.name}</strong>` | milestones 时间线结构不动 |
| `ContactForm.astro` | 课程 `<option>` 硬编码列表（教育咨询/生涯规划/…12 大旧项）→ 由 `services.map(s => s.title)` 动态生成 + 保留"其他" | **PRD 未明示但属品牌一致性必需**：消除旧板块名残留、免双重维护 |

### 4.3 新增组件设计（3 个首页区块）

统一约定：`<section class="py-20 md:py-28 ...">` + 装饰性模糊光斑 + `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` 容器 + SectionTitle 复用 + fadeInUp 交错延迟动画；全部数据 import 自 site.ts，组件无 Props（页面内嵌单实例，与现有区块组件模式一致）。

#### FeaturedProduct.astro（666 特色产品，浅色 bg-white，区分于 ServiceGrid 的 bg-slate-50）

```
<SectionTitle subtitle="FEATURED PRODUCT" title="666特色产品" highlight=" 四天学会一本数学书" />
┌ 核心口号区：featuredProduct.name 大字 text-gradient-brand + tagline + efficiency（badge 样式呈现"学习效率可提升5-20倍"）
├ 三大核心能力：grid sm:grid-cols-3 gap-6，3 张 rounded-2xl p-6 卡（自主学习力/网状整合力/提分答题力，"网状整合力"居中卡 proeminent：col 加 ring/scale 或 accent 边框标记"核心"）
├ 五维学习法 · 十步训练：编号步骤条
│  桌面 lg:grid-cols-5 × 2 行（gap-4）；移动 grid-cols-2 —— 每步：序号圆点 + title + detail
│  （卡片极简：rounded-xl bg-slate-50 p-4，序号用 text-gradient-brand）
└ 问题 vs 能力对比双栏：grid md:grid-cols-2 gap-6
   左卡"解决七大问题"（slate-100 底 + ✗/问题语义标记）｜右卡"提高七大能力"（brand-50 底 + ✓ 对勾）
```

数据来源：`featuredProduct` 全字段。无交互 JS。

#### CasesSection.astro（学员案例，bg-slate-50 承接前区块，与前后浅色交替）

```
<SectionTitle subtitle="CASES" title="学员提分" highlight=" 案例" />
├ grid md:grid-cols-3 gap-6：3 张案例大卡（rounded-2xl bg-white p-7 shadow-card border-slate-100）
│   每卡：顶部匿名标签（{name} · {stage} 徽章）→ highlight 大字 text-3xl text-gradient-brand
│        → before/improvement/detail 说明区（before→after 可用文本箭头 "→" 排版，不引图标库）
└ 声明条：区块底部居中 `mt-10 rounded-xl bg-brand-50 text-brand-700 px-6 py-3 text-sm`
  渲染 {caseDisclaimer}（"个案效果，因人而异"）——三案例共用，单源
```

数据来源：`cases` + `caseDisclaimer`。案例 3 无 before，条件渲染 `{c.before && ...}`。

#### PuyangSection.astro（濮阳专区，深色品牌渐变，与 SubsidiarySection 的深色形成区隔、呼应 Hero）

```
<section class="py-20 md:py-28 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800">（背景光斑布局同 VisionSection）
<SectionTitle subtitle="PUYANG LOCAL" title="濮阳本地" highlight=" 升学辅导专区" light={true} />
├ grid md:grid-cols-3 gap-6：3 张 program 卡（white/5 backdrop-blur border-white/10 深色玻璃卡，风格取 VisionSection 卡片）
│   小升初 / 中考冲刺 / 单招，卡内 title + description
├ 签约保障条：accent 徽章行（bg-accent-400/10 边框 accent-400/30）渲染 puyangZone.guarantee
│   文案唯一："签约保障，未达目标按协议退费"
└ 本地联系条：flex 小卡排列电话/微信/地址（全部 {brand.phone}/{brand.wechat}/{brand.address}）
   电话项用 <a href={`tel:${brand.phone}`}>
```

数据来源：`puyangZone` + `brand`。**禁止在 puyangZone 或组件内复制联系方式字符串**。

### 4.4 联系我们页微信项

- `contactCards` 扩为 4 项：电话 / **微信（第 2 位，提升触达权重）** / 邮箱 / 地址。
- 网格：`grid md:grid-cols-3` → `grid sm:grid-cols-2 lg:grid-cols-4 gap-6`（卡片现有结构 w-14 图标 + title + value + sub 不动，4 列下 value="1990990789" 长度无溢出风险，已有 `break-all`）。
- 详细地址区：拨打电话按钮旁新增"微信咨询"次级按钮/文案行（展示 `{brand.wechat}` 纯文本，微信不支持深链，用复制友好排版）。
- 地图区块同步：amap URI 的 `name` 参数由"松博网络科技有限公司（尚城大厦11层）"改为"松博教育（胜利路尚城大厦1105室）"；地图标记下两行硬编码（公司名/旧地址）改为消费 `{brand.name}` 与 `{brand.address}`。

### 4.5 首页区块重排（index.astro diff）

```diff
 import ServiceGrid from "../components/ServiceGrid.astro";
+import FeaturedProduct from "../components/FeaturedProduct.astro";
+import CasesSection from "../components/CasesSection.astro";
+import PuyangSection from "../components/PuyangSection.astro";
 import TeamSection from "../components/TeamSection.astro";
 ...
 <BaseLayout>
   <Hero />
   <AboutSection />
   <ServiceGrid />
+  <FeaturedProduct />
+  <CasesSection />
+  <PuyangSection />
   <TeamSection />
   <SubsidiarySection />
   <VisionSection />
   <CTASection />
 </BaseLayout>
```

背景色节奏（深/浅交替，避免视觉粘连）：Hero(深) → About(白) → ServiceGrid(slate-50) → FeaturedProduct(白) → CasesSection(slate-50) → PuyangSection(品牌深) → Team(白) → Subsidiary(slate-900 深) → Vision(品牌深) → CTA(品牌深)。

## 合规改写文案规范（录入规则表，Dev 落文案时逐条执行）

| # | 类别 | PPT/旧官网原文（风险表述） | 官网合规表述 | 落点 |
| :-- | :--- | :--- | :--- | :--- |
| R1 | 录取承诺 | "一对一名校定制…保录取服务""本硕博可保录""硕博可保录取——保毕业" | "一对一名校定制申请与背景提升服务，针对性提升申请竞争力" | services[8].description（国际留学） |
| R2 | 退费承诺 | "考不上目标学校全额退费""培训费全额退还" | "签约保障，未达目标按协议退费" | puyangZone.guarantee；全站唯一合规句式，禁止任何"全额退费"字样 |
| R3 | 心理测评 | "心理状态评估" | "学习状态分析"（文案方向为：找到最佳学习方法/辅助科目选择/一对一检测与分析） | services[4] 脑象测评 description；全站禁"心理"字样 |
| R4 | 效率倍数 | "学习效率提升5-20倍" | "学习效率可提升 5-20 倍"（区间与人称限定保留，禁止"提升20倍"上限表述） | featuredProduct.efficiency |
| R5 | 效果普适化 | 无声明的提分成绩展示 | 统一附加"个案效果，因人而异"声明条 | CasesSection 声明条（caseDisclaimer） |
| R6 | 成果数据 | "50万+学员""200+课程""30+校区""98%满意度" | "超500名学员能力提升""平均提分30分""输送200名学生留学海外""小—博全学段覆盖"（限定语不可删） | stats、AboutSection 数字卡片、milestones |
| R7 | 口语承诺 | "咱濮阳本地实在辅导，不玩套路，只做效果" | "深耕濮阳本地的小升初、中考、单招升学辅导服务"（去口语化承诺） | PuyangSection 引言 |
| R8 | 能力夸大 | "颠覆传统教学模式：不讲课、不讲题" | 保留为产品特色描述但降格为教学法介绍："区别于传统讲授模式，以自主训练为主线：章章自主学、卷卷满分过" | featuredProduct.tagline |
| R9 | 品牌主体 | "松博网络科技有限公司""松博教育科技集团" | 展示面统一"松博教育"；带"科技有限公司"后缀处一律去除（未证实工商主体名） | Footer/about/contact 各硬编码处 |

## 风险与回退

| 风险 | 概率 | 影响 | 缓解与回退 |
| :--- | :--- | :--- | :--- |
| R-1 iconMap 漏补 → 空 SVG | 中 | 中 | ①两级防护：复用优先（5/9 复用现有 key）+ `?? fallbackIcon` 兜底渲染 ②验收强制目检 9 图标 ③回退：数据层 icon 值回指任一既有 key 即可，无需回滚组件 |
| R-2 category 拼写不一致 → 课程中心分组拆分 | 中 | 低 | ①数据层用常量思维：三类取值硬写为字面量，Code Review 时以 grep `"category:"` 核对恰好 3 种取值 ②验收核对分组数=3 |
| R-3 AboutSection/ContactForm/CTA/地图 硬编码旧口径遗漏 | 中 | 中 | §4.2 已全部登记硬编码位置（共 6 文件 12 处）；验收全站 grep：`松博网络`、`400-888-0000`、`50万`、`12大`、`30+ 校区`、`98%` |
| R-4 services 12→9 后 Footer 前 6 项语义变化 | 低 | 低 | 9 项顺序设计已让前 6 项恰好为"能力培养5 + 定向择校"，语义通顺；目检页脚即可，无代码改动 |
| R-5 新增区块文案溢出导致移动端错位 | 低 | 中 | 新组件复用现有卡片语义类；十步训练移动端落 2 列；验收移动端逐屏目检 |
| 回退策略 | — | — | 纯静态站，git 分支隔离开发；回退 = 还原 site.ts 与 index.astro 两个文件的 commit。无数据库/状态迁移，回退零成本 |

## 验收映射（PRD §6 全部 23 项 → 实现位置）

| 验收项 | 实现位置 / 验证动作 |
| :--- | :--- |
| 6.1 无 `400-888-0000` 残留 | site.ts brand.phone；grep src/ |
| 6.1 无 `松博网络`/`SONGBO NETWORK` 残留 | site.ts brand + BaseLayout keywords + CTASection/about/contact/Footer 硬编码处；grep src/ |
| 6.1 无 `50万+`/`200+精品课程`/`30+校区`/`98%` 残留 | site.ts stats + AboutSection 数字卡片 + milestones；grep src/ |
| 6.1 stats 四项 PPT 口径 | site.ts §3.2 表 |
| 6.1 services 九大板块合规 | site.ts §3.3 表 |
| 6.1 案例 3 项 + 声明 | site.ts cases/caseDisclaimer + CasesSection 声明条 |
| 6.2 首页区块次序 | index.astro §4.5 diff |
| 6.2 图标无空渲染、无控制台报错 | iconMap 9 key + fallback（§4.1）；浏览器目检+Console |
| 6.2 课程中心分组正确 | services category 三值；目检 3 组 |
| 6.2 联系页微信项 + 栅格无错位 | contact.astro §4.4（sm:grid-cols-2 lg:grid-cols-4） |
| 6.2 移动端排版正常 | 新组件响应式栅格（§4.3）；目检 |
| 6.3 无"保录取"字样 | services[8] 描述（R1）；grep src/ |
| 6.3 无"全额退费"原句 | puyangZone.guarantee（R2）；grep src/ |
| 6.3 无"心理状态评估" | services[4] 描述（R3）；grep src/ |
| 6.3 成果数据带限定语 | stats + AboutSection 卡片（R6）；目检 |
| 6.4 `npm run build` 零错误/零 TS 错误 | 末轮构建；ServiceItem 等接口未变，新接口自洽 |
| 6.4 构建产物 title/meta 无旧品牌名 | BaseLayout 默认值链路；检查 dist/index.html |
| 6.4 未新增页面/路由、navItems 不变 | src/pages 仅 4 页不变；site.ts navItems 未动 |
| FR-1 Footer/CTA/联系页电话+tel 可用 | brand.phone 单源；Footer/CTASection/contact 消费端目检 tel:18135773531 |
| FR-1 Footer/联系页展示微信 | brand.wechat 单源；Footer li + contactCards 目检 |
| FR-4 666 区块内容完整（十步/三能力/七问题/七能力） | featuredProduct 数据完整性对照 PPT 幻灯片8；目检 |
| FR-5 无微信截图图片引用 | CasesSection 纯文本渲染，无 <img>；grep dist |
| FR-7 四个虚构区块保留且后移 | index.astro 次序（§4.5）；目检 Team/Subsidiary/Vision 渲染 |

## Technology Stack Summary

| 层 | 技术 | 版本 | 本次变更 |
| :--- | :--- | :--- | :--- |
| 框架 | Astro | ^7.2.0 | 不变 |
| 样式 | Tailwind CSS + @tailwindcss/vite | ^4.3.3 | 不变；不新增 @theme 令牌 |
| 语言 | TypeScript strict | astro/tsconfigs/strict | 新增 3 个数据接口（§3.4） |
| 运行时 | Node.js | >=22.12.0 | 不变 |
| 新增依赖 | — | — | **零新增** |

## 实施顺序建议（Dev 任务切片）

1. site.ts：brand/stats/services/弱化文案 + 3 个新数据对象（类型自洽先行）
2. iconMap 双处同步（含 fallback）+ ServiceGrid 网格/标题
3. 三个新组件 + index.astro 重排
4. 全局硬编码清扫（BaseLayout keywords / AboutSection / CTASection / about / contact / ContactForm / amap 链接）
5. `npm run build` + grep 验收矩阵 + 目检

## Appendix

### ADR-001：iconMap 不抽离共享模块
- **Context**：iconMap 在 ServiceGrid 与 courses 双处内嵌，新增 4 key 需双改。
- **Decision**：本次维持双处内嵌，通过 fallback + 验收强检管控；抽离为 `src/data/icons.ts` 列入后续技术债。
- **Consequences**：本次 diff 面最小，符合 PRD 范围控制；后续再改 icon 仍需双改，已登记债务。

### ADR-002：Footer 版权去掉"科技有限公司"后缀
- **Context**：现版权行拼接 `{brand.name}科技有限公司`，更名后为"松博教育科技有限公司"，属未证实工商主体。
- **Decision**：版权、about、contact 等处的"科技有限公司"后缀一律去除，仅展示"松博教育"。
- **Consequences**：规避未证实主体名风险；若后续营业执照确认，可数据层统一恢复。

### ADR-003：合规声明在数据层而非组件层
- **Context**："个案效果，因人而异"等声明文案。
- **Decision**：声明存入 site.ts（`caseDisclaimer`），组件仅渲染。
- **Consequences**：文案变更无需碰组件代码，与"内容即数据"架构原则一致。

---
*Document Version*: 1.0
*Date*: 2025-03-24
*Author*: Winston (BMAD System Architect)
*Quality Score*: 96/100
*PRD Reference*: 01-product-requirements.md
