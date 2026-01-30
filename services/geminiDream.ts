import { GoogleGenAI, Type } from "@google/genai";

export interface GeminiDreamResponse {
    summary: string;
    detailed_analysis: string;
    lucky_numbers: string[];
    action_advice: string;
}

export const GeminiDreamService = {
    interpretDream: async (dreamText: string, emotion: string, lang: 'vn' | 'en' | 'kr'): Promise<GeminiDreamResponse | null> => {
        
        if (!process.env.API_KEY) {
            console.warn("❌ API Key missing.");
            return null;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        let langInstruction = "Language: Vietnamese (Tiếng Việt).";
        if (lang === 'kr') langInstruction = "Language: Korean (한국어).";
        if (lang === 'en') langInstruction = "Language: English.";

        const prompt = `
        Role: Fortune Teller/Dream Expert.
        Dream: "${dreamText}", Emotion: "${emotion}".
        ${langInstruction}
        Tone: Mystical, respectful.
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
                            summary: { type: Type.STRING },
                            detailed_analysis: { type: Type.STRING },
                            lucky_numbers: { type: Type.ARRAY, items: { type: Type.STRING } },
                            action_advice: { type: Type.STRING }
                        },
                        required: ["summary", "detailed_analysis", "lucky_numbers", "action_advice"]
                    }
                }
            });

            const textResponse = response.text;
            if (!textResponse) return null;
            return JSON.parse(textResponse) as GeminiDreamResponse;
        } catch (error) {
            console.error("❌ Dream Error:", error);
            return null;
        }
    }
};