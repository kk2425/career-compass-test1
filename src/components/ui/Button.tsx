import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', size = 'md', ...props }) => {
    const baseStyles = 'font-bold rounded-lg transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';

    const variantStyles = {
        primary: 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg shadow-cyan-500/20',
        secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-600',
    };

    const sizeStyles = {
        sm: 'py-2 px-4 text-sm',
        md: 'py-2.5 px-6 text-base',
        lg: 'py-3 px-8 text-lg',
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return (
        <button className={combinedClassName} {...props}>
            {children}
        </button>
    );
};

export default Button;