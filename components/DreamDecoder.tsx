
import React, { useState } from 'react';
import { Cloud, Wand2 } from 'lucide-react';
import { GlobalTranslation, useLanguage } from '../contexts/LanguageContext';

interface DreamDecoderProps {
    t: GlobalTranslation;
    onSearch: (term: string, emotion: string) => void;
    onNavigate: () => void;
}

const EMOTIONS = [
    { id: 'fear', label: 'Sợ hãi', icon: '😨' },
    { id: 'joy', label: 'Vui vẻ', icon: '😊' },
    { id: 'anxiety', label: 'Lo lắng', icon: '😟' },
    { id: 'neutral', label: 'B.Thường', icon: '😐' },
    { id: 'confused', label: 'Kỳ lạ', icon: '😕' }
];

const DreamDecoder: React.FC<DreamDecoderProps> = ({ t, onSearch, onNavigate }) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedEmotion, setSelectedEmotion] = useState('neutral');
    const { language } = useLanguage();

    const handleAction = () => {
        if (inputValue.trim()) {
            onSearch(inputValue, selectedEmotion);
            setInputValue(''); // Clear after search
        } else {
            onNavigate();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAction();
        }
    };

    return (
        <section className="bg-card-light rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                    <Cloud className="text-accent" size={20} fill="currentColor" />
                    {/* Updated Title: Larger, Bold, Uppercase. Manual VN override for "THẤY" */}
                    <h3 className="text-lg font-bold font-heading text-gray-800 uppercase tracking-tight">
                        {language === 'vn' ? "HÔM NAY BẠN MƠ THẤY GÌ?" : t.home.dream.title}
                    </h3>
                </div>
            </div>
            
            {/* Input Area: Normal weight text, slightly larger placeholder */}
            <div className="relative">
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-normal text-gray-800 focus:ring-1 focus:ring-primary/20 focus:border-primary placeholder:text-gray-400 leading-relaxed outline-none resize-none"
                    placeholder={t.home.dream.placeholder}
                />
            </div>

            {/* Emotion Selector & Action */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-[65%]">
                    {EMOTIONS.map((emo) => (
                        <button
                            key={emo.id}
                            onClick={() => setSelectedEmotion(emo.id)}
                            className={`flex flex-col items-center justify-center min-w-[40px] h-[40px] rounded-xl border transition-all ${selectedEmotion === emo.id ? 'bg-yellow-50 border-yellow-300 scale-105 shadow-sm' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
                            title={emo.label}
                        >
                            <span className="text-xl leading-none">{emo.icon}</span>
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handleAction}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-accent hover:bg-yellow-400 text-gray-900 px-4 rounded-xl shadow-sm active:scale-[0.98] transition-transform h-11"
                >
                    <Wand2 size={16} />
                    {/* Updated Button Text: Semibold */}
                    <span className="text-xs font-semibold uppercase tracking-wide">{t.home.dream.action}</span>
                </button>
            </div>
        </section>
    );
};

export default DreamDecoder;
