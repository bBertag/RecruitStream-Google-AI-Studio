
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { College, RecruitingStage } from '../types';
import { Mail, MessageSquare, Phone, MapPin, ChevronRight, Filter, Search, ArrowUpDown, ArrowUp, ArrowDown, X, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { STAGE_CONFIG, ALL_DIVISIONS } from '../constants';
import { COLLEGE_DATABASE, DatabaseCollege } from '../collegeDatabase';
import { searchColleges } from '../services/collegeService';

interface OutreachTableProps {
  colleges: College[];
  onCollegeClick: (college: College) => void;
  onUpdateStage: (collegeId: string, newStage: RecruitingStage) => void;
  onUpdateInterest: (collegeId: string, rating: number) => void;
  onAddCollege: (college: Partial<College>) => void;
  onRemoveCollege: (collegeId: string) => void;
}

type SortKey = 'name' | 'lastInteraction' | 'stage' | 'interest' | 'count' | 'status';

const OutreachTable: React.FC<OutreachTableProps> = ({ 
  colleges, 
  onCollegeClick, 
  onUpdateStage, 
  onUpdateInterest,
  onAddCollege,
  onRemoveCollege
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('All Divisions');
  const [isAdding, setIsAdding] = useState(false);
  const [newCollege, setNewCollege] = useState({ name: '', division: ALL_DIVISIONS[0], location: '' });
  const [suggestions, setSuggestions] = useState<DatabaseCollege[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>({
    key: 'name',
    direction: 'asc'
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNameChange = async (name: string) => {
    setNewCollege({ ...newCollege, name });
    if (name.length > 1) {
      // Start with local suggestions
      const localFiltered = COLLEGE_DATABASE.filter(c => 
        c.name.toLowerCase().includes(name.toLowerCase())
      ).slice(0, 5);
      
      setSuggestions(localFiltered);
      setShowSuggestions(true);

      // Fetch from API for more results
      const apiResults = await searchColleges(name);
      
      // Combine and remove duplicates by name
      setSuggestions(prev => {
        const combined = [...prev, ...apiResults];
        const unique = combined.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
        return unique.slice(0, 8);
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (college: DatabaseCollege) => {
    setNewCollege({
      name: college.name,
      division: college.division,
      location: college.location
    });
    setShowSuggestions(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollege.name) return;
    onAddCollege(newCollege);
    setNewCollege({ name: '', division: ALL_DIVISIONS[0], location: '' });
    setIsAdding(false);
  };

  // Use the comprehensive list for the filter
  const divisions = useMemo(() => {
    return ['All Divisions', ...ALL_DIVISIONS];
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Email': return <Mail size={14} className="text-blue-400" />;
      case 'Text': return <MessageSquare size={14} className="text-green-400" />;
      case 'Call': return <Phone size={14} className="text-purple-400" />;
      case 'Visit': return <MapPin size={14} className="text-orange-400" />;
      default: return <MessageSquare size={14} />;
    }
  };

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedColleges = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    
    let filtered = colleges.filter(college => {
      const matchesSearch = 
        college.name.toLowerCase().includes(term) ||
        college.division.toLowerCase().includes(term) ||
        college.location.toLowerCase().includes(term);
      
      const matchesDivision = divisionFilter === 'All Divisions' || college.division === divisionFilter;
      
      return matchesSearch && matchesDivision;
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        let valA: any;
        let valB: any;

        switch (sortConfig.key) {
          case 'name':
            valA = a.name;
            valB = b.name;
            break;
          case 'stage':
            valA = a.stage;
            valB = b.stage;
            break;
          case 'interest':
            valA = a.interest;
            valB = b.interest;
            break;
          case 'count':
            valA = a.interactions.length;
            valB = b.interactions.length;
            break;
          case 'lastInteraction':
            valA = a.interactions[0]?.date || '';
            valB = b.interactions[0]?.date || '';
            break;
          case 'status':
            valA = a.interactions.length;
            valB = b.interactions.length;
            break;
          default:
            return 0;
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [colleges, searchTerm, divisionFilter, sortConfig]);

  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sortConfig?.key !== column) return <ArrowUpDown size={12} className="ml-1 opacity-30" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={12} className="ml-1 text-blue-500" /> : <ArrowDown size={12} className="ml-1 text-blue-500" />;
  };

  return (
    <div className="mt-8 space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Add College Button */}
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-900/20"
          >
            <Plus size={16} />
            Add College
          </button>

          {/* Division Filter */}
          <div className="relative group min-w-[180px]">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Filter size={14} className="text-gray-500" />
            </div>
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="w-full appearance-none bg-[#0a0a0a] border border-white/10 rounded-2xl py-3 pl-10 pr-10 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer shadow-xl"
            >
              {divisions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown size={14} className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500 self-center h-full" />
          </div>

          {/* Search Box */}
          <div className="relative group w-full md:w-96">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by college, division, or location..."
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-xl"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest px-2">
          <span>{processedColleges.length} Matching Programs</span>
        </div>
      </div>

      {/* Add College Form */}
      {isAdding && (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 mb-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2 relative" ref={suggestionRef}>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">College Name</label>
              <input
                type="text"
                required
                value={newCollege.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Stanford University"
                className="w-full bg-black border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-[#121212] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectSuggestion(s)}
                      className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                    >
                      <p className="font-bold">{s.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{s.division} • {s.location}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Division</label>
              <select
                value={newCollege.division}
                onChange={(e) => setNewCollege({ ...newCollege, division: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
              >
                {ALL_DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Location</label>
              <input
                type="text"
                value={newCollege.location}
                onChange={(e) => setNewCollege({ ...newCollege, location: e.target.value })}
                placeholder="e.g. Stanford, CA"
                className="w-full bg-black border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-white text-black font-bold uppercase tracking-widest text-[10px] py-3 rounded-xl hover:bg-gray-200 transition-all"
              >
                Save College
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 bg-white/5 text-gray-400 hover:text-white rounded-xl border border-white/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/5">
                <th className="px-6 py-4 font-extrabold w-10"></th>
                <th 
                  className="px-6 py-4 font-extrabold cursor-pointer hover:text-white transition-colors group/th"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    College <SortIndicator column="name" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 font-extrabold cursor-pointer hover:text-white transition-colors group/th"
                  onClick={() => handleSort('lastInteraction')}
                >
                  <div className="flex items-center">
                    Last Interaction <SortIndicator column="lastInteraction" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 font-extrabold cursor-pointer hover:text-white transition-colors group/th"
                  onClick={() => handleSort('stage')}
                >
                  <div className="flex items-center">
                    Stage <SortIndicator column="stage" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 font-extrabold cursor-pointer hover:text-white transition-colors group/th"
                  onClick={() => handleSort('interest')}
                >
                  <div className="flex items-center">
                    Interest <SortIndicator column="interest" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 font-extrabold cursor-pointer hover:text-white transition-colors group/th"
                  onClick={() => handleSort('count')}
                >
                  <div className="flex items-center">
                    Count <SortIndicator column="count" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 font-extrabold cursor-pointer hover:text-white transition-colors group/th"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status <SortIndicator column="status" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {processedColleges.map((college) => {
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
                          {Object.values(RecruitingStage).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronRight size={12} className="absolute right-3 top-2.5 rotate-90 text-gray-600 pointer-events-none" />
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
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-950/30 text-green-500 text-[10px] font-bold rounded-lg border border-green-900/50 uppercase tracking-widest whitespace-nowrap">
                          Recent
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to remove ${college.name}?`)) {
                              onRemoveCollege(college.id);
                            }
                          }}
                          className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Remove College"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {processedColleges.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-30">
                      <Search size={32} className="mb-3" />
                      <p className="text-sm font-bold uppercase tracking-widest text-white">No matching colleges</p>
                      <p className="text-xs text-gray-500 mt-1">Try adjusting your search or division filters</p>
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
};

export default OutreachTable;
