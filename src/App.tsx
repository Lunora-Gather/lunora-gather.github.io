import { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Settings, 
  X, 
  Trophy, 
  Clock, 
  Flame, 
  Info,
  Sun,
  Moon
} from 'lucide-react';

interface Game {
  id: string;
  title: string;
  chineseTitle: string;
  category: string;
  difficulty: number;
  description: string;
  tech: string[];
  prodUrl: string;
  devUrl: string;
  accentColor: string;
  status: 'playable' | 'coming-soon';
}

const GAMES_DATA: Game[] = [
  {
    id: 'summit-spark',
    title: 'Summit Spark',
    chineseTitle: '山巅微光',
    category: 'Precision Platformer',
    difficulty: 5,
    description: '一款注重动作手感的高精度平台跳跃游戏。控制冲刺生成华丽的光轨，带回微光并挑战各种险峻山峰。',
    tech: ['HTML5 Canvas', 'Vanilla JS', 'Physics'],
    prodUrl: 'https://lunora-gather.github.io/summit-spark/',
    devUrl: 'http://localhost:3000/summit-spark/', // summit-spark is static
    accentColor: '#ec4899', /* Pink */
    status: 'playable'
  },
  {
    id: 'LionCityWhispers',
    title: 'Lion City Whispers',
    chineseTitle: '狮城秘语',
    category: 'Narrative & Puzzle',
    difficulty: 3,
    description: '扮演博物馆馆长，穿梭于新加坡河畔与灵界。寻找修复古代文物残片，还原失传的历史记忆，完成展览。',
    tech: ['Next.js Pages', 'React 19', 'Phaser 4'],
    prodUrl: 'https://lunora-gather.github.io/LionCityWhispers/',
    devUrl: 'http://localhost:3000', // Default Next.js dev port
    accentColor: '#06b6d4', /* Cyan */
    status: 'playable'
  },
  {
    id: 'YunShenChu',
    title: 'The Deep Cloud',
    chineseTitle: '云深处',
    category: 'Simulation & Mystery',
    difficulty: 2,
    description: '云端城市舷窗观测模拟器。扫描异常信号频段，收集市民流，解读城市事件，推进核心主线任务。',
    tech: ['Vite', 'React 19', 'TypeScript'],
    prodUrl: 'https://lunora-gather.github.io/YunShenChu/',
    devUrl: 'http://localhost:5173', // Vite default port
    accentColor: '#8b5cf6', /* Violet */
    status: 'playable'
  },
  {
    id: 'astra-voxel-ark',
    title: 'Astra Voxel Ark',
    chineseTitle: '方块方舟',
    category: '3D Voxel Sandbox',
    difficulty: 3,
    description: '第一人称3D体素沙盒世界。基于 Three.js 开发，在无限延伸的方块宇宙中随心所欲地建造或拆除。',
    tech: ['Three.js', 'Vite', 'TypeScript'],
    prodUrl: 'https://lunora-gather.github.io/astra-voxel-ark/',
    devUrl: 'http://localhost:5173',
    accentColor: '#10b981', /* Emerald */
    status: 'playable'
  },
  {
    id: 'sudoku-game',
    title: 'Sudoku',
    chineseTitle: '高级数独',
    category: 'Classic Puzzle',
    difficulty: 2,
    description: '极简精美的数独解谜平台。支持多难度选择、自动高亮辅助、智能提示以及离线历史成绩记录。',
    tech: ['React 19', 'TypeScript', 'CSS Grid'],
    prodUrl: 'https://lunora-gather.github.io/sudoku-game/',
    devUrl: 'http://localhost:3001',
    accentColor: '#f59e0b', /* Amber */
    status: 'playable'
  },
  {
    id: 'minesweeper-game',
    title: 'Minesweeper',
    chineseTitle: '现代扫雷',
    category: 'Classic Arcade',
    difficulty: 2,
    description: '复古而优雅的现代版扫雷。支持一键快速排雷、自定义雷区大小，带来流畅利落的指尖体验。',
    tech: ['React 18', 'TypeScript', 'CSS Flexbox'],
    prodUrl: 'https://lunora-gather.github.io/minesweeper-game/',
    devUrl: 'http://localhost:3002',
    accentColor: '#ef4444', /* Red */
    status: 'playable'
  },
  {
    id: 'LastArchive',
    title: 'Last Archive',
    chineseTitle: '最后档案城',
    category: 'Survival RPG & Management',
    difficulty: 4,
    description: '建造和经营最后的末日小镇，抉择哪些人类的记忆值得留下。具备独特的 NPC 情感互动与 AI 故事叙事系统。',
    tech: ['.NET 8 Core', 'Unity 2D', 'AI Agent'],
    prodUrl: '',
    devUrl: '',
    accentColor: '#f97316', /* Orange */
    status: 'coming-soon'
  }
];

