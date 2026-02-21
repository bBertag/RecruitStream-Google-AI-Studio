
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import PipelineBoard from './components/PipelineBoard';
import PipelineList from './components/PipelineList';
import OutreachTable from './components/OutreachTable';
import CollegeDetail from './components/CollegeDetail';
import AthleteProfile from './components/AthleteProfile';
import SettingsView from './components/SettingsView';
import { INITIAL_COLLEGES, INITIAL_ATHLETE, ALL_DIVISIONS } from './constants';
import { College, RecruitingStage, Athlete } from './types';
import { Zap, Target, AlertCircle, Snowflake, Search as SearchIcon, X, Filter, ChevronDown } from 'lucide-react';

const Dashboard: React.FC<{
  colleges: College[];
  onCollegeClick: (c: College) => void;
  onUpdateStage: (id: string, s: RecruitingStage) => void;
  onUpdateInterest: (id: string, r: number) => void;
}> = ({ colleges, onCollegeClick, onUpdateStage, onUpdateInterest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('All Divisions');

  // Use the comprehensive list for the filter
  const divisions = useMemo(() => {
    return ['All Divisions', ...ALL_DIVISIONS];
  }, []);

  // Apply filtering logic
  const processedColleges = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    
    return colleges.filter(college => {
      const matchesSearch = 
        college.name.toLowerCase().includes(term) ||
        college.location.toLowerCase().includes(term) ||
        college.division.toLowerCase().includes(term) ||
        college.coaches.some(coach => coach.name.toLowerCase().includes(term));
      
      const matchesDivision = divisionFilter === 'All Divisions' || college.division === divisionFilter;
      
      return matchesSearch && matchesDivision;
    });
  }, [colleges, searchTerm, divisionFilter]);

  return (
    <div className="space-y-8">
      {/* Header Block matches Colleges page */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Recruiting Funnel</h1>
        <p className="text-gray-500 text-sm font-medium">Manage and track your athletic pipeline</p>
      </div>

      {/* Filter Row matches screenshot exactly */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
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
              <SearchIcon size={18} className="text-gray-500 group-focus-within:text-blue-500 transition-colors" />
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
        
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest px-2 whitespace-nowrap">
          <span>{processedColleges.length} Matching Programs</span>
        </div>
      </div>

      {processedColleges.length > 0 ? (
        <>
          <PipelineBoard 
            colleges={processedColleges} 
            onCollegeClick={onCollegeClick} 
            onUpdateStage={onUpdateStage}
          />
          
          <PipelineList 
            colleges={processedColleges}
            onCollegeClick={onCollegeClick}
            onUpdateStage={onUpdateStage}
            onUpdateInterest={onUpdateInterest}
          />
        </>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-600 mb-2">
            <SearchIcon size={32} />
          </div>
          <h3 className="text-xl font-bold text-white">No results found</h3>
          <p className="text-gray-500 max-w-xs mx-auto">We couldn't find any colleges matching your filters. Try adjusting your search or division selection.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setDivisionFilter('All Divisions');
            }}
            className="text-blue-500 font-bold uppercase tracking-widest text-xs hover:text-blue-400 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [colleges, setColleges] = useState<College[]>(INITIAL_COLLEGES);
  const [athlete, setAthlete] = useState<Athlete>(INITIAL_ATHLETE);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  const handleUpdateStage = (id: string, stage: RecruitingStage) => {
    setColleges(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, stage };
        if (selectedCollege?.id === id) setSelectedCollege(updated);
        return updated;
      }
      return c;
    }));
  };

  const handleUpdateInterest = (id: string, interest: number) => {
    setColleges(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, interest };
        if (selectedCollege?.id === id) setSelectedCollege(updated);
        return updated;
      }
      return c;
    }));
  };

  const handleAddCollege = (collegeData: Partial<College>) => {
    const newCollege: College = {
      id: Math.random().toString(36).substr(2, 9),
      name: collegeData.name || 'New College',
      division: collegeData.division || 'NCAA D1',
      location: collegeData.location || 'Unknown',
      stage: RecruitingStage.IDENTIFIED,
      interest: 3,
      interactions: [],
      coaches: [],
      ...collegeData
    };
    setColleges(prev => [newCollege, ...prev]);
  };

  const handleRemoveCollege = (id: string) => {
    setColleges(prev => prev.filter(c => c.id !== id));
  };

  const handleAddInteraction = (collegeId: string, interactionData: any) => {
    const newInteraction = {
      ...interactionData,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    setColleges(prev => prev.map(c => {
      if (c.id === collegeId) {
        const updated = { ...c, interactions: [newInteraction, ...c.interactions] };
        if (selectedCollege?.id === collegeId) setSelectedCollege(updated);
        return updated;
      }
      return c;
    }));
  };

  const handleUpdateAthlete = (updatedAthlete: Athlete) => {
    setAthlete(updatedAthlete);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} athlete={athlete}>
      {activeTab === 'dashboard' && (
        <Dashboard 
          colleges={colleges} 
          onCollegeClick={setSelectedCollege}
          onUpdateStage={handleUpdateStage}
          onUpdateInterest={handleUpdateInterest}
        />
      )}

      {activeTab === 'colleges' && (
        <div className="space-y-8">
           <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Colleges</h1>
            <p className="text-gray-500 text-sm font-medium">Explore and track your target colleges</p>
          </div>
          <OutreachTable 
            colleges={colleges} 
            onCollegeClick={setSelectedCollege}
            onUpdateStage={handleUpdateStage}
            onUpdateInterest={handleUpdateInterest}
            onAddCollege={handleAddCollege}
            onRemoveCollege={handleRemoveCollege}
          />
        </div>
      )}

      {activeTab === 'profile' && (
        <AthleteProfile athlete={athlete} onUpdate={handleUpdateAthlete} />
      )}

      {activeTab === 'settings' && (
        <SettingsView athlete={athlete} onUpdate={handleUpdateAthlete} />
      )}

      {selectedCollege && (
        <CollegeDetail 
          college={selectedCollege} 
          athlete={athlete}
          onClose={() => setSelectedCollege(null)}
          onAddInteraction={handleAddInteraction}
          onUpdateInterest={handleUpdateInterest}
        />
      )}
    </Layout>
  );
};

export default App;
