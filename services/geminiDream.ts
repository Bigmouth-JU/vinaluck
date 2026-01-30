import { GoogleGenAI, Type } from "@google/genai";

export interface GeminiDreamResponse {
    summary: string;
    detailed_analysis: string;
    lucky_numbers: string[];
    action_advice: string;
}

export const GeminiDreamService = {
    interpretDream: async (dreamText: string, emotion: string, lang: 'vn' | 'en' | 'kr'): Promise<GeminiDreamResponse | null> => {

        // 🚨 [수정 핵심] process.env 대신 import.meta.env 사용 (이게 없어서 안 됐던 겁니다!)
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("❌ Gemini API Key missing. Check .env or Vercel settings.");
            return null;
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

        let langInstruction = "Language: Vietnamese (Tiếng Việt).";
        if (lang === 'kr') langInstruction = "Language: Korean (한국어). Tone: Natural, polite, mystical.";
        if (lang === 'en') langInstruction = "Language: English. Tone: Mystical.";

        const prompt = `
        You are a famous Fortune Teller and Dream Expert (Thầy Giải Mã Giấc Mơ). 
        Interpret the user's dream based on their description and emotional state.

        Input:
        - Dream: "${dreamText}"
        - Emotion: "${emotion}"

        ${langInstruction}
        Tone: Mystical, respectful, empathetic.
        `;

        try {
            const response = await ai.models.generateContent({
                // ✅ 기획자님이 선택하신 최신 모델 그대로 사용
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            summary: {
                                type: Type.STRING,
                                description: "One sentence summary (e.g., 'Điềm báo về tài lộc sắp đến.')"
                            },
                            detailed_analysis: {
                                type: Type.STRING,
                                description: "Deep cultural analysis explaining why this dream is good/bad based on the emotion. Use mystical but comforting tone."
                            },
                            lucky_numbers: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: "List of lucky numbers as strings (e.g. ['10', '25'])"
                            },
                            action_advice: {
                                type: Type.STRING,
                                description: "Specific advice for today (e.g., Be careful with fire, buy a lottery ticket ending in 7)."
                            }
                        },
                        required: ["summary", "detailed_analysis", "lucky_numbers", "action_advice"]
                    }
                }
            });

            // 안전한 텍스트 추출 (혹시 모를 SDK 호환성 이슈 방지)
            const textResponse = typeof response.text === 'function' ? response.text() : response.text;

            if (!textResponse) return null;

            return JSON.parse(textResponse) as GeminiDreamResponse;

        } catch (error) {
            console.error("Failed to fetch dream interpretation:", error);
            return null;
        }
    }
};