import { ReactNode } from 'react';
import Link from 'next/link';
import { showToast } from '../utils/showToast';

/**
 * Props for the ToolCard component.
 */
interface ToolCardProps {
    href: string;
    icon: ReactNode;
    title: string;
    description: string;
    disabled?:boolean;
}

/**
 * ToolCard component for rendering each tool as a card.
 */
function ToolCard({
    href,
    icon,
    title,
    description,
    disabled = false,
}: ToolCardProps) {
    const handleClick = (e: React.MouseEvent) => {
        if (disabled) {
            e.preventDefault(); // Prevent navigation if disabled
            showToast("info", "This feature is not implemented yet.")
        }
    };

    return (
        <Link
            href={disabled ? "#" : href} // Disable navigation when disabled
            onClick={handleClick}
            className={`flex flex-col items-center text-center bg-white rounded-lg shadow-lg p-6 transition-transform transform ${
                disabled
                    ? "bg-gray-200 text-gray-400"
                    : "hover:scale-105"
            }`}
        >
            <div className="flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-secondary">
                {icon}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600 mt-2">{description}</p>
            {disabled && (
                <p className="mt-2 text-sm text-center">
                    Not Yet Implemented
                </p>
            )}
        </Link>
    );
}

export default ToolCard;