export default function App() {
  const [isDevMode, setIsDevMode] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [customPorts, setCustomPorts] = useState<Record<string, string>>({
    'summit-spark': 'http://localhost:3000/summit-spark/',
    'LionCityWhispers': 'http://localhost:3000',
    'YunShenChu': 'http://localhost:5173',
    'astra-voxel-ark': 'http://localhost:5174',
    'sudoku-game': 'http://localhost:3001',
    'minesweeper-game': 'http://localhost:3002',
  });
  
  const [playTime, setPlayTime] = useState<number>(0);
  const [playedCount, setPlayedCount] = useState<number>(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('lunora_theme');
    return (savedTheme as 'dark' | 'light') || 'dark';
  });


  // Apply theme class to document body
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  // Play Time Counter
  useEffect(() => {
    const timer = setInterval(() => {
      setPlayTime(prev => {
        const nextTime = prev + 1;
        if (nextTime === 60) {
          triggerAchievement('初出茅庐', '在 Lunora 平台驻留满 1 分钟');
        } else if (nextTime === 300) {
          triggerAchievement('硬核玩家', '在 Lunora 平台驻留满 5 分钟');
        }
        return nextTime;
      });
    }, 1000);
    
    // Load local history
    const savedCount = localStorage.getItem('lunora_played_count');
    if (savedCount) setPlayedCount(parseInt(savedCount));
    
    const savedAchieve = localStorage.getItem('lunora_achievements');
    if (savedAchieve) setUnlockedAchievements(JSON.parse(savedAchieve));

    return () => clearInterval(timer);
  }, []);

  const triggerAchievement = (title: string, desc: string) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(title)) return prev;
      const next = [...prev, title];
      localStorage.setItem('lunora_achievements', JSON.stringify(next));
      
      // Show notification
      setShowNotification(`🏆 获得成就：【${title}】 - ${desc}`);
      setTimeout(() => setShowNotification(null), 5000);
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('lunora_theme', next);
      return next;
    });
  };

  const handlePlayGame = (game: Game) => {
    setPlayedCount(prev => {
      const next = prev + 1;
      localStorage.setItem('lunora_played_count', next.toString());
      if (next === 1) {
        triggerAchievement('第一步', '点击试玩平台上的任意一款游戏');
      } else if (next === 5) {
        triggerAchievement('游戏收藏家', '累计游玩不同的游戏 5 次');
      }
      return next;
    });
    // Redirect directly to game URL
    window.location.href = getGameUrl(game);
  };

  const getGameUrl = (game: Game) => {
    if (isDevMode) {
      return customPorts[game.id] || game.devUrl;
    }
    return game.prodUrl;
  };

  const handlePortChange = (gameId: string, value: string) => {
    setCustomPorts(prev => ({
      ...prev,
      [gameId]: value
    }));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Background glow effects */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* Achievement Alert */}
      {showNotification && (
        <div className="glass" style={{
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
        }}>
          <Trophy size={15} color="var(--text-primary)" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Header Navbar */}
      <header className="glass" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '14px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gamepad2 size={20} color="var(--text-primary)" />
          <h1 style={{ 
            fontSize: '18px', 
            letterSpacing: '0.12em', 
            color: 'var(--text-primary)'
          }}>LUNORA</h1>
        </div>

        {/* Stats and Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '14px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="时长">
              <Clock size={13} color="var(--text-secondary)" />
              <span>{formatTime(playTime)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="启动">
              <Flame size={13} color="var(--text-secondary)" />
              <span>{playedCount}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="成就">
              <Trophy size={13} color="var(--text-secondary)" />
              <span>{unlockedAchievements.length}/4</span>
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
            onClick={() => setShowSettings(!showSettings)} 
            className="btn btn-secondary" 
            style={{ padding: '6px 10px', borderRadius: '4px' }}
            title="Settings"
          >
            <Settings size={15} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Intro Hero Section */}
        <section className="glass" style={{
          padding: '24px 32px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', color: 'var(--text-primary)', fontWeight: 600 }}>LUNORA</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginTop: '4px' }}>
              探索并即刻畅玩精选独立游戏大厅。
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a href="#games-lobby" className="btn btn-primary" style={{ padding: '6px 12px', borderRadius: '4px' }}>
              浏览大厅
            </a>
            <a href="https://github.com/Lunora-Gather" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '6px 12px', borderRadius: '4px' }}>
              GitHub
            </a>
          </div>
        </section>

        {/* Games Lobby Grid */}
        <section id="games-lobby">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: 600 }}>全部作品</h2>
              {isDevMode && <span className="dev-badge">DEV</span>}
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {GAMES_DATA.length} 个项目
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '24px'
          }}>
            {GAMES_DATA.map(game => (
              <div 
                key={game.id} 
                className="glass game-card" 
                style={{
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '250px'
                }}
              >
                <div>
                  {/* Category and Difficulty */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{
                      background: 'var(--bg-darker)',
                      color: 'var(--text-secondary)',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '3px',
                      border: '1px solid var(--border-color)',
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase'
                    }}>
                      {game.category}
                    </span>
                    
                    {game.status === 'playable' ? (
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span 
                            key={i} 
                            style={{ 
                              fontSize: '11px', 
                              color: i < game.difficulty ? 'var(--text-primary)' : 'var(--text-muted)',
                              opacity: i < game.difficulty ? 1 : 0.25
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{
                        background: 'var(--bg-darker)',
                        color: 'var(--text-muted)',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '3px',
                        border: '1px solid var(--border-color)'
                      }}>
                        开发中
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div style={{ marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'baseline', gap: '6px', fontWeight: 600 }}>
                      {game.chineseTitle}
                      <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 400, fontFamily: 'var(--font-sans)' }}>
                        {game.title}
                      </span>
                    </h3>
                  </div>

                  {/* Description */}
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    lineHeight: 1.4,
                    marginBottom: '16px'
                  }}>
                    {game.description}
                  </p>
                </div>

                {/* Bottom stats and action */}
                <div>
                  {/* Tech stack badges */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px',
                    marginBottom: '16px',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '12px'
                  }}>
                    {game.tech.map(t => (
                      <span key={t} style={{
                        fontSize: '10px',
                        color: 'var(--text-secondary)',
                        background: 'var(--bg-darker)',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        border: '1px solid var(--border-color)'
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Play trigger button */}
                  {game.status === 'playable' ? (
                    <button 
                      onClick={() => handlePlayGame(game)}
                      className="btn btn-primary" 
                      style={{ width: '100%', borderRadius: '4px' }}
                    >
                      一键启动
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="btn" 
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-muted)',
                        cursor: 'not-allowed',
                        borderRadius: '4px'
                      }}
                    >
                      敬请期待
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Developer / Platform Settings Drawer Overlay */}
      {showSettings && (
        <div style={{
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
        }} className="glass">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <Settings size={16} /> 设置
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* General section */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                background: 'var(--bg-dark)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '12px 14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>开发者模式</span>
                  <label style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '36px',
                    height: '20px'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={isDevMode} 
                      onChange={(e) => setIsDevMode(e.target.checked)}
                      style={{ opacity: 0, width: 0, height: 0 }} 
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: isDevMode ? 'var(--primary)' : 'var(--accent)',
                      transition: '0.25s',
                      borderRadius: '20px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '""',
                        height: '14px',
                        width: '14px',
                        left: '3px',
                        bottom: '3px',
                        backgroundColor: isDevMode ? 'var(--bg-darker)' : 'var(--text-muted)',
                        transition: '0.25s',
                        borderRadius: '50%',
                        transform: isDevMode ? 'translateX(16px)' : 'none'
                      }}></span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Ports/URLs configuration */}
            {isDevMode && (
              <div style={{ flex: 1, overflowY: 'auto', maxHeight: '50vh', paddingRight: '4px' }}>
                <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>本地端口配置</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {GAMES_DATA.filter(g => g.status === 'playable').map(game => (
                    <div key={game.id} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{game.chineseTitle}</label>
                      <input 
                        type="text" 
                        value={customPorts[game.id]} 
                        onChange={(e) => handlePortChange(game.id, e.target.value)}
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

          {/* Settings Footer */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: 'var(--text-muted)'
            }}>
              <Info size={12} />
              <span>Org: Lunora-Gather</span>
            </div>
          </div>
        </div>
      )}



      {/* Global CSS keyframe styles for React animations */}
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
