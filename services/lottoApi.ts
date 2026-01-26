
// --- LOTTO DATA SERVICE ---
// Edit this file to manually update results globally.

export interface LottoResult {
    id: 'power' | 'mega' | 'lotto';
    name: string;
    drawId: string;
    drawDate: string; // e.g., "21/01/2026"
    jackpot: string; // Full numeric string, e.g. "29.100.546.500 VNĐ"
    winningNumbers: string[];
    bonusNumber?: string | null;
    nextDrawTime: string; // ISO String for countdown
    
    // UI Theme Config
    theme: {
        bg: string;
        text: string;
        subText: string;
        jackpotColor: string;
        iconBg: string;
        badgeBg: string;
        borderColor: string;
    }
}

// Helper: Get strictly VN Time
const getVNTime = (): Date => {
    const now = new Date();
    const vnTimeStr = now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
    return new Date(vnTimeStr);
};

// --- ADMIN HOOK: MANUAL DATA STORE ---
// We calculate these based on current execution time but technically should be static if we want perfect manual control.
// For now, we simulate upcoming dates.
const NOW_VN = getVNTime();
const NEXT_DRAW_POWER = new Date(NOW_VN.getTime() + 1000 * 60 * 60 * 5); // 5 hours from now
const NEXT_DRAW_MEGA = new Date(NOW_VN.getTime() + 1000 * 60 * 60 * 28); // 28 hours from now

export const MANUAL_DATA_STORE: LottoResult[] = [
    {
        id: 'mega',
        name: "Mega 6/45",
        drawId: "#01461",
        drawDate: "21/01/2026",
        jackpot: "29.100.546.500 VNĐ",
        winningNumbers: ['02', '15', '22', '38', '41', '45'],
        bonusNumber: null,
        nextDrawTime: NEXT_DRAW_MEGA.toISOString(),
        theme: {
            bg: "bg-[#ED1C24]",
            borderColor: "border-red-500",
            text: "text-white",
            subText: "text-white/80",
            jackpotColor: "text-[#F9D423]",
            iconBg: "bg-white/20 border-white/20",
            badgeBg: "bg-black/20 border-white/10"
        }
    },
    {
        id: 'power',
        name: "Power 6/55",
        drawId: "#01297",
        drawDate: "20/01/2026",
        jackpot: "30.000.000.000 VNĐ",
        winningNumbers: ['08', '19', '24', '31', '42', '51'],
        bonusNumber: '09',
        nextDrawTime: NEXT_DRAW_POWER.toISOString(),
        theme: {
            bg: "bg-[linear-gradient(135deg,#F7C51D_0%,#F9D423_100%)]",
            borderColor: "border-yellow-400",
            text: "text-red-900",
            subText: "text-red-800/80",
            jackpotColor: "text-red-950",
            iconBg: "bg-red-900/5 border-red-900/10",
            badgeBg: "bg-red-900/10 border-red-900/10"
        }
    },
    {
        id: 'lotto',
        name: "Lotto 5/35",
        drawId: "#00415",
        drawDate: "22/01/2026",
        jackpot: "7.492.597.500 VNĐ",
        winningNumbers: ['05', '12', '28', '33', '41'],
        bonusNumber: '44',
        nextDrawTime: new Date().toISOString(), 
        theme: {
            bg: "bg-[#00A651]",
            borderColor: "border-green-500",
            text: "text-white",
            subText: "text-white/80",
            jackpotColor: "text-[#F9D423]",
            iconBg: "bg-white/20 border-white/20",
            badgeBg: "bg-black/20 border-white/10"
        }
    }
];

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQD9lMMO5laDEfZcq4Bhk82Uc4G9rTCCEoMUyCDBSnNFYglaxbEFMY6szLOzfpl3hpsKMLbqN9tCy2s/pub?output=csv';

export const LottoService = {
    getAllResults: async (): Promise<LottoResult[]> => {
        return LottoService.fetchLiveLotteryData();
    },

    fetchLiveLotteryData: async (): Promise<LottoResult[]> => {
        try {
            const response = await fetch(CSV_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const text = await response.text();
            // Parse CSV: Split by lines, then by comma. Expecting: TYPE, DATE, NUMBERS, JACKPOT
            const rows = text.split('\n').map(row => row.split(',').map(c => c.trim()));

            const liveData: LottoResult[] = [];
            const processedTypes = new Set<string>();

            rows.forEach(row => {
                // Ensure we have at least 4 columns
                if (row.length < 4) return;

                const [typeRaw, dateRaw, numbersRaw, jackpotRaw] = row;
                
                // Determine ID based on Type string
                let id: 'power' | 'mega' | 'lotto' | null = null;
                const typeUpper = typeRaw.toUpperCase();
                
                if (typeUpper.includes('POWER')) id = 'power';
                else if (typeUpper.includes('MEGA')) id = 'mega';
                else if (typeUpper.includes('LOTTO')) id = 'lotto';

                if (!id) return; // Skip unknown types or header

                // Find the base template to keep theme/config consistent
                const template = MANUAL_DATA_STORE.find(item => item.id === id);
                if (!template) return;

                // Parse Numbers: Handle "05 12 23 | 09" (Main | Bonus) or "05 12 23" (Main only)
                let winningNumbers: string[] = [];
                let bonusNumber: string | null = null;

                // Remove extra quotes if CSV adds them
                const cleanNumbers = numbersRaw.replace(/['"]/g, '');

                if (cleanNumbers.includes('|')) {
                    const parts = cleanNumbers.split('|');
                    winningNumbers = parts[0].trim().split(/\s+/).filter(n => n.length > 0);
                    bonusNumber = parts[1].trim();
                } else {
                    winningNumbers = cleanNumbers.trim().split(/\s+/).filter(n => n.length > 0);
                }

                liveData.push({
                    ...template,
                    drawDate: dateRaw,
                    winningNumbers,
                    bonusNumber,
                    jackpot: jackpotRaw.replace(/['"]/g, ''), // Ensure no CSV artifacts
                });
                
                processedTypes.add(id);
            });

            // If CSV is missing any game type, fallback to manual data for that specific game
            MANUAL_DATA_STORE.forEach(manualItem => {
                if (!processedTypes.has(manualItem.id)) {
                    liveData.push(manualItem);
                }
            });

            return liveData;

        } catch (error) {
            console.error("Failed to fetch live lottery data, using fallback.", error);
            return MANUAL_DATA_STORE;
        }
    },

    calculateTimeLeft: (targetDateStr: string, drawingLabel: string = "DRAWING..."): string => {
        const target = new Date(targetDateStr).getTime();
        const now = getVNTime().getTime();
        const diff = target - now;

        if (diff <= 0) return drawingLabel;

        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
};
