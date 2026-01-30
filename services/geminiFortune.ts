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
        
        // Use process.env.API_KEY as per coding guidelines
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const today = new Date().toLocaleDateString('vi-VN');

        let langInstruction = "Language: Vietnamese (Tiếng Việt).";
        if (lang === 'kr') langInstruction = "Language: Korean (한국어).";
        if (lang === 'en') langInstruction = "Language: English.";

        // ENHANCED PROMPT: Force lengthy, detailed storytelling
        const prompt = `
        Role: You are a Talkative, Mystical 80-year-old Feng Shui Master. 
        You speak with wisdom, using metaphors of nature (Water flowing, Fire burning, Wind blowing).
        
        Task: Provide a DEEP, DETAILED daily fortune analysis. Do NOT be brief.
        User: ${name} (${gender}), DOB: ${dob.day}/${dob.month}/${dob.year}, Zodiac: ${zodiac}. Date: ${today}.
        ${langInstruction}

        CRITICAL INSTRUCTIONS FOR LENGTH & DEPTH:
        1. **WRITE LONG PARAGRAPHS**: Each section (Health, Career, Love) MUST be a minimum of 3-4 full sentences.
        2. **USE FIVE ELEMENTS**: Explain "Why" something is happening using Ngũ Hành (Metal, Wood, Water, Fire, Earth).
           - Example: "Because Fire melts Metal, you might feel..."
        3. **TONE**: Poetic, empathetic, and wise. Treat the user like your grandchild.
        4. **STRUCTURE**:
           - **Summary**: A poetic overview of the day's energy field.
           - **Career**: Detailed advice on work/investment. Mention obstacles and specific opportunities.
           - **Love**: Detailed analysis of relationships. Mention harmony, conflict, or romance.
           - **Health**: Specific advice on physical/mental well-being based on the elements.
        
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
                            summary: { type: Type.STRING, description: "General overview (min 3-4 sentences)" },
                            health: { type: Type.STRING, description: "Detailed health advice (min 3-4 sentences)" },
                            career: { type: Type.STRING, description: "Detailed career advice (min 3-4 sentences)" },
                            love: { type: Type.STRING, description: "Detailed love advice (min 3-4 sentences)" },
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