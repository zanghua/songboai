# Sprint Planning Document: 松博教育官网宣传内容重构（promo-content-update）

## Executive Summary

- **Total Scope**: 47 story points（6 Epic / 12 Story / 41 Task）
- **Estimated Duration**: 2 sprints（4 周）
- **Team Size Assumption**: 1~2 名前端开发（Astro 静态站，单人可全程；验收/目检可由第二人协助）
- **Sprint Length**: 2 weeks
- **Velocity Assumption**: 20~25 points/sprint（按单人主力开发折算；若 2 人并行可压缩为 1 个 Sprint × 高负荷或 2 周交付）
- **架构依据**：site.ts Single Source of Truth；iconMap 双处同步（ADR-001 不抽离）；合规前置在数据层（ADR-003）

---

## Epic Breakdown

### Epic 1: 数据层重构（site.ts）
**Business Value**: 建立唯一权威数据源，品牌/电话/stats/9大板块/新内容数据一次性落地，合规改写内建于录入时，消除虚构口径
**Total Points**: 13
**Priority**: 高（全部后续工作的唯一前置）

#### User Stories:
1. **US-101**: brand 对象重构 + wechat 新增（3 pts）
2. **US-102**: stats 真实化 + 既有对象文案弱化（3 pts）
3. **US-103**: services 12→9 重构（5 pts）
4. **US-104**: 三个新数据对象落地（featuredProduct / cases+disclaimer / puyangZone）（2 pts）

### Epic 2: 图标与既有组件同步（iconMap / ServiceGrid / courses / ContactForm）
**Business Value**: 9 大板块在首页与课程中心正确渲染、图标无空白、分组正确；消除旧板块名在表单中的残留
**Total Points**: 8
**Priority**: 高

#### User Stories:
1. **US-201**: 双处 iconMap 同步 + fallback 兜底（3 pts）
2. **US-202**: ServiceGrid 标题/网格解耦改造（2 pts）
3. **US-203**: courses.astro + ContactForm 旧口径清理（3 pts）

### Epic 3: 三个新首页区块组件
**Business Value**: 666 特色产品、真实案例、濮阳本地化服务三大说服力区块上线，提升咨询转化
**Total Points**: 13
**Priority**: 高

#### User Stories:
1. **US-301**: FeaturedProduct.astro（666 特色产品）（5 pts）
2. **US-302**: CasesSection.astro（学员提分案例）（3 pts）
3. **US-303**: PuyangSection.astro（濮阳专区）（5 pts）

### Epic 4: 首页重排 + 既有区块文案弱化/硬编码清理
**Business Value**: 首页区块次序符合 PRD §3.2，虚构区块保留但弱化，全站硬编码旧口径清零
**Total Points**: 5
**Priority**: 高

#### User Stories:
1. **US-401**: index.astro 区块重排 + 背景色节奏校验（2 pts）
2. **US-402**: 既有组件硬编码清扫（BaseLayout / Hero / AboutSection / CTASection / about.astro / Footer）（3 pts）

### Epic 5: 联系页 + SEO
**Business Value**: 联系方式全渠道可达（电话/微信/地址），SEO 元信息与新品牌口径一致
**Total Points**: 3
**Priority**: 中

#### User Stories:
1. **US-501**: contact.astro 微信项 + 地图区改造（2 pts）
2. **US-502**: BaseLayout SEO 关键词/description 更新（1 pt）

### Epic 6: 构建验证与验收
**Business Value**: 交付质量兜底——构建零错误、23 项验收 grep/目检全过
**Total Points**: 5
**Priority**: 高（收尾闸口）

#### User Stories:
1. **US-601**: 构建验证 + grep 验收矩阵执行 + 多端目检（5 pts）

---

## Detailed User Stories

### US-101: brand 对象重构 + wechat 新增
**Epic**: Epic 1 数据层
**Points**: 3
**Priority**: 高

**User Story**:
As a 站点访问者
I want to 在全站看到"松博教育"统一品牌、真实电话 18135773531、微信 1990990789、真实地址
So that 我确认的信息与公司 PPT 权威口径一致且咨询可达

**Acceptance Criteria**（映射 PRD FR-1 / §6.1）:
- [ ] `brand.name="松博教育"`、`nameEn="SONGBO EDUCATION"`、`phone="18135773531"`、`wechat="1990990789"`（新增 string 字段）、`address="濮阳市华龙区胜利路尚城大厦1105室"`；email/icp 不变
- [ ] slogan 改"科学规划 · 能力提升"；description 采用架构 §3.1 建议文案（97 字，80~150 区间）
- [ ] 全站无 `松博网络`、`SONGBO NETWORK`、`400-888-0000` 残留（在 US-402/US-601 终审）

**Technical Notes**:
- 位置：`src/data/site.ts` brand 对象；架构 §3.1 字段级 diff
- 类型：brand 为对象字面量推断类型，新增 `wechat` 键不破坏既有消费方（TS strict 安全）

**Tasks**:
1. **T-101-1**: brand 7 字段值替换 + 新增 wechat 字段（2h）
   - Type: Implementation
   - Dependencies: 无
2. **T-101-2**: slogan/description 按 PPT 口径撰写并审校限定语（1h）
   - Type: Implementation
   - Dependencies: T-101-1
3. **T-101-3**: 数据层自验（tsc 通过，`import { brand }` 引用编译无误）（1h）
   - Type: Testing
   - Dependencies: T-101-1

