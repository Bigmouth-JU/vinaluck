import { GoogleGenAI, Type } from "@google/genai";

export interface GeminiDreamResponse {
    summary: string;
    detailed_analysis: string;
    lucky_numbers: string[];
    action_advice: string;
}

export const GeminiDreamService = {
    interpretDream: async (dreamText: string, emotion: string, lang: 'vn' | 'en' | 'kr'): Promise<GeminiDreamResponse | null> => {

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        console.log("API Key Status:", apiKey ? "Present" : "Missing");

        if (!apiKey) {
            console.warn("❌ VITE_GEMINI_API_KEY is missing.");
            throw new Error("API Key is missing in environment variables.");
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

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

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
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
        if (!textResponse) throw new Error("Empty response from Gemini.");
        return JSON.parse(textResponse) as GeminiDreamResponse;
    }
};