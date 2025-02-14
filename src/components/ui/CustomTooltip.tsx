import ReactDOM from 'react-dom';
import { useState, useRef, useEffect, ReactNode, FC } from 'react';

interface CustomTooltipProps {
    content: ReactNode;
    children: ReactNode;
    className?: string;
}

export const CustomTooltip: FC<CustomTooltipProps> = ({ content, children, className }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipStyles, setTooltipStyles] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);


    const handleMouseEnter = () => {
        if (triggerRef.current) {
            const { top, left, width, height } = triggerRef.current.getBoundingClientRect();
            setTooltipStyles({
                top: top + window.scrollY + 3*height/4, // Position below the trigger element
                left: left + window.scrollX + width/2, // Center horizontally
            });
        }
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    }

    return (
        <>
            <div 
                ref={triggerRef}
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
                className={className}
            >
                {children}
            </div>
            {isVisible && ReactDOM.createPortal(
                <div 
                    ref={tooltipRef}
                    style={{ position: 'absolute', top: tooltipStyles.top, left: tooltipStyles.left, transform: 'translateX(-65%)' }} 
                    className="fixed z-50 w-40"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {content}
                </div>,
                document.body
            )}
        </>
    );
};