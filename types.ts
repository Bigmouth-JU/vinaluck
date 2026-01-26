export interface LotteryResult {
    id: string;
    name: string;
    date: string;
    drawNumber: string;
    numbers: string[];
    specialNumber?: string;
    type: 'mega' | 'power' | 'max3d';
}

export interface ZodiacAnimal {
    id: string;
    name: string;
    image: string; // Renamed from imageUrl
    lucky?: boolean;
    emoji?: string;
}

export interface MarketRate {
    name: string;
    value: string;
    change: string;
    isPositive: boolean;
    subLabel?: string;
}

export interface ZodiacFortune {
    id: string;
    name: string;
    year: string;
    vietnameseYear: string;
    image: string; // Renamed from imageUrl
    stars: number;
    fortuneText: string;
    luckyNumber: string;
    luckyTime: string;
    luckyColor: string;
    luckyColorCode: string; // Hex code for dynamic styling
}

export interface DreamInterpretation {
    id: string;
    keyword: string;
    vietnameseKeyword: string;
    type: 'animal' | 'abstract';
    imageUrl?: string; // Kept as imageUrl for Dreams
    icon?: string; // For abstract type (Material Symbol name)
    omen: 'Good' | 'Bad';
    description: string;
    luckyNumbers: string;
    direction: string;
    time: string;
    advice: {
        do: string;
        avoid: string;
    };
    luckyItem: {
        name: string;
        action: string;
        color: string;
    };
}