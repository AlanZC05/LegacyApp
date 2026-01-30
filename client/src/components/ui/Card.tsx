import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

/**
 * Componente Card reutilizable
 */
export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            {title && (
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            )}
            {children}
        </div>
    );
};
