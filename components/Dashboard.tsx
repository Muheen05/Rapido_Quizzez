
import React from 'react';
import { UserStats } from '../types';
import { 
  TrendingUp, 
  CheckCircle2, 
  BookOpen, 
  Activity, 
  Play, 
  Trophy,
  Medal,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface DashboardProps {
  stats: UserStats;
  onStart: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onStart }) => {
  const data = stats.weeklyHistory;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Row 1: Hero + Rank */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* World-Class Hero Section (Span 2) */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl shadow-slate-200/50 group transition-all hover:shadow-slate-300/50 flex flex-col justify-center h-full">
          {/* Abstract Background Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 translate-x-1/3 -translate-y-1/3 group-hover:opacity-30 transition-opacity duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 -translate-x-1/3 translate-y-1/3 group-hover:opacity-30 transition-opacity duration-1000"></div>
          
          <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-5 max-w-xl">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-yellow-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                System Online
              </div>
              
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.1]">
                Ready to elevate your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-400 bg-300% animate-shine">Service Mastery?</span>
              </h2>
              
              <p className="text-slate-400 text-base font-medium leading-relaxed">
                Your training environment is prepped. We've synthesized <span className="text-white font-bold">{stats.scenariosCompleted}</span> scenarios to test your Rapido SOP compliance.
              </p>
            </div>

            {/* Premium Action Card */}
            <button 
              onClick={onStart}
              className="relative overflow-hidden bg-white text-slate-900 rounded-2xl p-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-black/20 group/btn w-full md:w-auto min-w-[280px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-white to-yellow-50 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white border border-slate-100 rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-yellow-400 shadow-lg group-hover/btn:rotate-6 transition-transform duration-300">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Active Module</span>
                    <span className="block text-lg font-bold text-slate-900">Start Sim</span>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 group-hover/btn:border-yellow-400 group-hover/btn:text-yellow-500 transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Current Standing (Span 1) */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden h-full flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                  <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Standing</p>
                      <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">Lvl {stats.level}</h3>
                      <p className="text-indigo-600 font-bold text-sm mt-1">Customer Support</p>
                  </div>
                  <div className="h-14 w-14 bg-white border-2 border-yellow-100 rounded-2xl flex items-center justify-center text-yellow-400 shadow-sm">
                      <Trophy size={28} fill="currentColor" />
                  </div>
              </div>
              
              <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Progress to Lvl {stats.level + 1}</span>
                      <span>{stats.xp % 2000} / 2000 XP</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${(stats.xp % 2000) / 20}%` }}
                      ></div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 font-medium leading-relaxed">
                      <span className="font-bold text-slate-700">Next Milestone:</span> Solve P0 safety escalations correctly to earn the "Safety Specialist" badge.
                  </div>
              </div>
            </div>
        </div>
      </div>

      {/* Row 2: Charts & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xl">Performance Trend</h3>
                    <p className="text-slate-400 text-sm font-medium">Quality score over last 7 days</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-100">
                      <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span> Live Data
                  </div>
              </div>
              <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                          <defs>
                              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#FACC15" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                              dy={10}
                          />
                          <Tooltip 
                              cursor={{stroke: '#e2e8f0', strokeWidth: 1}}
                              contentStyle={{
                                  backgroundColor: '#1e293b', 
                                  border: 'none', 
                                  borderRadius: '8px',
                                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                  color: '#fff',
                                  fontWeight: 'bold',
                                  fontSize: '12px',
                                  fontFamily: 'Inter, sans-serif'
                              }}
                              itemStyle={{ color: '#fff' }}
                          />
                          <Area 
                              type="monotone" 
                              dataKey="score" 
                              stroke="#EAB308" 
                              strokeWidth={3} 
                              fillOpacity={1} 
                              fill="url(#colorScore)" 
                              activeDot={{r: 6, strokeWidth: 0, fill: '#EAB308'}}
                          />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Achievements */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                      <Medal className="text-yellow-500" /> Recent Badges
                  </h3>
                  <button className="text-xs font-bold text-slate-400 hover:text-slate-600">View All</button>
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                  {stats.badges.length > 0 ? stats.badges.map((badge, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-white transition-all rounded-xl border border-slate-100 hover:shadow-md group cursor-default">
                          <div className="h-10 w-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">
                              🏆
                          </div>
                          <div>
                              <p className="font-bold text-sm text-slate-800">{badge}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unlocked just now</p>
                          </div>
                      </div>
                  )) : (
                      <div className="text-center py-10 text-slate-400 text-sm font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200 h-full flex items-center justify-center flex-col gap-2">
                          <Trophy size={24} className="text-slate-300 mb-1"/>
                          Complete scenarios to<br/>unlock badges
                      </div>
                  )}
              </div>
          </div>
      </div>

      {/* Row 3: Stats Grid (Professional & Clean) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Current Streak</p>
                      <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.streak}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <TrendingUp size={18} />
                  </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-slate-800 w-1/4 rounded-full"></div>
              </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">SOP Accuracy</p>
                      <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{(stats.accuracy * 100).toFixed(0)}%</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <CheckCircle2 size={18} />
                  </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-emerald-500 rounded-full" style={{width: `${stats.accuracy * 100}%`}}></div>
              </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tickets Closed</p>
                      <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats.scenariosCompleted}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <BookOpen size={18} />
                  </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs font-medium text-emerald-600">
                  <span>+12 this week</span>
              </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg. Resolution</p>
                      <h3 className="text-3xl font-extrabold text-slate-900 mt-1">1.2m</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <Activity size={18} />
                  </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-400">
                  <span>Top 5% of agents</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
