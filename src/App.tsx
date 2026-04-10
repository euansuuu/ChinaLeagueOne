import { useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight, Trophy, MapPinned, ShieldCheck, Flame, Share2 } from "lucide-react";

// 类型定义
interface Option {
  text: string;
  delta: Record<string, number>;
  tags: number[];
}

interface TeamType {
  code: string;
  name: string;
  club: string;
  city: string;
  color: string;
  motto: string;
  description: string;
  tags: string[];
}

interface ScoreResult {
  winner: TeamType;
  dims: Record<string, number>;
  dominance: number;
  banter: number;
}

function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-3xl border ${className}`}>{children}</div>;
}

function CardHeader({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

function CardContent({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}

function CardTitle({ className = "", children }: { className?: string; children: ReactNode }) {
  return <h2 className={className}>{children}</h2>;
}

function CardDescription({ className = "", children }: { className?: string; children: ReactNode }) {
  return <p className={className}>{children}</p>;
}

interface ButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "md" | "lg";
  disabled?: boolean;
  children: ReactNode;
  [key: string]: unknown;
}

function Button({ className = "", variant = "default", size = "md", disabled = false, children, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";
  const sizes = {
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };
  const variants = {
    default: "bg-white text-black hover:opacity-90",
    outline: "border border-white/20 bg-transparent text-white hover:bg-white/10",
    ghost: "bg-transparent text-white hover:bg-white/10",
  };

  return (
    <button className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.default} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  );
}

function Badge({ className = "", children }: { className?: string; children: ReactNode }) {
  return <span className={`inline-flex items-center rounded-full ${className}`}>{children}</span>;
}

function Progress({ value = 0, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-full ${className}`}>
      <div className="h-full rounded-full bg-emerald-400 transition-all duration-300" style={{ width: `${value}%` }} />
    </div>
  );
}

