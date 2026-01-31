import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeClientMessage = async (
  taskType: 'email_update' | 'social_caption' | 'general_chat' | 'task_checklist',
  projectContext: string,
  userPrompt?: string
) => {
  if (!apiKey) {
    console.warn("No API Key found");
    return {
      generatedText: "Simulation Mode: Ensure API key is set to generate real AI copy.",
      type: "simulation"
    };
  }

  try {
    const prompt = taskType === 'email_update'
      ? `You are an architect's assistant. Draft a professional, warm email update to a client based on this project context: ${projectContext}. The update should summarize the recent milestone and mention next steps. Keep it concise for WhatsApp.`
      : taskType === 'social_caption'
        ? `You are a social media manager for an architecture firm. Write an engaging Instagram caption for the project described here: ${projectContext}. Use emojis and architectural hashtags.`
        : taskType === 'task_checklist'
          ? `You are a Senior Project Architect. Create a detailed technical task checklist for the NEXT phase of this project based on the context: ${projectContext}. Focus on structural requirements, site prep, and contractor coordination. Format as a clean bulleted list.`
          : `You are an intelligent project assistant. Answer this user query based on the project context: ${userPrompt}. Context: ${projectContext}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            generatedText: { type: Type.STRING },
            tone: { type: Type.STRING },
          },
          required: ["generatedText"]
        }
      }
    });

    const json = JSON.parse(response.text || '{}');
    return json;
  } catch (error) {
    console.error("Gemini API Error", error);
    // Fallback
    return {
      generatedText: "Error generating content. Please check connection.",
      tone: "error"
    };
  }
};