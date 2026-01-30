import React, { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw, Save, Sparkles, Crown, Zap } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// --- 1. 내장형 꽃가루 컴포넌트 (라이브러리 X, 에러 0%) ---
const SimpleConfetti = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // 50개의 꽃가루 조각을 랜덤하게 생성
    const colors = ['#FFD700', '#FF4500', '#00BFFF', '#32CD32', '#FF69B4'];
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%', // 가로 위치 랜덤
      animationDuration: (Math.random() * 2 + 3) + 's', // 떨어지는 속도 랜덤 (3~5초)
      animationDelay: Math.random() * 2 + 's', // 시작 시간 랜덤
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm opacity-80"
          style={{
            left: p.left,
            top: '-20px',
            backgroundColor: p.backgroundColor,
            animation: `fall ${p.animationDuration} linear infinite`,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
      {/* CSS 애니메이션 직접 주입 */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// --- 2. 메인 결과 화면 ---
const LottoResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 데이터가 없어도 깨지지 않도록 기본값 설정
  const numbers = location.state?.numbers || [7, 12, 25, 33, 41, 52]; 
  const bonus = location.state?.bonus || 18;

  const handleRetry = () => navigate(-1);
  const handleSave = () => alert("Bộ số đã được lưu vào danh sách yêu thích!");
  const handleVIP = () => alert("Chức năng VIP đang được phát triển!");

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col relative overflow-hidden font-sans">
      {/* 배경 효과 */}
      <SimpleConfetti />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black z-0"></div>

      {/* 헤더 */}
      <div className="p-4 z-10 flex items-center w-full">
        <button onClick={handleRetry} className="p-2 hover:bg-white/10 rounded-full transition">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="ml-4 text-lg font-bold">Kết Quả Phân Tích AI</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 space-y-8 w-full max-w-md mx-auto">
        
        {/* 타이틀 섹션: 설렘 유발 */}
        <div className="text-center space-y-2 animate-bounce-slow">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold border border-yellow-500/50 mb-2 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <Sparkles className="w-4 h-4" />
            <span>POWER 6/55 HOT PICK</span>
          </div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 drop-shadow-lg uppercase tracking-tight">
            THẦN TÀI GÕ CỬA!
          </h2>
          <p className="text-gray-400 text-sm">
            Bộ số vàng đã lộ diện. Vận may đang ở rất gần!
          </p>
        </div>

        {/* 번호 표시 섹션: 골드 & 레드 테마 */}
        <div className="w-full bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* 상단 하이라이트 */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
            
            <div className="flex flex-wrap justify-center gap-3 relative z-10">
              {numbers.map((num: number, idx: number) => (
                <div 
                  key={idx} 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-red-500 to-red-700 flex items-center justify-center shadow-[0_4px_6px_rgba(0,0,0,0.3)] border border-red-400 text-white font-bold text-lg sm:text-xl animate-pulse-slow"
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  {num}
                </div>
              ))}
              {/* 보너스 번호 */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 flex items-center justify-center shadow-[0_4px_6px_rgba(0,0,0,0.3)] border border-yellow-200 text-black font-extrabold text-lg sm:text-xl animate-pulse-slow">
                {bonus}
              </div>
            </div>
        </div>

        {/* 긴박함 조성 배너 */}
        <div className="w-full bg-gradient-to-r from-red-900/80 to-red-800/80 rounded-xl p-4 shadow-lg border border-red-500/30 flex items-center justify-center gap-3 animate-pulse">
          <div className="p-2 bg-red-600 rounded-full shadow-inner">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-bold text-white leading-none mb-1">THỜI KHẮC VÀNG!</h3>
            <p className="text-xs text-red-200">Hãy mua ngay trước khi vận may thay đổi.</p>
          </div>
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="w-full space-y-3 pt-2">
          {/* VIP 버튼 (가장 강조) */}
          <button 
            onClick={handleVIP} 
            className="w-full py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-[length:200%_auto] animate-shimmer rounded-xl font-bold text-slate-900 shadow-[0_0_20px_rgba(250,204,21,0.4)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Crown className="w-5 h-5" />
            <span>Xem Gợi Ý Số VIP Theo Tuổi</span>
          </button>

          {/* 저장 버튼 */}
          <button 
            onClick={handleSave} 
            className="w-full py-3 bg-slate-800/50 border border-slate-600 rounded-xl font-semibold text-slate-200 hover:bg-slate-700 hover:border-slate-500 transition flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5 text-slate-400" />
            <span>Lưu Bộ Số Này</span>
          </button>

          {/* 다시하기 버튼 */}
          <button 
            onClick={handleRetry} 
            className="w-full py-2 text-slate-500 text-sm hover:text-white transition flex items-center justify-center gap-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Chọn lại số khác</span>
          </button>
        </div>
      </div>

      {/* 스타일 정의 */}
      <style>{`
        @keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
};

export default LottoResultPage;