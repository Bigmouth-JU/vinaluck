import { GoogleGenAI, Type } from "@google/genai";

export interface GeminiSajuResponse {
    element_analysis: string;
    main_prediction: string;
    advice: string;
    lucky_direction: string;
    lucky_color: string;
}

export const GeminiSajuService = {
    analyzeFate: async (
        name: string,
        gender: string,
        birthDay: string,
        birthMonth: string,
        birthYear: string,
        birthTime: string,
        category: string,
        userQuestion: string,
        lang: 'vn' | 'en' | 'kr'
    ): Promise<GeminiSajuResponse | null> => {
        
        console.log("Saju Service Started");
        
        // Use process.env.API_KEY as per coding guidelines
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const currentDate = new Date().toLocaleDateString('vi-VN');

        let langInstruction = "Language: Vietnamese (Tiếng Việt).";
        if (lang === 'kr') langInstruction = "Language: Korean (한국어). Tone: Natural, polite, mystical.";
        if (lang === 'en') langInstruction = "Language: English. Tone: Mystical.";

        const prompt = `
        You are a legendary Master of 'Bát Tự' (Four Pillars) and I Ching.
        User: ${name} (${gender}), Born: ${birthDay}/${birthMonth}/${birthYear} ${birthTime}:00.
        Context: ${category}, Question: "${userQuestion}".
        Date: ${currentDate}.
        
        Task: Analyze Five Elements (Kim, Mộc, Thủy, Hỏa, Thổ). 
        Answer the specific worry or predict the category trend.
        Tone: Mystical, nature metaphors (e.g., "Like a strong tree in winter").
        ${langInstruction}
        
        IMPORTANT: Return ONLY valid JSON. No markdown formatting.
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
                            element_analysis: { type: Type.STRING },
                            main_prediction: { type: Type.STRING },
                            advice: { type: Type.STRING },
                            lucky_direction: { type: Type.STRING },
                            lucky_color: { type: Type.STRING }
                        },
                        required: ["element_analysis", "main_prediction", "advice", "lucky_direction", "lucky_color"]
                    }
                }
            });

            const textResponse = response.text;
            if (!textResponse) return null;
            return JSON.parse(textResponse) as GeminiSajuResponse;
        } catch (error) {
            console.error("❌ Saju Error:", error);
            return null;
        }
    }
};