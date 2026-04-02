import React from 'react';
import { 
  Bell, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { Notification } from '../types';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClose: () => void;
  onViewAll: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ 
  notifications, 
  onMarkAsRead, 
  onClose,
  onViewAll
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'query': return <MessageSquare className="w-4 h-4" />;
      case 'blinkit': return <ShoppingBag className="w-4 h-4" />;
      case 'buddy': return <Users className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'query': return 'text-blue-400 bg-blue-400/10';
      case 'blinkit': return 'text-yellow-500 bg-yellow-500/10';
      case 'buddy': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-purple-400 bg-purple-400/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="absolute right-0 top-full mt-4 w-96 bg-[#121212] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden z-[100]"
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h3 className="font-black text-white tracking-tight">Notifications</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto no-scrollbar">
        {notifications.length === 0 ? (
          <div className="py-12 text-center space-y-4 opacity-20">
            <Bell className="w-12 h-12 mx-auto" />
            <p className="text-sm font-bold">No new notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                className={cn(
                  "p-5 flex items-start space-x-4 cursor-pointer transition-colors",
                  !notif.read && "bg-orange-500/[0.02]"
                )}
                onClick={() => {
                  onMarkAsRead(notif.id);
                  onClose();
                }}
              >
                <div className={cn("p-3 rounded-xl flex-shrink-0", getColor(notif.type))}>
                  {getIcon(notif.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className={cn(
                      "font-bold text-sm truncate pr-2",
                      notif.read ? "text-white/40" : "text-white"
                    )}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] font-bold text-white/20 uppercase flex-shrink-0">
                      {formatDistanceToNow(notif.createdAt)}
                    </span>
                  </div>
                  <p className={cn(
                    "text-xs leading-relaxed line-clamp-2",
                    notif.read ? "text-white/20" : "text-white/60"
                  )}>
                    {notif.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onViewAll}
        className="w-full p-5 bg-white/[0.02] border-t border-white/5 text-center text-xs font-black text-orange-500 hover:text-orange-400 hover:bg-white/[0.05] transition-all flex items-center justify-center space-x-2"
      >
        <span>VIEW ALL NOTIFICATIONS</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default NotificationsDropdown;
