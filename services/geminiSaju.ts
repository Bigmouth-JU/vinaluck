import { GoogleGenerativeAI, SchemaType as FunctionDeclarationSchemaType } from "@google/generative-ai";

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

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        console.log("API Key Status:", apiKey ? "Present" : "Missing");

        if (!apiKey) {
            console.error("❌ VITE_GEMINI_API_KEY is missing.");
            throw new Error("API Key is missing in environment variables.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
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

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        element_analysis: { type: FunctionDeclarationSchemaType.STRING },
                        main_prediction: { type: FunctionDeclarationSchemaType.STRING },
                        advice: { type: FunctionDeclarationSchemaType.STRING },
                        lucky_direction: { type: FunctionDeclarationSchemaType.STRING },
                        lucky_color: { type: FunctionDeclarationSchemaType.STRING }
                    },
                    required: ["element_analysis", "main_prediction", "advice", "lucky_direction", "lucky_color"]
                }
            }
        });

        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();

        // Clean Markdown if present
        let cleanedTextResponse = textResponse.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

        return JSON.parse(cleanedTextResponse) as GeminiSajuResponse;
    }
};