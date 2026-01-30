
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ZodiacFortune } from '../types';
import LottoRecommendation from './LottoRecommendation';
import { Language } from './Header';
import { VinaLuckEngine } from '../utils/VinaLuckEngine';
import { GeminiFortuneService, GeminiFortuneResponse } from '../services/geminiFortune';
import { Loader2, Sparkles, X, ChevronDown, Calendar, Wallet, Heart, Info, ArrowLeft } from 'lucide-react';
import { GlobalTranslation } from '../contexts/LanguageContext';

interface DailyFortuneModalProps {
    isOpen: boolean;
    onBack: () => void;
    data: ZodiacFortune | null;
    birthYear?: number;
    t: GlobalTranslation;
    lang: Language;
    onShopeeClick: () => void;
}

const YEARS = Array.from({ length: 2026 - 1940 + 1 }, (_, i) => 2026 - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const DailyFortuneModal: React.FC<DailyFortuneModalProps> = ({ isOpen, onBack, data, birthYear, t, lang, onShopeeClick }) => {
    const [isAnalyzed, setIsAnalyzed] = useState(false);
    const [showSheet, setShowSheet] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [deepInput, setDeepInput] = useState({ year: '1996', month: '1', day: '1', hour: '9' });
    const [aiResult, setAiResult] = useState<GeminiFortuneResponse | null>(null);
    
    // Trigger to force lottery reset/refresh
    const [resetKey, setResetKey] = useState(0);
    
    // Ref for Auto-Scroll
    const scrollRef = useRef<HTMLDivElement>(null);

    // Reset states when the modal is opened
    useEffect(() => {
        if (isOpen && data) {
            setIsAnalyzed(false);
            setShowSheet(false);
            setAiResult(null);
            let initialYear = 2008; // Default from image
            if (birthYear) {
                initialYear = birthYear;
            } else {
                // Smart fallback for year based on zodiac ID
                for (let y = 2008; y >= 1960; y--) {
                    if (VinaLuckEngine.getZodiacFromYear(y) === data.id) {
                        initialYear = y;
                        break;
                    }
                }
            }
            setDeepInput({ 
                year: initialYear.toString(), 
                month: (new Date().getMonth() + 1).toString(), 
                day: new Date().getDate().toString(), 
                hour: '9' 
            });
        }
    }, [isOpen, data, birthYear]);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAiResult(null);

        // Call Gemini Service
        if (data) {
            const aiData = await GeminiFortuneService.analyzeDailyFortune(
                "Bạn", // Generic name since we don't have it here
                "male", // Defaulting gender as it's not in this specific modal input, strictly logic placeholder
                deepInput,
                t.zodiac[data.id as keyof typeof t.zodiac],
                lang
            );
            if (aiData) {
                setAiResult(aiData);
            }
        }

        // UI Transitions
        setIsAnalyzed(true);
        setShowSheet(false);
        setIsAnalyzing(false);
        
        // 1. Trigger Lottery Reset
        setResetKey(prev => prev + 1);

        // 2. Auto-Scroll to Top
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const dailyStats = useMemo(() => {
        if (!data) return null;
        const deepStats = isAnalyzed ? { month: parseInt(deepInput.month), day: parseInt(deepInput.day), hour: parseInt(deepInput.hour) } : undefined;
        const yearToUse = isAnalyzed ? parseInt(deepInput.year) : (birthYear || parseInt(deepInput.year));
        
        return VinaLuckEngine.getDailyFortune(data.id, yearToUse, deepStats, lang);
    }, [data, isAnalyzed, deepInput, birthYear, lang]);

    if (!isOpen || !data || !dailyStats) return null;

    // --- Data Mapping Logic (AI vs Local) ---
    const displayData = aiResult ? {
        fortuneText: `${aiResult.summary}\n\n${aiResult.career}\n\n${aiResult.love}\n\n${aiResult.health}`,
        luckyNumber: aiResult.lucky_number.split(',')[0].trim(), // Take first number
        luckyTime: aiResult.lucky_time,
        luckyColor: aiResult.lucky_color,
        stars: Math.round(aiResult.score / 20), // Convert 100 scale to 5 stars
        action: aiResult.action_advice
    } : {
        fortuneText: dailyStats.fortuneText,
        luckyNumber: dailyStats.luckyNumber,
        luckyTime: dailyStats.luckyTime,
        luckyColor: dailyStats.luckyColor,
        stars: dailyStats.stars,
        action: null
    };

    const fortuneDisplay = displayData.fortuneText
        .replace('[Phân Tích Sâu] ', '')
        .replace('[Deep Analysis] ', '')
        .replace('[정밀 분석] ', '');
    
    const storySegments = fortuneDisplay.split('\n\n');

    return (
        // Changed to absolute inset-0 to fill the relative parent container
        <div className="absolute inset-0 z-50 flex flex-col bg-white overflow-hidden animate-slide-in-right">
            
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-4 pt-4 pb-2 flex items-center gap-3 shrink-0 border-b border-gray-100">
                <button 
                    onClick={onBack} 
                    className="w-10 h-10 bg-[#B01E17] rounded-xl flex items-center justify-center text-white shadow-md active:scale-95 transition-transform"
                >
                    <ArrowLeft size={24} strokeWidth={3} />
                </button>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        {/* Dynamic Title */}
                        <h1 className="text-[#B01E17] font-bold font-heading text-lg leading-none">
                            {t.fortune.modalTitle}
                        </h1>
                    </div>
                    {/* Dynamic Sub-header */}
                    <p className="text-gray-500 text-[11px] font-medium mt-0.5">
                        {aiResult ? t.fortune.interpretedByAi : t.header.fortuneSub}
                    </p>
                </div>
            </header>

            {/* Content Container - Attached ref here for scrolling */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar w-full bg-gray-50">
                <main className="flex flex-col p-4 gap-4 pb-12">
                    
                    {/* CARD A: NARRATIVE & IDENTITY */}
                    <section className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col items-center gap-5">
                        {/* Image Badge */}
                        <div className="relative">
                            <div className="w-40 h-40 bg-gray-50 rounded-full border-[6px] border-white shadow-[0_0_20px_rgba(0,0,0,0.05)] flex items-center justify-center overflow-hidden">
                                <img 
                                    alt={data.name} 
                                    className="w-full h-full object-cover" 
                                    src={data.image} 
                                />
                            </div>
                            <div className="absolute bottom-1 right-1 w-12 h-12 bg-[#B01E17] rounded-full border-[3px] border-white shadow-xl flex items-center justify-center text-white font-bold text-lg">
                                {displayData.luckyNumber}
                            </div>
                        </div>

                        {/* Name - Dynamic from Translation */}
                        <h2 className="text-4xl font-bold font-heading text-[#B01E17] uppercase tracking-tighter -mt-2">
                            {t.zodiac[data.id as keyof typeof t.zodiac]}
                        </h2>

                        {/* Year Button */}
                        <button 
                            onClick={() => setShowSheet(true)}
                            className="flex items-center gap-2 px-5 py-2 bg-gray-50 border border-gray-200 rounded-full text-gray-700 font-semibold text-sm active:bg-gray-100 transition-colors"
                        >
                            <Calendar size={16} className="text-gray-400" />
                            <span>{t.fortune.yearLabel}: {deepInput.year}</span>
                        </button>

                        {/* Star Rating */}
                        <div className="flex justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <span 
                                    key={i} 
                                    className={`material-symbols-outlined text-3xl ${i < displayData.stars ? 'text-[#FFCD00]' : 'text-gray-300'}`} 
                                    style={i < displayData.stars ? { fontVariationSettings: "'FILL' 1" } : {}}
                                >
                                    star
                                </span>
                            ))}
                        </div>

                        {/* Narrative */}
                        <div className="flex flex-col gap-4 w-full">
                            {isAnalyzed && (
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <Sparkles size={14} className="text-[#B01E17]" />
                                    <span className="text-[10px] font-bold text-[#B01E17] uppercase tracking-widest">{t.fortune.deepTitle}</span>
                                </div>
                            )}
                            
                            {/* AI Action Advice Highlight */}
                            {displayData.action && (
                                <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex gap-3 items-start">
                                    <div className="mt-1 shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                        <Info size={14} />
                                    </div>
                                    <div>
                                        {/* Dynamic Core Advice Title */}
                                        <p className="text-xs font-bold text-indigo-900 uppercase mb-0.5">{t.fortune.coreAdvice}</p>
                                        <p className="text-sm font-medium text-indigo-800">{displayData.action}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {storySegments.map((text, i) => {
                                    // Icons mapping based on assumed order: Summary, Career/Wealth, Love, Health
                                    let Icon = Sparkles;
                                    let iconColor = "text-[#EAB308]";
                                    
                                    if (aiResult) {
                                        if (i === 0) { Icon = Sparkles; iconColor = "text-[#EAB308]"; }
                                        else if (i === 1) { Icon = Wallet; iconColor = "text-[#B01E17]"; }
                                        else if (i === 2) { Icon = Heart; iconColor = "text-[#EF4444]"; }
                                        else { Icon = Info; iconColor = "text-blue-500"; }
                                    } else {
                                        // Legacy order logic
                                        Icon = i === 0 ? Sparkles : i === 1 ? Wallet : i === 2 ? Heart : Info;
                                        iconColor = i === 0 ? "text-[#EAB308]" : i === 1 ? "text-[#B01E17]" : "text-[#EF4444]";
                                    }

                                    if (!text) return null;

                                    return (
                                        <div key={i} className="flex gap-3 items-start">
                                            <div className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                                <Icon className={`${iconColor}`} size={14} />
                                            </div>
                                            {/* Body Text: Normal, Relaxed */}
                                            <p className="text-sm leading-relaxed text-gray-700 font-normal text-left whitespace-pre-line">
                                                {text}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* CARD B: AI LOTTERY (Transparent / No Background) */}
                    <section className="w-full mt-2">
                            {/* LottoRecommendation has its own margins/padding and background. Pass Reset Key. */}
                            <div className="-mt-4">
                            <LottoRecommendation lang={lang} seedNumbers={[displayData.luckyNumber]} resetKey={resetKey} />
                            </div>
                    </section>

                    {/* ROW C: LUCKY INFO */}
                    <section className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#B01E17] mb-1">
                                <Wallet size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{t.fortune.luckyNum}</span>
                            <span className="text-3xl font-bold font-heading text-[#B01E17] tracking-tighter">{displayData.luckyNumber}</span>
                        </div>
                        <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
                                <Heart size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{t.fortune.luckyTime}</span>
                            <span className="text-sm font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-full">{displayData.luckyTime}</span>
                        </div>
                    </section>

                    {/* MAIN CTA BUTTON (Bottom of Scroll) */}
                    <button 
                        onClick={() => setShowSheet(true)}
                        className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-[gradient_3s_ease_infinite] hover:opacity-90 text-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-4 gap-1 transition-all active:scale-[0.98] mt-2"
                    >
                        <div className="flex items-center gap-2">
                            <Sparkles size={20} fill="white" className="text-yellow-300" />
                            {/* Dynamic CTA Title */}
                            <span className="font-bold font-heading text-lg uppercase tracking-tight">{t.fortune.ctaTitle}</span>
                        </div>
                        {/* Dynamic CTA Subtitle */}
                        <span className="text-[10px] font-medium opacity-80">{t.fortune.ctaSub}</span>
                    </button>

                </main>
            </div>

            {/* BOTTOM SHEET */}
            {showSheet && (
                <div className="absolute inset-0 z-50 flex flex-col justify-end">
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-fade-in" 
                        onClick={() => setShowSheet(false)}
                    ></div>
                    <div className="relative bg-white w-full rounded-t-[30px] p-6 pb-10 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] animate-bounce-in z-10">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-heading text-[#B01E17]">{t.fortune.deepTitle}</h3>
                            <button onClick={() => setShowSheet(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20} /></button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">{t.fortune.yearLabel} {t.fortune.bornIn}</label>
                                <div className="relative">
                                    <select value={deepInput.year} onChange={(e) => setDeepInput({...deepInput, year: e.target.value})} className="w-full bg-gray-50 border-2 border-[#B01E17]/10 rounded-2xl px-5 py-4 text-lg font-bold outline-none appearance-none focus:border-[#B01E17]/40 transition-all">{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#B01E17] pointer-events-none" size={24} />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {/* DAY SELECTOR */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase text-center block">Ngày</label>
                                    <div className="relative">
                                        <select value={deepInput.day} onChange={(e) => setDeepInput({...deepInput, day: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-2 py-3 text-center text-sm font-bold appearance-none outline-none">{DAYS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                
                                {/* MONTH SELECTOR */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase text-center block">Tháng</label>
                                    <div className="relative">
                                        <select value={deepInput.month} onChange={(e) => setDeepInput({...deepInput, month: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-2 py-3 text-center text-sm font-bold appearance-none outline-none">{MONTHS.map(m => <option key={m} value={m}>{m}</option>)}</select>
                                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                
                                {/* HOUR SELECTOR */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase text-center block">Giờ</label>
                                    <div className="relative">
                                        <select value={deepInput.hour} onChange={(e) => setDeepInput({...deepInput, hour: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-2 py-3 text-center text-sm font-bold appearance-none outline-none">{HOURS.map(h => <option key={h} value={h}>{h}:00</option>)}</select>
                                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleAnalyze} 
                                disabled={isAnalyzing} 
                                className="w-full h-auto min-h-[60px] bg-gradient-to-r from-[#B01E17] to-red-600 hover:opacity-90 text-white rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span className="font-bold text-base">{t.fortune.analyzing}</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} fill="currentColor" className="text-yellow-400" />
                                        {/* Dynamic Button Text */}
                                        <span className="font-bold font-heading text-lg uppercase tracking-wider">{t.fortune.sheetBtn}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyFortuneModal;
