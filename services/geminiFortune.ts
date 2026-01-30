import { GoogleGenAI, Type } from "@google/genai";

export interface GeminiFortuneResponse {
    score: number;
    summary: string;
    health: string;
    career: string;
    love: string;
    lucky_number: string;
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
        
        // System Requirement: Must use process.env.API_KEY for the preview environment
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            console.warn("❌ API Key missing.");
            return null;
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });
        const today = new Date().toLocaleDateString('vi-VN');

        let langInstruction = "Language: Vietnamese (Tiếng Việt).";
        if (lang === 'kr') langInstruction = "Language: Korean (한국어).";
        if (lang === 'en') langInstruction = "Language: English.";

        // CRITICAL: Force detailed responses via prompt engineering
        const prompt = `
        Role: Legendary Feng Shui Master (80 years old). 
        Task: Provide a DEEP, DETAILED daily fortune analysis.
        User: ${name} (${gender}), DOB: ${dob.day}/${dob.month}/${dob.year}, Zodiac: ${zodiac}. Date: ${today}.
        ${langInstruction}

        CRITICAL INSTRUCTIONS:
        1. **NO BREVITY**: Each section (Health, Career, Love) MUST be at least 3-4 sentences long.
        2. **FIVE ELEMENTS**: Explain "Why" using Ngũ Hành (Metal, Wood, Water, Fire, Earth) logic.
        3. **TONE**: Mystical, poetic, empathetic, and wise. Use nature metaphors (wind, flowing water, strong mountains).
        4. **STRUCTURE**:
           - Summary: A poetic overview of the day's energy.
           - Career: Detailed advice on work, investment, and obstacles.
           - Love: Detailed analysis of relationships, family harmony, or romance.
           - Health: Specific advice on physical and mental well-being based on the elements.
        
        Return ONLY valid JSON.
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
                            score: { type: Type.INTEGER, description: "Daily luck score from 0 to 100" },
                            summary: { type: Type.STRING, description: "General overview (min 3 sentences)" },
                            health: { type: Type.STRING, description: "Detailed health advice (min 3 sentences)" },
                            career: { type: Type.STRING, description: "Detailed career advice (min 3 sentences)" },
                            love: { type: Type.STRING, description: "Detailed love advice (min 3 sentences)" },
                            lucky_number: { type: Type.STRING },
                            lucky_color: { type: Type.STRING },
                            lucky_time: { type: Type.STRING },
                            action_advice: { type: Type.STRING, description: "One specific actionable tip" }
                        },
                        required: ["score", "summary", "health", "career", "love", "lucky_number", "lucky_color", "lucky_time", "action_advice"]
                    }
                }
            });

            const textResponse = response.text;
            if (!textResponse) return null;
            return JSON.parse(textResponse) as GeminiFortuneResponse;
        } catch (error) {
            console.error("❌ Fortune Error:", error);
            return null;
        }
    }
};