import React from 'react';
import { Gift } from 'lucide-react';
import { GlobalTranslation } from '../App';

interface HeroJackpotProps {
    t: GlobalTranslation;
}

const HeroJackpot: React.FC<HeroJackpotProps> = ({ t }) => {
    return (
        <section className="w-full">
            <div className="relative h-[180px] overflow-hidden rounded-xl bg-gradient-to-br from-primary to-[#b01e17] shadow-lg shadow-primary/20 text-white group cursor-pointer active:scale-[0.99] transition-transform">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>
                
                <div className="relative h-full p-5 flex flex-row justify-between items-center z-10">
                    <div className="flex flex-col justify-center gap-1">
                        <div className="flex items-center gap-1.5 opacity-90 mb-1">
                            <Gift className="text-accent" size={18} />
                            <span className="text-xs font-bold font-heading uppercase tracking-wider">{t.home.jackpot.label}</span>
                        </div>
                        <h2 className="text-3xl font-black font-heading text-accent drop-shadow-sm tracking-tight leading-none">50 Billion ₫</h2>
                        <span className="text-[10px] font-medium opacity-70 mt-1 uppercase tracking-widest">Vietlott 6/55</span>
                    </div>
                    
                    <div className="flex flex-col items-end justify-center h-full border-l border-white/10 pl-4 gap-2">
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wide">{t.home.jackpot.open}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-mono font-bold leading-none tracking-tight">03:25:10</div>
                            <span className="text-[10px] font-medium opacity-60">{t.home.jackpot.timeLeft}</span>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
            </div>
        </section>
    );
};

export default HeroJackpot;