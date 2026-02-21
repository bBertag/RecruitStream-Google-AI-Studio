
import React, { useState } from 'react';
import { College, Athlete, InteractionType } from '../types';
import { MapPin, Globe, Users, History, Plus, X, Sparkles, Send, Calendar, MessageCircle, MoreHorizontal, Mail } from 'lucide-react';
import { generateOutreachDraft } from '../services/gemini';

interface CollegeDetailProps {
  college: College;
  athlete: Athlete;
  onClose: () => void;
  onAddInteraction: (collegeId: string, interaction: any) => void;
  onUpdateInterest: (collegeId: string, rating: number) => void;
}

const CollegeDetail: React.FC<CollegeDetailProps> = ({ college, athlete, onClose, onAddInteraction, onUpdateInterest }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  
  // Form State
  const [newType, setNewType] = useState<InteractionType>('Email');
  const [newCoach, setNewCoach] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleAiDraft = async () => {
    setIsGenerating(true);
    const draft = await generateOutreachDraft(athlete, college);
    setAiDraft(draft);
    setIsGenerating(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddInteraction(college.id, {
      type: newType,
      coachName: newCoach,
      notes: newNotes,
      date: new Date().toISOString().split('T')[0]
    });
    setShowInteractionForm(false);
    setNewCoach('');
    setNewNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative bg-[#0f0f0f] w-full max-w-4xl h-[85vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-start justify-between bg-gradient-to-r from-blue-900/10 to-transparent">
          <div className="flex gap-6">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-4xl font-black border border-white/10 shadow-inner">
              {college.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">{college.name}</h1>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <MapPin size={14} className="text-blue-500" /> {college.location}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <Globe size={14} className="text-blue-500" /> {college.division}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
                  {college.stage}
                </span>
                <div className="flex gap-1 px-1.5 py-1 bg-white/5 border border-white/10 rounded-full">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => onUpdateInterest(college.id, rating)}
                      className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold transition-all ${
                        college.interest >= rating 
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-[0_0_10px_rgba(37,99,235,0.2)]' 
                        : 'bg-white/5 text-gray-600 border border-transparent hover:border-white/10'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 p-8 border-r border-white/5 space-y-10">
            {/* Outreach Suggestions */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                  <Sparkles size={14} /> AI Outreach Strategist
                </h3>
                <button 
                  onClick={handleAiDraft}
                  disabled={isGenerating}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 rounded-lg text-[10px] font-black text-white uppercase tracking-wider transition-all shadow-lg shadow-blue-900/20"
                >
                  {isGenerating ? 'Generating...' : 'Draft Initial Email'}
                </button>
              </div>
              {aiDraft ? (
                <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-blue-900/20 text-sm text-gray-300 relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="whitespace-pre-wrap leading-relaxed italic opacity-80">{aiDraft}</div>
                  <button className="absolute bottom-4 right-4 p-2 bg-blue-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                    <Send size={14} />
                  </button>
                </div>
              ) : (
                <div className="bg-white/5 border border-dashed border-white/10 p-10 rounded-2xl text-center">
                  <p className="text-xs text-gray-500">Generate a custom outreach message based on your athlete profile and this college's needs.</p>
                </div>
              )}
            </section>

            {/* Interaction History */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <History size={14} /> Interaction Timeline
                </h3>
                <button 
                  onClick={() => setShowInteractionForm(true)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>

              {showInteractionForm && (
                <form onSubmit={handleAddSubmit} className="mb-6 bg-white/5 p-4 rounded-2xl border border-white/10 animate-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[10px] uppercase font-black text-gray-500 mb-1">Type</label>
                      <select 
                        value={newType} 
                        onChange={e => setNewType(e.target.value as InteractionType)}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                      >
                        <option value="Email">Email</option>
                        <option value="Text">Text</option>
                        <option value="Call">Call</option>
                        <option value="Visit">Visit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-black text-gray-500 mb-1">Coach</label>
                      <input 
                        required
                        placeholder="Name of contact..."
                        value={newCoach}
                        onChange={e => setNewCoach(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-[10px] uppercase font-black text-gray-500 mb-1">Notes</label>
                    <textarea 
                      required
                      placeholder="Summary of the conversation..."
                      rows={3}
                      value={newNotes}
                      onChange={e => setNewNotes(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowInteractionForm(false)} className="px-4 py-2 text-[10px] font-bold uppercase text-gray-500 hover:text-white">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 rounded-xl text-[10px] font-black uppercase text-white shadow-lg shadow-blue-900/20">Log Entry</button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {college.interactions.map((interaction) => (
                  <div key={interaction.id} className="relative pl-8 pb-4 border-l border-white/5 last:border-0">
                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-600/10 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                    <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase text-gray-500">{interaction.date} • {interaction.type}</span>
                        <div className="flex gap-1">
                          <button className="p-1 hover:bg-white/5 rounded text-gray-600 hover:text-white"><MoreHorizontal size={14}/></button>
                        </div>
                      </div>
                      <p className="text-xs text-white font-bold mb-1">Interaction with {interaction.coachName}</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{interaction.notes}</p>
                    </div>
                  </div>
                ))}
                {college.interactions.length === 0 && (
                  <div className="py-10 text-center text-gray-700">
                    <MessageCircle size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-[10px] uppercase font-black tracking-tighter">No interaction history</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="p-8 bg-black/20 space-y-8">
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-4">
                <Users size={14} /> Coaching Staff
              </h3>
              <div className="space-y-3">
                {college.coaches.map((coach, idx) => (
                  <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{coach.name}</p>
                      <p className="text-[10px] text-gray-500">{coach.title}</p>
                    </div>
                    <div className="flex gap-1">
                      {/* Added missing Mail icon from lucide-react */}
                      <button className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                        <Mail size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                {college.coaches.length === 0 && (
                  <p className="text-[10px] text-gray-600 italic">No coaches assigned</p>
                )}
                <button className="w-full py-2 bg-white/5 border border-dashed border-white/10 rounded-xl text-[10px] font-bold text-gray-500 hover:text-white transition-all">
                  + Add Coach
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                Campus Events
              </h3>
              <div className="p-4 bg-orange-950/10 border border-orange-900/20 rounded-2xl flex items-start gap-3">
                <Calendar size={16} className="text-orange-400 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-orange-200">Upcoming Camp</p>
                  <p className="text-[10px] text-orange-400/70">Junior Day Elite Camp</p>
                  <p className="text-[10px] text-orange-200/50 mt-1 font-mono">JUNE 15-17, 2026</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetail;
