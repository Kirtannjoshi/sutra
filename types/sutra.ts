export type SutraSource = 'facebook' | 'google' | 'twitter' | 'instagram' | 'youtube' | 'reddit' | 'letterboxd' | 'deviantart';

export type SutraPostType = 'short' | 'video' | 'article' | 'meme' | 'image' | 'discussion';

export interface SutraPost {
    id: string;
    source: SutraSource;
    type: SutraPostType;
    url: string;
    author: string;
    authorAvatar?: string;
    timestamp: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    shares: number;

    // Source specific
    domain?: string;
    snippet?: string;
    authorHandle?: string;
    verified?: boolean;
    videoId?: string;
    tags?: string[];
    isAnalysis?: boolean;
}
