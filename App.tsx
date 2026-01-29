
import React, { useState, useEffect } from 'react';
import { Bot, QrCode, Info } from 'lucide-react';
import Header, { Language } from './components/Header';
import HomePage from './components/HomePage';
import FortunePage from './components/FortunePage';
import DreamPage from './components/DreamPage';
import MenuPage from './components/MenuPage';
import BottomNav from './components/BottomNav';
import AiModal from './components/AiModal';
import DailyFortuneModal from './components/DailyFortuneModal';
import DreamResultModal from './components/DreamResultModal';
import FateCardModal, { FateResult } from './components/FateCardModal';
import { IMAGES, FORTUNE_DATA } from './constants';
import { ZodiacFortune, DreamInterpretation } from './types';
import { VinaLuckEngine } from './utils/VinaLuckEngine';

// --- GEMINI-LEVEL MASTER TRANSLATIONS ---
const MASTER_TRANSLATIONS = {
    vn: {
        nav: { 
            home: "Trang Chủ", 
            fortune: "Vận Mệnh", 
            dream: "Giải Mộng", 
            menu: "Menu", 
            aipick: "Thợ Săn Số"
        },
        header: {
            homeTitle: "VinaLuck",
            homeSub: "Vận Mệnh Hôm Nay",
            fortuneTitle: "Chọn Con Giáp", 
            fortuneSub: "Xem tử vi hàng ngày",
            dreamTitle: "Giải Mã Giấc Mơ",
            dreamSub: "Điềm báo từ giấc mộng",
            menuTitle: "Menu", 
            menuSub: "Tiện ích mở rộng"
        },
        home: {
            jackpot: {
                label: "Giải Đặc Biệt (Jackpot)",
                open: "Mở thưởng",
                timeLeft: "Thời gian còn lại",
                current: "Jackpot Hiện Tại",
                loading: "Đang tải...",
                drawing: "ĐANG QUAY..."
            },
            slider: {
                today: "Hôm nay",
                yesterday: "Hôm qua",
                first: "Giải Nhất",
                second: "Giải Nhì"
            },
            form: {
                title: "Bát Tự & Giải Mã Vận Mệnh",
                namePlaceholder: "Nhập tên của bạn...",
                male: "Nam",
                female: "Nữ",
                dob: "Ngày sinh",
                tob: "Giờ sinh",
                unknownTime: "Chưa biết",
                analyze: "Phân Tích Vận Mệnh",
                privacy: "Thông tin cá nhân hoàn toàn bảo mật và không được lưu trữ.",
                topics: {
                    money: "Tài lộc",
                    love: "Tình duyên",
                    career: "Sự nghiệp",
                    health: "Sức khỏe",
                    exam: "Thi cử"
                }
            },
            dream: {
                title: "Hôm nay bạn mơ gì?",
                placeholder: "VD: Con rắn, Lửa, Rụng răng...",
                action: "Giải mã"
            },
            luck: {
                title: "Vận Mệnh Hôm Nay",
                save: "Lưu",
                select: "Chọn con giáp...",
                selectYear: "Chọn năm sinh...",
                luckyItem: "Vật Phẩm May Mắn",
                luckyColor: "Màu: ĐỎ",
                shop: "Mua đồ Đỏ trên Shopee"
            },
            market: {
                gold: "Vàng SJC",
                sell: "Bán",
                buy: "Mua",
                rate: "Tỷ giá VCB"
            },
            indexes: {
                vnIndex: "VN-Index",
                hnxIndex: "HNX-Index"
            },
            simulationHistory: "Lịch Sử Soi Cầu",
            saved: "kết quả đã lưu",
            featuredPartner: "Đối Tác Nổi Bật",
            partnerDesc: "Nền tảng K-Beauty cao cấp.\nKhám phá vẻ đẹp ngay hôm nay.",
            visitStore: "Ghé Thăm",
            recentTickets: "Pick Gần Đây!",
            viewAll: "Xem tất cả",
            noTickets: "Chưa có vé nào được lưu. Hãy thử vận may ngay!",
            trySim: "Thử Thợ Săn Số"
        },
        menu: {
            history: "Lịch Sử Soi Cầu",
            terms: "Điều Khoản Sử Dụng",
            version: "Phiên bản",
            noHistory: "Chưa có vé nào được lưu.",
            deleteAll: "Xóa toàn bộ lịch sử"
        },
        fortune: {
            selectTitle: "Chọn Con Giáp Của Bạn",
            selectDesc: "Chọn biểu tượng con giáp để xem dự báo chi tiết hôm nay.",
            modalTitle: "Tử Vi Hàng Ngày",
            deepTitle: "Phân Tích Chuyên Sâu",
            preciseDesc: "Được tính toán chính xác",
            bornIn: "Sinh năm",
            yearLabel: "Năm",
            change: "Thay đổi",
            luckyNum: "Con Số May Mắn",
            luckyTime: "Giờ Hoàng Đạo",
            luckyColor: "Màu Sắc May Mắn",
            findItem: "Tìm Vật Phẩm May Mắn?",
            findItemSub: "Phân tích sâu để tìm món đồ hộ mệnh",
            analyzeNow: "Phân Tích Ngay",
            analyzing: "Đang phân tích...",
            reveal: "Khám Phá Định Mệnh",
            buyItems: "Mua đồ màu {color}"
        },
        zodiac: {
            rat: "Tý", ox: "Trâu", tiger: "Dần", cat: "Mão", dragon: "Thìn", snake: "Tỵ",
            horse: "Ngọ", goat: "Dê", monkey: "Thân", rooster: "Dậu", dog: "Tuất", pig: "Hợi"
        },
        dream: {
            heroTitle: "Giải Mã Giấc Mơ",
            heroDesc: "Khám phá ý nghĩa ẩn giấu đằng sau những giấc mộng.",
            searchPlaceholder: "Bạn đã mơ thấy gì? (VD: Rắn, Lửa...)",
            popularTags: "Tìm kiếm phổ biến",
            modalTitle: "Giải Mã Giấc Mơ",
            detailSub: "Chi tiết giải mã",
            goodOmen: "Điềm Lành",
            badOmen: "Điềm Xấu",
            direction: "Phương hướng",
            bestTime: "Giờ tốt",
            advice: "Daily Advice",
            boostLuck: "Tăng vận may với màu sắc hôm nay",
            shopOn: "Mua ngay trên"
        },
        aiPick: {
            title: "Thợ Săn Số AI",
            subtitle: "Chọn loại vé số để AI săn tìm mục tiêu.",
            select_game: "CHỌN CHẾ ĐỘ",
            mega: "Mega 6/45",
            power: "Power 6/55",
            lotto: "Lotto 5/35",
            targeting: "ĐANG NGẮM MỤC TIÊU...",
            locked: "ĐÃ KHÓA MỤC TIÊU",
            result: "KẾT QUẢ AI",
            retry: "Bắn Lại",
            save: "Lưu Vé",
            jackpot_chance: "Tỷ lệ Jackpot: Cao"
        }
    },
    en: {
        nav: { 
            home: "Home", 
            fortune: "Fortune", 
            dream: "Dream", 
            menu: "Menu", 
            aipick: "AI Sniper" 
        },
        header: {
            homeTitle: "VinaLuck", 
            homeSub: "Today's Fortune",
            fortuneTitle: "Zodiac Selector", 
            fortuneSub: "Check Daily Luck",
            dreamTitle: "Dream Interpreter", 
            dreamSub: "Decode Nightmares",
            menuTitle: "Menu", 
            menuSub: "Extras & Info"
        },
        home: {
            jackpot: {
                label: "Jackpot Prize",
                open: "Open",
                timeLeft: "Time Left",
                current: "Current Jackpot",
                loading: "Loading...",
                drawing: "DRAWING..."
            },
            slider: {
                today: "Today",
                yesterday: "Yesterday",
                first: "First Prize",
                second: "Second Prize"
            },
            form: {
                title: "Birth Chart & Fate Analysis",
                namePlaceholder: "Enter your name...",
                male: "Male",
                female: "Female",
                dob: "Birth Date",
                tob: "Birth Time",
                unknownTime: "Unknown",
                analyze: "Analyze Fate",
                privacy: "Personal info is secure and not saved.",
                topics: {
                    money: "Money",
                    love: "Love",
                    career: "Career",
                    health: "Health",
                    exam: "Exam"
                }
            },
            dream: {
                title: "What did you dream?",
                placeholder: "e.g., Snake, Fire, Falling...",
                action: "Decode"
            },
            luck: {
                title: "Check Today's Luck",
                save: "Save",
                select: "Select Zodiac...",
                selectYear: "Select Birth Year...",
                luckyItem: "Today's Lucky Item",
                luckyColor: "Color: RED",
                shop: "Shop Red Items"
            },
            market: {
                gold: "SJC Gold",
                sell: "Sell",
                buy: "Buy",
                rate: "VCB Rate"
            },
            indexes: {
                vnIndex: "VN-Index",
                hnxIndex: "HNX-Index"
            },
            simulationHistory: "Simulation History",
            saved: "saved results",
            featuredPartner: "Featured Partner",
            partnerDesc: "Premium K-Beauty Platform.\nDiscover your glow today.",
            visitStore: "Visit Store",
            recentTickets: "Recent Saved Picks!",
            viewAll: "View All",
            noTickets: "No tickets saved yet. Try the AI Sniper now!",
            trySim: "Try AI Sniper"
        },
        menu: {
            history: "Simulation History",
            terms: "Terms of Service",
            version: "Version",
            noHistory: "No saved tickets found.",
            deleteAll: "Delete All History"
        },
        fortune: {
            selectTitle: "Choose your Zodiac",
            selectDesc: "Select your animal sign to reveal today's detailed forecast.",
            modalTitle: "Daily Fortune",
            deepTitle: "Deep Analysis",
            preciseDesc: "Precisely Calculated",
            bornIn: "Born in",
            yearLabel: "Year",
            change: "Change",
            luckyNum: "Lucky Number",
            luckyTime: "Lucky Time",
            luckyColor: "Lucky Color",
            findItem: "Find Lucky Item?",
            findItemSub: "Deep analysis to find your charm",
            analyzeNow: "Analyze Now",
            analyzing: "Analyzing...",
            reveal: "Reveal Destiny",
            buyItems: "Buy {color} Items"
        },
        zodiac: {
            rat: "Rat", ox: "Ox", tiger: "Tiger", cat: "Cat", dragon: "Dragon", snake: "Snake",
            horse: "Horse", goat: "Goat", monkey: "Monkey", rooster: "Rooster", dog: "Dog", pig: "Pig"
        },
        dream: {
            heroTitle: "Dream Interpreter",
            heroDesc: "Unlock the hidden meanings behind your dreams.",
            searchPlaceholder: "What did you dream about?",
            popularTags: "Popular Searches",
            modalTitle: "Dream Decode",
            detailSub: "Interpretation Detail",
            goodOmen: "Good Omen",
            badOmen: "Bad Omen",
            direction: "Direction",
            bestTime: "Best Time",
            advice: "Daily Advice",
            boostLuck: "Boost your luck with today's color",
            shopOn: "Shop on"
        },
        aiPick: {
            title: "AI Number Sniper",
            subtitle: "Select a lottery type for AI target acquisition.",
            select_game: "CHỌN CHẾ ĐỘ",
            mega: "Mega 6/45",
            power: "Power 6/55",
            lotto: "Lotto 5/35",
            targeting: "ĐANG NGẮM MỤC TIÊU...",
            locked: "ĐÃ KHÓA MỤC TIÊU",
            result: "KẾT QUẢ AI",
            retry: "Re-scan",
            save: "Save Ticket",
            jackpot_chance: "Jackpot Chance: High"
        }
    },
    kr: {
        nav: { 
            home: "홈", 
            fortune: "운세", 
            dream: "해몽", 
            menu: "메뉴", 
            aipick: "AI 픽"
        },
        header: {
            homeTitle: "VinaLuck", 
            homeSub: "오늘의 운세",
            fortuneTitle: "띠 선택", 
            fortuneSub: "일일 운세 확인",
            dreamTitle: "AI 꿈 해몽사", 
            dreamSub: "악몽과 길몽 해석",
            menuTitle: "메뉴", 
            menuSub: "기타 정보"
        },
        home: {
            jackpot: {
                label: "초대박 잭팟",
                open: "진행 중",
                timeLeft: "남은 시간",
                current: "현재 잭팟 금액",
                loading: "로딩 중...",
                drawing: "추첨 중..."
            },
            slider: {
                today: "오늘",
                yesterday: "어제",
                first: "1등",
                second: "2등"
            },
            form: {
                title: "사주 & 운명 분석",
                namePlaceholder: "이름을 입력하세요...",
                male: "남성",
                female: "여성",
                dob: "생년월일",
                tob: "태어난 시간",
                unknownTime: "모름",
                analyze: "운세 분석",
                privacy: "개인 정보는 안전하며 저장되지 않습니다.",
                topics: {
                    money: "재물",
                    love: "연애",
                    career: "직업",
                    health: "건강",
                    exam: "시험"
                }
            },
            dream: {
                title: "오늘 어떤 꿈을 꾸셨나요?",
                placeholder: "예: 뱀, 불, 이빨 빠짐...",
                action: "해몽"
            },
            luck: {
                title: "오늘의 운세 확인",
                save: "저장",
                select: "띠를 선택하세요...",
                selectYear: "출생 연도 선택...",
                luckyItem: "오늘의 행운 아이템",
                luckyColor: "색상: 빨강",
                shop: "빨간색 아이템 쇼핑"
            },
            market: {
                gold: "SJC 금",
                sell: "매도",
                buy: "매수",
                rate: "VCB 환율"
            },
            indexes: {
                vnIndex: "VN-Index",
                hnxIndex: "HNX-Index"
            },
            simulationHistory: "시뮬레이션 기록",
            saved: "저장됨",
            featuredPartner: "추천 파트너",
            partnerDesc: "프리미엄 K-뷰티 플랫폼.\n당신의 빛나는 아름다움을 찾아보세요.",
            visitStore: "스토어 방문",
            recentTickets: "최근 저장한 Pick!",
            viewAll: "모두 보기",
            noTickets: "저장된 티켓이 없습니다. AI 픽을 시도해보세요!",
            trySim: "AI 픽 시도하기"
        },
        menu: {
            history: "시뮬레이션 기록",
            terms: "이용 약관",
            version: "버전",
            noHistory: "저장된 티켓이 없습니다.",
            deleteAll: "모든 기록 삭제"
        },
        fortune: {
            selectTitle: "당신의 띠를 선택하세요",
            selectDesc: "오늘의 상세한 운세를 확인하려면 띠를 선택하세요.",
            modalTitle: "일일 운세",
            deepTitle: "정밀 분석",
            preciseDesc: "정밀하게 계산됨",
            bornIn: "출생 연도",
            yearLabel: "연도",
            change: "변경",
            luckyNum: "행운의 번호",
            luckyTime: "행운의 시간",
            luckyColor: "행운의 색상",
            findItem: "행운의 아이템 찾기",
            findItemSub: "수호 아이템을 찾기 위한 정밀 분석",
            analyzeNow: "지금 분석하기",
            analyzing: "분석 중...",
            reveal: "운명 확인하기",
            buyItems: "{color} 아이템 쇼핑"
        },
        zodiac: {
            rat: "쥐", ox: "소", tiger: "호랑이", cat: "고양이", dragon: "용", snake: "뱀",
            horse: "말", goat: "양", monkey: "원숭이", rooster: "닭", dog: "개", pig: "돼지"
        },
        dream: {
            heroTitle: "꿈 해몽가",
            heroDesc: "꿈 뒤에 숨겨진 의미를 풀어보세요.",
            searchPlaceholder: "어떤 꿈을 꾸셨나요?",
            popularTags: "인기 검색어",
            modalTitle: "꿈 해몽 결과",
            detailSub: "상세 해석",
            goodOmen: "길몽",
            badOmen: "흉몽",
            direction: "행운의 방향",
            bestTime: "최적의 시간",
            advice: "오늘의 조언",
            boostLuck: "오늘의 행운 색상으로 운을 높이세요",
            shopOn: "쇼핑하기"
        },
        aiPick: {
            title: "AI 번호 저격수",
            subtitle: "AI가 목표를 조준할 복권 유형을 선택하세요.",
            select_game: "모드 선택",
            mega: "메가 6/45",
            power: "파워 6/55",
            lotto: "로또 5/35",
            targeting: "목표 조준 중...",
            locked: "조준 완료",
            result: "AI 결과",
            retry: "다시 하기",
            save: "티켓 저장",
            jackpot_chance: "잭팟 확률: 높음"
        }
    }
};

