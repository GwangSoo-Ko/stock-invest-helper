
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { GroundingChunk } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface MarketAnalysisResult {
    text: string;
    sources: GroundingChunk[];
}

// Utility to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const getMarketAnalysis = async (prompt: string): Promise<MarketAnalysisResult> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const text = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        return { text, sources };
    } catch (error) {
        console.error("Error in getMarketAnalysis:", error);
        throw new Error("시장 분석 중 오류가 발생했습니다.");
    }
};

export const analyzeImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: mimeType,
            },
        };
        const textPart = { text: prompt };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error in analyzeImage:", error);
        throw new Error("이미지 분석 중 오류가 발생했습니다.");
    }
};


export const getDeepDiveAnalysis = async (prompt: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 32768 },
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error in getDeepDiveAnalysis:", error);
        throw new Error("심층 분석 중 오류가 발생했습니다.");
    }
};