**Definition of Done**:
- [ ] 字段值与架构 §3.1 表逐项一致
- [ ] `npm run build`（或 `astro check`）无类型错误
- [ ] 合规规则表 R9（去"科技有限公司"后缀）在 description 中落实

---

### US-102: stats 真实化 + 既有对象文案弱化
**Epic**: Epic 1 数据层
**Points**: 3
**Priority**: 高

**User Story**:
As a 市场负责人
I want to 成果数据与 PPT 口径一致、虚构/夸张文案弱化为中性表述
So that 消除品牌与合规风险

**Acceptance Criteria**（映射 PRD FR-2 / FR-7 / R6）:
- [ ] stats 恰好 4 项：超500名/学员能力提升、含"平均"限定的提分项、200名/学生输送留学海外、小—博/全学段覆盖；"平均"字样可见
- [ ] `team` 保持 4 项、`subsidiaries` 保持 5 项、`vision.values` 保持 3 项（数量守恒）
- [ ] team[0]/team[3]、vision.vision/mission、milestones[2/3/4] 按架构 §3.5 弱化；无"50万""亿万市场""登顶商业巅峰"残留

**Technical Notes**:
- 位置：site.ts stats/team/vision/milestones；架构 §3.2/§3.5
- TeamSection/Subsidiary/Vision **本 Story 不动组件代码**，仅数据值；次序后移在 US-401

**Tasks**:
1. **T-102-1**: stats 4 项替换（value/label 落法按 §3.2 二选一，保留"平均"）（1h）
   - Type: Implementation
   - Dependencies: T-101-1
2. **T-102-2**: team/vision/milestones 7 处文案弱化改写（3h）
   - Type: Implementation
   - Dependencies: 无
3. **T-102-3**: grep 自检虚构词（`50万`/`亿万`/`巅峰`/`五大业务板块`）（0.5h）
   - Type: Testing
   - Dependencies: T-102-1, T-102-2

**Definition of Done**:
- [ ] Hero/StatsBar/milestones 消费端渲染项数不变、限定语可见
- [ ] R6 合规规则全部落实

---

### US-103: services 12→9 重构
**Epic**: Epic 1 数据层
**Points**: 5
**Priority**: 高

**User Story**:
As a 站点访问者
I want to 看到与 PPT 一致的 9 大业务板块介绍
So that 理解公司真实业务并能匹配自身需求

**Acceptance Criteria**（映射 PRD FR-3 / R1 / R3 / §6.1）:
- [ ] services 恰好 9 项，标题/简介/category/icon key 与架构 §3.3 表一致
- [ ] category 取值集合精确 = {能力培养, 升学规划, 国际留学}（grep `"category:"` 恰好 3 种）
- [ ] icon key 全集 = 4 新增（bridge/cloud/brain/route）+ 5 复用；`ServiceItem` 接口不变
- [ ] 国际留学描述无"保录取"（R1）；脑象测评描述无"心理"字样（R3）

**Technical Notes**:
- 位置：site.ts services 数组；9 项顺序即 Footer 前 6 项与课程分组内顺序
- **本 Story 仅改数据**，iconMap SVG path 落 US-201；本 Story 完成前 icon 渲染暂不保证

**Tasks**:
1. **T-103-1**: 9 项 services 数组全文替换（标题+简介按 PPT 幻灯片浓缩）（3h）
   - Type: Implementation
   - Dependencies: 无
2. **T-103-2**: category 三值一致性核对 + R1/R3 合规逐条审查（1h）
   - Type: Testing/Documentation
   - Dependencies: T-103-1
3. **T-103-3**: 简介文案审校（与 ppt-content.md 逐条对照）（2h）
   - Type: Testing
   - Dependencies: T-103-1

**Definition of Done**:
- [ ] grep `"category:" src/data/site.ts` 结果恰好 3 种取值
- [ ] R1/R3 合规规则通过
- [ ] build 无 TS 错误

---

### US-104: 三个新数据对象落地
**Epic**: Epic 1 数据层
**Points**: 2
**Priority**: 高

**User Story**:
As a 开发者
I want to featuredProduct / cases+caseDisclaimer / puyangZone 三个新数据对象与接口就位
So that 新组件可纯 import 消费、零硬编码业务事实

**Acceptance Criteria**（映射 PRD FR-4/5/6 数据部分 / R2/R4/R5/R8）:
- [ ] 新增 `FeaturedProductStep`/`FeaturedProduct`/`CaseItem`/`PuyangProgram`/`PuyangZone` 5 个接口（架构 §3.4 代码块）
- [ ] featuredProduct 十步/三能力/七问题/七能力内容完整无遗漏，efficiency 含"可提升 5-20 倍"区间限定
- [ ] `cases` 3 项数据与 PPT 一致（傅同学 429→526、程同学 534 含分科明细、英语 85→111）；`caseDisclaimer="个案效果，因人而异"` 导出
- [ ] `puyangZone.guarantee` 唯一句式"签约保障，未达目标按协议退费"（R2）；联系方式不进 puyangZone（由 brand 单源消费）

**Tasks**:
1. **T-104-1**: 5 个接口定义（0.5h）
   - Type: Design/Implementation
   - Dependencies: 无
2. **T-104-2**: 三组数据录入 + 对照 PPT 完整性核对（2.5h）
   - Type: Implementation
   - Dependencies: T-104-1
3. **T-104-3**: build 类型自验（新接口自洽）（0.5h）
   - Type: Testing
   - Dependencies: T-104-2

