import { GoogleGenAI, Type } from "@google/genai";

// 인터페이스 정의
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

        // 🔑 [핵심 수정] Vite 환경에 맞는 API 키 가져오기
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            console.error("❌ API 키가 없습니다. .env 파일을 확인하거나 버셀 설정을 확인하세요.");
            return null;
        }

        // SDK 초기화
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const currentDate = new Date().toLocaleDateString('vi-VN');

        let langInstruction = "Language: Vietnamese (Tiếng Việt).";
        if (lang === 'kr') langInstruction = "Language: Korean (한국어). Tone: Natural, polite, mystical.";
        if (lang === 'en') langInstruction = "Language: English. Tone: Mystical.";

        const prompt = `
        You are a legendary Master of 'Bát Tự' (Four Pillars) and I Ching.
        
        **User Profile:**
        - Name: ${name} (${gender === 'male' ? 'Nam' : 'Nữ'})
        - Born: ${birthDay}/${birthMonth}/${birthYear} roughly at ${birthTime}:00
        - Current Date: ${currentDate}
        
        **Focus Context:**
        - Category of Interest: ${category}
        - User's Specific Worry/Question: "${userQuestion}"
        
        **Instructions:**
        1. **Analyze:** Briefly calculate the Balance of Five Elements (Ngũ Hành) based on the birth date. Determine the "Day Master" (Nhật Chủ) if possible.
        2. **Interpretation:** - If "User's Specific Worry" is provided, answer it directly using the element analysis.
           - If it is empty, provide a detailed prediction about the '${category}' for the current year/month.
        3. **Tone:** Mystical, profound, empathetic, but clear. Use metaphors of nature (e.g., 'Like a big tree needing water', 'Like a fire burning too hot').
        4. **Language:** ${langInstruction}

        **Output Requirement:**
        Return ONLY valid JSON matching the schema below. NO Markdown.
        `;

        try {
            // 🚀 [모델 수정] 기획자님이 원하신 최신 3.0 모델 적용!
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            element_analysis: {
                                type: Type.STRING,
                                description: "Briefly describe their dominant element."
                            },
                            main_prediction: {
                                type: Type.STRING,
                                description: "Deep, metaphorical storytelling answering their worry or predicting the category topic. (3-4 sentences)"
                            },
                            advice: {
                                type: Type.STRING,
                                description: "Specific action advice for the next month."
                            },
                            lucky_direction: {
                                type: Type.STRING,
                                description: "Best direction (e.g., Đông Nam)."
                            },
                            lucky_color: {
                                type: Type.STRING,
                                description: "Lucky color name."
                            }
                        },
                        required: ["element_analysis", "main_prediction", "advice", "lucky_direction", "lucky_color"]
                    }
                }
            });

            // 응답 처리 (안전하게 텍스트 추출)
            const textResponse = typeof response.text === 'function' ? response.text() : response.text;
            if (!textResponse) return null;

            return JSON.parse(textResponse) as GeminiSajuResponse;

        } catch (error) {
            console.error("❌ 사주 분석 실패:", error);
            return null;
        }
    }
};