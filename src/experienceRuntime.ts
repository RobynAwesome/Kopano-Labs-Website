import { applyKPGSRootAttributes, createKPGSSceneContract } from './kpgsSceneContract';
import { viewForPath, type View } from './routeRegistry';

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };
type NavigatorWithConnection = Navigator & { connection?: Connection; deviceMemory?: number };

export type ExperienceTier = 'lite' | 'balanced' | 'full';

export type ExperienceProfile = {
  tier: ExperienceTier;
  reducedMotion: boolean;
  saveData: boolean;
  effectiveType: string;
  cores: number;
  memory: number;
  narrow: boolean;
};

export const KPGS_PROFILE_CHANGE_EVENT = 'kpgs:profile-change' as const;

export function getExperienceProfile(): ExperienceProfile {
  if (typeof window === 'undefined') {
    return {
      tier: 'balanced',
      reducedMotion: false,
      saveData: false,
      effectiveType: 'unknown',
      cores: 4,
      memory: 4,
      narrow: false,
    };
  }

  const nav = navigator as NavigatorWithConnection;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(nav.connection?.saveData);
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const narrow = window.matchMedia('(max-width: 720px)').matches;
  const effectiveType = nav.connection?.effectiveType ?? 'unknown';

  const tier: ExperienceTier = saveData || cores <= 2 || memory <= 2 || /2g/.test(effectiveType)
    ? 'lite'
    : narrow || cores <= 4 || memory <= 4 || effectiveType === '3g'
      ? 'balanced'
      : 'full';

  return { tier, reducedMotion, saveData, effectiveType, cores, memory, narrow };
}

function profileSignature(profile: ExperienceProfile) {
  return [
    profile.tier,
    profile.reducedMotion,
    profile.saveData,
    profile.effectiveType,
    profile.cores,
    profile.memory,
    profile.narrow,
  ].join('|');
}

function applyExperienceProfile(profile: ExperienceProfile) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.experienceTier = profile.tier;
  root.dataset.motion = profile.reducedMotion ? 'reduced' : 'full';
  root.dataset.saveData = profile.saveData ? 'true' : 'false';
  root.dataset.network = profile.effectiveType;
}

export function syncKPGSRuntime(view: View, profile = getExperienceProfile()) {
  const contract = createKPGSSceneContract(view, profile);
  applyKPGSRootAttributes(contract);
  return contract;
}

export function startExperienceRuntime() {
  if (typeof window === 'undefined') return () => undefined;

  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection;
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrowQuery = window.matchMedia('(max-width: 720px)');

  let profile = getExperienceProfile();
  let active = true;
  let motionGeneration = 0;
  let cleanupMotion = () => undefined;

  const syncRoute = () => {
    syncKPGSRuntime(viewForPath(location.pathname), profile);
  };

  const destroyMotion = () => {
    motionGeneration += 1;
    cleanupMotion();
    cleanupMotion = () => undefined;
  };

  const startMotion = () => {
    destroyMotion();
    if (profile.reducedMotion || profile.saveData) return;

    const generation = motionGeneration;
    void Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (!active || generation !== motionGeneration || profile.reducedMotion || profile.saveData) return;

      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        gsap.fromTo('.manifesto-band span',
          { opacity: .28, y: 18, filter: 'blur(5px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', stagger: .11, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.manifesto-band', start: 'top 86%' } },
        );

        gsap.utils.toArray<HTMLElement>('.directory-rail button').forEach((item, index) => {
          gsap.fromTo(item,
            { x: profile.tier === 'full' ? -28 : -12, opacity: 0 },
            { x: 0, opacity: 1, duration: .55, delay: Math.min(index * .045, .24), ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 94%', once: true } },
          );
        });

        gsap.utils.toArray<HTMLElement>('.evidence-grid article, .ledger article').forEach((item, index) => {
          gsap.fromTo(item,
            { y: 26, opacity: 0 },
            { y: 0, opacity: 1, duration: .6, delay: Math.min(index * .05, .2), ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 94%', once: true } },
          );
        });
      });

      cleanupMotion = () => {
        context.revert();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    });
  };

  const refreshProfile = () => {
    const next = getExperienceProfile();
    if (profileSignature(next) === profileSignature(profile)) return;

    const previous = profile;
    profile = next;
    applyExperienceProfile(profile);
    syncRoute();

    const motionPolicyChanged = previous.reducedMotion !== profile.reducedMotion
      || previous.saveData !== profile.saveData
      || previous.tier !== profile.tier;
    if (motionPolicyChanged) startMotion();

    window.dispatchEvent(new CustomEvent<ExperienceProfile>(KPGS_PROFILE_CHANGE_EVENT, { detail: profile }));
  };

  applyExperienceProfile(profile);
  syncRoute();
  startMotion();

  window.addEventListener('popstate', syncRoute);
  window.addEventListener('online', refreshProfile);
  window.addEventListener('offline', refreshProfile);
  reducedMotionQuery.addEventListener('change', refreshProfile);
  narrowQuery.addEventListener('change', refreshProfile);
  connection?.addEventListener('change', refreshProfile);

  return () => {
    active = false;
    destroyMotion();
    window.removeEventListener('popstate', syncRoute);
    window.removeEventListener('online', refreshProfile);
    window.removeEventListener('offline', refreshProfile);
    reducedMotionQuery.removeEventListener('change', refreshProfile);
    narrowQuery.removeEventListener('change', refreshProfile);
    connection?.removeEventListener('change', refreshProfile);
  };
}
