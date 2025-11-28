import { Media } from '@/types/media';
import MediaCard from './MediaCard';

interface MediaGridProps {
    items: Media[];
    loading?: boolean;
}

export default function MediaGrid({ items, loading = false }: MediaGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {Array.from({ length: 18 }).map((_, i) => (
                    <div key={i} className="aspect-[2/3] w-full skeleton rounded-lg" />
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-xl text-text-muted mb-2">No media found</p>
                <p className="text-sm text-text-secondary">Try adjusting your search or filters</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
            {items.map((item) => (
                <MediaCard key={item.imdbID} media={item} />
            ))}
        </div>
    );
}