const teamTypes = [
  {
    code: "YAT-AI",
    name: "北境复兴者",
    club: "长春亚泰",
    city: "长春",
    color: "from-emerald-500 to-lime-400",
    motto: "见过高峰，也扛得住坠落。回来，就要把秩序重新立起来。",
    description:
      "你不太迷信热闹，更在意球队有没有骨架、纪律和翻盘的底气。你相信真正的强队气质不是一两场球吹出来的，而是在低谷里也能稳住阵脚。",
    tags: ["复兴派", "纪律感", "老牌底蕴"],
  },
  {
    code: "MEI-ZHOU",
    name: "山城技术流",
    club: "梅州客家",
    city: "五华",
    color: "from-red-500 to-orange-400",
    motto: "足球是生活方式，不只是结果公告。",
    description:
      "你对地方文化和足球传承特别敏感。你喜欢有技术含量、有成长线的球队，相信气质和方法会慢慢沉淀成战绩。",
    tags: ["技术派", "文化感", "耐心型"],
  },
  {
    code: "YAN-BIAN",
    name: "边境信仰派",
    club: "延边龙鼎",
    city: "延吉",
    color: "from-rose-500 to-red-400",
    motto: "远一点没关系，热爱自己会发光。",
    description:
      "你把归属感看得比一切都重。你愿意远征，愿意熬夜，愿意为了主队和故乡情绪站一整场。球迷这件事，对你来说是身份，不是爱好。",
    tags: ["死忠", "远征党", "归属感"],
  },
  {
    code: "GONG-FU",
    name: "硬核执行者",
    club: "石家庄功夫",
    city: "石家庄",
    color: "from-slate-700 to-zinc-500",
    motto: "少一点花活，多一点到位。",
    description:
      "你对比赛的第一要求是：别虚。你欣赏执行力、身体对抗和战术完整度，支持一支队时也偏向直接、清楚、有效率。",
    tags: ["务实派", "高执行", "不绕弯"],
  },
  {
    code: "JIANG-XI",
    name: "潜行成长型",
    club: "江西定南赣联",
    city: "定南",
    color: "from-cyan-500 to-sky-400",
    motto: "不喧哗，但一直在变强。",
    description:
      "你不是最吵的人，却很擅长长期观察。你会看青年球员、看体系打磨、看球队有没有在悄悄变完整。你相信成长比爆红更可靠。",
    tags: ["观察型", "养成系", "耐看"],
  },
  {
    code: "NAN-TONG",
    name: "重启战斗员",
    club: "南通支云",
    city: "如皋",
    color: "from-blue-600 to-sky-500",
    motto: "掉下来不丢人，站不起来才丢人。",
    description:
      "你很擅长面对现实，也愿意重新再来。你支持的从来不是表面的级别，而是那种经历波动后仍然保持咬劲的球队精神。",
    tags: ["反弹流", "现实派", "扛压型"],
  },
  {
    code: "DA-LIAN",
    name: "海风浪漫派",
    club: "大连鲲城",
    city: "大连",
    color: "from-sky-500 to-indigo-500",
    motto: "既要有风骨，也要有一点看海的浪漫。",
    description:
      "你对足球的审美要求很高。你喜欢节奏感、城市气质和看台故事交织在一起的感觉，希望球队既有硬度，也有点让人记住的优雅。",
    tags: ["审美派", "城市感", "气质流"],
  },
  {
    code: "SHAAN-XI",
    name: "看台烈焰团",
    club: "陕西联合",
    city: "西安",
    color: "from-red-600 to-amber-500",
    motto: "没点火气，不配说自己在看球。",
    description:
      "你天生适合热血看台。你要歌声、要压迫感、要全场一起起来的情绪洪流。球队赢球很重要，但有没有把现场点燃，对你同样重要。",
    tags: ["主场核弹", "热血系", "氛围党"],
  },
  {
    code: "SU-ZHOU",
    name: "细节控战术脑",
    club: "苏州东吴",
    city: "苏州",
    color: "from-emerald-600 to-teal-400",
    motto: "看球不只看比分，也看线路、节奏和空间。",
    description:
      "你很懂得欣赏一支队如何把比赛拆开来踢。你关注跑位、边中衔接、压迫触发点，是那种朋友圈里最容易写长文复盘的人。",
    tags: ["分析型", "细节党", "会复盘"],
  },
  {
    code: "NAN-JING",
    name: "都市均衡派",
    club: "南京城市",
    city: "南京",
    color: "from-violet-500 to-fuchsia-500",
    motto: "既要看得舒服，也要活得体面。",
    description:
      "你支持球队的方式比较克制，但很稳定。你不容易因为一场输赢就失控，更在意球队整体是不是成熟、有秩序、能长期带来信任感。",
    tags: ["均衡型", "理性派", "稳定感"],
  },
  {
    code: "NING-BO",
    name: "新城筑基者",
    club: "宁波队",
    city: "宁波",
    color: "from-cyan-600 to-blue-400",
    motto: "基础先打牢，故事才有资格发生。",
    description:
      "你能接受过程中的粗糙，因为你明白一支队的身份感和根系需要时间建立。你愿意做早期支持者，陪着球队一点点长出来。",
    tags: ["建设派", "陪跑型", "长期主义"],
  },
  {
    code: "FO-SHAN",
    name: "岭南热场王",
    club: "佛山南狮",
    city: "佛山",
    color: "from-orange-500 to-amber-400",
    motto: "球可以慢热，气氛不能。",
    description:
      "你对现场感极其敏锐。你欣赏有烟火气、有人情味的比赛环境，喜欢把看球这件事变成朋友聚会、城市节日和情绪出口。",
    tags: ["热场型", "烟火气", "社交派"],
  },
  {
    code: "SHEN-ZHEN",
    name: "锋线冒险家",
    club: "深圳青年人",
    city: "深圳",
    color: "from-teal-500 to-cyan-400",
    motto: "年轻就该敢一点，直一点，快一点。",
    description:
      "你喜欢速度、空间和突然性的进攻。你支持那种带着试错勇气往前冲的队伍，哪怕不够圆熟，也必须有冲劲和新鲜感。",
    tags: ["年轻派", "敢打型", "速度党"],
  },
  {
    code: "GUANG-XI",
    name: "南国爆点手",
    club: "广西恒宸",
    city: "南宁",
    color: "from-lime-500 to-green-500",
    motto: "新来的，也要踢出存在感。",
    description:
      "你天生偏爱上升期球队。你会被那种带着新鲜气、挑战旧秩序的冲劲吸引，喜欢看到黑马从无到有地制造声量。",
    tags: ["黑马控", "上升势", "新锐派"],
  },
  {
    code: "GUANG-ZHOU",
    name: "越秀进取者",
    club: "广东广州豹",
    city: "广州",
    color: "from-yellow-500 to-orange-500",
    motto: "大城市看球，排面和野心都不能少。",
    description:
      "你天然带点目标导向。你希望球队有企图心，有镜头感，有往上走的明确意愿。对你来说，支持一支队也意味着支持一种野心。",
    tags: ["进取型", "目标感", "排面党"],
  },
  {
    code: "WU-XI",
    name: "江南新变量",
    club: "无锡吴钩",
    city: "无锡",
    color: "from-indigo-500 to-violet-500",
    motto: "没被定义过，才更有意思。",
    description:
      "你不喜欢一眼看到头的故事。你支持那些还有很多可能性的队伍，愿意和他们一起试错、进化、长出自己的轮廓。",
    tags: ["新变量", "好奇心", "可能性"],
  },
];

const dimensionKeys = [
  "热血值",
  "理性值",
  "归属值",
  "战术值",
  "逆风值",
  "氛围值",
  "远征值",
  "嘴硬值",
  "成长值",
  "秩序值",
  "冒险值",
  "技术值",
  "韧性值",
  "城市感",
  "情怀值",
];

