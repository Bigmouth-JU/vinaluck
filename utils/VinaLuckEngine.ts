
import { DreamInterpretation } from '../types';
import { FateResult, FourPillars, FiveElements } from '../components/FateCardModal';

// --- VinaLuck Logic Engine ---
// Handles deterministic RNG, Storytelling, and Lottery Logic

type Lang = 'vn' | 'en' | 'kr';

// 1. THE DREAM DATABASE (Sổ Mơ)
const DREAM_DB: Record<string, number[]> = {
    'snake': [32, 42, 72], 'rắn': [32, 42, 72], '뱀': [32, 42, 72],
    'dog': [11, 51, 91], 'chó': [11, 51, 91], '개': [11, 51, 91],
    'cat': [14, 54, 94], 'mèo': [14, 54, 94], '고양이': [14, 54, 94],
    'mouse': [15, 55, 95], 'chuột': [15, 55, 95], '쥐': [15, 55, 95],
    'tiger': [6, 46, 86], 'hổ': [6, 46, 86], '호랑이': [6, 46, 86],
    'bird': [22, 62], 'chim': [22, 62], '새': [22, 62],
    'fish': [1, 41, 81], 'cá': [1, 41, 81], '물고기': [1, 41, 81],
    'fire': [7, 27, 67, 87], 'lửa': [7, 27, 67, 87], '불': [7, 27, 67, 87],
    'water': [10, 26, 56], 'nước': [10, 26, 56], '물': [10, 26, 56],
    'money': [52, 25, 33], 'tiền': [52, 25, 33], '돈': [52, 25, 33],
    'gold': [32, 79], 'vàng': [32, 79], '금': [32, 79],
    'falling': [8, 66], 'rơi': [8, 66], '추락': [8, 66],
    'flying': [21, 12], 'bay': [21, 12], '비행': [21, 12]
};

const DREAM_IMAGES: Record<string, string> = {
    'tiger': 'https://cdn-icons-png.flaticon.com/512/1998/1998610.png',
    'animal': 'https://cdn-icons-png.flaticon.com/512/1998/1998610.png',
    'money': 'https://cdn-icons-png.flaticon.com/512/2489/2489756.png',
    'gold': 'https://cdn-icons-png.flaticon.com/512/2489/2489756.png',
    'water': 'https://cdn-icons-png.flaticon.com/512/414/414974.png',
    'rain': 'https://cdn-icons-png.flaticon.com/512/414/414974.png',
    'fire': 'https://cdn-icons-png.flaticon.com/512/785/785116.png',
    'hot': 'https://cdn-icons-png.flaticon.com/512/785/785116.png',
    'default': 'https://cdn-icons-png.flaticon.com/512/1251/1251559.png'
};

// --- MULTI-LANGUAGE FORTUNE TEMPLATES ---
const FORTUNE_TEMPLATES = {
    vn: {
        openings: [
            "Ánh bình minh hôm nay chiếu rọi qua màn sương, đánh thức nguồn năng lượng tiềm ẩn trong cung mệnh của bạn.",
            "Những vì sao chiếu mệnh đang di chuyển vào vị trí thuận lợi nhất, tạo nên một luồng vượng khí bao bọc lấy bạn.",
            "Dòng chảy năng lượng của vũ trụ hôm nay êm đềm như một con sông lớn, mang theo phù sa bồi đắp cho vận trình.",
            "Gió từ phương Đông mang theo hơi thở của sự đổi mới, xua tan những đám mây u ám để nhường chỗ cho ánh hào quang."
        ],
        wealth: [
            "Về tài lộc, hạt giống bạn gieo trồng bấy lâu nay đã bắt đầu nảy mầm, mang lại lợi nhuận bất ngờ.",
            "Công việc kinh doanh cực kỳ hanh thông, tiền bạc chảy về như nước. Đây là thời điểm vàng để mở rộng quy mô.",
            "Thần Tài đang gõ cửa với những cơ hội kiếm tiền từ các nguồn phụ, nhưng hãy giữ cái đầu lạnh.",
            "Vận may tài chính đang ở mức đỉnh điểm, một khoản thưởng nóng hoặc quà tặng giá trị đang chờ đón bạn."
        ],
        love: [
            "Trong tình cảm, sự thấu hiểu sâu sắc sẽ gắn kết hai tâm hồn. Mọi mâu thuẫn sẽ tan biến trước sự chân thành.",
            "Sự duyên dáng của bạn hôm nay sẽ thu phục được lòng người, mở ra những mối quan hệ quý nhân đắc lực.",
            "Sức khỏe tinh thần rất tốt, tỏa ra năng lượng chữa lành. Hãy dành thời gian buổi tối để hâm nóng tình cảm gia đình.",
            "Nếu còn độc thân, hôm nay là ngày tuyệt vời để mở lòng. Một cuộc gặp gỡ tình cờ có thể là nhân duyên tiền định."
        ],
        links: [
            "Toàn bộ nguồn năng lượng cát tường này đang hội tụ trọn vẹn vào Con Số May Mắn hiển thị bên dưới.",
            "Vũ trụ đã gửi gắm thông điệp thịnh vượng thông qua những con số được tính toán riêng cho bạn.",
            "Sự kết tinh của vận may ngày hôm nay nằm chính xác ở bộ số gợi ý bên dưới, hãy nắm bắt ngay.",
            "Những con số may mắn dưới đây là chìa khóa được số mệnh sắp đặt để bạn mở cánh cửa tài lộc."
        ]
    },
    en: {
        openings: [
            "The morning sun illuminates your zodiac house, signaling a powerful cycle of renewal and vitality.",
            "Celestial bodies align perfectly today, creating a protective aura of positive energy around your spirit.",
            "The universe's energy flows like a calm river today, bringing fertile opportunities to your life's path.",
            "A fresh breeze from the East blows away uncertainty, clearing the path for your brilliant success."
        ],
        wealth: [
            "Financially, seeds you planted long ago are finally sprouting. Expect unexpected returns from past efforts.",
            "Business prospects are flowing smoothly like water. It is a golden time to expand or sign important contracts.",
            "Fortune knocks on your door with side-income opportunities. Stay grounded to distinguish real gold from glitter.",
            "Your financial luck is peaking. A bonus or valuable gift is making its way to you right now."
        ],
        love: [
            "In relationships, unspoken understanding will bond souls together. Small conflicts vanish before sincerity.",
            "Your charisma is magnetic today, attracting helpful people and noble benefactors to your cause.",
            "Your mental well-being radiates healing energy. Spend the evening warming up family connections.",
            "If single, open your heart today. A chance encounter could lead to a destined connection."
        ],
        links: [
            "This entire auspicious energy converges perfectly into the Lucky Numbers displayed below.",
            "The universe sends a message of prosperity through these specific numbers calculated just for you.",
            "Today's crystallized luck lies precisely in the number set below. Seize the opportunity.",
            "The numbers below are not random; they are keys arranged by destiny to open your door to wealth."
        ]
    },
    kr: {
        openings: [
            "아침 햇살이 당신의 별자리를 비추며, 새로운 활력과 재생의 주기가 시작됨을 알립니다.",
            "오늘 천체의 기운이 완벽하게 정렬되어, 당신의 영혼을 감싸는 긍정적인 보호막을 형성합니다.",
            "우주의 기운이 마치 고요한 강물처럼 흘러, 당신의 인생 여정에 비옥한 기회를 가져다줍니다.",
            "동쪽에서 불어오는 상서로운 바람이 불확실성을 걷어내고, 찬란한 성공의 길을 열어줍니다."
        ],
        wealth: [
            "재물운을 보면, 오래전 뿌린 씨앗이 드디어 싹을 틔웁니다. 과거의 노력에서 뜻밖의 보상을 기대하세요.",
            "사업운이 물 흐르듯 순조롭습니다. 규모를 확장하거나 중요한 계약을 체결하기에 황금 같은 시기입니다.",
            "부수입의 기회가 문을 두드립니다. 하지만 진짜 기회를 잡기 위해 냉철한 판단력을 유지하세요.",
            "금전운이 절정에 달했습니다. 보너스나 귀한 선물이 지금 당신에게 다가오고 있습니다."
        ],
        love: [
            "애정 전선에서는 말 없는 이해가 영혼을 결속시킵니다. 진심 앞에서 사소한 갈등은 눈 녹듯 사라집니다.",
            "오늘 당신의 매력은 자석과 같아서, 귀인과 조력자들을 당신의 곁으로 끌어당깁니다.",
            "당신의 정신적 건강이 치유의 에너지를 발산합니다. 저녁에는 가족과의 따뜻한 시간을 보내세요.",
            "싱글이라면 오늘 마음을 활짝 여세요. 우연한 만남이 운명적인 인연으로 이어질 수 있습니다."
        ],
        links: [
            "이 모든 상서로운 기운이 아래에 표시된 행운의 숫자로 완벽하게 수렴됩니다.",
            "우주는 당신만을 위해 계산된 이 숫자들을 통해 번영의 메시지를 전하고 있습니다.",
            "오늘의 결정체 같은 행운이 아래 숫자 세트에 담겨 있습니다. 기회를 놓치지 마세요.",
            "아래의 숫자들은 우연이 아닙니다. 운명이 당신에게 건네는 부의 열쇠입니다."
        ]
    }
};

