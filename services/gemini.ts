
import { GoogleGenAI } from "@google/genai";
import { College, Athlete } from "../types";

export const generateOutreachDraft = async (athlete: Athlete, college: College) => {
  // Use process.env.API_KEY directly and instantiate inside the function 
  // to ensure the latest API key is used, following Google GenAI SDK best practices.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a professional and compelling initial outreach email for a recruit.
      Athlete: ${athlete.name}, Sport: ${athlete.sport}, Position: ${athlete.position}, Class: ${athlete.class}, GPA: ${athlete.gpa}.
      Target College: ${college.name}, Division: ${college.division}.
      Bio: ${athlete.bio}
      
      Keep it concise, respectful, and include a call to action (asking for their camp schedule or to review highlights).`,
      config: {
        temperature: 0.7,
      },
    });

    // Access the generated text directly via the property.
    return response.text || "Failed to generate draft.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating content. Please check API settings.";
  }
};