**Definition of Done**:
- [ ] 架构 §3.4 代码块三个对象内容 > 数据完整性对照表逐项打勾
- [ ] R2/R4/R5 合规规则在数据层落实

---

### US-201: 双处 iconMap 同步 + fallback 兜底
**Epic**: Epic 2 图标与既有组件同步
**Points**: 3
**Priority**: 高

**User Story**:
As a 站点访问者
I want to 9 大板块图标在首页与课程中心均正确显示
So that 视觉上理解各板块语义，不出现空白图标

**Acceptance Criteria**（映射 PRD FR-3 / §6.2）:
- [ ] `ServiceGrid.astro` 与 `courses.astro` 两处 iconMap 各含 bridge/cloud/brain/route 4 个新 SVG path（24×24 stroke，Heroicons outline 风格）
- [ ] 两处均实现 `iconMap[service.icon] ?? fallbackIcon`（架构 §4.1，fallback=comprehensive 星星）
- [ ] 9 大板块图标无空渲染、浏览器 Console 无报错
- [ ] 旧 key（consultation/quality/…）保留不动，减少 diff 面

**Technical Notes**:
- ⚠️ **双处同步是本 Story 核心风险**：两处字典必须逐项一致；建议一次性编辑后 diff 两文件 iconMap 段落
- SVG path 视觉语义参照架构 §4.1 表格（幼苗/云朵+对勾/大脑轮廓/分岔路标）

**Tasks**:
1. **T-201-1**: 设计并实现 4 个新 SVG path（24×24 stroke 风格）（3h）
   - Type: Design/Implementation
   - Dependencies: US-103（icon key 名单确定）
2. **T-201-2**: ServiceGrid.astro iconMap 加 4 key + fallback 渲染逻辑（1h）
   - Type: Implementation
   - Dependencies: T-201-1
3. **T-201-3**: courses.astro iconMap 同步 + fallback（1h）
   - Type: Implementation
   - Dependencies: T-201-1
4. **T-201-4**: 两处字典逐项 diff 核对 + dev-server 目检 9 图标（1h）
   - Type: Testing
   - Dependencies: T-201-2, T-201-3

**Definition of Done**:
- [ ] 两处 iconMap key 集合 diff 为空
- [ ] dev 预览 9 图标全部非空、风格一致
- [ ] 兜底出现（星星）时能被人工目检识别

---

### US-202: ServiceGrid 标题/网格解耦改造
**Epic**: Epic 2
**Points**: 2
**Priority**: 高

**User Story**:
As a 站点访问者
I want to 首页服务区块显示"九大业务板块"且 3×3 排列整齐
So that 信息架构清晰

**Acceptance Criteria**（映射 PRD FR-3 / §6.2）:
- [ ] SectionTitle 改为 `title="九大业务" highlight=" 板块"`（或等价）
- [ ] 桌面端 `lg:grid-cols-4` → `lg:grid-cols-3`（9=3×3）；`grid-cols-2 md:grid-cols-3` 保留
- [ ] 移动端 2 列尾行单卡布局可接受，hover/动画结构不变

**Tasks**:
1. **T-202-1**: SectionTitle 文案 + 网格 class 修改（1h）
   - Type: Implementation
   - Dependencies: US-103
2. **T-202-2**: 响应式目检（375px/768px/1440px 三档）（1h）
   - Type: Testing
   - Dependencies: T-202-1

**Definition of Done**:
- [ ] 桌面端恰好 3×3 方阵无错位
- [ ] 现有 shadow-card/hover 效果保持

---

### US-203: courses.astro + ContactForm 旧口径清理
**Epic**: Epic 2
**Points**: 3
**Priority**: 高

**User Story**:
As a 站点访问者
I want to 课程中心分组正确、咨询表单课程选项为最新 9 大板块
So that 提交咨询时选项与实际业务一致

**Acceptance Criteria**（映射 PRD FR-3 FR-8 关联 / §6.2）:
- [ ] courses.astro BaseLayout description 改为"松博教育九大业务板块详解，涵盖能力培养、升学规划与国际留学服务。"
- [ ] 课程中心恰好 3 个分组（能力培养/升学规划/国际留学），无意外拆分
- [ ] ContactForm 课程 `<option>` 由 `services.map(s => s.title)` 动态生成 + 保留"其他"，消除 12 大旧板块名
- [ ] 全站无旧服务名（"教育咨询"作为板块名/"十二大"）残留

**Tasks**:
1. **T-203-1**: courses.astro description 替换（0.5h）
   - Type: Implementation
   - Dependencies: US-103
2. **T-203-2**: ContactForm option 列表动态化改造（2h）
   - Type: Implementation
   - Dependencies: US-103
3. **T-203-3**: 课程中心分节目检 + 表单下拉目检（1h）
   - Type: Testing
   - Dependencies: T-203-1, T-203-2

**Definition of Done**:
- [ ] 分组数 = 3 且名称逐字正确
- [ ] 提交表单选项 10 项（9 板块 + 其他），与 services 顺序一致

---

### US-301: FeaturedProduct.astro（666 特色产品）
**Epic**: Epic 3 新组件
**Points**: 5
**Priority**: 高

**User Story**:
As a 家长访客
I want to 清晰了解"四天学会一本数学书"的方法论与价值
So that 对特色产品产生兴趣并咨询