export type GlobalTranslation = typeof MASTER_TRANSLATIONS['vn'];
type Tab = 'home' | 'fortune' | 'dream' | 'menu';
type ViewState = 'MAIN' | 'FORTUNE_DETAIL' | 'DREAM_DETAIL' | 'AI_SNIPER' | 'FATE_DETAIL';

// Exported for use in MenuPage
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [currentView, setCurrentView] = useState<ViewState>('MAIN');
  
  // Data States
  const [selectedFortune, setSelectedFortune] = useState<ZodiacFortune | null>(null);
  const [selectedDream, setSelectedDream] = useState<DreamInterpretation | null>(null);
  const [fateResult, setFateResult] = useState<FateResult | null>(null);
  const [isFateModalOpen, setIsFateModalOpen] = useState(false);
  
  // Track selected Zodiac for Dynamic Destiny (can be undefined if not selected)
  const [userZodiacId, setUserZodiacId] = useState<string | undefined>(undefined);
  // Track Birth Year for precise Fortune Calculations
  const [userBirthYear, setUserBirthYear] = useState<number | undefined>(undefined);
  
  // Set Default Language to Vietnamese
  const [lang, setLang] = useState<Language>('vn');
  
  // Menu View State for Deep Linking
  const [menuView, setMenuView] = useState<'menu' | 'history'>('menu');
  
  // Toast State
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  // --- PERSISTENCE LOGIC ---
  const [savedTickets, setSavedTickets] = useState<SavedTicket[]>([]);

  // Load from local storage on mount
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

      setToastMsg(lang === 'vn' ? "Đã lưu vé thành công!" : "Ticket saved successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
  };

  const handleResetHistory = () => {
      setSavedTickets([]);
      localStorage.removeItem('vina_saved_tickets');
      setToastMsg(lang === 'vn' ? "Đã xóa lịch sử!" : "History cleared!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
  };
  // -------------------------

  // Derived Translation Object
  const t = MASTER_TRANSLATIONS[lang];

  // Dynamic Font Class based on Language
  const fontClass = lang === 'vn' ? 'font-vn' : lang === 'kr' ? 'font-kr' : 'font-en';

  const handleZodiacSelect = (zodiacId: string, year?: number) => {
      setUserZodiacId(zodiacId); 
      setUserBirthYear(year);    
      
      if (FORTUNE_DATA[zodiacId]) {
          setSelectedFortune(FORTUNE_DATA[zodiacId]);
          setCurrentView('FORTUNE_DETAIL');
      }
  };

  const handleDreamSearch = (term: string) => {
      const dynamicResult = VinaLuckEngine.interpretDream(term);
      setSelectedDream(dynamicResult);
      setCurrentView('DREAM_DETAIL');
  };

  const handleOpenAiPick = () => {
      setCurrentView('AI_SNIPER');
  };

  // Shopee Click Handler
  const handleShopeeClick = () => {
      const msg = lang === 'vn' ? "Tính năng đang phát triển..."
                : lang === 'kr' ? "서비스 준비 중입니다."
                : "Feature coming soon...";
      setToastMsg(msg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
  };

  const handleShowFate = (result: FateResult) => {
      setFateResult(result);
      setIsFateModalOpen(true);
  };

  // Navigate to History Details in Menu Tab
  const handleNavigateToHistory = () => {
      setMenuView('history');
      setActiveTab('menu');
  };

  // Navigation Handler
  const handleTabChange = (tab: Tab) => {
      if (tab === 'menu') {
          setMenuView('menu');
      }
      setActiveTab(tab);
      setCurrentView('MAIN'); // Ensure we are on main view when switching tabs
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
                      t={t} 
                      onShopeeClick={handleShopeeClick} 
                      savedCount={savedTickets.length} 
                      savedTickets={savedTickets}
                      onNavigateToHistory={handleNavigateToHistory}
                      onOpenAiPick={handleOpenAiPick}
                      lang={lang}
                      onShowFate={handleShowFate}
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
                currentLang={lang} 
                onLangChange={setLang}
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
                    lang={lang}
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
                    lang={lang}
                    onShopeeClick={handleShopeeClick}
                  />
             </div>
          )}
          
          {/* Fate Modal - Lifted to App level for correct viewport coverage */}
          <FateCardModal 
              isOpen={isFateModalOpen}
              onClose={() => setIsFateModalOpen(false)}
              data={fateResult}
              t={t}
          />

        </div>
      </div>
    </div>
  );
};

export default App;