const questions: { text: string; options: Option[] }[] = [
  {
    text: "你看一场中甲，最先在意的通常是什么？",
    options: [
      { text: "看台和主场气氛先到位", delta: { 氛围值: 2, 热血值: 1 }, tags: [7, 11] },
      { text: "战术布置和比赛内容", delta: { 战术值: 2, 理性值: 1 }, tags: [8, 9] },
      { text: "球队精神状态和拼劲", delta: { 逆风值: 2, 韧性值: 1 }, tags: [0, 5] },
      { text: "城市气质和俱乐部故事", delta: { 城市感: 2, 情怀值: 1 }, tags: [1, 6] },
    ],
  },
  {
    text: "遇到球队连败时，你更像哪种球迷？",
    options: [
      { text: "继续骂，但一场不落地看", delta: { 归属值: 2, 嘴硬值: 1 }, tags: [2, 7] },
      { text: "开始复盘阵型和用人", delta: { 战术值: 2, 理性值: 1 }, tags: [8, 3] },
      { text: "相信总能慢慢缓过来", delta: { 韧性值: 2, 成长值: 1 }, tags: [4, 10] },
      { text: "想看球队什么时候狠狠干回来", delta: { 热血值: 2, 逆风值: 1 }, tags: [0, 5] },
    ],
  },
  {
    text: "你最容易被哪种球队气质打动？",
    options: [
      { text: "有传统、有根、有地方身份", delta: { 情怀值: 2, 归属值: 1 }, tags: [1, 2] },
      { text: "干净利落、执行到位", delta: { 秩序值: 2, 理性值: 1 }, tags: [0, 3] },
      { text: "敢冲敢打，年轻就上", delta: { 冒险值: 2, 热血值: 1 }, tags: [12, 15] },
      { text: "还在成长，但看得见上升势头", delta: { 成长值: 2, 技术值: 1 }, tags: [13, 14] },
    ],
  },
  {
    text: "朋友约你去客场远征，你的第一反应是？",
    options: [
      { text: "走，球迷就该有点行动力", delta: { 远征值: 2, 热血值: 1 }, tags: [2, 7] },
      { text: "先看对手和值不值得这趟", delta: { 理性值: 2, 战术值: 1 }, tags: [8, 9] },
      { text: "看预算，但心里已经想去了", delta: { 归属值: 2, 情怀值: 1 }, tags: [1, 6] },
      { text: "主场更香，我更想把主场做热", delta: { 氛围值: 2, 城市感: 1 }, tags: [11, 10] },
    ],
  },
  {
    text: "你更欣赏哪种赢球方式？",
    options: [
      { text: "控住节奏，稳稳拿下", delta: { 秩序值: 2, 战术值: 1 }, tags: [0, 9] },
      { text: "逆风翻盘，血压拉满", delta: { 逆风值: 2, 热血值: 1 }, tags: [5, 7] },
      { text: "青春冲击，场面够快够猛", delta: { 冒险值: 2, 技术值: 1 }, tags: [12, 15] },
      { text: "全场氛围顶满，像过节一样", delta: { 氛围值: 2, 城市感: 1 }, tags: [6, 11] },
    ],
  },
  {
    text: "你在社媒上聊球最常见的状态是？",
    options: [
      { text: "输出情绪，先爽再说", delta: { 嘴硬值: 2, 热血值: 1 }, tags: [2, 7] },
      { text: "摆数据、摆逻辑、摆细节", delta: { 理性值: 2, 战术值: 1 }, tags: [8, 9] },
      { text: "分享主场照片和城市氛围", delta: { 城市感: 2, 氛围值: 1 }, tags: [6, 11] },
      { text: "关注年轻球员和未来空间", delta: { 成长值: 2, 冒险值: 1 }, tags: [12, 15] },
    ],
  },
  {
    text: "如果球队只剩一个标签，你希望它是？",
    options: [
      { text: "铁血", delta: { 韧性值: 2, 逆风值: 1 }, tags: [3, 5] },
      { text: "聪明", delta: { 战术值: 2, 理性值: 1 }, tags: [8, 9] },
      { text: "有人味", delta: { 情怀值: 2, 城市感: 1 }, tags: [1, 11] },
      { text: "有未来", delta: { 成长值: 2, 冒险值: 1 }, tags: [10, 13] },
    ],
  },
  {
    text: "以下哪种比赛最能让你上头？",
    options: [
      { text: "对抗多、节奏快、火药味足", delta: { 热血值: 2, 韧性值: 1 }, tags: [3, 7] },
      { text: "拉扯细、局部博弈多", delta: { 战术值: 2, 技术值: 1 }, tags: [8, 9] },
      { text: "地方德比，主场声浪炸裂", delta: { 氛围值: 2, 归属值: 1 }, tags: [2, 11] },
      { text: "黑马冲击强队", delta: { 冒险值: 2, 成长值: 1 }, tags: [13, 14] },
    ],
  },
  {
    text: "你更像哪类看球搭子？",
    options: [
      { text: "负责吼、负责带节奏", delta: { 氛围值: 2, 热血值: 1 }, tags: [7, 11] },
      { text: "负责复盘、讲清楚怎么赢怎么输", delta: { 理性值: 2, 战术值: 1 }, tags: [8, 9] },
      { text: "负责组织出行和票务", delta: { 远征值: 2, 秩序值: 1 }, tags: [2, 0] },
      { text: "负责发现潜力股和新故事", delta: { 成长值: 2, 冒险值: 1 }, tags: [12, 15] },
    ],
  },
  {
    text: "你会因为什么长期支持一支球队？",
    options: [
      { text: "它代表我的城市/故乡", delta: { 归属值: 2, 情怀值: 1 }, tags: [1, 2] },
      { text: "它踢得有条理，能让人信任", delta: { 秩序值: 2, 理性值: 1 }, tags: [0, 9] },
      { text: "它够狠，逆风也不散", delta: { 逆风值: 2, 韧性值: 1 }, tags: [3, 5] },
      { text: "它让我觉得还会变得更好", delta: { 成长值: 2, 技术值: 1 }, tags: [10, 13] },
    ],
  },
  {
    text: "你对‘大牌’这件事的态度更接近？",
    options: [
      { text: "不重要，体系最重要", delta: { 战术值: 2, 秩序值: 1 }, tags: [0, 8] },
      { text: "有当然更好，排面也是足球的一部分", delta: { 城市感: 2 }, tags: [14, 6] },
      { text: "年轻人冲出来更让我兴奋", delta: { 冒险值: 2, 成长值: 1 }, tags: [12, 15] },
      { text: "只要看台不冷，大牌不大牌随缘", delta: { 氛围值: 2, 情怀值: 1 }, tags: [7, 11] },
    ],
  },
  {
    text: "主队最后十分钟落后，你更希望看到什么？",
    options: [
      { text: "高压猛攻，先把场面打热", delta: { 热血值: 2, 冒险值: 1 }, tags: [7, 12] },
      { text: "清楚的边路套路和定位球设计", delta: { 战术值: 2, 理性值: 1 }, tags: [8, 9] },
      { text: "全队不慌，按计划一点点撕开", delta: { 秩序值: 2, 韧性值: 1 }, tags: [0, 5] },
      { text: "看台全站起来，一起把气势抬上去", delta: { 氛围值: 2, 归属值: 1 }, tags: [2, 11] },
    ],
  },
  {
    text: "你更认可哪种俱乐部成长路线？",
    options: [
      { text: "慢慢夯实，稳扎稳打", delta: { 成长值: 2, 秩序值: 1 }, tags: [4, 10] },
      { text: "抓住窗口，迅速往上冲", delta: { 冒险值: 2, 城市感: 1 }, tags: [13, 14] },
      { text: "靠死忠文化把主场做成壁垒", delta: { 归属值: 2, 氛围值: 1 }, tags: [2, 7] },
      { text: "靠比赛内容建立长期口碑", delta: { 技术值: 2, 战术值: 1 }, tags: [1, 8] },
    ],
  },
  {
    text: "你理想中的中甲比赛日是什么样？",
    options: [
      { text: "从下午开始就有人聊球、聚餐、进场", delta: { 氛围值: 2, 城市感: 1 }, tags: [6, 11] },
      { text: "开球后专注比赛，不太想被打扰", delta: { 理性值: 2, 技术值: 1 }, tags: [8, 9] },
      { text: "最好还有远征和点对点对抗感", delta: { 远征值: 2, 热血值: 1 }, tags: [2, 7] },
      { text: "能看到小将成长和新体系成型", delta: { 成长值: 2, 冒险值: 1 }, tags: [12, 15] },
    ],
  },
  {
    text: "你对‘升班马’的天然态度是？",
    options: [
      { text: "想看它能不能掀翻旧秩序", delta: { 冒险值: 2, 成长值: 1 }, tags: [13, 15] },
      { text: "先看它站不站得稳", delta: { 理性值: 2, 秩序值: 1 }, tags: [0, 10] },
      { text: "如果主场有劲，我会立刻好感", delta: { 氛围值: 2, 热血值: 1 }, tags: [7, 11] },
      { text: "地方文化鲜明就很加分", delta: { 情怀值: 2, 城市感: 1 }, tags: [1, 2] },
    ],
  },
  {
    text: "看完一场 0:0，你会更看重哪一点？",
    options: [
      { text: "防守组织有没有站住", delta: { 秩序值: 2, 理性值: 1 }, tags: [0, 3] },
      { text: "有没有战术细节可聊", delta: { 战术值: 2, 技术值: 1 }, tags: [8, 9] },
      { text: "现场氛围值不值得回票价", delta: { 氛围值: 2, 城市感: 1 }, tags: [6, 11] },
      { text: "球员有没有拼到最后", delta: { 韧性值: 2, 逆风值: 1 }, tags: [5, 7] },
    ],
  },
  {
    text: "以下哪句话最像你会说的？",
    options: [
      { text: "输可以，别踢得没章法。", delta: { 理性值: 2, 秩序值: 1 }, tags: [0, 9] },
      { text: "主场得先把对面气势压下去。", delta: { 氛围值: 2, 热血值: 1 }, tags: [7, 11] },
      { text: "这队还有空间，再看看。", delta: { 成长值: 2, 技术值: 1 }, tags: [4, 15] },
      { text: "只要是自己这队，我就跟到底。", delta: { 归属值: 2, 情怀值: 1 }, tags: [1, 2] },
    ],
  },
  {
    text: "你会被哪种内容吸引着连续追一支球队？",
    options: [
      { text: "地方文化、球迷故事、城市记忆", delta: { 情怀值: 2, 城市感: 1 }, tags: [1, 6] },
      { text: "战报、数据、长图复盘", delta: { 理性值: 2, 战术值: 1 }, tags: [8, 9] },
      { text: "纪录片感的逆袭和翻身戏码", delta: { 逆风值: 2, 韧性值: 1 }, tags: [0, 5] },
      { text: "新秀、换血和体系更新", delta: { 成长值: 2, 冒险值: 1 }, tags: [12, 15] },
    ],
  },
  {
    text: "你支持球队时最怕什么？",
    options: [
      { text: "没有灵魂，只剩任务感", delta: { 情怀值: 2, 归属值: 1 }, tags: [1, 2] },
      { text: "没有计划，踢哪算哪", delta: { 秩序值: 2, 理性值: 1 }, tags: [0, 8] },
      { text: "不敢拼，落后就认命", delta: { 热血值: 2, 韧性值: 1 }, tags: [3, 5] },
      { text: "没新意，故事一眼到头", delta: { 冒险值: 2, 成长值: 1 }, tags: [13, 15] },
    ],
  },
  {
    text: "你最喜欢哪类主场画面？",
    options: [
      { text: "万人齐唱，耳朵发麻", delta: { 氛围值: 2, 归属值: 1 }, tags: [2, 7] },
      { text: "球场和城市气质特别搭", delta: { 城市感: 2, 情怀值: 1 }, tags: [6, 11] },
      { text: "比赛内容足够紧凑，没空分神", delta: { 战术值: 2, 理性值: 1 }, tags: [8, 9] },
      { text: "能看出球队一点点把信心踢出来", delta: { 成长值: 2, 韧性值: 1 }, tags: [4, 10] },
    ],
  },
  {
    text: "如果你来给球队定招募标准，你更偏向？",
    options: [
      { text: "先找能打硬仗的", delta: { 韧性值: 2, 热血值: 1 }, tags: [3, 5] },
      { text: "先找适配体系的", delta: { 战术值: 2, 秩序值: 1 }, tags: [0, 8] },
      { text: "先找有潜力可挖的", delta: { 成长值: 2, 冒险值: 1 }, tags: [12, 15] },
      { text: "先找能让球迷有感情的", delta: { 情怀值: 2, 城市感: 1 }, tags: [1, 6] },
    ],
  },
  {
    text: "你会因为什么决定买周边或球衣？",
    options: [
      { text: "因为这就是我的队", delta: { 归属值: 2, 情怀值: 1 }, tags: [1, 2] },
      { text: "因为设计和气质都在线", delta: { 城市感: 2, 技术值: 1 }, tags: [6, 14] },
      { text: "因为这是某个重要赛季的纪念", delta: { 韧性值: 2, 情怀值: 1 }, tags: [0, 5] },
      { text: "因为想支持它继续成长", delta: { 成长值: 2, 归属值: 1 }, tags: [10, 13] },
    ],
  },
  {
    text: "你更希望主队给人留下哪种外部印象？",
    options: [
      { text: "不好惹", delta: { 热血值: 2, 嘴硬值: 1 }, tags: [3, 7] },
      { text: "懂球的人会喜欢", delta: { 战术值: 2, 技术值: 1 }, tags: [8, 9] },
      { text: "这队球迷真有劲", delta: { 氛围值: 2, 归属值: 1 }, tags: [2, 11] },
      { text: "这队未来值得押注", delta: { 成长值: 2, 冒险值: 1 }, tags: [13, 15] },
    ],
  },
  {
    text: "你最接受不了哪种输法？",
    options: [
      { text: "缩着输，没脾气", delta: { 热血值: 2, 逆风值: 1 }, tags: [3, 5] },
      { text: "乱着输，没思路", delta: { 理性值: 2, 秩序值: 1 }, tags: [0, 8] },
      { text: "主场气氛冷掉，像没来过", delta: { 氛围值: 2, 城市感: 1 }, tags: [7, 11] },
      { text: "该练的人没练出来", delta: { 成长值: 2, 技术值: 1 }, tags: [4, 15] },
    ],
  },
  {
    text: "你觉得一支中甲队最迷人的地方是什么？",
    options: [
      { text: "它和城市之间真实的互相需要", delta: { 情怀值: 2, 归属值: 1 }, tags: [1, 2] },
      { text: "它能把普通联赛踢出门道", delta: { 技术值: 2, 战术值: 1 }, tags: [8, 9] },
      { text: "它每场都像在证明自己", delta: { 韧性值: 2, 成长值: 1 }, tags: [10, 13] },
      { text: "它总能制造一些很燃的瞬间", delta: { 热血值: 2, 氛围值: 1 }, tags: [7, 11] },
    ],
  },
  {
    text: "你理想中的球迷身份更像？",
    options: [
      { text: "一个城市的一部分", delta: { 城市感: 2, 归属值: 1 }, tags: [1, 6] },
      { text: "一个懂比赛的人", delta: { 理性值: 2, 战术值: 1 }, tags: [8, 9] },
      { text: "一个会把气势顶起来的人", delta: { 热血值: 2, 氛围值: 1 }, tags: [2, 7] },
      { text: "一个愿意陪球队变强的人", delta: { 成长值: 2, 情怀值: 1 }, tags: [10, 15] },
    ],
  },
  {
    text: "如果只能保留一种看球情绪，你选？",
    options: [
      { text: "燃", delta: { 热血值: 2, 逆风值: 1 }, tags: [3, 7] },
      { text: "懂", delta: { 理性值: 2, 技术值: 1 }, tags: [8, 9] },
      { text: "爱", delta: { 归属值: 2, 情怀值: 1 }, tags: [1, 2] },
      { text: "盼", delta: { 成长值: 2, 冒险值: 1 }, tags: [13, 15] },
    ],
  },
  {
    text: "面对赛季目标，你的态度通常是？",
    options: [
      { text: "一步一步来，先稳定住", delta: { 秩序值: 2, 韧性值: 1 }, tags: [0, 10] },
      { text: "有机会就往上狠狠干", delta: { 冒险值: 2, 热血值: 1 }, tags: [13, 14] },
      { text: "成绩之外，也要把主场文化做起来", delta: { 氛围值: 2, 归属值: 1 }, tags: [2, 11] },
      { text: "关键是球队有没有变更完整", delta: { 技术值: 2, 成长值: 1 }, tags: [4, 8] },
    ],
  },
  {
    text: "你理想中的中甲球迷圈是？",
    options: [
      { text: "够吵、够直、够真诚", delta: { 嘴硬值: 2, 热血值: 1 }, tags: [2, 7] },
      { text: "能聊内容，别只会喊口号", delta: { 理性值: 2, 战术值: 1 }, tags: [8, 9] },
      { text: "有地方性，也有朋友感", delta: { 城市感: 2, 情怀值: 1 }, tags: [6, 11] },
      { text: "愿意给新人和新队时间", delta: { 成长值: 2, 冒险值: 1 }, tags: [10, 15] },
    ],
  },
  {
    text: "最后一题：你为什么还愿意认真看中甲？",
    options: [
      { text: "因为这里离真实的足球生活更近", delta: { 情怀值: 2, 城市感: 1 }, tags: [1, 11] },
      { text: "因为这里仍然有很多值得研究的内容", delta: { 战术值: 2, 理性值: 1 }, tags: [8, 9] },
      { text: "因为这里的热爱常常更直接、更倔", delta: { 热血值: 2, 归属值: 1 }, tags: [2, 7] },
      { text: "因为这里永远有新故事在长出来", delta: { 成长值: 2, 冒险值: 1 }, tags: [13, 15] },
    ],
  },
];

