import React, { useState, useEffect } from 'react';
import { Bot, QrCode, Info } from 'lucide-react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import FortunePage from './components/FortunePage';
import DreamPage from './components/DreamPage';
import MenuPage from './components/MenuPage';
import BottomNav from './components/BottomNav';
import AiModal from './components/AiModal';
import DailyFortuneModal from './components/DailyFortuneModal';
import DreamResultModal from './components/DreamResultModal';
import FateCardModal, { FateInputData } from './components/FateCardModal';
import LottoResultPage from './pages/LottoResultPage';
import { IMAGES, FORTUNE_DATA } from './constants';
import { ZodiacFortune, DreamInterpretation } from './types';
import { VinaLuckEngine } from './utils/VinaLuckEngine';
import { LanguageProvider, useLanguage, GlobalTranslation } from './contexts/LanguageContext';

export interface SavedTicket {
    id: string;
    gameType: string;
    numbers: string[];
    special?: string | null;
    timestamp: number;
}

// Toast Component
const Toast = ({ message, show }: { message: string; show: boolean }) => (
  <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 pointer-events-none ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
    <div className="bg-gray-900/95 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 ring-1 ring-white/10">
      <Info size={18} className="text-primary" />
      <span className="text-xs font-bold tracking-wide">{message}</span>
    </div>
  </div>
);

