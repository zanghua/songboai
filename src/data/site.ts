/**
 * 松博教育 - 集中数据源
 * 所有业务数据统一管理，组件通过 import 引用
 */

// ============ 品牌信息 ============
export const brand = {
  name: "松博教育",
  nameEn: "SONGBO EDUCATION",
  slogan: "科学规划 · 能力提升",
  description:
    "松博教育以“科学规划 + 能力提升”为核心，是覆盖从小学到博士全学段的教育服务培训指导提供商。业务涵盖生源对接、生涯规划、自主学习力培养、技巧提分、定向升学培训、单招规划与国际本硕博留学等多元服务。",
  phone: "18135773531",
  wechat: "1990990789",
  email: "songboai@189.cn",
  address: "濮阳市华龙区胜利路尚城大厦1105室",
  icp: "豫ICP备2026038031号-1",
};

// ============ 导航菜单 ============
export const navItems = [
  { label: "首页", href: "/" },
  { label: "课程中心", href: "/courses" },
  { label: "关于我们", href: "/about" },
  { label: "联系我们", href: "/contact" },
];

// ============ 统计数据（PPT 口径，保留限定语） ============
export const stats = [
  { value: "超500名", label: "学员能力提升" },
  { value: "30分", label: "平均提分" },
  { value: "200名", label: "学生输送留学海外" },
  { value: "小—博", label: "全学段覆盖" },
];

// ============ 九大业务板块（PPT 口径） ============
export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  category: string;
}

export const services: ServiceItem[] = [
  {
    icon: "bridge",
    title: "幼小衔接",
    description:
      "趣味识字、经典熏陶与全脑潜能训练，帮助孩子平稳过渡到小学，奠定成长基石。",
    category: "能力培养",
  },
  {
    icon: "postgrad",
    title: "初高中自主学习能力培养",
    description:
      "传授目标拆解、时间管理、错题复盘等高效自学法，助力从“被动接受”转向“主动学习”。",
    category: "能力培养",
  },
  {
    icon: "cloud",
    title: "云伴学（小初高）",
    description:
      "调结构、提效率、真减负，抓住学习主动权，让孩子每天早睡 1 小时。",
    category: "能力培养",
  },
  {
    icon: "brain",
    title: "脑象测评",
    description:
      "一对一检测与分析，定位学习状态，找到最佳学习方法，辅助科目选择与志愿填报。",
    category: "能力培养",
  },
  {
    icon: "exam",
    title: "技巧提分",
    description:
      "提炼初高中科目应试技巧与高频考点解题思路，结合学情定制方案，突破学业瓶颈。",
    category: "能力培养",
  },
  {
    icon: "college",
    title: "定向择校",
    description:
      "幼升小、小升初、初升高：选定目标学校、针对性定制方案、方案实施与达成入学。",
    category: "升学规划",
  },
  {
    icon: "route",
    title: "单招规划",
    description:
      "深入解读单招政策，制定笔试面试备考策略，为成绩中等或偏科学生提供差异化升学路径。",
    category: "升学规划",
  },
  {
    icon: "study-abroad",
    title: "国际留学",
    description:
      "热门地区院校申请指导与全程服务、一站式规划及高起本至硕升博的名校定制申请与背景提升服务。",
    category: "国际留学",
  },
  {
    icon: "planning",
    title: "生源与升学规划",
    description:
      "全学段个性化对接与长期路径规划，让成长路径更清晰、升学更有方向。",
    category: "升学规划",
  },
];

// ============ 666 特色产品（PPT 幻灯片8） ============
export interface FeaturedProductStep {
  title: string;
  detail?: string;
}

export interface FeaturedProduct {
  badge: string;
  name: string;
  tagline: string;
  efficiency: string;
  overview: string;
  coreAbilities: string[];
  methodSteps: FeaturedProductStep[];
  problems: string[];
  gains: string[];
}

export const featuredProduct: FeaturedProduct = {
  badge: "666 特色产品",
  name: "四天学会一本数学书",
  tagline: "区别于传统讲授模式，以自主训练为主线：章章自主学、卷卷满分过",
  efficiency: "学习效率可提升 5-20 倍",
  overview:
    "以“网状整合力”为核心，8分钟激发孩子学习兴趣，小组主题式 PBL 训练模式，将数学零散无序的知识点整理成有序有逻辑的知识系统，以“知识点 + 题型 + 解题方法”三维提分逻辑为重点，个性化、筛查式训练体系。",
  coreAbilities: ["自主学习力", "网状整合力", "提分答题力"],
  methodSteps: [
    { title: "朗读两遍" },
    { title: "指读两遍" },
    { title: "划重点", detail: "定义/定理/定律/公式/问句/例题" },
    { title: "摘抄", detail: "三定/公式/例题" },
    { title: "提取反馈", detail: "重点/难点/考点/易错点" },
    { title: "思维导图挑错" },
    { title: "开卷练" },
    { title: "闭卷考" },
    { title: "形成脑智能图" },
    { title: "默写整书脉络", detail: "强化输出、形成链接、高效提取" },
  ],
  problems: [
    "学习没兴趣",
    "学习习惯差",
    "不想主动学",
    "知识不会用",
    "学习效率低",
    "成绩提升慢",
    "反应速度慢",
  ],
  gains: [
    "持续学习能力",
    "自我竞争能力",
    "统筹规划能力",
    "建立自信积极的性格",
    "发现问题解决问题能力",
    "轻松学习能力",
    "高效学习能力",
  ],
};

