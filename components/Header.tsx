import React from 'react';
import { Star } from 'lucide-react';

export type Language = 'vn' | 'en' | 'kr';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    currentLang: Language;
    onLangChange: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    title = "VinaLuck", 
    subtitle = "Today's Fortune",
    currentLang,
    onLangChange
}) => {
    
    const getButtonClass = (lang: Language) => {
        const isActive = currentLang === lang;
        return isActive 
            ? "px-2 py-1 rounded text-[10px] font-bold text-white bg-primary shadow-sm transition-all" 
            : "px-2 py-1 rounded text-[10px] font-bold text-gray-500 hover:bg-white transition-all";
    };

    return (
        <header className="sticky top-0 z-40 bg-background-light/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between transition-colors shrink-0 min-h-[70px]">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <Star size={20} fill="currentColor" />
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-primary font-extrabold font-heading text-2xl leading-none tracking-tight">
                        {title}
                    </h1>
                    <p className="text-gray-500 text-sm font-medium leading-none mt-1">
                        {subtitle}
                    </p>
                </div>
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200 gap-0.5 self-center">
                <button onClick={() => onLangChange('kr')} className={getButtonClass('kr')}>KR</button>
                <button onClick={() => onLangChange('vn')} className={getButtonClass('vn')}>VN</button>
                <button onClick={() => onLangChange('en')} className={getButtonClass('en')}>EN</button>
            </div>
        </header>
    );
};

export default Header;