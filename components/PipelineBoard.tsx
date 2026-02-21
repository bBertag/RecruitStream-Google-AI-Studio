import React, { useState } from 'react';
import { RecruitingStage, College } from '../types';
import { STAGE_CONFIG } from '../constants';
import { ChevronDown, ArrowUpDown, SortAsc, Star, Zap } from 'lucide-react';

interface PipelineBoardProps {
  colleges: College[];
  onCollegeClick: (college: College) => void;
  onUpdateStage: (collegeId: string, newStage: RecruitingStage) => void;
}

type SortOption = 'name' | 'interest' | 'activity';

interface ColumnSortState {
  [key: string]: SortOption;
}

const PipelineBoard: React.FC<PipelineBoardProps> = ({ colleges, onCollegeClick, onUpdateStage }) => {
  // Initialize each column with 'name' sort by default
  const [columnSorts, setColumnSorts] = useState<ColumnSortState>(
    Object.values(RecruitingStage).reduce((acc, stage) => ({ ...acc, [stage]: 'name' }), {})
  );

  const stages = Object.values(RecruitingStage);

  const toggleSort = (stage: RecruitingStage) => {
    setColumnSorts(prev => {
      const current = prev[stage];
      let next: SortOption = 'name';
      if (current === 'name') next = 'interest';
      else if (current === 'interest') next = 'activity';
      else next = 'name';
      return { ...prev, [stage]: next };
    });
  };

  const getSortIcon = (option: SortOption) => {
    switch (option) {
      case 'name': return <SortAsc size={12} />;
      case 'interest': return <Star size={12} />;
      case 'activity': return <Zap size={12} />;
    }
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'name': return 'A-Z';
      case 'interest': return 'Rating';
      case 'activity': return 'Active';
    }
  };

  const getCollegesInStage = (stage: RecruitingStage) => {
    const filtered = colleges.filter(c => c.stage === stage);
    const sortBy = columnSorts[stage];

    switch (sortBy) {
      case 'name':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case 'interest':
        return [...filtered].sort((a, b) => b.interest - a.interest);
      case 'activity':
        return [...filtered].sort((a, b) => b.interactions.length - a.interactions.length);
      default:
        return filtered;
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black tracking-tight text-white uppercase italic px-1">Pipeline Board</h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-1">
          Click column icons to change sort
        </p>
      </div>

      <div className="overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-4 min-w-max items-start">
          {stages.map((stage) => {
            const stageColleges = getCollegesInStage(stage);
            const config = STAGE_CONFIG[stage];
            const currentSort = columnSorts[stage];
            
            return (
              <div key={stage} className="flex flex-col w-72 shrink-0 group">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`}></div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${config.color}`}>
                      {stage}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-gray-500 font-bold">
                      {stageColleges.length}
                    </span>
                    <button 
                      onClick={() => toggleSort(stage)}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-tighter text-gray-400 hover:text-white transition-all border border-white/5"
                      title={`Sorting by: ${getSortLabel(currentSort)}`}
                    >
                      {/* Fixed: Use getSortIcon instead of getIcon */}
                      {getSortIcon(currentSort)}
                      <span>{getSortLabel(currentSort)}</span>
                    </button>
                  </div>
                </div>
                
                {/* Fixed size container with internal scrolling - Adjusted to 450px */}
                <div className={`rounded-2xl border-2 ${config.border} ${config.bg} p-2 h-[450px] overflow-y-auto space-y-3 transition-all duration-300 group-hover:bg-opacity-20 scrollbar-hide`}>
                  {stageColleges.map((college) => (
                    <div 
                      key={college.id}
                      className="bg-[#121212] border border-white/5 rounded-xl p-3 shadow-xl hover:border-white/20 transition-all cursor-pointer group/card"
                      onClick={() => onCollegeClick(college)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-white truncate w-40">{college.name}</h4>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${config.color} bg-white/5 shrink-0`}>
                          {college.interest}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] text-gray-500">{college.division}</p>
                        {college.interactions.length > 0 && (
                          <div className="flex items-center gap-1 text-[9px] text-gray-600 font-bold uppercase">
                            <Zap size={10} className="text-blue-500" />
                            {college.interactions.length}
                          </div>
                        )}
                      </div>
                      
                      <div className="relative">
                        <select
                          value={college.stage}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            onUpdateStage(college.id, e.target.value as RecruitingStage);
                          }}
                          className="w-full appearance-none bg-[#1a1a1a] border border-white/5 text-[10px] rounded-lg px-2 py-1.5 text-gray-400 focus:outline-none focus:ring-1 focus:ring-white/20 cursor-pointer"
                        >
                          {stages.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-2 text-gray-600 pointer-events-none" />
                      </div>
                    </div>
                  ))}
                  
                  {stageColleges.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                      <p className="text-[10px] font-bold uppercase tracking-tighter text-white">Empty</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PipelineBoard;