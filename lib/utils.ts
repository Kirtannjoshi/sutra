import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format runtime from minutes to "2h 30m" format
 */
export function formatRuntime(minutes: string | number): string {
    const mins = typeof minutes === 'string' ? parseInt(minutes) : minutes;
    if (isNaN(mins)) return 'N/A';

    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;

    if (hours === 0) return `${remainingMins}m`;
    if (remainingMins === 0) return `${hours}h`;
    return `${hours}h ${remainingMins}m`;
}

/**
 * Extract year from date string
 */
export function getYearFromDate(dateString: string): string {
    const year = new Date(dateString).getFullYear();
    return isNaN(year) ? dateString : year.toString();
}

/**
 * Format large numbers (e.g., 1000000 -> 1M)
 */
export function formatNumber(num: string | number): string {
    const n = typeof num === 'string' ? parseInt(num.replace(/,/g, '')) : num;
    if (isNaN(n)) return '0';

    if (n >= 1000000) {
        return (n / 1000000).toFixed(1) + 'M';
    }
    if (n >= 1000) {
        return (n / 1000).toFixed(1) + 'K';
    }
    return n.toString();
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

/**
 * Get poster URL or fallback
 */
export function getPosterUrl(poster: string | undefined): string {
    if (!poster || poster === 'N/A') {
        return '/placeholder-poster.jpg';
    }
    return poster;
}

/**
 * Calculate episode progress percentage
 */
export function calculateProgress(watched: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((watched / total) * 100);
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
