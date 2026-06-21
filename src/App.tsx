import { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Settings, 
  RefreshCw, 
  Maximize2, 
  ExternalLink, 
  X, 
  Trophy, 
  Clock, 
  Sparkles, 
  Flame, 
  Info
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
  const [activeGame, setActiveGame] = useState<Game | null>(null);
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

  const handlePlayGame = (game: Game) => {
    setActiveGame(game);
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
  };

  const handleCloseTheater = () => {
    setActiveGame(null);
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
        <div style={{
          position: 'fixed',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(168, 85, 247, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(168, 85, 247, 0.4)',
          borderRadius: '12px',
          padding: '12px 24px',
          color: '#ffffff',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'float 2s ease-in-out infinite',
          backdropFilter: 'blur(8px)'
        }}>
          <Trophy size={20} color="#f59e0b" fill="#f59e0b" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Header Navbar */}
      <header className="glass" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '40px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            padding: '8px',
            borderRadius: '10px',
            boxShadow: '0 0 15px var(--primary-glow)'
          }}>
            <Gamepad2 size={24} color="#060608" />
          </div>
          <div>
            <h1 className="glow-text-purple" style={{ 
              fontSize: '24px', 
              letterSpacing: '0.15em', 
              color: '#fff',
              background: 'linear-gradient(90deg, #fff, var(--primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>LUNORA</h1>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>UNIFIED INDIE GAME PLATFORM</span>
          </div>
        </div>

        {/* Stats and Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="var(--secondary)" />
              <span>在线时长: {formatTime(playTime)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={14} color="#ec4899" />
              <span>启动次数: {playedCount}次</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={14} color="#f59e0b" />
              <span>成就: {unlockedAchievements.length}/4</span>
            </div>
          </div>

          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className="btn btn-secondary" 
            style={{ padding: '8px 12px', borderRadius: '8px' }}
            title="平台设置"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Intro Hero Section */}
        <section className="glass animate-float" style={{
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '50px',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(168, 85, 247, 0.15)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              color: 'var(--primary)',
              fontWeight: 600,
              marginBottom: '16px',
              border: '1px solid rgba(168, 85, 247, 0.3)'
            }}>
              <Sparkles size={12} />
              <span>新世代独立游戏收纳平台</span>
            </div>
            <h2 style={{ fontSize: '36px', marginBottom: '16px', color: '#fff', lineHeight: 1.2 }}>
              游历于灵界与凡尘，<br />
              在 <span className="glow-text-cyan" style={{ color: 'var(--secondary)' }}>Lunora</span> 开启独立游戏发现之旅
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px', fontSize: '15px' }}>
              Lunora 汇集了从 2D 精密平台跳跃、沉浸式博物馆叙事解谜、云端观测模拟，到 3D 体素沙盒等多种不同风格的游戏。所有游戏均可通过平台免下载一键畅玩。
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#games-lobby" className="btn btn-primary">
                浏览大厅 <Gamepad2 size={16} />
              </a>
              <a href="https://github.com/Lunora-Gather" target="_blank" rel="noreferrer" className="btn btn-secondary">
                GitHub 组织 <ExternalLink size={16} />
              </a>
            </div>
          </div>
          
          <div style={{
            position: 'absolute',
            right: '-50px',
            top: '-50px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none'
          }}></div>
        </section>

        {/* Games Lobby Grid */}
        <section id="games-lobby">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
            <div>
              <h2 style={{ fontSize: '28px', color: '#fff' }}>全部收录作品</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                {isDevMode ? '🔧 开发者模式已激活：将加载本地 Dev 服务地址' : '🌐 线上模式：加载 GitHub Pages 托管资源'}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="glass" style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                color: 'var(--text-secondary)'
              }}>
                共 {GAMES_DATA.length} 款项目
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '24px'
          }}>
            {GAMES_DATA.map(game => (
              <div 
                key={game.id} 
                className="glass" 
                style={{
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px',
                  transition: 'var(--transition-smooth)',
                  border: '1px solid var(--border-color)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = game.accentColor;
                  e.currentTarget.style.boxShadow = `0 0 20px ${game.accentColor}25`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.37)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Neon accent corner glow */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '4px',
                  height: '100%',
                  background: game.accentColor
                }}></div>

                <div>
                  {/* Category and Difficulty */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{
                      background: `${game.accentColor}15`,
                      color: game.accentColor,
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      border: `1px solid ${game.accentColor}30`,
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
                              fontSize: '12px', 
                              color: i < game.difficulty ? game.accentColor : 'var(--text-muted)',
                              opacity: i < game.difficulty ? 1 : 0.3
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{
                        background: 'rgba(245, 158, 11, 0.15)',
                        color: 'var(--warning)',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        border: '1px solid rgba(245, 158, 11, 0.3)'
                      }}>
                        开发中
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div style={{ marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '20px', color: '#fff', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      {game.chineseTitle}
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 400, fontFamily: 'var(--font-sans)' }}>
                        {game.title}
                      </span>
                    </h3>
                  </div>

                  {/* Description */}
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '13.5px',
                    lineHeight: 1.5,
                    marginBottom: '20px'
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
                    gap: '6px',
                    marginBottom: '20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '14px'
                  }}>
                    {game.tech.map(t => (
                      <span key={t} style={{
                        fontSize: '10px',
                        color: 'var(--text-muted)',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Play trigger button */}
                  {game.status === 'playable' ? (
                    <button 
                      onClick={() => handlePlayGame(game)}
                      className="btn" 
                      style={{
                        width: '100%',
                        background: `linear-gradient(135deg, ${game.accentColor}ee 0%, ${game.accentColor}aa 100%)`,
                        color: game.id === 'LionCityWhispers' ? '#0c0c10' : '#fff',
                        boxShadow: `0 4px 12px ${game.accentColor}25`
                      }}
                    >
                      一键启动 <Gamepad2 size={16} />
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="btn" 
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        color: 'var(--text-muted)',
                        cursor: 'not-allowed'
                      }}
                    >
                      敬请期待...
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
          width: '380px',
          height: '100vh',
          zIndex: 500,
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          animation: 'slideIn 0.3s ease-out'
        }} className="glass">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h3 style={{ color: '#fff', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={20} color="var(--primary)" /> 平台配置
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* General section */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>常规选项</h4>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '14px', color: '#fff', display: 'block' }}>开发者调试模式</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>连接本地开发端口，方便本地连调</span>
                  </div>
                  <label style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '46px',
                    height: '24px'
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
                      backgroundColor: isDevMode ? 'var(--primary)' : '#27273a',
                      transition: '0.3s',
                      borderRadius: '24px',
                      boxShadow: isDevMode ? '0 0 10px var(--primary-glow)' : 'none'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '""',
                        height: '18px',
                        width: '18px',
                        left: '3px',
                        bottom: '3px',
                        backgroundColor: '#fff',
                        transition: '0.3s',
                        borderRadius: '50%',
                        transform: isDevMode ? 'translateX(22px)' : 'none'
                      }}></span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Ports/URLs configuration */}
            {isDevMode && (
              <div style={{ flex: 1, overflowY: 'auto', maxHeight: '50vh', paddingRight: '4px' }}>
                <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>本地端口端口设置</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {GAMES_DATA.filter(g => g.status === 'playable').map(game => (
                    <div key={game.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{game.chineseTitle} ({game.id})</label>
                      <input 
                        type="text" 
                        value={customPorts[game.id]} 
                        onChange={(e) => handlePortChange(game.id, e.target.value)}
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          color: '#fff',
                          padding: '6px 10px',
                          fontSize: '13px',
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
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              color: 'var(--text-muted)'
            }}>
              <Info size={14} />
              <span>当前连接的 GitHub 组织: Lunora-Gather</span>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Theater Mode Iframe Player Overlay */}
      {activeGame && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1000,
          background: 'rgba(6, 6, 8, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Theater Header controls */}
          <div style={{
            background: 'var(--bg-dark)',
            borderBottom: '1px solid var(--border-color)',
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: `${activeGame.accentColor}20`,
                padding: '6px',
                borderRadius: '8px',
                border: `1px solid ${activeGame.accentColor}40`
              }}>
                <Gamepad2 size={16} color={activeGame.accentColor} />
              </div>
              <div>
                <h2 style={{ fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {activeGame.chineseTitle}
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>
                    {activeGame.title}
                  </span>
                </h2>
              </div>
            </div>

            {/* Controller row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isDevMode && (
                <span style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}>
                  DEV PORT: {getGameUrl(activeGame)}
                </span>
              )}
              
              <button 
                onClick={() => {
                  const iframe = document.getElementById('lunora-game-iframe') as HTMLIFrameElement;
                  if (iframe) iframe.src = iframe.src;
                }}
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px' }}
                title="重新加载游戏"
              >
                <RefreshCw size={14} /> 刷新
              </button>

              <button 
                onClick={() => {
                  const iframeContainer = document.getElementById('iframe-container');
                  if (iframeContainer) {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    } else {
                      iframeContainer.requestFullscreen();
                    }
                  }
                }}
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px' }}
                title="全屏模式"
              >
                <Maximize2 size={14} /> 全屏
              </button>

              <a 
                href={getGameUrl(activeGame)} 
                target="_blank" 
                rel="noreferrer"
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px' }}
                title="在新窗口打开"
              >
                <ExternalLink size={14} /> 新窗口
              </a>

              <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 4px' }}></div>

              <button 
                onClick={handleCloseTheater}
                className="btn btn-primary" 
                style={{ 
                  padding: '6px 12px', 
                  borderRadius: '6px', 
                  fontSize: '13px', 
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  boxShadow: 'none'
                }}
              >
                <X size={14} /> 退出大厅
              </button>
            </div>
          </div>

          {/* Iframe Viewport Container */}
          <div 
            id="iframe-container" 
            style={{ 
              flex: 1, 
              background: '#000', 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <iframe 
              id="lunora-game-iframe"
              src={getGameUrl(activeGame)}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: '#000'
              }}
              allow="fullscreen; autoplay; keyboard-map"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
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
