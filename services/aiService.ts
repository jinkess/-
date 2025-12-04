import { GoogleGenAI } from "@google/genai";
import { Room } from '../types';

export const generateHotelResponse = async (
  prompt: string, 
  currentRooms: Room[]
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "请在环境中配置 API_KEY 以使用 AI 助手。";
    }

    const ai = new GoogleGenAI({ apiKey });

    // Construct a context-aware system instruction
    const roomSummary = currentRooms.map(r => 
      `房号 ${r.number} (${r.type}): ${r.status}${r.guest ? ` - 客人: ${r.guest.name}` : ''}`
    ).join('\n');

    const systemInstruction = `
      You are an intelligent hotel management assistant for 'HotelPro'.
      
      Current Hotel Status (Snapshot):
      ${roomSummary}
      
      Your capabilities:
      1. Answer questions about room availability, specific guest details, or occupancy rates.
      2. Suggest room upgrades or operational priorities (e.g., "Which rooms need cleaning?").
      3. Respond in a professional, helpful tone suitable for hotel staff.
      4. Always answer in Chinese unless asked otherwise.
      
      User request: ${prompt}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "抱歉，我暂时无法获取回答。";
  } catch (error) {
    console.error("AI Error:", error);
    return "AI 服务暂时不可用。";
  }
};