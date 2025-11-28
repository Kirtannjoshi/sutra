'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Media } from '@/types/media';
import HeroSection from '@/components/media/HeroSection';
import MediaGrid from '@/components/media/MediaGrid';
import { TrendingUp, Sparkles, Folder, Heart, Bookmark, Zap, Film, Star } from 'lucide-react';
import { listService } from '@/lib/services/list.service';
import { List } from '@/types/list';
import { omdbService } from '@/lib/services/omdb.service';
import { mockDataService } from '@/lib/services/mock-data.service';

// Expanded Data Sets for a Populated Homepage
const FEATURED_IDS = ['tt15398776', 'tt1160419', 'tt0816692']; // Oppenheimer, Dune, Interstellar
const TRENDING_IDS = ['tt4154796', 'tt10872600', 'tt9362722', 'tt6710474', 'tt1877830', 'tt0468569']; // Avengers, Spiderman, etc.
const RECOMMENDED_IDS = ['tt0468569', 'tt1375666', 'tt0109830', 'tt0137523', 'tt0110912', 'tt0120737']; // Dark Knight, Inception, etc.
const CLASSIC_IDS = ['tt0068646', 'tt0050083', 'tt0034583', 'tt0054215', 'tt0080684']; // Godfather, 12 Angry Men, Casablanca, Psycho, Empire Strikes Back
const ANIME_IDS = ['tt0409591', 'tt5311514', 'tt0988824', 'tt2560140', 'tt0877057']; // Naruto, Your Name, etc.

export default function HomePage() {
  const router = useRouter();
  const [featuredMedia, setFeaturedMedia] = useState<Media[]>([]);
  const [trendingMedia, setTrendingMedia] = useState<Media[]>([]);
  const [recommendedMedia, setRecommendedMedia] = useState<Media[]>([]);
  const [classicMedia, setClassicMedia] = useState<Media[]>([]);
  const [animeMedia, setAnimeMedia] = useState<Media[]>([]);
  const [publicLists, setPublicLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedListIds, setSavedListIds] = useState<string[]>([]);

  useEffect(() => {
    loadHomeData();
    setSavedListIds(listService.getSavedLists().map(l => l.id));
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [featured, trending, recommended, classics, anime] = await Promise.all([
        fetchMediaList(FEATURED_IDS),
        fetchMediaList(TRENDING_IDS),
        fetchMediaList(RECOMMENDED_IDS),
        fetchMediaList(CLASSIC_IDS),
        fetchMediaList(ANIME_IDS)
      ]);

      setFeaturedMedia(featured.length ? featured : mockDataService.getFeatured());
      setTrendingMedia(trending.length ? trending : mockDataService.getTrending());
      setRecommendedMedia(recommended.length ? recommended : mockDataService.getRecommended());
      setClassicMedia(classics);
      setAnimeMedia(anime);

      // Fetch public lists
      setPublicLists(listService.getPublicLists());
    } catch (error) {
      console.error('Error loading home data:', error);
      // Fallback
      setFeaturedMedia(mockDataService.getFeatured());
      setTrendingMedia(mockDataService.getTrending());
      setRecommendedMedia(mockDataService.getRecommended());
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaList = async (ids: string[]) => {
    const results = await Promise.allSettled(ids.map(id => omdbService.getMediaDetails(id)));
    return results
      .filter((r): r is PromiseFulfilledResult<Media> => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value);
  };

  const handleToggleSave = (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    const isSaved = listService.toggleSaveList(listId);
    if (isSaved) {
      setSavedListIds([...savedListIds, listId]);
    } else {
      setSavedListIds(savedListIds.filter(id => id !== listId));
    }
  };

  if (loading) {
    return (
      <div className="pt-24 px-8 pb-8 space-y-8">
        <div className="h-[70vh] skeleton rounded-2xl" />
        <div className="space-y-4">
          <div className="h-8 w-48 skeleton rounded" />
          <div className="media-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] skeleton rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-16">
      {/* Hero Section - Full Width & Immersive */}
      {featuredMedia.length > 0 && (
        <div className="relative z-10">
          <HeroSection featuredMedia={featuredMedia} />
        </div>
      )}

      <div className="px-6 md:px-12 space-y-16 relative z-20 -mt-10">

        {/* Trending Now */}
        {trendingMedia.length > 0 && (
          <section className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Trending Now</h2>
            </div>
            <MediaGrid items={trendingMedia} />
          </section>
        )}

        {/* Community Collections */}
        {publicLists.length > 0 && (
          <section className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Folder className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Community Collections</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {publicLists.map((list) => (
                <div
                  key={list.id}
                  onClick={() => router.push(`/lists/${list.id}`)}
                  className="group relative cursor-pointer"
                >
                  <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/5 relative shadow-lg group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-500">
                    {list.coverImage ? (
                      <img src={list.coverImage} alt={list.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <div className="w-full h-full bg-[#1a1a1a]">
                        {list.items.length > 0 ? (
                          <div className="grid grid-cols-2 h-full">
                            {list.items.slice(0, 4).map((item, i) => (
                              <div key={item.imdbID} className="relative w-full h-full border-[0.5px] border-white/5">
                                <img src={item.poster} alt={item.title} className="w-full h-full object-cover opacity-60" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/10">
                            <Folder className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
                    <div className="absolute bottom-0 left-0 w-full p-5">
                      <h3 className="text-lg font-bold text-white line-clamp-2 mb-2 leading-tight group-hover:text-[var(--color-primary)] transition-colors">{list.title}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                        <span>{list.items.length} items</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              listService.toggleLike(list.id);
                            }}
                            className="flex items-center gap-1 hover:text-red-500 transition-colors group/like"
                          >
                            <Heart className="w-3 h-3 group-hover/like:fill-current" /> {list.likes}
                          </button>
                          <button
                            onClick={(e) => handleToggleSave(e, list.id)}
                            className={`flex items-center gap-1 transition-colors ${savedListIds.includes(list.id) ? 'text-[var(--color-accent-gold)]' : 'hover:text-white'}`}
                          >
                            <Bookmark className={`w-3 h-3 ${savedListIds.includes(list.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended */}
        {recommendedMedia.length > 0 && (
          <section className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Recommended for You</h2>
            </div>
            <MediaGrid items={recommendedMedia} />
          </section>
        )}

        {/* Classics */}
        {classicMedia.length > 0 && (
          <section className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Film className="w-6 h-6 text-yellow-500" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Timeless Classics</h2>
            </div>
            <MediaGrid items={classicMedia} />
          </section>
        )}

        {/* Anime */}
        {animeMedia.length > 0 && (
          <section className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <Zap className="w-6 h-6 text-pink-500" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Anime Hits</h2>
            </div>
            <MediaGrid items={animeMedia} />
          </section>
        )}
      </div>
    </div>
  );
}
