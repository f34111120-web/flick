import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Post, Screen, TransitionType } from '../types';
import { Sparkles, Image, Check, X, Tag } from 'lucide-react';

interface PostScreenProps {
  onAddPost: (postData: { content: string; tags: string[]; image?: string; video?: string; isPrivate?: boolean }) => void;
  onNavigate: (screen: Screen, transition: TransitionType) => void;
}

const PRESET_ARTWORKS = [
  {
    id: 'art-1',
    name: '陽光灑落的慵懶午後',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop',
    type: 'image',
    tags: ['日常隨筆', '療癒瞬間']
  },
  {
    id: 'art-2',
    name: '城市角落的文青咖啡',
    url: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop',
    type: 'image',
    tags: ['美食探店', '手沖咖啡']
  },
  {
    id: 'art-3',
    name: '手作烘焙的溫暖香氣',
    url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=600&auto=format&fit=crop',
    type: 'image',
    tags: ['手作料理', '日常隨筆']
  },
  {
    id: 'art-v1',
    name: '沖繩藍色海浪動態影片',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-breaking-in-the-ocean-1527-large.mp4',
    type: 'video',
    tags: ['旅遊日記', '療癒瞬間']
  },
  {
    id: 'art-v2',
    name: '城市夜景車軌流線短片',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-subway-train-passing-by-underground-42023-large.mp4',
    type: 'video',
    tags: ['旅遊日記', '日常隨筆']
  },
  {
    id: 'art-v3',
    name: '清晨自製手沖注水短片',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-rotating-clock-mechanism-43094-large.mp4',
    type: 'video',
    tags: ['手沖咖啡', '手作料理']
  },
  {
    id: 'art-4',
    name: '週末露營的柴火營地',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
    type: 'image',
    tags: ['旅遊日記', '日常隨筆']
  }
];

