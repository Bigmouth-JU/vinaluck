import { GoogleGenerativeAI, SchemaType as FunctionDeclarationSchemaType } from "@google/generative-ai";

export interface ZodiacFortune {
    overview: string;
    love: string;
    money: string;
    health: string;
    lucky_color: string;
    lucky_number: string;
    lucky_time: string;
}

export const GeminiFortuneService = {
    analyzeDailyFortune: async (
        name: string,
        gender: string,
        userInput: string,
        zodiacSign: string,
        lang: 'vn' | 'en' | 'kr'
    ): Promise<ZodiacFortune | null> => {

        console.log("Fortune Service Started");

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        console.log("API Key Status:", apiKey ? "Present" : "Missing");

        if (!apiKey) {
            console.warn("❌ VITE_GEMINI_API_KEY is missing.");
            throw new Error("API Key is missing in environment variables.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        let langInstruction = "Language: Vietnamese (Tiếng Việt).";
        if (lang === 'kr') langInstruction = "Language: Korean (한국어).";
        if (lang === 'en') langInstruction = "Language: English.";

        const prompt = `
        Role: Master Fortune Teller.
        User: ${name} (${gender}), Zodiac: ${zodiacSign}.
        Input: "${userInput}".
        ${langInstruction}
        Tone: Mystical, encouraging.
        Return ONLY valid JSON.
        `;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-001",
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        overview: { type: FunctionDeclarationSchemaType.STRING },
                        love: { type: FunctionDeclarationSchemaType.STRING },
                        money: { type: FunctionDeclarationSchemaType.STRING },
                        health: { type: FunctionDeclarationSchemaType.STRING },
                        lucky_color: { type: FunctionDeclarationSchemaType.STRING },
                        lucky_number: { type: FunctionDeclarationSchemaType.STRING },
                        lucky_time: { type: FunctionDeclarationSchemaType.STRING }
                    },
                    required: ["overview", "love", "money", "health", "lucky_color", "lucky_number", "lucky_time"]
                }
            }
        });

        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();

        // Clean Markdown if present (though responseMimeType should prevent it, safety first)
        let cleanedTextResponse = textResponse.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

        return JSON.parse(cleanedTextResponse) as ZodiacFortune;
    }
};