
import React, { useState, useEffect } from 'react';
import { Lock, PlayCircle, Loader2, Zap, RotateCcw } from 'lucide-react';
import { Language } from './Header';
import { VinaLuckEngine } from '../utils/VinaLuckEngine';

interface LottoRecommendationProps {
    lang: Language;
    seedNumbers: string[];
    resetKey?: number;
}

const TRANSLATIONS = {
    vn: {
        title: "⚡ Gợi Ý Xổ Số AI",
        free: "Cơ Bản (Miễn Phí)",
        premium: "Jackpot (Cao Cấp)",
        unlock: "Xem Quảng Cáo để Mở Khóa",
        unlocking: "Đang mở khóa...",
        lotto: "Lotto 5/35",
        mega: "Mega 6/45",
        power: "Power 6/55"
    },
    en: {
        title: "⚡ AI Lotto Recommendation",
        free: "Basic (Free)",
        premium: "Jackpot (Premium)",
        unlock: "Watch Ad to Unlock",
        unlocking: "Unlocking...",
        lotto: "Lotto 5/35",
        mega: "Mega 6/45",
        power: "Power 6/55"
    },
    kr: {
        title: "⚡ AI 로또 추천",
        free: "기본 (무료)",
        premium: "잭팟 (프리미엄)",
        unlock: "광고 보고 잠금 해제",
        unlocking: "잠금 해제 중...",
        lotto: "로또 5/35",
        mega: "메가 6/45",
        power: "파워 6/55"
    }
};

const REFRESH_TEXT = {
    vn: "Đổi Số",
    en: "Refresh",
    kr: "새로고침"
};

const LottoRecommendation: React.FC<LottoRecommendationProps> = ({ lang, seedNumbers, resetKey = 0 }) => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isAdPlaying, setIsAdPlaying] = useState(false);
    const [internalRefresh, setInternalRefresh] = useState(0);
    const [results, setResults] = useState<{
        lotto: { main: string[]; special: string };
        mega: string[];
        power: { main: string[]; special: string };
    } | null>(null);

    const t = TRANSLATIONS[lang];

    useEffect(() => {
        // Reset the lock when parameters change (refresh clicked or deep analysis triggered)
        setIsUnlocked(false);

        // Use the Engine to generate smart numbers based on seeds
        setResults({
            lotto: {
                main: VinaLuckEngine.generateSmartLotto('lotto', seedNumbers),
                special: Math.floor(Math.random() * 35 + 1).toString().padStart(2, '0')
            },
            mega: VinaLuckEngine.generateSmartLotto('mega', seedNumbers),
            power: {
                main: VinaLuckEngine.generateSmartLotto('power', seedNumbers),
                special: Math.floor(Math.random() * 55 + 1).toString().padStart(2, '0') // Powerball is usually pure luck
            }
        });
    }, [seedNumbers, resetKey, internalRefresh]);

    const handleUnlock = () => {
        setIsAdPlaying(true);
        setTimeout(() => {
            setIsAdPlaying(false);
            setIsUnlocked(true);
        }, 3000);
    };

    if (!results) return null;

    return (
        <div className="w-full bg-white dark:bg-[#1a0e0d] rounded-xl border-2 border-primary/10 overflow-hidden shadow-sm mt-4">
            {/* Header */}
            <div className="bg-primary/5 p-3 flex items-center justify-between border-b border-primary/10">
                <div className="flex items-center gap-2">
                    <Zap size={18} className="text-primary fill-primary" />
                    <h3 className="text-sm font-bold font-heading text-primary uppercase tracking-wide">{t.title}</h3>
                </div>
                <button 
                    onClick={() => setInternalRefresh(prev => prev + 1)}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-white border border-primary/20 px-2.5 py-1 rounded-lg shadow-sm active:scale-95 transition-transform hover:bg-primary/5"
                >
                    <RotateCcw size={12} />
                    {REFRESH_TEXT[lang]}
                </button>
            </div>

            <div className="p-4 space-y-4">
                {/* TIER 1: FREE (Lotto 5/35) */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{t.lotto}</span>
                        <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded uppercase">{t.free}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {results.lotto.main.map((num, i) => (
                            <div 
                                key={i} 
                                className={`w-9 h-9 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)] border border-white/30 flex items-center justify-center text-white font-black text-sm ${
                                    seedNumbers.includes(num) ? 'bg-[radial-gradient(circle_at_30%_25%,#facc15,#ca8a04)]' : 'bg-[radial-gradient(circle_at_30%_25%,#ef4444,#991b1b)]'
                                }`}
                            >
                                {num}
                            </div>
                        ))}
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        {/* UPDATE: Yellow Ball with Red Text */}
                        <div className="w-9 h-9 rounded-full bg-[radial-gradient(circle_at_30%_25%,#facc15,#ca8a04)] shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)] border border-white/30 flex items-center justify-center text-red-900 font-black text-sm">
                            {results.lotto.special}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-white/10 w-full"></div>

                {/* TIER 2: PREMIUM (Mega & Power) */}
                <div className="relative">
                    <div className={`flex flex-col gap-4 transition-all duration-500 ${!isUnlocked ? 'blur-sm opacity-60 select-none' : ''}`}>
                        {/* Mega */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{t.mega}</span>
                                {isUnlocked && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">UNLOCKED</span>}
                            </div>
                            <div className="flex items-center gap-2">
                                {results.mega.map((num, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-9 h-9 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)] border border-white/30 flex items-center justify-center text-white font-black text-sm ${
                                            seedNumbers.includes(num) ? 'bg-[radial-gradient(circle_at_30%_25%,#facc15,#ca8a04)]' : 'bg-[radial-gradient(circle_at_30%_25%,#ef4444,#991b1b)]'
                                        }`}
                                    >
                                        {num}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Power */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-red-700 dark:text-red-400">{t.power}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {results.power.main.map((num, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-9 h-9 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)] border border-white/30 flex items-center justify-center text-white font-black text-sm ${
                                            seedNumbers.includes(num) ? 'bg-[radial-gradient(circle_at_30%_25%,#facc15,#ca8a04)]' : 'bg-[radial-gradient(circle_at_30%_25%,#ef4444,#991b1b)]'
                                        }`}
                                    >
                                        {num}
                                    </div>
                                ))}
                                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                <div className="w-9 h-9 rounded-full bg-[radial-gradient(circle_at_30%_25%,#facc15,#ca8a04)] shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)] border border-white/30 flex items-center justify-center text-white font-black text-sm">
                                    {results.power.special}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LOCK OVERLAY */}
                    {!isUnlocked && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-[2px] rounded-lg">
                            <div className="bg-white dark:bg-[#2d1b1a] p-1 rounded-full shadow-lg mb-2">
                                <Lock size={20} className="text-primary m-2" />
                            </div>
                            {isAdPlaying ? (
                                <button disabled className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl cursor-wait">
                                    <Loader2 size={14} className="animate-spin" />
                                    {t.unlocking}
                                </button>
                            ) : (
                                <button 
                                    onClick={handleUnlock}
                                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-[#b01e17] hover:scale-105 transition-transform text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xl active:scale-95 group"
                                >
                                    <PlayCircle size={16} fill="currentColor" className="text-white/20" />
                                    {t.unlock}
                                </button>
                            )}
                            <div className="mt-2 text-[9px] font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded uppercase tracking-wider border border-yellow-200">
                                {t.premium}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LottoRecommendation;
