const API_URL = 'http://localhost:5000/api';

const getBaseUrl = () => {
    // Gunakan VITE_APP_URL dari .env jika ada (Public URL), jika tidak fallback ke localhost
    if (import.meta.env.VITE_APP_URL) {
        return import.meta.env.VITE_APP_URL;
    }
    const { protocol, hostname, port } = window.location;
    const base = `${protocol}//${hostname}${port ? ':' + port : ''}`;
    return base;
};

const postJSON = async (endpoint, body) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        return await response.json();
    } catch (error) {
        console.error(`Auth API error (${endpoint}):`, error);
        return { status: 'error', error: 'Network error. Please check your connection.' };
    }
};

export const authApi = {
    login: (email, password) =>
        postJSON('/auth/login', { email, password }),

    register: (name, email, password) =>
        postJSON('/auth/register', {
            name, email, password,
            verifyLinkBase: `${getBaseUrl()}/verify-email`,
        }),

    forgotPassword: (email) =>
        postJSON('/auth/forgot-password', {
            email,
            resetLinkBase: `${getBaseUrl()}/reset-password`,
        }),

    resetPassword: (email, newPassword, token) =>
        postJSON('/auth/reset-password', { email, newPassword, token }),

    verifyEmail: (email, token) =>
        postJSON('/auth/verify-email', { email, token }),
};
