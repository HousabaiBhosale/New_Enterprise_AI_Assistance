export const API_BASE_URL = "http://localhost:8000/api";

export async function fetchFromAPI(endpoint, options = {}) {
    const token = localStorage.getItem("enterprise_auth_token");
    const headers = { ...options.headers };

    // If body is NOT FormData, set default Content-Type to JSON
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = headers["Content-Type"] || "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            signal: options.signal || controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            let errorMsg = response.statusText;
            try {
                const errData = await response.json();
                if (errData && errData.detail) {
                    errorMsg = errData.detail;
                }
            } catch (_) {}
            throw new Error(errorMsg);
        }

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        return response;
    } catch (error) {
        console.error(`API Fetch Error [${endpoint}]:`, error);
        throw error;
    }
}
