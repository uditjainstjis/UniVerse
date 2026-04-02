import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Mail,
  Phone,
  Camera,
  LogOut,
  ChevronRight,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onUpdateProfile, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bio: profile.bio || '',
    phone: profile.phone || '',
    privacySettings: profile.privacySettings || {
      showEmail: true,
      showPhone: false,
      allowDirectMessages: true
    }
  });

  const handleSave = () => {
    onUpdateProfile(editData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-24 px-4">
      {/* Profile Header */}
      <div className="relative mb-12">
        <div className="h-48 w-full rounded-[40px] bg-gradient-to-br from-orange-500/20 via-pink-500/20 to-purple-500/20 border border-white/10" />
        
        <div className="absolute -bottom-8 left-10 flex items-end space-x-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-orange-500 to-pink-500 border-4 border-black p-1 shadow-2xl overflow-hidden">
              <img 
                src={profile.photoURL} 
                alt={profile.displayName} 
                className="w-full h-full object-cover rounded-[36px]" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <button className="absolute bottom-2 right-2 p-2 rounded-xl bg-white text-black shadow-lg hover:scale-110 transition-all">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="pb-4">
            <h2 className="text-3xl font-black text-white tracking-tighter mb-1">{profile.displayName}</h2>
            <div className="flex items-center space-x-3">
              <span className="text-white/40 text-sm font-medium">{profile.email}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                Student
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white tracking-tight">About Me</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-400 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Bio</label>
                  <textarea 
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none min-h-[120px]"
                    placeholder="Tell the campus about yourself..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button 
                    onClick={handleSave}
                    className="flex-1 py-4 rounded-2xl bg-orange-500 text-white font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 text-white/60 font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-white/60 leading-relaxed">
                  {profile.bio || "No bio added yet. Click edit to tell us about yourself!"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <Mail className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-white/60">{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <Phone className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-white/60">{profile.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 space-y-6">
            <h3 className="text-xl font-black text-white tracking-tight">Privacy & Security</h3>
            <div className="space-y-4">
              {[
                { 
                  label: 'Show Email', 
                  desc: 'Allow others to see your email address',
                  key: 'showEmail'
                },
                { 
                  label: 'Show Phone', 
                  desc: 'Allow others to see your phone number',
                  key: 'showPhone'
                },
                { 
                  label: 'Allow DMs', 
                  desc: 'Allow others to send you direct messages',
                  key: 'allowDirectMessages'
                }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div>
                    <p className="text-sm font-bold text-white">{setting.label}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{setting.desc}</p>
                  </div>
                  <button 
                    onClick={() => {
                      const key = setting.key as keyof typeof editData.privacySettings;
                      const newSettings = {
                        ...editData.privacySettings,
                        [key]: !editData.privacySettings[key]
                      };
                      setEditData({...editData, privacySettings: newSettings});
                      onUpdateProfile({ privacySettings: newSettings });
                    }}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      editData.privacySettings[setting.key as keyof typeof editData.privacySettings] ? "bg-orange-500" : "bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                      editData.privacySettings[setting.key as keyof typeof editData.privacySettings] ? "right-1" : "left-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 space-y-6">
            <h3 className="text-xl font-black text-white tracking-tight">Account</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                <div className="flex items-center space-x-3">
                  <Settings className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                  <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Preferences</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                  <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Security</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
              </button>
              <button 
                onClick={onLogout}
                className="w-full flex items-center space-x-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all mt-4"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-black uppercase tracking-widest">Logout</span>
              </button>
            </div>
          </div>

          <div className="p-8 rounded-[40px] bg-gradient-to-br from-orange-500 to-pink-500 text-white space-y-4 shadow-xl shadow-orange-500/20">
            <h4 className="text-lg font-black tracking-tight">UniVerse Pro</h4>
            <p className="text-xs font-medium opacity-80">Get exclusive campus perks and advanced networking features.</p>
            <button className="w-full py-3 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
