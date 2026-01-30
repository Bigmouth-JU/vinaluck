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
        
        // Use process.env.API_KEY as per environment requirements
        if (!process.env.API_KEY) {
            console.warn("❌ API Key missing.");
            return null;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const today = new Date().toLocaleDateString('vi-VN');

        let langInstruction = "Language: Vietnamese (Tiếng Việt).";
        if (lang === 'kr') langInstruction = "Language: Korean (한국어).";
        if (lang === 'en') langInstruction = "Language: English.";

        const prompt = `
        Role: Feng Shui Master (80yo sage).
        User: ${name} (${gender}), DOB: ${dob.day}/${dob.month}/${dob.year}, Zodiac: ${zodiac}. Date: ${today}.
        ${langInstruction}
        Task: Daily fortune with metaphors. 
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
                            score: { type: Type.INTEGER },
                            summary: { type: Type.STRING },
                            health: { type: Type.STRING },
                            career: { type: Type.STRING },
                            love: { type: Type.STRING },
                            lucky_number: { type: Type.STRING },
                            lucky_color: { type: Type.STRING },
                            lucky_time: { type: Type.STRING },
                            action_advice: { type: Type.STRING }
                        },
                        required: ["score", "summary", "health", "career", "love", "lucky_number", "lucky_color", "lucky_time", "action_advice"]
                    }
                }
            });

            // Handle potential difference in text access method
            const textResponse = response.text;
            if (!textResponse) return null;
            return JSON.parse(textResponse) as GeminiFortuneResponse;
        } catch (error) {
            console.error("❌ Fortune Error:", error);
            return null;
        }
    }
};