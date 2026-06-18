import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatSession, Message, Screen, TransitionType } from '../types';
import NavigationBar from './NavigationBar';
import { 
  Send, 
  ArrowLeft, 
  Phone, 
  Video, 
  Info, 
  Search, 
  CheckCheck, 
  Plus, 
  Smile, 
  Image,
  Mic, 
  MoreVertical,
  Circle
} from 'lucide-react';
import { BOT_RESPONSES } from '../data';

interface ChatScreenProps {
  conversations: ChatSession[];
  onNavigate: (screen: Screen, transition: TransitionType) => void;
  onSendMessage: (chatId: string, text: string) => void;
  onReceiveReply: (chatId: string, replyText: string) => void;
}

export default function ChatScreen({
  conversations,
  onNavigate,
  onSendMessage,
  onReceiveReply,
}: ChatScreenProps) {
  const [selectedChatId, setSelectedChatId] = useState<string>(conversations[0]?.id || '');
  const [isViewingChat, setIsViewingChat] = useState<boolean>(false);
  const [typedMessage, setTypedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeChat = conversations.find(c => c.id === selectedChatId) || conversations[0];

  // Auto scroll message list
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat?.messages, isTyping, isViewingChat]);

  const handleSend = () => {
    if (!typedMessage.trim() || !activeChat) return;
    
    const text = typedMessage;
    onSendMessage(activeChat.id, text);
    setTypedMessage('');

    // Trigger typing simulator for assistant bot
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      // Select appropriate bot response based on keywords
      const lowercaseText = text.toLowerCase();
      let replyArray = BOT_RESPONSES.default;
      
      if (lowercaseText.includes('travel') || lowercaseText.includes('旅行') || lowercaseText.includes('玩') || lowercaseText.includes('景點')) {
        replyArray = BOT_RESPONSES.travel;
      } else if (lowercaseText.includes('food') || lowercaseText.includes('美食') || lowercaseText.includes('吃') || lowercaseText.includes('甜點') || lowercaseText.includes('料理')) {
        replyArray = BOT_RESPONSES.food;
      } else if (lowercaseText.includes('coffee') || lowercaseText.includes('咖啡') || lowercaseText.includes('手沖') || lowercaseText.includes('烘焙')) {
        replyArray = BOT_RESPONSES.coffee;
      }

      const randomReply = replyArray[Math.floor(Math.random() * replyArray.length)];
      onReceiveReply(activeChat.id, randomReply);
    }, 1200);
  };

  // Filter conversations based on query
  const filteredConversations = conversations.filter(chat => 
    chat.partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.partner.discipline?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-[844px] flex flex-col bg-[#07060b] text-[#e8dfee] font-sans relative overflow-hidden">
      
      <AnimatePresence mode="wait">
        {!isViewingChat ? (
          /* INBOX VIEW - LIST OF CHATS */
          <motion.div 
            key="inbox"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <header className="shrink-0 pt-10 pb-4 bg-[#07060b]/95 backdrop-blur-xl border-b border-purple-950/10 px-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#958da1]">我的聊天集</span>
                  <h1 className="text-2xl font-bold tracking-tight text-white">收件匣</h1>
                </div>
              </div>

              {/* High-fidelity Messenger Search Bar */}
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-2.5 text-[#5d5966]" size={14} />
                <input 
                  type="text"
                  placeholder="搜尋聯絡人或對話..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#121118] border border-neutral-900 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#7c3aed] placeholder:text-[#5d5966] transition-all"
                />
              </div>
            </header>

            {/* Stories / Active online bubbles */}
            <div className="shrink-0 px-4 py-3 border-b border-purple-950/5 bg-[#0a090e]/50 overflow-x-auto scrollbar-none flex gap-4">
              {conversations.map((chat) => (
                <div 
                  key={`online-${chat.id}`}
                  onClick={() => {
                    setSelectedChatId(chat.id);
                    setIsViewingChat(true);
                  }}
                  className="flex flex-col items-center gap-1 cursor-pointer min-w-[64px]"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full p-[2px] border-2 border-[#7c3aed] bg-neutral-900 overflow-hidden">
                      <img 
                        src={chat.partner.avatar} 
                        alt="" 
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {chat.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#07060b]" />
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-400 font-medium truncate w-14 text-center">
                    {chat.partner.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto pb-24 px-4 pt-2 space-y-2">
              <div className="text-[9px] font-mono uppercase tracking-widest text-[#958da1] mb-2 px-1">
                最近的對話
              </div>
              
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12 text-xs text-neutral-500 font-mono">
                  探索不到相符的對話記錄。
                </div>
              ) : (
                filteredConversations.map((chat) => {
                  const isSelected = chat.id === selectedChatId;
                  const lastMessage = chat.messages[chat.messages.length - 1];
                  
                  return (
                    <div
                      key={chat.id}
                      onClick={() => {
                        setSelectedChatId(chat.id);
                        setIsViewingChat(true);
                      }}
                      className="p-3.5 rounded-xl border border-neutral-900/40 bg-[#0c0a11] hover:bg-[#13101c] cursor-pointer transition-all duration-200 relative flex items-center gap-3.5 group"
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <img 
                          src={chat.partner.avatar} 
                          alt="" 
                          className="w-11 h-11 rounded-full object-cover transition-transform group-hover:scale-105 duration-300"
                          referrerPolicy="no-referrer"
                        />
                        {chat.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0c0a11]" />
                        )}
                      </div>

                      {/* Info & Last Message */}
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-xs font-bold text-white transition-colors group-hover:text-[#7c3aed] truncate">
                            {chat.partner.name}
                          </h3>
                          <span className="font-mono text-[9px] text-[#5d5966]">
                            {lastMessage ? lastMessage.timestamp : ''}
                          </span>
                        </div>
                        <p className={`text-[11px] truncate leading-normal ${chat.unread ? 'text-white font-semibold' : 'text-[#8c8599]'}`}>
                          {lastMessage ? lastMessage.text : 'Start dialogue...'}
                        </p>
                      </div>

                      {/* Unread dot or discipline tag */}
                      <div className="absolute right-4 bottom-4">
                        {chat.unread ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] block shadow-[0_0_8px_rgba(124,58,237,0.6)]" />
                        ) : (
                          <span className="font-mono text-[8px] bg-[#171420] text-purple-400 px-1.5 py-0.5 rounded border border-[#7c3aed]/10">
                            {chat.partner.discipline}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        ) : (
          /* ACTIVE CHAT WORKSPACE VIEW */
          <motion.div 
            key="chat-room"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {/* Thread Header */}
            <div className="shrink-0 pt-10 pb-3 bg-[#0a090e] border-b border-neutral-900 px-4 flex items-center justify-between z-10 shadow-lg">
              <div className="flex items-center gap-3">
                {/* Back button */}
                <button 
                  onClick={() => setIsViewingChat(false)}
                  className="p-1 px-2 rounded-lg bg-[#14121a] hover:bg-[#1d1a26] text-neutral-300 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} />
                </button>

                {/* Partner Details */}
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img 
                      src={activeChat.partner.avatar} 
                      alt="partner" 
                      className="w-9 h-9 rounded-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                    {activeChat.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-[#0a090e]" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-white tracking-tight">{activeChat.partner.name}</h2>
                    <span className="font-mono text-[8px] text-[#7c3aed] flex items-center gap-1 font-semibold uppercase">
                      {activeChat.partner.discipline}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action utilities (e.g., Phone & Video elements to mimic realistic social network app) */}
              <div className="flex items-center gap-1">
                <button className="p-2 text-neutral-400 hover:text-white transition rounded-full hover:bg-neutral-900">
                  <Phone size={14} />
                </button>
                <button className="p-2 text-neutral-400 hover:text-white transition rounded-full hover:bg-neutral-900">
                  <Video size={14} />
                </button>
                <button className="p-2 text-neutral-400 hover:text-[#7c3aed] transition rounded-full hover:bg-neutral-900">
                  <Info size={14} />
                </button>
              </div>
            </div>

            {/* Message Feed Canvas */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#07060b] scrollbar-none"
            >
              {activeChat.messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div 
                    key={m.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-[1.25rem] px-4 py-2.5 text-xs selection:bg-purple-900 ${
                        isUser 
                          ? 'bg-[#7c3aed] text-white rounded-tr-sm font-medium shadow-[0_4px_16px_rgba(124,58,237,0.25)]' 
                          : 'bg-[#14121a] text-neutral-200 rounded-tl-sm border border-neutral-900'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-line font-medium">{m.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                        <span className="text-[7.5px] font-mono text-white/70">{m.timestamp}</span>
                        {isUser && <CheckCheck size={9} className="text-white/80" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Animated Typing Feedback indicator matching standard social chats */}
              {isTyping && (
                <div className="flex justify-start items-center gap-2">
                  <img 
                    src={activeChat.partner.avatar} 
                    alt="" 
                    className="w-6 h-6 rounded-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="bg-[#14121a] text-neutral-300 rounded-[1.25rem] rounded-tl-sm px-4 py-2 text-xs border border-neutral-900">
                    <div className="flex items-center gap-1.5 py-0.5">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider mr-1">Design response...</span>
                      <span className="h-1.5 w-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                      <span className="h-1.5 w-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="h-1.5 w-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Composer Panel */}
            <div className="p-3 bg-[#0a090e] border-t border-neutral-900 flex gap-2 items-center">
              {/* Accessory quick features inside composer */}
              <button className="p-1.5 text-neutral-500 hover:text-white transition">
                <Plus size={16} />
              </button>
              <button className="p-1.5 text-neutral-500 hover:text-white transition">
                <Image size={16} />
              </button>
              
              <div className="flex-1 bg-[#121118] border border-neutral-850 focus-within:border-[#7c3aed] rounded-full px-3.5 py-1.5 flex items-center gap-1 transition-all">
                <input 
                  type="text"
                  placeholder={`Message ${activeChat.partner.name.split(' ')[0]}...`}
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder:text-[#5d5966]"
                />
                <button className="text-neutral-500 hover:text-[#7c3aed] transition px-1">
                  <Smile size={16} />
                </button>
              </div>

              <button 
                onClick={handleSend}
                disabled={!typedMessage.trim()}
                className={`${
                  typedMessage.trim() ? 'bg-[#7c3aed] text-white hover:bg-[#682ccd]' : 'bg-neutral-900 text-neutral-600'
                } w-8.5 h-8.5 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0`}
              >
                <Send size={12} className="ml-[1px]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav bar for Chat screen (strictly "灰階加色版" using lowercase data-icon xpath matching) */}
      <NavigationBar currentScreen="CHAT" onNavigate={onNavigate} isColored={true} />
    </div>
  );
}
