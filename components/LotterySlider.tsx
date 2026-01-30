import React from 'react';
import { GlobalTranslation } from '../contexts/LanguageContext';

interface LotterySliderProps {
    t: GlobalTranslation;
}

const LotterySlider: React.FC<LotterySliderProps> = ({ t }) => {
    return (
        <section className="w-full relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3 pb-5">
                {/* Mega 6/45 */}
                <div className="snap-center shrink-0 w-full bg-card-light rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">M</div>
                            <span className="text-xs font-bold font-heading text-gray-800">Mega 6/45</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">#01132 • {t.home.slider.today}</span>
                    </div>
                    <div className="flex justify-between gap-1 mt-1">
                        {['05', '12', '28', '33', '41', '44'].map((num, i) => (
                            <span key={i} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-200">{num}</span>
                        ))}
                    </div>
                </div>

                {/* Power 6/55 */}
                <div className="snap-center shrink-0 w-full bg-card-light rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold shadow-sm">P</div>
                            <span className="text-xs font-bold font-heading text-gray-800">Power 6/55</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">#00985 • {t.home.slider.yesterday}</span>
                    </div>
                    <div className="flex justify-between gap-1 mt-1">
                        {['02', '15', '22', '38', '45', '51'].map((num, i) => (
                            <span key={i} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-200">{num}</span>
                        ))}
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-accent text-primary text-xs font-bold border border-primary/20 shadow-sm">09</span>
                    </div>
                </div>

                {/* Max 3D Pro */}
                <div className="snap-center shrink-0 w-full bg-card-light rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">3D</div>
                            <span className="text-xs font-bold font-heading text-gray-800">Max 3D Pro</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">#00421 • {t.home.slider.today}</span>
                    </div>
                    <div className="flex justify-start gap-4 mt-1">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] uppercase font-bold text-gray-400">{t.home.slider.first}</span>
                            <div className="flex gap-1">
                                {['1', '2', '3'].map((n) => (
                                    <span key={n} className="w-8 h-8 flex items-center justify-center rounded bg-red-100 text-red-800 text-xs font-bold border border-red-200">{n}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] uppercase font-bold text-gray-400">{t.home.slider.second}</span>
                            <div className="flex gap-1">
                                {['7', '8', '9'].map((n) => (
                                    <span key={n} className="w-8 h-8 flex items-center justify-center rounded bg-red-100 text-red-800 text-xs font-bold border border-red-200">{n}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-1 left-0 w-full flex justify-center gap-1.5 pb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary transition-colors"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-200 transition-colors"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-200 transition-colors"></div>
            </div>
        </section>
    );
};

export default LotterySlider;