function initialDimensions() {
  return Object.fromEntries(dimensionKeys.map((k) => [k, 0]));
}

function scoreResult(answers: Option[]): ScoreResult {
  const dims: Record<string, number> = initialDimensions();
  const teamScores = new Array(teamTypes.length).fill(0);

  answers.forEach((option) => {
    Object.entries(option.delta || {}).forEach(([k, v]) => {
      dims[k] = (dims[k] || 0) + (v as number);
    });
    (option.tags || []).forEach((idx: number) => {
      teamScores[idx] += 1;
    });
  });

  const dimensionBonusMap = [
    ["秩序值", "韧性值"],
    ["技术值", "情怀值"],
    ["归属值", "远征值"],
    ["秩序值", "热血值"],
    ["成长值", "理性值"],
    ["逆风值", "韧性值"],
    ["城市感", "技术值"],
    ["热血值", "氛围值"],
    ["战术值", "技术值"],
    ["理性值", "秩序值"],
    ["成长值", "归属值"],
    ["氛围值", "城市感"],
    ["冒险值", "技术值"],
    ["成长值", "冒险值"],
    ["城市感", "热血值"],
    ["冒险值", "成长值"],
  ];

  dimensionBonusMap.forEach((keys, idx) => {
    keys.forEach((key) => {
      teamScores[idx] += (dims[key] || 0) * 0.35;
    });
  });

  let bestIndex = 0;
  for (let i = 1; i < teamScores.length; i += 1) {
    if (teamScores[i] > teamScores[bestIndex]) bestIndex = i;
  }

  const totalScore = teamScores.reduce((a, b) => a + b, 0) || 1;
  const dominance = Math.round((teamScores[bestIndex] / totalScore) * 100 + 35);
  const banter = Math.min(10, Math.max(5, Math.round(((dims.热血值 + dims.氛围值 + dims.嘴硬值) / 6) * 1.4)));

  return {
    winner: teamTypes[bestIndex],
    dims,
    dominance: Math.min(100, dominance),
    banter,
  };
}

