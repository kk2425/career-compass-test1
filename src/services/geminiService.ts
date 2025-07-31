
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { AptitudeScores, InterestScores, AIRoadmap, RefinedAnalysis } from "../types";

// The Gemini API key is expected to be available as `import.meta.env.VITE_API_KEY`.
// The Vite build tool is responsible for making this variable available from your .env file.
if (!import.meta.env.VITE_API_KEY) {
    console.error("VITE_API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY! });

export const getFollowUpQuestions = async (
    aptitudeScores: AptitudeScores,
    interestScores: InterestScores
): Promise<string[]> => {
    try {
        const prompt = `
            You are a friendly high school career counselor. Based on the following assessment results of a 10th or 12th grade student, generate 3 insightful, open-ended follow-up questions to understand their core motivations and working style.

            **IMPORTANT RULES:**
            - DO NOT ask "What are your hobbies?".
            - DO NOT ask "What is your favorite subject?".
            - Instead, ask situational questions that reveal their preferences. Frame questions around projects, problem-solving, and team dynamics.

            **Example Question Styles:**
            - "Think about a project you were proud of (in or out of school). What part did you enjoy most: planning it out, building or creating it, or presenting the final result?"
            - "When you face a really tough problem, what's your first instinct? Do you prefer to research and analyze it, try different things until something works, or talk it over with others?"
            - "Imagine you're part of a team. What role do you naturally find yourself taking? The leader who organizes everyone, the creative one with new ideas, or the one who makes sure all the details are perfect?"

            **Student's Profile:**
            Aptitude Scores (0-1 scale): ${JSON.stringify(aptitudeScores)}
            Interest Scores (RIASEC model, 0-1 scale): ${JSON.stringify(interestScores)}

            **Your Task:**
            Generate 3 questions similar to the examples above, tailored to the student's profile. Return ONLY the questions in the specified JSON format.
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        questions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (result && Array.isArray(result.questions)) {
            return result.questions;
        }

        return [];

    } catch (error) {
        console.error("Error getting follow-up questions from Gemini:", error);
        throw new Error("Failed to generate AI questions. Please check your API key and try again.");
    }
};

export const getCareerRoadmap = async (
    aptitudeScores: AptitudeScores,
    interestScores: InterestScores,
    userAnswers: string[]
): Promise<AIRoadmap[]> => {
    try {
        const prompt = `
            You are a world-class career strategist specializing in guiding high school students (grades 10-12). 
            A student has provided their assessment scores and answers to your follow-up questions.
            Your task is to provide a detailed, actionable career roadmap for the top FIVE highly specific job titles that are a great fit, keeping in mind they are planning for college or future training.

            **Student's Profile:**
            - Aptitude Scores: ${JSON.stringify(aptitudeScores)}
            - Interest Scores (RIASEC): ${JSON.stringify(interestScores)}
            - Student's Answers to Your Situational Questions (these reveal their working style and motivations): ${JSON.stringify(userAnswers)}

            **Your Task:**
            Based on ALL the information above, recommend 5 specific job titles. For each job title, provide the following in a friendly and encouraging tone:
            - jobTitle: The specific job title (e.g., "AI Ethics Researcher", not "AI").
            - rationale: A concise, one-sentence explanation of *why* this career is a good match based on their specific profile. (e.g., "Your high logical score and interest in problem-solving make you a natural fit for this field.")
            - careerPath: A brief, encouraging description of the career path and its potential (2-3 sentences).
            - highSchoolSubjects: A list of 2-3 key high school subjects to focus on (e.g., "Physics, Advanced Math").
            - potentialMajors: A list of 2-3 potential college majors or vocational programs to explore (e.g., "Computer Science, Cognitive Science").
            - tools: A list of 2-3 beginner-friendly software or tools to start learning (e.g., "Python (for scripting), Figma (for design)").
            - extracurriculars: A description of relevant extracurriculars, school clubs, or personal projects to get started (e.g., "Join the debate club, start a personal blog, volunteer at a local clinic").
            - extraTip: One unique, actionable tip for a high schooler to get ahead in this field.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    jobTitle: { type: Type.STRING },
                                    rationale: { type: Type.STRING },
                                    careerPath: { type: Type.STRING },
                                    highSchoolSubjects: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    potentialMajors: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    extracurriculars: { type: Type.STRING },
                                    extraTip: { type: Type.STRING }
                                },
                                required: ["jobTitle", "rationale", "careerPath", "highSchoolSubjects", "potentialMajors", "tools", "extracurriculars", "extraTip"]
                            }
                        }
                    }
                }
            }
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (result && Array.isArray(result.recommendations)) {
            return result.recommendations;
        }

        return [];

    } catch (error) {
        console.error("Error getting career roadmap from Gemini:", error);
        throw new Error("Failed to generate AI roadmap. Please check your API key and try again.");
    }
};

