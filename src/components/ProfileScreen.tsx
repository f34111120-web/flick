import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Post, Screen, TransitionType } from '../types';
import NavigationBar from './NavigationBar';
import { Edit2, Save, Sparkles, FolderOpen, Heart, Bookmark, Settings, Check } from 'lucide-react';

interface ProfileScreenProps {
  currentUser: { name: string; username: string; email: string; discipline: string };
  onUpdateUser: (userData: { name: string; username: string; email: string; discipline: string }) => void;
  posts: Post[];
  onNavigate: (screen: Screen, transition: TransitionType) => void;
}

export default function ProfileScreen({
  currentUser,
  onUpdateUser,
  posts,
  onNavigate,
}: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'public' | 'private'>('public');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentUser.name);
  const [editedBio, setEditedBio] = useState('分享日常生活與旅行點滴，記錄每一個溫暖細微的瞬間 ✨');
  const [editedDiscipline, setEditedDiscipline] = useState(currentUser.discipline);

  const disciplines = ['生活紀錄者', '旅遊 Vlogger', '美食探店', '日常隨筆'];

  // User posts, split to public and private
  const userPosts = posts.filter(p => p.creator.username === currentUser.username || p.creator.name === currentUser.name);
  const publicPosts = userPosts.filter(p => !p.isPrivate);
  const privatePosts = userPosts.filter(p => p.isPrivate);

  const tabContent = {
    public: publicPosts,
    private: privatePosts
  };

  const handleUpdate = () => {
    onUpdateUser({
      ...currentUser,
      name: editedName,
      discipline: editedDiscipline
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full h-[844px] flex flex-col bg-[#0b0a0f] text-[#e8dfee] font-sans relative overflow-hidden">
      
      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-24">
        {/* Decorative profile background header banner */}
        <div className="h-44 bg-gradient-to-r from-neutral-900 via-[#1d1a24] to-neutral-900 border-b border-purple-950/15 relative pt-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px]" />
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleUpdate}
              className="bg-[#7c3aed] text-white py-1.5 px-4 rounded-full text-xs font-bold hover:bg-[#682ccd] flex items-center gap-1.5 shadow-[0_0_12px_rgba(124,58,237,0.3)] transition"
            >
              <Check size={12} /> Save Edits
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#16161e]/80 backdrop-blur border border-purple-500/20 text-[#ccc3d8] py-1.5 px-4 rounded-full text-xs font-bold hover:text-white hover:bg-[#16161e] flex items-center gap-1.5 transition"
            >
              <Edit2 size={12} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <main className="max-w-xl mx-auto px-4 -mt-16 relative z-10">
        
        {/* Core User Details Card */}
        <div className="bg-[#121017] border border-neutral-900/60 p-5 rounded-2xl mb-6 shadow-xl relative">
          <div className="flex gap-4 items-end mb-4">
            {/* Circular Avatar featuring violet outline circle glow */}
            <div className="w-24 h-24 rounded-full border-2 border-[#7c3aed] bg-neutral-900 p-0.5 shadow-[0_0_16px_rgba(124,58,237,0.25)] overflow-hidden shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" 
                alt="Profile Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-2 mb-1">
                  <input 
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full bg-[#0a090e] border border-neutral-800 rounded px-2.5 py-1 text-sm text-white focus:outline-none focus:border-[#7c3aed]"
                    placeholder="Full Name"
                  />
                  <select
                    value={editedDiscipline}
                    onChange={(e) => setEditedDiscipline(e.target.value)}
                    className="w-full bg-[#0a090e] border border-neutral-800 rounded px-2 py-1 text-xs text-stone-300 focus:outline-none focus:border-[#7c3aed]"
                  >
                    {disciplines.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <h1 className="text-lg font-extrabold text-white tracking-tight truncate flex items-center gap-1.5">
                    {currentUser.name}
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]"></span>
                  </h1>
                  <p className="font-mono text-[10px] text-neutral-500 font-semibold">{currentUser.username}</p>
                </>
              )}
            </div>
          </div>

          {/* User Bio Narrative */}
          {isEditing ? (
            <textarea
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              className="w-full bg-[#0a090e] border border-neutral-800 rounded p-2 text-xs text-neutral-300 focus:outline-none focus:border-[#7c3aed] min-h-[60px]"
              placeholder="介紹一下你自己，分享你的日常與興趣吧..."
            />
          ) : (
            <p className="text-xs text-neutral-400 leading-relaxed tracking-wide font-normal mb-4">
              {editedBio}
            </p>
          )}

          {/* Followers / Following Stats Block */}
          <div className="grid grid-cols-3 gap-2 border-t border-neutral-900/60 pt-4 text-center">
            <div className="p-2 rounded bg-neutral-950/20">
              <span className="block text-sm font-bold text-white">{userPosts.length}</span>
              <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-wider font-semibold">貼文</span>
            </div>
            <div className="p-2 rounded bg-neutral-950/20">
              <span className="block text-sm font-bold text-white">2.4k</span>
              <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-wider font-semibold">粉絲</span>
            </div>
            <div className="p-2 rounded bg-neutral-950/20">
              <span className="block text-sm font-bold text-white">412</span>
              <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-wider font-semibold">追蹤中</span>
            </div>
          </div>
        </div>

        {/* Profile Tabs Navigation (Public vs Private) with active colored indicator */}
        <div className="flex border-b border-neutral-900 mb-4 bg-[#121017] p-1.5 rounded-lg border">
          {(['public', 'private'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const size = tabContent[tab].length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 px-3 rounded-md text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1d1a24] text-[#7c3aed] border border-purple-500/15'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {tab === 'public' ? (
                  <>
                    <FolderOpen size={12} />
                    <span>公開貼文</span>
                  </>
                ) : (
                  <>
                    <Settings size={12} />
                    <span>非公開貼文</span>
                  </>
                )}
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${isActive ? 'bg-[#7c3aed]/10 text-[#7c3aed]' : 'bg-neutral-950 text-neutral-600'}`}>
                  {size}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic List corresponding to selected catalog tab */}
        <div className="space-y-4">
          {tabContent[activeTab].length === 0 ? (
            <div className="text-center py-12 bg-[#121017]/50 rounded-xl border border-neutral-900/60 p-6">
              <p className="text-xs text-neutral-500 font-mono">
                目前尚無{activeTab === 'public' ? '公開' : '非公開'}貼文。
              </p>
              <button 
                onClick={() => onNavigate('POST', 'none')} 
                className="mt-3.5 text-[10px] uppercase tracking-wider font-mono text-[#7c3aed]"
              >
                立即發表貼文
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              {tabContent[activeTab].map((post) => (
                <div
                  key={post.id}
                  onClick={() => onNavigate('HOME', 'none')}
                  className="bg-[#121017] rounded-lg overflow-hidden border border-neutral-900 cursor-pointer relative group hover:border-[#7c3aed]/30 hover:scale-[1.01] transition-all duration-300"
                >
                  {post.image ? (
                    <div className="aspect-video bg-neutral-950">
                      <img src={post.image} alt="Upload image" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                  ) : post.video ? (
                    <div className="aspect-video bg-neutral-950 relative overflow-hidden">
                      <video src={post.video} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" muted loop playsInline autoPlay />
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-[7.5px] text-[#7c3aed] font-bold px-1.5 py-0.5 rounded font-mono uppercase">VIDEO</div>
                    </div>
                  ) : (
                    <div className="p-3 bg-neutral-950 aspect-video flex items-center justify-center">
                      <p className="text-[9px] text-neutral-400 line-clamp-3">{post.content}</p>
                    </div>
                  )}
                  <div className="p-2.5 flex items-center justify-between text-[10px] font-mono border-t border-neutral-905/30 bg-[#121017]">
                    <span className="text-neutral-500 font-bold">♥ {post.likes}</span>
                    <span className="bg-neutral-850 px-1.5 py-0.5 rounded text-[8px] text-neutral-400 font-bold">
                      {post.tags[0] || 'Design'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      </div>

      {/* Nav bar for Profile screen (strictly "灰階加色版" matching exact navigation linkages) */}
      <NavigationBar currentScreen="PROFILE" onNavigate={onNavigate} isColored={true} />
    </div>
  );
}
