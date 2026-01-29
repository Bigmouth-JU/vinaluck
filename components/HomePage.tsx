
import React, { useState, useEffect } from 'react';
import { History, ChevronRight, User, Calendar, Bot, Target, Lock, Sparkles, MessageSquare } from 'lucide-react';
import UnifiedJackpotCarousel from './UnifiedJackpotCarousel';
import DreamDecoder from './DreamDecoder';
import DailyLuck from './DailyLuck';
import { GlobalTranslation, SavedTicket } from '../App';
import { VinaLuckEngine } from '../utils/VinaLuckEngine';
import { FateResult } from './FateCardModal';
import { LottoResult } from '../services/lottoApi';

interface HomePageProps {
    onZodiacSelect: (id: string, year?: number) => void;
    t: GlobalTranslation;
    onShopeeClick: () => void;
    savedCount: number;
    savedTickets: SavedTicket[];
    onNavigateToHistory: () => void;
    onOpenAiPick: () => void;
    lang: 'vn' | 'en' | 'kr';
    onShowFate: (result: FateResult) => void;
    onDreamSearch: (term: string) => void;
    onNavigateToDream: () => void;
}

// OFFICIAL LAUNCH DATA (Hardcoded for Stability)
const LAUNCH_DATA: LottoResult[] = [
    {
        id: 'mega',
        name: "Mega 6/45",
        drawId: "#01463",
        drawDate: "28/01/2026",
        jackpot: "14.712.500.000 VNĐ",
        winningNumbers: ['04', '10', '16', '19', '27', '40'],
        bonusNumber: null,
        nextDrawTime: new Date().toISOString(),
        theme: {
            bg: "bg-[#ED1C24]",
            borderColor: "border-red-500",
            text: "text-white",
            subText: "text-white/80",
            jackpotColor: "text-[#F9D423]",
            iconBg: "bg-white/20 border-white/20",
            badgeBg: "bg-black/20 border-white/10"
        }
    },
    {
        id: 'power',
        name: "Power 6/55",
        drawId: "#01301",
        drawDate: "27/01/2026",
        jackpot: "32.706.781.950 VNĐ",
        winningNumbers: ['13', '22', '32', '42', '53', '54'],
        bonusNumber: '29',
        nextDrawTime: new Date().toISOString(),
        theme: {
            bg: "bg-[linear-gradient(135deg,#F7C51D_0%,#F9D423_100%)]",
            borderColor: "border-yellow-400",
            text: "text-red-900",
            subText: "text-red-800/80",
            jackpotColor: "text-red-950",
            iconBg: "bg-red-900/5 border-red-900/10",
            badgeBg: "bg-red-900/10 border-red-900/10"
        }
    },
    {
        id: 'lotto',
        name: "Lotto 5/35",
        drawId: "#00422",
        drawDate: "29/01/2026",
        jackpot: "7.765.082.500 VNĐ",
        winningNumbers: ['10', '13', '25', '31', '32'],
        bonusNumber: '01',
        nextDrawTime: new Date().toISOString(),
        theme: {
            bg: "bg-[#00A651]",
            borderColor: "border-green-500",
            text: "text-white",
            subText: "text-white/80",
            jackpotColor: "text-[#F9D423]",
            iconBg: "bg-white/20 border-white/20",
            badgeBg: "bg-black/20 border-white/10"
        }
    }
];

