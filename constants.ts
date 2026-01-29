
import { ZodiacFortune, ZodiacAnimal, DreamInterpretation } from "./types";

export const IMAGES = {
    QR_CODE: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyf0kh57WWHUNwPcLDGiewH3aWBxjArHc1aEhdkmA3figOkbY2nAgHlBEsO_nt-OtwtBL0xfUIupAzYSiYtl3cCgYJIxfWAJmreaen3dVuajo6_h5lOAyiST3mOqTQ0gi1WOQsJ5JHNo6R30j1ABFNcz8eBakT4TNxxtJEKqzhPv0k35kaxDbmyPYUz-yvODh4TOhw6ZCm9WV4rah1GkTG1ZLpskf5l-QfQ6kUsCNGVyAd5S_s0iJpY818JGCQ5Xzzt8_83x69m-w",
    // Custom Ink Wash Style Zodiac Assets
    // Updated to Lowercase for exact filename matching as requested
    RAT: "/assets/zodiac/rat.png",
    OX: "/assets/zodiac/cow.png", // File is named cow.png
    TIGER: "/assets/zodiac/tiger.png",
    CAT: "/assets/zodiac/cat.png",
    DRAGON: "/assets/zodiac/dragon.png",
    SNAKE: "/assets/zodiac/snake.png",
    HORSE: "/assets/zodiac/horse.png",
    GOAT: "/assets/zodiac/goat.png",
    MONKEY: "/assets/zodiac/monkey.png",
    ROOSTER: "/assets/zodiac/rooster.png",
    DOG: "/assets/zodiac/dog.png",
    PIG: "/assets/zodiac/pig.png"
};

export const ZODIACS: ZodiacAnimal[] = [
    { id: 'rat', name: 'Rat', image: IMAGES.RAT },
    { id: 'ox', name: 'Ox', image: IMAGES.OX },
    { id: 'tiger', name: 'Tiger', image: IMAGES.TIGER },
    { id: 'cat', name: 'Cat', image: IMAGES.CAT },
    { id: 'dragon', name: 'Dragon', image: IMAGES.DRAGON },
    { id: 'snake', name: 'Snake', image: IMAGES.SNAKE },
    { id: 'horse', name: 'Horse', image: IMAGES.HORSE },
    { id: 'goat', name: 'Goat', image: IMAGES.GOAT },
    { id: 'monkey', name: 'Monkey', image: IMAGES.MONKEY },
    { id: 'rooster', name: 'Rooster', image: IMAGES.ROOSTER },
    { id: 'dog', name: 'Dog', image: IMAGES.DOG },
    { id: 'pig', name: 'Pig', image: IMAGES.PIG },
];

