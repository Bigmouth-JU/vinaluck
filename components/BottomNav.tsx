import React from 'react';
import { LayoutGrid, Cloud, Menu, Bot, Wand2 } from 'lucide-react';
import { GlobalTranslation } from '../contexts/LanguageContext';

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
        <nav className="absolute bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            {/* 5-Column Grid ensuring equal width for all items */}
            <div className="grid grid-cols-5 h-[60px] items-end pb-2 relative">
                
                {/* 1. Home */}
                <button 
                    onClick={() => onTabChange('home')}
                    className={`flex flex-col items-center justify-end gap-1 transition-colors group h-full pb-1 ${getTabClass('home')}`}
                >
                    <LayoutGrid size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold leading-none">{t.nav.home}</span>
                </button>

                {/* 2. Fortune */}
                <button 
                    onClick={() => onTabChange('fortune')}
                    className={`flex flex-col items-center justify-end gap-1 transition-colors group h-full pb-1 ${getTabClass('fortune')}`}
                >
                    <Wand2 size={24} strokeWidth={activeTab === 'fortune' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold leading-none">{t.nav.fortune}</span>
                </button>
                
                {/* 3. Center Label (Button is absolute floating above) */}
                <div className="flex flex-col items-center justify-end pb-1 h-full cursor-pointer group" onClick={onAiPickClick}>
                     {/* Spacer for the button */}
                     <div className="h-6 w-6 mb-1"></div> 
                     <span className="text-[10px] font-bold text-red-600 mt-1 leading-none text-center px-0.5 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                         AI PICK
                     </span>
                </div>
                
                {/* 4. Dream */}
                <button 
                    onClick={() => onTabChange('dream')}
                    className={`flex flex-col items-center justify-end gap-1 transition-colors group h-full pb-1 ${getTabClass('dream')}`}
                >
                    <Cloud size={24} strokeWidth={activeTab === 'dream' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold leading-none">{t.nav.dream}</span>
                </button>

                {/* 5. Menu */}
                <button 
                    onClick={() => onTabChange('menu')}
                    className={`flex flex-col items-center justify-end gap-1 transition-colors group h-full pb-1 ${getTabClass('menu')}`}
                >
                    <Menu size={24} strokeWidth={activeTab === 'menu' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold leading-none">{t.nav.menu}</span>
                </button>
            </div>

            {/* Absolute Floating Button - Positioned independently */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-50">
                <button 
                    onClick={onAiPickClick}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-t from-[#b01e17] to-primary shadow-[0_8px_20px_rgba(218,37,29,0.3)] border-[4px] border-white cursor-pointer hover:scale-105 transition-transform group relative active:scale-95"
                >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
                    <Bot size={28} className="text-white drop-shadow-sm group-hover:rotate-12 transition-transform" />
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;