function cnMax(dims: Record<string, number>): [string, number][] {
  return Object.entries(dims)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5) as [string, number][];
}

export default function ZhongjiaLeagueTest() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Option[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const current = questions[index];
  const progress = Math.round((answers.filter(Boolean).length / questions.length) * 100);
  const result = useMemo(() => (submitted ? scoreResult(answers) : null as ScoreResult | null), [submitted, answers]);

  const handlePick = (option: Option) => {
    const next = [...answers];
    next[index] = option;
    setAnswers(next);
  };

  const goNext = () => {
    if (!answers[index]) return;
    if (index < questions.length - 1) setIndex(index + 1);
  };

  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const reset = () => {
    setStarted(false);
    setIndex(0);
    setAnswers([]);
    setSubmitted(false);
  };

  const readyToSubmit = answers.filter(Boolean).length === questions.length;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]"
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader className="space-y-4">
                  <Badge className="w-fit bg-emerald-500/20 px-3 py-1 text-sm text-emerald-200">
                    CL1TI · China League One Type Indicator
                  </Badge>
                  <div className="space-y-3">
                    <CardTitle className="text-4xl font-black leading-tight md:text-6xl text-white">
                      <span className="bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                        SBTI 已经过时，
                      </span>
                      <br />
                      现在轮到 <span className="text-emerald-400">中甲人格测试</span> 了。
                    </CardTitle>
                    <CardDescription className="max-w-2xl text-base leading-7 text-neutral-200 md:text-lg">
                      基于原站的单页测试结构复刻，改为中甲联赛主题。30 道题，测出你骨子里最像哪支 2026 赛季中甲球队的灵魂球迷。
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-4 shadow-lg shadow-black/20">
                      <div className="text-sm text-neutral-300">题目数</div>
                      <div className="mt-1 text-3xl font-extrabold text-emerald-300">30</div>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-4 shadow-lg shadow-black/20">
                      <div className="text-sm text-neutral-300">结果类型</div>
                      <div className="mt-1 text-3xl font-extrabold text-emerald-300">16</div>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-4 shadow-lg shadow-black/20">
                      <div className="text-sm text-neutral-300">测试风格</div>
                      <div className="mt-1 text-2xl font-bold text-white">嘴硬但认真</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      className="font-semibold bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-lg shadow-emerald-500/20 hover:scale-105 hover:shadow-emerald-400/40"
                      onClick={() => setStarted(true)}
                    >
                      开始测试
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 hover:scale-105"
                      onClick={() => setStarted(true)}
                    >
                      直接开答
                    </Button>
                  </div>

                  <p className="text-sm leading-6 text-neutral-200">
                    友情提示：这是娱乐向球迷人格测试，结果更偏“气质映射”而不是严肃数据建模。全答完才会放行，你的中甲灵魂正在被扫描。
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-6">
                <Card className="border-white/20 bg-gradient-to-br from-emerald-500/20 via-teal-500/12 to-cyan-500/12 shadow-xl shadow-emerald-950/30 backdrop-blur-xl">
                  <CardHeader className="space-y-3">
                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/15 ring-1 ring-emerald-300/20">
                        <Trophy className="h-5 w-5 text-emerald-300" />
                      </div>
                      <span className="bg-gradient-to-r from-emerald-200 to-cyan-100 bg-clip-text text-transparent">
                        结果样式
                      </span>
                    </CardTitle>
                    <CardDescription className="text-base leading-7 text-white/90">你会得到一个球队人格名、代号、主描述和 15 维评分。</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-white/90">
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <div className="text-white/70">示例</div>
                      <div className="mt-2 text-2xl font-extrabold tracking-tight text-white">看台烈焰团 / SHAAN-XI</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4 leading-7 text-white/85">
                      附带：主类型、痴迷度、嘴炮力、维度画像、结果解读。
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/15 bg-white/5 shadow-xl shadow-black/20 backdrop-blur-xl">
                  <CardHeader className="space-y-3">
                    <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
                        <MapPinned className="h-5 w-5 text-cyan-300" />
                      </div>
                      <span className="bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                        2026 中甲映射
                      </span>
                    </CardTitle>
                    <CardDescription className="text-base leading-7 text-white/90">共 16 支球队人格原型。</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {teamTypes.map((team) => (
                      <Badge key={team.code} className="border border-white/10 bg-white/10 px-3 py-1 text-sm font-medium text-white shadow-sm shadow-black/10 hover:bg-white/15">
                        {team.club}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : !submitted ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-3xl space-y-6"
            >
              <div className="flex items-center justify-between gap-4">
                <Button variant="ghost" className="text-neutral-200 hover:text-white" onClick={reset}>
                  返回首页
                </Button>
                <div className="text-sm text-neutral-200">{answers.filter(Boolean).length} / {questions.length}</div>
              </div>

              <Card className="border-white/10 bg-white/5">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center justify-between text-sm text-neutral-200">
                    <span>第 {index + 1} 题</span>
                    <span>全选完才会放行</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-white/10" />
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 shadow-2xl shadow-black/20">
                <CardHeader>
                  <CardTitle className="text-2xl leading-9 md:text-3xl text-white">{current.text}</CardTitle>
                  <CardDescription className="text-neutral-200">请选择最接近你真实反应的一项。</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {current.options.map((option, i) => {
                    const active = answers[index]?.text === option.text;
                    return (
                      <button
                        key={i}
                        onClick={() => handlePick(option)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          active
                            ? "border-emerald-400 bg-emerald-400/15"
                            : "border-white/10 bg-white/10 hover:border-white/25 hover:bg-white/5"
                        }`}
                      >
                        <div className="text-base font-medium text-white">{option.text}</div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-3">
                  <Button variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10" onClick={goPrev} disabled={index === 0}>
                    <ChevronLeft className="h-4 w-4" /> 上一题
                  </Button>
                  {index < questions.length - 1 ? (
                    <Button className="bg-white text-black" onClick={goNext} disabled={!answers[index]}>
                      下一题 <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button className="bg-white text-black" onClick={() => readyToSubmit && setSubmitted(true)} disabled={!readyToSubmit}>
                      提交并查看结果
                    </Button>
                  )}
                </div>
                {!readyToSubmit && <div className="text-sm text-neutral-200">请认真作答，少一题都不给你出结果。</div>}
              </div>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-4xl space-y-6"
            >
              <Card className="overflow-hidden border-white/10 bg-white/5">
                <div className={`bg-gradient-to-r ${result.winner.color} p-6 md:p-8`}>
                  <div className="text-sm uppercase tracking-[0.25em] text-white">你的人格类型是</div>
                  <div className="mt-3 text-4xl font-black md:text-6xl">{result.winner.name}</div>
                  <div className="mt-2 text-lg text-white md:text-2xl">{result.winner.code}</div>
                  <div className="mt-4 max-w-3xl text-base leading-7 text-white md:text-lg">{result.winner.motto}</div>
                </div>

                <CardContent className="space-y-6 p-6 md:p-8">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <div className="text-sm text-neutral-200">你的主类型</div>
                      <div className="mt-1 text-xl font-bold">{result.winner.code}（{result.winner.club}）</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <div className="text-sm text-neutral-200">痴迷度</div>
                      <div className="mt-1 text-xl font-bold">{result.dominance}%</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <div className="text-sm text-neutral-200">嘴炮力</div>
                      <div className="mt-1 text-xl font-bold">{result.banter} / 10</div>
                    </div>
                  </div>

                  <Card className="border-white/10 bg-white/10">
                    <CardHeader>
                      <CardTitle className="text-xl">该人格的深度解读</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-neutral-200">
                      <p className="leading-7">{result.winner.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {result.winner.tags.map((tag: string) => (
                          <Badge key={tag} className="bg-white/10 px-3 py-1 text-white hover:bg-white/10">{tag}</Badge>
                        ))}
                        <Badge className="bg-white/10 px-3 py-1 text-white hover:bg-white/10">{result.winner.city}</Badge>
                        <Badge className="bg-white/10 px-3 py-1 text-white hover:bg-white/10">{result.winner.club}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                    <Card className="border-white/10 bg-white/10">
                      <CardHeader>
                        <CardTitle className="text-xl">十五维度评分</CardTitle>
                        <CardDescription className="text-neutral-200">维度命中度较高，当前结果可视为你的中甲球迷灵魂画像。</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {dimensionKeys.map((key) => {
                          const value = Math.min(100, (result.dims[key] || 0) * 10 + 20);
                          return (
                            <div key={key} className="space-y-2">
                              <div className="flex items-center justify-between text-sm text-neutral-200">
                                <span>{key}</span>
                                <span>{value}</span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                <div className="h-full rounded-full bg-white" style={{ width: `${value}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>

                    <div className="grid gap-6">
                      <Card className="border-white/10 bg-white/10">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-xl"><ShieldCheck className="h-5 w-5" /> 你的高命中标签</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                          {cnMax(result.dims).map(([k, v]) => (
                            <Badge key={k} className="bg-white/10 px-3 py-1 text-white hover:bg-white/10">{k} {v}</Badge>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="border-white/10 bg-white/10">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-xl"><Flame className="h-5 w-5" /> 友情提示</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm leading-6 text-neutral-200">
                          <p>本测试纯属娱乐，不代表任何俱乐部或联赛官方立场。</p>
                          <p>你可以嘴硬，但别太当真——毕竟看中甲的人，多少都带点真爱。</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-white text-black" onClick={reset}><RotateCcw className="h-4 w-4" /> 重新测试</Button>
                    <Button variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10" onClick={reset}>回到首页</Button>
                    <Button variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10">
                      <Share2 className="h-4 w-4" /> 分享截图
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
