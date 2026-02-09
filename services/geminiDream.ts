import { GoogleGenerativeAI, SchemaType as FunctionDeclarationSchemaType } from "@google/generative-ai";

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

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        summary: { type: FunctionDeclarationSchemaType.STRING },
                        detailed_analysis: { type: FunctionDeclarationSchemaType.STRING },
                        lucky_numbers: { type: FunctionDeclarationSchemaType.ARRAY, items: { type: FunctionDeclarationSchemaType.STRING } },
                        action_advice: { type: FunctionDeclarationSchemaType.STRING }
                    },
                    required: ["summary", "detailed_analysis", "lucky_numbers", "action_advice"]
                }
            }
        });

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

        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();
        return JSON.parse(textResponse) as GeminiDreamResponse;
    }
};