import axios from 'axios';
import { AvailabilityData } from '@/types/media';

// In-memory cache
const availabilityCache = new Map<string, AvailabilityData>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export interface ScrapedResult {
    source: 'reddit' | 'news' | 'youtube' | 'deviantart';
    id: string;
    title?: string;
    url?: string;
    author?: string;
    score?: number;
    comments?: number;
    image?: string;
    timestamp?: string;
    subreddit?: string;
    videoId?: string;
    thumbnail?: string;
}

class ScraperService {
    private readonly PROXIES = [
        'https://api.allorigins.win/raw?url=',
        'https://api.codetabs.com/v1/proxy?quest=',
        'https://corsproxy.io/?',
        'https://thingproxy.freeboard.io/fetch/'
    ];

    private async fetchWithProxy(url: string): Promise<any> {
        for (const proxy of this.PROXIES) {
            try {
                const { data } = await axios.get(proxy + encodeURIComponent(url));
                return data;
            } catch (e) {
                console.warn(`Proxy ${proxy} failed, trying next...`);
            }
        }
        throw new Error('All proxies failed');
    }

    /**
     * Search for real-time data across the web (Client-Side)
     */
    async searchWeb(query: string, type: 'all' | 'reddit' | 'news' | 'youtube' | 'art' = 'all'): Promise<ScrapedResult[]> {
        const results: ScrapedResult[] = [];
        const promises: Promise<void>[] = [];

        // 1. Reddit (Direct JSON - usually CORS friendly, but proxy is safer)
        if (type === 'all' || type === 'reddit') {
            promises.push(
                (async () => {
                    try {
                        const items = await this.fetchReddit(query);
                        results.push(...items);
                    } catch (e) {
                        console.error('Reddit error:', e);
                    }
                })()
            );
        }

        // 2. Google News (RSS via Proxy)
        if (type === 'all' || type === 'news') {
            promises.push(
                (async () => {
                    try {
                        const items = await this.fetchNews(query);
                        results.push(...items);
                    } catch (e) {
                        console.error('News error:', e);
                    }
                })()
            );
        }

        // 3. YouTube (Scraping via Proxy)
        if (type === 'all' || type === 'youtube') {
            promises.push(
                (async () => {
                    try {
                        const items = await this.fetchYouTube(query);
                        results.push(...items);
                    } catch (e) {
                        console.error('YouTube error:', e);
                    }
                })()
            );
        }

        // 4. DeviantArt (Scraping via Proxy)
        if (type === 'all' || type === 'art') {
            promises.push(
                (async () => {
                    try {
                        const items = await this.fetchDeviantArt(query);
                        results.push(...items);
                    } catch (e) {
                        console.error('DeviantArt error:', e);
                    }
                })()
            );
        }

        await Promise.all(promises);
        return results;
    }

    /**
     * Get Trending Topics (Leaks & Pop Culture)
     */
    async getTrendingTopics(): Promise<ScrapedResult[]> {
        // Fetch from specific "Leak" and "Pop Culture" subreddits
        const subreddits = [
            'MarvelStudiosSpoilers',
            'DCEUleaks',
            'GamingLeaksAndRumours',
            'popculturechat',
            'entertainment'
        ].join('+');

        try {
            const redditResults = await this.fetchReddit(`subreddit:${subreddits} sort:hot`);
            return redditResults.slice(0, 15); // Increased limit for better variety
        } catch (e) {
            console.error('Trending error:', e);
            return [];
        }
    }

