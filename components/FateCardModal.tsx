
import React, { useState, useEffect } from 'react';
import { Sparkles, X, Mail, BarChart2, Calendar, FileText } from 'lucide-react';
import { GlobalTranslation } from '../App';

// Define complex types for the Pro Report
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

export interface FateResult {
    name: string;
    info: string;
    advice: string; // Markdown formatted
    luckyNumbers: string[];
    fiveElements?: FiveElements; // New Pro Stats
    fourPillars?: FourPillars;   // New Pro Stats
}

interface FateCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: FateResult | null;
    t: GlobalTranslation;
}

type AnimationStage = 'loading' | 'ready' | 'open';

const FateCardModal: React.FC<FateCardModalProps> = ({ isOpen, onClose, data, t }) => {
    const [stage, setStage] = useState<AnimationStage>('loading');

    // Reset cycle on open
    useEffect(() => {
        if (isOpen) {
            setStage('loading');
            const timer = setTimeout(() => {
                setStage('ready');
            }, 2500); 
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleEnvelopeClick = () => {
        if (stage === 'ready') {
            setStage('open');
        }
    };

    if (!isOpen || !data) return null;

    // Helper to render Markdown-like text simply
    const renderMarkdown = (text: string) => {
        return text.split('\n').map((line, index) => {
            if (line.startsWith('## ')) {
                return <h3 key={index} className="text-lg font-black font-heading text-primary mt-6 mb-2 border-b border-gray-100 pb-1">{line.replace('## ', '')}</h3>;
            }
            if (line.startsWith('* ')) {
                return <li key={index} className="ml-4 text-sm text-gray-700 font-medium mb-1 list-disc">{line.replace('* ', '')}</li>;
            }
            if (line.startsWith('1. ')) {
                return <li key={index} className="ml-4 text-sm text-gray-700 font-medium mb-1 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
            }
            if (line.trim() === '') {
                return <div key={index} className="h-2"></div>;
            }
            // Bold text handling simple regex
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <p key={index} className="text-sm text-gray-600 leading-relaxed mb-1">
                    {parts.map((part, i) => 
                        part.startsWith('**') && part.endsWith('**') 
                            ? <strong key={i} className="text-gray-900 font-bold">{part.slice(2, -2)}</strong> 
                            : part
                    )}
                </p>
            );
        });
    };

    return (
        // Changed to absolute inset-0 z-[60] to overlay on top of everything inside the frame
        <div className="absolute inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in sm:p-4 overflow-hidden">
            
            {/* CLOSE BUTTON (Only visible when result is open, moved to safe area) */}
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
                            ${stage === 'loading' ? 'animate-bounce text-gray-400' : 'animate-pulse text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]'}
                    `}>
                        {stage === 'loading' ? (
                            <Mail size={100} strokeWidth={1} fill="currentColor" className="text-gray-800" />
                        ) : (
                            <Mail size={120} strokeWidth={1} fill="currentColor" />
                        )}
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h3 className={`text-2xl font-black font-heading uppercase tracking-widest transition-colors duration-500 ${stage === 'ready' ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {stage === 'loading' ? "ĐANG LUẬN GIẢI..." : "BÁT TỰ ĐÃ LẬP"}
                    </h3>
                    <p className={`text-sm font-medium transition-colors duration-500 ${stage === 'ready' ? 'text-white' : 'text-gray-500'}`}>
                        {stage === 'loading' ? "Đang kết nối trường năng lượng..." : "Chạm để xem báo cáo chi tiết"}
                    </p>
                </div>
            </div>


            {/* --- STAGE 3: THE PRO REPORT (Tall Bottom Sheet) --- */}
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
                                <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest border border-yellow-500/30 px-2 py-0.5 rounded">Bát Tự Chi Tiết</span>
                                <h2 className="text-2xl font-black font-heading mt-2">{data.name}</h2>
                                <p className="text-gray-400 text-xs font-mono mt-1">{data.info}</p>
                            </div>
                            <FileText className="text-white/20" size={40} />
                        </div>
                        </div>
                </div>

                {/* Scrollable Report Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50 no-scrollbar">
                    <div className="p-5 flex flex-col gap-6">
                        
                        {/* SECTION A: FOUR PILLARS GRID */}
                        {data.fourPillars && (
                            <section>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                                    <Calendar size={14} /> Tứ Trụ Mệnh Bàn
                                </h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { label: 'Năm', val: data.fourPillars.year },
                                        { label: 'Tháng', val: data.fourPillars.month },
                                        { label: 'Ngày', val: data.fourPillars.day },
                                        { label: 'Giờ', val: data.fourPillars.time }
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase mb-1">{item.label}</span>
                                            <span className="text-sm font-black text-slate-800">{item.val.stem}</span>
                                            <span className="text-xs font-medium text-slate-600">{item.val.branch}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* SECTION B: FIVE ELEMENTS CHART */}
                        {data.fiveElements && (
                            <section className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1">
                                    <BarChart2 size={14} /> Biểu Đồ Ngũ Hành
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Kim', val: data.fiveElements.kim, color: 'bg-gray-400' },
                                        { label: 'Mộc', val: data.fiveElements.moc, color: 'bg-green-500' },
                                        { label: 'Thủy', val: data.fiveElements.thuy, color: 'bg-blue-500' },
                                        { label: 'Hỏa', val: data.fiveElements.hoa, color: 'bg-red-500' },
                                        { label: 'Thổ', val: data.fiveElements.tho, color: 'bg-yellow-600' },
                                    ].map((el) => (
                                        <div key={el.label} className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-gray-500 w-8">{el.label}</span>
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${el.color} transition-all duration-1000`} 
                                                    style={{ width: stage === 'open' ? `${el.val}%` : '0%' }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 w-6 text-right">{el.val}%</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* SECTION C: DEEP ANALYSIS (Text) */}
                        <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="prose prose-sm max-w-none text-gray-800">
                                {renderMarkdown(data.advice)}
                            </div>
                        </section>

                        {/* SECTION D: FOOTER NUMBERS */}
                        <section className="bg-slate-900 rounded-2xl p-5 text-center relative overflow-hidden">
                            <Sparkles className="absolute top-2 right-2 text-yellow-500 opacity-50" size={16} />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
                                Con Số Vượng Khí
                            </span>
                            <div className="flex justify-center gap-2 flex-wrap relative z-10">
                                {data.luckyNumbers.map((num, idx) => (
                                    <div 
                                        key={idx} 
                                        className="w-10 h-10 rounded-full bg-white text-slate-900 font-black text-sm flex items-center justify-center shadow-lg"
                                    >
                                        {num}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="h-4"></div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FateCardModal;
