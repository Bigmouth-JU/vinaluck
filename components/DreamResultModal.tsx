
import React, { useMemo, useState, useEffect } from 'react';
import { DreamInterpretation } from '../types';
import LottoRecommendation from './LottoRecommendation';
import { Language } from './Header';
import { VinaLuckEngine } from '../utils/VinaLuckEngine';
import { GeminiDreamService, GeminiDreamResponse } from '../services/geminiDream';
import { GlobalTranslation } from '../contexts/LanguageContext';
import { BookOpen, Sparkles, ShoppingBag, ArrowLeft, Loader2, Bot } from 'lucide-react';

interface DreamResultModalProps {
    isOpen: boolean;
    onBack: () => void;
    data: DreamInterpretation | null;
    userZodiacId?: string;
    t: GlobalTranslation;
    lang: Language;
    onShopeeClick: () => void;
    inputEmotion?: string; // Passed from parent
}

const DreamResultModal: React.FC<DreamResultModalProps> = ({ isOpen, onBack, data, userZodiacId, t, lang, onShopeeClick, inputEmotion = 'neutral' }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [aiResult, setAiResult] = useState<GeminiDreamResponse | null>(null);

    // Effect: When Modal opens with new data, trigger API call
    useEffect(() => {
        if (isOpen && data) {
            const fetchInterpretation = async () => {
                setIsLoading(true);
                setAiResult(null); // Reset previous result

                try {
                    // Call Gemini Service
                    const result = await GeminiDreamService.interpretDream(data.keyword, inputEmotion, lang);

                    if (result) {
                        setAiResult(result);
                    } else {
                        // Fallback to local engine if data is null (shouldn happen with new service logic unless explicit null return)
                        setAiResult(null);
                    }
                } catch (error: any) {
                    console.error("Gemini API Error details:", error);
                    alert(`Gemini Dream API Error: ${error.message || "Unknown error"}`);
                    setAiResult(null);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchInterpretation();
        }
    }, [isOpen, data, inputEmotion, lang]);

    // Fallback Logic (Local Engine)
    const localTranslatedData = useMemo(() => {
        if (!data) return null;
        return VinaLuckEngine.interpretDream(data.keyword, lang);
    }, [data, lang]);

    const localNumbers = useMemo(() => {
        if (!data) return [];
        return VinaLuckEngine.analyzeDream(data.keyword, userZodiacId);
    }, [data, userZodiacId]);


    if (!isOpen || !data) return null;

    // --- RENDER LOGIC ---

    // 1. Loading State
    if (isLoading) {
        return (
            <div className="absolute inset-0 z-50 flex flex-col bg-white animate-fade-in items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center p-8">
                    <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center relative">
                        <Bot size={40} className="text-primary animate-pulse" />
                        <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold font-heading text-gray-800">Đang Kết Nối Cõi Mộng...</h3>
                        <p className="text-sm text-gray-500 font-normal max-w-[250px]">
                            AI Thần Số học đang phân tích giấc mơ "{data.keyword}" của bạn.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Decide Source (AI vs Local)
    const isAi = !!aiResult;
    const displayData = isAi ? {
        keyword: data.keyword,
        description: aiResult!.detailed_analysis,
        omen: aiResult!.summary, // Using summary as omen text
        luckyNumbers: aiResult!.lucky_numbers,
        advice: aiResult!.action_advice,
        direction: localTranslatedData?.direction, // Keep local for abstract
        time: localTranslatedData?.time, // Keep local for abstract
        imageUrl: localTranslatedData?.imageUrl // Keep local image
    } : {
        keyword: data.keyword,
        description: localTranslatedData!.description,
        omen: localTranslatedData!.omen,
        luckyNumbers: localNumbers.map(n => n.toString()),
        advice: localTranslatedData!.advice.do,
        direction: localTranslatedData?.direction,
        time: localTranslatedData?.time,
        imageUrl: localTranslatedData?.imageUrl
    };

    const narrativeSegments = displayData.description.split('\n\n');
    const displayNumbers = Array.isArray(displayData.luckyNumbers) ? displayData.luckyNumbers : [];

    return (
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
                    <h1 className="text-gray-900 font-bold font-heading text-base leading-none tracking-tight">
                        {isAi ? "Giải Mã AI (Gemini)" : t.dream.modalTitle}
                    </h1>
                    <p className="text-[10px] text-text-sub font-normal">
                        {isAi ? "Phân tích dựa trên cảm xúc thực" : t.dream.detailSub}
                    </p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32 w-full bg-white">
                <main className="flex flex-col gap-4 p-4 w-full">
                    <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col items-center relative overflow-hidden">

                        {/* Image */}
                        <div className="relative z-10 w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-blue-50 overflow-hidden mb-4">
                            <img alt={displayData.keyword} className="w-full h-full object-cover" src={displayData.imageUrl} />
                        </div>

                        {/* Title: H2 Style */}
                        <h2 className="text-2xl font-bold font-heading text-gray-900 mb-1 text-center capitalize">{displayData.keyword}</h2>

                        {/* Emotion Context Badge */}
                        <div className="flex items-center gap-2 mb-4 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            <span className="text-xs text-gray-500 font-normal">Cảm xúc: </span>
                            <span className="text-xs font-semibold capitalize text-gray-800">{inputEmotion}</span>
                        </div>

                        {/* Summary / Omen: H3 Style */}
                        <div className="w-full bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-center mb-6">
                            <p className="text-indigo-900 font-semibold text-sm leading-relaxed">
                                "{displayData.omen}"
                            </p>
                        </div>

                        {/* Detailed Analysis: Body Style */}
                        <div className="space-y-4 text-left w-full px-1">
                            {isAi ? (
                                <p className="text-sm leading-loose text-gray-600 font-normal whitespace-pre-line">
                                    {displayData.description}
                                </p>
                            ) : (
                                narrativeSegments.map((segment, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="mt-1 shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            {idx === 0 ? <BookOpen size={16} /> : <Sparkles size={16} />}
                                        </div>
                                        <p className="text-sm leading-relaxed text-gray-600 font-normal">{segment}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Lotto Recommendation */}
                        <div className="w-full mt-6">
                            <LottoRecommendation lang={lang} seedNumbers={displayNumbers} />
                        </div>
                    </section>

                    {/* Lucky Numbers Hero */}
                    <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                        <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">{t.dream.modalTitle}</span>
                        <div className="flex flex-wrap justify-center gap-2 py-4">
                            {displayNumbers.map((num, i) => (
                                <div key={i} className="w-12 h-12 rounded-full bg-primary text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-primary/30">
                                    {num}
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-400 font-normal italic mt-1 uppercase">
                            {lang === 'kr' ? "꿈의 세계가 주는 선물" : lang === 'vn' ? "Món quà từ cõi mộng" : "Gift from the dream realm"}
                        </p>
                    </section>

                    {/* Action Advice */}
                    <section className="bg-white rounded-xl p-5 border border-gray-100">
                        <h3 className="text-sm font-semibold font-heading text-gray-800 uppercase mb-4">{t.dream.advice}</h3>
                        <div className="flex gap-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 items-start">
                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Sparkles size={14} fill="currentColor" />
                            </div>
                            <span className="font-semibold text-green-900 text-sm">{displayData.advice}</span>
                        </div>
                    </section>

                    <button onClick={onShopeeClick} className="w-full bg-gradient-to-r from-accent to-yellow-500 text-red-900 font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 group">
                        <ShoppingBag size={20} />
                        <span>{t.dream.shopOn} Shopee</span>
                    </button>
                </main>
            </div>
        </div>
    );
};

export default DreamResultModal;
