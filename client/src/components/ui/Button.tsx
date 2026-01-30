import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    children: React.ReactNode;
}

/**
 * Componente Button reutilizable con variantes
 */
export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    children,
    className = '',
    ...props
}) => {
    const baseStyles = 'font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        danger: 'bg-red-600 hover:bg-red-700 text-white'
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
