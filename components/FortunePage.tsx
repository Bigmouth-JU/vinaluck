import React from 'react';
import { ZODIACS } from '../constants';
import { GlobalTranslation } from '../contexts/LanguageContext';

interface FortunePageProps {
    onZodiacSelect: (id: string) => void;
    t: GlobalTranslation;
}

const FortunePage: React.FC<FortunePageProps> = ({ onZodiacSelect, t }) => {
    return (
        <main className="flex flex-col gap-4 p-5 w-full animate-fade-in">
            <section className="flex flex-col gap-1">
                <h2 className="text-xl font-bold font-heading text-gray-900">{t.fortune.selectTitle}</h2>
                <p className="text-xs text-gray-500">{t.fortune.selectDesc}</p>
            </section>

            <section className="grid grid-cols-3 gap-3">
                {ZODIACS.map((animal) => (
                    <button 
                        key={animal.id}
                        onClick={() => onZodiacSelect(animal.id)}
                        className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group active:scale-95"
                    >
                        <div className={`w-24 h-24 rounded-full ${animal.id === 'monkey' ? 'bg-yellow-50 border-yellow-100' : 'bg-red-50 border-red-100'} border-2 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform bg-gradient-to-br from-white to-gray-50 p-0`}>
                            {animal.image ? (
                                <img 
                                    alt={animal.name} 
                                    className="w-full h-full object-cover" 
                                    src={animal.image} 
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerText = animal.emoji || '?';
                                    }}
                                />
                            ) : (
                                <div className="text-3xl">{animal.emoji}</div>
                            )}
                        </div>
                        <span className="text-xs font-bold text-gray-700 group-hover:text-primary transition-colors">
                            {t.zodiac[animal.id as keyof typeof t.zodiac]}
                        </span>
                    </button>
                ))}
            </section>
        </main>
    );
};

export default FortunePage;