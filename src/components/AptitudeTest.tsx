import React, { useState } from 'react';
import { aptitudeQuestions } from '../data/assessmentData';
import { AptitudeScores, AptitudeCategory } from '../types';
import Button from './ui/Button';
import ProgressBar from './ui/ProgressBar';

interface AptitudeTestProps {
    onComplete: (scores: AptitudeScores) => void;
}

const AptitudeTest: React.FC<AptitudeTestProps> = ({ onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(aptitudeQuestions.length).fill(null));

    const handleAnswerSelect = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);

        // Automatically move to the next question
        setTimeout(() => {
            if (currentQuestionIndex < aptitudeQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }, 300);
    };

    const handleSubmit = () => {
        const scores: Record<AptitudeCategory, { correct: number; total: number }> = {
            verbal: { correct: 0, total: 0 },
            logical: { correct: 0, total: 0 },
            spatial: { correct: 0, total: 0 },
            numerical: { correct: 0, total: 0 },
        };

        aptitudeQuestions.forEach((q, index) => {
            scores[q.category].total++;
            if (answers[index] === q.correctAnswer) {
                scores[q.category].correct++;
            }
        });

        const finalScores: AptitudeScores = {
            verbal: scores.verbal.total > 0 ? scores.verbal.correct / scores.verbal.total : 0,
            logical: scores.logical.total > 0 ? scores.logical.correct / scores.logical.total : 0,
            spatial: scores.spatial.total > 0 ? scores.spatial.correct / scores.spatial.total : 0,
            numerical: scores.numerical.total > 0 ? scores.numerical.correct / scores.numerical.total : 0,
        };

        onComplete(finalScores);
    };

    const currentQuestion = aptitudeQuestions[currentQuestionIndex];
    const progress = (currentQuestionIndex / aptitudeQuestions.length) * 100;

    return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-slate-800 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">Aptitude Assessment</h2>
            <p className="text-slate-300 mb-6">Part 1 of 2: Let's discover your natural strengths.</p>

            <ProgressBar progress={progress} />

            <div className="mt-8">
                <p className="text-lg text-slate-300 mb-2">Question {currentQuestionIndex + 1} of {aptitudeQuestions.length}</p>
                <h3 className="text-xl font-semibold text-white">{currentQuestion.question}</h3>
                <div className="mt-6 space-y-3">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            className={`block w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                                answers[currentQuestionIndex] === index
                                    ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg'
                                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {currentQuestionIndex === aptitudeQuestions.length - 1 && (
                <div className="mt-8 text-center">
                    <Button onClick={handleSubmit} disabled={answers.includes(null)}>
                        Complete Aptitude Test
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AptitudeTest;