import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Post, Screen, TransitionType } from '../types';
import NavigationBar from './NavigationBar';
import { Search, Compass, TrendingUp, Grid, List, Sparkles } from 'lucide-react';

interface SearchScreenProps {
  posts: Post[];
  onNavigate: (screen: Screen, transition: TransitionType) => void;
  onLikePost: (postId: string) => void;
}

export default function SearchScreen({ posts, onNavigate, onLikePost }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const popularTags = ['日常隨筆', '美食探店', '旅遊日記', '手沖咖啡', '手作料理', '療癒瞬間'];

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesQuery = searchQuery.trim() === '' || 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = !selectedTag || 
        post.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase());

      return matchesQuery && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null); // Deselect
    } else {
      setSelectedTag(tag);
    }
  };

  return (
    <div className="w-full h-[844px] flex flex-col bg-[#0b0a0f] text-[#e8dfee] font-sans relative overflow-hidden">
      {/* Search Header */}
      <header className="shrink-0 pt-10 pb-4 bg-[#0b0a0f]/90 backdrop-blur-xl border-b border-purple-950/10 px-6 z-10">
        <div className="max-w-xl mx-auto">
          <div className="flex flex-col mb-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#958da1]">生活探索</span>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              探索精彩生活點滴
            </h1>
          </div>
          
          {/* Search Inputs Field - featuring active colored glow */}
          <div className="relative">
            <input 
              type="text"
              placeholder="搜尋關鍵字、標籤、創作者..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#16161e] border border-neutral-850 text-xs rounded-lg py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/10 transition-all duration-300 placeholder:text-[#5d5966]"
            />
            <Search className="absolute left-4 top-3.5 text-[#5d5966] group-focus-within:text-[#7c3aed]" size={16} />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-xs text-neutral-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Discover Layout */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-24">
        <main className="max-w-xl mx-auto px-4 pt-4">
        {/* Popular / Trending Tags */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
              <TrendingUp size={12} className="text-[#c8c6c6]" /> 熱門話題標籤
            </span>
            {selectedTag && (
              <button 
                onClick={() => setSelectedTag(null)}
                className="text-[10px] font-mono text-[#7c3aed]"
              >
                重設篩選
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`py-1.5 px-3.5 rounded-full text-xs font-mono transition-all duration-300 ${
                    isActive
                      ? 'bg-[#7c3aed] text-white font-medium border border-transparent shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                      : 'bg-[#16161e] text-[#ccc3d8] border border-neutral-900 hover:border-[#7c3aed]/50'
                  }`}
                >
                  #{tag.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Results Metadata */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <span className="text-[11px] font-mono text-[#ccc3d8]">
            找到 <span className="font-bold text-[#7c3aed]">{filteredPosts.length}</span> 篇精彩日常
          </span>
          <div className="flex items-center gap-1 bg-[#16161e] p-1 rounded-lg border border-neutral-900">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-neutral-500'}`}
            >
              <Grid size={14} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-neutral-500'}`}
            >
              <List size={14} />
            </button>
          </div>
        </div>

        {/* Empty States */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-[#16161e] rounded-xl border border-neutral-905 px-4 mb-8">
            <p className="text-neutral-500 text-xs font-mono">沒有找到匹配的生活動態。</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
              className="mt-3 text-xs bg-white text-black py-1.5 px-3.5 rounded-full font-bold hover:bg-neutral-200"
            >
              重設篩選條件
            </button>
          </div>
        )}

        {/* Results List or Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3.5">
            {filteredPosts.map((post) => (
              <div 
                key={post.id}
                onClick={() => onNavigate('HOME', 'none')}
                className="bg-[#16161e] rounded-lg overflow-hidden border border-neutral-900 hover:border-[#7c3aed]/30 hover:scale-[1.01] transition-all duration-300 cursor-pointer relative group"
              >
                {post.image ? (
                  <div className="aspect-square bg-neutral-950 relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5">
                      <span className="text-[10px] font-bold text-white uppercase">{post.creator.name}</span>
                      <span className="font-mono text-[8px] text-[#ccc3d8]">{post.creator.username}</span>
                    </div>
                  </div>
                ) : post.video ? (
                  <div className="aspect-square bg-neutral-950 relative overflow-hidden">
                    <video 
                      src={post.video} 
                      className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-105"
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5">
                      <span className="text-[10px] font-bold text-white uppercase">{post.creator.name}</span>
                      <span className="font-mono text-[8px] text-[#ccc3d8]">{post.creator.username}</span>
                      <span className="font-mono text-[7px] text-[#7c3aed] mt-0.5 font-bold tracking-widest uppercase flex items-center gap-1">📽️ 影音日誌</span>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square bg-neutral-900 border-b border-neutral-805 p-3 flex flex-col justify-between">
                    <p className="text-[10px] text-neutral-400 line-clamp-4">{post.content}</p>
                    <span className="font-mono text-[8px] text-neutral-600">{post.creator.username}</span>
                  </div>
                )}
                <div className="p-2 flex items-center justify-between text-[10px] font-mono border-t border-neutral-905/35">
                  <span className="text-neutral-500 font-semibold">#{post.tags[0] || 'Art'}</span>
                  <span className="text-neutral-400 italic">♥ {post.likes}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div 
                key={post.id}
                onClick={() => onNavigate('HOME', 'none')}
                className="bg-[#16161e] p-4 rounded-xl border border-neutral-900 hover:border-[#7c3aed]/20 transition-all duration-200 cursor-pointer flex gap-4"
              >
                {post.image ? (
                  <div className="w-16 h-16 rounded overflow-hidden bg-neutral-950 shrink-0">
                    <img src={post.image} alt="Post preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ) : post.video ? (
                  <div className="w-16 h-16 rounded overflow-hidden bg-neutral-950 shrink-0 relative">
                    <video src={post.video} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                    <div className="absolute bottom-1 right-1 bg-[#7c3aed] w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] text-white font-bold">▶</div>
                  </div>
                ) : null}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white">{post.creator.name}</span>
                    <span className="font-mono text-[9px] text-[#ccc3d8]">{post.creator.username}</span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-1">{post.content}</p>
                  <div className="flex items-center gap-2 text-[9px] font-mono">
                    {post.tags.map(t => <span key={t} className="text-[#ccc3d8]">#{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      </div>

      {/* Nav bar for Search screen (strictly "灰階加色版" (isColored=true)) */}
      <NavigationBar currentScreen="SEARCH" onNavigate={onNavigate} isColored={true} />
    </div>
  );
}
