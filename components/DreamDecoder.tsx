
import React from 'react';
import { Cloud, Wand2 } from 'lucide-react';
import { GlobalTranslation } from '../App';

interface DreamDecoderProps {
    t: GlobalTranslation;
}

const DreamDecoder: React.FC<DreamDecoderProps> = ({ t }) => {
    return (
        <section className="bg-card-light rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                    <Cloud className="text-accent" size={16} fill="currentColor" />
                    <h3 className="text-[10px] font-bold font-heading text-gray-700 uppercase tracking-wider">{t.home.dream.title}</h3>
                </div>
            </div>
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <input
                        className="w-full h-8 bg-gray-50 border-0 rounded-lg px-3 text-xs focus:ring-1 focus:ring-primary/20 text-gray-900 placeholder:text-gray-400 leading-tight outline-none"
                        placeholder={t.home.dream.placeholder}
                        type="text"
                    />
                </div>
                <button className="flex items-center justify-center gap-1 bg-accent hover:bg-yellow-400 text-gray-900 font-bold px-3 rounded-lg shadow-sm active:scale-[0.98] transition-transform h-8 min-w-[60px]">
                    <Wand2 size={10} />
                    <span className="text-[9px] leading-none pt-0.5">{t.home.dream.action}</span>
                </button>
            </div>
        </section>
    );
};

export default DreamDecoder;
