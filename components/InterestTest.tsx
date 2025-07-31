
import React, { useState } from 'react';
import { interestQuestions } from '../data/assessmentData';
import { InterestScores, InterestCategory } from '../types';
import Button from './ui/Button';
import ProgressBar from './ui/ProgressBar';

interface InterestTestProps {
    onComplete: (scores: InterestScores) => void;
}

const InterestTest: React.FC<InterestTestProps> = ({ onComplete }) => {
    const [ratings, setRatings] = useState<(number | null)[]>(new Array(interestQuestions.length).fill(null));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleRatingSelect = (rating: number) => {
        const newRatings = [...ratings];
        newRatings[currentQuestionIndex] = rating;
        setRatings(newRatings);

        setTimeout(() => {
            if (currentQuestionIndex < interestQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }, 300);
    };
    
    const handleSubmit = () => {
        const scores: Record<InterestCategory, { sum: number; count: number }> = {
            realistic: { sum: 0, count: 0 },
            investigative: { sum: 0, count: 0 },
            artistic: { sum: 0, count: 0 },
            social: { sum: 0, count: 0 },
            enterprising: { sum: 0, count: 0 },
            conventional: { sum: 0, count: 0 },
        };

        interestQuestions.forEach((q, index) => {
            const rating = ratings[index];
            if (rating !== null) {
                scores[q.category].sum += rating;
                scores[q.category].count++;
            }
        });

        const finalScores: InterestScores = {
            realistic: scores.realistic.count > 0 ? (scores.realistic.sum / scores.realistic.count) / 5 : 0,
            investigative: scores.investigative.count > 0 ? (scores.investigative.sum / scores.investigative.count) / 5 : 0,
            artistic: scores.artistic.count > 0 ? (scores.artistic.sum / scores.artistic.count) / 5 : 0,
            social: scores.social.count > 0 ? (scores.social.sum / scores.social.count) / 5 : 0,
            enterprising: scores.enterprising.count > 0 ? (scores.enterprising.sum / scores.enterprising.count) / 5 : 0,
            conventional: scores.conventional.count > 0 ? (scores.conventional.sum / scores.conventional.count) / 5 : 0,
        };

        onComplete(finalScores);
    };
    
    const currentQuestion = interestQuestions[currentQuestionIndex];
    const progress = (currentQuestionIndex / interestQuestions.length) * 100;


    return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-slate-800 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">Interest Assessment</h2>
            <p className="text-slate-300 mb-6">Part 2 of 2: Now, let's explore what you enjoy doing.</p>
            
            <ProgressBar progress={progress} />

            <div className="mt-8">
                <p className="text-lg text-slate-300 mb-2">Statement {currentQuestionIndex + 1} of {interestQuestions.length}</p>
                <h3 className="text-xl font-semibold text-white text-center p-4 bg-slate-700 rounded-lg">{currentQuestion.question}</h3>
                
                <p className="text-center mt-6 text-slate-400">How much do you agree with this statement?</p>
                <div className="mt-4 flex justify-between items-center space-x-2">
                    <span className="text-sm text-slate-400">Disagree</span>
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => handleRatingSelect(rating)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all transform hover:scale-110 ${
                                ratings[currentQuestionIndex] === rating
                                    ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg'
                                    : 'bg-slate-600 border-slate-500 text-slate-200 hover:bg-slate-500'
                            }`}
                        >
                            {rating}
                        </button>
                    ))}
                    <span className="text-sm text-slate-400">Agree</span>
                </div>
            </div>

            {currentQuestionIndex === interestQuestions.length - 1 && (
                <div className="mt-10 text-center">
                    <Button onClick={handleSubmit} disabled={ratings.includes(null)}>
                        Get My Results
                    </Button>
                </div>
            )}
        </div>
    );
};

export default InterestTest;
