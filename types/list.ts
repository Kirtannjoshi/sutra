import { Media } from './media';

export interface List {
    id: string;
    title: string;
    description: string;
    creator: {
        id: string;
        name: string;
        avatar?: string;
    };
    items: Media[]; // Or just IDs if we want to fetch them, but full objects are easier for mock
    isPublic: boolean;
    likes: number;
    saves: number;
    rating: number; // 0-5
    tags: string[];
    createdAt: string;
    updatedAt: string;
    coverImage?: string; // Optional custom cover, otherwise use first 4 posters
}

export interface CreateListDTO {
    title: string;
    description: string;
    isPublic: boolean;
    tags: string[];
}
