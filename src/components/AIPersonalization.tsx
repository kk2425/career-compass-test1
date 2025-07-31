import React, { useState, useEffect } from 'react';
import { AptitudeScores, InterestScores, AIRoadmap } from '../types';
import { getFollowUpQuestions, getCareerRoadmap } from '../services/geminiService';
import Button from './ui/Button';

interface AIPersonalizationProps {
    aptitudeScores: AptitudeScores;
    interestScores: InterestScores;
    onRoadmapGenerated: (roadmap: AIRoadmap[], answers: string[]) => void;
}

const LoadingSpinner: React.FC<{text?: string}> = ({ text = "AI is thinking..."}) => (
    <div className="flex justify-center items-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse"></div>
        <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse [animation-delay:0.4s]"></div>
        <span className="ml-3 text-slate-300">{text}</span>
    </div>
);

const AIPersonalization: React.FC<AIPersonalizationProps> = ({ aptitudeScores, interestScores, onRoadmapGenerated }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiQuestions, setAiQuestions] = useState<string[]>([]);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const questions = await getFollowUpQuestions(aptitudeScores, interestScores);
                if (questions.length > 0) {
                    setAiQuestions(questions);
                    setUserAnswers(new Array(questions.length).fill(''));
                } else {
                   setError("The AI couldn't generate questions, but you can still generate a roadmap directly.");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aptitudeScores, interestScores]);

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...userAnswers];
        newAnswers[index] = value;
        setUserAnswers(newAnswers);
    };

    const handleGetRoadmap = async () => {
        setIsGenerating(true);
        setError(null);
        try {
            const result = await getCareerRoadmap(aptitudeScores, interestScores, userAnswers);
            if(result && result.length > 0) {
                 onRoadmapGenerated(result, userAnswers);
            } else {
                setError("The AI failed to generate a roadmap. Please adjust your answers or try again.");
                setIsGenerating(false);
            }
        } catch (err) {
             setError(err instanceof Error ? err.message : 'An unknown error occurred.');
             setIsGenerating(false);
        }
    };
    
    if (isLoading) {
        return (
            <div className="w-full max-w-2xl mx-auto p-8 bg-slate-800 rounded-xl shadow-2xl text-center">
                <LoadingSpinner text="Generating personalized questions..." />
            </div>
        )
    };

    if (error) return <p className="text-red-400 text-center bg-slate-800 p-8 rounded-xl">{error}</p>;

    return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-slate-800 rounded-xl shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-cyan-400 mb-2 text-center">Final Step: AI Personalization</h2>
            <p className="text-slate-300 mb-6 text-center">Answer these questions for a more tailored recommendation.</p>
            <div className="space-y-5">
                {aiQuestions.map((q, index) => (
                    <div key={index}>
                        <label className="block text-slate-200 font-medium mb-2">{q}</label>
                        <textarea
                            value={userAnswers[index]}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                            rows={3}
                            placeholder="Your thoughts here..."
                        ></textarea>
                    </div>
                ))}
            </div>
            <div className="text-center mt-8">
                <Button onClick={handleGetRoadmap} disabled={isGenerating || userAnswers.some(a => a.trim() === '')} size="lg">
                    {isGenerating ? <LoadingSpinner text="Generating Careers..." /> : 'Generate My Career Matches'}
                </Button>
            </div>
        </div>
    );
};

export default AIPersonalization;