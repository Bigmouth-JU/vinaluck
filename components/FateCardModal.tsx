
import React, { useState, useEffect } from 'react';
import { Sparkles, X, Mail, BarChart2, Calendar, FileText, Compass, Palette, Loader2, Bot } from 'lucide-react';
import { GlobalTranslation, useLanguage } from '../contexts/LanguageContext';
import { GeminiSajuService, GeminiSajuResponse } from '../services/geminiSaju';

// Types for the Input Data needed for API Call
export interface FateInputData {
    name: string;
    gender: 'male' | 'female';
    day: string;
    month: string;
    year: string;
    time: string;
    category: string;
    question: string;
}

// --- EXPORTED TYPES FOR ENGINE ---
export interface FiveElements {
    kim: number;
    moc: number;
    thuy: number;
    hoa: number;
    tho: number;
}

export interface Pillar {
    stem: string;
    branch: string;
}

export interface FourPillars {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    time: Pillar;
}
// --------------------------------

// Result structure handling both Local and AI sources
export interface FateResult {
    source: 'local' | 'ai';
    name: string;
    info: string;
    advice: string; // Markdown formatted or Simple text
    luckyNumbers?: string[];
    // AI Specific Fields
    elementAnalysis?: string;
    luckyDirection?: string;
    luckyColor?: string;
    // Local Specific Fields
    fiveElements?: FiveElements;
    fourPillars?: FourPillars;
}

interface FateCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    // We accept either a pre-calculated result (Local) or Input Data (for AI fetch)
    inputData?: FateInputData | null;
    localResult?: FateResult | null;
    t: GlobalTranslation;
}

type AnimationStage = 'loading' | 'fetching' | 'ready' | 'open';

