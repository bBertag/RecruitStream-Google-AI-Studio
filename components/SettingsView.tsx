
import React, { useState, useEffect } from 'react';
import { Athlete } from '../types';
import { Save, User, Camera, Image as ImageIcon, Video, Instagram, Twitter, Globe } from 'lucide-react';

interface SettingsViewProps {
  athlete: Athlete;
  onUpdate: (updatedAthlete: Athlete) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ athlete, onUpdate }) => {
  const [editedAthlete, setEditedAthlete] = useState<Athlete>(athlete);

  // Sync local state with props when athlete changes externally
  useEffect(() => {
    setEditedAthlete(athlete);
  }, [athlete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedAthlete(prev => ({ ...prev, [name]: value }));
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

  const handleSave = () => {
    onUpdate(editedAthlete);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Settings</h1>
        <p className="text-gray-500 text-sm font-medium">Manage your account and profile preferences</p>
      </div>

      <div className="bg-[#0a0a0a] rounded-[32px] border border-white/5 p-8 shadow-xl space-y-8">
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
            <User size={16} /> Header Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
              <input
                name="name"
                value={editedAthlete.name}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Graduation Class</label>
              <input
                name="class"
                value={editedAthlete.class}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
              <Camera size={14} /> Profile Image
            </label>
            <div className="flex gap-6 items-center bg-black/20 p-6 rounded-[24px] border border-white/5">
              <div className="relative group/avatar">
                <img 
                  src={editedAthlete.profileImage || "https://picsum.photos/seed/athlete1/100/100"} 
                  className="w-24 h-24 rounded-[24px] border border-white/10 shadow-lg object-cover" 
                  alt="Preview" 
                />
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-xs text-gray-400 font-medium">Upload a profile picture to represent you to coaches and recruiters.</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white cursor-pointer transition-all">
                  <Camera size={14} />
                  Choose File
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
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
                    }} 
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-2">
              <Video size={16} /> Media & Social
            </h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Highlight Video Embed URL</label>
              <input
                name="highlightVideoUrl"
                value={editedAthlete.highlightVideoUrl || ''}
                onChange={handleChange}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-1">
                  <Instagram size={12} /> Instagram URL
                </label>
                <input
                  value={editedAthlete.socialLinks?.instagram || ''}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-1">
                  <Twitter size={12} /> Twitter URL
                </label>
                <input
                  value={editedAthlete.socialLinks?.twitter || ''}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-1">
                  <Globe size={12} /> Hudl URL
                </label>
                <input
                  value={editedAthlete.socialLinks?.hudl || ''}
                  onChange={(e) => handleSocialChange('hudl', e.target.value)}
                  placeholder="https://hudl.com/..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-xl shadow-blue-600/20"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
