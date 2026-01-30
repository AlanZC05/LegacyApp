import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

/**
 * Componente Input reutilizable con label y error
 */
export const Input: React.FC<InputProps> = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${className}`}
                {...props}
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};
