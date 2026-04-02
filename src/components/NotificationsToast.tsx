import React from 'react';
import { 
  Bell, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  X 
} from 'lucide-react';
import { Notification } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsToastProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationsToast: React.FC<NotificationsToastProps> = ({ notification, onClose }) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'query': return <MessageSquare className="w-5 h-5" />;
      case 'blinkit': return <ShoppingBag className="w-5 h-5" />;
      case 'buddy': return <Users className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
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
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className="bg-[#121212] border border-white/10 rounded-[32px] p-5 shadow-2xl shadow-black/50 flex items-start space-x-4 min-w-[320px] max-w-md pointer-events-auto"
    >
      <div className={cn("p-3 rounded-2xl flex-shrink-0", getColor(notification.type))}>
        {getIcon(notification.type)}
      </div>
      
      <div className="flex-1 min-w-0 pr-4">
        <h4 className="font-black text-white text-sm tracking-tight mb-1">{notification.title}</h4>
        <p className="text-white/60 text-xs leading-relaxed line-clamp-2">{notification.message}</p>
      </div>

      <button 
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default NotificationsToast;
