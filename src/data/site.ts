/**
 * 松博网络 - 集中数据源
 * 所有业务数据统一管理，组件通过 import 引用
 */

// ============ 品牌信息 ============
export const brand = {
  name: "松博网络",
  nameEn: "SONGBO NETWORK",
  slogan: "启智铸梦 · 博学致远",
  description:
    "松博网络科技有限公司，立足优质教育资源沃土，由资深教育专家与商业运营精英强强联合，倾力打造中国全方位素质教育与应试教育赋能平台。",
  phone: "400-888-0000",
  email: "contact@songboedu.com",
  address: "河南省濮阳市华龙区尚城大厦11层",
  icp: "豫ICP备2025XXXXXX号",
};

// ============ 导航菜单 ============
export const navItems = [
  { label: "首页", href: "/" },
  { label: "课程中心", href: "/courses" },
  { label: "关于我们", href: "/about" },
  { label: "联系我们", href: "/contact" },
];

// ============ 统计数据 ============
export const stats = [
  { value: "50万+", label: "累计服务学员" },
  { value: "200+", label: "精品课程" },
  { value: "30+", label: "全国校区" },
  { value: "98%", label: "学员满意度" },
];

// ============ 12大服务板块 ============
export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  category: string;
}

export const services: ServiceItem[] = [
  {
    icon: "consultation",
    title: "教育咨询",
    description: "提供专业教育规划与学业指导方案",
    category: "基础教育",
  },
  {
    icon: "planning",
    title: "生涯规划",
    description: "全周期职业生涯规划与个性发展路径",
    category: "基础教育",
  },
  {
    icon: "quality",
    title: "素质教育",
    description: "综合素养提升与兴趣爱好多元培养",
    category: "基础教育",
  },
  {
    icon: "exam",
    title: "应试教育",
    description: "高效学习方法赋能，精准提分冲刺",
    category: "基础教育",
  },
  {
    icon: "college",
    title: "高考志愿填报",
    description: "专业高报团队，精准定位理想院校",
    category: "升学辅导",
  },
  {
    icon: "postgrad",
    title: "考研考博",
    description: "研究生备考一站式辅导服务",
    category: "升学辅导",
  },
  {
    icon: "upgrade",
    title: "专升本",
    description: "专科升本科系统化培训方案",
    category: "升学辅导",
  },
  {
    icon: "ielts",
    title: "雅思托福",
    description: "出国语言考试高效提分课程",
    category: "升学辅导",
  },
  {
    icon: "study-abroad",
    title: "出国留学",
    description: "全球院校申请与一站式留学服务",
    category: "升学辅导",
  },
  {
    icon: "tech",
    title: "教育科技研发",
    description: "软硬件一体化智慧教育产品研发",
    category: "教育科技",
  },
  {
    icon: "psychology",
    title: "青少年心理滋养",
    description: "专业心理辅导与身心健康发展",
    category: "基础教育",
  },
  {
    icon: "comprehensive",
    title: "综合素养培育",
    description: "德智体美劳全面发展体系",
    category: "基础教育",
  },
];

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
    description: "深耕教育领域二十余年，潜心研发松博网络课程体系，构建成熟教研体系并实现规模化商业落地，学术成果卓著。",
    expertise: ["课程研发", "教研体系建设", "教育战略规划"],
  },
  {
    name: "李老师",
    title: "联合创始人 · 教育总监",
    description: "著名教育专家，在全年龄段教育赋能领域拥有丰富经验，主导素质教育与应试教育融合课程开发。",
    expertise: ["素质教育", "教学方法创新", "师资培训"],
  },
  {
    name: "张老师",
    title: "联合创始人 · 学术顾问",
    description: "资深学者，致力于青少年全周期成长研究，构建了完整的综合素养培育理论体系。",
    expertise: ["青少年成长研究", "心理教育", "生涯规划"],
  },
  {
    name: "陈老师",
    title: "总裁 · 商业运营负责人",
    description: "拥有二十载商业实战经验，在教育商业领域开拓亿万市场，以卓越才智带领公司登顶商业巅峰。",
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
    focus: "素质教育",
    description: "涵盖艺术、体育、科创等多元素质课程，全面培养综合素养。",
  },
  {
    name: "高途教育",
    focus: "升学辅导",
    description: "提供高报、考研、留学等一站式升学辅导，助力学员圆梦理想院校。",
  },
];

// ============ 愿景使命 ============
export const vision = {
  vision: "成为中国少年自主逐光、快乐成长的教育领航者，立足全球教育新标杆。",
  mission:
    "以科技教育新模式让孩子学习更轻松，让升学考试教育有方向；同时以高标准商业定位赋能教育创业者。",
  values: [
    { title: "利国", description: "心系教育报国，助力人才培养" },
    { title: "利民", description: "服务千万家庭，点亮孩子未来" },
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
    description: "松博网络在濮阳正式成立，开启教育征程",
  },
  {
    year: "2023",
    title: "体系成型",
    description: "完成素质教育与应试教育双轨课程体系建设",
  },
  {
    year: "2024",
    title: "体系化运营",
    description: "成立五大业务板块，实现专业化集群运营",
  },
  {
    year: "2025",
    title: "科技赋能",
    description: "全面布局教育科技，线上线下融合教学落地",
  },
  {
    year: "2026",
    title: "全国布局",
    description: "全国校区持续扩张，累计服务学员超50万",
  },
];
