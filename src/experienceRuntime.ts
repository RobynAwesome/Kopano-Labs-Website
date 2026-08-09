import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Connection = { saveData?: boolean; effectiveType?: string };
type NavigatorWithConnection = Navigator & { connection?: Connection; deviceMemory?: number };

export function startExperienceRuntime() {
  if (typeof window === 'undefined') return () => undefined;

  const nav = navigator as NavigatorWithConnection;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(nav.connection?.saveData);
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const narrow = window.matchMedia('(max-width: 720px)').matches;
  const effectiveType = nav.connection?.effectiveType ?? 'unknown';

  const tier = saveData || cores <= 2 || memory <= 2 || /2g/.test(effectiveType)
    ? 'lite'
    : narrow || cores <= 4 || memory <= 4 || effectiveType === '3g'
      ? 'balanced'
      : 'full';

  const root = document.documentElement;
  root.dataset.experienceTier = tier;
  root.dataset.motion = reducedMotion ? 'reduced' : 'full';
  root.dataset.saveData = saveData ? 'true' : 'false';
  root.dataset.network = effectiveType;

  if (reducedMotion || saveData) return () => undefined;

  gsap.registerPlugin(ScrollTrigger);
  const context = gsap.context(() => {
    gsap.fromTo('.manifesto-band span',
      { opacity: .28, y: 18, filter: 'blur(5px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', stagger: .11, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.manifesto-band', start: 'top 86%' } },
    );

    gsap.utils.toArray<HTMLElement>('.directory-rail button').forEach((item, index) => {
      gsap.fromTo(item,
        { x: tier === 'full' ? -28 : -12, opacity: 0 },
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

  return () => {
    context.revert();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
}
