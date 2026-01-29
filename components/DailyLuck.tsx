
import React, { useMemo } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { ZODIACS } from '../constants';
import { GlobalTranslation } from '../App';
import { VinaLuckEngine } from '../utils/VinaLuckEngine';

interface DailyLuckProps {
    onZodiacSelect: (zodiacId: string, year?: number) => void;
    t: GlobalTranslation;
    onShopeeClick: () => void;
}

const PROMO_TEXT = {
    vn: "Xem tử vi hôm nay để nhận con số may mắn!",
    en: "Check your daily fortune to get lucky numbers!",
    kr: "오늘의 운세를 보고 행운의 번호를 받아보세요!"
};

const DailyLuck: React.FC<DailyLuckProps> = ({ onZodiacSelect, t }) => {
    
    // Generate years 1950 - 2026
    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 77 }, (_, i) => currentYear - i);
    }, []);

    // Determine Language based on translation prop content
    const lang = t.nav.home === 'Trang Chủ' ? 'vn' : t.nav.home === '홈' ? 'kr' : 'en';

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedYear = parseInt(e.target.value);
        if (!isNaN(selectedYear)) {
            // 1. Calculate Zodiac from Year
            const zodiacId = VinaLuckEngine.getZodiacFromYear(selectedYear);
            
            // 2. Immediate Trigger: Open modal with calculated ID and Year
            onZodiacSelect(zodiacId, selectedYear);
        }
    };

    const handleIconClick = (id: string) => {
        // Immediate Trigger: Open modal with ID (Year is null/generic)
        onZodiacSelect(id, undefined);
    };

    return (
        <section className="bg-card-light rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Sparkles className="text-accent" size={18} fill="currentColor" />
                    <h3 className="text-xs font-bold font-heading text-gray-800 uppercase tracking-wide">{t.home.luck.title}</h3>
                </div>
                <button className="text-[10px] font-bold text-primary bg-primary/5 hover:bg-primary/10 transition px-2 py-1 rounded-md">{t.home.luck.save}</button>
            </div>
            
            {/* Year Selector */}
            <div className="relative">
                <select 
                    onChange={handleYearChange}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3 pl-4 pr-10 appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 cursor-pointer outline-none font-medium transition-all hover:bg-white"
                >
                    <option value="">
                        {t === undefined ? 'Select Birth Year' : // Fallback
                         (t as any).home?.luck?.selectYear || 'Select Birth Year'} {/* Dynamic Trans or Fallback */}
                    </option>
                    {years.map(year => (
                         <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>

            {/* 4x3 GRID Layout for Quick Access */}
            <div className="grid grid-cols-4 gap-x-2 gap-y-6 pt-2 pb-2">
                {ZODIACS.map((animal) => (
                    <div 
                        key={animal.id} 
                        onClick={() => handleIconClick(animal.id)}
                        className="flex flex-col items-center gap-2 cursor-pointer group active:scale-95 transition-transform"
                    >
                        {/* 
                           UPDATED CONTAINER STYLES:
                           - w-20 h-20: Increased size (approx 80px)
                           - p-0: Removed padding so image fills to edge
                           - overflow-hidden: Ensures circular mask
                        */}
                        <div className={`w-20 h-20 rounded-full ${animal.id === 'monkey' ? 'bg-yellow-50 border-yellow-100' : 'bg-white border-gray-100'} border-2 group-hover:border-primary/50 group-hover:shadow-md transition-all flex items-center justify-center p-0 overflow-hidden`}>
                            {animal.image ? (
                                <img 
                                    alt={animal.name} 
                                    className="w-full h-full object-cover" 
                                    src={animal.image} 
                                />
                            ) : (
                                <div className="text-2xl">{animal.emoji}</div>
                            )}
                        </div>
                        <span className="text-[10px] font-bold text-gray-700 group-hover:text-primary transition-colors">
                             {t.zodiac[animal.id as keyof typeof t.zodiac]}
                        </span>
                    </div>
                ))}
            </div>

            {/* Promo Banner Text (Replaces Shopee/Lucky Item Section) */}
            <div className="mt-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-center gap-2">
                <Sparkles size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-gray-600 text-center leading-tight">
                    {PROMO_TEXT[lang]}
                </span>
            </div>
        </section>
    );
};

export default DailyLuck;
