import { MonitorPlay, Search, Globe, ChevronDown } from 'lucide-react';
import { AvailabilityData } from '@/types/media';
import { useState, useEffect } from 'react';

export default function WhereToWatch({ title, year, imdbId }: { title: string, year: string, imdbId: string }) {
    const [country, setCountry] = useState('US');
    const [platforms, setPlatforms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'stream' | 'rent' | 'buy'>('stream');

    const justWatchUrl = `https://www.justwatch.com/${country.toLowerCase()}/search?q=${encodeURIComponent(title)}`;

    // Platform Logo Map (Brandfetch)
    const getPlatformIcon = (name: string) => {
        const n = name.toLowerCase();
        let domain = '';

        // Global
        if (n.includes('netflix')) domain = 'netflix.com';
        else if (n.includes('prime') || n.includes('amazon')) domain = 'primevideo.com';
        else if (n.includes('disney')) domain = 'disneyplus.com';
        else if (n.includes('hulu')) domain = 'hulu.com';
        else if (n.includes('max') || n.includes('hbo')) domain = 'max.com';
        else if (n.includes('apple')) domain = 'tv.apple.com';
        else if (n.includes('peacock')) domain = 'peacocktv.com';
        else if (n.includes('paramount')) domain = 'paramountplus.com';

        // Indian / Regional
        else if (n.includes('hotstar')) domain = 'hotstar.com';
        else if (n.includes('jio')) domain = 'jiocinema.com';
        else if (n.includes('zee5')) domain = 'zee5.com';
        else if (n.includes('sony')) domain = 'sonyliv.com';

        // Transactional
        else if (n.includes('google')) domain = 'play.google.com';
        else if (n.includes('youtube')) domain = 'youtube.com';
        else if (n.includes('itunes')) domain = 'apple.com';

        if (domain) {
            return <img
                src={`https://cdn.brandfetch.io/${domain}/w/400/h/400?c=1icon`}
                alt={name}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
            />;
        }

        return <span className="text-xs font-bold">{name[0]}</span>;
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                // 1. Detect Country
                let userCountry = 'US';
                try {
                    const geoRes = await fetch('https://ipapi.co/json/');
                    const geoData = await geoRes.json();
                    if (geoData.country_code) {
                        userCountry = geoData.country_code;
                        setCountry(userCountry);
                    }
                } catch (e) {
                    console.warn('Geolocation failed, defaulting to US');
                }

                // 2. Fetch Availability
                const { scraperService } = await import('@/lib/services/scraper.service');
                const data = await scraperService.getAvailability(imdbId, title, year, userCountry);
                setPlatforms(data.platforms);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [title, year, imdbId]);

    const filteredPlatforms = platforms.filter(p => {
        if (activeTab === 'stream') return p.type === 'stream' || !p.type; // Default to stream
        return p.type === activeTab;
    });

    return (
        <div className="bg-[#0f0f0f] rounded-2xl p-6 border border-white/5 space-y-6 shadow-xl relative overflow-hidden group">


            <div className="flex items-center justify-between relative z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MonitorPlay className="w-5 h-5 text-[var(--color-accent-gold)]" />
                    Where to Watch
                </h3>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs font-medium text-gray-300 cursor-pointer hover:bg-white/10 transition-colors">
                        <Globe className="w-3 h-3" />
                        <span>{country}</span>
                        <ChevronDown className="w-3 h-3" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-white/5 rounded-xl relative z-10">
                {(['stream', 'rent', 'buy'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === tab
                            ? 'bg-white text-black shadow-lg'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-3 relative z-10 min-h-[100px]">
                {loading ? (
                    // Skeleton Loading
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                    ))
                ) : filteredPlatforms.length > 0 ? (
                    filteredPlatforms.map((p) => (
                        <a
                            key={p.name}
                            href={p.url || justWatchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/item flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all gap-2"
                        >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform group-hover/item:scale-110 transition-transform overflow-hidden bg-black/20 relative">
                                {p.icon && p.icon.startsWith('http') ? (
                                    <>
                                        <img
                                            src={p.icon}
                                            alt={p.name}
                                            className="w-full h-full object-contain rounded-lg relative z-10"
                                            onError={(e) => {
                                                // Hide this image and show the fallback below
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                        {/* Fallback Brandfetch Icon (Hidden by default, shown on error) */}
                                        <div className="absolute inset-0 hidden bg-black/20">
                                            {getPlatformIcon(p.name)}
                                        </div>
                                    </>
                                ) : (
                                    getPlatformIcon(p.name)
                                )}
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 group-hover/item:text-white transition-colors text-center line-clamp-1">{p.name}</span>
                        </a>
                    ))
                ) : (
                    <div className="col-span-3 flex flex-col items-center justify-center text-gray-500 text-xs py-4">
                        <p>No {activeTab} options found.</p>
                        <a href={justWatchUrl} target="_blank" className="text-blue-400 hover:underline mt-1">Check JustWatch</a>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-gray-500 relative z-10 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live Data
                </span>
                <a href="https://www.justwatch.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                    <span className="uppercase tracking-wider text-[10px]">Powered by</span>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/JustWatch.png" alt="JustWatch" className="h-3 object-contain" />
                </a>
            </div>

            <a
                href={justWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full bg-[#fbc500] text-black hover:bg-[#eebb00] border-none font-bold flex items-center justify-center gap-2 rounded-xl py-3 transition-transform hover:scale-[1.02] relative z-10"
            >
                <Search className="w-4 h-4" />
                Check Availability
            </a>
        </div>
    );
}
