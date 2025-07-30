import type { Artwork, ArtworksResponse } from './types';

export async function fetchArtworks(pageNumber: number): Promise<ArtworksResponse> {
        const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNumber + 1}`);
            if (!res.ok) throw new Error('Failed to fetch artworks');
        return res.json();
}