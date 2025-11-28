// Custom rating system for SUTRA

export type RatingLevel = 'absolute_cinema' | 'good' | 'not_good_not_bad' | 'horrible';

export interface Rating {
    level: RatingLevel;
    label: string;
    color: string;
    emoji: string;
    description: string;
}

export const RATINGS: Record<RatingLevel, Rating> = {
    absolute_cinema: {
        level: 'absolute_cinema',
        label: 'Absolute Cinema',
        color: 'text-yellow-400',
        emoji: '🎬',
        description: 'Masterpiece'
    },
    good: {
        level: 'good',
        label: 'Good',
        color: 'text-green-400',
        emoji: '👍',
        description: 'Worth watching'
    },
    not_good_not_bad: {
        level: 'not_good_not_bad',
        label: 'Not Good But Not Bad',
        color: 'text-blue-400',
        emoji: '👌',
        description: 'Decent'
    },
    horrible: {
        level: 'horrible',
        label: 'Horrible',
        color: 'text-red-400',
        emoji: '💀',
        description: 'Skip it'
    }
};

export const RATING_LEVELS: RatingLevel[] = [
    'absolute_cinema',
    'good',
    'not_good_not_bad',
    'horrible'
];

// Convert numeric rating (1-10) to rating level
export function numericToRatingLevel(rating: number): RatingLevel {
    if (rating >= 8) return 'absolute_cinema';
    if (rating >= 6) return 'good';
    if (rating >= 4) return 'not_good_not_bad';
    return 'horrible';
}

// Get rating from IMDb score
export function getIMDbRating(imdbRating: string): Rating {
    const score = parseFloat(imdbRating);
    if (isNaN(score)) return RATINGS.not_good_not_bad;
    return RATINGS[numericToRatingLevel(score)];
}
