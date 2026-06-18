import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Post, Screen, TransitionType } from '../types';
import NavigationBar from './NavigationBar';
import { Heart, MessageSquare, Bookmark, Share2, Plus, Sparkles, Send } from 'lucide-react';

interface HomeScreenProps {
  posts: Post[];
  currentUser: { name: string; username: string; avatar: string; discipline: string };
  onNavigate: (screen: Screen, transition: TransitionType) => void;
  onLikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
}

export default function HomeScreen({
  posts,
  currentUser,
  onNavigate,
  onLikePost,
  onSavePost,
  onAddComment,
}: HomeScreenProps) {
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId] || '';
    if (!text.trim()) return;
    onAddComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="w-full h-[844px] flex flex-col bg-[#0a0a0a] text-[#e5e2e1] font-sans select-none relative overflow-hidden">
      {/* Editorial Top Floating bar */}
      <header className="shrink-0 pt-10 pb-4 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-neutral-900 px-6 flex items-center justify-between z-10">
        <div className="flex flex-col">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-500">生活動態</span>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] inline-block animate-pulse"></span>
            Flick Daily
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Active user status tag */}
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-xs font-semibold text-white">{currentUser.name}</span>
            <span className="font-mono text-[9px] text-[#8e9192] uppercase tracking-wider">{currentUser.discipline}</span>
          </div>
          <div 
            onClick={() => onNavigate('PROFILE', 'none')}
            className="w-9 h-9 rounded-full border border-neutral-800 bg-neutral-900 overflow-hidden cursor-pointer hover:border-neutral-500 transition-colors"
          >
            <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover text-white" referrerPolicy="no-referrer" />
          </div>
        </div>
      </header>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-24">
        {/* Main Container */}
        <main className="max-w-xl mx-auto px-4 pt-4">
        
        {/* Quick Composer matching "//main//div[contains(@class, 'flex-1 bg-surface-container-low')]" */}
        <div className="bg-[#141414] border border-neutral-900 rounded-xl p-4 mb-6 flex gap-4 hover:border-neutral-800 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden shrink-0">
            <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          
          {/* 
            CRITICAL ELEMENT:
            This div matches "//main//div[contains(@class, 'flex-1 bg-surface-container-low')]"
            Clicking it opens the compose screen with a custom "slide_up" animation
          */}
          <div 
            className="flex-1 bg-surface-container-low text-neutral-400 p-3 rounded-lg border border-neutral-800/60 text-xs font-medium cursor-pointer hover:bg-neutral-800/40 hover:border-neutral-700 transition-all flex items-center justify-between"
            onClick={() => onNavigate('POST', 'slide_up')}
          >
            <span className="tracking-wide">分享今天的生活或短片...</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-neutral-800 text-white font-mono text-xs">
              +
            </span>
          </div>
        </div>

        {/* Content Feed list */}
        <div className="space-y-6">
          {posts.filter(post => !post.isPrivate).map((post) => (
            <article 
              key={post.id}
              className="bg-[#141414] border border-neutral-900 rounded-xl overflow-hidden hover:border-neutral-800/80 transition-all duration-300"
            >
              {/* Creator Header */}
              <div className="p-4 flex items-center justify-between border-b border-neutral-900/60">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => onNavigate('PROFILE', 'none')}
                >
                  <div className="w-9 h-9 rounded-full bg-neutral-800 overflow-hidden border border-neutral-800/80">
                    <img 
                      src={post.creator.avatar} 
                      alt={post.creator.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-tight">{post.creator.name}</h3>
                    <p className="font-mono text-[9px] text-neutral-500 tracking-wider font-semibold">{post.creator.username}</p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-neutral-600">{post.timestamp}</span>
              </div>

              {/* Post Visual Content */}
              {post.image && (
                <div className="aspect-[4/3] bg-neutral-950 overflow-hidden relative group">
                   <img 
                    src={post.image} 
                    alt="Exhibit" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-[#7c3aed]/90 backdrop-blur-md border border-purple-500/30 px-3 py-1 rounded-full text-[9px] font-mono tracking-wider font-semibold text-white">
                    DAILY SNAP | 日常照片
                  </div>
                </div>
              )}

              {post.video && (
                <div className="aspect-[4/3] bg-neutral-950 overflow-hidden relative group">
                  <video 
                    src={post.video} 
                    className="w-full h-full object-cover" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    controls
                    controlsList="nodownload"
                  />
                  <div className="absolute top-3 right-3 bg-[#7c3aed]/90 backdrop-blur-md border border-purple-500/30 px-3 py-1 rounded-full text-[9px] font-mono tracking-wider font-semibold text-white pointer-events-none z-10">
                    DAILY VLOG | 動態隨筆
                  </div>
                </div>
              )}

              {/* Caption & Content */}
              <div className="p-4">
                <p className="text-xs text-neutral-300 leading-relaxed tracking-wide font-normal mb-3">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="font-mono text-[9px] bg-neutral-900 text-neutral-400 border border-neutral-800/80 px-2 py-0.5 rounded"
                    >
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>

                {/* Interactions Row */}
                <div className="flex items-center justify-between border-t border-neutral-900/80 pt-3.5 mt-2">
                  <div className="flex items-center gap-4">
                    {/* Like button */}
                    <button 
                      onClick={() => onLikePost(post.id)}
                      className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer group"
                    >
                      <Heart 
                        size={15} 
                        className={`transition-transform duration-200 group-hover:scale-110 ${
                          post.isLiked ? 'fill-white text-white' : 'text-neutral-500'
                        }`} 
                      />
                      <span className="font-mono text-[11px]">{post.likes}</span>
                    </button>

                    {/* Comments toggle button */}
                    <button 
                      onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <MessageSquare size={15} className="text-neutral-500" />
                      <span className="font-mono text-[11px]">{post.commentsCount}</span>
                    </button>
                  </div>

                  {/* Save button */}
                  <button 
                    onClick={() => onSavePost(post.id)}
                    className="flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Bookmark 
                      size={15} 
                      className={post.isSaved ? 'fill-white text-white' : 'text-neutral-500'} 
                    />
                  </button>
                </div>

                {/* Expandable Comment Thread */}
                {activeCommentPost === post.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 border-t border-neutral-900 pt-4 space-y-3"
                  >
                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
                      討論串 / 留言區
                    </div>

                    {/* Simple Comment Input inside card */}
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="發表你的生活共鳴與留言..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendComment(post.id);
                        }}
                        className="flex-1 bg-neutral-950 border border-neutral-900 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-700 font-sans"
                      />
                      <button 
                        onClick={() => handleSendComment(post.id)}
                        className="bg-neutral-800 text-white rounded px-2.5 flex items-center justify-center hover:bg-neutral-700 transition"
                      >
                        <Send size={12} />
                      </button>
                    </div>

                    {/* Simulated Comments List */}
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                      <div className="text-[11px] leading-relaxed">
                        <span className="font-semibold text-white mr-1.5">@vibe_traveler</span>
                        <span className="text-neutral-400">這個畫面與生活記錄也太有氛圍了吧！好喜歡這種細微的美好。</span>
                      </div>
                      <div className="text-[11px] leading-relaxed">
                        <span className="font-semibold text-white mr-1.5">@foodie_life</span>
                        <span className="text-neutral-400">看得我也想把手沖咖啡與烘焙列入我的週末儀式感了！❤️</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
      </div>

      {/* Nav bar for Home screen (strictly "灰階版" (isColored=false)) */}
      <NavigationBar currentScreen="HOME" onNavigate={onNavigate} isColored={false} />
    </div>
  );
}
