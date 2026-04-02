import React from 'react';
import { 
  LogIn, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Globe, 
  ArrowRight 
} from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: () => void;
  isLoading: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading }) => {
  const features = [
    { icon: Zap, title: 'Real-time Updates', desc: 'Get instant notifications for campus events.' },
    { icon: ShieldCheck, title: 'Verified Network', desc: 'Exclusive access for university students only.' },
    { icon: Globe, title: 'Campus Buddy', desc: 'Find companions for gym, travel, or coffee.' },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-500/20 blur-[120px] rounded-full" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* Left Side: Branding */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-black text-white italic tracking-tighter">UniVerse</span>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
              THE ULTIMATE <br />
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                STUDENT
              </span> <br />
              NETWORK.
            </h1>
            
            <p className="text-xl text-white/40 font-medium max-w-md leading-relaxed">
              Connect with your campus like never before. Queries, buddies, and shared orders—all in one place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="space-y-3"
              >
                <div className="p-2 rounded-xl bg-white/5 w-fit text-orange-500">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">{f.title}</h3>
                <p className="text-white/30 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/[0.03] border border-white/10 rounded-[60px] p-12 backdrop-blur-xl shadow-2xl relative"
        >
          <div className="absolute top-0 right-0 p-8">
            <div className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">
              Beta Access
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight mb-3">Join the Universe.</h2>
              <p className="text-white/40 font-medium">Sign in with your university email to get started.</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={onLogin}
                disabled={isLoading}
                className="w-full group relative flex items-center justify-center space-x-4 py-5 rounded-[32px] bg-white text-black font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/10 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
                    <span>CONTINUE WITH GOOGLE</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <div className="flex items-center space-x-4 px-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Verified Students Only</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
              <p className="text-xs text-white/40 leading-relaxed text-center">
                By continuing, you agree to our <span className="text-white hover:underline cursor-pointer">Terms of Service</span> and <span className="text-white hover:underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-2 text-white/10">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Built for the Future</span>
        <div className="w-1 h-1 rounded-full bg-white/10" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">© 2026 UniVerse</span>
      </div>
    </div>
  );
};

export default Login;
