import React from 'react';
import { AIRoadmap } from '../types';

interface CareerDetailModalProps {
    career: AIRoadmap | null;
    onClose: () => void;
}

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CareerDetailModal: React.FC<CareerDetailModalProps> = ({ career, onClose }) => {
    if (!career) return null;

    const renderList = (items: string[] | undefined, title: string) => (
         <div>
            <h3 className="font-semibold text-white mb-2 text-lg">{title}</h3>
            <ul className="list-disc list-inside text-slate-400 space-y-1 pl-1">
                {items?.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        </div>
    );

    return (
        <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="career-title"
        >
            <div
                className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-slate-700 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                    aria-label="Close dialog"
                >
                    <XIcon className="h-6 w-6" />
                </button>

                <h2 id="career-title" className="text-2xl md:text-3xl font-bold text-cyan-400 pr-8">{career.jobTitle}</h2>
                <p className="mt-2 text-slate-300">{career.learningPath}</p>
                
                <div className="mt-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h3 className="font-semibold text-cyan-400 mb-1 text-base">Why It's a Good Fit</h3>
                    <p className="text-slate-300 italic text-sm">{career.rationale}</p>
                </div>


                <div className="mt-6 border-t border-slate-700 pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {renderList(career.highSchoolSubjects, "Key High School Subjects")}
                    {renderList(career.potentialMajors, "Potential College Majors")}
                    {renderList(career.tools, "Helpful Tools to Explore")}
                    
                    <div className="md:col-span-2">
                        <h3 className="font-semibold text-white mb-2 text-lg">Extracurriculars & Early Experience</h3>
                        <p className="text-slate-400">{career.extracurriculars}</p>
                    </div>

                     <div className="md:col-span-2 bg-slate-700/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-white mb-2 text-lg">⭐ Pro Tip for High Schoolers</h3>
                        <p className="text-slate-300">{career.extraTip}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerDetailModal;