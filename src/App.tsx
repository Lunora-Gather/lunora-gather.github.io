import { useEffect, useMemo, useState, type ReactNode } from 'react';
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
  Play,
  Heart,
  History
} from 'lucide-react';
import {
  CATEGORIES,
  DEFAULT_CUSTOM_PORTS,
  GAMES_DATA,
  getGameDisplayTitle,
  type Game
} from './data/games';
import { CATEGORIES_MAP, LOCALIZED_TEXTS, type Lang, type LocalizedText } from './data/i18n';

type Theme = 'dark' | 'light';
type AchievementId = 'novice' | 'hardcore' | 'first-step' | 'collector';
type LibraryView = 'all' | 'favorites' | 'recent';

interface ZymLogoProps {
  size?: number;
  color?: string;
  className?: string;
}

const ACHIEVEMENT_IDS: AchievementId[] = ['novice', 'hardcore', 'first-step', 'collector'];

const STORAGE_KEYS = {
  theme: 'lunora_theme',
  lang: 'lunora_lang',
  entryShown: 'lunora_entry_shown',
  playedCount: 'lunora_played_count',
  achievements: 'lunora_achievements',
  customPorts: 'lunora_custom_ports',
  openInNewTab: 'lunora_open_in_new_tab',
  favorites: 'lunora_favorites',
  recentGames: 'lunora_recent_games'
} as const;

const getStoredStringArray = (key: string): string[] => {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '[]');
    const validGameIds = new Set(GAMES_DATA.map(game => game.id));
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string' && validGameIds.has(item))
      : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  return savedTheme === 'light' ? 'light' : 'dark';
};

const getInitialLang = (): Lang => {
  const savedLang = localStorage.getItem(STORAGE_KEYS.lang);
  if (savedLang === 'en' || savedLang === 'zh-TW') return savedLang;
  return 'zh-CN';
};

const getInitialEntryState = (): boolean => {
  return sessionStorage.getItem(STORAGE_KEYS.entryShown) !== 'true';
};

