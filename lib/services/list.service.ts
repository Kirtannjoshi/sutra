import { List, CreateListDTO } from '@/types/list';
import { mockMovies } from './mock-data.service';
import { Media } from '@/types/media';

class ListService {
    private lists: List[] = [];

    private savedListIds: string[] = [];

    constructor() {
        this.initializeMockLists();
        this.loadDiaryFromStorage();
    }

    private initializeMockLists() {
        // Get some sample media
        const movies = mockMovies.filter(m => m.type === 'movie');
        const series = mockMovies.filter(m => m.type === 'series');
        const allMedia = mockMovies;

        // Create some public lists
        this.lists = [
            {
                id: 'list-1',
                title: 'Mind-Bending Sci-Fi',
                description: 'Movies that will make you question reality.',
                creator: { id: 'sutra-official', name: 'Sutra', avatar: '/sutra-logo.png' },
                items: allMedia.filter(m => m.genre?.includes('Sci-Fi')).slice(0, 4),
                isPublic: true,
                likes: 1240,
                saves: 450,
                rating: 4.8,
                tags: ['Sci-Fi', 'Mind-Bending', 'Classics'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                coverImage: allMedia.find(m => m.title === 'Inception')?.poster
            },
            {
                id: 'list-2',
                title: 'Best of 2024',
                description: 'My top picks for this year so far.',
                creator: { id: 'sutra-official', name: 'Sutra', avatar: '/sutra-logo.png' },
                items: allMedia.slice(0, 5),
                isPublic: true,
                likes: 850,
                saves: 200,
                rating: 4.5,
                tags: ['2024', 'Top Picks'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                // coverImage removed to test grid thumbnail
            },
            {
                id: 'list-3',
                title: 'My Watchlist',
                description: 'Things I need to watch.',
                creator: { id: 'current-user', name: 'You' },
                items: allMedia.slice(5, 8),
                isPublic: false,
                likes: 0,
                saves: 0,
                rating: 0,
                tags: ['Personal'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 'list-sutra-1',
                title: 'Sutra Selects: Hidden Gems',
                description: 'Underrated masterpieces you might have missed.',
                creator: { id: 'sutra-official', name: 'Sutra', avatar: '/sutra-logo.png' },
                items: allMedia.filter(m => m.imdbRating && parseFloat(m.imdbRating) > 8.5).slice(0, 5),
                isPublic: true,
                likes: 5000,
                saves: 1200,
                rating: 5.0,
                tags: ['Sutra Selects', 'Hidden Gems'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                coverImage: allMedia.find(m => m.title === 'The Dark Knight')?.poster
            },
            {
                id: 'list-4',
                title: 'Cyberpunk Vibes',
                description: 'Neon lights, high tech, low life.',
                creator: { id: 'sutra-official', name: 'Sutra', avatar: '/sutra-logo.png' },
                items: allMedia.filter(m => m.genre?.includes('Sci-Fi') || m.genre?.includes('Action')).slice(2, 6),
                isPublic: true,
                likes: 320,
                saves: 89,
                rating: 4.2,
                tags: ['Cyberpunk', 'Sci-Fi'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        ];
    }

    getPublicLists(): List[] {
        return this.lists.filter(l => l.isPublic && l.creator.id !== 'current-user' && l.creator.id !== 'sutra-official');
    }

    getUserLists(userId: string = 'current-user'): List[] {
        return this.lists.filter(l => l.creator.id === userId);
    }

    getSavedLists(): List[] {
        return this.lists.filter(l => this.savedListIds.includes(l.id));
    }

    createList(data: CreateListDTO): List {
        const newList: List = {
            id: `list-${Date.now()}`,
            ...data,
            creator: { id: 'current-user', name: 'You' },
            items: [],
            likes: 0,
            saves: 0,
            rating: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.lists.unshift(newList);
        return newList;
    }

    addMediaToList(listId: string, media: Media) {
        const list = this.lists.find(l => l.id === listId);
        if (list && !list.items.find(i => i.imdbID === media.imdbID)) {
            list.items.push(media);
            list.updatedAt = new Date().toISOString();
        }
    }

    getListById(id: string): List | undefined {
        return this.lists.find(l => l.id === id);
    }

    updateList(id: string, data: Partial<List>) {
        const list = this.lists.find(l => l.id === id);
        if (list) {
            Object.assign(list, data);
            list.updatedAt = new Date().toISOString();
        }
    }

    removeMediaFromList(listId: string, mediaId: string) {
        const list = this.lists.find(l => l.id === listId);
        if (list) {
            list.items = list.items.filter(i => i.imdbID !== mediaId);
            list.updatedAt = new Date().toISOString();
        }
    }

    getSutraExclusiveLists(): List[] {
        return this.lists.filter(l => l.creator.id === 'sutra-official');
    }

    toggleLike(listId: string): boolean {
        const list = this.lists.find(l => l.id === listId);
        if (list) {
            list.likes += 1;
            return true;
        }
        return false;
    }

    toggleSaveList(listId: string): boolean {
        const index = this.savedListIds.indexOf(listId);
        if (index > -1) {
            this.savedListIds.splice(index, 1);
            const list = this.lists.find(l => l.id === listId);
            if (list) list.saves = Math.max(0, list.saves - 1);
            return false; // Unsaved
        } else {
            this.savedListIds.push(listId);
            const list = this.lists.find(l => l.id === listId);
            if (list) list.saves += 1;
            return true; // Saved
        }
    }

    deleteList(id: string) {
        this.lists = this.lists.filter(l => l.id !== id);
        this.savedListIds = this.savedListIds.filter(lid => lid !== id);
    }

    toggleListPrivacy(id: string) {
        const list = this.lists.find(l => l.id === id);
        if (list) {
            list.isPublic = !list.isPublic;
            list.updatedAt = new Date().toISOString();
        }
    }

    // Watch History & Diary
    private watchHistory: Media[] = [];
    private diaryEntries: any[] = [];

    private loadDiaryFromStorage() {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('sutra_diary_entries');
            if (stored) {
                try {
                    this.diaryEntries = JSON.parse(stored);
                } catch (e) {
                    this.diaryEntries = [];
                }
            }
        }
    }

    private saveDiaryToStorage() {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sutra_diary_entries', JSON.stringify(this.diaryEntries));
        }
    }

    addToWatchHistory(media: Media) {
        if (!this.watchHistory.find(m => m.imdbID === media.imdbID)) {
            this.watchHistory.unshift(media);
        }
    }

    getWatchHistory(): Media[] {
        return this.watchHistory;
    }

    addToDiary(entry: { media: Media; rating: string; review?: string; date: string }) {
        // Check if already exists
        const existingIndex = this.diaryEntries.findIndex(e => e.media.imdbID === entry.media.imdbID);

        if (existingIndex !== -1) {
            // Update existing entry
            this.diaryEntries[existingIndex] = { ...entry, id: this.diaryEntries[existingIndex].id };
        } else {
            // Add new entry
            this.diaryEntries.unshift({ ...entry, id: Date.now().toString() });
        }

        this.addToWatchHistory(entry.media);
        this.saveDiaryToStorage();
    }

    removeFromDiary(mediaId: string) {
        this.diaryEntries = this.diaryEntries.filter(e => e.media.imdbID !== mediaId);
        this.saveDiaryToStorage();
    }

    isInDiary(mediaId: string): boolean {
        return this.diaryEntries.some(e => e.media.imdbID === mediaId);
    }

    getDiaryEntries(): any[] {
        return this.diaryEntries;
    }

    isListSaved(listId: string): boolean {
        return this.savedListIds.includes(listId);
    }
}

export const listService = new ListService();