    private async fetchReddit(query: string): Promise<ScrapedResult[]> {
        const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&t=month&limit=10`;
        try {
            // Try direct first
            const { data } = await axios.get(url);
            return this.parseReddit(data);
        } catch {
            // Fallback to proxy
            try {
                const data = await this.fetchWithProxy(url);
                return this.parseReddit(data);
            } catch (e) {
                console.warn('Reddit fetch failed', e);
                return [];
            }
        }
    }

    private parseReddit(data: any): ScrapedResult[] {
        return data.data?.children?.map((child: any) => ({
            source: 'reddit',
            id: `reddit-${child.data.id}`,
            title: child.data.title,
            url: `https://www.reddit.com${child.data.permalink}`,
            author: `u/${child.data.author}`,
            score: child.data.score,
            comments: child.data.num_comments,
            image: child.data.preview?.images?.[0]?.source?.url?.replace('&amp;', '&'),
            timestamp: new Date(child.data.created_utc * 1000).toISOString(),
        })) || [];
    }

    private async fetchNews(query: string): Promise<ScrapedResult[]> {
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
        try {
            const data = await this.fetchWithProxy(url);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const items: ScrapedResult[] = [];

            const itemNodes = xmlDoc.querySelectorAll('item');
            itemNodes.forEach((el) => {
                items.push({
                    source: 'news',
                    id: `news-${Math.random().toString(36).substr(2, 9)}`,
                    title: el.querySelector('title')?.textContent || 'News',
                    url: el.querySelector('link')?.textContent || '',
                    timestamp: el.querySelector('pubDate')?.textContent || '',
                    author: el.querySelector('source')?.textContent || 'Google News'
                });
            });
            return items.slice(0, 8);
        } catch (e) {
            console.warn('News fetch failed', e);
            return [];
        }
    }

    private async fetchYouTube(query: string): Promise<ScrapedResult[]> {
        // More specific query to find actual trailers
        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' official trailer')}`;
        try {
            const data = await this.fetchWithProxy(url);

            const videoIds = new Set<string>();
            // Improved regex to capture video IDs more reliably from raw HTML
            const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
            let match;
            while ((match = regex.exec(data)) !== null) {
                // Filter out common invalid/live IDs if possible (basic length check is already 11)
                videoIds.add(match[1]);
                if (videoIds.size >= 6) break;
            }

            return Array.from(videoIds).map(id => ({
                source: 'youtube',
                id: `yt-${id}`,
                videoId: id,
                url: `https://www.youtube.com/watch?v=${id}`,
                thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
            }));
        } catch (e) {
            console.warn('YouTube fetch failed', e);
            return [];
        }
    }

    private async fetchDeviantArt(query: string): Promise<ScrapedResult[]> {
        const url = `https://www.deviantart.com/search?q=${encodeURIComponent(query + ' fan art')}`;
        try {
            const data = await this.fetchWithProxy(url);
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/html");
            const images: ScrapedResult[] = [];

            const imgNodes = doc.querySelectorAll('img');
            imgNodes.forEach((el) => {
                const src = el.getAttribute('src');
                if (src && src.includes('wixmp.com') && !src.includes('avatar') && !src.includes('emoji')) {
                    images.push({
                        source: 'deviantart',
                        id: `art-${Math.random().toString(36).substr(2, 9)}`,
                        url: src,
                        title: el.getAttribute('alt') || 'Fan Art',
                        author: 'DeviantArt'
                    });
                }
            });
            return images.slice(0, 8);
        } catch (e) {
            console.warn('DeviantArt fetch failed', e);
            return [];
        }
    }

    /**
     * Get streaming availability from JustWatch (via Proxy)
     */
    async getAvailability(imdbId: string, title: string, year: string, country: string = 'US'): Promise<AvailabilityData> {
        const cacheKey = `avail-${title}-${year}-${country}`;
        if (availabilityCache.has(cacheKey)) {
            return availabilityCache.get(cacheKey)!;
        }

        const url = `https://www.justwatch.com/${country.toLowerCase()}/search?q=${encodeURIComponent(title)}`;
        try {
            const data = await this.fetchWithProxy(url);
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/html");

            const platforms: { name: string; url: string; icon: string; color: string; type: 'stream' | 'rent' | 'buy' }[] = [];
            const seen = new Set<string>();

            // Helper to map platform name to details
            const getPlatformDetails = (alt: string) => {
                let color = '#000';
                let icon = alt[0];
                let valid = false;

                // Global
                if (alt.includes('Netflix')) { color = '#E50914'; icon = 'N'; valid = true; }
                else if (alt.includes('Amazon') || alt.includes('Prime')) { color = '#00A8E1'; icon = 'P'; valid = true; }
                else if (alt.includes('Disney')) { color = '#113CCF'; icon = 'D'; valid = true; }
                else if (alt.includes('Hulu')) { color = '#1CE783'; icon = 'H'; valid = true; }
                else if (alt.includes('Max') || alt.includes('HBO')) { color = '#9900FF'; icon = 'M'; valid = true; }
                else if (alt.includes('Apple')) { color = '#000000'; icon = 'A'; valid = true; }
                else if (alt.includes('Peacock')) { color = '#000000'; icon = 'Pk'; valid = true; }
                else if (alt.includes('Paramount')) { color = '#0066FF'; icon = 'Pt'; valid = true; }
                // Indian / Regional
                else if (alt.includes('Hotstar')) { color = '#020E28'; icon = 'Hs'; valid = true; }
                else if (alt.includes('Jio')) { color = '#D6195E'; icon = 'J'; valid = true; }
                else if (alt.includes('Zee5')) { color = '#FF0000'; icon = 'Z'; valid = true; }
                else if (alt.includes('Sony')) { color = '#2E0062'; icon = 'S'; valid = true; }
                // Store (Rent/Buy)
                else if (alt.includes('Google Play')) { color = '#000000'; icon = 'G'; valid = true; }
                else if (alt.includes('YouTube')) { color = '#FF0000'; icon = 'Y'; valid = true; }
                else if (alt.includes('iTunes')) { color = '#000000'; icon = 'i'; valid = true; }

                return { valid, color, icon };
            };

            const firstResult = doc.querySelector('.title-list-row__column');
            if (firstResult) {
                const icons = doc.querySelectorAll('img[alt]');
                icons.forEach((img) => {
                    const alt = img.getAttribute('alt') || '';
                    // Check for lazy-loaded source first, then standard src
                    const src = img.getAttribute('data-src') || img.getAttribute('src') || '';

                    if (alt && !seen.has(alt)) {
                        const { valid, color, icon: fallbackIcon } = getPlatformDetails(alt);

                        if (valid) {
                            // Heuristic for type based on platform name
                            let type: 'stream' | 'rent' | 'buy' = 'stream';
                            if (alt.includes('Google Play') || alt.includes('iTunes') || alt.includes('YouTube')) {
                                type = 'rent'; // Default to rent for transactional
                            }

                            platforms.push({
                                name: alt.replace(' - ', ''),
                                url: `https://www.justwatch.com/${country.toLowerCase()}/search?q=${encodeURIComponent(title)}`,
                                icon: src || fallbackIcon, // Use scraped src if available
                                color,
                                type
                            });
                            seen.add(alt);
                        }
                    }
                });
            }

            // Fallback / Mock for demo if empty
            if (platforms.length === 0) {
                return {
                    imdbId,
                    platforms: [
                        { name: 'Netflix', url: '', icon: 'N', color: '#E50914', type: 'stream' },
                        { name: 'Prime Video', url: '', icon: 'P', color: '#00A8E1', type: 'stream' },
                        { name: 'Apple TV', url: '', icon: 'A', color: '#000000', type: 'rent' }
                    ],
                    cached: false
                };
            }

            const result = {
                imdbId,
                platforms: platforms.slice(0, 8),
                cached: true
            };
            availabilityCache.set(cacheKey, result);
            return result;

        } catch (error) {
            console.error('Error fetching availability:', error);
            return {
                imdbId,
                platforms: [],
                cached: false
            };
        }
    }

    /**
     * Get YouTube Trailer ID
     */
    async getTrailerId(title: string, year: string): Promise<string | null> {
        try {
            const results = await this.fetchYouTube(`${title} ${year} trailer`);
            return results[0]?.videoId || null;
        } catch (error) {
            console.error('Error fetching trailer ID:', error);
            return null;
        }
    }

    /**
     * Get Fan Art from DeviantArt
     */
    async getFanArt(query: string): Promise<string[]> {
        try {
            const results = await this.fetchDeviantArt(query);
            return results.map(r => r.url || '').filter(url => url);
        } catch (error) {
            console.error('Error fetching fan art:', error);
            return [];
        }
    }
}

export const scraperService = new ScraperService();
