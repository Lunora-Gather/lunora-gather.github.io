import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Settings,
  X,
  Trophy,
  Clock,
  Flame,
  Info,
  Sun,
  Moon,
  Search,
  Play
} from 'lucide-react';

type Lang = 'zh' | 'en';
type Theme = 'dark' | 'light';
type AchievementId = 'novice' | 'hardcore' | 'first-step' | 'collector';

interface Game {
  id: string;
  title: string;
  chineseTitle: string;
  category: string;
  categoryEn: string;
  difficulty: number;
  description: string;
  descriptionEn: string;
  tech: string[];
  prodUrl: string;
  devUrl: string;
  accentColor: string;
  status: 'playable' | 'coming-soon';
}

const ACHIEVEMENT_IDS: AchievementId[] = ['novice', 'hardcore', 'first-step', 'collector'];

const CATEGORIES_MAP: Record<string, { zh: string; en: string }> = {
  '全部': { zh: '全部', en: 'All' },
  '平台动作': { zh: '平台动作', en: 'Platformer' },
  '叙事探索': { zh: '叙事探索', en: 'Narrative' },
  '沙盒建造': { zh: '沙盒建造', en: 'Sandbox' },
  '经典解谜': { zh: '经典解谜', en: 'Puzzle' },
  '经营模拟': { zh: '经营模拟', en: 'Simulation' }
};

const LOCALIZED_TEXTS = {
  zh: {
    enterBtn: '开启通道 • ENTER',
    statsDuration: '时长',
    statsLaunches: '启动',
    statsAchievements: '成就',
    settingsTitle: '设置',
    devMode: '开发者模式',
    portConfig: '本地端口配置',
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

type LocalizedText = typeof LOCALIZED_TEXTS.zh;

const GAMES_DATA: Game[] = [
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
    accentColor: '#00ffd5',
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
  }
];

const CATEGORIES = ['全部', ...Array.from(new Set(GAMES_DATA.map(game => game.category)))];

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('lunora_theme');
  return savedTheme === 'light' ? 'light' : 'dark';
};

const getInitialLang = (): Lang => {
  const savedLang = localStorage.getItem('lunora_lang');
  return savedLang === 'en' ? 'en' : 'zh';
};

const getInitialEntryState = (): boolean => {
  return sessionStorage.getItem('lunora_entry_shown') !== 'true';
};

const isAchievementId = (value: string): value is AchievementId => {
  return ACHIEVEMENT_IDS.includes(value as AchievementId);
};

const migrateAchievementId = (value: string): AchievementId | null => {
  const legacyMap: Record<string, AchievementId> = {
    '初出茅庐': 'novice',
    '硬核玩家': 'hardcore',
    '第一步': 'first-step',
    '游戏收藏家': 'collector'
  };

  if (isAchievementId(value)) return value;
  return legacyMap[value] ?? null;
};

const getAchievementCopy = (id: AchievementId, text: LocalizedText) => {
  switch (id) {
    case 'novice':
      return { title: text.achNovice, desc: text.achNoviceDesc };
    case 'hardcore':
      return { title: text.achHardcore, desc: text.achHardcoreDesc };
    case 'first-step':
      return { title: text.achFirstStep, desc: text.achFirstStepDesc };
    case 'collector':
      return { title: text.achCollector, desc: text.achCollectorDesc };
  }
};