// --- MULTI-LANGUAGE DREAM TEMPLATES ---
const DREAM_TEMPLATES = {
    vn: {
        generic: [
            "Giấc mơ này là tấm gương phản chiếu tâm thức sâu thẳm của bạn, báo hiệu một sự chuyển dịch năng lượng sắp tới.",
            "Những hình ảnh trong mơ cho thấy trực giác của bạn đang rất nhạy bén, hãy lắng nghe tiếng nói bên trong.",
            "Vũ trụ đang gửi tín hiệu để bạn chuẩn bị đón nhận những cơ hội mới hoặc thay đổi quan trọng."
        ],
        snake: [
            "Rắn trong giấc mơ là biểu tượng của sự tái sinh và quyền lực ngầm. Một sự lột xác ngoạn mục đang chờ đợi bạn.",
            "Về mặt tài lộc, rắn thường mang đến điềm báo về những khoản tiền bất ngờ hoặc sự thăng tiến địa vị.",
            "Tuy nhiên, hãy cẩn trọng trong các mối quan hệ xã giao, có thể có sự đố kỵ đang ẩn giấu đâu đó."
        ],
        fire: [
            "Ngọn lửa trong mơ đại diện cho khát vọng cháy bỏng và năng lượng dương mạnh mẽ đang trỗi dậy trong bạn.",
            "Đây là điềm báo cho sự thăng hoa trong sự nghiệp hoặc danh tiếng, công sức của bạn sắp được tỏa sáng.",
            "Nhưng lửa cũng cảnh báo về sự nóng vội. Hãy giữ cái đầu lạnh để kiểm soát sức mạnh này một cách khôn ngoan."
        ]
    },
    en: {
        generic: [
            "This dream is a mirror reflecting your deep consciousness, signaling an upcoming shift in energy.",
            "The images in your dream suggest your intuition is sharp right now; listen to your inner voice.",
            "The universe is sending signals for you to prepare for new opportunities or significant changes."
        ],
        snake: [
            "A snake in a dream is a symbol of rebirth and hidden power. A spectacular transformation awaits you.",
            "Financially, snakes often omen unexpected wealth or a rise in status.",
            "However, be cautious in social relationships, as hidden envy might be lurking nearby."
        ],
        fire: [
            "Fire in a dream represents burning desire and strong yang energy rising within you.",
            "This omens an ascent in career or fame; your efforts are about to shine brightly.",
            "But fire also warns of impatience. Keep a cool head to control this power wisely."
        ]
    },
    kr: {
        generic: [
            "이 꿈은 당신의 깊은 의식을 비추는 거울이며, 다가오는 에너지의 변화를 알립니다.",
            "꿈속의 이미지는 당신의 직관이 매우 예리함을 보여줍니다. 내면의 목소리에 귀를 기울이세요.",
            "우주가 새로운 기회나 중요한 변화를 받아들일 준비를 하라는 신호를 보내고 있습니다."
        ],
        snake: [
            "꿈속의 뱀은 재생과 숨겨진 힘의 상징입니다. 놀라운 변화가 당신을 기다리고 있습니다.",
            "재물운 측면에서 뱀은 종종 뜻밖의 횡재나 지위 상승을 예고합니다.",
            "하지만 대인 관계에서는 조심하세요. 주변에 숨겨진 질투가 있을 수 있습니다."
        ],
        fire: [
            "꿈속의 불은 불타오르는 열망과 당신 안에서 솟아오르는 강한 양의 에너지를 상징합니다.",
            "이는 경력이나 명성의 상승을 예고하며, 당신의 노력이 곧 빛을 발할 것입니다.",
            "하지만 불은 성급함을 경고하기도 합니다. 이 힘을 현명하게 통제하기 위해 냉정함을 유지하세요."
        ]
    }
};

