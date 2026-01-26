
import React, { useState } from 'react';
import { Cloud, Search, Sparkles } from 'lucide-react';
import { GlobalTranslation } from '../App';

interface DreamPageProps {
    onSearch: (term: string) => void;
    t: GlobalTranslation;
}

// 15 Items per language as requested
const POPULAR_SEARCHES = {
    vn: ["Rắn", "Lửa", "Tiền", "Rơi", "Nước", "Bay", "Rụng răng", "Ma", "Người chết", "Máu", "Chó", "Mèo", "Ăn uống", "Cãi nhau", "Khóc"],
    kr: ["뱀", "불", "돈", "추락", "물", "비행", "이빨 빠짐", "귀신", "죽은 사람", "피", "개", "고양이", "식사", "싸움", "울음"],
    en: ["Snake", "Fire", "Money", "Falling", "Water", "Flying", "Teeth", "Ghost", "Dead Person", "Blood", "Dog", "Cat", "Eating", "Fighting", "Crying"]
};

const DreamPage: React.FC<DreamPageProps> = ({ onSearch, t }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Deduce language code from translation prop to select correct chips
    const lang = t.nav.home === 'Trang Chủ' ? 'vn' : t.nav.home === '홈' ? 'kr' : 'en';
    const currentChips = POPULAR_SEARCHES[lang];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchTerm);
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

            <section>
                <form onSubmit={handleSubmit} className="relative group">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t.dream.searchPlaceholder}
                        className="w-full h-14 pl-12 pr-4 bg-white border-2 border-gray-100 rounded-2xl text-base font-medium placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                        autoFocus
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                    <button 
                        type="submit" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors"
                    >
                        <Sparkles size={20} fill="currentColor" />
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
                            onClick={() => onSearch(tag)}
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
