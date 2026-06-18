import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, TransitionType, Post, ChatSession, Creator } from './types';
import {
  fetchPosts,
  fetchConversations,
  insertPost,
  setPostLikes,
  addComment,
  insertMessage,
  setChatUnread,
} from './lib/supabase';

// Import Screens
import SignupScreen from './components/SignupScreen';
import HomeScreen from './components/HomeScreen';
import SearchScreen from './components/SearchScreen';
import ChatScreen from './components/ChatScreen';
import ProfileScreen from './components/ProfileScreen';
import PostScreen from './components/PostScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('SIGNUP');
  const [transitionType, setTransitionType] = useState<TransitionType>('none');
  
  const [timeStr, setTimeStr] = useState('12:00');
  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);
  
  // Current logged in user state
  const [currentUser, setCurrentUser] = useState({
    name: 'Jane Doe',
    username: '@jane_design',
    email: 'jane@studio.design',
    discipline: 'Visual Coder',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
  });

  // Global posts list (allows appending/liking/saving)
  const [posts, setPosts] = useState<Post[]>([]);

  // Global conversation sessions list (allows real-time messaging)
  const [conversations, setConversations] = useState<ChatSession[]>([]);

  // 初次掛載時從 Supabase 載入（沒設 key 時 lib 會自動 fallback 回 data.ts 假資料）
  React.useEffect(() => {
    fetchPosts().then(setPosts);
    fetchConversations().then(setConversations);
  }, []);

  // Router dispatcher
  const handleNavigate = (screen: Screen, transition: TransitionType) => {
    setTransitionType(transition);
    setCurrentScreen(screen);
  };

  // On Register signup details
  const handleSignUp = (userData: { name: string; username: string; email: string; discipline: string }) => {
    setCurrentUser({
      ...currentUser,
      ...userData
    });
    // SIGNUP pushes to HOME screen
    handleNavigate('HOME', 'push');
  };

  const handleUpdateUser = (userData: { name: string; username: string; email: string; discipline: string }) => {
    setCurrentUser({
      ...currentUser,
      ...userData
    });
  };

  // Like action toggle
  const handleLikePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          const likes = isLiked ? post.likes + 1 : post.likes - 1;
          setPostLikes(postId, likes); // 持久化按讚數（isLiked 本身因無 Auth 留前端）
          return {
            ...post,
            isLiked,
            likes
          };
        }
        return post;
      })
    );
  };

  // Save action toggle
  const handleSavePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isSaved: !post.isSaved
          };
        }
        return post;
      })
    );
  };

  // Add Comment increment action
  const handleAddComment = (postId: string, commentText: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const commentsCount = post.commentsCount + 1;
          addComment(postId, commentText, commentsCount); // 寫入留言 + 更新計數
          return {
            ...post,
            commentsCount
          };
        }
        return post;
      })
    );
  };

  // Upload new post action
  const handleAddPost = (postData: { content: string; tags: string[]; image?: string; video?: string; isPrivate?: boolean }) => {
    const activeCreative: Creator = {
      name: currentUser.name,
      username: currentUser.username,
      avatar: currentUser.avatar,
      discipline: currentUser.discipline
    };

    const newPost: Post = {
      id: `custom-post-${Date.now()}`,
      creator: activeCreative,
      image: postData.image || undefined,
      video: postData.video || undefined,
      content: postData.content,
      tags: postData.tags,
      likes: 0,
      commentsCount: 0,
      timestamp: 'Just now',
      isLiked: false,
      isSaved: false,
      isPrivate: postData.isPrivate || false
    };

    setPosts([newPost, ...posts]);
    insertPost(newPost); // 寫入 Supabase
    // POST returns back to HOME screen
    handleNavigate('HOME', 'push_back');
  };

  // Send message action
  const handleSendMessage = (chatId: string, text: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      text,
      timestamp: 'Just now'
    };

    setConversations(prevChats => 
      prevChats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage]
          };
        }
        return chat;
      })
    );
    insertMessage(chatId, newMessage); // 寫入 Supabase
  };

  // Receive bot auto-reply action
  const handleReceiveReply = (chatId: string, replyText: string) => {
    const replyMessage = {
      id: `msg-${Date.now()}`,
      sender: 'other' as const,
      text: replyText,
      timestamp: 'Just now'
    };

    setConversations(prevChats => 
      prevChats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            unread: true,
            messages: [...chat.messages, replyMessage]
          };
        }
        return chat;
      })
    );
    insertMessage(chatId, replyMessage); // 寫入 Supabase
    setChatUnread(chatId, true);
  };

  // Retrieve current animation variants based on designated transition gesture
  const getVariants = () => {
    switch (transitionType) {
      case 'push':
        return {
          initial: { x: '100%', opacity: 1 },
          animate: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 180 } },
          exit: { x: '-100%', opacity: 0, transition: { duration: 0.25 } }
        };
      case 'push_back':
        return {
          initial: { x: '-100%', opacity: 1 },
          animate: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 180 } },
          exit: { x: '100%', opacity: 0, transition: { duration: 0.25 } }
        };
      case 'slide_up':
        return {
          initial: { y: '100%', opacity: 1 },
          animate: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 150 } },
          exit: { y: '100%', opacity: 0, transition: { duration: 0.25 } }
        };
      case 'slide_down':
        return {
          initial: { y: '-100%', opacity: 1 },
          animate: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 150 } },
          exit: { y: '100%', opacity: 0, transition: { duration: 0.25 } }
        };
      case 'none':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.15 } },
          exit: { opacity: 0, transition: { duration: 0.15 } }
        };
    }
  };

  // Render correct catalog view component matching active route
  const renderScreen = () => {
    switch (currentScreen) {
      case 'SIGNUP':
        return <SignupScreen onSignUp={handleSignUp} />;
      
      case 'HOME':
        return (
          <HomeScreen
            posts={posts}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onLikePost={handleLikePost}
            onSavePost={handleSavePost}
            onAddComment={handleAddComment}
          />
        );
      
      case 'SEARCH':
        return (
          <SearchScreen
            posts={posts}
            onNavigate={handleNavigate}
            onLikePost={handleLikePost}
          />
        );

      case 'CHAT':
        return (
          <ChatScreen
            conversations={conversations}
            onNavigate={handleNavigate}
            onSendMessage={handleSendMessage}
            onReceiveReply={handleReceiveReply}
          />
        );

      case 'PROFILE':
        return (
          <ProfileScreen
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
            posts={posts}
            onNavigate={handleNavigate}
          />
        );

      case 'POST':
        return (
          <PostScreen
            onAddPost={handleAddPost}
            onNavigate={handleNavigate}
          />
        );

      default:
        return <SignupScreen onSignUp={handleSignUp} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#e5e2e1] flex items-center justify-center p-4 md:p-8 overflow-y-auto selection:bg-[#7c3aed]/30 relative">
      {/* Dynamic atmospheric ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-950/5 blur-[120px] pointer-events-none" />

      {/* Editorial side info panel for desktop */}
      <div className="hidden lg:flex flex-col justify-between max-w-xs mr-12 text-[#8e9192] h-[844px] py-8 z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-mono tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-pulse" />
            FLICK INT LABS
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-sans mb-3">Flick</h2>
          <p className="text-xs leading-relaxed text-neutral-400 mb-6 font-normal">
            A high-fidelity spatial design social media prototype, demonstrating editorial transitions, vibrant color assets, and real-time social chat room ergonomics.
          </p>
          <div className="border-t border-neutral-800 pt-4 space-y-2">
            <div className="font-mono text-[9px] uppercase tracking-widest text-[#7c3aed] font-semibold">Active Space Guidelines:</div>
            <p className="text-[11px] text-neutral-400">
              - <span className="text-white">Media Exhibits</span> render in brilliant, vivid full color.
            </p>
            <p className="text-[11px] text-neutral-400">
              - <span className="text-white">Messenger & Discover</span> introduce the intuitive touch direct messaging and active story pulses.
            </p>
          </div>
        </div>
        <div className="font-mono text-[10px] space-y-1 text-neutral-600">
          <div>DEVICE PRESET: IPHONE 15 PRO</div>
          <div>EST: 2026 ACTIVE</div>
          <div>DESIGN: COHESIVE SYSTEM</div>
        </div>
      </div>

      {/* Main simulated phone container */}
      <div className="relative w-full max-w-[390px] h-[844px] bg-[#070707] rounded-[3.25rem] border-[12px] border-[#18181b] ring-1 ring-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col z-10">
        
        {/* Dynamic Island Pinhole Speaker notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-end px-3">
          <div className="w-1 h-1 rounded-full bg-[#0d0d0d] border border-[#111] shrink-0" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-950/40 border border-blue-900/40 shrink-0 ml-1.5" />
        </div>

        {/* Top Status Bar Info Row */}
        <div className="absolute top-0 left-0 right-0 h-9 px-6 pt-1.5 bg-transparent flex items-center justify-between text-[10.5px] font-mono text-neutral-300 font-semibold z-50 pointer-events-none select-none">
          <span>{timeStr}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[7.5px] tracking-tighter bg-neutral-850 px-1 py-0.5 rounded text-white font-bold scale-90">5G</span>
            <div className="w-5 h-2.5 border border-neutral-400 rounded-sm p-0.5 flex items-center">
              <div className="w-3.5 h-full bg-white rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Screen View with AnimatePresence */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              variants={getVariants()}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Home swipe indicator bar bottom line */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-600 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
}
