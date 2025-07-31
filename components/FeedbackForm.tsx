
import React, { useState } from 'react';
import { AIRoadmap, FeedbackSubmission, AptitudeScores, InterestScores } from '../types';
import Button from './ui/Button';
import StarRating from './ui/StarRating';

interface FeedbackFormProps {
    career: AIRoadmap;
    aptitudeScores: AptitudeScores;
    interestScores: InterestScores;
    userAnswers: string[];
    onFeedbackSubmit: (jobTitle: string) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ career, aptitudeScores, interestScores, userAnswers, onFeedbackSubmit }) => {
    const [rating, setRating] = useState(0);
    const [betterFit, setBetterFit] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (rating === 0) {
            setError("Please provide a star rating.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const feedbackSubmission: FeedbackSubmission = {
            userProfile: {
                aptitudeScores,
                interestScores,
                userAnswers,
            },
            aiRecommendation: career,
            userFeedback: {
                rating,
                suggestedBetterFit: betterFit,
            },
            timestamp: new Date().toISOString(),
        };

        try {
            // This fetch call is proxied to the backend server (http://localhost:3001) by Vite's dev server.
            // See vite.config.ts for the proxy configuration.
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedbackSubmission),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit feedback. The server might be down.');
            }

            // If submission is successful, notify the parent component
            onFeedbackSubmit(career.jobTitle);

        } catch (err) {
            // Handle network errors or the error thrown above
            console.error("Feedback submission error:", err);
            setError(err instanceof Error ? err.message : "An unknown network error occurred.");
            setIsSubmitting(false); // Allow user to try again
        }
    };

    return (
        <div className="mt-4 border-t-2 border-slate-700 pt-4">
            <h4 className="font-semibold text-slate-200 text-center mb-3">Provide Feedback</h4>
            <div className="space-y-4">
                <div className="text-center">
                    <label className="block text-sm font-medium text-slate-400 mb-2">How good of a match is this career for you?</label>
                    <StarRating rating={rating} onRatingChange={setRating} />
                </div>
                <div>
                    <label htmlFor={`betterFit-${career.jobTitle}`} className="block text-sm font-medium text-slate-400 mb-1">What career do YOU think is a better fit? (Optional)</label>
                    <input
                        id={`betterFit-${career.jobTitle}`}
                        type="text"
                        value={betterFit}
                        onChange={(e) => setBetterFit(e.target.value)}
                        className="w-full text-sm p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-1 focus:ring-cyan-500"
                    />
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <Button onClick={handleSubmit} size="sm" className="w-full" disabled={rating === 0 || isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
            </div>
        </div>
    );
};

export default FeedbackForm;
