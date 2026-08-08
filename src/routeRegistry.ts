import manifest from './route-manifest.json';

export type View = 'home' | 'labs' | 'systems' | 'cars4mars' | 'proof';

type RouteRecord = {
  id: View;
  path: string;
  title: string;
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

export const pathForView = (view: View) =>
  routeManifest.routes.find((route) => route.id === view)?.path ?? '/';

export const viewForPath = (pathname: string): View => {
  const normalized = pathname.toLowerCase();
  const match = routeManifest.routes.find((route) => {
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