// ============ 学员提分案例（PPT 幻灯片17，匿名化） ============
export interface CaseItem {
  name: string;
  stage: string;
  highlight: string;
  before?: string;
  improvement: string;
  detail?: string;
}

export const cases: CaseItem[] = [
  {
    name: "傅同学",
    stage: "高三",
    highlight: "高考 526 分",
    before: "报课前 429 分",
    improvement: "提升近 100 分，录取江西农林大学",
  },
  {
    name: "程同学",
    stage: "高三",
    highlight: "高考总分 534 分",
    before: "报课前总分 347.5 分",
    improvement: "六科稳步提升，语数英三科突破 90 分",
    detail: "语文 115 / 数学 112 / 英语 96 / 物理 53 / 化学 75 / 生物 83",
  },
  {
    name: "某同学",
    stage: "高三",
    highlight: "英语 111 分",
    improvement: "冲刺 3 个月，英语单科 85 → 111 分，提升 26 分",
  },
];

// 区块级统一声明（三案例共用，单源）
export const caseDisclaimer = "个案效果，因人而异";

// ============ 濮阳专区（PPT 幻灯片26，合规化） ============
export interface PuyangProgram {
  title: string;
  description: string;
}

export interface PuyangZone {
  programs: PuyangProgram[];
  guarantee: string;
}

export const puyangZone: PuyangZone = {
  programs: [
    {
      title: "小升初",
      description: "考前学习规划 + 目标学校政策详解，升学方向更清晰。",
    },
    {
      title: "中考冲刺",
      description: "抓考点、补弱科、练方法，科学冲刺稳步提升。",
    },
    {
      title: "单招",
      description: "文化课考试技巧 + 面试专项辅导，笔面一起练。",
    },
  ],
  guarantee: "签约保障，未达目标按协议退费",
};

// ============ 专家团队 ============
export interface TeamMember {
  name: string;
  title: string;
  description: string;
  expertise: string[];
}

export const team: TeamMember[] = [
  {
    name: "臧老师",
    title: "董事长 · 首席教育专家",
    description:
      "深耕教育领域二十余年，潜心研发松博教育课程体系，构建成熟教研体系并实现规模化商业落地，学术成果卓著。",
    expertise: ["课程研发", "教研体系建设", "教育战略规划"],
  },
  {
    name: "李老师",
    title: "联合创始人 · 教育总监",
    description:
      "资深教育专家，在全年龄段教育赋能领域拥有丰富经验，主导能力培养与升学规划课程体系构建。",
    expertise: ["课程设计", "教学方法创新", "师资培训"],
  },
  {
    name: "张老师",
    title: "联合创始人 · 学术顾问",
    description:
      "资深学者，致力于青少年全周期成长研究，构建了完整的学习能力与生涯发展理论体系。",
    expertise: ["青少年成长研究", "学习能力研究", "生涯规划"],
  },
  {
    name: "陈老师",
    title: "总裁 · 商业运营负责人",
    description:
      "拥有二十年教育行业运营经验，专注教育服务体系构建与区域市场深耕。",
    expertise: ["商业战略", "市场开拓", "公司运营"],
  },
];

// ============ 业务板块 ============
export interface Subsidiary {
  name: string;
  focus: string;
  description: string;
}

export const subsidiaries: Subsidiary[] = [
  {
    name: "启航教育",
    focus: "教育咨询",
    description: "专注于教育信息咨询与学业规划服务，为学员提供精准的成长路径指导。",
  },
  {
    name: "学考教育",
    focus: "应试培训",
    description: "以高效学习法为核心，助力学员在各类考试中取得优异成绩。",
  },
  {
    name: "智学科技",
    focus: "教育科技",
    description: "致力于智慧教育软硬件产品研发，用科技赋能教育创新。",
  },
  {
    name: "艺术教育",
    focus: "素质拓展",
    description: "涵盖艺术、体育、科创等多元拓展课程，全面培养综合素养。",
  },
  {
    name: "高途教育",
    focus: "升学辅导",
    description: "提供升学路径规划与留学申请等一站式服务，助力学员圆梦理想院校。",
  },
];

// ============ 愿景使命 ============
export const vision = {
  vision: "让每个孩子找到适合自己的学业成长路径，提升终身竞争力。",
  mission: "致力打造覆盖从小学到博士全教育阶段的成长直通专列。",
  values: [
    { title: "利国", description: "心系教育报国，助力人才培养" },
    { title: "利民", description: "服务万千家庭，点亮孩子未来" },
    { title: "利教", description: "赋能教育生态，共创行业价值" },
  ],
};

// ============ 发展历程 ============
export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export const milestones: Milestone[] = [
  {
    year: "2022",
    title: "品牌创立",
    description: "松博教育在濮阳正式成立，开启教育征程",
  },
  {
    year: "2023",
    title: "体系成型",
    description: "完成能力培养与升学规划双线课程体系建设",
  },
  {
    year: "2024",
    title: "体系化运营",
    description: "完成能力培养与升学规划双线业务体系建设",
  },
  {
    year: "2025",
    title: "服务落地",
    description: "云伴学与脑象测评等服务体系落地，线上线下融合推进",
  },
  {
    year: "2026",
    title: "本地深耕",
    description: "深耕濮阳本地教学服务，累计帮助超500名学员实现能力提升",
  },
];
