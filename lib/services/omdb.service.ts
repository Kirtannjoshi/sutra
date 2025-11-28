import axios from 'axios';
import { Media, SearchResult, OMDbResponse, Season } from '@/types/media';

const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || '4d2dd959';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

class OMDbService {
    private apiKey: string;

    constructor() {
        this.apiKey = OMDB_API_KEY || '';
        if (!this.apiKey) {
            console.warn('OMDb API key is not configured');
        }
    }

    /**
     * Search for movies, TV shows, or anime
     */
    async searchMedia(
        query: string,
        type?: 'movie' | 'series',
        page: number = 1
    ): Promise<SearchResult> {
        try {
            const params: any = {
                apikey: this.apiKey,
                s: query,
                page,
            };

            if (type) {
                params.type = type;
            }

            const response = await axios.get<OMDbResponse>(OMDB_BASE_URL, { params });

            if (response.data.Response === 'False') {
                // Try mock data as fallback
                const { mockDataService } = await import('./mock-data.service');
                return await mockDataService.searchMedia(query, type);
            }

            const search = (response.data.Search || []).map(this.transformMedia);

            return {
                search,
                totalResults: response.data.totalResults || '0',
                response: 'True',
            };
        } catch (error: any) {
            // Silently fallback to mock data (API limit reached or other error)
            if (error?.response?.status === 401) {
                console.log('OMDb API limit reached, using mock data');
            } else {
                console.warn('OMDb search error, using mock data:', error?.message);
            }
            const { mockDataService } = await import('./mock-data.service');
            return await mockDataService.searchMedia(query, type);
        }
    }

    async getMediaDetails(imdbId: string): Promise<Media | null> {
        try {
            const response = await axios.get<OMDbResponse>(OMDB_BASE_URL, {
                params: {
                    apikey: this.apiKey,
                    i: imdbId,
                    plot: 'full',
                },
            });

            if (response.data.Response === 'False') {
                // Try mock data as fallback
                const { mockDataService } = await import('./mock-data.service');
                return await mockDataService.getMediaDetails(imdbId);
            }

            return this.transformDetailedMedia(response.data);
        } catch (error: any) {
            // Silently fallback to mock data (API limit reached or other error)
            if (error?.response?.status === 401) {
                console.log('OMDb API limit reached, using mock data');
            } else {
                console.warn('OMDb details error, using mock data:', error?.message);
            }
            const { mockDataService } = await import('./mock-data.service');
            return await mockDataService.getMediaDetails(imdbId);
        }
    }

    /**
     * Get episodes for a specific season of a TV series
     */
    async getSeasonEpisodes(imdbId: string, season: number): Promise<Season | null> {
        try {
            const response = await axios.get<OMDbResponse>(OMDB_BASE_URL, {
                params: {
                    apikey: this.apiKey,
                    i: imdbId,
                    Season: season,
                },
            });

            if (response.data.Response === 'False') {
                return null;
            }

            return {
                season,
                totalSeasons: response.data.totalSeasons || '1',
                episodes: (response.data.Episodes || []).map((ep: any) => ({
                    title: ep.Title,
                    released: ep.Released,
                    episode: ep.Episode,
                    imdbRating: ep.imdbRating,
                    imdbID: ep.imdbID
                })),
            };
        } catch (error: any) {
            // Silently fallback to mock data (API limit reached or other error)
            if (error?.response?.status === 401) {
                console.log('OMDb API limit reached (Season), using mock data');
            } else {
                console.warn('OMDb season error, using mock data:', error?.message);
            }
            const { mockDataService } = await import('./mock-data.service');
            return await mockDataService.getSeasonEpisodes(imdbId, season);
        }
    }

    /**
     * Get media by title (alternative to search)
     */
    async getMediaByTitle(title: string, year?: string): Promise<Media | null> {
        try {
            const params: any = {
                apikey: this.apiKey,
                t: title,
                plot: 'full',
            };

            if (year) {
                params.y = year;
            }

            const response = await axios.get<OMDbResponse>(OMDB_BASE_URL, { params });

            if (response.data.Response === 'False') {
                return null;
            }

            return this.transformDetailedMedia(response.data);
        } catch (error) {
            console.error('OMDb title search error:', error);
            throw new Error('Failed to fetch media by title');
        }
    }

    /**
     * Transform OMDb search result to Media type
     */
    private transformMedia(data: any): Media {
        return {
            imdbID: data.imdbID,
            title: data.Title,
            year: data.Year,
            type: data.Type === 'series' ? 'series' : data.Type === 'movie' ? 'movie' : 'anime',
            poster: data.Poster,
        };
    }

    /**
     * Transform detailed OMDb response to Media type
     */
    private transformDetailedMedia(data: OMDbResponse): Media {
        return {
            imdbID: data.imdbID || '',
            title: data.Title || '',
            year: data.Year || '',
            type: data.Type === 'series' ? 'series' : data.Type === 'movie' ? 'movie' : 'anime',
            poster: data.Poster || '',
            plot: data.Plot,
            rated: data.Rated,
            released: data.Released,
            runtime: data.Runtime,
            genre: data.Genre,
            director: data.Director,
            writer: data.Writer,
            actors: data.Actors,
            language: data.Language,
            country: data.Country,
            awards: data.Awards,
            ratings: data.Ratings,
            imdbRating: data.imdbRating,
            imdbVotes: data.imdbVotes,
            metascore: data.Metascore,
            boxOffice: data.BoxOffice,
            production: data.Production,
            website: data.Website,
            totalSeasons: data.totalSeasons,
        };
    }
}

// Export singleton instance
export const omdbService = new OMDbService();