const FateCardModal: React.FC<FateCardModalProps> = ({ isOpen, onClose, inputData, localResult, t }) => {
    const [stage, setStage] = useState<AnimationStage>('loading');
    const [aiResult, setAiResult] = useState<FateResult | null>(null);
    const { language } = useLanguage();

    // Lifecycle Management
    useEffect(() => {
        if (isOpen) {
            setStage('loading');
            setAiResult(null);

            // If we have inputData, we need to FETCH from AI
            if (inputData && !localResult) {
                const fetchAI = async () => {
                    setStage('fetching');
                    const response = await GeminiSajuService.analyzeFate(
                        inputData.name,
                        inputData.gender,
                        inputData.day,
                        inputData.month,
                        inputData.year,
                        inputData.time,
                        inputData.category,
                        inputData.question,
                        language
                    );

                    if (response) {
                        setAiResult({
                            source: 'ai',
                            name: inputData.name,
                            info: `${inputData.gender === 'male' ? 'Nam' : 'Nữ'} • ${inputData.day}/${inputData.month}/${inputData.year}`,
                            advice: response.main_prediction,
                            elementAnalysis: response.element_analysis,
                            luckyDirection: response.lucky_direction,
                            luckyColor: response.lucky_color,
                            luckyNumbers: [] // AI Saju doesn't generate numbers in this prompt version
                        });
                        setStage('ready');
                    } else {
                        // Fallback or Error handling? For now, just close or show error.
                        onClose();
                    }
                };
                fetchAI();
            } 
            // If we have localResult, just simulate the wait
            else if (localResult) {
                setAiResult(localResult);
                setTimeout(() => setStage('ready'), 2500);
            }
        }
    }, [isOpen, inputData, localResult, language]);

    const handleEnvelopeClick = () => {
        if (stage === 'ready') {
            setStage('open');
        }
    };

    if (!isOpen) return null;

    // Use either the fetched AI result or the passed local result
    const displayData = aiResult || localResult;
    if (!displayData && stage !== 'fetching') return null;

    // Helper to render Markdown-like text simply
    const renderMarkdown = (text: string) => {
        if (!text) return null;
        return text.split('\n').map((line, index) => {
            if (line.startsWith('## ')) {
                // H3 Style for Content Headings
                return <h3 key={index} className="text-base font-semibold text-primary mt-6 mb-2 border-b border-gray-100 pb-1">{line.replace('## ', '')}</h3>;
            }
            if (line.startsWith('* ')) {
                return <li key={index} className="ml-4 text-sm text-gray-600 font-normal mb-1 list-disc">{line.replace('* ', '')}</li>;
            }
            if (line.startsWith('1. ')) {
                return <li key={index} className="ml-4 text-sm text-gray-600 font-normal mb-1 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
            }
            if (line.trim() === '') {
                return <div key={index} className="h-2"></div>;
            }
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <p key={index} className="text-sm text-gray-600 font-normal leading-relaxed mb-1">
                    {parts.map((part, i) => 
                        part.startsWith('**') && part.endsWith('**') 
                            ? <strong key={i} className="text-gray-800 font-semibold">{part.slice(2, -2)}</strong> 
                            : part
                    )}
                </p>
            );
        });
    };

    return (
        <div className="absolute inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in sm:p-4 overflow-hidden">
            
            {/* CLOSE BUTTON */}
            {stage === 'open' && (
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/50 hover:text-white transition-colors z-50 animate-fade-in p-2 bg-black/20 rounded-full"
                >
                    <X size={24} />
                </button>
            )}

            {/* --- STAGE 1 & 2: THE ENVELOPE (Centered) --- */}
            <div 
                className={`absolute inset-0 flex flex-col items-center justify-center gap-6 transition-all duration-700 transform cursor-pointer
                    ${stage === 'open' ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}
                `}
                onClick={handleEnvelopeClick}
            >
                <div className="relative">
                    {stage === 'ready' && (
                        <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-40 animate-pulse rounded-full"></div>
                    )}
                    
                    <div className={`w-32 h-32 flex items-center justify-center transition-all duration-500
                            ${(stage === 'loading' || stage === 'fetching') ? 'animate-bounce text-gray-400' : 'animate-pulse text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]'}
                    `}>
                        {(stage === 'loading' || stage === 'fetching') ? (
                            <div className="relative">
                                <Mail size={100} strokeWidth={1} fill="currentColor" className="text-gray-800" />
                                {stage === 'fetching' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-white" size={32} />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Mail size={120} strokeWidth={1} fill="currentColor" />
                        )}
                    </div>
                </div>

                <div className="text-center space-y-2">
                    {/* Title Style: Bold, not Black */}
                    <h3 className={`text-2xl font-bold font-heading uppercase tracking-widest transition-colors duration-500 ${stage === 'ready' ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {stage === 'fetching' ? "AI ĐANG LUẬN GIẢI..." : stage === 'loading' ? "ĐANG LẬP LÁ SỐ..." : "THIÊN CƠ ĐÃ LỘ"}
                    </h3>
                    <p className={`text-sm font-normal transition-colors duration-500 ${stage === 'ready' ? 'text-white' : 'text-gray-500'}`}>
                        {stage === 'fetching' ? "Vui lòng đợi trong giây lát..." : stage === 'ready' ? "Chạm để mở khóa vận mệnh" : "Đang kết nối trường năng lượng..."}
                    </p>
                </div>
            </div>


            {/* --- STAGE 3: THE REPORT (Tall Bottom Sheet) --- */}
            <div 
                className={`w-full h-[92%] sm:h-auto sm:max-h-[90vh] sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 transform origin-bottom flex flex-col
                    ${stage === 'open' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 absolute pointer-events-none'}
                `}
            >
                {/* Header Banner - Sticky */}
                <div className="bg-slate-900 text-white p-6 relative shrink-0">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                        <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest border border-yellow-500/30 px-2 py-0.5 rounded">
                                    {displayData?.source === 'ai' ? 'Luận Giải Bát Tự AI' : 'Bát Tự Chi Tiết'}
                                </span>
                                {/* Name Title: H2 Style */}
                                <h2 className="text-2xl font-bold font-heading mt-2 tracking-tight">{displayData?.name}</h2>
                                <p className="text-gray-400 text-xs font-mono mt-1">{displayData?.info}</p>
                            </div>
                            {displayData?.source === 'ai' ? <Bot className="text-white/20" size={40} /> : <FileText className="text-white/20" size={40} />}
                        </div>
                        </div>
                </div>

                {/* Scrollable Report Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50 no-scrollbar">
                    {displayData && (
                        <div className="p-5 flex flex-col gap-6">
                            
                            {/* AI: ELEMENT BADGE */}
                            {displayData.elementAnalysis && (
                                <section className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
                                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                                        <Sparkles size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-indigo-900 mb-1">Cốt Cách Mệnh Chủ</h4>
                                        <p className="text-sm text-gray-700 leading-relaxed font-normal">{displayData.elementAnalysis}</p>
                                    </div>
                                </section>
                            )}

                            {/* LOCAL: FOUR PILLARS GRID */}
                            {displayData.fourPillars && (
                                <section>
                                    <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-1">
                                        <Calendar size={16} /> Tứ Trụ Mệnh Bàn
                                    </h3>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { label: 'Năm', val: displayData.fourPillars.year },
                                            { label: 'Tháng', val: displayData.fourPillars.month },
                                            { label: 'Ngày', val: displayData.fourPillars.day },
                                            { label: 'Giờ', val: displayData.fourPillars.time }
                                        ].map((item, idx) => (
                                            <div key={idx} className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                                                <span className="text-[9px] text-gray-400 font-bold uppercase mb-1">{item.label}</span>
                                                <span className="text-sm font-bold text-gray-800">{item.val.stem}</span>
                                                <span className="text-xs font-medium text-gray-500">{item.val.branch}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* MAIN ANALYSIS (Markdown or Text) */}
                            <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-800 mb-3">
                                    {displayData.source === 'ai' ? 'Thông Điệp Vũ Trụ' : 'Phân Tích Chi Tiết'}
                                </h3>
                                <div className="prose prose-sm max-w-none text-gray-600 leading-7 font-normal">
                                    {displayData.source === 'ai' ? (
                                        <p className="whitespace-pre-line font-normal text-gray-700 text-justify">
                                            {displayData.advice}
                                        </p>
                                    ) : (
                                        renderMarkdown(displayData.advice)
                                    )}
                                </div>
                            </section>

                            {/* AI: LUCKY ITEMS */}
                            {(displayData.luckyDirection || displayData.luckyColor) && (
                                <section className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2">
                                        <Compass size={20} className="text-teal-500" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Hướng Tốt</span>
                                        <span className="font-semibold text-gray-800">{displayData.luckyDirection}</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2">
                                        <Palette size={20} className="text-pink-500" />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Màu Vượng</span>
                                        <span className="font-semibold text-gray-800">{displayData.luckyColor}</span>
                                    </div>
                                </section>
                            )}

                            {/* LOCAL: FIVE ELEMENTS CHART */}
                            {displayData.fiveElements && (
                                <section className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                                    <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-1">
                                        <BarChart2 size={16} /> Biểu Đồ Ngũ Hành
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Kim', val: displayData.fiveElements.kim, color: 'bg-gray-400' },
                                            { label: 'Mộc', val: displayData.fiveElements.moc, color: 'bg-green-500' },
                                            { label: 'Thủy', val: displayData.fiveElements.thuy, color: 'bg-blue-500' },
                                            { label: 'Hỏa', val: displayData.fiveElements.hoa, color: 'bg-red-500' },
                                            { label: 'Thổ', val: displayData.fiveElements.tho, color: 'bg-yellow-600' },
                                        ].map((el) => (
                                            <div key={el.label} className="flex items-center gap-3">
                                                <span className="text-xs font-semibold text-gray-600 w-8">{el.label}</span>
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${el.color} transition-all duration-1000`} 
                                                        style={{ width: stage === 'open' ? `${el.val}%` : '0%' }}
                                                    ></div>
                                                </div>
                                                <span className="text-[10px] font-medium text-gray-500 w-6 text-right">{el.val}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* FOOTER NUMBERS (Only for Local/Fate) */}
                            {displayData.luckyNumbers && displayData.luckyNumbers.length > 0 && (
                                <section className="bg-slate-900 rounded-2xl p-5 text-center relative overflow-hidden">
                                    <Sparkles className="absolute top-2 right-2 text-yellow-500 opacity-50" size={16} />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
                                        Con Số Vượng Khí
                                    </span>
                                    <div className="flex justify-center gap-2 flex-wrap relative z-10">
                                        {displayData.luckyNumbers.map((num, idx) => (
                                            <div 
                                                key={idx} 
                                                className="w-10 h-10 rounded-full bg-white text-slate-900 font-bold text-sm flex items-center justify-center shadow-lg"
                                            >
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <div className="h-4"></div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default FateCardModal;