export const FORTUNE_DATA: Record<string, ZodiacFortune> = {
    rat: { id: 'rat', name: 'Rat', year: '1996', vietnameseYear: 'Bính Tý', image: IMAGES.RAT, stars: 4, fortuneText: "Opportunities for wealth accumulation are high. Focus on long-term investments rather than quick wins.", luckyNumber: '04', luckyTime: '08 - 10 AM', luckyColor: 'Blue', luckyColorCode: '#3b82f6' },
    ox: { id: 'ox', name: 'Ox', year: '1997', vietnameseYear: 'Đinh Sửu', image: IMAGES.OX, stars: 3, fortuneText: "Hard work will pay off, but be careful with health. Take breaks when needed.", luckyNumber: '17', luckyTime: '11 - 13 PM', luckyColor: 'Green', luckyColorCode: '#22c55e' },
    tiger: { id: 'tiger', name: 'Tiger', year: '1998', vietnameseYear: 'Mậu Dần', image: IMAGES.TIGER, stars: 5, fortuneText: "Your charisma is at its peak. A great day for networking and bold moves.", luckyNumber: '68', luckyTime: '13 - 15 PM', luckyColor: 'Orange', luckyColorCode: '#f97316' },
    cat: { id: 'cat', name: 'Cat', year: '1999', vietnameseYear: 'Kỷ Mão', image: IMAGES.CAT, stars: 4, fortuneText: "Intuition is sharp today. Trust your gut feeling in financial matters.", luckyNumber: '29', luckyTime: '07 - 09 AM', luckyColor: 'Purple', luckyColorCode: '#a855f7' },
    dragon: { id: 'dragon', name: 'Dragon', year: '1988', vietnameseYear: 'Mậu Thìn', image: IMAGES.DRAGON, stars: 5, fortuneText: "Your celestial alignment suggests a powerful surge in creative energy today. While career prospects shine bright, exercise patience in family matters. A small investment made now could yield surprising returns by evening.", luckyNumber: '88', luckyTime: '09 - 11 AM', luckyColor: 'Gold', luckyColorCode: '#FFCD00' },
    snake: { id: 'snake', name: 'Snake', year: '1989', vietnameseYear: 'Kỷ Tỵ', image: IMAGES.SNAKE, stars: 3, fortuneText: "Changes are coming. Adaptability is your best asset today. Watch out for minor misunderstandings.", luckyNumber: '06', luckyTime: '15 - 17 PM', luckyColor: 'Red', luckyColorCode: '#ef4444' },
    horse: { id: 'horse', name: 'Horse', year: '1990', vietnameseYear: 'Canh Ngọ', image: IMAGES.HORSE, stars: 4, fortuneText: "Travel or movement brings good luck. Don't stay in one place for too long.", luckyNumber: '12', luckyTime: '11 - 13 PM', luckyColor: 'Brown', luckyColorCode: '#a16207' },
    goat: { id: 'goat', name: 'Goat', year: '1991', vietnameseYear: 'Tân Mùi', image: IMAGES.GOAT, stars: 3, fortuneText: "Creativity flows well, but emotional sensitivity is high. Surround yourself with positive people.", luckyNumber: '33', luckyTime: '13 - 15 PM', luckyColor: 'Pink', luckyColorCode: '#ec4899' },
    monkey: { id: 'monkey', name: 'Monkey', year: '1992', vietnameseYear: 'Nhâm Thân', image: IMAGES.MONKEY, stars: 4, fortuneText: "Quick wit solves a complex problem at work. A surprise gift might be on the way.", luckyNumber: '55', luckyTime: '15 - 17 PM', luckyColor: 'Yellow', luckyColorCode: '#eab308' },
    rooster: { id: 'rooster', name: 'Rooster', year: '1993', vietnameseYear: 'Quý Dậu', image: IMAGES.ROOSTER, stars: 3, fortuneText: "Organization is key. Clear the clutter to clear your mind for new opportunities.", luckyNumber: '01', luckyTime: '17 - 19 PM', luckyColor: 'Gray', luckyColorCode: '#6b7280' },
    dog: { id: 'dog', name: 'Dog', year: '1994', vietnameseYear: 'Giáp Tuất', image: IMAGES.DOG, stars: 4, fortuneText: "Loyalty is rewarded. A friend may need your help, which brings good karma.", luckyNumber: '11', luckyTime: '19 - 21 PM', luckyColor: 'Black', luckyColorCode: '#000000' },
    pig: { id: 'pig', name: 'Pig', year: '1995', vietnameseYear: 'Ất Hợi', image: IMAGES.PIG, stars: 5, fortuneText: "Enjoy the good things in life today. Financial luck is strong in the evening.", luckyNumber: '99', luckyTime: '21 - 23 PM', luckyColor: 'Cyan', luckyColorCode: '#06b6d4' },
};

export const DREAM_DATA: Record<string, DreamInterpretation> = {
    snake: {
        id: 'snake',
        keyword: 'Snake',
        vietnameseKeyword: 'Con Rắn',
        type: 'animal',
        imageUrl: IMAGES.SNAKE,
        omen: 'Good',
        description: "Unexpected wealth is coming your way. Trust your intuition, as hidden opportunities are revealing themselves today.",
        luckyNumbers: '32 - 72',
        direction: 'South',
        time: '10:00 AM',
        advice: {
            do: "Wear Green accessories to amplify luck.",
            avoid: "Avoid arguing with colleagues today."
        },
        luckyItem: {
            name: 'Green Items',
            action: 'Shop Green Items',
            color: 'GREEN'
        }
    },
    falling: {
        id: 'falling',
        keyword: 'Falling',
        vietnameseKeyword: 'Rơi ngã',
        type: 'abstract',
        icon: 'flight', 
        omen: 'Bad',
        description: "Insecurity is clouding your mind. Be careful with decisions.",
        luckyNumbers: '08 - 66',
        direction: 'North',
        time: '22:00 PM',
        advice: {
            do: "Stay grounded. Call your family.",
            avoid: "High places and risky investments."
        },
        luckyItem: {
            name: 'Black Onyx',
            action: 'Find Black Onyx',
            color: 'BLACK'
        }
    }
};
