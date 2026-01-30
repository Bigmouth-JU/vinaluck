import React, { useState } from 'react';
import { Cloud, Search, Sparkles } from 'lucide-react';
import { GlobalTranslation } from '../contexts/LanguageContext';

interface DreamPageProps {
    onSearch: (term: string, emotion: string) => void;
    t: GlobalTranslation;
}

const EMOTIONS = [
    { id: 'fear', label: 'Sợ hãi', icon: '😨' },
    { id: 'joy', label: 'Vui vẻ', icon: '😊' },
    { id: 'anxiety', label: 'Lo lắng', icon: '😟' },
    { id: 'neutral', label: 'Bình thường', icon: '😐' },
    { id: 'confused', label: 'Kỳ lạ', icon: '😕' }
];

// 15 Items per language as requested
const POPULAR_SEARCHES = {
    vn: ["Rắn", "Lửa", "Tiền", "Rơi", "Nước", "Bay", "Rụng răng", "Ma", "Người chết", "Máu", "Chó", "Mèo", "Ăn uống", "Cãi nhau", "Khóc"],
    kr: ["뱀", "불", "돈", "추락", "물", "비행", "이빨 빠짐", "귀신", "죽은 사람", "피", "개", "고양이", "식사", "싸움", "울음"],
    en: ["Snake", "Fire", "Money", "Falling", "Water", "Flying", "Teeth", "Ghost", "Dead Person", "Blood", "Dog", "Cat", "Eating", "Fighting", "Crying"]
};

const DreamPage: React.FC<DreamPageProps> = ({ onSearch, t }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmotion, setSelectedEmotion] = useState('neutral');

    // Deduce language code from translation prop to select correct chips
    const lang = t.nav.home === 'Trang Chủ' ? 'vn' : t.nav.home === '홈' ? 'kr' : 'en';
    const currentChips = POPULAR_SEARCHES[lang];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchTerm, selectedEmotion);
        }
    };

    return (
        <main className="flex flex-col gap-6 p-5 w-full animate-fade-in">
            <section className="flex flex-col items-center text-center gap-4 py-6">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shadow-sm mb-2">
                    <Cloud size={40} />
                </div>
                <div className="space-y-1">
                    <h2 className="text-2xl font-black font-heading text-gray-900">{t.dream.heroTitle}</h2>
                    <p className="text-sm text-gray-500">{t.dream.heroDesc}</p>
                </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative group">
                        <textarea
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t.dream.searchPlaceholder}
                            className="w-full h-24 pl-4 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-base font-medium placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                            autoFocus
                        />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                             {EMOTIONS.map((emo) => (
                                <button
                                    key={emo.id}
                                    type="button"
                                    onClick={() => setSelectedEmotion(emo.id)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all ${selectedEmotion === emo.id ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span className="text-lg">{emo.icon}</span>
                                    <span className="text-xs font-bold">{emo.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors flex items-center justify-center gap-2 font-bold shadow-md active:scale-95"
                    >
                        <Sparkles size={20} fill="currentColor" className="text-yellow-300" />
                        <span>{t.dream.action}</span>
                    </button>
                </form>
            </section>

            <section className="space-y-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.dream.popularTags}</span>
                    <div className="h-px bg-gray-100 flex-1"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {currentChips.map((tag) => (
                        <button 
                            key={tag}
                            onClick={() => onSearch(tag, 'neutral')}
                            className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default DreamPage;