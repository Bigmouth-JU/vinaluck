
import React, { useMemo } from 'react';
import { DreamInterpretation } from '../types';
import LottoRecommendation from './LottoRecommendation';
import { Language } from './Header';
import { VinaLuckEngine } from '../utils/VinaLuckEngine';
import { GlobalTranslation } from '../App';
import { BookOpen, Sparkles, ShoppingBag, ArrowLeft } from 'lucide-react';

interface DreamResultModalProps {
    isOpen: boolean;
    onBack: () => void;
    data: DreamInterpretation | null;
    userZodiacId?: string;
    t: GlobalTranslation;
    lang: Language;
    onShopeeClick: () => void;
}

const DreamResultModal: React.FC<DreamResultModalProps> = ({ isOpen, onBack, data, userZodiacId, t, lang, onShopeeClick }) => {
    
    // 1. DYNAMIC TRANSLATION: Re-run interpretation engine if language changes.
    // This ignores the static text in 'data' prop and regenerates it using the current 'lang'.
    const translatedData = useMemo(() => {
        if (!data) return null;
        return VinaLuckEngine.interpretDream(data.keyword, lang);
    }, [data, lang]);

    // 2. Calculate Numbers (using original keyword & zodiac)
    const dynamicNumbers = useMemo(() => {
        if (!data) return [];
        return VinaLuckEngine.analyzeDream(data.keyword, userZodiacId);
    }, [data, userZodiacId]);

    if (!isOpen || !translatedData) return null;

    const seedNumbers = dynamicNumbers.map(n => n.toString());
    const narrativeSegments = translatedData.description.split('\n\n');

    // Prevent Duplicate Subtitle
    const showSubtitle = translatedData.vietnameseKeyword && translatedData.vietnameseKeyword.toLowerCase() !== translatedData.keyword.toLowerCase();

    return (
        // Changed to absolute inset-0 to fill parent container
        <div className="absolute inset-0 z-50 flex flex-col bg-white overflow-hidden animate-slide-in-right">
            
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-2 flex items-center gap-3 h-14">
                <button 
                    onClick={onBack} 
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:text-primary hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-gray-900 font-bold font-heading text-base leading-none tracking-tight">{t.dream.modalTitle}</h1>
                    <p className="text-[10px] text-text-sub font-medium">{t.dream.detailSub}</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32 w-full bg-white">
                <main className="flex flex-col gap-4 p-4 w-full">
                    <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center relative overflow-hidden">
                        <div className="relative z-10 w-28 h-28 rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-blue-50 overflow-hidden mb-4">
                            <img alt={translatedData.keyword} className="w-full h-full object-cover" src={translatedData.imageUrl} />
                        </div>
                        
                        {/* TITLE & SUBTITLE FIX */}
                        <h2 className="text-2xl font-black font-heading text-gray-900 mb-1 text-center">{translatedData.keyword}</h2>
                        {showSubtitle && (
                            <span className="text-sm font-medium text-gray-500 mb-3">({translatedData.vietnameseKeyword})</span>
                        )}

                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-6 ${translatedData.omen === 'Good' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            <span className={`w-2 h-2 rounded-full animate-pulse ${translatedData.omen === 'Good' ? 'bg-green-500' : 'bg-red-600'}`}></span>
                            {translatedData.omen === 'Good' ? t.dream.goodOmen : t.dream.badOmen}
                        </div>
                        
                        {/* Rich Narrative Interpretation (Localized) */}
                        <div className="space-y-5 text-left w-full px-2">
                            {narrativeSegments.map((segment, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="mt-1 shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        {idx === 0 ? <BookOpen size={16} /> : <Sparkles size={16} />}
                                    </div>
                                    <p className="text-sm leading-relaxed text-gray-700 font-medium">{segment}</p>
                                </div>
                            ))}
                        </div>

                        <LottoRecommendation lang={lang} seedNumbers={seedNumbers} />
                    </section>

                    <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                        <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">{t.dream.modalTitle}</span>
                        <div className="text-5xl font-black font-heading text-primary py-2 tracking-tighter">{translatedData.luckyNumbers}</div>
                        <p className="text-[10px] text-gray-400 font-medium italic mt-1 uppercase">
                            {lang === 'kr' ? "꿈의 세계가 주는 선물" : lang === 'vn' ? "Món quà từ cõi mộng" : "Gift from the dream realm"}
                        </p>
                    </section>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col items-center gap-1">
                            <span className="material-symbols-outlined text-blue-500">explore</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{t.dream.direction}</span>
                            <span className="text-sm font-bold text-gray-800">{translatedData.direction}</span>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col items-center gap-1">
                            <span className="material-symbols-outlined text-orange-500">schedule</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{t.dream.bestTime}</span>
                            <span className="text-sm font-bold text-gray-800">{translatedData.time}</span>
                        </div>
                    </div>

                    <section className="bg-white rounded-xl p-5 border border-gray-100">
                        <h3 className="text-sm font-bold font-heading text-gray-900 uppercase mb-4">{t.dream.advice}</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                                <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5"><span className="material-symbols-outlined text-xs">check</span></div>
                                <span className="font-medium text-gray-700">{translatedData.advice.do}</span>
                            </div>
                            <div className="flex gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                                <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5"><span className="material-symbols-outlined text-xs">close</span></div>
                                <span className="font-medium text-gray-700">{translatedData.advice.avoid}</span>
                            </div>
                        </div>
                    </section>

                    <button onClick={onShopeeClick} className="w-full bg-gradient-to-r from-accent to-yellow-500 text-red-900 font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 group">
                        <ShoppingBag size={20} />
                        <span>{t.dream.shopOn} Shopee</span>
                    </button>
                </main>
            </div>
        </div>
    );
};

export default DreamResultModal;
