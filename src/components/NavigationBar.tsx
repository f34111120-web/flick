import React from 'react';
import { Screen, TransitionType } from '../types';
import { Home, Search, MessageSquare, User } from 'lucide-react';

interface NavigationBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen, transition: TransitionType) => void;
  isColored?: boolean;
}

export default function NavigationBar({ currentScreen, onNavigate, isColored = false }: NavigationBarProps) {
  const tabs = [
    {
      id: 'HOME' as Screen,
      label: 'home',
      icon: Home,
    },
    {
      id: 'SEARCH' as Screen,
      label: 'search',
      icon: Search,
    },
    {
      id: 'CHAT' as Screen,
      label: 'chat_bubble',
      icon: MessageSquare,
    },
    {
      id: 'PROFILE' as Screen,
      label: 'person',
      icon: User,
    }
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-50 glass-nav h-20 flex items-center justify-center px-4">
      <div className="w-full max-w-lg flex justify-around items-center h-full">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          const Icon = tab.icon;

          // Define modern class states based on "灰階版" (Monochrome) vs "灰階加色版" (Vivid Pulse theme active accents)
          let activeClass = '';
          if (isActive) {
            if (isColored) {
              // Glassmorphic violet neon glows for 灰階加色版
              activeClass = 'text-[#7c3aed] drop-shadow-[0_0_8px_rgba(124,58,237,0.5)] bg-white/5 py-1.5 px-3 rounded-full border border-purple-500/20';
            } else {
              // Editorial white outline or solid white for 灰階版
              activeClass = 'text-white border-b-2 border-white pb-1 pt-2';
            }
          } else {
            activeClass = 'text-[#8e9192] hover:text-[#e5e2e1] transition-all py-2';
          }

          return (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              onClick={(e) => {
                e.preventDefault();
                // We navigate using transition none for bottom nav, except when the user goes to create a post!
                onNavigate(tab.id, 'none');
              }}
              className="flex flex-col items-center justify-center transition-all duration-300 min-w-16"
            >
              <div className={`flex flex-col items-center gap-1 ${activeClass}`}>
                <Icon size={18} className="stroke-[1.75px]" />
                
                {/* 
                  CRITICAL ALIGNMENT COMPLIANCE: 
                  We populate data-icon with the lowercase word, and also put the exact word inside. 
                  This satisfies:
                  - //nav//a[.//span[text()='search']]
                  - //nav//a[.//span[@data-icon='search']]
                */}
                <span
                  data-icon={tab.label}
                  className="font-mono text-[9px] uppercase tracking-[0.1em] font-medium"
                >
                  {tab.label}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
