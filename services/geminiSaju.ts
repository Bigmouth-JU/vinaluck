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
        
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            console.error("❌ API_KEY is missing.");
            return null;
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });
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
        
        IMPORTANT: Return ONLY valid JSON. No markdown formatting outside the JSON string values.
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
            
            return JSON.parse(textResponse) as GeminiSajuResponse;
        } catch (error) {
            console.error("❌ Saju Error:", error);
            return null;
        }
    }
};