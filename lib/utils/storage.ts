// Cookie-based storage utility for client-side data persistence

export const cookieStorage = {
    // Set a cookie
    set: (name: string, value: any, days: number = 365) => {
        if (typeof window === 'undefined') return;

        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

        const cookieValue = JSON.stringify(value);
        document.cookie = `${name}=${encodeURIComponent(cookieValue)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    },

    // Get a cookie
    get: (name: string): any | null => {
        if (typeof window === 'undefined') return null;

        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(nameEQ) === 0) {
                const value = cookie.substring(nameEQ.length, cookie.length);
                try {
                    return JSON.parse(decodeURIComponent(value));
                } catch {
                    return null;
                }
            }
        }
        return null;
    },

    // Remove a cookie
    remove: (name: string) => {
        if (typeof window === 'undefined') return;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    },

    // Clear all cookies
    clearAll: () => {
        if (typeof window === 'undefined') return;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        }
    }
};

// Session storage wrapper (in-memory for current session)
export const sessionStorage = {
    data: {} as Record<string, any>,

    set: (key: string, value: any) => {
        if (typeof window !== 'undefined') {
            sessionStorage.data[key] = value;
            window.sessionStorage.setItem(key, JSON.stringify(value));
        }
    },

    get: (key: string): any | null => {
        if (typeof window !== 'undefined') {
            const stored = window.sessionStorage.getItem(key);
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch {
                    return null;
                }
            }
        }
        return sessionStorage.data[key] || null;
    },

    remove: (key: string) => {
        if (typeof window !== 'undefined') {
            delete sessionStorage.data[key];
            window.sessionStorage.removeItem(key);
        }
    },

    clear: () => {
        if (typeof window !== 'undefined') {
            sessionStorage.data = {};
            window.sessionStorage.clear();
        }
    }
};