const getInitialCustomPorts = (): Record<string, string> => {
  const savedPorts = localStorage.getItem(STORAGE_KEYS.customPorts);
  if (!savedPorts) return DEFAULT_CUSTOM_PORTS;

  try {
    return {
      ...DEFAULT_CUSTOM_PORTS,
      ...(JSON.parse(savedPorts) as Record<string, string>)
    };
  } catch (error) {
    console.error(error);
    return DEFAULT_CUSTOM_PORTS;
  }
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

const ZymLogo = ({ size = 20, color = 'var(--text-primary)', className = '' }: ZymLogoProps) => (
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
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
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
  const [customPorts, setCustomPorts] = useState<Record<string, string>>(getInitialCustomPorts);
  const [openInNewTab, setOpenInNewTab] = useState<boolean>(() => localStorage.getItem(STORAGE_KEYS.openInNewTab) === 'true');
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
  const [libraryView, setLibraryView] = useState<LibraryView>('all');
  const [favoriteGameIds, setFavoriteGameIds] = useState<string[]>(() => getStoredStringArray(STORAGE_KEYS.favorites));
  const [recentGameIds, setRecentGameIds] = useState<string[]>(() => getStoredStringArray(STORAGE_KEYS.recentGames));

  const text = LOCALIZED_TEXTS[lang];

  const lobbyTitle = libraryView === 'favorites'
    ? text.favorites
    : libraryView === 'recent'
      ? text.recentGames
      : activeCategory === '全部'
        ? text.allWorks
        : CATEGORIES_MAP[activeCategory]?.[lang] ?? activeCategory;

  const hasActiveQueryFilter = searchTerm.trim() !== '' || activeCategory !== '全部';
  const emptyMessage = hasActiveQueryFilter
    ? text.noGamesFound
    : libraryView === 'favorites'
      ? text.noFavorites
      : libraryView === 'recent'
        ? text.noRecentGames
        : text.noGamesFound;

  const filteredGames = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const games = GAMES_DATA.filter(game => {
      const matchesCategory = activeCategory === '全部' || game.category === activeCategory;
      const searchableText = [
        game.title,
        game.chineseTitle ?? '',
        game.chineseTitleTraditional ?? '',
        game.category,
        game.categoryEn,
        game.description,
        game.descriptionTraditional,
        game.descriptionEn,
        ...game.tech
      ].join(' ').toLowerCase();
      const matchesSearch = normalizedSearch === '' || searchableText.includes(normalizedSearch);

      const matchesView = libraryView === 'all'
        || (libraryView === 'favorites' && favoriteGameIds.includes(game.id))
        || (libraryView === 'recent' && recentGameIds.includes(game.id));

      return matchesCategory && matchesSearch && matchesView;
    });

    if (libraryView === 'recent') {
      return games.sort((a, b) => recentGameIds.indexOf(a.id) - recentGameIds.indexOf(b.id));
    }

    return games;
  }, [activeCategory, favoriteGameIds, libraryView, recentGameIds, searchTerm]);

  const triggerAchievement = (id: AchievementId) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(id)) return prev;

      const next = [...prev, id];
      localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(next));

      const achievement = getAchievementCopy(id, text);
      setShowNotification(`🏆 ${text.achTitle}：【${achievement.title}】 - ${achievement.desc}`);
      window.setTimeout(() => setShowNotification(null), 5000);

      return next;
    });
  };

  const getGameUrl = (game: Game) => {
    if (isDevMode) return customPorts[game.id] || game.devUrl;
    return game.prodUrl;
  };

  const handlePlayGame = (game: Game) => {
    setRecentGameIds(prev => {
      const next = [game.id, ...prev.filter(id => id !== game.id)].slice(0, 6);
      localStorage.setItem(STORAGE_KEYS.recentGames, JSON.stringify(next));
      return next;
    });

    setPlayedCount(prev => {
      const next = prev + 1;
      localStorage.setItem(STORAGE_KEYS.playedCount, next.toString());

      if (next === 1) triggerAchievement('first-step');
      if (next === 5) triggerAchievement('collector');

      return next;
    });

    const gameUrl = getGameUrl(game);
    if (openInNewTab) {
      window.open(gameUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    window.location.href = gameUrl;
  };

  const toggleFavorite = (gameId: string) => {
    setFavoriteGameIds(prev => {
      const next = prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId];
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(next));
      return next;
    });
  };

  const resetLibraryFilters = () => {
    setSearchTerm('');
    setActiveCategory('全部');
    setLibraryView('all');
  };

  const handleEnter = () => {
    setEntryFadeOut(true);
    window.setTimeout(() => {
      setShowEntry(false);
      sessionStorage.setItem(STORAGE_KEYS.entryShown, 'true');
    }, 500);
  };

  const handlePortChange = (gameId: string, value: string) => {
    setCustomPorts(prev => ({ ...prev, [gameId]: value }));
  };

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.lang, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.customPorts, JSON.stringify(customPorts));
  }, [customPorts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.openInNewTab, String(openInNewTab));
  }, [openInNewTab]);

  useEffect(() => {
    const savedCount = localStorage.getItem(STORAGE_KEYS.playedCount);
    if (savedCount) setPlayedCount(Number.parseInt(savedCount, 10));

    const savedAchievements = localStorage.getItem(STORAGE_KEYS.achievements);
    if (!savedAchievements) return;

    try {
      const parsed = JSON.parse(savedAchievements) as string[];
      const migrated = parsed
        .map(migrateAchievementId)
        .filter((item): item is AchievementId => item !== null);

      setUnlockedAchievements(migrated);
      localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(migrated));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlayTime(prev => {
        const next = prev + 1;
        if (next === 60) triggerAchievement('novice');
        if (next === 300) triggerAchievement('hardcore');
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
          <div className="entry-card">
            <div className="logo-container">
              <div className="logo-glow-ring" />
              <ZymLogo size={44} className="animate-float" />
            </div>
            <span className="entry-kicker">Unified Indie Portal</span>
            <h1 className="entry-title">LUNORA</h1>
            <div className="entry-divider" />
            <p className="entry-tagline">{text.heroTagline}</p>
            <button className="entry-btn" onClick={handleEnter}>{text.enterBtn}</button>
          </div>
        </div>
      )}

      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {showNotification && (
        <div className="glass" style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, borderRadius: 4, padding: '10px 20px', color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Trophy size={15} color="var(--text-primary)" />
          <span>{showNotification}</span>
        </div>
      )}

      <header className="glass app-header" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ZymLogo size={20} color="var(--text-primary)" />
          <h1 style={{ fontSize: 18, letterSpacing: '0.12em', color: 'var(--text-primary)' }}>LUNORA</h1>
        </div>

        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div className="glass header-stats" style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-secondary)', padding: '5px 12px', borderRadius: 20, alignItems: 'center', background: 'var(--bg-dark)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title={text.statsDuration}>
              <Clock size={12} style={{ color: 'var(--primary)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>{formatTime(playTime)}</span>
            </div>
            <div style={{ width: 1, height: 10, background: 'var(--border-color)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title={text.statsLaunches}>
              <Flame size={12} style={{ color: 'var(--primary)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>{playedCount}</span>
            </div>
            <div style={{ width: 1, height: 10, background: 'var(--border-color)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title={text.statsAchievements}>
              <Trophy size={12} style={{ color: 'var(--primary)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>{unlockedAchievements.length}/{ACHIEVEMENT_IDS.length}</span>
            </div>
          </div>

          <button onClick={toggleTheme} className="btn btn-secondary" style={{ padding: '6px 10px', borderRadius: 4, display: 'flex' }} aria-label={theme === 'dark' ? text.switchToLight : text.switchToDark} title={theme === 'dark' ? text.switchToLight : text.switchToDark}>
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button onClick={() => setShowSettings(prev => !prev)} className="btn btn-secondary" style={{ padding: '6px 10px', borderRadius: 4 }} title={text.settingsTitle}>
            <Settings size={15} />
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <section className="glass hero-card" style={{ padding: '36px 44px', borderRadius: 'var(--radius-lg)', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, position: 'relative', overflow: 'hidden' }}>
          <div>
            <h2 className="hero-title" style={{ fontSize: 28, letterSpacing: '0.15em', margin: 0 }}>LUNORA</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8, letterSpacing: '0.04em', lineHeight: 1.7, maxWidth: 600 }}>{text.heroTagline}</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="#games-lobby" className="btn btn-primary">{text.browseLobbyBtn}</a>
            <a href="https://github.com/Lunora-Gather" target="_blank" rel="noreferrer" className="btn btn-secondary">GitHub</a>
          </div>
        </section>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
          <div className="filter-groups">
            <div className="filter-group" role="group" aria-label={text.libraryViewLabel}>
              <button onClick={() => setLibraryView('all')} aria-pressed={libraryView === 'all'} className={`category-pill ${libraryView === 'all' ? 'active' : ''}`}>
                {text.libraryAll}
              </button>
              <button onClick={() => setLibraryView('favorites')} aria-pressed={libraryView === 'favorites'} className={`category-pill category-pill-icon ${libraryView === 'favorites' ? 'active' : ''}`}>
                <Heart size={12} fill={libraryView === 'favorites' ? 'currentColor' : 'none'} />
                {text.favorites} <span className="pill-count">{favoriteGameIds.length}</span>
              </button>
              <button onClick={() => setLibraryView('recent')} aria-pressed={libraryView === 'recent'} className={`category-pill category-pill-icon ${libraryView === 'recent' ? 'active' : ''}`}>
                <History size={12} />
                {text.recentGames} <span className="pill-count">{recentGameIds.length}</span>
              </button>
            </div>
            <span className="filter-divider" aria-hidden="true" />
            <div className="filter-group" role="group" aria-label={text.categoryLabel}>
              {CATEGORIES.map(category => (
                <button key={category} onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`category-pill ${activeCategory === category ? 'active' : ''}`}>
                  {CATEGORIES_MAP[category]?.[lang] ?? category}
                </button>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder={text.searchPlaceholder} className="search-input" />
            {searchTerm ? (
              <button onClick={() => setSearchTerm('')} aria-label={text.clearSearch} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}>
                <X size={14} />
              </button>
            ) : <span className="search-shortcut">/</span>}
          </div>
        </div>

        <section id="games-lobby">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 16, color: 'var(--text-primary)', fontWeight: 600, letterSpacing: '0.02em' }}>
                {lobbyTitle}
              </h2>
              {isDevMode && <span className="dev-badge">DEV</span>}
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{text.filteredCount(filteredGames.length, GAMES_DATA.length)}</span>
          </div>

          {filteredGames.length === 0 ? (
            <div className="glass" style={{ padding: '64px 24px', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: 14 }}>{emptyMessage}</p>
              <button onClick={resetLibraryFilters} className="btn btn-secondary" style={{ marginTop: 16, fontSize: 12.5, padding: '6px 12px', borderRadius: 4 }}>{text.resetFilters}</button>
            </div>
          ) : (
            <div className="masonry-grid">
              {filteredGames.map(game => (
                <div key={game.id} className="glass game-card masonry-item" style={{ borderRadius: 'var(--radius-md)', padding: 20, display: 'block' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ background: `${game.accentColor}0a`, color: game.accentColor, fontSize: 10.5, fontWeight: 600, padding: '3px 8px', borderRadius: 3, border: `1px solid ${game.accentColor}15`, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                          {CATEGORIES_MAP[game.category]?.[lang] ?? (lang === 'en' ? game.categoryEn : game.category)}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2.5 }} title={`${text.difficulty}: ${game.difficulty} / 5`}>
                          {Array.from({ length: 5 }).map((_, i) => <span key={`${game.id}-${i}`} style={{ color: i < game.difficulty ? game.accentColor : 'var(--border-color)', opacity: i < game.difficulty ? 0.8 : 0.25, fontSize: 13 }}>•</span>)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {game.status === 'coming-soon' && <span style={{ background: 'var(--bg-dark)', color: 'var(--text-muted)', fontSize: 10.5, fontWeight: 600, padding: '3px 8px', borderRadius: 3, border: '1px solid var(--border-color)' }}>{text.inDevelopment}</span>}
                        <button
                          type="button"
                          className={`favorite-btn ${favoriteGameIds.includes(game.id) ? 'is-favorite' : ''}`}
                          onClick={() => toggleFavorite(game.id)}
                          aria-pressed={favoriteGameIds.includes(game.id)}
                          aria-label={favoriteGameIds.includes(game.id) ? text.removeFavorite : text.addFavorite}
                          title={favoriteGameIds.includes(game.id) ? text.removeFavorite : text.addFavorite}
                        >
                          <Heart size={14} fill={favoriteGameIds.includes(game.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    <h3 style={{ fontSize: 17, color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.3, letterSpacing: '0.02em', marginBottom: 12 }}>{getGameDisplayTitle(game, lang)}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
                      {lang === 'en' ? game.descriptionEn : lang === 'zh-TW' ? game.descriptionTraditional : game.description}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16, borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
                      {game.tech.map(tech => <span key={tech} style={{ fontSize: 10, color: 'var(--text-secondary)', background: 'var(--bg-dark)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-color)', fontWeight: 500 }}>{tech}</span>)}
                    </div>

                    {game.status === 'playable' ? (
                      <button onClick={() => handlePlayGame(game)} style={{ width: '100%', borderRadius: 4, background: `${game.accentColor}12`, color: game.accentColor, border: 'none', padding: '10px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <Play size={12} fill="currentColor" />
                        {text.playNow}
                      </button>
                    ) : (
                      <button disabled style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', cursor: 'not-allowed', borderRadius: 4, padding: '10px 16px', fontSize: 13.5, fontWeight: 500 }}>{text.comingSoon}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {showSettings && (
        <aside className="glass" role="dialog" aria-modal="false" aria-label={text.settingsTitle} style={{ position: 'fixed', top: 0, right: 0, width: 320, height: '100vh', zIndex: 500, boxShadow: 'var(--settings-shadow)', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: 16, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}><Settings size={16} /> {text.settingsTitle}</h3>
              <button onClick={() => setShowSettings(false)} aria-label={text.closeSettings} title={text.closeSettings} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
            </div>

            <SettingBlock label={text.langSelect}>
              <button onClick={() => setLang('zh-CN')} className="btn btn-secondary" style={{ padding: '4px 9px', fontSize: 11.5, background: lang === 'zh-CN' ? 'var(--primary)' : undefined, color: lang === 'zh-CN' ? '#fff' : undefined }}>简中</button>
              <button onClick={() => setLang('zh-TW')} className="btn btn-secondary" style={{ padding: '4px 9px', fontSize: 11.5, background: lang === 'zh-TW' ? 'var(--primary)' : undefined, color: lang === 'zh-TW' ? '#fff' : undefined }}>繁中</button>
              <button onClick={() => setLang('en')} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 11.5, background: lang === 'en' ? 'var(--primary)' : undefined, color: lang === 'en' ? '#fff' : undefined }}>EN</button>
            </SettingBlock>

            <SettingBlock label={text.devMode}>
              <input type="checkbox" aria-label={text.devMode} checked={isDevMode} onChange={event => setIsDevMode(event.target.checked)} />
            </SettingBlock>

            <SettingBlock label={text.openInNewTab}>
              <input type="checkbox" aria-label={text.openInNewTab} checked={openInNewTab} onChange={event => setOpenInNewTab(event.target.checked)} />
            </SettingBlock>

            {isDevMode && (
              <div style={{ flex: 1, overflowY: 'auto', maxHeight: '42vh', paddingRight: 4 }}>
                <h4 style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>{text.portConfig}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {GAMES_DATA.filter(game => game.status === 'playable').map(game => (
                    <div key={game.id} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <label style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{getGameDisplayTitle(game, lang)}</label>
                      <input type="text" value={customPorts[game.id] ?? game.devUrl} onChange={event => handlePortChange(game.id, event.target.value)} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 4, color: 'var(--text-primary)', padding: '4px 8px', fontSize: 12, outline: 'none' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}><Info size={12} /><span>Org: Lunora-Gather</span></div>
          </div>
        </aside>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}

function SettingBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 4, padding: '10px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{label}</span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