**Acceptance Criteria**（映射 PRD FR-4 / R4/R8 / §6.2）:
- [ ] 组件位于 ServiceGrid 之后、案例之前（在 US-401 装配时锁定）
- [ ] 完整呈现：核心口号区（name/tagline/efficiency badge）+ 三大核心能力（网状整合力居中突出）+ 十步训练（lg:grid-cols-5×2，移动 2 列）+ 七大问题 vs 七大能力双栏对比
- [ ] 复用 SectionTitle/fadeInUp/rounded 语义类，bg-white
- [ ] 十步、三能力、七问题、七能力内容零遗漏（对照 featuredProduct 数据）
- [ ] 移动端/桌面端排版正常；零交互 JS、零外部资源

**Technical Notes**:
- 布局结构严格按架构 §4.3 FeaturedProduct 示意
- 装饰性光斑 + `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` 容器统一约定
- 效率表述用 badge："学习效率可提升 5-20 倍"（R4 区间限定）

**Tasks**:
1. **T-301-1**: 组件骨架 + 核心口号区（SectionTitle + 大字 + badge）（2h）
   - Type: Implementation
   - Dependencies: US-104
2. **T-301-2**: 三大核心能力栅格（居中卡突出样式）（1h）
   - Type: Implementation
   - Dependencies: T-301-1
3. **T-301-3**: 十步训练编号步骤条（响应式栅格 + 序号圆点）（2h）
   - Type: Implementation
   - Dependencies: T-301-1
4. **T-301-4**: 问题 vs 能力对比双栏 + fadeInUp 交错动画（1h）
   - Type: Implementation
   - Dependencies: T-301-1
5. **T-301-5**: 移动端目检 + 文案照对 PPT 幻灯片8（1h）
   - Type: Testing
   - Dependencies: T-301-2~4

**Definition of Done**:
- [ ] R4/R8 合规表述逐条通过
- [ ] SectionTitle 视觉与其他区块一致

---

### US-302: CasesSection.astro（学员提分案例）
**Epic**: Epic 3 新组件
**Points**: 3
**Priority**: 高

**User Story**:
As a 家长访客
I want to 看到 3 个匿名化真实提分案例
So that 对提分效果建立信任（并知晓个案差异）

**Acceptance Criteria**（映射 PRD FR-5 / R5 / §6.1/6.2）:
- [ ] 3 张案例大卡（匿名标签/name·stage 徽章 + highlight 大字 + before→improvement 箭头排版），案例3 无 before 时条件渲染
- [ ] 区块底部居中声明条渲染 `{caseDisclaimer}`（"个案效果，因人而异"），单源
- [ ] 无微信截图等 `<img>` 引用
- [ ] bg-slate-50，与前后浅色区块交替节奏一致

**Tasks**:
1. **T-302-1**: 组件骨架 + 3 案例卡栅格 + 条件渲染（2h）
   - Type: Implementation
   - Dependencies: US-104
2. **T-302-2**: 声明条样式（brand-50 底 text-sm）+ 数据对照（1h）
   - Type: Implementation
   - Dependencies: T-302-1
3. **T-302-3**: 移动端目检 + grep 确认无 `<img>`（0.5h）
   - Type: Testing
   - Dependencies: T-302-2

**Definition of Done**:
- [ ] 3 案例数据与 PPT 幻灯片17 逐项一致
- [ ] R5 声明可见且唯一

---

### US-303: PuyangSection.astro（濮阳专区）
**Epic**: Epic 3 新组件
**Points**: 5
**Priority**: 高

**User Story**:
As a 濮阳本地家长
I want to 快速看到小升初/中考/单招三类本地辅导与真实联系方式
So that 一键拨号咨询

**Acceptance Criteria**（映射 PRD FR-6 / R2/R7 / §6.2）:
- [ ] 深色品牌渐变区块，`SectionTitle light={true}`；3 张深色玻璃 program 卡（小升初/中考冲刺/单招）
- [ ] 签约保障条唯一句式"签约保障，未达目标按协议退费"（R2）；引言去口语化（R7）
- [ ] 本地联系条全部 `import { brand }` 消费：`<a href={tel:${brand.phone}}>` + wechat + address，**组件内禁止复制联系方式字符串**
- [ ] 区块位于案例之后、Team 之前（US-401 装配锁定）

**Technical Notes**:
- 玻璃卡风格取 VisionSection 卡片；光斑布局参照 VisionSection
- 电话号码不作为数据复制进 puyangZone（架构 §3.4 设计要点）

**Tasks**:
1. **T-303-1**: 组件骨架 + 深色渐变背景 + SectionTitle light（1h）
   - Type: Implementation
   - Dependencies: US-104
2. **T-303-2**: 3 张 program 深色玻璃卡（2h）
   - Type: Implementation
   - Dependencies: T-303-1
3. **T-303-3**: 签约保障条（accent 徽章）+ 本地联系条（tel 链接/wechat/address 全部 brand 消费）（2h）
   - Type: Implementation
   - Dependencies: T-303-1
4. **T-303-4**: 合规 grep（无"全额退费"）+ 移动端目检（1h）
   - Type: Testing
   - Dependencies: T-303-2, T-303-3

**Definition of Done**:
- [ ] R2/R7 合规通过
- [ ] tel 链接可点击拨号为 18135773531

---

### US-401: index.astro 区块重排 + 节奏校验
**Epic**: Epic 4 重排与清理
**Points**: 2
**Priority**: 高

**User Story**:
As a 站点访问者
I want to 首页区块按权威次序展示、深浅背景交替
So that 阅读节奏舒适、虚构区块权重降低

