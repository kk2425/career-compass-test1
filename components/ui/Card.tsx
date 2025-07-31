
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    const cardClassName = `bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700/50 ${className}`;
    return <div className={cardClassName}>{children}</div>;
};

export default Card;
