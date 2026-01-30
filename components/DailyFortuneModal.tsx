import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ZodiacFortune } from '../types';
import LottoRecommendation from './LottoRecommendation';
import { Language } from './Header';
import { VinaLuckEngine } from '../utils/VinaLuckEngine';
import { GeminiFortuneService, GeminiFortuneResponse } from '../services/geminiFortune';
import { Loader2, Sparkles, X, ChevronDown, Calendar, Wallet, Heart, Activity, ArrowLeft, Clock, Palette } from 'lucide-react';
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
    
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && data) {
            setIsAnalyzed(false);
            setShowSheet(false);
            setAiResult(null);
            let initialYear = 2008; 
            if (birthYear) {
                initialYear = birthYear;
            } else {
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

        if (data) {
            const aiData = await GeminiFortuneService.analyzeDailyFortune(
                "Bạn", 
                "male", 
                deepInput,
                t.zodiac[data.id as keyof typeof t.zodiac],
                lang
            );
            if (aiData) {
                setAiResult(aiData);
            }
        }

        setIsAnalyzed(true);
        setShowSheet(false);
        setIsAnalyzing(false);
        setResetKey(prev => prev + 1);

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

    // --- Prepare Data for Display ---
    const displayData = aiResult ? {
        summary: aiResult.summary,
        career: aiResult.career,
        love: aiResult.love,
        health: aiResult.health,
        luckyNumber: aiResult.lucky_number.split(',')[0].trim(),
        luckyTime: aiResult.lucky_time,
        luckyColor: aiResult.lucky_color,
        score: aiResult.score,
        action: aiResult.action_advice
    } : {
        // Fallback to local engine text (parse it roughly)
        summary: dailyStats.fortuneText,
        career: "Cơ hội thăng tiến đang mở ra, hãy tập trung vào các dự án dài hạn.",
        love: "Tình cảm hài hòa, nên dành thời gian cho gia đình.",
        health: "Sức khỏe ổn định, nhưng cần chú ý nghỉ ngơi.",
        luckyNumber: dailyStats.luckyNumber,
        luckyTime: dailyStats.luckyTime,
        luckyColor: dailyStats.luckyColor,
        score: dailyStats.stars * 20,
        action: null
    };

    return (
        <div className="absolute inset-0 z-50 flex flex-col bg-white overflow-hidden animate-slide-in-right">
            
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center gap-3 shrink-0 border-b border-gray-100 shadow-sm">
                <button 
                    onClick={onBack} 
                    className="w-9 h-9 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-600 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-slate-800 font-bold font-heading text-lg leading-none">
                        {t.fortune.modalTitle}
                    </h1>
                    <p className="text-gray-400 text-xs font-medium mt-0.5">
                        {aiResult ? t.fortune.interpretedByAi : t.header.fortuneSub}
                    </p>
                </div>
                
                {/* Score Badge */}
                <div className="ml-auto flex flex-col items-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Score</span>
                    <span className={`text-xl font-black font-heading leading-none ${displayData.score >= 80 ? 'text-green-500' : displayData.score >= 60 ? 'text-yellow-500' : 'text-gray-500'}`}>
                        {displayData.score}
                    </span>
                </div>
            </header>

            {/* Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar w-full bg-slate-50">
                <main className="flex flex-col p-4 gap-4 pb-20">
                    
                    {/* 1. IDENTITY CARD */}
                    <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-red-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
                        
                        <div className="relative w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden shrink-0">
                            <img alt={data.name} className="w-full h-full object-cover" src={data.image} />
                        </div>
                        
                        <div className="flex flex-col z-10">
                            <h2 className="text-2xl font-bold font-heading text-slate-800 uppercase">
                                {t.zodiac[data.id as keyof typeof t.zodiac]}
                            </h2>
                            <button 
                                onClick={() => setShowSheet(true)}
                                className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-lg mt-1 w-fit hover:bg-slate-200 transition-colors"
                            >
                                <Calendar size={12} />
                                <span>{deepInput.year}</span>
                                <ChevronDown size={12} />
                            </button>
                        </div>
                    </section>

                    {/* 2. SUMMARY SECTION */}
                    <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 shadow-lg text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 space-y-2">
                            <div className="flex items-center gap-2 text-indigo-200">
                                <Sparkles size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">{t.fortune.deepTitle}</span>
                            </div>
                            <p className="text-sm font-medium leading-relaxed opacity-95">
                                "{displayData.summary}"
                            </p>
                            
                            {/* Action Advice Chip */}
                            {displayData.action && (
                                <div className="mt-3 bg-white/20 backdrop-blur-md rounded-lg p-3 border border-white/10">
                                    <span className="block text-[10px] font-bold text-indigo-200 uppercase mb-0.5">{t.fortune.coreAdvice}</span>
                                    <span className="text-xs font-semibold">{displayData.action}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 3. LUCKY GRID */}
                    <section className="grid grid-cols-3 gap-3">
                        {/* Number */}
                        <div className="bg-white rounded-xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm border border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-1">
                                <Wallet size={16} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Number</span>
                            <span className="text-lg font-black text-slate-800">{displayData.luckyNumber}</span>
                        </div>
                        {/* Color */}
                        <div className="bg-white rounded-xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm border border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                                <Palette size={16} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Color</span>
                            <span className="text-xs font-bold text-slate-800 text-center leading-tight line-clamp-2">{displayData.luckyColor}</span>
                        </div>
                        {/* Time */}
                        <div className="bg-white rounded-xl p-3 flex flex-col items-center justify-center gap-1 shadow-sm border border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center mb-1">
                                <Clock size={16} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Time</span>
                            <span className="text-xs font-bold text-slate-800">{displayData.luckyTime}</span>
                        </div>
                    </section>

                    {/* 4. DETAILED CARDS (Career, Love, Health) */}
                    <div className="space-y-3">
                        {/* Career */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mt-1">
                                <Wallet size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase mb-1">Sự Nghiệp & Tài Lộc</h3>
                                <p className="text-sm text-slate-600 leading-relaxed font-normal">{displayData.career}</p>
                            </div>
                        </div>

                        {/* Love */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mt-1">
                                <Heart size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase mb-1">Tình Duyên & Gia Đạo</h3>
                                <p className="text-sm text-slate-600 leading-relaxed font-normal">{displayData.love}</p>
                            </div>
                        </div>

                        {/* Health */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mt-1">
                                <Activity size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase mb-1">Sức Khỏe & Tinh Thần</h3>
                                <p className="text-sm text-slate-600 leading-relaxed font-normal">{displayData.health}</p>
                            </div>
                        </div>
                    </div>

                    {/* 5. AI LOTTO RECS */}
                    <div className="mt-2">
                         <LottoRecommendation lang={lang} seedNumbers={[displayData.luckyNumber]} resetKey={resetKey} />
                    </div>

                    {/* CTA Button */}
                    <button 
                        onClick={() => setShowSheet(true)}
                        className="w-full bg-slate-900 text-white rounded-xl py-4 font-bold shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                    >
                        <Sparkles size={18} className="text-yellow-400" />
                        <span>{t.fortune.ctaTitle}</span>
                    </button>

                </main>
            </div>

            {/* BOTTOM SHEET FOR INPUT */}
            {showSheet && (
                <div className="absolute inset-0 z-50 flex flex-col justify-end">
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" 
                        onClick={() => setShowSheet(false)}
                    ></div>
                    <div className="relative bg-white w-full rounded-t-[32px] p-6 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] animate-bounce-in z-10">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                        
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-heading text-slate-900">{t.fortune.deepTitle}</h3>
                            <button onClick={() => setShowSheet(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Year Input */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{t.fortune.yearLabel}</label>
                                <div className="relative">
                                    <select 
                                        value={deepInput.year} 
                                        onChange={(e) => setDeepInput({...deepInput, year: e.target.value})} 
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-lg font-bold text-slate-800 outline-none focus:border-indigo-500 transition-colors appearance-none"
                                    >
                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>

                            {/* Day/Month/Hour Grid */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase text-center block">Ngày</label>
                                    <div className="relative">
                                        <select value={deepInput.day} onChange={(e) => setDeepInput({...deepInput, day: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-2 text-center font-bold text-slate-800 appearance-none outline-none focus:border-indigo-500">
                                            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase text-center block">Tháng</label>
                                    <div className="relative">
                                        <select value={deepInput.month} onChange={(e) => setDeepInput({...deepInput, month: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-2 text-center font-bold text-slate-800 appearance-none outline-none focus:border-indigo-500">
                                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase text-center block">Giờ</label>
                                    <div className="relative">
                                        <select value={deepInput.hour} onChange={(e) => setDeepInput({...deepInput, hour: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-2 text-center font-bold text-slate-800 appearance-none outline-none focus:border-indigo-500">
                                            {HOURS.map(h => <option key={h} value={h}>{h}:00</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleAnalyze} 
                                disabled={isAnalyzing} 
                                className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span className="font-bold">{t.fortune.analyzing}</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} className="text-yellow-300" fill="currentColor" />
                                        <span className="font-bold uppercase tracking-wide">{t.fortune.sheetBtn}</span>
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