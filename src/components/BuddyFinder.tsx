import React, { useState } from 'react';
import { 
  Users, 
  Dumbbell, 
  Coffee, 
  Car, 
  Palmtree, 
  Plus, 
  Search, 
  MessageCircle, 
  MapPin 
} from 'lucide-react';
import { BuddyPost } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface BuddyFinderProps {
  posts: BuddyPost[];
  onPostBuddy: (category: BuddyPost['category'], title: string, description: string) => void;
  onConnect: (post: BuddyPost) => void;
  currentUserId?: string;
}

const BuddyFinder: React.FC<BuddyFinderProps> = ({ posts, onPostBuddy, onConnect, currentUserId }) => {
  const [activeCategory, setActiveCategory] = useState<BuddyPost['category'] | 'all'>('all');
  const [isPosting, setIsPosting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState<BuddyPost['category']>('gym');

  const categories = [
    { id: 'all', icon: Users, label: 'All' },
    { id: 'gym', icon: Dumbbell, label: 'Gym' },
    { id: 'swimming', icon: MapPin, label: 'Swimming' },
    { id: 'coffee', icon: Coffee, label: 'Coffee' },
    { id: 'cab', icon: Car, label: 'Cab' },
    { id: 'vacation', icon: Palmtree, label: 'Vacation' },
    { id: 'other', icon: Users, label: 'Other' },
  ];

  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  const handleSubmit = () => {
    if (newTitle.trim() && newDesc.trim()) {
      onPostBuddy(newCat, newTitle, newDesc);
      setIsPosting(false);
      setNewTitle('');
      setNewDesc('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-24 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Find a Buddy</h2>
          <p className="text-white/40 text-sm font-medium">Don't go alone. Find your partner for anything.</p>
        </div>
        <button 
          onClick={() => setIsPosting(true)}
          className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white text-black font-black text-sm hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>POST REQUEST</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all",
              activeCategory === cat.id 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                : "bg-white/5 text-white/40 hover:bg-white/10"
            )}
          >
            <cat.icon className="w-4 h-4" />
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/5 border border-white/10 rounded-[32px] p-6 hover:bg-white/[0.08] transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                  {(() => {
                    const CategoryIcon = categories.find(c => c.id === post.category)?.icon || Users;
                    return <CategoryIcon className="w-6 h-6" />;
                  })()}
                </div>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                  {post.category}
                </span>
              </div>
              
              <h3 className="text-xl font-black text-white mb-2 tracking-tight">{post.title}</h3>
              <p className="text-white/50 text-sm mb-6 line-clamp-3 leading-relaxed">
                {post.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {post.authorName[0]}
                  </div>
                  <span className="text-xs font-bold text-white/60">{post.authorName}</span>
                </div>
                <button 
                  onClick={() => onConnect(post)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 text-white text-xs font-black hover:bg-white/10 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>CONNECT</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Post Modal */}
      <AnimatePresence>
        {isPosting && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPosting(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#121212] border border-white/10 rounded-[40px] p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-black text-white mb-8 tracking-tighter">Find Your Buddy</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-white/40 uppercase tracking-widest">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.filter(c => c.id !== 'all').map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setNewCat(cat.id as any)}
                        className={cn(
                          "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all",
                          newCat === cat.id 
                            ? "bg-orange-500/10 border-orange-500 text-orange-500" 
                            : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                        )}
                      >
                        <cat.icon className="w-5 h-5 mb-2" />
                        <span className="text-[10px] font-bold uppercase">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-white/40 uppercase tracking-widest">Title</label>
                  <input 
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Looking for a Gym Partner"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:border-orange-500/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-white/40 uppercase tracking-widest">Description</label>
                  <textarea 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Tell them more about what you're looking for..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/20 focus:border-orange-500/50 transition-colors min-h-[120px] resize-none"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button 
                    onClick={() => setIsPosting(false)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-black text-sm hover:bg-white/10 transition-all"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="flex-1 py-4 rounded-2xl bg-orange-500 text-white font-black text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                  >
                    POST NOW
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuddyFinder;