// Inner Content Component that uses the Context
const AppContent: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  
  type Tab = 'home' | 'fortune' | 'dream' | 'menu';
  type ViewState = 'MAIN' | 'FORTUNE_DETAIL' | 'DREAM_DETAIL' | 'AI_SNIPER' | 'FATE_DETAIL';

  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [currentView, setCurrentView] = useState<ViewState>('MAIN');
  
  // Data States
  const [selectedFortune, setSelectedFortune] = useState<ZodiacFortune | null>(null);
  const [selectedDream, setSelectedDream] = useState<DreamInterpretation | null>(null);
  const [dreamEmotion, setDreamEmotion] = useState<string>('neutral');

  const [fateInput, setFateInput] = useState<FateInputData | null>(null);
  const [isFateModalOpen, setIsFateModalOpen] = useState(false);
  
  const [userZodiacId, setUserZodiacId] = useState<string | undefined>(undefined);
  const [userBirthYear, setUserBirthYear] = useState<number | undefined>(undefined);
  
  const [menuView, setMenuView] = useState<'menu' | 'history'>('menu');
  
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  // --- PERSISTENCE LOGIC ---
  const [savedTickets, setSavedTickets] = useState<SavedTicket[]>([]);

  useEffect(() => {
    const loaded = localStorage.getItem('vina_saved_tickets');
    if (loaded) {
      try {
        setSavedTickets(JSON.parse(loaded));
      } catch (e) {
        console.error("Failed to parse saved tickets", e);
      }
    }
  }, []);

  const handleSaveTicket = (data: { type: string; numbers: string[]; special?: string | null }) => {
      const newTicket: SavedTicket = {
          id: Date.now().toString(),
          gameType: data.type,
          numbers: data.numbers,
          special: data.special,
          timestamp: Date.now()
      };
      
      const updatedList = [newTicket, ...savedTickets];
      setSavedTickets(updatedList);
      localStorage.setItem('vina_saved_tickets', JSON.stringify(updatedList));

      setToastMsg(language === 'vn' ? "Đã lưu vé thành công!" : "Ticket saved successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
  };

  const handleResetHistory = () => {
      setSavedTickets([]);
      localStorage.removeItem('vina_saved_tickets');
      setToastMsg(language === 'vn' ? "Đã xóa lịch sử!" : "History cleared!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
  };

  // Dynamic Font Class based on Language
  const fontClass = language === 'vn' ? 'font-vn' : language === 'kr' ? 'font-kr' : 'font-en';

  const handleZodiacSelect = (zodiacId: string, year?: number) => {
      setUserZodiacId(zodiacId); 
      setUserBirthYear(year);    
      
      if (FORTUNE_DATA[zodiacId]) {
          setSelectedFortune(FORTUNE_DATA[zodiacId]);
          setCurrentView('FORTUNE_DETAIL');
      }
  };

  const handleDreamSearch = (term: string, emotion: string = 'neutral') => {
      const dynamicResult = VinaLuckEngine.interpretDream(term);
      setSelectedDream(dynamicResult);
      setDreamEmotion(emotion);
      setCurrentView('DREAM_DETAIL');
  };

  const handleOpenAiPick = () => {
      setCurrentView('AI_SNIPER');
  };

  const handleShopeeClick = () => {
      const msg = language === 'vn' ? "Tính năng đang phát triển..."
                : language === 'kr' ? "서비스 준비 중입니다."
                : "Feature coming soon...";
      setToastMsg(msg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
  };

  const handleShowFateInput = (data: FateInputData) => {
      setFateInput(data);
      setIsFateModalOpen(true);
  };

  const handleNavigateToHistory = () => {
      setMenuView('history');
      setActiveTab('menu');
  };

  const handleTabChange = (tab: Tab) => {
      if (tab === 'menu') {
          setMenuView('menu');
      }
      setActiveTab(tab);
      setCurrentView('MAIN');
  };

  const handleBackToMain = () => {
      setCurrentView('MAIN');
  };

  const getSeedNumbers = (): string[] => {
      if (selectedDream && selectedDream.luckyNumbers) {
          return selectedDream.luckyNumbers.match(/\d+/g) || [];
      }
      return [];
  };

  const renderTabContent = () => {
      switch (activeTab) {
          case 'home':
              return (
                  <HomePage 
                      onZodiacSelect={handleZodiacSelect} 
                      onShopeeClick={handleShopeeClick} 
                      savedCount={savedTickets.length} 
                      savedTickets={savedTickets}
                      onNavigateToHistory={handleNavigateToHistory}
                      onOpenAiPick={handleOpenAiPick}
                      onShowFateInput={handleShowFateInput}
                      onDreamSearch={handleDreamSearch}
                      onNavigateToDream={() => handleTabChange('dream')}
                  />
              );
          case 'fortune':
              return <FortunePage onZodiacSelect={handleZodiacSelect} t={t} />;
          case 'dream':
              return <DreamPage onSearch={handleDreamSearch} t={t} />;
          case 'menu':
              return <MenuPage t={t} savedTickets={savedTickets} onReset={handleResetHistory} initialView={menuView} />;
          default:
              return null;
      }
  };

  const getHeaderProps = () => {
      switch (activeTab) {
          case 'home':
              return { title: "VinaLuck", subtitle: t.header.homeSub };
          case 'fortune':
              return { title: t.header.fortuneTitle, subtitle: t.header.fortuneSub };
          case 'dream':
              return { title: t.header.dreamTitle, subtitle: t.header.dreamSub };
          case 'menu':
              return { title: t.header.menuTitle, subtitle: t.header.menuSub };
          default:
              return { title: "VinaLuck", subtitle: "App" };
      }
  };

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen w-full bg-white text-text-main ${fontClass} selection:bg-primary/20 overflow-x-hidden transition-all duration-300`}>
      
      {/* Toast Notification */}
      <Toast message={toastMsg} show={showToast} />

      {/* Left Marketing Side (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-[#FFF8F0] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#DA251D 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-lg">
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/30 rotate-3 mb-2">
            <Bot size={64} />
          </div>
          <div className="space-y-2">
            <h1 className="text-7xl font-black font-heading text-primary tracking-tighter leading-tight">VinaLuck AI</h1>
            <p className="text-2xl text-text-sub/80 font-medium tracking-wide">AI-Powered Fortune in Vietnam</p>
          </div>
          <div className="mt-8 p-6 bg-white rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-orange-100 transform transition hover:scale-105 duration-300">
            <img alt="Scan QR Code" className="w-48 h-48 mix-blend-multiply opacity-90 object-cover rounded-lg" src={IMAGES.QR_CODE} />
            <div className="mt-4 flex items-center justify-center gap-2 text-primary font-bold font-heading uppercase text-xs tracking-widest">
              <QrCode size={18} />
              <span>Scan to Download</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right App Simulation Side - MOBILE CONTAINER */}
      <div className="w-full lg:w-1/2 bg-white lg:bg-slate-50 flex items-center justify-center relative">
        <div className="relative flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-gray-50 overflow-hidden lg:h-[850px] lg:rounded-3xl lg:shadow-2xl lg:ring-1 lg:ring-black/5">
          
          {/* Main Content Wrapper - Controls Visibility of Main Views */}
          <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ${currentView !== 'MAIN' ? '-translate-x-1/4 opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}>
              
              <Header 
                {...getHeaderProps()} 
                currentLang={language} 
                onLangChange={setLanguage}
              />

              {/* Scrollable Content Area: Flex-1 fills space, PB-32 protects bottom content */}
              <div className="flex-1 overflow-y-auto no-scrollbar pb-32 w-full bg-[#F5F7FA] z-0 relative">
                {renderTabContent()}
              </div>

              {/* Fixed Bottom Navigation: Absolute to bottom of the 100dvh container */}
              <BottomNav 
                  activeTab={activeTab} 
                  onTabChange={handleTabChange} 
                  onAiPickClick={handleOpenAiPick} 
                  t={t}
              />
          </div>

          {/* Layer 2: Full Screen Detail Views (In-Frame) */}
          
          {/* AI Sniper View */}
          {currentView === 'AI_SNIPER' && (
              <div className="absolute inset-0 z-50 animate-fade-in bg-white">
                  <AiModal 
                    isOpen={true} 
                    onBack={handleBackToMain} 
                    t={t}
                    seedNumbers={getSeedNumbers()}
                    onSave={handleSaveTicket}
                  />
              </div>
          )}
          
          {/* Fortune Detail View */}
          {currentView === 'FORTUNE_DETAIL' && (
             <div className="absolute inset-0 z-50 animate-fade-in bg-white">
                  <DailyFortuneModal 
                    isOpen={true} 
                    onBack={handleBackToMain} 
                    data={selectedFortune} 
                    birthYear={userBirthYear}
                    t={t}
                    lang={language}
                    onShopeeClick={handleShopeeClick}
                  />
             </div>
          )}

          {/* Dream Detail View */}
          {currentView === 'DREAM_DETAIL' && (
             <div className="absolute inset-0 z-50 animate-fade-in bg-white">
                  <DreamResultModal 
                    isOpen={true} 
                    onBack={handleBackToMain} 
                    data={selectedDream}
                    userZodiacId={userZodiacId}
                    t={t}
                    lang={language}
                    onShopeeClick={handleShopeeClick}
                    inputEmotion={dreamEmotion}
                  />
             </div>
          )}
          
          {/* Fate Modal */}
          <FateCardModal 
              isOpen={isFateModalOpen}
              onClose={() => setIsFateModalOpen(false)}
              inputData={fateInput}
              t={t}
          />

        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
};

export default App;