const HomePage: React.FC<HomePageProps> = ({ 
    onZodiacSelect, 
    t, 
    onShopeeClick, 
    savedCount, 
    savedTickets, 
    onNavigateToHistory, 
    onOpenAiPick, 
    lang, 
    onShowFate,
    onDreamSearch,
    onNavigateToDream
}) => {
    
    // Fate Form State
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [day, setDay] = useState('1');
    const [month, setMonth] = useState('1');
    const [year, setYear] = useState('1990');
    const [time, setTime] = useState('unknown');
    const [topic, setTopic] = useState('money');
    const [specificConcern, setSpecificConcern] = useState(''); 

    // Lottery Data State (Initialized with verified Launch Data)
    const [lotteryData] = useState<LottoResult[]>(LAUNCH_DATA);

    // Get last 3 tickets
    const recentTickets = savedTickets.slice(0, 3);

    // Generate Arrays for Selects
    const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    const MONTHS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const YEARS = Array.from({ length: 2010 - 1950 + 1 }, (_, i) => (2010 - i).toString());
    const HOURS = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    const TOPICS = [
        { id: 'money', label: t.home.form.topics.money, icon: '💰' },
        { id: 'love', label: t.home.form.topics.love, icon: '❤️' },
        { id: 'career', label: t.home.form.topics.career, icon: '💼' },
        { id: 'health', label: t.home.form.topics.health, icon: '🏥' },
        { id: 'exam', label: t.home.form.topics.exam, icon: '🎓' },
        { id: 'relation', label: 'Quan hệ', icon: '🤝' },
    ];

    const handleAnalyzeFate = () => {
        if (!name.trim()) {
            return;
        }
        const result = VinaLuckEngine.analyzeFate(name, gender, day, month, year, time, topic, specificConcern, lang);
        onShowFate(result);
    };

    return (
        <main className="flex flex-col w-full animate-fade-in bg-[#F5F7FA] min-h-full relative">
            
            {/* 1. HERO BACKGROUND LAYER (Absolute) */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-[#D02622] z-0" />

            {/* 2. TOP CONTENT: LOTTERY CAROUSEL */}
            {/* Added pb-20 to push content up so the overlapping sheet doesn't cover the carousel details */}
            <div className="relative z-10 w-full pt-4 pb-20">
                <UnifiedJackpotCarousel t={t} data={lotteryData} />
            </div>
            
            {/* 3. OVERLAPPING CONTENT SHEET */}
            {/* rounded-t-[32px] and -mt-12 create the card effect */}
            <div className="relative z-20 bg-[#F5F7FA] rounded-t-[32px] -mt-12 px-4 pt-8 pb-32 flex flex-col gap-6 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                
                {/* A. TODAY'S LUCK (Zodiac Grid) */}
                <DailyLuck onZodiacSelect={onZodiacSelect} t={t} onShopeeClick={onShopeeClick} />

                {/* B. DREAM DECODER */}
                <DreamDecoder t={t} onSearch={onDreamSearch} onNavigate={onNavigateToDream} />

                {/* C. FATE INPUT FORM (Moved to bottom as requested) */}
                <section>
                    <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4 border border-gray-100">
                        
                        {/* Header */}
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <span className="text-xl">📜</span>
                            <h2 className="text-lg font-black font-heading text-gray-800 uppercase tracking-wide leading-tight">
                                {t.home.form.title}
                            </h2>
                        </div>

                        {/* Inputs */}
                        <div className="flex flex-col gap-4">
                            
                            {/* Name & Gender Row */}
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={t.home.form.namePlaceholder}
                                        className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-2 text-sm font-medium focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="flex bg-gray-100 p-1 rounded-xl h-11 w-32 shrink-0">
                                    <button 
                                        onClick={() => setGender('male')}
                                        className={`flex-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${gender === 'male' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400'}`}
                                    >
                                        🚹
                                    </button>
                                    <button 
                                        onClick={() => setGender('female')}
                                        className={`flex-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${gender === 'female' ? 'bg-[#ED1C24] text-white shadow-sm' : 'text-gray-400'}`}
                                    >
                                        🚺
                                    </button>
                                </div>
                            </div>

                            {/* Date Selects */}
                            <div className="grid grid-cols-4 gap-2">
                                <div className="relative">
                                    <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-1 text-xs font-bold appearance-none outline-none focus:border-primary text-center">
                                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="relative">
                                    <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-1 text-xs font-bold appearance-none outline-none focus:border-primary text-center">
                                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="relative">
                                    <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-1 text-xs font-bold appearance-none outline-none focus:border-primary text-center">
                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                 <div className="relative">
                                    <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-1 text-xs font-bold appearance-none outline-none focus:border-primary text-center">
                                        <option value="unknown">?</option>
                                        {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Topic Chips */}
                            <div className="flex flex-wrap gap-2">
                                {TOPICS.map((tItem) => (
                                    <button
                                        key={tItem.id}
                                        onClick={() => setTopic(tItem.id)}
                                        className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${topic === tItem.id ? 'bg-[#FFF8F0] border-[#FFCD00] text-gray-900 ring-1 ring-[#FFCD00]/50' : 'bg-white border-gray-200 text-gray-500'}`}
                                    >
                                        <span>{tItem.icon}</span>
                                        <span>{tItem.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Specific Concern Input */}
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-3 text-gray-400" size={14} />
                                <textarea
                                    value={specificConcern}
                                    onChange={(e) => setSpecificConcern(e.target.value)}
                                    placeholder={lang === 'vn' ? "Nhập nỗi lo cụ thể (Tùy chọn)..." : "Enter specific concern (Optional)..."}
                                    className="w-full h-20 bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm font-medium focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 resize-none"
                                />
                            </div>

                            {/* Privacy Note */}
                            <div className="flex items-center justify-center gap-1.5 -mt-1">
                                <Lock size={10} className="text-gray-400" />
                                <span className="text-[10px] text-gray-400 font-medium">{t.home.form.privacy}</span>
                            </div>

                            {/* Analyze Button */}
                            <button 
                                onClick={handleAnalyzeFate}
                                className="w-full h-12 bg-gradient-to-r from-[#B01E17] to-[#ED1C24] hover:opacity-90 text-white rounded-xl shadow-lg shadow-red-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            >
                                <Sparkles size={18} className="text-yellow-300" fill="currentColor" />
                                <span className="font-black font-heading uppercase tracking-wide text-base">{t.home.form.analyze}</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* D. HISTORY BUTTON */}
                <section>
                    <button 
                        onClick={onNavigateToHistory}
                        className="w-full bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center justify-between group active:scale-[0.99] transition-transform h-12"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                                <History size={16} />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-xs font-bold font-heading text-gray-900 leading-none">{t.home.simulationHistory}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] text-gray-400">{savedCount} {t.home.saved}</span>
                            <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                        </div>
                    </button>
                </section>

                {/* E. PARTNER AD */}
                <section>
                    <div className="bg-[#EEF2FF] rounded-xl p-3 border border-indigo-100 relative overflow-hidden shadow-sm min-h-[70px] flex items-center">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-200/40 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                        <div className="flex items-center justify-between w-full relative z-10">
                            <div className="flex gap-2.5 items-center">
                                <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-600">
                                    <User size={18} />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xs font-bold font-heading text-indigo-900">Bemeup</h3>
                                        <span className="bg-indigo-200 text-[7px] px-1 py-px rounded text-indigo-800 font-bold uppercase tracking-wide">{t.home.featuredPartner}</span>
                                    </div>
                                    <p className="text-[9px] text-indigo-700/80 mt-0.5 leading-tight">
                                        Premium K-Beauty Platform
                                    </p>
                                </div>
                            </div>
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm shadow-indigo-200 transition-colors whitespace-nowrap">
                                {t.home.visitStore}
                            </button>
                        </div>
                    </div>
                </section>

                {/* F. RECENT ACTIVITY WIDGET */}
                <section className="mb-6">
                    <div className="flex items-center justify-between px-1 mb-3">
                         <h3 className="text-xs font-bold font-heading text-gray-800 uppercase tracking-wide">{t.home.recentTickets}</h3>
                         {savedCount > 0 && (
                            <button onClick={onNavigateToHistory} className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5">
                                {t.home.viewAll} <ChevronRight size={12} />
                            </button>
                         )}
                    </div>
                    
                    {recentTickets.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {recentTickets.map((ticket) => (
                                <div 
                                    key={ticket.id} 
                                    onClick={onNavigateToHistory}
                                    className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden cursor-pointer hover:border-primary/30 transition-colors active:scale-[0.98]"
                                >
                                    <div className="flex justify-between items-center z-10">
                                        <div className="flex items-center gap-2">
                                            <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${ticket.gameType.includes('Power') ? 'bg-yellow-400 text-red-900' : ticket.gameType.includes('Mega') ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                                                {ticket.gameType}
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-400">
                                                <Calendar size={10} />
                                                <span className="text-[9px] font-medium">{new Date(ticket.timestamp).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 z-10">
                                        {ticket.numbers.map((num, i) => (
                                            <div key={i} className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 text-gray-800 text-[10px] font-bold flex items-center justify-center shadow-sm">
                                                {num}
                                            </div>
                                        ))}
                                        {ticket.special && (
                                            <>
                                                <div className="w-px h-4 bg-gray-200 mx-0.5"></div>
                                                <div className="w-6 h-6 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-[10px] font-bold flex items-center justify-center shadow-sm">
                                                    {ticket.special}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl p-6 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center gap-2 mt-4">
                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary/40 mb-1">
                                <Bot size={24} />
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium">{t.home.noTickets}</p>
                            <button 
                                onClick={onOpenAiPick}
                                className="mt-1 flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold px-4 py-2 rounded-full text-xs transition-colors active:scale-95"
                            >
                                <Target size={14} />
                                <span>{t.home.trySim}</span>
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default HomePage;
