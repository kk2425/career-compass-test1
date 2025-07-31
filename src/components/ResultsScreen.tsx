import React, { useState } from 'react';
import { AptitudeScores, InterestScores, AIRoadmap } from '../types';
import ScoreChart from './ui/ScoreChart';
import Card from './ui/Card';
import Button from './ui/Button';
import CareerDetailModal from './CareerDetailModal';
import FeedbackForm from './FeedbackForm';
import CareerExplorerChat from './CareerExplorerChat';
import RefineResults from './RefineResults';

interface ResultsScreenProps {
    aptitudeScores: AptitudeScores;
    interestScores: InterestScores;
    aiRoadmap: AIRoadmap[];
    userAnswers: string[];
    onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ aptitudeScores, interestScores, aiRoadmap, userAnswers, onRestart }) => {
    const [selectedCareer, setSelectedCareer] = useState<AIRoadmap | null>(null);
    const [submittedFeedback, setSubmittedFeedback] = useState<string[]>([]);
    
    const aptitudeData = Object.entries(aptitudeScores).map(([name, value]) => ({
        subject: name.charAt(0).toUpperCase() + name.slice(1),
        score: value,
    }));

    const interestData = Object.entries(interestScores).map(([name, value]) => ({
        subject: name.charAt(0).toUpperCase() + name.slice(1),
        score: value,
    }));

    const handleFeedbackSubmitted = (jobTitle: string) => {
        setSubmittedFeedback(prev => [...prev, jobTitle]);
    };

    return (
        <div className="w-full animate-fade-in">
            <div className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">Your Career Profile</h1>
                <p className="mt-3 text-lg text-slate-300">Based on your assessments, here are your top 5 AI-powered career recommendations.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <Card>
                    <h3 className="text-2xl font-bold text-cyan-400 mb-4 text-center">Aptitude Scores</h3>
                    <ScoreChart data={aptitudeData} />
                </Card>
                <Card>
                    <h3 className="text-2xl font-bold text-cyan-400 mb-4 text-center">Interest Profile (RIASEC)</h3>
                    <ScoreChart data={interestData} />
                </Card>
            </div>

            <div className="mb-12">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Top 5 Career Matches</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {aiRoadmap.map((career) => (
                        <Card key={career.jobTitle} className="flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-cyan-400">{career.jobTitle}</h3>
                                <p className="text-slate-300 mt-2 flex-grow text-sm">{career.learningPath}</p>
                                <p className="text-slate-400 mt-3 border-t border-slate-700 pt-3 text-xs italic">
                                    <strong>Why it's a good fit:</strong> {career.rationale}
                                </p>
                            </div>
                            <div className="mt-4">
                                <Button onClick={() => setSelectedCareer(career)} size="sm" className="w-full">
                                    Explore More
                                </Button>
                                {submittedFeedback.includes(career.jobTitle) ? (
                                    <div className="mt-4 text-center py-2 px-4 bg-green-900/50 text-green-300 rounded-md">Thank you for your feedback!</div>
                                ) : (
                                    <FeedbackForm 
                                        career={career}
                                        aptitudeScores={aptitudeScores}
                                        interestScores={interestScores}
                                        userAnswers={userAnswers}
                                        onFeedbackSubmit={handleFeedbackSubmitted}
                                    />
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="mt-16">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Go Deeper with Your AI Counselor</h2>
                    <p className="text-slate-300 mb-8 max-w-3xl mx-auto">
                        Your journey doesn't end here. Chat with Compass AI to explore these roles, ask about other careers, or get specific advice on your next steps.
                    </p>
                </div>
                <CareerExplorerChat
                    aptitudeScores={aptitudeScores}
                    interestScores={interestScores}
                    userAnswers={userAnswers}
                    aiRoadmap={aiRoadmap}
                />
            </div>

            <div className="mt-16">
                <RefineResults
                    aptitudeScores={aptitudeScores}
                    interestScores={interestScores}
                    userAnswers={userAnswers}
                />
            </div>
            
            <div className="text-center mt-12">
                <Button onClick={onRestart} variant="secondary">
                    Start Over
                </Button>
            </div>

            <CareerDetailModal
                career={selectedCareer}
                onClose={() => setSelectedCareer(null)}
            />
        </div>
    );
};

export default ResultsScreen;