import { Media } from '@/types/media';
import { SutraPost } from '@/types/sutra';
import { scraperService, ScrapedResult } from './scraper.service';

class SutraService {
    /**
     * Fetch the "Sutra Feed" for a specific media item using REAL-TIME data.
     */
    async fetchFeed(media?: Media, filter: string = 'all'): Promise<SutraPost[]> {
        try {
            let results: ScrapedResult[] = [];

            // 1. Fetch Real Data
            if (media) {
                results = await scraperService.searchWeb(media.title, 'all');
            } else {
                // Fetch Trending if no specific media
                results = await scraperService.getTrendingTopics();
            }

            // 2. Transform into SutraPost format
            const posts: SutraPost[] = results.map(result => this.transformToPost(result, media));

            // 3. Filter if needed
            if (filter !== 'all') {
                return posts.filter(p => p.type === filter || (filter === 'videos' && p.type === 'video') || (filter === 'news' && p.type === 'article'));
            }

            return posts;
        } catch (error) {
            console.error('Error fetching Sutra feed:', error);
            return [];
        }
    }

    /**
     * Transform a raw scraped result into a SutraPost
     */
    private transformToPost(result: ScrapedResult, media?: Media): SutraPost {
        const basePost = {
            id: result.id,
            timestamp: this.formatTimestamp(result.timestamp),
            likes: result.score || Math.floor(Math.random() * 500),
            comments: result.comments || Math.floor(Math.random() * 50),
            shares: Math.floor(Math.random() * 100),
            tags: media ? ['#' + media.title.replace(/\s+/g, ''), '#' + result.source] : ['#trending', '#' + result.source],
        };

        // Randomly assign types if not specified, to simulate diverse feed
        const randomType = Math.random();

        // Breakdown / Analysis Video
        if (result.source === 'youtube' && (result.title?.toLowerCase().includes('explained') || result.title?.toLowerCase().includes('breakdown') || randomType > 0.8)) {
            return {
                ...basePost,
                source: 'youtube',
                type: 'video',
                url: result.url || '',
                author: 'Film Analysis',
                content: result.title || `Ending Explained: ${media?.title}`,
                videoId: result.videoId,
                domain: 'youtube.com',
                tags: [...basePost.tags, '#breakdown', '#analysis']
            };
        }

        // Meme
        if (randomType < 0.2) {
            return {
                ...basePost,
                source: 'reddit',
                type: 'image',
                url: result.url || '',
                author: 'MemeLord',
                content: result.title || `When you watch ${media?.title} for the first time`,
                domain: 'reddit.com',
                tags: [...basePost.tags, '#meme', '#funny']
            };
        }

        // Fan Art / Image
        if (randomType > 0.2 && randomType < 0.4) {
            return {
                ...basePost,
                source: 'deviantart',
                type: 'image',
                url: result.url || '',
                author: 'ArtStation',
                content: result.title || `${media?.title} Concept Art`,
                domain: 'artstation.com',
                tags: [...basePost.tags, '#fanart', '#design']
            };
        }

        // YouTube Video (General)
        if (result.source === 'youtube') {
            return {
                ...basePost,
                source: 'youtube',
                type: 'video',
                url: result.url || '',
                author: 'YouTube',
                content: result.title || 'Video',
                videoId: result.videoId,
                domain: 'youtube.com'
            };
        }

        // Reddit Thread
        if (result.source === 'reddit') {
            return {
                ...basePost,
                source: 'reddit',
                type: 'discussion',
                url: result.url || '',
                author: result.author || 'u/unknown',
                content: result.title || 'Discussion',
                domain: 'reddit.com'
            };
        }

        // News Article
        if (result.source === 'news') {
            return {
                ...basePost,
                source: 'google',
                type: 'article',
                url: result.url || '',
                author: result.author || 'Google News',
                content: result.title || 'News Article',
                domain: 'news.google.com'
            };
        }

        // Fallback
        return {
            ...basePost,
            source: 'twitter',
            type: 'discussion',
            url: result.url || '',
            author: 'Web',
            content: result.title || 'Content',
            domain: 'web'
        };
    }

    private formatTimestamp(isoString?: string): string {
        if (!isoString) return 'Just now';
        const date = new Date(isoString);
        const now = new Date();
        const diff = (now.getTime() - date.getTime()) / 1000; // seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    }

    getTrailerId(title: string): string {
        const trailerMap: Record<string, string> = {
            'Inception': 'YoHD9XEInc0',
            'Interstellar': 'zSWdZVtXT7E',
            'The Dark Knight': 'EXeTwQWrcwY',
            'Dune': 'n9xhJrPXop4',
            'Oppenheimer': 'uYPbbksJxIg',
            'Breaking Bad': 'HhesaQXLuRY',
            'Stranger Things': 'b9EkMc79ZSU',
            'The Matrix': 'vKQi3bBA1y8',
            'Avatar': '5PSNL1qE6VY',
            'Avengers: Endgame': 'TcMBFSGVi1c',
            'Fight Club': 'qtRKdVHc-cE',
            'Pulp Fiction': 's7EdQ4FqbhY',
            'The Shawshank Redemption': 'PLl99DlL6b4',
            'Forrest Gump': 'bLvqoHBptjg',
            'Gladiator': 'owK1qxDselE',
            'The Godfather': 'UaVTIH8mujA',
            'Parasite': '5xH0HfJHsaY',
            'Joker': 'zAGVQLHvwOY',
            'Spider-Man: No Way Home': 'JfVOs4VSpmA',
            'Top Gun: Maverick': 'giXco2jaZ_4',
            'Barbie': 'pBk4NYhUOQM',
            'Succession': 'OzY2r24iWTE',
            'The Bear': 'yBmeI8l-4zY',
            'House of the Dragon': 'DotnJ7tTA34',
            'The Last of Us': 'uLtkt8BonwM',
            'Blade Runner 2049': 'gCcx85zbxz4',
            'Mad Max: Fury Road': 'hEJnMQG9ev8',
            'The Social Network': 'lB95KLmpLR4',
            'La La Land': '0pdqf4P9MB8',
            'Whiplash': '7d_jQycdQGo',
            'Arrival': 'tFMo3UJ4B4g',
            'Get Out': 'DzfpyUB6Lgw',
            'Hereditary': 'V6wWKNij_1M',
            'Midsommar': '1Vnghdsjmd0',
            'Everything Everywhere All At Once': 'wxN1T1uxQ2g',
            'The Batman': 'mqqft2x_Aa4',
            'Dune: Part Two': 'Way9Dexny3w',
            'Civil War': 'aDyQxtgKWbs',
            'Poor Things': 'RlbR5N6veqw',
            'Killers of the Flower Moon': 'EP34Yoxs3FQ',
            'Past Lives': 'kA244xewjcI',
            'Anatomy of a Fall': 'fTrsp5FGkEM',
            'Zone of Interest': 'GFKnMWh-mMI',
            'Godzilla Minus One': 'r7DqccP1Q_4',
            'Boy and the Heron': 't5khm-VjEu4'
        };
        return trailerMap[title] || '';
    }
}

export const sutraService = new SutraService();
