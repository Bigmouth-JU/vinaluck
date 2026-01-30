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
        
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            console.warn("❌ API_KEY is missing.");
            return null;
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });
        const today = new Date().toLocaleDateString('vi-VN');

        let langInstruction = "Language: Vietnamese (Tiếng Việt).";
        if (lang === 'kr') langInstruction = "Language: Korean (한국어).";
        if (lang === 'en') langInstruction = "Language: English.";

        const prompt = `
        IMPORTANT: You are a Talkative, Mystical 80-year-old Feng Shui Master. 
        Your answers must be LONG and DETAILED. Never be brief.
        
        User: ${name} (${gender}), DOB: ${dob.day}/${dob.month}/${dob.year}, Zodiac: ${zodiac}. Date: ${today}.
        ${langInstruction}

        CRITICAL INSTRUCTIONS FOR LENGTH & DEPTH:
        1. **WRITE LONG PARAGRAPHS**: Write at least 4-5 full sentences for EVERY section (Health, Career, Love, Summary).
        2. **USE FIVE ELEMENTS (Ngũ Hành)**: Explain the "Why" using Metal, Wood, Water, Fire, Earth logic.
           - Example: "Because today's Water energy nourishes your Wood element, you will feel..."
        3. **TONE**: Poetic, empathetic, and wise. Use nature metaphors (e.g., "Like a boat sailing against the wind").
        4. **NO SHORT ANSWERS**: If you write a short answer, the user will be unhappy. Be verbose.
        
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
                            summary: { type: Type.STRING, description: "A long, poetic overview of the day's energy (min 50 words)." },
                            health: { type: Type.STRING, description: "Detailed health advice using Five Elements logic (min 4 sentences)." },
                            career: { type: Type.STRING, description: "Detailed career storytelling with specific metaphors (min 4 sentences)." },
                            love: { type: Type.STRING, description: "Detailed relationship analysis involving harmony and conflict (min 4 sentences)." },
                            lucky_number: { type: Type.STRING },
                            lucky_color: { type: Type.STRING },
                            lucky_time: { type: Type.STRING },
                            action_advice: { type: Type.STRING, description: "One specific, mystical actionable tip." }
                        },
                        required: ["score", "summary", "health", "career", "love", "lucky_number", "lucky_color", "lucky_time", "action_advice"]
                    },
                    safetySettings: [
                        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
                    ]
                }
            });

            let textResponse = response.text;
            if (!textResponse) return null;

            // Clean Markdown (```json ... ```)
            textResponse = textResponse.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

            return JSON.parse(textResponse) as GeminiFortuneResponse;
        } catch (error) {
            console.error("❌ Fortune Error:", error);
            return null;
        }
    }
};