
import React, { useState, useEffect, useRef } from 'react';
import { GlobalTranslation } from '../App';
import { Trophy, Clock } from 'lucide-react';
import { LottoResult } from '../services/lottoApi';

interface UnifiedJackpotCarouselProps {
    t: GlobalTranslation;
    data: LottoResult[];
}

// DEFINED SCHEDULES based on Official Vietlott Rules (VN Time)
const SCHEDULES: Record<string, { days: number[]; times: { h: number; m: number }[]; duration: number }> = {
    // Mega 6/45: Wed(3), Fri(5), Sun(0) at 18:00 - 18:30
    mega: { days: [0, 3, 5], times: [{ h: 18, m: 0 }], duration: 30 },
    // Power 6/55: Tue(2), Thu(4), Sat(6) at 18:00 - 18:30
    power: { days: [2, 4, 6], times: [{ h: 18, m: 0 }], duration: 30 },
    // Lotto 5/35: Daily (0-6) at 13:00 and 21:00 (10 mins duration approx)
    lotto: { days: [0, 1, 2, 3, 4, 5, 6], times: [{ h: 13, m: 0 }, { h: 21, m: 0 }], duration: 10 }
};

// Helper: Get Current Vietnam Time as a Date object (Shifted to behave like local time)
const getVNTime = (): Date => {
    const now = new Date();
    // Create a string representation in VN time
    const vnTimeStr = now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
    // Parse it back to a Date object. 
    // NOTE: This object represents VN time but physically exists in the browser's local timezone offset.
    // This is fine as long as we compare it ONLY with other dates generated the same way.
    return new Date(vnTimeStr);
};

// Helper: Calculate next draw date based on VN Time
const getNextDrawDate = (id: string): Date => {
    const config = SCHEDULES[id];
    if (!config) return getVNTime();

    const vnNow = getVNTime();
    let checkDate = new Date(vnNow);
    
    // Check next 8 days
    for (let i = 0; i < 8; i++) {
        const dayOfWeek = checkDate.getDay();
        
        if (config.days.includes(dayOfWeek)) {
            const sortedTimes = [...config.times].sort((a, b) => (a.h * 60 + a.m) - (b.h * 60 + b.m));

            for (const time of sortedTimes) {
                const drawStart = new Date(checkDate);
                drawStart.setHours(time.h, time.m, 0, 0);
                
                const drawEnd = new Date(drawStart.getTime() + config.duration * 60 * 1000);

                // Compare strictly using our shifted VN Date objects
                if (vnNow < drawEnd) {
                    return drawStart;
                }
            }
        }
        checkDate.setDate(checkDate.getDate() + 1);
        checkDate.setHours(0, 0, 0, 0);
    }
    return vnNow;
};

