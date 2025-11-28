'use server';

import { scraperService } from '@/lib/services/scraper.service';

export async function getStreamingAvailability(imdbId: string, title: string, year: string) {
    return await scraperService.getAvailability(imdbId, title, year);
}

export async function getTrailerId(title: string, year: string) {
    return await scraperService.getTrailerId(title, year);
}

export async function getFanArtImages(query: string) {
    return await scraperService.getFanArt(query);
}
