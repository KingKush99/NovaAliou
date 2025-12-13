import { useEffect } from 'react';
import { useSubscriptionStore } from '../store/useSubscriptionStore';

export function useTheme() {
    const { getTheme } = useSubscriptionStore();
    const theme = getTheme();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return theme;
}
