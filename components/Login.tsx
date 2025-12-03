import React, { useState } from 'react';
import { Loader2, ArrowRight, Zap, ShieldCheck, Trophy } from 'lucide-react';
import { authenticateUser } from '../services/sheetService';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email) {
      setError("Please enter your work email.");
      setLoading(false);
      return;
    }

    try {
      const user = await authenticateUser(email);
      if (user) {
        onLogin(user);
      } else {
        setError("User not found in Rapido Roster.");
      }
    } catch (err) {
      setError("Authentication Service Unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: "2s"}}></div>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-yellow-400 text-black mb-4 shadow-lg shadow-yellow-200 rotate-3">
                <Zap size={32} fill="currentColor" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Rapido <span className="text-yellow-500">Sentinel</span></h1>
            <p className="text-slate-500 font-medium">Gamified CX Mastery Platform</p>
        </div>

        <div className="glass-panel rounded-3xl p-8 backdrop-blur-xl">
           <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Agent Identity</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/50 border border-white/50 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all outline-none placeholder:text-slate-400 font-medium"
                    placeholder="name@rapido.bike"
                  />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2 font-medium">
                   <ShieldCheck size={16} />
                   {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary text-black font-bold text-lg py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : (
                    <>
                        Start Mission <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
              </button>
           </form>
           
           <div className="mt-8 flex justify-center gap-6 text-slate-400">
               <div className="flex items-center gap-1.5 text-xs font-medium">
                   <Trophy size={14} /> Leaderboards
               </div>
               <div className="flex items-center gap-1.5 text-xs font-medium">
                   <ShieldCheck size={14} /> SOP Verified
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;