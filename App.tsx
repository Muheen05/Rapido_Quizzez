import React, { useState, useEffect } from 'react';
import { AppView, UserStats, UserProfile } from './types';
import Dashboard from './components/Dashboard';
import ScenarioDojo from './components/ScenarioDojo';
import Login from './components/Login';
import { 
  LogOut, 
  Bell, 
  Menu,
  Zap,
  Flame,
  Award,
  ChevronDown
} from 'lucide-react';

const App = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<AppView>('dashboard');
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    streak: 0,
    scenariosCompleted: 0,
    accuracy: 0.0,
    badges: [],
    weeklyHistory: []
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  useEffect(() => {
    if (currentUser && stats.scenariosCompleted > 0) {
      localStorage.setItem(`rapido_stats_${currentUser.email}`, JSON.stringify(stats));
    }
  }, [stats, currentUser]);

  const handleScenarioComplete = (xpEarned: number, correct: boolean) => {
    setStats(prev => {
        const newCompleted = prev.scenariosCompleted + 1;
        const newAccuracy = ((prev.accuracy * prev.scenariosCompleted) + (correct ? 1 : 0)) / newCompleted;
        
        let newBadges = [...prev.badges];
        if (newCompleted === 15 && !newBadges.includes("Consistent Solver")) newBadges.push("Consistent Solver");
        if (correct && xpEarned > 100 && !newBadges.includes("P0 Specialist")) newBadges.push("P0 Specialist");

        // FIX: Create a deep copy of the last entry to avoid "read only property" error
        const newHistory = [...prev.weeklyHistory];
        if (newHistory.length > 0) {
            newHistory[newHistory.length - 1] = {
                ...newHistory[newHistory.length - 1],
                score: Math.round(newAccuracy * 100)
            };
        }

        const nextLevelXP = 2000;
        const currentLevel = Math.floor((prev.xp + xpEarned) / nextLevelXP) + 1;

        return {
            ...prev,
            xp: prev.xp + xpEarned,
            level: currentLevel,
            scenariosCompleted: newCompleted,
            accuracy: newAccuracy,
            streak: correct ? prev.streak + 1 : 0, 
            badges: newBadges,
            weeklyHistory: newHistory
        };
    });
  };

  const generateConsistentStats = (user: UserProfile): UserStats => {
      let hash = 0;
      for (let i = 0; i < user.email.length; i++) {
          hash = user.email.charCodeAt(i) + ((hash << 5) - hash);
      }
      const seededRandom = () => {
          const x = Math.sin(hash++) * 10000;
          return x - Math.floor(x);
      };

      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const weeklyHistory = days.map(day => ({
          name: day,
          score: Math.floor(60 + (seededRandom() * 35))
      }));

      const baseAccuracy = 0.75 + (seededRandom() * 0.2);
      const lifetimeScenarios = user.tenureMonths * (20 + Math.floor(seededRandom() * 10));

      return {
          xp: user.tenureMonths * 150 + Math.floor(seededRandom() * 500),
          level: Math.max(1, Math.ceil(user.tenureMonths / 6)),
          streak: Math.floor(seededRandom() * 10),
          scenariosCompleted: lifetimeScenarios,
          accuracy: baseAccuracy,
          badges: user.level === 'Expert' ? ['Veteran Badge', 'SOP Master'] : user.level === 'Associate' ? ['Fast Learner'] : [],
          weeklyHistory
      };
  };

  const handleLogin = (user: UserProfile) => {
      setCurrentUser(user);
      const savedData = localStorage.getItem(`rapido_stats_${user.email}`);
      
      if (savedData) {
          try {
              const parsedStats = JSON.parse(savedData);
              setStats({
                  ...generateConsistentStats(user),
                  ...parsedStats
              });
          } catch (e) {
              setStats(generateConsistentStats(user));
          }
      } else {
          setStats(generateConsistentStats(user));
      }
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setShowProfileMenu(false);
      setView('dashboard');
  };

  if (!currentUser) {
      return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Ultra-Premium Glass Header */}
      <header className="sticky top-0 z-50 w-full px-6 py-4 transition-all duration-300">
          <div className="max-w-[1920px] mx-auto bg-white/70 backdrop-blur-2xl border border-white/40 shadow-xl shadow-slate-200/30 rounded-2xl px-6 py-3 flex items-center justify-between transition-all hover:bg-white/80 hover:shadow-slate-200/50">
              
              {/* Brand Section */}
              <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('dashboard')}>
                  <div className="h-12 w-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-yellow-200/80 group-hover:scale-105 transition-transform duration-300">
                      <Zap size={24} fill="currentColor" className="drop-shadow-sm" />
                  </div>
                  <div className="flex flex-col">
                      <h1 className="font-extrabold text-2xl tracking-tight text-slate-800 leading-none group-hover:text-black transition-colors">
                          Rapido <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">Sentinel</span>
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-500 transition-colors">Training Dojo Active</span>
                      </div>
                  </div>
              </div>

              {/* Central HUD (Stats) - Floating Glass Pills */}
              <div className="hidden md:flex items-center gap-4">
                  {/* XP Capsule */}
                  <div className="flex items-center gap-3 bg-white/50 border border-white/60 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm hover:shadow-md hover:bg-white transition-all cursor-default group">
                      <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                          <Award size={18} />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">XP Earned</span>
                          <span className="text-lg font-black text-slate-800 tabular-nums leading-none">{stats.xp.toLocaleString()}</span>
                      </div>
                  </div>

                  {/* Streak Capsule */}
                  <div className="flex items-center gap-3 bg-white/50 border border-white/60 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm hover:shadow-md hover:bg-white transition-all cursor-default group">
                      <div className={`p-2 rounded-xl transition-colors ${stats.streak > 0 ? 'bg-orange-50 text-orange-500 group-hover:bg-orange-100' : 'bg-slate-100 text-slate-400'}`}>
                          <Flame size={18} fill={stats.streak > 0 ? "currentColor" : "none"} />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Streak</span>
                          <span className="text-lg font-black text-slate-800 tabular-nums leading-none">{stats.streak}</span>
                      </div>
                  </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-4">
                  <div className="relative">
                      <button 
                          onClick={() => setShowProfileMenu(!showProfileMenu)}
                          className="flex items-center gap-3 p-1.5 pl-4 pr-2 rounded-full bg-white/50 border border-white/60 hover:bg-white hover:shadow-md hover:border-white transition-all duration-300 group"
                      >
                          <div className="text-right hidden sm:block">
                              <p className="text-xs font-bold text-slate-700 group-hover:text-black">{currentUser.email.split('@')[0]}</p>
                              <div className="flex justify-end mt-0.5">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                                    currentUser.level === 'Expert' ? 'bg-purple-100 text-purple-700' : 
                                    currentUser.level === 'Associate' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {currentUser.level}
                                </span>
                              </div>
                          </div>
                          <div className="h-10 w-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-slate-300 group-hover:scale-105 transition-transform">
                              {currentUser.email.charAt(0).toUpperCase()}
                          </div>
                          <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors mr-1" />
                      </button>

                      {showProfileMenu && (
                          <div className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                                  <p className="text-xs font-bold text-slate-400 uppercase">Signed in as</p>
                                  <p className="text-sm font-bold text-slate-800 truncate">{currentUser.email}</p>
                              </div>
                              <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 font-medium transition-colors">
                                  <LogOut size={16} /> Sign Out
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:px-12 max-w-[1920px] mx-auto w-full">
          {view === 'dashboard' ? (
              <Dashboard stats={stats} onStart={() => setView('dojo')} />
          ) : (
              <ScenarioDojo user={currentUser} onComplete={handleScenarioComplete} />
          )}
      </main>
    </div>
  );
};

export default App;