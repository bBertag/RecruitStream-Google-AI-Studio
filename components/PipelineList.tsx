
import React from 'react';
import { College, RecruitingStage } from '../types';
import { STAGE_CONFIG } from '../constants';
import { ChevronRight, Star, ChevronDown, Inbox, Mail, MessageSquare, Phone, MapPin } from 'lucide-react';

interface PipelineListProps {
  colleges: College[];
  onCollegeClick: (college: College) => void;
  onUpdateStage: (collegeId: string, newStage: RecruitingStage) => void;
  onUpdateInterest: (collegeId: string, rating: number) => void;
}

const PipelineList: React.FC<PipelineListProps> = ({ colleges, onCollegeClick, onUpdateStage, onUpdateInterest }) => {
  const stages = Object.values(RecruitingStage);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Email': return <Mail size={14} className="text-blue-400" />;
      case 'Text': return <MessageSquare size={14} className="text-green-400" />;
      case 'Call': return <Phone size={14} className="text-purple-400" />;
      case 'Visit': return <MapPin size={14} className="text-orange-400" />;
      default: return <MessageSquare size={14} />;
    }
  };

  return (
    <div className="mt-12 space-y-12">
      <h2 className="text-2xl font-black tracking-tight text-white uppercase italic px-1">Pipeline List View</h2>
      
      <div className="space-y-10">
        {stages.map((stage) => {
          const stageColleges = colleges.filter((c) => c.stage === stage);
          const config = STAGE_CONFIG[stage];

          return (
            <div key={stage} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg ${config.bg} ${config.color} border ${config.border}`}>
                    {stage}
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {stageColleges.length} Matching
                  </span>
                </div>
              </div>
              
              <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    {stageColleges.length > 0 && (
                      <thead>
                        <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/5">
                          <th className="px-6 py-4 font-extrabold w-10"></th>
                          <th className="px-6 py-4 font-extrabold">College</th>
                          <th className="px-6 py-4 font-extrabold">Last Interaction</th>
                          <th className="px-6 py-4 font-extrabold">Stage</th>
                          <th className="px-6 py-4 font-extrabold">Interest</th>
                          <th className="px-6 py-4 font-extrabold">Count</th>
                          <th className="px-6 py-4 font-extrabold">Status</th>
                        </tr>
                      </thead>
                    )}
                    <tbody className="divide-y divide-white/5">
                      {stageColleges.map((college) => {
                        const lastInteraction = college.interactions[0];
                        
                        return (
                          <tr 
                            key={college.id} 
                            className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                            onClick={() => onCollegeClick(college)}
                          >
                            <td className="px-6 py-4 text-gray-600 group-hover:text-white transition-colors">
                              <ChevronRight size={16} />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center font-bold text-white shadow-lg border border-white/10 group-hover:border-white/30 transition-all">
                                  {college.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">{college.name}</p>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-tighter truncate">{college.division} • {college.location}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {lastInteraction ? (
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white/5 rounded-lg">
                                    {getIcon(lastInteraction.type)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs text-white font-medium truncate">{lastInteraction.type} • {lastInteraction.date}</p>
                                    <p className="text-[10px] text-gray-500 italic truncate">Coach {lastInteraction.coachName || 'None'}</p>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[10px] text-gray-700 font-bold italic uppercase">No outreach</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={college.stage}
                                  onChange={(e) => onUpdateStage(college.id, e.target.value as RecruitingStage)}
                                  className="bg-[#121212] border border-white/10 text-xs rounded-xl px-3 py-1.5 text-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none pr-8 min-w-[140px] cursor-pointer"
                                >
                                  {stages.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <ChevronDown size={12} className="absolute right-3 top-2.5 text-gray-600 pointer-events-none" />
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    onClick={() => onUpdateInterest(college.id, rating)}
                                    className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all ${
                                      college.interest >= rating 
                                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50' 
                                      : 'bg-white/5 text-gray-600 border border-transparent hover:border-white/10'
                                    }`}
                                  >
                                    {rating}
                                  </button>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-gray-300">{college.interactions.length}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-green-950/30 text-green-500 text-[10px] font-bold rounded-lg border border-green-900/50 uppercase tracking-widest whitespace-nowrap">
                                Active
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {stageColleges.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center justify-center opacity-20">
                              <Inbox size={24} className="mb-2" />
                              <p className="text-[10px] font-black uppercase tracking-widest">No colleges in this stage</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineList;
