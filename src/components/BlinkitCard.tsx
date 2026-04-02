import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Users, 
  Timer, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  Trash2,
  User
} from 'lucide-react';
import { BlinkitRequest } from '../types';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface BlinkitCardProps {
  request: BlinkitRequest;
  onJoin: (id: string) => void;
  onClose?: (id: string) => void;
  onDelete?: (id: string) => void;
  currentUserId?: string;
}

const BlinkitCard: React.FC<BlinkitCardProps> = ({ request, onJoin, onClose, onDelete, currentUserId }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const isJoined = currentUserId && request.joinedUids.includes(currentUserId);
  const isExpired = timeLeft <= 0 || request.status === 'expired';
  const isCreator = currentUserId === request.authorUid;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const diff = Math.max(0, request.expiresAt - now);
      setTimeLeft(diff);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [request.expiresAt]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = Math.min(100, (timeLeft / (request.windowMinutes * 60 * 1000)) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative overflow-hidden rounded-3xl p-6 mb-4 border transition-all duration-500",
        isExpired 
          ? "bg-white/5 border-white/10 opacity-60" 
          : "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.1)]"
      )}
    >
      {/* Progress Bar Background */}
      {!isExpired && (
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
          <motion.div 
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-yellow-500"
          />
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-yellow-500/20 text-yellow-500">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-white text-lg tracking-tight leading-tight">
              Blinkit Shared Order
            </h3>
            <p className="text-white/40 text-xs font-medium uppercase tracking-widest">
              {request.authorName} is ordering
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isCreator && !isExpired && (
            <button 
              onClick={() => onClose?.(request.id)}
              className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
              title="Close Request"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
          {isCreator && (
            <button 
              onClick={() => onDelete?.(request.id)}
              className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
              title="Delete Request"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <div className={cn(
            "flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-black tracking-tighter",
            isExpired ? "bg-white/10 text-white/40" : "bg-yellow-500 text-black"
          )}>
            <Timer className="w-4 h-4" />
            <span>{isExpired ? "EXPIRED" : formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <p className="text-white font-medium text-sm mb-6 bg-white/5 p-4 rounded-2xl border border-white/5 italic">
        "{request.itemDescription}"
      </p>

      {/* Participants List */}
      <div className="mb-6 space-y-2">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Participants</p>
        <div className="flex flex-wrap gap-2">
          {request.participants?.map((p) => (
            <div key={p.uid} className="flex items-center space-x-2 bg-white/5 border border-white/5 rounded-xl px-3 py-1.5">
              <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-[8px] font-bold text-white overflow-hidden">
                {p.photoURL ? (
                  <img src={p.photoURL} alt={p.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-3 h-3" />
                )}
              </div>
              <span className="text-[10px] font-bold text-white/60">{p.displayName}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-white/20" />
          <span className="text-xs font-bold text-white/60">
            {request.joinedUids.length} joined
          </span>
        </div>

        <button
          disabled={isExpired || isJoined}
          onClick={() => onJoin(request.id)}
          className={cn(
            "flex items-center space-x-2 px-6 py-2.5 rounded-2xl font-black text-sm transition-all duration-300",
            isJoined 
              ? "bg-green-500/20 text-green-500 border border-green-500/30" 
              : isExpired
                ? "bg-white/5 text-white/20 cursor-not-allowed"
                : "bg-white text-black hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
          )}
        >
          {isJoined ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>JOINED</span>
            </>
          ) : isExpired ? (
            <span>CLOSED</span>
          ) : (
            <>
              <span>JOIN NOW</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default BlinkitCard;
