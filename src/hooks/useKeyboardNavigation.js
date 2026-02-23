import { useEffect } from 'react';

export function useKeyboardNavigation() {
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Only enable focus rings when the user explicitly tabs
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
            }
        };

        const handleMouseDown = () => {
            // Remove focus rings when the user uses the mouse/touch
            document.body.classList.remove('user-is-tabbing');
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousedown', handleMouseDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);
}
