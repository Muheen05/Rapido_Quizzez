
import React, { useState, useEffect, useCallback } from 'react';
import { generateScenario, getHint } from '../services/geminiService';
import { Scenario, UserProfile } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Loader2, 
  User, 
  MapPin,
  Clock,
  History,
  ShieldAlert,
  FileText,
  Search,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

interface ScenarioDojoProps {
  user: UserProfile;
  onComplete: (xpEarned: number, correct: boolean) => void;
}

const ScenarioDojo: React.FC<ScenarioDojoProps> = ({ user, onComplete }) => {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);

  const loadNewScenario = useCallback(async () => {
    setLoading(true);
    setScenario(null); // Clear previous scenario immediately
    setFeedback(null);
    setSelectedPrimary(null);
    setSelectedAction(null);
    setHint(null);
    try {
      const data = await generateScenario(user.level);
      setScenario(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.level]);

  useEffect(() => {
    loadNewScenario();
  }, [loadNewScenario]);

  const handleFetchHint = async () => {
    if (!scenario) return;
    setHintLoading(true);
    const hintText = await getHint(scenario.context);
    setHint(hintText);
    setHintLoading(false);
  };

  const handleSubmit = () => {
    if (!scenario || !selectedPrimary || !selectedAction) return;

    const isPrimaryCorrect = selectedPrimary === scenario.primaryDecision.correctAnswer;
    const isActionCorrect = selectedAction === scenario.correctAction;
    const isCorrect = isPrimaryCorrect && isActionCorrect;

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    let xp = 0;
    if (isCorrect) {
        xp = 100;
        if (!hint) xp += 50;
    }
  };

  const handleNext = () => {
     if (feedback) {
         onComplete(feedback === 'correct' ? (hint ? 100 : 150) : 0, feedback === 'correct');
         loadNewScenario();
     }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] glass-panel rounded-3xl animate-in fade-in duration-500">
        <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 rounded-full animate-pulse"></div>
            <Loader2 className="h-16 w-16 text-yellow-500 animate-spin mb-6 relative z-10" />
        </div>
        <h3 className="text-slate-800 font-bold text-2xl mb-2">Generating Mission...</h3>
        <p className="text-slate-500 font-medium bg-white/50 px-4 py-2 rounded-xl">Consulting Rapido SOPs for a real-world challenge.</p>
      </div>
    );
  }

  if (!scenario) return <div>Error loading environment.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px] animate-in slide-in-from-bottom-4 duration-500">
      
      {/* LEFT PANE: Customer Context (The "Ticket") */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-6 flex-1 flex flex-col relative overflow-hidden bg-white/80 transition-all hover:shadow-lg">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              
              <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center border border-white shadow-inner">
                      <User size={32} className="text-slate-700" />
                  </div>
                  <div>
                      <h2 className="font-bold text-slate-800 text-2xl">{scenario.customerName}</h2>
                      <div className="flex gap-2 mt-2">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide shadow-sm">
                              {scenario.rideType}
                          </span>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border uppercase tracking-wide shadow-sm ${
                              scenario.customerSentiment === 'Angry' ? 'bg-red-50 text-red-600 border-red-100' : 
                              scenario.customerSentiment === 'Happy' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                              {scenario.customerSentiment}
                          </span>
                      </div>
                  </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6 relative shadow-inner">
                  <MessageSquare size={24} className="absolute -top-3 -left-3 text-blue-500 bg-white rounded-full p-1 shadow-md border border-slate-50" />
                  <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                      "{scenario.context}"
                  </p>
              </div>

              <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                          <div className="bg-yellow-100 p-2.5 rounded-xl text-yellow-700"><User size={18} /></div>
                          <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Captain</p>
                              <p className="text-sm font-bold text-slate-800">{scenario.captainDetails.name}</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rating</p>
                          <p className="text-sm font-bold text-slate-800 flex items-center justify-end gap-1">
                              {scenario.captainDetails.rating} <span className="text-yellow-400 text-xs">★</span>
                          </p>
                      </div>
                  </div>
                  
                  <div className="p-4 border border-slate-100 rounded-2xl bg-orange-50/50">
                      <div className="flex items-center gap-2 mb-2">
                          <History size={16} className="text-orange-500" />
                          <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">History Log</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-snug">{scenario.captainDetails.history}</p>
                  </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                  {!hint ? (
                      <button 
                          onClick={handleFetchHint} 
                          disabled={hintLoading}
                          className="w-full py-3 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 border border-indigo-100 border-dashed"
                      >
                          {hintLoading ? <Loader2 size={16} className="animate-spin" /> : <HelpCircle size={16} />}
                          Unlock SOP Hint (-50 XP)
                      </button>
                  ) : (
                      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-xs text-yellow-900 font-medium shadow-sm animate-in fade-in slide-in-from-bottom-2">
                          <span className="font-bold flex items-center gap-2 mb-1"><div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div> SOP Insight:</span> {hint}
                      </div>
                  )}
              </div>
          </div>
      </div>

      {/* RIGHT PANE: Action Center */}
      <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-8 flex-1 bg-white relative">
              
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                  <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg shadow-slate-200">
                      <ShieldAlert size={24} />
                  </div>
                  <div>
                      <h3 className="font-bold text-xl text-slate-800">Mission Protocol</h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Select the correct procedure according to SOP</p>
                  </div>
              </div>

              {/* Step 1 */}
              <div className={`mb-8 transition-all duration-500 ${feedback ? 'opacity-40 grayscale blur-[1px]' : ''}`}>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200">1</span>
                      {scenario.primaryDecision.type === 'SEVERITY' ? 'Risk Assessment' : 'Policy Check'}
                  </label>
                  <h4 className="text-lg font-bold text-slate-800 mb-5 pl-7">{scenario.primaryDecision.question}</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-7">
                      {scenario.primaryDecision.options.map(opt => (
                          <button
                              key={opt}
                              onClick={() => setSelectedPrimary(opt)}
                              disabled={!!feedback}
                              className={`p-4 rounded-xl border-2 text-sm font-bold text-left transition-all duration-200 relative overflow-hidden ${
                                  selectedPrimary === opt 
                                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md ring-1 ring-indigo-200 translate-y-[-2px]' 
                                  : 'border-slate-100 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                              }`}
                          >
                              {opt}
                              {selectedPrimary === opt && <div className="absolute top-0 right-0 p-1 bg-indigo-500 rounded-bl-lg"><CheckCircle2 size={12} className="text-white" /></div>}
                          </button>
                      ))}
                  </div>
              </div>

              {/* Step 2 */}
              <div className={`mb-8 transition-all duration-500 ${!selectedPrimary ? 'opacity-30 pointer-events-none' : ''} ${feedback ? 'opacity-40 grayscale blur-[1px]' : ''}`}>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className={`h-5 w-5 rounded-full flex items-center justify-center border transition-colors duration-300 ${selectedPrimary ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>2</span>
                      Resolution Action
                  </label>
                  
                  <div className="space-y-3 pl-7">
                      {scenario.actionOptions.map(act => (
                          <button
                              key={act}
                              onClick={() => setSelectedAction(act)}
                              disabled={!!feedback}
                              className={`w-full p-4 rounded-xl border-2 text-sm font-bold text-left transition-all duration-200 flex justify-between items-center group ${
                                  selectedAction === act 
                                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md ring-1 ring-indigo-200 translate-x-2' 
                                  : 'border-slate-100 hover:border-slate-300 text-slate-600 hover:bg-slate-50 hover:pl-6'
                              }`}
                          >
                              {act}
                              <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${selectedAction === act ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 group-hover:border-slate-400'}`}>
                                  {selectedAction === act && <div className="h-1.5 w-1.5 bg-white rounded-full"></div>}
                              </div>
                          </button>
                      ))}
                  </div>
              </div>

              {/* Feedback Overlay */}
              {feedback && (
                  <div className={`absolute bottom-24 left-8 right-8 z-10 p-6 rounded-2xl border-2 shadow-2xl animate-in zoom-in-95 fade-in duration-300 ${feedback === 'correct' ? 'bg-white border-green-100 ring-4 ring-green-50' : 'bg-white border-red-100 ring-4 ring-red-50'}`}>
                      <div className="flex gap-5">
                          <div className={`p-4 rounded-full h-fit shadow-sm ${feedback === 'correct' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {feedback === 'correct' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                          </div>
                          <div className="flex-1">
                              <h4 className={`text-xl font-bold mb-2 ${feedback === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                                  {feedback === 'correct' ? 'Mission Accomplished!' : 'Protocol Breach Detected'}
                              </h4>
                              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                  {scenario.explanation}
                              </p>
                              {feedback === 'incorrect' && (
                                  <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3 items-start">
                                      <FileText size={18} className="text-red-400 mt-0.5" />
                                      <div>
                                          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">Correct Procedure</span>
                                          <span className="text-sm font-bold text-slate-800">{scenario.correctAction}</span>
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              )}

              {/* Footer Actions */}
              <div className="flex justify-end pt-6 border-t border-slate-100 mt-auto">
                  {!feedback ? (
                      <button 
                          onClick={handleSubmit}
                          disabled={!selectedPrimary || !selectedAction}
                          className="btn-primary text-slate-900 font-bold px-10 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all active:scale-95 flex items-center gap-2 text-lg shadow-lg shadow-yellow-200/50"
                      >
                          Submit Resolution <ArrowRight size={20} />
                      </button>
                  ) : (
                      <button 
                          onClick={handleNext}
                          className="bg-slate-900 text-white font-bold px-10 py-4 rounded-xl hover:bg-black transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-xl shadow-slate-200 text-lg relative z-20"
                      >
                          Next Mission <ArrowRight size={20} />
                      </button>
                  )}
              </div>

          </div>
      </div>

    </div>
  );
};

export default ScenarioDojo;
