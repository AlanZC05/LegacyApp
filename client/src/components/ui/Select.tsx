import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: Array<{ value: string | number; label: string }>;
    error?: string;
}

/**
 * Componente Select reutilizable
 */
export const Select: React.FC<SelectProps> = ({
    label,
    options,
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
            <select
                className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};
