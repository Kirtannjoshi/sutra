import { Media, SearchResult } from '@/types/media';

// Mock data for demonstration when API is unavailable
export const mockMovies: Media[] = [
    {
        imdbID: 'tt0468569',
        title: 'The Dark Knight',
        year: '2008',
        type: 'movie',
        poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
        plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        rated: 'PG-13',
        released: '18 Jul 2008',
        runtime: '152 min',
        genre: 'Action, Crime, Drama',
        director: 'Christopher Nolan',
        writer: 'Jonathan Nolan, Christopher Nolan, David S. Goyer',
        actors: 'Christian Bale, Heath Ledger, Aaron Eckhart',
        language: 'English, Mandarin',
        country: 'United States, United Kingdom',
        awards: 'Won 2 Oscars. 159 wins & 163 nominations total',
        imdbRating: '9.0',
        imdbVotes: '2,800,000',
        metascore: '84',
        boxOffice: '$534,858,444',
        production: 'Warner Bros.',
        trailers: [
            { language: 'English', url: 'https://www.youtube.com/watch?v=EXeTwQWrcwY', title: 'Official Trailer' },
            { language: 'Spanish', url: 'https://www.youtube.com/watch?v=vpzV752LurA', title: 'Tráiler Oficial' },
            { language: 'French', url: 'https://www.youtube.com/watch?v=9j9s2s2s2s2', title: 'Bande Annonce' },
        ]
    },
    // ... existing items ...
    {
        imdbID: 'tt4574334',
        title: 'Stranger Things',
        year: '2016–',
        type: 'series',
        poster: 'https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg',
        plot: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.',
        rated: 'TV-14',
        released: '15 Jul 2016',
        runtime: '51 min',
        genre: 'Drama, Fantasy, Horror',
        director: 'N/A',
        writer: 'Matt Duffer, Ross Duffer',
        actors: 'Millie Bobby Brown, Finn Wolfhard, Winona Ryder',
        language: 'English',
        country: 'United States',
        awards: 'Won 12 Primetime Emmys. 106 wins & 373 nominations total',
        imdbRating: '8.7',
        imdbVotes: '1,300,000',
        metascore: 'N/A',
        totalSeasons: '4',
        volumes: [
            { name: 'Season 5 Vol 1', episodes: '1-4', releaseDate: 'Coming 2025' },
            { name: 'Season 5 Vol 2', episodes: '5-8', releaseDate: 'Coming 2025' },
        ],
        trailers: [
            { language: 'English', url: 'https://www.youtube.com/watch?v=yQEondeGvKo', title: 'Season 4 Trailer' },
        ]
    },
    {
        imdbID: 'tt0816692',
        title: 'Interstellar',
        year: '2014',
        type: 'movie',
        poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
        plot: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        rated: 'PG-13',
        released: '07 Nov 2014',
        runtime: '169 min',
        genre: 'Adventure, Drama, Sci-Fi',
        director: 'Christopher Nolan',
        writer: 'Jonathan Nolan, Christopher Nolan',
        actors: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
        language: 'English',
        country: 'United States, United Kingdom, Canada',
        awards: 'Won 1 Oscar. 44 wins & 148 nominations total',
        imdbRating: '8.7',
        imdbVotes: '2,000,000',
        metascore: '74',
        boxOffice: '$188,020,017',
        production: 'Paramount Pictures',
    },
    {
        imdbID: 'tt1375666',
        title: 'Inception',
        year: '2010',
        type: 'movie',
        poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
        plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        rated: 'PG-13',
        released: '16 Jul 2010',
        runtime: '148 min',
        genre: 'Action, Adventure, Sci-Fi',
        director: 'Christopher Nolan',
        writer: 'Christopher Nolan',
        actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
        language: 'English, Japanese, French',
        country: 'United States, United Kingdom',
        awards: 'Won 4 Oscars. 157 wins & 220 nominations total',
        imdbRating: '8.8',
        imdbVotes: '2,500,000',
        metascore: '74',
        boxOffice: '$292,576,195',
        production: 'Warner Bros.',
    },
    {
        imdbID: 'tt0109830',
        title: 'Forrest Gump',
        year: '1994',
        type: 'movie',
        poster: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
        plot: 'The history of the United States from the 1950s to the \'70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.',
        rated: 'PG-13',
        released: '06 Jul 1994',
        runtime: '142 min',
        genre: 'Drama, Romance',
        director: 'Robert Zemeckis',
        writer: 'Winston Groom, Eric Roth',
        actors: 'Tom Hanks, Robin Wright, Gary Sinise',
        language: 'English',
        country: 'United States',
        awards: 'Won 6 Oscars. 50 wins & 75 nominations total',
        imdbRating: '8.8',
        imdbVotes: '2,200,000',
        metascore: '82',
        boxOffice: '$330,455,270',
        production: 'Paramount Pictures',
    },
    {
        imdbID: 'tt0137523',
        title: 'Fight Club',
        year: '1999',
        type: 'movie',
        poster: 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg',
        plot: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
        rated: 'R',
        released: '15 Oct 1999',
        runtime: '139 min',
        genre: 'Drama',
        director: 'David Fincher',
        writer: 'Chuck Palahniuk, Jim Uhls',
        actors: 'Brad Pitt, Edward Norton, Meat Loaf',
        language: 'English',
        country: 'Germany, United States',
        awards: 'Nominated for 1 Oscar. 11 wins & 38 nominations total',
        imdbRating: '8.8',
        imdbVotes: '2,300,000',
        metascore: '66',
        boxOffice: '$37,030,102',
        production: '20th Century Fox',
    },
    {
        imdbID: 'tt0944947',
        title: 'Game of Thrones',
        year: '2011–2019',
        type: 'series',
        poster: 'https://m.media-amazon.com/images/M/MV5BN2IzYzBiOTQtNGZmMi00NDI5LTgxMzMtN2EzZjA1NjhlOGMxXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
        plot: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
        rated: 'TV-MA',
        released: '17 Apr 2011',
        runtime: '57 min',
        genre: 'Action, Adventure, Drama',
        director: 'N/A',
        writer: 'David Benioff, D.B. Weiss',
        actors: 'Emilia Clarke, Peter Dinklage, Kit Harington',
        language: 'English',
        country: 'United States, United Kingdom',
        awards: 'Won 59 Primetime Emmys. 389 wins & 634 nominations total',
        imdbRating: '9.2',
        imdbVotes: '2,200,000',
        metascore: 'N/A',
        totalSeasons: '8',
    },
    {
        imdbID: 'tt0903747',
        title: 'Breaking Bad',
        year: '2008–2013',
        type: 'series',
        poster: 'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_SX300.jpg',
        plot: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family\'s future.',
        rated: 'TV-MA',
        released: '20 Jan 2008',
        runtime: '49 min',
        genre: 'Crime, Drama, Thriller',
        director: 'N/A',
        writer: 'Vince Gilligan',
        actors: 'Bryan Cranston, Aaron Paul, Anna Gunn',
        language: 'English, Spanish',
        country: 'United States',
        awards: 'Won 16 Primetime Emmys. 240 wins & 319 nominations total',
        imdbRating: '9.5',
        imdbVotes: '2,100,000',
        metascore: 'N/A',
        totalSeasons: '5',
    },
    {
        imdbID: 'tt0133093',
        title: 'The Matrix',
        year: '1999',
        type: 'movie',
        poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
        plot: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
        rated: 'R',
        released: '31 Mar 1999',
        runtime: '136 min',
        genre: 'Action, Sci-Fi',
        director: 'Lana Wachowski, Lilly Wachowski',
        writer: 'Lilly Wachowski, Lana Wachowski',
        actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
        language: 'English',
        country: 'United States',
        awards: 'Won 4 Oscars. 42 wins & 51 nominations total',
        imdbRating: '8.7',
        imdbVotes: '2,000,000',
        metascore: '73',
        boxOffice: '$172,076,928',
        production: 'Warner Bros.',
    },
];

