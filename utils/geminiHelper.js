const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini client using the API key from .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// This function takes job offer text (pasted by user) and asks Gemini
// to analyze it for scam signs, returning a structured verdict.
const analyzeJobOfferWithAI = async (jobText) => {
  const prompt = `You are a job-scam detection assistant. Analyze the following job offer text and determine if it looks like a scam.

Job Offer Text:
"""
${jobText}
"""

Respond ONLY in this exact JSON format, nothing else:
{
  "verdict": "likely_scam" or "likely_genuine" or "uncertain",
  "riskScore": a number from 0-100,
  "reasons": ["reason1", "reason2", ...]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  const rawText = response.text;

  // Gemini sometimes wraps JSON in ```json fences — clean that up
  const cleanText = rawText.replace(/```json|```/g, '').trim();

  // Convert the AI's text response into an actual JS object
  const parsedResult = JSON.parse(cleanText);

  return parsedResult;
};

module.exports = analyzeJobOfferWithAI;