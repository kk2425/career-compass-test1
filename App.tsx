import React, { useState, useCallback, useEffect } from 'react';
import { AppStep, AptitudeScores, InterestScores, AIRoadmap } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import AptitudeTest from './components/AptitudeTest';
import InterestTest from './components/InterestTest';
import ResultsScreen from './components/ResultsScreen';
import AIPersonalization from './components/AIPersonalization';
import Button from './components/ui/Button';

const App: React.FC = () => {
    const [step, setStep] = useState<AppStep>(AppStep.Welcome);
    const [aptitudeScores, setAptitudeScores] = useState<AptitudeScores | null>(null);
    const [interestScores, setInterestScores] = useState<InterestScores | null>(null);
    const [aiRoadmap, setAiRoadmap] = useState<AIRoadmap[] | null>(null);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [apiKeyMissing, setApiKeyMissing] = useState(false);

    useEffect(() => {
        // Check for the API key from environment variables.
        if (!process.env.API_KEY) {
            setApiKeyMissing(true);
            console.warn("API_KEY environment variable not set. AI features will be unavailable.");
        }
    }, []);

    const handleStart = () => {
        setStep(AppStep.AptitudeTest);
    };

    const handleAptitudeComplete = useCallback((scores: AptitudeScores) => {
        setAptitudeScores(scores);
        setStep(AppStep.InterestTest);
    }, []);

    const handleInterestComplete = useCallback((scores: InterestScores) => {
        if (!aptitudeScores) return; // Should not happen
        setInterestScores(scores);
        setStep(AppStep.AIQuestions);
    }, [aptitudeScores]);

    const handleRoadmapGenerated = useCallback((roadmap: AIRoadmap[], answers: string[]) => {
        setAiRoadmap(roadmap);
        setUserAnswers(answers);
        setStep(AppStep.Results);
    }, []);
    
    const handleRestart = () => {
        setStep(AppStep.Welcome);
        setAptitudeScores(null);
        setInterestScores(null);
        setAiRoadmap(null);
        setUserAnswers([]);
    };

    const renderStep = () => {
        switch (step) {
            case AppStep.AptitudeTest:
                return <AptitudeTest onComplete={handleAptitudeComplete} />;
            case AppStep.InterestTest:
                return <InterestTest onComplete={handleInterestComplete} />;
            case AppStep.AIQuestions:
                if (apiKeyMissing) {
                     return (
                         <div className="w-full max-w-2xl mx-auto p-8 bg-slate-800 rounded-xl shadow-2xl text-center">
                             <h2 className="text-2xl font-bold text-yellow-400 mb-4">AI Features Disabled</h2>
                             <p className="text-slate-300">
                                 The AI-powered personalization step cannot proceed because the <code>API_KEY</code> is not configured.
                                 AI features are unavailable.
                             </p>
                             <div className="mt-6">
                                <Button onClick={handleRestart} variant="secondary">Start Over</Button>
                             </div>
                         </div>
                     );
                }
                if (aptitudeScores && interestScores) {
                    return (
                        <AIPersonalization
                            aptitudeScores={aptitudeScores}
                            interestScores={interestScores}
                            onRoadmapGenerated={handleRoadmapGenerated}
                        />
                    );
                }
                return <WelcomeScreen onStart={handleStart} />;
            case AppStep.Results:
                if (aptitudeScores && interestScores && aiRoadmap) {
                    return (
                        <ResultsScreen
                            aptitudeScores={aptitudeScores}
                            interestScores={interestScores}
                            aiRoadmap={aiRoadmap}
                            userAnswers={userAnswers}
                            onRestart={handleRestart}
                        />
                    );
                }
                // Fallback to welcome if scores are missing
                return <WelcomeScreen onStart={handleStart} />;
            case AppStep.Welcome:
            default:
                return <WelcomeScreen onStart={handleStart} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
             {apiKeyMissing && (
                <div 
                    className="bg-yellow-500 text-black p-3 text-center font-semibold fixed top-0 left-0 w-full z-50 shadow-lg"
                    role="alert"
                >
                    Warning: AI features are disabled. The <code>API_KEY</code> is not configured.
                </div>
            )}
            <main className={`w-full max-w-5xl mx-auto ${apiKeyMissing ? 'pt-16' : ''}`}>
                {renderStep()}
            </main>
        </div>
    );
};

export default App;