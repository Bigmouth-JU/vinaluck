import React, { useState, useEffect } from 'react';
import { History, FileText, ChevronRight, ArrowLeft, Trash2, Calendar } from 'lucide-react';
import { SavedTicket } from '../App';
import { GlobalTranslation } from '../contexts/LanguageContext';

interface MenuPageProps {
    t: GlobalTranslation;
    savedTickets: SavedTicket[];
    onReset: () => void;
    initialView?: 'menu' | 'history';
}

const MenuPage: React.FC<MenuPageProps> = ({ t, savedTickets, onReset, initialView = 'menu' }) => {
    const [view, setView] = useState<'menu' | 'history'>(initialView);

    useEffect(() => {
        setView(initialView);
    }, [initialView]);

    // --- HISTORY DETAIL VIEW ---
    if (view === 'history') {
        return (
            <main className="flex flex-col gap-4 p-5 w-full animate-fade-in h-full">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => setView('menu')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </button>
                    <h2 className="text-xl font-bold font-heading text-gray-900">{t.menu.history}</h2>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                    {savedTickets.length === 0 ? (
                         <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
                             <History size={40} className="opacity-20" />
                             <span className="text-sm font-medium">{t.menu.noHistory}</span>
                         </div>
                    ) : (
                        savedTickets.map((ticket) => (
                            <div key={ticket.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-3xl -mr-2 -mt-2"></div>
                                <div className="flex justify-between items-center z-10">
                                    <div className="flex items-center gap-2">
                                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ticket.gameType.includes('Power') ? 'bg-yellow-400 text-red-900' : ticket.gameType.includes('Mega') ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                                            {ticket.gameType}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <Calendar size={12} />
                                        <span className="text-[10px] font-medium">{new Date(ticket.timestamp).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1 z-10">
                                    {ticket.numbers.map((num, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold flex items-center justify-center shadow-sm">
                                            {num}
                                        </div>
                                    ))}
                                    {ticket.special && (
                                        <>
                                            <div className="w-px h-5 bg-gray-200 mx-0.5"></div>
                                            <div className="w-8 h-8 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-bold flex items-center justify-center shadow-sm">
                                                {ticket.special}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Reset Action */}
                {savedTickets.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-gray-100">
                        <button 
                            onClick={onReset}
                            className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition-colors active:scale-95"
                        >
                            <Trash2 size={18} />
                            <span>{t.menu.deleteAll}</span>
                        </button>
                    </div>
                )}
            </main>
        );
    }

    // --- MAIN MENU VIEW ---
    return (
        <main className="flex flex-col gap-4 p-5 w-full animate-fade-in">
            {/* Main Menu List */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* Simulation History Button */}
                <button 
                    onClick={() => setView('history')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                >
                    <div className="flex items-center gap-3 text-gray-700 group-hover:text-primary transition-colors">
                        <History size={20} />
                        <span className="text-sm font-bold">{t.menu.history}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Dynamic Count Badge */}
                        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {savedTickets.length}
                        </span>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
                    </div>
                </button>
                
                <div className="h-px bg-gray-50 mx-4"></div>

                {/* Terms of Service */}
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                     <div className="flex items-center gap-3 text-gray-700 group-hover:text-primary transition-colors">
                        <FileText size={20} />
                        <span className="text-sm font-bold">{t.menu.terms}</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
                </button>
            </section>

            {/* Version Footer */}
            <div className="text-center mt-2">
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                    VinaLuck {t.menu.version} 1.2.0
                </span>
            </div>
        </main>
    );
};

export default MenuPage;