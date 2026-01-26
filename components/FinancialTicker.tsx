import React from 'react';

export default function FinancialTicker() {
  return (
    <div className="w-full bg-[#1a1a1a] overflow-hidden rounded-xl shadow-sm border border-gray-800 h-10 flex items-center relative z-0">
      {/* CSS for Marquee Animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 20s linear infinite;
        }
      `}</style>

      {/* Ticker Content */}
      <div className="animate-marquee pl-4 flex items-center space-x-8">
        
        {/* 1. VN-INDEX */}
        <span className="flex items-center space-x-2">
          <span className="text-xs text-gray-400 font-bold">VN-INDEX</span>
          <span className="text-xs text-green-400 font-bold">1,879.13 ▲ 15.4</span>
        </span>

        <span className="text-gray-600 text-[10px]">|</span>

        {/* 2. HNX-INDEX */}
        <span className="flex items-center space-x-2">
          <span className="text-xs text-gray-400 font-bold">HNX</span>
          <span className="text-xs text-green-400 font-bold">342.50 ▲ 3.2</span>
        </span>

        <span className="text-gray-600 text-[10px]">|</span>

        {/* 3. Gold (SJC) */}
        <span className="flex items-center space-x-2">
          <span className="text-xs text-yellow-500 font-bold">🥇 SJC</span>
          <span className="text-xs text-white">Buy 85.5M / Sell 87.5M</span>
        </span>

        <span className="text-gray-600 text-[10px]">|</span>

        {/* 4. USD Exchange Rate */}
        <span className="flex items-center space-x-2">
          <span className="text-xs text-green-500 font-bold">🇺🇸 USD</span>
          <span className="text-xs text-white">25,350₫</span>
        </span>

        <span className="text-gray-600 text-[10px]">|</span>
        <span className="text-xs text-gray-500 italic">Live Data (22/01/2026)</span>

      </div>
    </div>
  );
}