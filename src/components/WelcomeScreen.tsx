import React from 'react';
import Button from './ui/Button';

interface WelcomeScreenProps {
    onStart: () => void;
}

const CompassIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m-6.364-2.136l1.591-1.591M20.136 5.636l-1.591 1.591M3 12h2.25m13.5 0H21m-9-9l3.536 3.536M9 15l-3.536-3.536" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l3.536 3.536" />
    </svg>
);


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 animate-fade-in">
            <CompassIcon />
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-6">
                Welcome to Career Compass AI
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-300">
                Discover your ideal career path. This tool analyzes your unique aptitudes and interests to provide personalized recommendations, with optional AI-powered guidance for a deeper dive.
            </p>
            <div className="mt-10">
                <Button onClick={onStart} size="lg">
                    Find My Career Path
                </Button>
            </div>
        </div>
    );
};

export default WelcomeScreen;