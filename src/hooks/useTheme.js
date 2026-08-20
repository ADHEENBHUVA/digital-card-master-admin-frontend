import { useState, useEffect } from 'react';

export default function useTheme() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const handleThemeSync = (e) => setTheme(e.detail);
        window.addEventListener('themeChange', handleThemeSync);
        return () => window.removeEventListener('themeChange', handleThemeSync);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'dark' ? 'light' : 'dark';
            window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
            return newTheme;
        });
    };

    return { theme, toggleTheme };
}