**Acceptance Criteria**（映射 PRD §3.2 / FR-7 / §6.2）:
- [ ] index.astro 3 个 import + 3 个组件插入，次序：Hero → About → ServiceGrid → FeaturedProduct → CasesSection → PuyangSection → Team → Subsidiary → Vision → CTA
- [ ] Team/Subsidiary/Vision 四区块仍正常渲染未被删除（FR-7）
- [ ] 背景色节奏：Hero(深)→About(白)→ServiceGrid(slate-50)→Featured(白)→Cases(slate-50)→Puyang(品牌深)→Team(白)→Subsidiary(slate-900)→Vision(品牌深)→CTA(品牌深)

**Technical Notes**:
- diff 严格按照架构 §4.5 代码块
- **本 Story 是 Epic 3 三个组件的装配闸口**

**Tasks**:
1. **T-401-1**: index.astro import + 区块重排（1h）
   - Type: Implementation
   - Dependencies: US-301, US-302, US-303
2. **T-401-2**: 整页视觉节奏目检 + 区块次序核对（1h）
   - Type: Testing
   - Dependencies: T-401-1

**Definition of Done**:
- [ ] 区块次序 10 项与 §3.2 完全一致
- [ ] 相邻区块无同色粘连（Subsidiary/Vision/CTA 三连深为既有设计，可接受）

---

### US-402: 既有组件硬编码清扫
**Epic**: Epic 4
**Points**: 3
**Priority**: 高

**User Story**:
As a 市场负责人
I want to 全站硬编码文案与旧口径全部清除
So that 品牌口径统一率 100%

**Acceptance Criteria**（映射 PRD FR-1/FR-7/FR-9 / §6.1/6.3）:
- [ ] BaseLayout keywords →"松博教育,全学段教育规划,能力提升,幼小衔接,定向择校,单招规划,国际留学,脑象测评"
- [ ] Hero 徽章"综合性教育科技公司"→"专注全学段教育规划与能力培养"
- [ ] AboutSection：标签数组 6 项替换、首段去"科技有限公司"、右列 4 张数字卡片按架构 §4.2 改（全学段/4天/9大/濮阳）
- [ ] CTASection"松博网络资深顾问"→"松博教育规划师"；about.astro PageBanner highlight + 品牌故事两处 + `<strong>` 后缀去除
- [ ] Footer：版权行 `{brand.name} · All Rights Reserved`（ADR-002）、联系方式 ul 新增微信 li（SVG + `{brand.wechat}`）
- [ ] grep 终审词表：`松博网络|400-888-0000|50万|12大|十二大|30\+ ?校区|98%` 命中数=0

**Tasks**:
1. **T-402-1**: BaseLayout + Hero + CTASection 三处小改（1h）
   - Type: Implementation
   - Dependencies: US-101
2. **T-402-2**: AboutSection 标签数组 + 数字卡片 + 正文后缀（2h）
   - Type: Implementation
   - Dependencies: US-101, US-102, US-103
3. **T-402-3**: about.astro PageBanner/品牌故事/strong 替换（1h）
   - Type: Implementation
   - Dependencies: US-101, US-102
4. **T-402-4**: Footer 微信 li + 版权行（1h）
   - Type: Implementation
   - Dependencies: US-101
5. **T-402-5**: 全站 grep 终审词表 + 目检 Footer 服务列表（自动前 6 项）（1h）
   - Type: Testing
   - Dependencies: T-402-1~4

**Definition of Done**:
- [ ] 架构 §4.2 硬编码清单 12 处全部处理
- [ ] grep 词表命中 0；Footer 前 6 项 = 能力培养 5 + 定向择校

---

### US-501: contact.astro 微信项 + 地图区改造
**Epic**: Epic 5 联系页与 SEO
**Points**: 2
**Priority**: 中

**User Story**:
As a 访客
I want to 联系页直观看到电话/微信/邮箱/地址四项，地图与地址正确
So that 选择最方便的渠道咨询

