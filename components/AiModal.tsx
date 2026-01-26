
import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Save, Target, X, Trophy, Sparkles, Zap } from 'lucide-react';
import { GlobalTranslation } from '../App';

interface AiModalProps {
    isOpen: boolean;
    onClose: () => void;
    t: GlobalTranslation;
    seedNumbers?: string[];
    onSave: (data: { type: string; numbers: string[]; special?: string | null }) => void;
}

type Step = 'select' | 'result';
type GameType = 'mega' | 'power' | 'lotto';

const AiModal: React.FC<AiModalProps> = ({ isOpen, onClose, t, onSave }) => {
    const [step, setStep] = useState<Step>('select');
    const [selectedGame, setSelectedGame] = useState<GameType>('mega');
    
    // Display States (what user sees)
    const [displayNumbers, setDisplayNumbers] = useState<string[]>([]);
    const [displaySpecial, setDisplaySpecial] = useState<string | null>(null);
    
    // Logic States
    const [isSpinning, setIsSpinning] = useState(false);
    const [finalData, setFinalData] = useState<{numbers: string[], special: string | null}>({numbers: [], special: null});

    const spinInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (isOpen) {
            setStep('select');
            setIsSpinning(false);
            setDisplayNumbers([]);
            setDisplaySpecial(null);
        }
        return () => stopSpinInterval();
    }, [isOpen]);

    const stopSpinInterval = () => {
        if (spinInterval.current) {
            clearInterval(spinInterval.current);
            spinInterval.current = null;
        }
    };

    const generateRandomNumbers = (game: GameType) => {
        const max = game === 'mega' ? 45 : game === 'power' ? 55 : 35;
        const count = game === 'lotto' ? 5 : 6;
        return Array.from({length: count}, () => Math.floor(Math.random() * max + 1).toString().padStart(2, '0'));
    };

    const generateRandomSpecial = (game: GameType) => {
         if (game === 'power') return Math.floor(Math.random() * 55 + 1).toString().padStart(2, '0');
         if (game === 'lotto') return Math.floor(Math.random() * 35 + 1).toString().padStart(2, '0');
         return null;
    };

    const startSpin = (game: GameType) => {
        setIsSpinning(true);
        setStep('result');

        // 1. Calculate Final Result (The "Snipe")
        const max = game === 'mega' ? 45 : game === 'power' ? 55 : 35;
        const count = game === 'lotto' ? 5 : 6;
        
        const nums = new Set<number>();
        while(nums.size < count) nums.add(Math.floor(Math.random() * max) + 1);
        const finalNums = Array.from(nums).sort((a,b) => a-b).map(n => n.toString().padStart(2, '0'));
        
        let finalSpec: string | null = null;
        if (game === 'power') finalSpec = Math.floor(Math.random() * 55 + 1).toString().padStart(2, '0');
        else if (game === 'lotto') finalSpec = Math.floor(Math.random() * 35 + 1).toString().padStart(2, '0');

        setFinalData({ numbers: finalNums, special: finalSpec });

        // 2. Start Slot Machine Effect
        stopSpinInterval();
        spinInterval.current = setInterval(() => {
            // Rapidly cycle numbers (visual only)
            setDisplayNumbers(generateRandomNumbers(game));
            setDisplaySpecial(generateRandomSpecial(game));
        }, 60); // 60ms for blur effect

        // 3. Settle after duration
        setTimeout(() => {
            stopSpinInterval();
            setDisplayNumbers(finalNums);
            setDisplaySpecial(finalSpec);
            setIsSpinning(false);
        }, 2000);
    };

    const handleSelectGame = (game: GameType) => {
        setSelectedGame(game);
        startSpin(game);
    };

    const handleSaveClick = () => {
        const displayType = selectedGame === 'mega' ? 'Mega 6/45' 
                          : selectedGame === 'power' ? 'Power 6/55' 
                          : 'Lotto 5/35';

        onSave({
            type: displayType,
            numbers: finalData.numbers,
            special: finalData.special
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all animate-fade-in">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer" onClick={isSpinning ? undefined : onClose}></div>

            <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
                {/* Close Button - Disabled during spin */}
                {!isSpinning && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-50">
                        <X size={24} />
                    </button>
                )}

                {/* --- STEP 1: SELECT GAME --- */}
                {step === 'select' && (
                    <div className="flex flex-col items-center justify-center flex-1 p-8 gap-6 animate-fade-in">
                        <div className="text-center space-y-2">
                            <Target className="w-16 h-16 text-primary mx-auto mb-2 animate-pulse" />
                            <h2 className="text-2xl font-black font-heading text-white uppercase tracking-wider">{t.aiPick.title}</h2>
                            <p className="text-gray-400 text-sm">{t.aiPick.subtitle}</p>
                        </div>
                        
                        <div className="w-full space-y-3">
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">{t.aiPick.select_game}</span>
                            
                            <button onClick={() => handleSelectGame('lotto')} className="w-full bg-green-900/30 hover:bg-green-600 border border-green-500/30 hover:border-green-400 p-4 rounded-xl flex items-center justify-between group transition-all active:scale-95">
                                <span className="font-bold text-green-100 group-hover:text-white">{t.aiPick.lotto}</span>
                                <Target size={18} className="text-green-500 group-hover:text-white" />
                            </button>

                            <button onClick={() => handleSelectGame('mega')} className="w-full bg-red-900/30 hover:bg-red-600 border border-red-500/30 hover:border-red-400 p-4 rounded-xl flex items-center justify-between group transition-all active:scale-95">
                                <span className="font-bold text-red-100 group-hover:text-white">{t.aiPick.mega}</span>
                                <Target size={18} className="text-red-500 group-hover:text-white" />
                            </button>

                            <button onClick={() => handleSelectGame('power')} className="w-full bg-yellow-900/30 hover:bg-yellow-500 border border-yellow-500/30 hover:border-yellow-400 p-4 rounded-xl flex items-center justify-between group transition-all active:scale-95">
                                <span className="font-bold text-yellow-100 group-hover:text-red-900">{t.aiPick.power}</span>
                                <Target size={18} className="text-yellow-500 group-hover:text-red-900" />
                            </button>
                        </div>
                    </div>
                )}

                {/* --- STEP 2: RESULT & SPIN --- */}
                {step === 'result' && (
                    <div className="flex flex-col items-center justify-center flex-1 p-6 gap-6 animate-fade-in bg-gradient-to-b from-gray-900 to-black">
                        
                        {/* Status Header */}
                        <div className={`flex items-center gap-2 mb-2 transition-colors ${isSpinning ? 'text-yellow-400' : 'text-primary'}`}>
                            {isSpinning ? (
                                <Zap size={24} className="animate-bounce" fill="currentColor" />
                            ) : (
                                <Trophy size={24} className="animate-bounce" />
                            )}
                            <h2 className="text-xl font-black font-heading tracking-widest uppercase">
                                {isSpinning ? "AI SNIPING..." : t.aiPick.result}
                            </h2>
                        </div>

                        {/* SLOT MACHINE BALLS */}
                        <div className="flex flex-nowrap items-center justify-center gap-2 max-w-full overflow-hidden min-h-[60px]">
                            {displayNumbers.map((num, i) => (
                                <div 
                                    key={i} 
                                    className={`w-10 h-10 shrink-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,#ef4444,#991b1b)] shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)] border border-white/20 font-black text-base flex items-center justify-center transition-all ${isSpinning ? 'text-white/80 scale-105' : 'text-white scale-100'}`}
                                >
                                    <span className={isSpinning ? 'blur-[1px]' : ''}>{num}</span>
                                </div>
                            ))}
                            {displaySpecial && (
                                <>
                                    <div className="w-px h-8 bg-gray-700 mx-0.5 shrink-0"></div>
                                    <div 
                                        className={`w-10 h-10 shrink-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,#facc15,#ca8a04)] shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),0_4px_6px_rgba(0,0,0,0.2)] border border-white/20 font-black text-base flex items-center justify-center transition-all ${isSpinning ? 'text-white/80 scale-105' : 'text-white scale-100'}`}
                                    >
                                        <span className={isSpinning ? 'blur-[1px]' : ''}>{displaySpecial}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Info Badge */}
                        <div className="bg-white/5 rounded-lg px-4 py-2 border border-white/10 mt-2">
                            {isSpinning ? (
                                <div className="flex items-center gap-2 text-yellow-400">
                                    <RefreshCw size={12} className="animate-spin" />
                                    <span className="text-xs font-bold uppercase tracking-widest">CALCULATING PROBABILITY...</span>
                                </div>
                            ) : (
                                <span className="text-xs font-bold text-green-400 uppercase tracking-widest">{t.aiPick.jackpot_chance}</span>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className={`flex gap-3 w-full mt-4 transition-opacity duration-300 ${isSpinning ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            <button 
                                onClick={() => startSpin(selectedGame)} 
                                disabled={isSpinning}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                                <RefreshCw size={18} />
                                <span>{t.aiPick.retry}</span>
                            </button>
                            <button 
                                onClick={handleSaveClick} 
                                disabled={isSpinning}
                                className="flex-1 bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
                            >
                                <Save size={18} />
                                <span>{t.aiPick.save}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiModal;