const ZymLogo = ({
  size = 20,
  color = 'var(--text-primary)',
  className = '',
  style = {}
}: {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
  >
    <path d="M 3.5 20 Q 6 13 8.5 6 Q 10.25 11.5 12 11.5 Q 13.75 11.5 15.5 6 Q 18 13 20.5 20" />
    <circle cx="9" cy="14" r="1.2" fill={color} stroke="none" />
    <circle cx="15" cy="14" r="1.2" fill={color} stroke="none" />
    <line x1="10.5" y1="17" x2="13.5" y2="17" />
  </svg>
);

export default function App() {
  const [isDevMode, setIsDevMode] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [customPorts, setCustomPorts] = useState<Record<string, string>>({
    'summit-spark': 'http://localhost:3000/summit-spark/',
    'LionCityWhispers': 'http://localhost:3000',
    'YunShenChu': 'http://localhost:5173',
    'astra-voxel-ark': 'http://localhost:5173',
    'sudoku-game': 'http://localhost:3001',
    'minesweeper-game': 'http://localhost:3002',
    'crateveil': 'http://localhost:5175',
    'LastArchive': 'http://localhost:8080'
  });
  const [playTime, setPlayTime] = useState<number>(0);
  const [playedCount, setPlayedCount] = useState<number>(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<AchievementId[]>([]);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const [showEntry, setShowEntry] = useState<boolean>(getInitialEntryState);
  const [entryFadeOut, setEntryFadeOut] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [hoveredPlayButtonId, setHoveredPlayButtonId] = useState<string | null>(null);

  const text = LOCALIZED_TEXTS[lang];

  const filteredGames = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return GAMES_DATA.filter(game => {
      const matchesCategory = activeCategory === '全部' || game.category === activeCategory;
      const searchableText = [
        game.title,
        game.chineseTitle,
        game.category,
        game.categoryEn,
        game.description,
        game.descriptionEn,
        ...game.tech
      ].join(' ').toLowerCase();
      const matchesSearch = normalizedSearch === '' || searchableText.includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const triggerAchievement = (id: AchievementId) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(id)) return prev;

      const next = [...prev, id];
      localStorage.setItem('lunora_achievements', JSON.stringify(next));

      const achievement = getAchievementCopy(id, text);
      setShowNotification(`🏆 ${text.achTitle}：【${achievement.title}】 - ${achievement.desc}`);
      window.setTimeout(() => setShowNotification(null), 5000);

      return next;
    });
  };

  const getGameUrl = (game: Game) => {
    if (isDevMode) {
      return customPorts[game.id] || game.devUrl;
    }
    return game.prodUrl;
  };

  const handlePlayGame = (game: Game) => {
    setPlayedCount(prev => {
      const next = prev + 1;
      localStorage.setItem('lunora_played_count', next.toString());

      if (next === 1) {
        triggerAchievement('first-step');
      } else if (next === 5) {
        triggerAchievement('collector');
      }

      return next;
    });

    window.location.href = getGameUrl(game);
  };

  const handleEnter = () => {
    setEntryFadeOut(true);
    window.setTimeout(() => {
      setShowEntry(false);
      sessionStorage.setItem('lunora_entry_shown', 'true');
    }, 500);
  };

  const handlePortChange = (gameId: string, value: string) => {
    setCustomPorts(prev => ({
      ...prev,
      [gameId]: value
    }));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('lunora_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lunora_lang', lang);
  }, [lang]);

  useEffect(() => {
    const savedCount = localStorage.getItem('lunora_played_count');
    if (savedCount) setPlayedCount(Number.parseInt(savedCount, 10));

    const savedAchievements = localStorage.getItem('lunora_achievements');
    if (!savedAchievements) return;

    try {
      const parsed = JSON.parse(savedAchievements) as string[];
      const migrated = parsed
        .map(migrateAchievementId)
        .filter((item): item is AchievementId => item !== null);

      setUnlockedAchievements(migrated);
      localStorage.setItem('lunora_achievements', JSON.stringify(migrated));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlayTime(prev => {
        const next = prev + 1;

        if (next === 60) {
          triggerAchievement('novice');
        } else if (next === 300) {
          triggerAchievement('hardcore');
        }

        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [lang]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isSearchShortcut = (event.key === 'k' && (event.metaKey || event.ctrlKey)) || event.key === '/';
      if (!isSearchShortcut) return;

      const activeEl = document.activeElement;
      const isInputActive = activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement;
      if (isInputActive && event.key === '/') return;

      event.preventDefault();
      const searchInput = document.querySelector('.search-input');
      if (searchInput instanceof HTMLInputElement) {
        searchInput.focus();
        searchInput.select();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '80px' }}>
      {showEntry && (
        <div className={`portal-entry-screen ${entryFadeOut ? 'fade-out' : ''}`}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black, transparent 85%)',
              pointerEvents: 'none',
              zIndex: -1
            }}
          />

          <div className="entry-card">
            <div className="logo-container">
              <div className="logo-glow-ring" />
              <ZymLogo size={44} className="animate-float" style={{ position: 'relative', zIndex: 1 }} />
            </div>
            <span className="entry-kicker">Unified Indie Portal</span>
            <h1 className="entry-title">LUNORA</h1>
            <div className="entry-divider" />
            <p className="entry-tagline">在灵感与现实的交界处，开启独立灵魂的游历。</p>
            <button className="entry-btn" onClick={handleEnter}>
              {text.enterBtn}
            </button>
          </div>
        </div>
      )}

      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {showNotification && (
        <div
          className="glass"
          style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            borderRadius: '4px',
            padding: '10px 20px',
            color: 'var(--text-primary)',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Trophy size={15} color="var(--text-primary)" />
          <span>{showNotification}</span>
        </div>
      )}

      <header
        className="glass"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '14px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ZymLogo size={20} color="var(--text-primary)" />
          <h1 style={{ fontSize: '18px', letterSpacing: '0.12em', color: 'var(--text-primary)' }}>LUNORA</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            className="glass"
            style={{
              display: 'flex',
              gap: '12px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              padding: '5px 12px',
              borderRadius: '20px',
              alignItems: 'center',
              background: 'var(--bg-dark)',
              border: '1px solid var(--border-color)',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title={text.statsDuration}>
              <Clock size={12} style={{ color: 'var(--primary)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>{formatTime(playTime)}</span>
            </div>
            <div style={{ width: '1px', height: '10px', background: 'var(--border-color)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title={text.statsLaunches}>
              <Flame size={12} style={{ color: 'var(--primary)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>{playedCount}</span>
            </div>
            <div style={{ width: '1px', height: '10px', background: 'var(--border-color)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title={text.statsAchievements}>
              <Trophy size={12} style={{ color: 'var(--primary)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>
                {unlockedAchievements.length}/{ACHIEVEMENT_IDS.length}
              </span>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{ padding: '6px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={theme === 'dark' ? 'Light' : 'Dark'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            onClick={() => setShowSettings(prev => !prev)}
            className="btn btn-secondary"
            style={{ padding: '6px 10px', borderRadius: '4px' }}
            title={text.settingsTitle}
          >
            <Settings size={15} />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <section
          className="glass hero-card"
          style={{
            padding: '36px 44px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '300px',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.04))',
              pointerEvents: 'none',
              zIndex: 0
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 className="hero-title" style={{ fontSize: '28px', letterSpacing: '0.15em', margin: 0 }}>
              LUNORA
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px', letterSpacing: '0.04em', lineHeight: '1.7', maxWidth: '600px' }}>
              在灵感与现实的交界处，开启独立灵魂的游历。
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
            <a href="#games-lobby" className="btn btn-primary">
              {text.browseLobbyBtn}
            </a>
            <a href="https://github.com/Lunora-Gather" target="_blank" rel="noreferrer" className="btn btn-secondary">
              GitHub
            </a>
          </div>
        </section>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`category-pill ${activeCategory === category ? 'active' : ''}`}
              >
                {CATEGORIES_MAP[category]?.[lang] ?? category}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder={text.searchPlaceholder}
              className="search-input"
            />
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
              >
                <X size={14} />
              </button>
            ) : (
              <span className="search-shortcut">/</span>
            )}
          </div>
        </div>

        <section id="games-lobby">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: 600, letterSpacing: '0.02em' }}>
                {activeCategory === '全部' ? text.allWorks : CATEGORIES_MAP[activeCategory]?.[lang] ?? activeCategory}
              </h2>
              {isDevMode && <span className="dev-badge">DEV</span>}
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {text.filteredCount(filteredGames.length, GAMES_DATA.length)}
            </span>
          </div>

          {filteredGames.length === 0 ? (
            <div className="glass" style={{ padding: '64px 24px', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '14px' }}>{text.noGamesFound}</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('全部');
                }}
                className="btn btn-secondary"
                style={{ marginTop: '16px', fontSize: '12.5px', padding: '6px 12px', borderRadius: '4px' }}
              >
                {text.resetFilters}
              </button>
            </div>
          ) : (
            <div className="masonry-grid">
              {filteredGames.map(game => {
                const isCardHovered = hoveredCardId === game.id;
                const isButtonHovered = hoveredPlayButtonId === game.id;

                return (
                  <div
                    key={game.id}
                    className="glass game-card masonry-item"
                    onMouseEnter={() => setHoveredCardId(game.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    style={{
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                      display: 'block',
                      borderColor: isCardHovered ? `${game.accentColor}50` : 'var(--border-color)',
                      boxShadow: isCardHovered
                        ? `0 16px 36px ${game.accentColor}12, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                        : 'var(--card-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                      background: isCardHovered ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                      transform: isCardHovered ? 'translateY(-4px)' : 'none',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              background: `${game.accentColor}0a`,
                              color: game.accentColor,
                              fontSize: '10.5px',
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: '3px',
                              border: `1px solid ${game.accentColor}15`,
                              letterSpacing: '0.02em',
                              textTransform: 'uppercase',
                              transition: 'var(--transition-smooth)'
                            }}
                          >
                            {lang === 'zh' ? game.category : game.categoryEn}
                          </span>

                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2.5px' }} title={`${text.difficulty}: ${game.difficulty} / 5`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={`${game.id}-${i}`}
                                style={{
                                  color: i < game.difficulty ? game.accentColor : 'var(--border-color)',
                                  opacity: i < game.difficulty ? 0.8 : 0.25,
                                  fontSize: '13px',
                                  lineHeight: 1
                                }}
                              >
                                •
                              </span>
                            ))}
                          </span>
                        </div>

                        {game.status === 'coming-soon' && (
                          <span
                            style={{
                              background: 'var(--bg-dark)',
                              color: 'var(--text-muted)',
                              fontSize: '10.5px',
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: '3px',
                              border: '1px solid var(--border-color)'
                            }}
                          >
                            {text.inDevelopment}
                          </span>
                        )}
                      </div>

                      <h3
                        style={{
                          fontSize: '17px',
                          color: isCardHovered ? game.accentColor : 'var(--text-primary)',
                          fontWeight: 600,
                          lineHeight: 1.3,
                          transition: 'var(--transition-smooth)',
                          letterSpacing: '0.02em',
                          marginBottom: '12px'
                        }}
                      >
                        {game.title}/{game.chineseTitle}
                      </h3>

                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                        {lang === 'zh' ? game.description : game.descriptionEn}
                      </p>
                    </div>

                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                        {game.tech.map(tech => (
                          <span
                            key={tech}
                            style={{
                              fontSize: '10px',
                              color: 'var(--text-secondary)',
                              background: 'var(--bg-dark)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--border-color)',
                              fontWeight: 500
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {game.status === 'playable' ? (
                        <button
                          onClick={() => handlePlayGame(game)}
                          onMouseEnter={() => setHoveredPlayButtonId(game.id)}
                          onMouseLeave={() => setHoveredPlayButtonId(null)}
                          style={{
                            width: '100%',
                            borderRadius: '4px',
                            background: isButtonHovered ? game.accentColor : `${game.accentColor}12`,
                            color: isButtonHovered ? '#ffffff' : game.accentColor,
                            border: 'none',
                            padding: '10px 16px',
                            fontSize: '13.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transform: isButtonHovered ? 'translateY(-1px)' : 'none',
                            boxShadow: isButtonHovered ? `0 8px 24px ${game.accentColor}33` : 'none',
                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          <Play
                            size={12}
                            fill="currentColor"
                            style={{
                              transform: isButtonHovered ? 'translateX(2px)' : 'none',
                              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                              opacity: isButtonHovered ? 1 : 0.8
                            }}
                          />
                          {text.playNow}
                        </button>
                      ) : (
                        <button
                          disabled
                          style={{
                            width: '100%',
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-muted)',
                            cursor: 'not-allowed',
                            borderRadius: '4px',
                            padding: '10px 16px',
                            fontSize: '13.5px',
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          {text.comingSoon}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {showSettings && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '320px',
            height: '100vh',
            zIndex: 500,
            boxShadow: 'var(--settings-shadow)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="glass"
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <Settings size={16} /> {text.settingsTitle}
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{text.langSelect}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => setLang('zh')}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11.5px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        border: 'none',
                        background: lang === 'zh' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: lang === 'zh' ? '#ffffff' : 'var(--text-secondary)',
                        fontWeight: lang === 'zh' ? 600 : 400,
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      中文
                    </button>
                    <button
                      onClick={() => setLang('en')}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11.5px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        border: 'none',
                        background: lang === 'en' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: lang === 'en' ? '#ffffff' : 'var(--text-secondary)',
                        fontWeight: lang === 'en' ? 600 : 400,
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{text.devMode}</span>
                  <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px' }}>
                    <input
                      type="checkbox"
                      checked={isDevMode}
                      onChange={event => setIsDevMode(event.target.checked)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: isDevMode ? 'var(--primary)' : 'var(--accent)',
                        transition: '0.25s',
                        borderRadius: '20px'
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          height: '14px',
                          width: '14px',
                          left: '3px',
                          bottom: '3px',
                          backgroundColor: isDevMode ? 'var(--bg-darker)' : 'var(--text-muted)',
                          transition: '0.25s',
                          borderRadius: '50%',
                          transform: isDevMode ? 'translateX(16px)' : 'none'
                        }}
                      />
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {isDevMode && (
              <div style={{ flex: 1, overflowY: 'auto', maxHeight: '42vh', paddingRight: '4px' }}>
                <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  {text.portConfig}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {GAMES_DATA.filter(game => game.status === 'playable').map(game => (
                    <div key={game.id} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {game.title}/{game.chineseTitle}
                      </label>
                      <input
                        type="text"
                        value={customPorts[game.id] ?? game.devUrl}
                        onChange={event => handlePortChange(game.id, event.target.value)}
                        style={{
                          background: 'var(--bg-dark)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          color: 'var(--text-primary)',
                          padding: '4px 8px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <Info size={12} />
              <span>Org: Lunora-Gather</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
