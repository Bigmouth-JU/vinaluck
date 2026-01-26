import React from 'react';
import { LayoutGrid, Cloud, Menu, Bot, Wand2 } from 'lucide-react';
import { GlobalTranslation } from '../App';

interface BottomNavProps {
    onAiPickClick: () => void;
    activeTab: 'home' | 'fortune' | 'dream' | 'menu';
    onTabChange: (tab: 'home' | 'fortune' | 'dream' | 'menu') => void;
    t: GlobalTranslation;
}

const BottomNav: React.FC<BottomNavProps> = ({ onAiPickClick, activeTab, onTabChange, t }) => {
    const getTabClass = (tabName: string) => {
        return activeTab === tabName 
            ? "text-primary" 
            : "text-gray-400 hover:text-gray-600";
    };

    return (
        <nav className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-2 z-30">
            {/* 5-Column Grid ensuring equal width for all items */}
            <div className="grid grid-cols-5 h-[64px] items-end pb-1.5">
                
                {/* 1. Home */}
                <button 
                    onClick={() => onTabChange('home')}
                    className={`flex flex-col items-center justify-end pb-1 gap-0.5 transition-colors group ${getTabClass('home')}`}
                >
                    <LayoutGrid size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} className="mb-0.5" />
                    <span className="text-[10px] font-bold leading-none">{t.nav.home}</span>
                </button>

                {/* 2. Fortune */}
                <button 
                    onClick={() => onTabChange('fortune')}
                    className={`flex flex-col items-center justify-end pb-1 gap-0.5 transition-colors group ${getTabClass('fortune')}`}
                >
                    <Wand2 size={22} strokeWidth={activeTab === 'fortune' ? 2.5 : 2} className="mb-0.5" />
                    <span className="text-[10px] font-bold leading-none">{t.nav.fortune}</span>
                </button>
                
                {/* 3. Center Label (Button is absolute) */}
                <div className="flex flex-col items-center justify-end pb-1 cursor-pointer" onClick={onAiPickClick}>
                     {/* Transparent placeholder to keep layout height, though absolute button sits on top */}
                     <div className="h-6 w-6 mb-0.5"></div> 
                     <span className="text-[10px] font-bold text-primary leading-none text-center px-0.5 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                         {t.nav.aipick}
                     </span>
                </div>
                
                {/* 4. Dream */}
                <button 
                    onClick={() => onTabChange('dream')}
                    className={`flex flex-col items-center justify-end pb-1 gap-0.5 transition-colors group ${getTabClass('dream')}`}
                >
                    <Cloud size={22} strokeWidth={activeTab === 'dream' ? 2.5 : 2} className="mb-0.5" />
                    <span className="text-[10px] font-bold leading-none">{t.nav.dream}</span>
                </button>

                {/* 5. Menu */}
                <button 
                    onClick={() => onTabChange('menu')}
                    className={`flex flex-col items-center justify-end pb-1 gap-0.5 transition-colors group ${getTabClass('menu')}`}
                >
                    <Menu size={22} strokeWidth={activeTab === 'menu' ? 2.5 : 2} className="mb-0.5" />
                    <span className="text-[10px] font-bold leading-none">{t.nav.menu}</span>
                </button>
            </div>

            {/* Absolute Floating Button - Positioned independently from text to ensure visual pop */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-40 pointer-events-none">
                <button 
                    onClick={onAiPickClick}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-t from-[#b01e17] to-primary shadow-[0_8px_20px_rgba(218,37,29,0.4)] border-[3px] border-white cursor-pointer hover:scale-105 transition-transform group relative pointer-events-auto"
                >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
                    <Bot size={28} className="text-white drop-shadow-sm group-hover:rotate-12 transition-transform" />
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;