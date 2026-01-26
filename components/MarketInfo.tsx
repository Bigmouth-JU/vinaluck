import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import { GlobalTranslation } from '../App';

interface MarketInfoProps {
    t: GlobalTranslation;
}

const MarketInfo: React.FC<MarketInfoProps> = ({ t }) => {
    return (
        <section className="grid grid-cols-2 gap-2.5">
            
            {/* 1. SJC Gold */}
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col justify-between h-[80px]">
                <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                    <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wide">{t.home.market.gold}</span>
                </div>
                <div className="flex flex-col">
                     <span className="text-lg font-black font-heading text-gray-900 leading-none tracking-tight">87.50 <span className="text-[10px] font-normal text-gray-400">M</span></span>
                     <div className="flex items-center gap-1 mt-1">
                        <span className="text-[9px] text-gray-400 font-medium">Sell</span>
                        <span className="text-[9px] text-green-600 font-bold bg-green-50 px-1 rounded">+0.5%</span>
                     </div>
                </div>
            </div>

            {/* 2. USD/VND */}
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col justify-between h-[80px]">
                 <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wide">USD/VND</span>
                </div>
                <div className="flex flex-col">
                     <span className="text-lg font-black font-heading text-gray-900 leading-none tracking-tight">25,350 <span className="text-[10px] font-normal text-gray-400">₫</span></span>
                     <span className="text-[9px] text-gray-400 font-medium mt-1">Vietcombank</span>
                </div>
            </div>

            {/* 3. VN-INDEX */}
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col justify-between h-[80px]">
                 <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp size={12} className="text-primary" />
                    <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wide">{t.home.indexes.vnIndex}</span>
                </div>
                <div className="flex flex-col">
                     <span className="text-lg font-black font-heading text-primary leading-none tracking-tight">1,879.13</span>
                     <span className="text-[9px] text-green-600 font-bold mt-1">▲ 15.4 (0.8%)</span>
                </div>
            </div>

            {/* 4. HNX-INDEX */}
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col justify-between h-[80px]">
                 <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp size={12} className="text-blue-500" />
                    <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wide">{t.home.indexes.hnxIndex}</span>
                </div>
                <div className="flex flex-col">
                     <span className="text-lg font-black font-heading text-gray-900 leading-none tracking-tight">342.50</span>
                     <span className="text-[9px] text-green-600 font-bold mt-1">▲ 3.2 (0.9%)</span>
                </div>
            </div>

        </section>
    );
};

export default MarketInfo;