**Acceptance Criteria**（映射 PRD FR-8 / §6.2）:
- [ ] `contactCards` 扩为 4 项（电话/**微信**（第 2 位）/邮箱/地址），网格 `grid sm:grid-cols-2 lg:grid-cols-4`，栅格无错位
- [ ] 详细地址区新增"微信咨询"行（纯文本排版，复制友好）
- [ ] 地图 amap URI name 参数 →"松博教育（胜利路尚城大厦1105室）"；标记下方公司名/旧地址改消费 `{brand.name}`/`{brand.address}`，不硬编码
- [ ] 移动端/桌面端排版正常

**Tasks**:
1. **T-501-1**: contactCards 4 项 + 网格 + 微信 SVG icon（2h）
   - Type: Implementation
   - Dependencies: US-101
2. **T-501-2**: 详细地址区微信行 + amap URI + 标记文案改造（1h）
   - Type: Implementation
   - Dependencies: T-501-1
3. **T-501-3**: 双端目检（0.5h）
   - Type: Testing
   - Dependencies: T-501-2

**Definition of Done**:
- [ ] 4 卡片栅格协调、微信号 1990990789 展示且来自 `brand.wechat`
- [ ] 地图跳转地址正确

---

### US-502: BaseLayout SEO 更新
**Epic**: Epic 5
**Points**: 1
**Priority**: 中

**Acceptance Criteria**（映射 PRD FR-9 / §6.4）:
- [ ] 默认 title 模板品牌名经 US-101 后自动为"松博教育"；keywords/description 含 PPT 核心关键词
- [ ] about/courses/contact 各页 title 自动继承新口径

**Tasks**:
1. **T-502-1**: keywords/description 话术核对（已合并到 T-402-1 的 grep 终审中复核）（0.5h）
   - Type: Implementation
   - Dependencies: US-101, T-402-1
2. **T-502-2**: dist 产物 title/meta 抽查（并入 US-601 终审）（0h，不独立占用）
   - Type: Testing
   - Dependencies: T-502-1

**Definition of Done**:
- [ ] 各页面 title 经统一模板自动为"松博教育"口径

---

### US-601: 构建验证 + grep 验收矩阵 + 目检
**Epic**: Epic 6 构建验证
**Points**: 5
**Priority**: 高

**User Story**:
As a 交付负责人
I want to 一次构建零错误且 23 项验收全部通过
So that 可以放心上线部署

**Acceptance Criteria**（映射 PRD §6 全部 23 项 + §6.4）:
- [ ] `npm run build` 零错误、零 TS 类型错误
- [ ] grep 终审矩阵（数据/合规两类词表）全部命中 0，list 见下
- [ ] 首页 10 区块次序、9 图标渲染、3 分组、10 项表单选项、联系页 4 项、移动端逐屏——全目检通过
- [ ] dist/check `index.html` `<title>`/meta 无旧品牌名
- [ ] `src/pages` 仅 4 页、navItems 未动（grep 路由）

**终审 grep 词表（在 src/ 执行）**:
```
松博网络|SONGBO NETWORK|400-888-0000
50万\+?|200\+ ?精品课程|30\+ ?校区|98%
保录取|全额退费|心理状态评估|心理健康|心理素质|心理
十二大|12大
```

**Tasks**:
1. **T-601-1**: `npm run build` + tsc 零错误校验 + 修复（含预留 2h 修复缓冲）（2h）
   - Type: Testing
   - Dependencies: 全部 Epic 完成
2. **T-601-2**: grep 终审词表全轮执行 + 修复（1.5h）
   - Type: Testing
   - Dependencies: T-601-1
3. **T-601-3**: 23 项验收清单逐项打勾（含 9 图标目检、分组数、表单选项、移动端逐屏）（2h）
   - Type: Testing
   - Dependencies: T-601-2
4. **T-601-4**: dist 产物 title/meta/console 报错抽查 + 上线 dist 包（1.5h）
   - Type: Testing/Documentation
   - Dependencies: T-601-3
5. **T-601-5**: 回退预案确认（git 分支隔离 + site.ts/index.astro 还原路径）（0.5h）
   - Type: Documentation
   - Dependencies: T-601-4

**Definition of Done**:
- [ ] PRD §6 全部 23 项通过
- [ ] build 日志零 error / 零 warning 级别 TS 报错
- [ ] 回退路径书面确认

---

## Sprint Plan

### Sprint 1（Weeks 1-2）：数据层与既有组件同步
**Sprint Goal**: site.ts 数据层全部就绪（含 3 个新数据对象）+ iconMap 双处同步 + 9 大板块在首页/课程中心正确渲染 + ContactForm 选项动态化
**Planned Velocity**: 21 points

#### Committed Stories:
| Story ID | Title | Points | Priority |
|----------|-------|--------|----------|
| US-101 | brand 对象重构 + wechat 新增 | 3 | 高 |
| US-102 | stats 真实化 + 既有对象文案弱化 | 3 | 高 |
| US-103 | services 12→9 重构 | 5 | 高 |
| US-104 | 三个新数据对象落地 | 2 | 高 |
| US-201 | 双处 iconMap 同步 + fallback | 3 | 高 |
| US-202 | ServiceGrid 网格解耦 | 2 | 高 |
| US-203 | courses + ContactForm 清理 | 3 | 高 |

#### Key Deliverables:
- site.ts 完整数据层（brand/stats/services/featuredProduct/cases/caseDisclaimer/puyangZone + 弱化文案）
- 9 板块在首页与课程中心正确渲染、图标无空白
- ContactForm 课程选项动态化
- Sprint 末 `npm run build` 零错误

#### Dependencies:
- 外部输入：ppt-content.md（唯一文案权威，需 Sprint 开始前可用）
- 内部：US-101 → US-102/402-2/501/502；US-103 → US-201/202/203

#### Risks:
- 文案审校（PPT 幻灯片对照）耗时波动 → T-103-3 预留 2h，超 2h 升级 PO
- iconMap 双处 sync 不一致 → T-201-4 显式 diff 核对任务
- 若 Sprint 1 未完成全部 21pt，Epic 2 剩余项顺延，不挤占 Sprint 2 新组件开发

---

### Sprint 2（Weeks 3-4）：新组件装配 + 全局清理 + 验收交付
**Sprint Goal**: 三个新组件上线并完成首页重排、全站硬编码清零、联系页/SEO 就绪；构建验证与 23 项验收全过，产出可部署 dist
**Planned Velocity**: 26 points

#### Committed Stories:
| Story ID | Title | Points | Priority |
|----------|-------|--------|----------|
| US-301 | FeaturedProduct.astro | 5 | 高 |
| US-302 | CasesSection.astro | 3 | 高 |
| US-303 | PuyangSection.astro | 5 | 高 |
| US-401 | index.astro 区块重排 | 2 | 高 |
| US-402 | 既有组件硬编码清扫 | 3 | 高 |
| US-501 | contact.astro 微信项 + 地图 | 2 | 中 |
| US-502 | BaseLayout SEO 更新 | 1 | 中 |
| US-601 | 构建验证 + 验收矩阵 | 5 | 高 |

#### Key Deliverables:
- 首页 10 区块全新次序如期装配
- 全站硬编码旧口径命中 0
- 联系页 4 项联系卡 + SEO 口径统一
- 通过 23 项验收清单的可部署 dist

#### Dependencies:
- Sprint 1 全部 Epic 完成（新组件依赖数据对象；装配依赖三个组件）
- US-601 是全局终审闸口，占用 Sprint 末尾

#### Risks:
- 新组件移动端文案溢出/错位 → 复用语义类 + T-301-5/T-302-3/T-303-4 各自目检
- 验收阶段发现违规词需返工 → grep 词表前置到 T-402-5 先行，US-601 是二次确认
- Sprint 1 溢出挤压 Sprint 2 → 优先保 US-601 验收时间，US-402/502 可压缩

---

## Critical Path

### 关键路径（决定最短交付周期）:
```
US-101 (brand/wechat) 
  → US-103 (services 9 项) 
    → US-201 (iconMap 双处同步) 
      → US-202 (ServiceGrid 网格) 
        → US-401 (index 装配，依赖 US-301/302/303)
          → US-601 (构建验证终审)
```

平行支线：
- 支线A：US-102（stats/弱化）→ US-402（硬编码清扫）
- 支线B：US-104（新数据）→ US-301/302/303（三个新组件）→ US-401
- 支线C：US-101 → US-501/502（联系页/SEO）

**关键瓶颈**：iconMap 双处同步（US-201）————承接数据层 → 栅格解耦 → 装配。建议最先派熟手完成。

### Potential Bottlenecks:
- **iconMap 双处同步漏 key/fallback 未开**：T-201-4 显式 diff + 兜底防护（fallback=comprehensive）；终审目检 9 图标
- **service.category 拼写不一致 → 课程中心分组拆分**：硬性限制三值 {能力培养, 升学规划, 国际留学}；CR 时 grep `"category:"` 核对恰好 3 种
- **AboutSection 栅格数字卡片 4 项替换语义漂移**：架构 §4.2 给出成对替换表，逐条对应避免创新发挥
- **联系页地图 amap URI 伴侣硬编码被遗漏**：已在 T-501-2 显式覆盖

---

## Risk Register

| Risk | Probability | Impact | Mitigation Strategy | Owner |
|------|------------|--------|-------------------|--------|
| R-1 iconMap 漏补 → 空 SVG 图标 | 中 | 中 | 复用优先（5/9 复用）+ `?? fallbackIcon` 兜底（星星图标）+ T-201-4 diff 核对 + 验收目检；回退 = 数据层 icon 值回指既存 key | Dev |
| R-2 category 拼写不一致 → 分组拆分 | 中 | 低 | 三值字面量硬写 + CR grep `"category:"` 核对恰好 3 种 + 验收核对分组数=3 | Dev |
| R-3 6 处文件 12 个硬编码遗漏 | 中 | 中 | 架构 §4.2 已登记全部硬编码位置；T-402-5 终审 grep 词表 + US-601 二次确认 | Dev |
| R-4 services 12→9 统一 grid 变更错位 | 低 | 中 | lg:grid-cols-3 显式修改 + T-202-2 三档目检；移动端尾行单卡接受 | Dev |
| R-5 新组件文案溢出 → 移动端错位 | 低 | 中 | 复用现有卡片语义类 + 十步训练落 2 列栅格 + 各组件目检任务 | Dev |
| R-6 合规词返工（全额退费/保录取/心理） | 中 | 中 | 合规前置在数据层录入（R1~R9 逐条按表执行）+ T-402-5/US-601 双 grep 终审 | Dev |
| R-7 PPT 幻灯片8/17/26 内容数字化录入纰漏 | 中 | 中 | US-104 对照表录入 + T-301-5/T-302-2 逐项对照审校 | Dev |
| R-8 timebox：Sprint 1 溢出挤占 Sprint 2 | 中 | 低 | 保 US-601 验收固定时段；US-402/502 可压缩；iconMap/装配不允许顺延 | SM |

---

## Dependencies

### Internal Dependencies（任务依赖图摘要）:
- US-101 → US-102, US-402, US-501, US-502, US-103（隐含口径统一）
- US-103 → US-201, US-202, US-203
- US-104 → US-301, US-302, US-303
- US-301 + US-302 + US-303 → US-401
- US-102 → US-402（数字卡片对齐口径）
- 全部 Story → US-601

### External Dependencies:
- **PPT 提取内容（`ppt-content.md`）**：文案唯一权威来源，Sprint 1 开始前必须获取
- 无第三方服务集成、无基础设施部署、无后端依赖
- 上线依赖：宝塔面板静态托管流程（既有流程，非本 Sprint 范围）

---

## Technical Debt Allocation

### 既有登记技术债（本范围外，已知 + 后续）:
- **iconMap 抽离共享模块**（ADR-001 列入后续）：后续单独迭代，当前维持双处
- **ContactForm 提交了无后端（PRD 明确 Out of Scope）**：维持静态行为

### 本次新增技术债控制:
- 无新增；保持"内容即数据"原则阻止硬编码反复滋生
- 长尾文案清理 → 合并入 US-402 一次性完成，不留尾巴

---

## Testing Strategy

### Test Coverage by Sprint:
- **Sprint 1**: 
  - TypeScript 类型自洽（TS strict）每次数据层变更后 `astro check` / `npm run build`
  - grep 自检：`category:` 三值核对、虚构词词表（T-102-3/T-103-2/T-201-4 diff）
  - dev server 功能目检：9 图标渲染、课程分组数、表单选项
- **Sprint 2**:
  - 三档响应式（375/768/1440px）目检每新组件与重排页
  - US-601 终审 grep 词表（数据 + 合规）+ build 零错误 + dist 产物 title/meta/console 抽查
  - 移动端逐屏目检所有 4 页面

### Test Automation Plan:
- **本迭代无自动化新增**（纯静态站内容重构，量级与生命周期不匹配测试工具链建设）
- 采用 grep 词表 + 23 项人工验收清单双轨代办自动化测试职责（符合 Out of Scope 决策）
- CI/CD pipeline：无（本地 `npm run build` + 手动上传部署，既有流程）

---

## Resource Requirements

### Development Team:
- 前端开发：1 名主力（全程）＋0.5 名辅助（可选，用于并行 US-402/501 支线与终审目检）

### Support Requirements:
- DevOps：低（隐性；仅 Sprint 2 末需触发一次 dist 上传，宝塔流程既有）
- QA：低（人工目检为主；若由第二人接目检可降 Dev 单点目检盲区）
- 内容审批人：中（PPT 口径最终签核人——Sprint 末 US-601 联合签核 R1~R9 合规）
- UX/UI：低（新组件复用现有视觉语言，无设计稿需求；如需 4 个新 SVG icon 可由设计给草稿，Dev 兜底手写）

---

## Success Metrics

### Sprint Success Criteria:
- Sprint goal achievement rate：≥ 95%（Sprint 1 七全交付；Sprint 2 全交付+验收过）
- Velocity consistency：预计 21/26 pts，按 1~2 人配置校准；±15% 可接受
- Bug escape rate 线上 0：grep 终审词表命中 0 后上线
- Technical debt ratio：新增债务 0

### Feature Success Criteria（PRD §6 浓缩）:
- 全站品牌口径统一率 100%（无"松博网络"残留）
- 合规红线词表（保录取/全额退费/心理状态评估）全站命中 0
- 成果数据限定语全保留（"超500名"/"平均"）
- 首页 10 区块次序精确匹配 §3.2
- `npm run build` 零错误零 TS 报错

---

## Recommendations

### For Product Owner（PO/内容方）:
- Sprint 1 若能提前 sync PPT 幻灯片6~22 的原图/原文字，可降低 T-103-3 / T-104-2 的对照校对工作量
- 与 PO 在一次 Sprint Planning 上冻结 description / slogan / grand 说辞的最终稿，避免中途变更击穿 US-402 已清扫面
- 上线前共同签字 R1~R9 合规表

### For Development Team:
- iconMap 双处改动必须一次 PR 内完成，且 T-201-4 diff 为强制 Step，不允许跳过
- 所有数据录入对照 PPT 原图逐字打勾，不允许"大意改写"造成 US-601 返工
- 优先级冲突时：数据层 > iconMap > 新组件；清理（US-402）最后做，避免未收口
- 代码 Review Checklist 固定 4 项：category 三值 / tel: 链接 / wechat 单源消费 / iconMap 集合一致

### For Stakeholders:
- 网站整体不引入新视觉体系、不新增路由，交付期望应是"口径一致性 + 新增 3 个说服力区块"，非改版
- KPI 基线：上线前留存旧站电话点击/表单留资数据作为环比基准
- 回退机制已备好：git 分支隔离 + site.ts / index.astro 两文件还原，零成本

---

## Appendix

### Estimation Guidelines Used:
- **1 point**: 单点纯文本替换（keywords / 卡片短语），<2h
- **2 points**: 数据小宇宙 / 简单 props/栅格改造，2~4h
- **3 points**: 中等复杂度（同一文件多字段 / 组件级改造 + grep 自检）
- **5 points**: 复杂（跨文件 / 数据+组件协同 / 新组件全功能）
- **8 pts 及以上**: 本次无（全部拆解到 ≤5）
- Story 总估时换算：points × 2h ≈ 实际工时

### Velocity Assumptions:
- 单人主力开发：20~25 pts/sprint（静态站无联调依赖，密度高于常规团队均值）
- 若派 2 人并行：可压缩为 1 个 Sprint（35~40 pts，需 Daily 同步 iconMap/装配状态）
- 学习曲线：0（架构与工具链均熟悉）

### Agile Ceremonies Schedule:
- Daily Standup：15 min 每日（单人时简化为自报进度的日志）
- Sprint Planning：2h
- Sprint Review：1.5h（含 PPT 内容方联合签核 R1~R9）
- Sprint Retrospective：1h
- Backlog Refinement：1h（Sprint 1 末用于 Sprint 2 装配清单再确认）

### 30-60-90 目检清单（US-601 之外的快速二次确认，上线后）:
- L+1d：电话点击/表单提交是否正常、Console 报错为 0
- L+7d：品牌口径统一率抽验、合规词表抽验
- L+30d：KPI 环比对账（电话/表单）

---
*Document Version*: 1.0
*Date*: 2025-03-24
*Author*: BMAD Scrum Master (Automated)
*Based on*:
  - PRD v1.0（01-product-requirements.md）
  - Architecture v1.0（02-system-architecture.md）
  - Repo Scan v1.0（00-repo-scan.md）
