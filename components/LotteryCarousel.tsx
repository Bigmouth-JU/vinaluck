import React, { useState, useEffect, useRef } from 'react';
import { GlobalTranslation } from '../contexts/LanguageContext';

interface LotteryCarouselProps {
    t: GlobalTranslation;
}

const LotteryCarousel: React.FC<LotteryCarouselProps> = ({ t }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Mock Data for the 3 Rotations
    const ORIGINAL_DATA = [
        {
            id: 'lotto',
            name: "Lotto 5/35",
            date: t.home.slider.today,
            drawId: "#01132",
            themeColor: "text-green-600",
            bgBadge: "bg-green-600",
            numbers: ['05', '12', '28', '33', '41'],
            special: '44' 
        },
        {
            id: 'mega',
            name: "Mega 6/45",
            date: t.home.slider.today,
            drawId: "#00985",
            themeColor: "text-blue-600",
            bgBadge: "bg-blue-600",
            numbers: ['02', '15', '22', '38', '41', '45'],
            special: null
        },
        {
            id: 'power',
            name: "Power 6/55",
            date: t.home.slider.yesterday,
            drawId: "#01021",
            themeColor: "text-red-600",
            bgBadge: "bg-primary",
            numbers: ['08', '19', '24', '31', '42', '51'],
            special: '09'
        }
    ];

    // Clone the first item and append it to the end for the infinite loop illusion
    const CAROUSEL_DATA = [...ORIGINAL_DATA, { ...ORIGINAL_DATA[0], id: 'clone' }];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 3000); // 3 Seconds per slide

        return () => clearInterval(interval);
    }, []);

    // Handle the "Instant Snap" when reaching the clone
    useEffect(() => {
        if (currentIndex === CAROUSEL_DATA.length - 1) {
            // We are at the clone (which looks exactly like index 0)
            // 1. Wait for the slide transition to finish (500ms)
            timeoutRef.current = setTimeout(() => {
                setIsTransitioning(false); // Disable animation
                setCurrentIndex(0); // Snap back to real index 0
                
                // 2. Re-enable animation after a tiny delay so the snap is processed
                setTimeout(() => {
                    setIsTransitioning(true);
                }, 50);
            }, 500);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [currentIndex, CAROUSEL_DATA.length]);

    // Helper to determine active dot (ignoring the clone index)
    const activeDotIndex = currentIndex === CAROUSEL_DATA.length - 1 ? 0 : currentIndex;

    return (
        <section className="w-full">
            <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative min-h-[130px]">
                
                {/* Sliding Track */}
                <div 
                    className="flex h-full"
                    style={{ 
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: isTransitioning ? 'transform 500ms ease-in-out' : 'none'
                    }}
                >
                    {CAROUSEL_DATA.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="w-full flex-shrink-0 px-4 py-3 flex flex-col gap-2 relative h-full">
                            
                            {/* Header */}
                            <div className="flex justify-between items-center z-10">
                                <div className="flex items-center gap-2">
                                    <div className={`w-5 h-5 rounded-full ${item.bgBadge} flex items-center justify-center text-white text-[9px] font-bold shadow-md`}>
                                        {item.id === 'lotto' || item.id === 'clone' ? 'L' : item.id === 'mega' ? 'M' : 'P'}
                                    </div>
                                    <span className={`text-xs font-black font-heading ${item.themeColor} uppercase tracking-wide`}>
                                        {item.name}
                                    </span>
                                </div>
                                <span className="text-[9px] text-gray-400 font-medium tracking-wide">
                                    {item.drawId} • {item.date}
                                </span>
                            </div>

                            {/* 3D Balls (Compact Size) */}
                            <div className="flex items-center justify-center gap-1.5 mt-1 z-10">
                                {item.numbers.map((num, i) => (
                                    <div 
                                        key={i} 
                                        className="w-8 h-8 rounded-full bg-[radial-gradient(circle_at_30%_25%,#ef4444,#991b1b)] shadow-[inset_-2px_-2px_3px_rgba(0,0,0,0.3),0_3px_5px_rgba(0,0,0,0.2)] border border-white/30 flex items-center justify-center text-white font-black text-xs"
                                    >
                                        {num}
                                    </div>
                                ))}
                                
                                {item.special && (
                                    <>
                                        <div className="w-px h-5 bg-gray-200 mx-0.5"></div>
                                        <div className="w-8 h-8 rounded-full bg-[radial-gradient(circle_at_30%_25%,#facc15,#ca8a04)] shadow-[inset_-2px_-2px_3px_rgba(0,0,0,0.3),0_3px_5px_rgba(0,0,0,0.2)] border border-white/30 flex items-center justify-center text-white font-black text-xs">
                                            {item.special}
                                        </div>
                                    </>
                                )}
                            </div>
                            
                            {/* Background Decoration */}
                             <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-5 ${item.bgBadge}`}></div>
                        </div>
                    ))}
                </div>

                {/* Indicators */}
                <div className="absolute bottom-2 left-0 w-full flex justify-center gap-1.5 z-20">
                    {ORIGINAL_DATA.map((item, idx) => (
                        <div 
                            key={idx} 
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                idx === activeDotIndex 
                                    ? `${item.bgBadge} scale-125` 
                                    : 'bg-gray-200'
                            }`}
                        ></div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default LotteryCarousel;