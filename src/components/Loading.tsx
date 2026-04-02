import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="relative">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 rounded-[40px] bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-orange-500/40 relative z-10"
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>
        
        {/* Pulsing Rings */}
        <motion.div 
          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-[40px] bg-orange-500/30 -z-0"
        />
        <motion.div 
          animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute inset-0 rounded-[40px] bg-pink-500/20 -z-0"
        />
      </div>

      <div className="mt-12 text-center space-y-4">
        <h2 className="text-2xl font-black text-white italic tracking-tighter">UniVerse</h2>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" />
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]" />
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]" />
        </div>
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] pt-4">Initializing Campus Network</p>
      </div>

      {/* Progress Bar */}
      <div className="mt-12 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-1/2 h-full bg-gradient-to-r from-orange-500 to-pink-500"
        />
      </div>
    </div>
  );
};

export default Loading;
