import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const STATIC_PATHS = [
  '/',
  '/prompts',
  '/purchase-history',
  '/profile',
  '/admin/prompts',
  '/seller/waitlist',
  '/terms',
  '/privacy',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://prompt.market.example';

  // Static localized routes
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((path) => {
    const alternates = routing.locales.map((loc) => `${baseUrl}/${loc}${path}`);
    return routing.locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: path === '/' ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((loc) => [loc, `${baseUrl}/${loc}${path}`]),
        ),
      },
    }));
  });

  // Dynamic prompts (best-effort; public, latest)
  // If Supabase is not available at build time, skip gracefully.
  let promptEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${baseUrl}/api/prompts`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      const prompts: Array<{ id: string; updated_at?: string }> = Array.isArray(
        json.prompts,
      )
        ? json.prompts
        : [];
      promptEntries = prompts.flatMap((p) =>
        routing.locales.map((locale) => ({
          url: `${baseUrl}/${locale}/prompt/${p.id}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: Object.fromEntries(
              routing.locales.map((loc) => [
                loc,
                `${baseUrl}/${loc}/prompt/${p.id}`,
              ]),
            ),
          },
        })),
      );
    }
  } catch {
    // ignore failures in non-network environments
  }

  return [...staticEntries, ...promptEntries];
}
