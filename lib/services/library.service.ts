import { Collection, Media } from '@/types/media';

export interface WatchedItem {
    imdbID: string;
    title: string;
    watchedAt: string;
    type: 'movie' | 'series' | 'anime';
    poster: string;
}

const WATCHED_KEY = 'sutra_watched';
const COLLECTIONS_KEY = 'sutra_collections';

class LibraryService {
    private getStorageItem<T>(key: string, defaultValue: T): T {
        if (typeof window === 'undefined') return defaultValue;
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading ${key} from localStorage`, error);
            return defaultValue;
        }
    }

    private setStorageItem<T>(key: string, value: T): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing ${key} to localStorage`, error);
        }
    }

    // Watched Status
    getWatchedLog(): WatchedItem[] {
        return this.getStorageItem<WatchedItem[]>(WATCHED_KEY, []);
    }

    isWatched(imdbId: string): boolean {
        const log = this.getWatchedLog();
        return log.some(item => item.imdbID === imdbId);
    }

    markAsWatched(media: Media): void {
        const log = this.getWatchedLog();
        if (this.isWatched(media.imdbID)) return;

        const newItem: WatchedItem = {
            imdbID: media.imdbID,
            title: media.title,
            watchedAt: new Date().toISOString(),
            type: media.type as 'movie' | 'series' | 'anime',
            poster: media.poster
        };

        const newLog = [newItem, ...log];
        this.setStorageItem(WATCHED_KEY, newLog);
    }

    removeFromWatched(imdbId: string): void {
        const log = this.getWatchedLog();
        const newLog = log.filter(item => item.imdbID !== imdbId);
        this.setStorageItem(WATCHED_KEY, newLog);
    }

    toggleWatched(media: Media): boolean {
        if (this.isWatched(media.imdbID)) {
            this.removeFromWatched(media.imdbID);
            return false;
        } else {
            this.markAsWatched(media);
            return true;
        }
    }

    // Collections
    getCollections(): Collection[] {
        return this.getStorageItem<Collection[]>(COLLECTIONS_KEY, []);
    }

    getCollection(id: string): Collection | undefined {
        return this.getCollections().find(c => c.id === id);
    }

    createCollection(name: string, isPublic: boolean = false): Collection {
        const collections = this.getCollections();
        const newCollection: Collection = {
            id: crypto.randomUUID(),
            name,
            isPublic,
            items: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        collections.push(newCollection);
        this.setStorageItem(COLLECTIONS_KEY, collections);
        return newCollection;
    }

    deleteCollection(id: string): void {
        const collections = this.getCollections().filter(c => c.id !== id);
        this.setStorageItem(COLLECTIONS_KEY, collections);
    }

    addToCollection(collectionId: string, imdbId: string): void {
        const collections = this.getCollections();
        const collection = collections.find(c => c.id === collectionId);

        if (collection && !collection.items.includes(imdbId)) {
            collection.items.push(imdbId);
            collection.updatedAt = new Date().toISOString();
            this.setStorageItem(COLLECTIONS_KEY, collections);
        }
    }

    removeFromCollection(collectionId: string, imdbId: string): void {
        const collections = this.getCollections();
        const collection = collections.find(c => c.id === collectionId);

        if (collection) {
            collection.items = collection.items.filter(id => id !== imdbId);
            collection.updatedAt = new Date().toISOString();
            this.setStorageItem(COLLECTIONS_KEY, collections);
        }
    }
}

export const libraryService = new LibraryService();
