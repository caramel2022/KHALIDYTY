import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LessonPlan } from "../types";

export const generateLessonPlan = async (
  level: string,
  period: string,
  week: string,
  subject: string,
  files?: { data: string; mimeType: string }[]
): Promise<LessonPlan> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      level: { type: Type.STRING, description: "The grade level, e.g., Niveau 4" },
      period: { type: Type.STRING, description: "The period number, e.g., Période 3" },
      week: { type: Type.STRING, description: "The week number, e.g., Semaine 2" },
      session: { type: Type.STRING, description: "The session number, e.g., Séance 3" },
      sections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            title: { type: Type.STRING, description: "Main title of activity, e.g., Acte de parole" },
            subtitle: { type: Type.STRING, description: "Specific topic, e.g., Point de langue" },
            duration: { type: Type.STRING, description: "Duration in minutes, e.g., 20 min" },
            content: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of bullet points for the activity content"
            },
            type: { 
              type: Type.STRING, 
              enum: ["speaking", "writing", "reading"],
              description: "The type of activity determines the color/icon"
            }
          },
          required: ["id", "title", "duration", "content", "type"]
        }
      }
    },
    required: ["level", "period", "week", "session", "sections"]
  };

  const systemInstruction = "Tu es un expert pédagogique pour le ministère de l'éducation nationale du Maroc. Tu crées des contenus adaptés aux élèves du primaire.";

  // Common prompt instructions
  const baseInstructions = `
    Je veux exactement 3 activités principales (Sections) qui correspondent au style visuel d'une leçon type :
    1. Une activité orale ("Acte de parole" ou "Communication").
    2. Une activité de langue ou d'écriture ("Lecture" ou "Point de langue").
    3. Une activité de production ou lecture ("Lecture" ou "Production").
    
    Sois concis. Utilise des phrases courtes pour le contenu.
    La réponse DOIT être en JSON valide selon le schéma fourni.
  `;

  let contents;

  if (files && files.length > 0) {
    // Multimodal Request with Multiple Files
    const fileParts = files.map(f => ({
      inlineData: {
        mimeType: f.mimeType,
        data: f.data
      }
    }));

    contents = {
      parts: [
        ...fileParts,
        {
          text: `Analyse ces documents (${files.length} fichiers : images ou PDF) qui peuvent être des diapositives, des pages de manuel ou des plans de cours.
          Synthétise les informations (sujet, objectifs, activités) pour générer une fiche pédagogique structurée pour un cours de français au Maroc.
          
          Contexte imposé (adapte le contenu des documents à ce niveau): 
          Niveau: ${level}, Période: ${period}, Semaine: ${week}.
          ${subject ? `Thème/Sujet suggéré: "${subject}"` : ''}

          ${baseInstructions}`
        }
      ]
    };
  } else {
    // Text-only Request
    contents = `
      Génère une fiche pédagogique structurée pour un cours de français au Maroc.
      Contexte: ${level}, ${period}, ${week}.
      Sujet global ou thème: "${subject}".
      
      ${baseInstructions}
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Flash supports multimodal (images/pdf)
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: systemInstruction,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as LessonPlan;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};