export const createCareerChat = (
    aptitudeScores: AptitudeScores,
    interestScores: InterestScores,
    userAnswers: string[],
    aiRoadmap: AIRoadmap[]
): Chat => {
    const systemInstruction = `You are Compass AI, a friendly, encouraging, and expert high school career counselor. Your goal is to help the student explore career paths in a conversational way.

    You have the student's complete profile. **Always use this information to personalize your answers.**
    - **Aptitude Scores (0-1 scale):** ${JSON.stringify(aptitudeScores)}
    - **Interest Scores (RIASEC, 0-1 scale):** ${JSON.stringify(interestScores)}
    - **Student's Answers to Situational Questions:** ${JSON.stringify(userAnswers)}
    - **Your Initial Top 5 Career Recommendations:** ${JSON.stringify(aiRoadmap.map(r => r.jobTitle))}

    **Your Core Directives:**
    1.  **Be Conversational:** Do not just list facts. Engage the student, ask follow-up questions.
    2.  **Analyze New Careers:** If the user asks about a career NOT on their list (e.g., "What about being a vet?"), analyze it against their profile. Explain the pros (e.g., "Your high 'Social' and 'Investigative' scores are great for that!") and cons (e.g., "However, it requires strong science grades, which might be an area to focus on.").
    3.  **Provide Actionable Advice:** When asked for advice, give specific, concrete next steps a high schooler can take (e.g., specific online courses, project ideas, books to read, people to talk to).
    4.  **Stay in Character:** You are always Compass AI. Be positive and empowering.
    `;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction
        }
    });
    return chat;
};

export const getRefinedAnalysis = async (
    aptitudeScores: AptitudeScores,
    interestScores: InterestScores,
    userAnswers: string[],
    careerField: string
): Promise<RefinedAnalysis> => {
    try {
        const prompt = `You are a career strategist AI. A student has provided their profile and wants to know if they are a good fit for a career in the field of "${careerField}".

**Student's Profile:**
- Aptitude Scores (0-1 scale): ${JSON.stringify(aptitudeScores)}
- Interest Scores (RIASEC, 0-1 scale): ${JSON.stringify(interestScores)}
- Student's Answers to Situational Questions: ${JSON.stringify(userAnswers)}

**Your Task:**
1.  Analyze the student's profile against the general career field of "${careerField}".
2.  Determine if it's generally a good fit. This is a subjective analysis based on their scores and interests.
3.  Write a brief (3-4 sentences) analysis explaining your reasoning. Mention specific scores or answers that support your conclusion (e.g., "Your high 'Investigative' score is a great asset for this field, but your lower 'Realistic' score might mean you'd prefer theoretical roles over hands-on ones.").
4.  If the field is broad, suggest 2-3 more specific job titles within that field that could be a good match, and provide a one-sentence rationale for each. If the field is already specific, you can suggest related roles.

Return your response in the specified JSON format.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isGoodFit: { 
                            type: Type.BOOLEAN, 
                            description: "Is this career field a good fit for the student?" 
                        },
                        analysis: { 
                            type: Type.STRING, 
                            description: "Your analysis of the fit, explaining the reasoning." 
                        },
                        suggestedRoles: {
                            type: Type.ARRAY,
                            description: "Specific roles within the field for the student to consider.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING, description: "The specific job title." },
                                    rationale: { type: Type.STRING, description: "Rationale for why this role is a good fit." }
                                },
                                required: ["title", "rationale"]
                            }
                        }
                    },
                    required: ["isGoodFit", "analysis", "suggestedRoles"]
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (result && typeof result.isGoodFit === 'boolean' && result.analysis && Array.isArray(result.suggestedRoles)) {
            return result as RefinedAnalysis;
        }

        throw new Error("AI returned an invalid analysis format.");

    } catch (error) {
        console.error(`Error getting refined analysis for "${careerField}" from Gemini:`, error);
        throw new Error("Failed to generate AI analysis. Please check your query or API key and try again.");
    }
};
