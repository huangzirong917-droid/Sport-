import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const apiKey = process.env.GEMINI_API_KEY; 
    if (!apiKey) {
        return res.status(500).json({ error: "尚未設定 Gemini API Key" });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const today = new Date();
    const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `今天是${dateStr}。請扮演頂級專業運彩分析師。請務必透過網路搜尋今天真實開打的運動賽事（如美職MLB等，嚴格過濾休兵日，絕對不要瞎掰）。請提供：
            1. 「公開免費區」：今日精選 1 場真實開打的單場賽事與深度分析、主推建議。
            2. 「VIP 區」：今日真實開打的多場賽事清單，以及勝率最高的核心黃金串關（三串一）。
            請用清晰的排版回傳。`,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        res.status(200).json({ 
            success: true, 
            date: dateStr, 
            analysis: response.text 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