const REPORT_TEMPLATES = {
    vn: {
        overview: "Tổng Quan Bản Mệnh",
        analysis: "Phân Tích Chuyên Sâu",
        advice: "Lời Khuyên & Hành Động",
        forecast: "Biểu Đồ Vận Trình",
        dominant: (e: string, p: number) => `Bát tự của bạn cho thấy sự vượng khí của hành **${e}** (${p}%) đang chi phối cục diện. Điều này biểu thị bạn là người có ý chí mạnh mẽ và khả năng thích ứng cao.`,
        weak: (e: string) => `Tuy nhiên, hành **${e}** đang bị suy yếu, cần chú ý cân bằng để tránh những biến động không đáng có trong tâm lý.`,
        body1: (yS: string, yB: string, concern: string) => `Thiên can ${yS} kết hợp với địa chi ${yB} năm sinh tạo nên một nền tảng vững chắc.${concern} Quẻ dịch cho thấy thời điểm này là lúc "ẩn mình chờ thời" hoặc "bung sức bứt phá" tùy thuộc vào sự lựa chọn của bạn.`,
        body2: (dom: string, gen: string) => `Nếu bạn đang do dự, hãy nhớ rằng **${dom}** sinh **${gen}**, nghĩa là cơ hội sẽ đến từ những mối quan hệ cũ hoặc kỹ năng bạn đã bỏ quên. Đừng vội vàng tin vào những lời hứa hẹn hoa mỹ.`,
        tips: [
            "Củng cố nội lực: Tập trung vào việc trau dồi kỹ năng cốt lõi trong tháng này.",
            "Hóa giải xung khắc: Sử dụng các vật phẩm màu sắc hợp mệnh để cân bằng năng lượng.",
            "Thời điểm vàng: Các quyết định quan trọng nên được thực hiện vào giờ hoàng đạo."
        ],
        months: ["Biến động nhẹ, cần giữ tiền bạc cẩn thận.", "Quý nhân xuất hiện, công việc hanh thông.", "Sức khỏe dồi dào, tinh thần minh mẫn."],
        elements: { kim: "Kim", moc: "Mộc", thuy: "Thủy", hoa: "Hỏa", tho: "Thổ" }
    },
    en: {
        overview: "Fate Overview",
        analysis: "Deep Analysis",
        advice: "Advice & Action",
        forecast: "Forecast",
        dominant: (e: string, p: number) => `Your Bazi chart shows that **${e}** energy (${p}%) is dominant. This indicates a strong will and high adaptability.`,
        weak: (e: string) => `However, **${e}** energy is weak. You need to balance this to avoid unnecessary psychological fluctuations.`,
        body1: (yS: string, yB: string, concern: string) => `The combination of Heavenly Stem ${yS} and Earthly Branch ${yB} creates a solid foundation.${concern} The oracle suggests this is a time to either "lie low" or "break through" depending on your choice.`,
        body2: (dom: string, gen: string) => `If you are hesitant, remember that **${dom}** generates **${gen}**. Opportunities will come from old relationships or forgotten skills. Do not trust flowery promises too quickly.`,
        tips: [
            "Strengthen Inner Power: Focus on honing core skills this month.",
            "Resolve Conflict: Use lucky items to balance your energy field.",
            "Golden Timing: Make important decisions during your auspicious hours."
        ],
        months: ["Slight fluctuations, handle money with care.", "Noble people appear, work goes smoothly.", "Abundant health, clear mind."],
        elements: { kim: "Metal", moc: "Wood", thuy: "Water", hoa: "Fire", tho: "Earth" }
    },
    kr: {
        overview: "사주 총평",
        analysis: "정밀 분석",
        advice: "조언 및 행동",
        forecast: "운세 흐름",
        dominant: (e: string, p: number) => `사주팔자 분석 결과 **${e}** 기운(${p}%)이 지배적입니다. 이는 당신이 강한 의지와 높은 적응력을 가졌음을 의미합니다.`,
        weak: (e: string) => `그러나 **${e}** 기운이 약하므로, 심리적인 기복을 피하기 위해 균형을 맞춰야 합니다.`,
        body1: (yS: string, yB: string, concern: string) => `천간 ${yS}와 지지 ${yB}의 조화가 튼튼한 기반을 형성합니다.${concern} 괘상은 지금이 당신의 선택에 따라 "때를 기다릴" 시기이거나 "돌파할" 시기임을 암시합니다.`,
        body2: (dom: string, gen: string) => `망설이고 있다면, **${dom}**이 **${gen}**을 생(生)한다는 것을 기억하세요. 기회는 오래된 인연이나 잊혀진 기술에서 올 것입니다. 화려한 약속을 너무 빨리 믿지 마세요.`,
        tips: [
            "내공 강화: 이번 달은 핵심 역량을 연마하는 데 집중하세요.",
            "상극 해소: 행운의 색상 아이템을 사용하여 에너지를 균형 있게 만드세요.",
            "황금 시간: 중요한 결정은 길한 시간에 내리는 것이 좋습니다."
        ],
        months: ["약간의 변동이 있으니 금전 관리에 유의하세요.", "귀인이 나타나 일이 순조롭게 풀립니다.", "건강이 넘치고 정신이 맑아집니다."],
        elements: { kim: "금(金)", moc: "목(木)", thuy: "수(水)", hoa: "화(火)", tho: "토(土)" }
    }
};

