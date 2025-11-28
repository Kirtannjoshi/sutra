// Media Types
export interface Media {
    imdbID: string;
    title: string;
    year: string;
    type: 'movie' | 'series' | 'anime';
    poster: string;
    plot?: string;
    rated?: string;
    released?: string;
    runtime?: string;
    genre?: string;
    director?: string;
    writer?: string;
    actors?: string;
    language?: string;
    country?: string;
    awards?: string;
    ratings?: Rating[];
    imdbRating?: string;
    imdbVotes?: string;
    metascore?: string;
    boxOffice?: string;
    production?: string;
    website?: string;
    totalSeasons?: string;
    trailers?: { language: string; url: string; title?: string }[];
    volumes?: { name: string; episodes: string; releaseDate?: string }[];
}

export interface Rating {
    source: string;
    value: string;
}

export interface SearchResult {
    search: Media[];
    totalResults: string;
    response: string;
    error?: string;
}

export interface Collection {
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
    items: string[]; // IMDb IDs
    createdAt: string;
    updatedAt: string;
}

// Episode Tracking
export interface Episode {
    title: string;
    released: string;
    episode: string;
    imdbRating: string;
    imdbID: string;
}

export interface Season {
    season: number;
    totalSeasons: string;
    episodes: Episode[];
}

export interface EpisodeTracking {
    id: string;
    watchlistItemId: string;
    seasonNumber: number;
    episodeNumber: number;
    watched: boolean;
    watchedAt?: string;
}

// Watchlist
export type WatchlistStatus = 'watching' | 'completed' | 'on_hold' | 'dropped';

export interface WatchlistItem {
    id: string;
    userId: string;
    imdbId: string;
    mediaType: 'movie' | 'series' | 'anime';
    status: WatchlistStatus;
    rating?: number; // 1-10
    notes?: string;
    createdAt: string;
    updatedAt: string;
    cached: boolean;
    cachedAt?: string;
}

// User
export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    createdAt: string;
}

// API Response Types
export interface OMDbResponse {
    Response: string;
    Error?: string;
    Search?: any[];
    totalResults?: string;
    Title?: string;
    Year?: string;
    Rated?: string;
    Released?: string;
    Runtime?: string;
    Genre?: string;
    Director?: string;
    Writer?: string;
    Actors?: string;
    Plot?: string;
    Language?: string;
    Country?: string;
    Awards?: string;
    Poster?: string;
    Ratings?: Rating[];
    Metascore?: string;
    imdbRating?: string;
    imdbVotes?: string;
    imdbID?: string;
    Type?: string;
    DVD?: string;
    BoxOffice?: string;
    Production?: string;
    Website?: string;
    totalSeasons?: string;
    Episodes?: any[];
    Season?: string;
}

// Streaming Availability
export interface StreamingPlatform {
    name: string;
    icon: string;
    url: string;
    color?: string;
    type?: 'stream' | 'rent' | 'buy';
}

export interface AvailabilityData {
    imdbId: string;
    platforms: StreamingPlatform[];
    cached: boolean;
    cachedAt?: string;
}
