export type GameStatus = 'playable' | 'coming-soon';

export interface Game {
  id: string;
  title: string;
  chineseTitle?: string;
  category: string;
  categoryEn: string;
  difficulty: number;
  description: string;
  descriptionEn: string;
  tech: string[];
  prodUrl: string;
  devUrl: string;
  accentColor: string;
  status: GameStatus;
}

export const GAMES_DATA: Game[] = [
  {
    id: 'summit-spark',
    title: 'Summit Spark',
    chineseTitle: '山巅微光',
    category: '平台动作',
    categoryEn: 'Platformer',
    difficulty: 5,
    description: '原创高精度平台跳跃游戏原型。包含跳跃、冲刺、攀墙等高精度操作，提供房间 PB 计时、最佳路线幽灵追逐及多项动作手感校准。',
    descriptionEn: 'An original high-precision platformer prototype. Features jumping, dashing, wall climbing, room PB timers, ghost runs, and movement tuning.',
    tech: ['HTML5 Canvas', 'Vanilla JS', 'Physics'],
    prodUrl: 'https://lunora-gather.github.io/summit-spark/',
    devUrl: 'http://localhost:3000/summit-spark/',
    accentColor: '#0ea5e9',
    status: 'playable'
  },
  {
    id: 'YunShenChu',
    title: 'The Deep Cloud',
    chineseTitle: '云深处',
    category: '叙事探索',
    categoryEn: 'Narrative',
    difficulty: 2,
    description: '可交互的空中城市观察台。扫描隐藏频段、锁定异常信号，沿全局线索推进调查，解密云端之上的市民生活与浮空城之谜。',
    descriptionEn: 'An interactive sky city observatory. Scan frequencies, lock anomalies, follow clues, and unravel the mystery of citizens\' lives above the clouds.',
    tech: ['Vite', 'React 19', 'TypeScript'],
    prodUrl: 'https://lunora-gather.github.io/YunShenChu/',
    devUrl: 'http://localhost:5173',
    accentColor: '#8b5cf6',
    status: 'playable'
  },
  {
    id: 'astra-voxel-ark',
    title: 'Astra Voxel Ark',
    chineseTitle: '星野方舟',
    category: '沙盒建造',
    categoryEn: 'Sandbox',
    difficulty: 3,
    description: '第一人称 3D 体素浮岛探索与建造沙盒。采集和放置方块以建设属于你的星野方舟，收集界碑碎片，体验柔和日夜循环与水面星光粒子。',
    descriptionEn: 'A first-person 3D voxel floating island sandbox. Collect and place blocks, gather monument fragments, and experience day-night cycles and water particles.',
    tech: ['Three.js', 'Vite', 'TypeScript'],
    prodUrl: 'https://lunora-gather.github.io/astra-voxel-ark/',
    devUrl: 'http://localhost:5173',
    accentColor: '#10b981',
    status: 'playable'
  },
  {
    id: 'sudoku-game',
    title: 'sudoku',
    chineseTitle: '数独',
    category: '经典解谜',
    categoryEn: 'Puzzle',
    difficulty: 2,
    description: '专业级数独解谜平台。支持经典 9x9、锯齿数独（不规则宫）、对角线数独三种模式，提供位解密求解、无限撤销及历史存档。',
    descriptionEn: 'A professional-grade Sudoku platform. Supports Classic 9x9, Jigsaw, and Diagonal modes, with bitmask solvers, infinite undo, and local saves.',
    tech: ['React 19', 'TypeScript', 'CSS Grid'],
    prodUrl: 'https://lunora-gather.github.io/sudoku-game/',
    devUrl: 'http://localhost:3001',
    accentColor: '#f59e0b',
    status: 'playable'
  },
  {
    id: 'minesweeper-game',
    title: 'minesweeper',
    chineseTitle: '扫雷',
    category: '经典解谜',
    categoryEn: 'Puzzle',
    difficulty: 2,
    description: '工业级高帧率扫雷体验。采用零拷贝 BFS 级联翻开算法及 Fisher-Yates 随机置乱雷区，支持双击快速排雷及首击绝对安全保证。',
    descriptionEn: 'An industrial-grade Minesweeper. Utilizes zero-copy BFS cascades and Fisher-Yates shuffling, featuring quick flagging and first-click safety.',
    tech: ['React 18', 'TypeScript', 'CSS Flexbox'],
    prodUrl: 'https://lunora-gather.github.io/minesweeper-game/',
    devUrl: 'http://localhost:3002',
    accentColor: '#ef4444',
    status: 'playable'
  },
  {
    id: 'crateveil',
    title: 'crateveil',
    chineseTitle: '推箱子',
    category: '经典解谜',
    categoryEn: 'Puzzle',
    difficulty: 3,
    description: '复古未来主义终端推箱子游戏。推动箱子，显现迷宫，连接终端。拥有霓虹 CRT 显像管滤镜与纯代码生成的复古电子音效。',
    descriptionEn: 'A retro-futuristic terminal Sokoban game. Push crates, reveal the maze, connect the terminal. Features CRT scanlines and synthesized Web Audio API.',
    tech: ['HTML5', 'CSS3', 'JS ES6', 'Web Audio API'],
    prodUrl: 'https://lunora-gather.github.io/crateveil/',
    devUrl: 'http://localhost:5175',
    accentColor: '#14b8a6',
    status: 'playable'
  },
  {
    id: '2048',
    title: '2048',
    category: '经典解谜',
    categoryEn: 'Puzzle',
    difficulty: 2,
    description: '精致的网页版 2048。保留经典数字合并规则，并加入 4×4、5×5、6×6 棋盘、主题切换、音效预设、撤销、统计、成就与移动端适配。',
    descriptionEn: 'A polished browser-based 2048 experience with multiple board sizes, themes, sound presets, undo, score stats, achievements, and responsive touch controls.',
    tech: ['HTML5', 'CSS3', 'Vanilla JS', 'Web Audio API'],
    prodUrl: 'https://lunora-gather.github.io/2048/',
    devUrl: 'http://localhost:8080',
    accentColor: '#a855f7',
    status: 'playable'
  },
  {
    id: 'LastArchive',
    title: 'Last Archive',
    chineseTitle: '最后档案城',
    category: '经营模拟',
    categoryEn: 'Simulation',
    difficulty: 4,
    description: '末世避难所经营与 AI 叙事沙盒。在灾难后的废墟中建设城镇、分派工作、平息危机，并在残存的人类记忆中进行抉择，引导人类文明走向不同的终局。',
    descriptionEn: 'A post-apocalyptic shelter simulation and AI narrative sandbox. Manage resources, assign jobs, resolve crises, and make decisions on human memories to guide civilization\'s fate.',
    tech: ['.NET 8.0', 'C#', 'Web UI', 'AI Engine'],
    prodUrl: 'https://huggingface.co/spaces/Jiehu-Claire/last-archive',
    devUrl: 'http://localhost:8080',
    accentColor: '#f97316',
    status: 'playable'
  },
  {
    id: 'Praesidium',
    title: 'Praesidium',
    chineseTitle: '守望',
    category: '策略塔防',
    categoryEn: 'Tower Defense',
    difficulty: 4,
    description: '高完成度科幻塔防网页游戏。包含 6 个主题战役关卡、无尽与每日挑战、种子分享、情报图鉴、波次威胁预告、天赋树、成就、统计、移动端触控优化与发布级验证流程。',
    descriptionEn: 'A polished sci-fi tower defense web game with six themed campaign levels, endless and daily challenges, seed sharing, Intel Codex, wave threat previews, talents, achievements, stats, mobile touch polish, and release-grade verification.',
    tech: ['TypeScript', 'Vite', 'HTML5 Canvas', 'Web Audio API'],
    prodUrl: 'https://lunora-gather.github.io/Praesidium/',
    devUrl: 'http://localhost:5175',
    accentColor: '#22c55e',
    status: 'playable'
  },
  {
    id: 'Imperium-Aeternum',
    title: 'Imperium Aeternum',
    chineseTitle: '永恒帝国',
    category: '策略模拟',
    categoryEn: 'Strategy Sim',
    difficulty: 5,
    description: '以国家治理为核心的历史策略模拟游戏。在财政、粮食、人口、法律、派系、战争、外交、科技、地方治理与长期稳定之间做取舍，建立能长期运转的国家机器。',
    descriptionEn: 'A grand strategy and national governance simulation about balancing treasury, food, population, law, factions, war, diplomacy, technology, local administration, and long-term stability.',
    tech: ['TypeScript', 'React 18', 'Vite', 'Zustand', 'Vitest'],
    prodUrl: 'https://lunora-gather.github.io/Imperium-Aeternum/',
    devUrl: 'http://localhost:5173',
    accentColor: '#d4af37',
    status: 'playable'
  },
  {
    id: 'LionCityWhispers',
    title: 'Lion City Whispers',
    chineseTitle: '狮城秘语',
    category: '叙事探索',
    categoryEn: 'Narrative',
    difficulty: 3,
    description: '沉浸式叙事解谜游戏。穿梭于新加坡河畔与神秘灵界之间，寻找并修复四大古老文物，最终在博物馆展厅中完成你的策展展览。',
    descriptionEn: 'An immersive narrative puzzle game. Travel between the Singapore River and the spiritual realm to restore ancient relics for your museum curation.',
    tech: ['Next.js Pages', 'React 19', 'Phaser 4'],
    prodUrl: 'https://lunora-gather.github.io/LionCityWhispers/',
    devUrl: 'http://localhost:3000',
    accentColor: '#06b6d4',
    status: 'coming-soon'
  },
  {
    id: 'echo-string-genesis-prototype',
    title: 'Echo-String: Genesis Prototype',
    chineseTitle: '语弦生态：断句庭院灰盒原型',
    category: '语义解谜',
    categoryEn: 'Semantic Puzzle',
    difficulty: 3,
    description: '《语弦生态：创世纪》的可玩网页原型。通过扫描对象、剥离词缀、注入槽位，配合温度、介质与力场触发蒸汽爆发、破裂窗口等组合反应，挑战残章守卫。',
    descriptionEn: 'A playable web prototype of Echo-String: Genesis. Scan objects, extract affixes, and inject them into semantic slots, combining thermal and field reactions to solve puzzles and defeat guards.',
    tech: ['HTML5', 'CSS3', 'JS ES6'],
    prodUrl: 'https://lunora-gather.github.io/echo-string-genesis-prototype/',
    devUrl: 'http://localhost:4174/',
    accentColor: '#29d3a0',
    status: 'playable'
  },
  {
    id: 'Overlogic',
    title: 'Overlogic',
    chineseTitle: 'Overlogic',
    category: '编程策略',
    categoryEn: 'Programming Strategy',
    difficulty: 4,
    description: '二维自走棋Roguelike策略游戏。通过编写“IF 条件 THEN 行动”规则库，为战斗机器人定制大脑，在分支路线和多变关卡中不断调试，优化规则序列。',
    descriptionEn: 'A 2D top-down auto-combat roguelike strategy game. Custom-program a combat brain for your robot with prioritized rules, run simulated battles, and refine the rule stack.',
    tech: ['HTML5', 'CSS3', 'ES Modules'],
    prodUrl: 'https://lunora-gather.github.io/Overlogic/',
    devUrl: 'http://localhost:3000/',
    accentColor: '#00d2ff',
    status: 'playable'
  }
];

export const CATEGORIES = ['全部', ...Array.from(new Set(GAMES_DATA.map(game => game.category)))];

export const DEFAULT_CUSTOM_PORTS = Object.fromEntries(
  GAMES_DATA.map(game => [game.id, game.devUrl])
) as Record<string, string>;

export const getGameDisplayTitle = (game: Game) => {
  if (!game.chineseTitle || game.chineseTitle === game.title) return game.title;
  return `${game.title}/${game.chineseTitle}`;
};
