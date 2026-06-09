// Global configuration constants for the ARMOR application.

// Polling interval for live dashboard updates (in milliseconds)
export const DASHBOARD_POLLING_INTERVAL = 3000000; // 50 minutes

// Standard UI timings
export const DEFAULT_DEBOUNCE_MS = 500;
export const MIN_VISIBLE_LOADING_TIME_MS = 400;
export const THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;

// Standard pagination
export const DEFAULT_PAGE_SIZE = 12;

export const getReportDownloadUrl = (reportUrl: string): string => {
    if (!reportUrl) return '';
    if (reportUrl.startsWith('http')) return reportUrl;

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
    let serverUrl: string = "";
    try {
        if (apiBaseUrl) {
            serverUrl = new URL(apiBaseUrl).origin;
        }
    } catch {
        // Fallback already initialized
    }
    return `${serverUrl}${reportUrl}`;
};
