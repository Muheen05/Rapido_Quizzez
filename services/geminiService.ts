
import { GoogleGenAI, Type } from "@google/genai";
import { SOP_CONTEXT } from "../constants";
import { Scenario, AgentLevel } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Comprehensive list of SOP scenarios from the PDF
const SCENARIO_TOPICS = [
  // Safety (P0) - Severity Check Required
  "Drunk Captain (Bloodshot eyes, slurring)",
  "Sexual Harassment by Captain",
  "Physical Fight/Manhandling",
  "Captain Threatening Life",
  
  // Operations & Refunds (Policy Check Required)
  "Captain Denied Duty (Bike) - Asking for Extra Cash",
  "Captain Denied Duty (Auto) - Refusing Ride",
  "Vehicle Mismatch (Bike)",
  "Vehicle Mismatch (Cab/Auto)",
  "AC Not Working in Cab (Unhygienic)",
  "Toll Charges (Captain Collected Extra)",
  "Double Payment (Cash + Online)",
  "Long Route Taken (Fare Increase)",
  "Cancellation Charges (Bike vs Auto)",
  
  // Rapido Local (Proof/Value Check Required)
  "Rapido Local - Item Damaged (<2000 Rs)",
  "Rapido Local - Item Damaged (>5000 Rs)",
  "Rapido Local - Package Undelivered/Missing",
  
  // Tech & Pass (Root Cause Check)
  "Metro Ticket Purchase Failed (Money Deducted)",
  "Power Pass Not Applying (Distance <1km)",
  "Lowest Price Guarantee Claim (Invalid Proof)",
  "Lowest Price Guarantee Claim (Valid)",
  "Wallet Balance Not Reflecting",
  "Unable to Login (IMEI Limit Exceeded)"
];

export const generateScenario = async (agentLevel: AgentLevel = 'Associate'): Promise<Scenario> => {
  const model = "gemini-2.5-flash";
  
  const topic = SCENARIO_TOPICS[Math.floor(Math.random() * SCENARIO_TOPICS.length)];

  // Adjust difficulty based on tenure
  let difficultyPrompt = "";
  if (agentLevel === 'Rookie') {
    difficultyPrompt = "The agent is a ROOKIE (< 6 months tenure). Generate a CLEAR, STANDARD scenario. Avoid edge cases. Focus on basic Refunds and 'General' severity issues. The answer should be straightforward based on the SOP.";
  } else if (agentLevel === 'Expert') {
    difficultyPrompt = "The agent is an EXPERT (> 2 years tenure). Generate a HIGHLY COMPLEX or AMBIGUOUS scenario. Focus on P0 Critical Safety issues, High Value Rapido Local claims, or edge cases where the customer is lying. Make the options very similar to test precision.";
  } else {
    difficultyPrompt = "The agent is an ASSOCIATE. Generate a moderate difficulty scenario. Mix of Refund and Safety issues.";
  }

  const systemInstruction = `
    ${SOP_CONTEXT}
    
    You are an expert Training AI for Rapido. Generate a customer support scenario.
    
    TENURE ADAPTATION: ${difficultyPrompt}
    
    CRITICAL RULE FOR "primaryDecision":
    1. IF the scenario is a SAFETY THREAT (Drunk, Harassment, Violence), the 'primaryDecision.type' MUST be 'SEVERITY'. The question MUST be "Identify the Issue Severity" and options must include P0.
    2. IF the scenario is Operational/Refund/Tech, the 'primaryDecision.type' MUST be 'POLICY_CHECK' or 'REQUIRED_PROOF'.
       - Example Policy Check: "What is the maximum refund allowed?" or "Is this eligible for refund?"
       - Example Proof Check: "What specific proof is missing?"
    
    DATA CONSISTENCY RULES:
    1. 'primaryDecision.correctAnswer' MUST be exactly present in 'primaryDecision.options'.
    2. 'correctAction' MUST be exactly present in 'actionOptions'.
    3. Make options tricky but distinct.
  `;

  const prompt = `Generate a detailed scenario about: ${topic}.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      customerName: { type: Type.STRING },
      customerSentiment: { type: Type.STRING, enum: ['Angry', 'Frustrated', 'Confused', 'Happy', 'Neutral'] },
      rideType: { type: Type.STRING, enum: ['Bike', 'Auto', 'Cab', 'C2C'] },
      context: { type: Type.STRING },
      captainDetails: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          history: { type: Type.STRING }
        }
      },
      primaryDecision: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['SEVERITY', 'POLICY_CHECK', 'REQUIRED_PROOF', 'ROOT_CAUSE'] },
          question: { type: Type.STRING, description: "The challenge question for the agent." },
          correctAnswer: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 distinct options." }
        }
      },
      correctAction: { type: Type.STRING },
      explanation: { type: Type.STRING },
      actionOptions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 distinct resolution actions." }
    },
    required: ["id", "customerName", "customerSentiment", "rideType", "context", "captainDetails", "primaryDecision", "correctAction", "explanation", "actionOptions"]
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.85,
      }
    });

    if (response.text) {
      const scenario = JSON.parse(response.text) as Scenario;

      // --- CRITICAL SAFEGUARD: Ensure correct answers are actually selectable ---
      
      // 1. Fix Primary Decision Options
      if (!scenario.primaryDecision.options.includes(scenario.primaryDecision.correctAnswer)) {
        const idx = Math.floor(Math.random() * scenario.primaryDecision.options.length);
        scenario.primaryDecision.options[idx] = scenario.primaryDecision.correctAnswer;
      }

      // 2. Fix Resolution Action Options
      if (!scenario.actionOptions.includes(scenario.correctAction)) {
        const idx = Math.floor(Math.random() * scenario.actionOptions.length);
        scenario.actionOptions[idx] = scenario.correctAction;
      }

      return scenario;
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("AI Generation Error", error);
    // Fallback for offline/error state
    return {
      id: "fallback-error",
      customerName: "System",
      customerSentiment: "Neutral",
      rideType: "Bike",
      context: "The AI service is currently unavailable. Please check your API key or connection.",
      captainDetails: { name: "N/A", rating: 0, history: "N/A" },
      primaryDecision: {
        type: "ROOT_CAUSE",
        question: "What is the likely cause of this error?",
        correctAnswer: "API Key or Connectivity Issue",
        options: ["Captain Phone Off", "API Key or Connectivity Issue", "Customer App Crash", "GPS Glitch"]
      },
      correctAction: "Retry connection or check settings",
      explanation: "Without the API, we cannot generate scenarios.",
      actionOptions: ["Retry connection or check settings", "Refund customer", "Suspend Captain", "Call Supervisor"]
    };
  }
};

export const getHint = async (scenarioContext: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `The agent is stuck on this Rapido customer scenario: "${scenarioContext}". Give a short, helpful hint based on Rapido SOPs. Focus on the specific policy rule or check they need to perform. Keep it under 15 words.`,
        });
        return response.text || "Check the SOP guidelines for this specific issue category.";
    } catch (e) {
        return "Review the SOP details regarding this issue.";
    }
}
