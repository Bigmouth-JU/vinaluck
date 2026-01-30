
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'vn' | 'en' | 'kr';

const MASTER_TRANSLATIONS = {
    vn: {
        nav: { 
            home: "Trang Chủ", 
            fortune: "Tử Vi", 
            dream: "Giải Mộng", 
            menu: "MENU", 
            aipick: "Thợ Săn Số"
        },
        header: {
            homeTitle: "VinaLuck",
            homeSub: "Today's Fortune", // Exception: English
            fortuneTitle: "Chọn Con Giáp", 
            fortuneSub: "Xem tử vi hàng ngày",
            dreamTitle: "Giải Mã Giấc Mơ",
            dreamSub: "Điềm báo từ giấc mộng",
            menuTitle: "Menu", 
            menuSub: "Tiện ích mở rộng"
        },
        home: {
            jackpot: {
                label: "Jackpot", // Exception: English
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
                placeholder: "Mô tả chi tiết giấc mơ...",
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
            buyItems: "Mua đồ màu {color}",
            // NEW KEYS
            ctaTitle: "Phân Tích Vận Mệnh Chuyên Sâu",
            ctaSub: "Nhập ngày giờ sinh để nhận kết quả chính xác hơn",
            sheetBtn: "Phân Tích Chi Tiết",
            coreAdvice: "Lời Khuyên Cốt Lõi",
            interpretedByAi: "Luận giải bởi AI"
        },
        zodiac: {
            rat: "Tý", ox: "Sửu", tiger: "Dần", cat: "Mão", dragon: "Thìn", snake: "Tỵ",
            horse: "Ngọ", goat: "Mùi", monkey: "Thân", rooster: "Dậu", dog: "Tuất", pig: "Hợi"
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
            title: "AI PICK", // Exception: English
            subtitle: "Chọn loại vé số để AI săn tìm mục tiêu.",
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
    en: {
        nav: { 
            home: "Home", 
            fortune: "Fortune", 
            dream: "Dream", 
            menu: "MENU", // Exception: English
            aipick: "AI Sniper" 
        },
        header: {
            homeTitle: "VinaLuck", 
            homeSub: "Today's Fortune", // Exception: English
            fortuneTitle: "Zodiac Selector", 
            fortuneSub: "Check Daily Luck",
            dreamTitle: "Dream Interpreter", 
            dreamSub: "Decode Nightmares",
            menuTitle: "Menu", 
            menuSub: "Extras & Info"
        },
        home: {
            jackpot: {
                label: "Jackpot", // Exception: English
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
                placeholder: "Describe your dream in detail...",
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
            buyItems: "Buy {color} Items",
            // NEW KEYS
            ctaTitle: "Deep Personal Fortune Analysis",
            ctaSub: "Enter birth details for higher accuracy",
            sheetBtn: "Deep Analysis",
            coreAdvice: "Core Advice",
            interpretedByAi: "Interpreted by AI"
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
            title: "AI PICK", // Exception: English
            subtitle: "Select a lottery type for AI target acquisition.",
            select_game: "CHỌN CHẾ ĐỘ",
            mega: "Mega 6/45",
            power: "Power 6/55",
            lotto: "Lotto 5/35",
            targeting: "Targeting...",
            locked: "Target Locked",
            result: "AI Result",
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
            menu: "MENU", // Exception: English
            aipick: "AI 픽"
        },
        header: {
            homeTitle: "VinaLuck", 
            homeSub: "Today's Fortune", // Exception: English
            fortuneTitle: "띠 선택", 
            fortuneSub: "일일 운세 확인",
            dreamTitle: "AI 꿈 해몽사", 
            dreamSub: "악몽과 길몽 해석",
            menuTitle: "메뉴", 
            menuSub: "기타 정보"
        },
        home: {
            jackpot: {
                label: "Jackpot", // Exception: English
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
            buyItems: "{color} 아이템 쇼핑",
            // NEW KEYS
            ctaTitle: "나만을 위한 정밀 사주 분석",
            ctaSub: "생년월일시를 입력하고 더 정확한 결과를 확인하세요",
            sheetBtn: "정밀 분석",
            coreAdvice: "핵심 조언",
            interpretedByAi: "운세 분석"
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
            title: "AI PICK", // Exception: English
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

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: GlobalTranslation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('vn');

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: MASTER_TRANSLATIONS[language] }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
