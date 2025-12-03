
export enum IssueSeverity {
  P0 = 'P0',
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
  General = 'General'
}

export type DecisionType = 'SEVERITY' | 'POLICY_CHECK' | 'REQUIRED_PROOF' | 'ROOT_CAUSE';

export type AgentLevel = 'Rookie' | 'Associate' | 'Expert';

export interface UserProfile {
  email: string;
  joinDate: Date;
  tenureMonths: number;
  level: AgentLevel;
}

export interface Scenario {
  id: string;
  customerName: string;
  customerSentiment: 'Angry' | 'Frustrated' | 'Confused' | 'Happy' | 'Neutral';
  rideType: 'Bike' | 'Auto' | 'Cab' | 'C2C';
  context: string;
  captainDetails: {
    name: string;
    rating: number;
    history: string;
  };
  
  // Dynamic Module 1: Varies based on scenario type
  primaryDecision: {
    type: DecisionType;
    question: string; // e.g., "Identify Severity" or "Max Refund Amount?" or "What proof is missing?"
    correctAnswer: string;
    options: string[];
  };

  // Module 2: The Action/Resolution
  correctAction: string;
  explanation: string;
  actionOptions: string[];
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  scenariosCompleted: number;
  accuracy: number;
  badges: string[];
  weeklyHistory: { name: string; score: number }[];
}

export type AppView = 'dashboard' | 'dojo' | 'sop-library';
