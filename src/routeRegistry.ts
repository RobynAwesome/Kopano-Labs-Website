import manifest from './route-manifest.json';

export type View =
  | 'home'
  | 'labs'
  | 'systems'
  | 'content'
  | 'foc'
  | 'cars4mars'
  | 'cars4mars-ledger'
  | 'cars4mars-architecture'
  | 'cars4mars-media'
  | 'cars4mars-support'
  | 'proof';

export type RouteRecord = {
  id: View;
  path: string;
  title: string;
  description: string;
  index: boolean;
  crawl: boolean;
  sitemapOrder: number;
  intents: string[];
  humanPrompt: string;
};

export const routeManifest = manifest as {
  site: { origin: string; defaultIntent: string };
  routes: RouteRecord[];
  protectedPaths: string[];
  publicArtifacts: string[];
};

export const publicRoutes = [...routeManifest.routes]
  .filter((route) => route.index && route.crawl)
  .sort((a, b) => a.sitemapOrder - b.sitemapOrder);

export const routeForView = (view: View) =>
  routeManifest.routes.find((route) => route.id === view) ?? routeManifest.routes.find((route) => route.id === 'home')!;

export const pathForView = (view: View) => routeForView(view).path;

export const canonicalForView = (view: View) => `${routeManifest.site.origin}${routeForView(view).path}`;

export const viewForPath = (pathname: string): View => {
  const normalized = pathname.toLowerCase();
  const match = [...routeManifest.routes]
    .sort((a, b) => b.path.length - a.path.length)
    .find((route) => {
      if (route.path === '/') return normalized === '/';
      return normalized.startsWith(route.path.toLowerCase());
    });
  return match?.id ?? 'home';
};

export const routeForIntent = (query: string): RouteRecord => {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const scored = routeManifest.routes.map((route) => ({
    route,
    score: route.intents.reduce((sum, intent) => sum + (terms.some((term) => intent.includes(term) || term.includes(intent)) ? 1 : 0), 0),
  }));
  scored.sort((a, b) => b.score - a.score || a.route.sitemapOrder - b.route.sitemapOrder);
  return scored[0]?.route ?? routeManifest.routes.find((route) => route.id === 'home')!;
};
