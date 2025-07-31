export enum AppStep {
    Welcome,
    AptitudeTest,
    InterestTest,
    AIQuestions,
    Results,
}

export interface AptitudeScores {
    verbal: number;
    logical: number;
    spatial: number;
    numerical: number;
}

export interface InterestScores {
    realistic: number;
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
}

export type AptitudeCategory = keyof AptitudeScores;
export type InterestCategory = keyof InterestScores;

export interface AptitudeQuestion {
    id: number;
    category: AptitudeCategory;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface InterestQuestion {
    id: number;
    category: InterestCategory;
    question: string;
}

export interface CareerProfile {
    career: string;
    description: string;
    aptitude: Partial<AptitudeScores>;
    interest: Partial<InterestScores>;
}

export interface AIRoadmap {
    jobTitle: string;
    careerTag: "Entry-level friendly" | "Mid-level (aspirational)" | "Long-term vision role";
    rationale: string;
    steppingStoneRoles: string[];
    learningPath: string;
    highSchoolSubjects: string[];
    potentialMajors: string[];
    tools: string[];
    extracurriculars: string;
    extraTip: string;
}

export interface FeedbackSubmission {
    userProfile: {
        aptitudeScores: AptitudeScores;
        interestScores: InterestScores;
        userAnswers: string[];
    };
    aiRecommendation: AIRoadmap;
    userFeedback: {
        rating: number;
        suggestedBetterFit: string;
    };
    timestamp: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface RefinedSuggestedRole {
    title: string;
    rationale: string;
}

export interface RefinedAnalysis {
    isGoodFit: boolean;
    analysis: string;
    suggestedRoles: RefinedSuggestedRole[];
}