// Helper: Format time left (Strict VN Time diff)
const calculateVNTimeLeft = (target: Date, drawingLabel: string): string => {
    const vnNow = getVNTime();
    const diff = target.getTime() - vnNow.getTime();

    if (diff <= 0) return drawingLabel;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const UnifiedJackpotCarousel: React.FC<UnifiedJackpotCarouselProps> = ({ t, data }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [sortedResults, setSortedResults] = useState<LottoResult[]>([]);
    const [carouselData, setCarouselData] = useState<any[]>([]);
    const [timers, setTimers] = useState<Record<string, string>>({});
    const [targetDates, setTargetDates] = useState<Record<string, Date>>({});
    
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 1. Process Passed Data & Sort (Power > Mega > Lotto)
    useEffect(() => {
        if (!data || data.length === 0) return;

        const priorityMap: Record<string, number> = { 'power': 0, 'mega': 1, 'lotto': 2 };
        const sorted = [...data].sort((a, b) => {
            return (priorityMap[a.id] ?? 99) - (priorityMap[b.id] ?? 99);
        });

        setSortedResults(sorted);
        
        if (sorted.length > 0) {
            setCarouselData([...sorted, { ...sorted[0], id: 'clone' }]);
            
            const targets: Record<string, Date> = {};
            sorted.forEach(r => {
                targets[r.id] = getNextDrawDate(r.id);
            });
            setTargetDates(targets);
        }
    }, [data]);

    // 2. Real-time Countdown Timer (Client-side calculation with VN Time)
    useEffect(() => {
        if (sortedResults.length === 0) return;

        const updateTimers = () => {
            const newTimers: Record<string, string> = {};
            const newTargets = { ...targetDates };
            let needsUpdate = false;

            sortedResults.forEach(game => {
                let target = targetDates[game.id];
                const vnNow = getVNTime();
                
                // Refresh target if passed draw duration
                if (!target || (vnNow > new Date(target.getTime() + (SCHEDULES[game.id]?.duration || 30) * 60 * 1000))) {
                     target = getNextDrawDate(game.id);
                     newTargets[game.id] = target;
                     needsUpdate = true;
                }

                newTimers[game.id] = calculateVNTimeLeft(target, t.home.jackpot.drawing);
            });

            setTimers(newTimers);
            if (needsUpdate) {
                setTargetDates(newTargets);
            }
        };

        updateTimers(); 
        const interval = setInterval(updateTimers, 1000);
        return () => clearInterval(interval);
    }, [sortedResults, targetDates, t.home.jackpot.drawing]);

    // 3. Carousel Autoplay
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 5000); 

        return () => clearInterval(interval);
    }, []);

    // 4. Handle Infinite Scroll Snap
    useEffect(() => {
        if (carouselData.length > 0 && currentIndex === carouselData.length - 1) {
            timeoutRef.current = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
                setTimeout(() => {
                    setIsTransitioning(true);
                }, 50);
            }, 500);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [currentIndex, carouselData.length]);

    const activeDot = carouselData.length > 0 
        ? (currentIndex === carouselData.length - 1 ? 0 : currentIndex)
        : 0;

    // RENDER BALL LOGIC
    const renderBalls = (gameId: string, numbers: string[], bonus: string | null | undefined) => {
        // Fallback for empty numbers
        if (!numbers || numbers.length === 0) return null;

        let displayNumbers = [...numbers];
        let displayBonus = bonus;

        // Correct Split Logic based on Game Rules if bonus not explicitly passed but potentially in array
        if (gameId === 'power') {
            // Power 6/55: 6 Main + 1 Bonus. If we have 7 numbers and no specific bonus, split it.
            if (displayNumbers.length === 7 && !displayBonus) {
                displayBonus = displayNumbers.pop() || null;
            }
        } else if (gameId === 'lotto') {
            // Lotto 5/35: 5 Main + 1 Bonus. If we have 6 numbers, split it.
            if (displayNumbers.length === 6 && !displayBonus) {
                displayBonus = displayNumbers.pop() || null;
            }
        }
        // Mega 6/45: 6 Main, No Bonus. Keep as is.

        return (
            <div className="flex items-center gap-1">
                {displayNumbers.map((num, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-[radial-gradient(circle_at_30%_25%,#ef4444,#991b1b)] shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)] border border-white/30 flex items-center justify-center text-white font-black text-xs">
                        {num}
                    </div>
                ))}
                {displayBonus && (
                    <>
                        <div className="w-px h-6 bg-gray-200 mx-0.5"></div>
                        <div className="w-8 h-8 rounded-full bg-[radial-gradient(circle_at_30%_25%,#facc15,#ca8a04)] shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)] border border-white/30 flex items-center justify-center text-black font-black text-xs ring-2 ring-yellow-100/50">
                            {displayBonus}
                        </div>
                    </>
                )}
            </div>
        );
    };

    if (sortedResults.length === 0) return <div className="w-full h-[220px] bg-gray-100 animate-pulse rounded-2xl"></div>;

    return (
        <section className="w-full">
             <div className="w-full overflow-hidden relative pb-4">
                
                {/* Track */}
                <div 
                    className="flex"
                    style={{ 
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: isTransitioning ? 'transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
                    }}
                >
                    {carouselData.map((item, idx) => {
                        const realId = item.id === 'clone' ? carouselData[0].id : item.id;
                        const timeLeft = timers[realId] || t.home.jackpot.loading;

                        return (
                            <div key={`${item.id}-${idx}`} className="w-full flex-shrink-0 px-4">
                                <div className="w-full rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col bg-white h-[220px] relative">
                                    
                                    {/* 1. TOP: Colored Header */}
                                    <div className={`${item.theme.bg} ${item.theme.borderColor} border-b p-5 relative flex flex-col h-[70%] justify-between overflow-hidden`}>
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

                                        <div className="flex justify-between items-start z-10">
                                            <div className="flex items-center gap-2">
                                                <div className={`${item.theme.iconBg} backdrop-blur-md p-1.5 rounded-lg shadow-sm border`}>
                                                    <Trophy size={14} className={item.theme.jackpotColor} fill="currentColor" />
                                                </div>
                                                <h3 className={`font-heading font-black text-lg leading-none uppercase tracking-wide drop-shadow-sm ${item.theme.text}`}>{item.name}</h3>
                                            </div>
                                            <div className={`flex items-center gap-1 backdrop-blur-md px-2 py-0.5 rounded-full border shadow-sm ${item.theme.badgeBg}`}>
                                                <Clock size={10} className={`${item.theme.jackpotColor} animate-pulse`}/>
                                                <span className={`text-[9px] font-mono font-bold tracking-wide ${item.theme.text}`}>{timeLeft}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-center items-center z-10 mt-1 mb-3">
                                            <span className={`text-[9px] font-bold uppercase tracking-[0.2em] mb-1 opacity-90 ${item.theme.text}`}>
                                                {t.home.jackpot.current}
                                            </span>
                                            <div className={`text-3xl sm:text-4xl font-black font-heading tracking-tighter drop-shadow-md text-center leading-none ${item.theme.jackpotColor}`}>
                                                {item.jackpot}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. BOTTOM: Slim White Body */}
                                    <div className="bg-white px-3 py-2 flex flex-col items-center justify-center gap-1.5 relative z-10 h-[30%] -mt-4 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                        
                                        {/* Render Balls with Logic */}
                                        {renderBalls(realId, item.winningNumbers, item.bonusNumber)}
                                        
                                        <div className="text-[9px] text-gray-400 font-medium text-center w-full truncate opacity-80">
                                            {item.drawId} • {item.drawDate}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
                 
                 {/* Indicators */}
                 <div className="flex justify-center gap-1.5 mt-4">
                     {sortedResults.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                activeDot === idx 
                                    ? 'bg-white w-6 opacity-100 shadow-sm' 
                                    : 'bg-white w-1.5 opacity-40'
                            }`}
                        ></div>
                     ))}
                 </div>
             </div>
        </section>
    );
};

export default UnifiedJackpotCarousel;
