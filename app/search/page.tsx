'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { omdbService } from '@/lib/services/omdb.service';
import { Media } from '@/types/media';
import MediaGrid from '@/components/media/MediaGrid';
import { Film, Tv, Search as SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'movie' | 'series';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const [results, setResults] = useState<Media[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<FilterType>('all');

    useEffect(() => {
        if (query) {
            searchMedia(query, filter);
        }
    }, [query, filter]);

    const searchMedia = async (searchQuery: string, type: FilterType) => {
        try {
            setLoading(true);
            const filterType = type === 'all' ? undefined : type;
            const searchResults = await omdbService.searchMedia(searchQuery, filterType);

            // Fetch detailed info for each result
            const detailedResults = await Promise.all(
                searchResults.search.slice(0, 20).map((item) =>
                    omdbService.getMediaDetails(item.imdbID)
                )
            );

            setResults(detailedResults.filter((item): item is Media => item !== null));
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const filters: { type: FilterType; label: string; icon: any }[] = [
        { type: 'all', label: 'All', icon: SearchIcon },
        { type: 'movie', label: 'Movies', icon: Film },
        { type: 'series', label: 'TV Shows', icon: Tv },
    ];

    return (
        <div className="pt-24 px-8 pb-8 space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-text-primary">
                    {query ? `Search results for "${query}"` : 'Search'}
                </h1>

                {/* Filters */}
                <div className="flex gap-3">
                    {filters.map(({ type, label, icon: Icon }) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                                filter === type
                                    ? 'bg-accent-gold text-background font-semibold'
                                    : 'bg-card text-text-secondary hover:bg-card-hover hover:text-text-primary'
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <MediaGrid items={[]} loading={true} />
            ) : results.length > 0 ? (
                <MediaGrid items={results} />
            ) : query ? (
                <div className="text-center py-20">
                    <SearchIcon className="w-16 h-16 text-text-muted mx-auto mb-4" />
                    <p className="text-text-muted text-lg">No results found for "{query}"</p>
                    <p className="text-text-muted text-sm mt-2">Try different keywords or filters</p>
                </div>
            ) : (
                <div className="text-center py-20">
                    <SearchIcon className="w-16 h-16 text-text-muted mx-auto mb-4" />
                    <p className="text-text-muted text-lg">Start searching for movies, TV shows, or anime</p>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="p-8">
                <div className="h-10 w-64 skeleton rounded mb-8" />
                <div className="media-grid">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="aspect-[2/3] skeleton rounded-lg" />
                    ))}
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