export default function PostScreen({ onAddPost, onNavigate }: PostScreenProps) {
  const [content, setContent] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(PRESET_ARTWORKS[0]);
  const [activeTags, setActiveTags] = useState<string[]>(['日常隨筆']);
  const [isPrivate, setIsPrivate] = useState(false);
  
  const tagOptions = ['日常隨筆', '美食探店', '旅遊日記', '手沖咖啡', '手作料理', '療癒瞬間', '海邊', '下午茶'];

  const handleToggleTag = (tag: string) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter(t => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onAddPost({
      content,
      tags: activeTags,
      image: selectedAsset.type === 'image' ? selectedAsset.url : undefined,
      video: selectedAsset.type === 'video' ? selectedAsset.url : undefined,
      isPrivate: isPrivate
    });
  };

  return (
    <div className="w-full h-[844px] flex flex-col bg-[#0a090e] text-[#e8dfee] font-sans relative overflow-hidden">
      {/* Dynamic background lighting lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(124,58,237,0.08),_transparent_45%)] pointer-events-none" />

      {/* Scrollable Container with top/bottom padding protection */}
      <div className="flex-1 overflow-y-auto scrollbar-none pt-10 px-4 pb-12 z-10">
        <div className="max-w-md mx-auto">
        
        {/* Top Header Row Panel */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-purple-950/20">
          <button
            aria-label="Cancel"
            onClick={() => onNavigate('HOME', 'push_back')}
            className="p-2 text-neutral-500 hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
          
          <div className="text-center">
            <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#958da1]">生活分享</span>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider">發表新日常</h1>
          </div>

          <button 
            type="submit"
            onClick={handlePublish}
            disabled={!content.trim()}
            className={`font-mono text-[11px] font-bold py-1 px-4 rounded transition-all duration-300 ${
              content.trim() 
                ? 'bg-white text-black hover:bg-[#7c3aed] hover:text-white cursor-pointer shadow-[0_4px_16px_rgba(124,58,237,0.2)]'
                : 'bg-neutral-850 text-neutral-600 cursor-not-allowed'
            }`}
          >
            發表
          </button>
        </div>

        {/* Post Form */}
        <form onSubmit={handlePublish} className="space-y-6">
          
          {/* Post Caption input */}
          <div className="bg-[#121017] border border-neutral-900 rounded-xl p-4">
            <label className="block font-mono text-[9px] uppercase tracking-wider text-[#958da1] mb-2 font-semibold">
              生活感悟與敘述
            </label>
            <textarea
              className="w-full bg-[#0b090e] border border-neutral-805 rounded-lg p-3 text-xs text-white placeholder-[#5d5966] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/20 min-h-[100px] leading-relaxed resize-none"
              placeholder="記錄這份生活的美好吧！今天發生了什麼有趣、療癒的事呢？可以用簡易的文字配上照片/影片分享話題..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* Visibility Switch */}
          <div className="bg-[#121017] border border-neutral-900 rounded-xl p-4">
            <label className="block font-mono text-[9px] uppercase tracking-wider text-[#958da1] mb-2.5 font-semibold">
              Visibility設定 (公開 / 非公開)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`py-2 px-3 border rounded text-xs transition-all duration-300 text-center flex items-center justify-center gap-1.5 ${
                  !isPrivate
                    ? 'border-[#7c3aed] bg-[#7c3aed]/10 text-[#7c3aed] font-bold shadow-[0_0_12px_rgba(124,58,237,0.15)]'
                    : 'border-neutral-800 bg-[#0e0e0e] text-[#8e9192] hover:border-neutral-700 hover:text-white'
                }`}
              >
                🌐 公開 (Public)
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`py-2 px-3 border rounded text-xs transition-all duration-300 text-center flex items-center justify-center gap-1.5 ${
                  isPrivate
                    ? 'border-[#7c3aed] bg-[#7c3aed]/10 text-[#7c3aed] font-bold shadow-[0_0_12px_rgba(124,58,237,0.15)]'
                    : 'border-neutral-800 bg-[#0e0e0e] text-[#8e9192] hover:border-neutral-700 hover:text-white'
                }`}
              >
                🔒 非公開 (Private)
              </button>
            </div>
          </div>

          {/* Selectable Curated Presets Panel */}
          <div className="bg-[#121017] border border-neutral-900 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Image size={13} className="text-[#c8c6c6]" />
              <label className="block font-mono text-[9px] uppercase tracking-wider text-[#958da1] font-semibold">
                生活影片與照片預設
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {PRESET_ARTWORKS.map((art) => {
                const isSelected = selectedAsset.id === art.id;
                return (
                  <div
                    key={art.id}
                    onClick={() => {
                      setSelectedAsset(art);
                      // Pull relevant tags from preset
                      setActiveTags(art.tags);
                    }}
                    className={`aspect-video rounded-lg overflow-hidden cursor-pointer relative transition-all duration-350 bg-neutral-950 ${
                      isSelected 
                        ? 'ring-2 ring-[#7c3aed] ring-offset-2 ring-offset-[#0b0a0f] scale-[0.98]' 
                        : 'opacity-70 hover:opacity-100 hover:scale-[0.99]'
                    }`}
                  >
                    {art.type === 'video' ? (
                      <video src={art.url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                    ) : (
                      <img src={art.url} alt={art.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    )}
                    
                    {/* Selected state icon */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white flex items-center justify-center border border-white/20">
                          <Check size={12} className="stroke-[3px]" />
                        </span>
                      </div>
                    )}
                    
                    <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md border border-white/10 px-1 py-0.5 rounded text-[7px] font-mono uppercase tracking-wider text-neutral-300">
                      {art.type === 'video' ? '📺 VIDEO' : '🖼️ PHOTO'}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
                      <span className="block font-mono text-[8px] text-white/90 truncate capitalize">
                        {art.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tag Interactive Choices */}
          <div className="bg-[#121017] border border-neutral-900 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Tag size={13} className="text-[#c8c6c6]" />
              <label className="block font-mono text-[9px] uppercase tracking-wider text-[#958da1] font-semibold">
                參與話題與分類標籤
              </label>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tagOptions.map((tag) => {
                const isSelected = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`py-1 px-3 rounded text-[10px] font-mono transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#7c3aed] text-white border border-transparent shadow-[0_0_8px_rgba(124,58,237,0.3)]'
                        : 'bg-[#0b090e] text-[#ccc3d8] border border-neutral-805 hover:border-neutral-700'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary actions matches //button[contains(., 'Upload')] */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!content.trim()}
              className="w-full py-3 bg-[#7c3aed] hover:bg-[#682ccd] text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition duration-300 disabled:bg-[#121017] disabled:text-neutral-500 disabled:border-transparent cursor-pointer shadow-[0_0_24px_rgba(124,58,237,0.15)]"
            >
              發表這篇生活日常
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
