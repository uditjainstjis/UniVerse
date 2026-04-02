import React from 'react';
import { 
  Home, 
  Search, 
  User, 
  MessageSquare, 
  Users, 
  Stethoscope, 
  LifeBuoy, 
  Shirt, 
  Utensils, 
  Bell, 
  LogOut,
  Shield,
  X,
  MessageCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: any;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout, isOpen, onClose }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'my-queries', icon: MessageSquare, label: 'My Queries' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'find-buddy', icon: Users, label: 'Find a Buddy' },
    { id: 'medical', icon: Stethoscope, label: 'Medical' },
    { id: 'support', icon: LifeBuoy, label: 'Support' },
    { id: 'laundry', icon: Shirt, label: 'Laundry' },
    { id: 'food-court', icon: Utensils, label: 'Food Court' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "h-screen w-72 bg-black/95 border-r border-white/10 flex flex-col p-6 fixed left-0 top-0 z-50 transition-all duration-500 ease-out shadow-2xl shadow-orange-500/5",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-12 px-2">
          <h1 className="text-3xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent italic tracking-tighter">
            UniVerse
          </h1>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) onClose();
              }}
              className={cn(
                "w-full flex items-center space-x-4 px-5 py-4 rounded-[24px] transition-all duration-300 group relative overflow-hidden",
                activeTab === item.id 
                  ? "bg-white/10 text-white shadow-lg shadow-white/5" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1.5 h-8 bg-orange-500 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-all duration-300 group-hover:scale-110",
                activeTab === item.id ? "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" : ""
              )} />
              <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        {user && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex items-center space-x-4 px-4 py-4 mb-4 bg-white/5 rounded-[32px] border border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden shadow-lg shadow-orange-500/20">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-xl">{user.displayName?.[0] || 'U'}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate tracking-tight">{user.displayName}</p>
                <p className="text-[10px] font-bold text-white/20 truncate uppercase tracking-widest">Student ID: {user.uid.slice(0, 8)}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-[24px] bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 group"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-black text-xs uppercase tracking-widest">Logout Session</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
