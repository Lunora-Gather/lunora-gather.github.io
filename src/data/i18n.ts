export type Lang = 'zh' | 'en';

export const CATEGORIES_MAP: Record<string, { zh: string; en: string }> = {
  '全部': { zh: '全部', en: 'All' },
  '平台动作': { zh: '平台动作', en: 'Platformer' },
  '叙事探索': { zh: '叙事探索', en: 'Narrative' },
  '沙盒建造': { zh: '沙盒建造', en: 'Sandbox' },
  '经典解谜': { zh: '经典解谜', en: 'Puzzle' },
  '经营模拟': { zh: '经营模拟', en: 'Simulation' },
  '策略塔防': { zh: '策略塔防', en: 'Tower Defense' },
  '策略模拟': { zh: '策略模拟', en: 'Strategy Sim' },
  '语义解谜': { zh: '语义解谜', en: 'Semantic Puzzle' },
  '编程策略': { zh: '编程策略', en: 'Programming Strategy' }
};

export const LOCALIZED_TEXTS = {
  zh: {
    enterBtn: '开启通道 • ENTER',
    statsDuration: '时长',
    statsLaunches: '启动',
    statsAchievements: '成就',
    settingsTitle: '设置',
    devMode: '开发者模式',
    portConfig: '本地端口配置',
    openInNewTab: '新标签页打开游戏',
    langSelect: '界面语言',
    browseLobbyBtn: '浏览大厅',
    allWorks: '所有作品',
    filteredCount: (filtered: number, total: number) => `已筛选 ${filtered} / ${total} 个项目`,
    searchPlaceholder: '搜索游戏、分类、技术栈...',
    noGamesFound: '没有找到符合当前条件的游戏。',
    resetFilters: '重置筛选条件',
    difficulty: '难度',
    inDevelopment: '开发中',
    playNow: '一键启动',
    comingSoon: '敬请期待',
    achTitle: '获得成就',
    achNovice: '初出茅庐',
    achNoviceDesc: '在 Lunora 平台驻留满 1 分钟',
    achHardcore: '硬核玩家',
    achHardcoreDesc: '在 Lunora 平台驻留满 5 分钟',
    achFirstStep: '第一步',
    achFirstStepDesc: '点击试玩平台上的任意一款游戏',
    achCollector: '游戏收藏家',
    achCollectorDesc: '累计游玩不同的游戏 5 次'
  },
  en: {
    enterBtn: 'ENTER PORTAL',
    statsDuration: 'Duration',
    statsLaunches: 'Launches',
    statsAchievements: 'Trophies',
    settingsTitle: 'Settings',
    devMode: 'Developer Mode',
    portConfig: 'Local Port Config',
    openInNewTab: 'Open games in new tab',
    langSelect: 'Language',
    browseLobbyBtn: 'Browse Lobby',
    allWorks: 'All Games',
    filteredCount: (filtered: number, total: number) => `Filtered ${filtered} / ${total} items`,
    searchPlaceholder: 'Search games, categories, tech stack...',
    noGamesFound: 'No games found matching the current criteria.',
    resetFilters: 'Reset Filters',
    difficulty: 'Difficulty',
    inDevelopment: 'Coming Soon',
    playNow: 'Launch',
    comingSoon: 'Coming Soon',
    achTitle: 'Unlocked Achievement',
    achNovice: 'Novice',
    achNoviceDesc: 'Stayed on Lunora for 1 minute',
    achHardcore: 'Hardcore Gamer',
    achHardcoreDesc: 'Stayed on Lunora for 5 minutes',
    achFirstStep: 'First Step',
    achFirstStepDesc: 'Play any game on the platform',
    achCollector: 'Game Collector',
    achCollectorDesc: 'Play games 5 times'
  }
};

export type LocalizedText = typeof LOCALIZED_TEXTS.zh;
