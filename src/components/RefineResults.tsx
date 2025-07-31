import React, { useState } from 'react';
import { AptitudeScores, InterestScores, RefinedAnalysis } from '../types';
import { getRefinedAnalysis } from '../services/geminiService';
import Card from './ui/Card';
import Button from './ui/Button';

interface RefineResultsProps {
    aptitudeScores: AptitudeScores;
    interestScores: InterestScores;
    userAnswers: string[];
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
        <span className="ml-2 text-slate-300">Analyzing...</span>
    </div>
);




const RefineResults: React.FC<RefineResultsProps> = ({ aptitudeScores, interestScores, userAnswers }) => {
    const [careerField, setCareerField] = useState('');
    const [analysisResult, setAnalysisResult] = useState<RefinedAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!careerField.trim()) return;
        
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await getRefinedAnalysis(aptitudeScores, interestScores, userAnswers, careerField);
            setAnalysisResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred during analysis.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Explore a Different Path</h2>
                <p className="text-slate-300 mb-4">
                    Curious about a career not on your list? Let's see how it aligns with your profile.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                    type="text"
                    value={careerField}
                    onChange={(e) => setCareerField(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    placeholder="Enter a field, e.g., 'Healthcare' or 'Game Design'"
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    disabled={isLoading}
                    aria-label="Career field to analyze"
                />
                <Button onClick={handleAnalyze} disabled={!careerField.trim() || isLoading} className="w-full sm:w-auto flex-shrink-0 px-8 h-12">
                    {isLoading ? <LoadingSpinner /> : 'Analyze'}
                </Button>
            </div>

            {error && <p className="text-red-400 text-center mt-4">{error}</p>}

            {analysisResult && (
                <div className="mt-6 pt-6 border-t border-slate-700 animate-fade-in">
                    <div className={`p-4 rounded-lg ${analysisResult.isGoodFit ? 'bg-green-900/20 border-green-700/50' : 'bg-yellow-900/20 border-yellow-700/50'} border`}>
                        <h3 className="font-bold text-lg text-white mb-2">Analysis for "{careerField}"</h3>
                        <p className="text-slate-300 whitespace-pre-wrap">{analysisResult.analysis}</p>
                    </div>

                    {analysisResult.suggestedRoles.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold text-cyan-400 mb-2">Alternative roles to consider in this field:</h4>
                            <div className="space-y-3">
                            {analysisResult.suggestedRoles.map(role => (
                                <div key={role.title} className="bg-slate-700/50 p-3 rounded-md">
                                    <p className="font-bold text-slate-100">{role.title}</p>
                                    <p className="text-sm text-slate-400">{role.rationale}</p>
                                </div>
                            ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default RefineResults;