class MockDataService {
    async searchMedia(query: string, type?: 'movie' | 'series'): Promise<SearchResult> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const filtered = mockMovies.filter(movie => {
            const matchesQuery = movie.title.toLowerCase().includes(query.toLowerCase());
            const matchesType = !type || movie.type === type;
            return matchesQuery && matchesType;
        });

        return {
            search: filtered,
            totalResults: filtered.length.toString(),
            response: 'True',
        };
    }

    async getMediaDetails(imdbId: string): Promise<Media | null> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return mockMovies.find(m => m.imdbID === imdbId) || null;
    }

    getFeatured(): Media[] {
        return mockMovies.slice(0, 3);
    }

    getTrending(): Media[] {
        return mockMovies.slice(0, 6);
    }

    getRecommended(): Media[] {
        return mockMovies;
    }

    async getSeasonEpisodes(imdbId: string, season: number): Promise<any> {
        await new Promise(resolve => setTimeout(resolve, 200));

        // Generate 8-10 mock episodes
        const episodeCount = Math.floor(Math.random() * 3) + 8;
        const episodes = Array.from({ length: episodeCount }, (_, i) => ({
            title: `Chapter ${i + 1}: The Unfolding`,
            released: `202${Math.floor(Math.random() * 4)}-0${Math.floor(Math.random() * 9) + 1}-15`,
            episode: (i + 1).toString(),
            imdbRating: (7 + Math.random() * 2).toFixed(1),
            imdbID: `mock-ep-${imdbId}-${season}-${i + 1}`
        }));

        return {
            season: season.toString(),
            totalSeasons: '5',
            episodes
        };
    }
}

export const mockDataService = new MockDataService();
