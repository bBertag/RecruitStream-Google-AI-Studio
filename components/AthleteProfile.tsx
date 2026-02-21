
import React, { useState } from 'react';
import { Athlete } from '../types';
import { Shield, Medal, MapPin, GraduationCap, Video, Share2, Download, Instagram, Twitter, Edit3, Save, X, ExternalLink, Globe, Camera } from 'lucide-react';

interface AthleteProfileProps {
  athlete: Athlete;
  onUpdate: (updatedAthlete: Athlete) => void;
}

const AthleteProfile: React.FC<AthleteProfileProps> = ({ athlete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAthlete, setEditedAthlete] = useState<Athlete>(athlete);

  // Sync local state with props when athlete changes externally
  React.useEffect(() => {
    setEditedAthlete(athlete);
  }, [athlete]);

  const handleSave = () => {
    onUpdate(editedAthlete);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAthlete(athlete);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedAthlete(prev => ({ ...prev, [name]: value }));
  };

  const handleStatChange = (key: string, value: string) => {
    setEditedAthlete(prev => ({
      ...prev,
      stats: { ...prev.stats, [key]: value }
    }));
  };

  const handleSocialChange = (key: 'twitter' | 'instagram' | 'hudl', value: string) => {
    setEditedAthlete(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [key]: value
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedAthlete(prev => ({
          ...prev,
          profileImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative h-80 rounded-[40px] overflow-hidden group shadow-2xl">
        <img 
          src="https://picsum.photos/seed/sports/1200/400" 
          className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" 
          alt="Sports Background" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col md:flex-row items-end gap-8">
          <div className="relative">
            <div className="w-40 h-40 rounded-[32px] overflow-hidden border-4 border-[#050505] shadow-2xl relative group/avatar">
              <img src={isEditing ? (editedAthlete.profileImage || athlete.profileImage || "https://picsum.photos/seed/athlete1/400/400") : (athlete.profileImage || "https://picsum.photos/seed/athlete1/400/400")} className="w-full h-full object-cover" alt="Avatar" />
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white mb-1" />
                  <span className="text-[10px] font-bold text-white uppercase">Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl border-4 border-[#050505]">
              <Shield size={20} className="text-white" />
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              {isEditing ? (
                <input
                  name="name"
                  value={editedAthlete.name}
                  onChange={handleChange}
                  className="text-5xl font-black text-white italic uppercase tracking-tighter bg-white/5 border border-white/10 rounded-xl px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              ) : (
                <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">{athlete.name}</h1>
              )}
              <div className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded-full text-xs font-black uppercase tracking-widest">
                4-Star Recruit
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-blue-500" />
                {isEditing ? (
                  <input
                    name="hometown"
                    value={editedAthlete.hometown}
                    onChange={handleChange}
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  />
                ) : athlete.hometown}
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap size={16} className="text-blue-500" />
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      name="highschool"
                      value={editedAthlete.highschool}
                      onChange={handleChange}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    />
                    <span className="text-gray-600">Class of</span>
                    <input
                      name="class"
                      value={editedAthlete.class}
                      onChange={handleChange}
                      className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    />
                  </div>
                ) : (
                  <>{athlete.highschool} (Class of {athlete.class})</>
                )}
              </span>
              <span className="flex items-center gap-1.5">
                <Shield size={16} className="text-blue-500" />
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      name="sport"
                      value={editedAthlete.sport}
                      onChange={handleChange}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    />
                    <span className="text-gray-600">•</span>
                    <input
                      name="position"
                      value={editedAthlete.position}
                      onChange={handleChange}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    />
                  </div>
                ) : (
                  <>{athlete.sport} • {athlete.position}</>
                )}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-xl shadow-green-600/20"
                >
                  <Save size={16} /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                >
                  <X size={16} /> Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-xl shadow-blue-600/20"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
                <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all">
                  <Download size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Vitals */}
        <div className="space-y-8">
          <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-8 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2">
              <Medal size={16} /> Athletic Vitals
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Height</p>
                {isEditing ? (
                  <input
                    name="height"
                    value={editedAthlete.height}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-lg font-bold text-white italic focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  />
                ) : (
                  <p className="text-xl font-bold text-white italic">{athlete.height}</p>
                )}
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Weight</p>
                {isEditing ? (
                  <input
                    name="weight"
                    value={editedAthlete.weight}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-lg font-bold text-white italic focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  />
                ) : (
                  <p className="text-xl font-bold text-white italic">{athlete.weight}</p>
                )}
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black uppercase text-gray-500 mb-1">GPA</p>
                {isEditing ? (
                  <input
                    name="gpa"
                    value={editedAthlete.gpa}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-lg font-bold text-green-400 italic focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  />
                ) : (
                  <p className="text-xl font-bold text-green-400 italic">{athlete.gpa}</p>
                )}
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Wingspan</p>
                {isEditing ? (
                  <input
                    value={editedAthlete.stats['Wingspan']}
                    onChange={(e) => handleStatChange('Wingspan', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-lg font-bold text-white italic focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  />
                ) : (
                  <p className="text-xl font-bold text-white italic">{athlete.stats['Wingspan']}</p>
                )}
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Verified Max Lifts</h4>
              {Object.entries(isEditing ? editedAthlete.stats : athlete.stats).filter(([k]) => k !== 'Wingspan').map(([key, val]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-gray-400 font-medium">{key}</span>
                  {isEditing ? (
                    <input
                      value={val}
                      onChange={(e) => handleStatChange(key, e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-lg px-2 py-0.5 text-sm font-black text-white italic text-right focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    />
                  ) : (
                    <span className="text-sm font-black text-white italic">{val}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-8 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6">Social Reach</h3>
            <div className="space-y-3">
              <div className="space-y-4">
                {/* Instagram */}
                <div className="space-y-2">
                  {isEditing ? (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                      <Instagram size={18} className="text-pink-500" />
                      <input
                        value={editedAthlete.socialLinks?.instagram || ''}
                        onChange={(e) => handleSocialChange('instagram', e.target.value)}
                        placeholder="Instagram URL"
                        className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none"
                      />
                    </div>
                  ) : athlete.socialLinks?.instagram && (
                    <a 
                      href={athlete.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-gray-300 group/social"
                    >
                      <div className="flex items-center gap-3">
                        <Instagram size={18} className="text-pink-500" />
                        <span className="text-xs font-bold">Instagram</span>
                      </div>
                      <ExternalLink size={14} className="text-gray-600 group-hover/social:text-white transition-colors" />
                    </a>
                  )}
                </div>

                {/* Twitter */}
                <div className="space-y-2">
                  {isEditing ? (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                      <Twitter size={18} className="text-blue-400" />
                      <input
                        value={editedAthlete.socialLinks?.twitter || ''}
                        onChange={(e) => handleSocialChange('twitter', e.target.value)}
                        placeholder="Twitter URL"
                        className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none"
                      />
                    </div>
                  ) : athlete.socialLinks?.twitter && (
                    <a 
                      href={athlete.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-gray-300 group/social"
                    >
                      <div className="flex items-center gap-3">
                        <Twitter size={18} className="text-blue-400" />
                        <span className="text-xs font-bold">Twitter / X</span>
                      </div>
                      <ExternalLink size={14} className="text-gray-600 group-hover/social:text-white transition-colors" />
                    </a>
                  )}
                </div>

                {/* Hudl */}
                <div className="space-y-2">
                  {isEditing ? (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                      <Globe size={18} className="text-orange-500" />
                      <input
                        value={editedAthlete.socialLinks?.hudl || ''}
                        onChange={(e) => handleSocialChange('hudl', e.target.value)}
                        placeholder="Hudl Profile URL"
                        className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none"
                      />
                    </div>
                  ) : athlete.socialLinks?.hudl && (
                    <a 
                      href={athlete.socialLinks.hudl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-gray-300 group/social"
                    >
                      <div className="flex items-center gap-3">
                        <Globe size={18} className="text-orange-500" />
                        <span className="text-xs font-bold">Hudl Profile</span>
                      </div>
                      <ExternalLink size={14} className="text-gray-600 group-hover/social:text-white transition-colors" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio & Video */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-10 shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 mb-6">Personal Statement</h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={editedAthlete.bio}
                onChange={handleChange}
                rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xl font-medium leading-relaxed text-gray-200 italic focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            ) : (
              <p className="text-xl font-medium leading-relaxed text-gray-200 italic">
                "{athlete.bio}"
              </p>
            )}
          </div>

          <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-10 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10">
              <Video size={40} className="text-blue-500/20 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6">Highlight Reel (2025-26 Season)</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Video Embed URL (YouTube/Vimeo)</label>
                  <input
                    name="highlightVideoUrl"
                    value={editedAthlete.highlightVideoUrl || ''}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                  <p className="text-[10px] text-gray-600 italic">Use the "Embed" URL from YouTube (e.g., https://www.youtube.com/embed/VIDEO_ID)</p>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-white/5 rounded-[32px] border border-white/10 overflow-hidden shadow-2xl">
                {athlete.highlightVideoUrl ? (
                  <iframe
                    src={athlete.highlightVideoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Highlight Reel"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-40">
                    <Video size={48} className="text-gray-500" />
                    <p className="text-xs font-bold uppercase tracking-widest">No video linked</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthleteProfile;
