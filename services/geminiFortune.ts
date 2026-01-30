
import { GoogleGenAI, Type } from "@google/genai";

export interface GeminiFortuneResponse {
    score: number;
    summary: string;
    health: string;
    career: string;
    love: string;
    lucky_number: string; // e.g., "09, 82"
    lucky_color: string;
    lucky_time: string;
    action_advice: string;
}

export const GeminiFortuneService = {
    analyzeDailyFortune: async (
        name: string,
        gender: string,
        dob: { year: string; month: string; day: string; hour: string },
        zodiac: string,
        lang: 'vn' | 'en' | 'kr'
    ): Promise<GeminiFortuneResponse | null> => {
        if (!process.env.API_KEY) {
            console.warn("Gemini API Key missing.");
            return null;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const today = new Date().toLocaleDateString('vi-VN');

        let langInstruction = "Language: Vietnamese (Tiếng Việt).";
        if (lang === 'kr') langInstruction = "Language: Korean (한국어). Tone: Natural, polite, mystical.";
        if (lang === 'en') langInstruction = "Language: English. Tone: Mystical.";

        const prompt = `
        Role:
        You are "Thầy Phong Thủy" (Feng Shui Master), a respected 80-year-old sage.
        Do not speak like a machine. Use deep, literary, and metaphorical language to interpret the user's fortune.
        
        ${langInstruction}

        User Info:
        - Name: ${name}
        - Gender: ${gender === 'male' ? 'Nam' : 'Nữ'}
        - Date of Birth: ${dob.day}/${dob.month}/${dob.year} at ${dob.hour}:00
        - Zodiac Sign: ${zodiac}
        - Current Date: ${today}

        Instructions:
        1. **Storytelling:** Do not just say "Good" or "Bad". Explain "Why" using the Five Elements (Ngũ Hành) and nature metaphors (e.g., "Like rain after a drought...").
        2. **Specifics:** Give specific actionable advice, not abstract concepts.
        3. **Flow:** Mention the interaction between the user's birth data/gender and today's date (Heavenly Stems/Earthly Branches).
        4. **Tone:** Mystical, warm, encouraging, but wise.

        Output Requirement:
        Return ONLY valid JSON matching the schema below. NO Markdown formatting.
        `;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            score: { type: Type.INTEGER, description: "Score from 0 to 100" },
                            summary: { type: Type.STRING, description: "2-3 sentences poetic summary of the day" },
                            health: { type: Type.STRING, description: "Detailed storytelling about health based on elements" },
                            career: { type: Type.STRING, description: "Detailed storytelling about career/study" },
                            love: { type: Type.STRING, description: "Detailed storytelling about love/relationships considering gender" },
                            lucky_number: { type: Type.STRING, description: "Two lucky numbers, e.g., '09, 82'" },
                            lucky_color: { type: Type.STRING, description: "Lucky color name" },
                            lucky_time: { type: Type.STRING, description: "Lucky time range, e.g., '09:00 - 11:00'" },
                            action_advice: { type: Type.STRING, description: "One specific action to do today" }
                        },
                        required: ["score", "summary", "health", "career", "love", "lucky_number", "lucky_color", "lucky_time", "action_advice"]
                    }
                }
            });

            const textResponse = response.text;
            if (!textResponse) return null;

            return JSON.parse(textResponse) as GeminiFortuneResponse;

        } catch (error) {
            console.error("Failed to fetch fortune analysis:", error);
            return null;
        }
    }
};