class SeededRNG {
    private seed: number;
    constructor(seed: number) { this.seed = seed; }
    next(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
    range(min: number, max: number): number { return min + Math.floor(this.next() * (max - min + 1)); }
    pick<T>(array: T[]): T { return array[this.range(0, array.length - 1)]; }
}

const ZODIAC_ORDER = ['rat', 'ox', 'tiger', 'cat', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];

export const VinaLuckEngine = {
    getZodiacFromYear: (year: number): string => {
        const index = (year - 4) % 12;
        return ZODIAC_ORDER[index];
    },

    getDreamImage: (keyword: string): string => {
        const key = keyword.toLowerCase();
        if (DREAM_IMAGES[key]) return DREAM_IMAGES[key];
        if (['money', 'gold', 'rich', 'tiền', 'vàng', '돈', '금'].some(k => key.includes(k))) return DREAM_IMAGES['money'];
        if (['water', 'rain', 'sea', 'nước', 'mưa', 'biển', '물'].some(k => key.includes(k))) return DREAM_IMAGES['water'];
        if (['fire', 'burn', 'sun', 'lửa', 'cháy', '불'].some(k => key.includes(k))) return DREAM_IMAGES['fire'];
        if (['tiger', 'dog', 'cat', 'snake', 'hổ', 'chó', 'mèo', 'rắn', '호랑이', '개', '고양이', '뱀'].some(k => key.includes(k))) return DREAM_IMAGES['animal'];
        return DREAM_IMAGES['default'];
    },

    analyzeDream: (input: string, zodiacId: string = 'generic'): number[] => {
        const keyword = input.toLowerCase().trim();
        const now = new Date();
        const seedString = `${keyword}-${now.getDate()}-${now.getHours()}-${zodiacId}`;
        let hash = 0;
        for (let i = 0; i < seedString.length; i++) {
            hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
        }
        const rng = new SeededRNG(Math.abs(hash));
        let baseNumbers: number[] = [];
        
        // Simple fuzzy match for DB
        const dbKey = Object.keys(DREAM_DB).find(k => keyword.includes(k));
        if (dbKey && DREAM_DB[dbKey]) baseNumbers = [...DREAM_DB[dbKey]];

        const results = new Set<number>();
        if (baseNumbers.length > 0) {
            results.add(baseNumbers[0]);
            if (baseNumbers.length > 1 && rng.next() > 0.4) results.add(baseNumbers[1]);
        }
        while (results.size < 6) results.add(rng.range(1, 55));
        return Array.from(results).sort((a, b) => a - b);
    },

    interpretDream: (input: string, lang: Lang = 'vn'): DreamInterpretation => {
        const keyword = input.trim();
        const lowerKey = keyword.toLowerCase();
        const luckyNumbersArray = VinaLuckEngine.analyzeDream(keyword);
        const luckyNumbersStr = luckyNumbersArray.slice(0, 3).map(n => n.toString().padStart(2, '0')).join(' - ');
        
        const now = new Date();
        const seed = input.length + now.getHours() + now.getDate();
        const rng = new SeededRNG(seed);
        const isGood = rng.next() > 0.4;
        const omen = isGood ? 'Good' : 'Bad';
        
        // --- NARRATIVE GENERATION (Language Enforced) ---
        const templates = DREAM_TEMPLATES[lang] || DREAM_TEMPLATES['vn'];
        let storyParts = templates.generic;
        
        // Naive keyword matching for story selection
        if (['snake', 'rắn', '뱀'].some(k => lowerKey.includes(k))) storyParts = templates.snake || templates.generic;
        else if (['fire', 'lửa', '불', 'cháy'].some(k => lowerKey.includes(k))) storyParts = templates.fire || templates.generic;
        
        const fullDescription = `${storyParts[0]}\n\n${storyParts[1]}\n\n${storyParts[2]}`;
        // ----------------------------

        const directions = {
            vn: ['Bắc', 'Nam', 'Đông', 'Tây', 'Đông Bắc'],
            en: ['North', 'South', 'East', 'West', 'North-East'],
            kr: ['북쪽', '남쪽', '동쪽', '서쪽', '북동쪽']
        };
        
        const colors = {
            vn: ['Đỏ', 'Vàng', 'Xanh', 'Trắng', 'Tím'],
            en: ['Red', 'Gold', 'Blue', 'White', 'Purple'],
            kr: ['빨강', '황금', '파랑', '흰색', '보라']
        };

        const direction = rng.pick(directions[lang] || directions['vn']);
        const color = rng.pick(colors[lang] || colors['vn']);
        
        const adviceList = {
            vn: { do: `Mang theo vật phẩm màu ${color}`, avoid: "Nơi đông người ồn ào" },
            en: { do: `Carry a ${color} item`, avoid: "Noisy crowded places" },
            kr: { do: `${color}색 물건 소지하기`, avoid: "시끄러운 장소 피하기" }
        };
        const advice = adviceList[lang] || adviceList['vn'];

        return {
            id: `dream-${Date.now()}`,
            keyword: keyword.charAt(0).toUpperCase() + keyword.slice(1),
            vietnameseKeyword: lowerKey, // In UI this is sometimes used as subtitle
            type: ['snake', 'tiger', 'dog', 'cat', 'mouse', 'buffalo', 'pig', 'rắn', 'hổ', 'chó', 'mèo', '뱀', '호랑이', '개'].some(a => lowerKey.includes(a)) ? 'animal' : 'abstract',
            imageUrl: VinaLuckEngine.getDreamImage(lowerKey),
            icon: 'auto_awesome',
            omen: omen as 'Good' | 'Bad',
            description: fullDescription,
            luckyNumbers: luckyNumbersStr,
            direction: direction,
            time: `${rng.range(6, 22)}:00`,
            advice: advice,
            luckyItem: { 
                name: lang === 'vn' ? `Đồ vật màu ${color}` : lang === 'kr' ? `${color}색 아이템` : `${color} Item`,
                action: lang === 'vn' ? 'Mua' : lang === 'kr' ? '구매' : 'Buy',
                color: color.toUpperCase() 
            }
        };
    },

    getDailyFortune: (zodiacId: string, birthYear?: number, deepStats?: { month: number; day: number; hour: number }, lang: Lang = 'vn') => {
        const now = new Date();
        const dateStr = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`;
        const currentHour = now.getHours();
        let seed = parseInt(dateStr) + currentHour + zodiacId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        if (birthYear) seed += birthYear * 13;
        
        let isDeep = false;
        if (deepStats) {
            isDeep = true;
            const deepMix = (deepStats.month * 100 + deepStats.day) * (deepStats.hour + 1);
            seed = (seed * 31 + deepMix) ^ 0xDEADBEEF;
        }
        
        const rng = new SeededRNG(Math.abs(seed));
        const luckyNumber = rng.range(1, 99).toString().padStart(2, '0');
        const stars = isDeep ? rng.range(4, 5) : rng.range(3, 5);
        
        // Colors
        const colors = [
            { code: '#ef4444', names: { vn: 'Đỏ', en: 'Red', kr: '빨강' } }, 
            { code: '#FFCD00', names: { vn: 'Vàng', en: 'Gold', kr: '황금' } }, 
            { code: '#3b82f6', names: { vn: 'Xanh Dương', en: 'Blue', kr: '파랑' } }, 
            { code: '#22c55e', names: { vn: 'Xanh Lá', en: 'Green', kr: '초록' } }, 
            { code: '#a855f7', names: { vn: 'Tím', en: 'Purple', kr: '보라' } }, 
            { code: '#f97316', names: { vn: 'Cam', en: 'Orange', kr: '주황' } }
        ];
        const colorObj = colors[rng.range(0, colors.length - 1)];
        const colorName = colorObj.names[lang];

        // --- ASSEMBLE RICH NARRATIVE (Localized) ---
        const templates = FORTUNE_TEMPLATES[lang] || FORTUNE_TEMPLATES['vn'];
        
        const opening = rng.pick(templates.openings);
        const wealth = rng.pick(templates.wealth);
        const love = rng.pick(templates.love);
        const link = rng.pick(templates.links);
        
        const fortuneStory = `${opening}\n\n${wealth} ${love}\n\n${link}`;
        const deepPrefix = lang === 'vn' ? '[Phân Tích Sâu] ' : lang === 'kr' ? '[정밀 분석] ' : '[Deep Analysis] ';

        const startHour = rng.range(6, 20);
        const time = `${startHour}:00 - ${startHour + 2}:00`;

        return {
            luckyNumber,
            stars,
            fortuneText: isDeep ? `${deepPrefix}${fortuneStory}` : fortuneStory,
            luckyColor: colorName,
            luckyColorCode: colorObj.code,
            luckyTime: time,
            forYear: birthYear,
            isDeep
        };
    },

    generateSmartLotto: (type: 'mega' | 'power' | 'lotto', seedNumbers: string[]): string[] => {
        const max = type === 'mega' ? 45 : type === 'power' ? 55 : 35;
        const count = type === 'lotto' ? 5 : 6;
        const resultPool = new Set<number>();
        for (const seed of seedNumbers) {
            const num = parseInt(seed);
            if (!isNaN(num) && num > 0 && num <= max) {
                resultPool.add(num);
                if (resultPool.size >= count) break;
            }
        }
        while (resultPool.size < count) resultPool.add(Math.floor(Math.random() * max) + 1);
        return Array.from(resultPool).sort((a, b) => a - b).map(n => n.toString().padStart(2, '0'));
    },

    // --- PRO SAJU REPORT GENERATION ---
    analyzeFate: (name: string, gender: string, day: string, month: string, year: string, time: string, topic: string, specificConcern?: string, lang: Lang = 'vn'): FateResult => {
        // Create a complex seed from inputs
        const inputString = `${name}${gender}${day}${month}${year}${time}${topic}${specificConcern}`;
        let seed = 0;
        for (let i = 0; i < inputString.length; i++) {
            seed = inputString.charCodeAt(i) + ((seed << 5) - seed);
        }
        const rng = new SeededRNG(Math.abs(seed));

        // Generate Lucky Numbers (6 numbers, range 1-55 for lottery compatibility)
        const luckyNumbers: string[] = [];
        const numSet = new Set<number>();
        while(numSet.size < 6) {
            numSet.add(rng.range(1, 55));
        }
        numSet.forEach(n => luckyNumbers.push(n.toString().padStart(2, '0')));
        luckyNumbers.sort((a,b) => parseInt(a) - parseInt(b));

        // Generate 5 Elements Stats (must sum to 100 roughly, randomized for effect)
        let kim = rng.range(10, 40);
        let moc = rng.range(10, 40);
        let thuy = rng.range(10, 40);
        let hoa = rng.range(10, 40);
        let tho = rng.range(10, 40);
        const total = kim + moc + thuy + hoa + tho;
        const scale = 100 / total;
        
        const fiveElements: FiveElements = {
            kim: Math.floor(kim * scale),
            moc: Math.floor(moc * scale),
            thuy: Math.floor(thuy * scale),
            hoa: Math.floor(hoa * scale),
            tho: Math.floor(tho * scale)
        };

        // Determine Dominant Element for narrative
        const entries = Object.entries(fiveElements);
        entries.sort((a, b) => b[1] - a[1]);
        const dominant = entries[0][0]; // 'kim', 'moc', etc.
        const weak = entries[entries.length - 1][0];

        // Generate Four Pillars (Mock Data but deterministically based on input)
        // We use the RNG to pick a "Stem" and "Zodiac" for each pillar
        const STEMS = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
        const BRANCHES = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
        
        const fourPillars: FourPillars = {
            year: { stem: STEMS[rng.range(0, 9)], branch: VinaLuckEngine.getZodiacFromYear(parseInt(year)).charAt(0).toUpperCase() + VinaLuckEngine.getZodiacFromYear(parseInt(year)).slice(1) }, // Use actual zodiac for year
            month: { stem: STEMS[rng.range(0, 9)], branch: BRANCHES[rng.range(0, 11)] },
            day: { stem: STEMS[rng.range(0, 9)], branch: BRANCHES[rng.range(0, 11)] },
            time: { stem: STEMS[rng.range(0, 9)], branch: BRANCHES[rng.range(0, 11)] }
        };

        // --- GENERATE "GRANDMASTER" TEXT (MARKDOWN) - LOCALIZED ---
        const tmpl = REPORT_TEMPLATES[lang] || REPORT_TEMPLATES['vn'];
        const eMap = tmpl.elements as any;
        
        const concernText = specificConcern ? ` (${specificConcern})` : "";
        
        const topicMap: Record<string, string> = {
            money: lang === 'vn' ? "Tài Lộc & Công Danh" : lang === 'kr' ? "재물 & 명예" : "Wealth & Career",
            love: lang === 'vn' ? "Tình Duyên & Gia Đạo" : lang === 'kr' ? "사랑 & 가정" : "Love & Family",
            career: lang === 'vn' ? "Sự Nghiệp & Thăng Tiến" : lang === 'kr' ? "직업 & 승진" : "Career & Promotion",
            health: lang === 'vn' ? "Sức Khỏe & Bình An" : lang === 'kr' ? "건강 & 평안" : "Health & Safety",
            exam: lang === 'vn' ? "Thi Cử & Học Vấn" : lang === 'kr' ? "시험 & 학업" : "Exam & Study",
            relation: lang === 'vn' ? "Các Mối Quan Hệ" : lang === 'kr' ? "대인 관계" : "Relationships"
        };
        const selectedTopic = topicMap[topic] || topicMap.money;

        // Generate dynamic parts
        const generatedByDom = (dominant === 'kim' ? 'thuy' : dominant === 'thuy' ? 'moc' : dominant === 'moc' ? 'hoa' : dominant === 'hoa' ? 'tho' : 'kim');

        const markdownReport = `
## ${tmpl.overview}
${tmpl.dominant(eMap[dominant], fiveElements[dominant as keyof FiveElements])} ${tmpl.weak(eMap[weak])}

## ${tmpl.analysis}: ${selectedTopic}
${tmpl.body1(fourPillars.year.stem, fourPillars.year.branch, concernText)}

${tmpl.body2(eMap[dominant], eMap[generatedByDom])}

## ${tmpl.advice}
1. **1:** ${tmpl.tips[0]}
2. **2:** ${tmpl.tips[1]}
3. **3:** ${tmpl.tips[2]}

## ${tmpl.forecast} (3 Months)
* **M+1:** ${tmpl.months[0]}
* **M+2:** ${tmpl.months[1]}
* **M+3:** ${tmpl.months[2]}
        `;

        return {
            name: name,
            info: `${gender === 'male' ? (lang === 'vn' ? 'Nam' : lang === 'kr' ? '남성' : 'Male') : (lang === 'vn' ? 'Nữ' : lang === 'kr' ? '여성' : 'Female')} • ${day}/${month}/${year}`,
            advice: markdownReport.trim(),
            luckyNumbers: luckyNumbers,
            fiveElements: fiveElements,
            fourPillars: fourPillars
        };
    }
};
