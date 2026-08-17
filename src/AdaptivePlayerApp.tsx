import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getExperienceProfile, type ExperienceProfile } from './experienceRuntime';
import './adaptive-player.css';

const AdaptivePlayerScene = lazy(() => import('./components/AdaptivePlayerScene').then((module) => ({ default: module.AdaptivePlayerScene })));

export type PlayerProfile = 'lite' | 'mobile' | 'enhanced' | 'immersive';

type InstallChoice = { outcome: 'accepted' | 'dismissed'; platform: string };
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallChoice>;
};

const profileOrder: PlayerProfile[] = ['lite', 'mobile', 'enhanced', 'immersive'];

const profileCopy: Record<PlayerProfile, { label: string; fps: string; description: string }> = {
  lite: {
    label: 'LITE',
    fps: 'DOM / zero WebGL requirement',
    description: 'Save-Data, weak hardware and reduced-motion lane. The content survives without a 3D dependency.',
  },
  mobile: {
    label: 'MOBILE',
    fps: '30 FPS budget',
    description: 'Touch-first Three.js with capped DPR, lower geometry pressure and bounded orbit controls.',
  },
  enhanced: {
    label: 'ENHANCED',
    fps: '40–60 FPS target',
    description: 'Richer scene density for capable phones, tablets and mainstream laptops.',
  },
  immersive: {
    label: 'IMMERSIVE',
    fps: '60 FPS target',
    description: 'Desktop/high-capability lane with the richest governed scene budget.',
  },
};

function deriveMaximumProfile(profile: ExperienceProfile): PlayerProfile {
  if (profile.reducedMotion || profile.saveData || profile.tier === 'lite') return 'lite';
  if (profile.narrow) return profile.tier === 'full' ? 'enhanced' : 'mobile';
  if (profile.tier === 'full' && profile.cores >= 8 && profile.memory >= 8) return 'immersive';
  return 'enhanced';
}

function receipt(event: string, details: Record<string, string | number | boolean>) {
  const payload = {
    schema: 'kpgs.adaptive_player_receipt.v0.1',
    event,
    ts: new Date().toISOString(),
    route: '/adaptive-player/',
    ...details,
  };
  performance.mark(`kpgs:adaptive-player:${event}`);
  window.dispatchEvent(new CustomEvent('kpgs:adaptive-player-receipt', { detail: payload }));
  return payload;
}

function LiteScene() {
  return (
    <div className="player-lite-scene" role="img" aria-label="Low-power Kopano adaptive player topology">
      <span className="lite-orbit lite-orbit-a" />
      <span className="lite-orbit lite-orbit-b" />
      <span className="lite-node lite-node-a" />
      <span className="lite-node lite-node-b" />
      <span className="lite-node lite-node-c" />
      <div className="lite-core">
        <img src="/assets/brand/kopano-mark.svg" alt="" />
        <strong>KPGS</strong>
        <small>NO WEBGL REQUIRED</small>
      </div>
    </div>
  );
}

export function AdaptivePlayerApp() {
  const capability = useMemo(() => getExperienceProfile(), []);
  const maximumProfile = useMemo(() => deriveMaximumProfile(capability), [capability]);
  const [selectedProfile, setSelectedProfile] = useState<PlayerProfile>(maximumProfile);
  const [online, setOnline] = useState(() => navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [pwaState, setPwaState] = useState<'registering' | 'ready' | 'unsupported' | 'error'>('registering');
  const [gateMessage, setGateMessage] = useState('AUTO capability profile active.');

  const maxRank = profileOrder.indexOf(maximumProfile);
  const allowAnimation = !capability.reducedMotion && !capability.saveData;

  useEffect(() => {
    const manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = '/adaptive-player.webmanifest';
    manifest.dataset.kpgsPlayerManifest = 'true';
    document.head.appendChild(manifest);
    document.documentElement.dataset.playerProfile = selectedProfile;

    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    const onInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener('beforeinstallprompt', onInstallPrompt);

    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/adaptive-player-sw.js', { scope: '/adaptive-player/' })
        .then(() => {
          setPwaState('ready');
          receipt('pwa_registered', { profile: selectedProfile });
        })
        .catch(() => setPwaState('error'));
    } else {
      setPwaState('unsupported');
    }

    receipt('player_booted', {
      auto_profile: maximumProfile,
      tier: capability.tier,
      narrow: capability.narrow,
      save_data: capability.saveData,
      reduced_motion: capability.reducedMotion,
    });

    return () => {
      manifest.remove();
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('beforeinstallprompt', onInstallPrompt);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.playerProfile = selectedProfile;
    receipt('profile_selected', {
      profile: selectedProfile,
      max_profile: maximumProfile,
      online,
      animate: allowAnimation,
    });
  }, [selectedProfile, maximumProfile, online, allowAnimation]);

  const chooseProfile = (profile: PlayerProfile) => {
    const rank = profileOrder.indexOf(profile);
    if (rank > maxRank) {
      setGateMessage(`${profileCopy[profile].label} blocked by the current capability budget. Lower modes stay fully usable.`);
      receipt('profile_blocked', { requested: profile, max_profile: maximumProfile });
      return;
    }
    setSelectedProfile(profile);
    setGateMessage(`${profileCopy[profile].label} selected inside the current capability budget.`);
  };

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    receipt('install_prompt_result', { outcome: choice.outcome });
    setInstallPrompt(null);
  };

  return (
    <div className="adaptive-player-shell" data-player-profile={selectedProfile}>
      <a className="player-skip" href="#player-controls">Skip scene</a>
      <header className="player-topbar">
        <a className="player-brand" href="/" aria-label="Back to Kopano Labs">
          <img src="/assets/brand/kopano-mark.svg" alt="" />
          <span><strong>Kopano Adaptive Player</strong><small>APWA · POC-01</small></span>
        </a>
        <div className="player-statuses" aria-label="Player status">
          <span className={online ? 'status-good' : 'status-warn'}>{online ? 'ONLINE' : 'OFFLINE'}</span>
          <span>{pwaState === 'ready' ? 'PWA READY' : pwaState.toUpperCase()}</span>
        </div>
      </header>

      <main>
        <section className="player-hero">
          <motion.div className="player-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <span className="player-eyebrow">KPGS · MOBILE FIRST · ONE SCENE / FOUR GOVERNED PROFILES</span>
            <h1>The experience changes.<br /><em>The meaning does not.</em></h1>
            <p>This POC proves one player can graduate from a zero-WebGL low-data surface to a richer Three.js world without changing the user task or hiding governance.</p>
            <div className="player-actions">
              <a className="player-primary" href="#player-controls">Inspect adaptation</a>
              {installPrompt && <button className="player-secondary" type="button" onClick={install}>Install player</button>}
            </div>
          </motion.div>

          <motion.div className="player-stage" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }}>
            {selectedProfile === 'lite'
              ? <LiteScene />
              : <Suspense fallback={<div className="player-scene-fallback" role="status">Loading governed Three.js lane…</div>}>
                  <AdaptivePlayerScene profile={selectedProfile} animate={allowAnimation} />
                </Suspense>}
            <div className="player-stage-readout">
              <span>{profileCopy[selectedProfile].label}</span>
              <strong>{profileCopy[selectedProfile].fps}</strong>
            </div>
          </motion.div>
        </section>

        <section className="player-control-grid" id="player-controls" aria-label="Adaptive player controls">
          <div className="player-panel profile-panel">
            <div className="panel-heading">
              <div><span className="player-eyebrow">CAPABILITY GOVERNOR</span><h2>Profile ladder</h2></div>
              <span className="auto-chip">MAX · {profileCopy[maximumProfile].label}</span>
            </div>
            <div className="profile-buttons">
              {profileOrder.map((profile, index) => {
                const blocked = index > maxRank;
                const active = selectedProfile === profile;
                return (
                  <button
                    type="button"
                    key={profile}
                    className={active ? 'profile-button active' : 'profile-button'}
                    aria-pressed={active}
                    aria-disabled={blocked}
                    onClick={() => chooseProfile(profile)}
                  >
                    <span>{profileCopy[profile].label}</span>
                    <small>{blocked ? 'GATED' : profileCopy[profile].fps}</small>
                  </button>
                );
              })}
            </div>
            <p className="gate-message" aria-live="polite">{gateMessage}</p>
          </div>

          <div className="player-panel telemetry-panel">
            <span className="player-eyebrow">DEVICE RECEIPT</span>
            <h2>Why this mode?</h2>
            <dl>
              <div><dt>Base tier</dt><dd>{capability.tier}</dd></div>
              <div><dt>CPU</dt><dd>{capability.cores} logical cores</dd></div>
              <div><dt>Memory hint</dt><dd>{capability.memory} GB</dd></div>
              <div><dt>Network</dt><dd>{capability.effectiveType}</dd></div>
              <div><dt>Viewport</dt><dd>{capability.narrow ? 'narrow / touch-priority' : 'wide'}</dd></div>
              <div><dt>Save-Data</dt><dd>{capability.saveData ? 'on' : 'off'}</dd></div>
              <div><dt>Motion</dt><dd>{capability.reducedMotion ? 'reduced' : 'full'}</dd></div>
            </dl>
          </div>
        </section>

        <section className="player-profile-explain" aria-label="Profile behavior">
          {profileOrder.map((profile) => (
            <article key={profile} className={selectedProfile === profile ? 'selected' : ''}>
              <span>{profileCopy[profile].label}</span>
              <h3>{profileCopy[profile].fps}</h3>
              <p>{profileCopy[profile].description}</p>
            </article>
          ))}
        </section>

        <section className="player-boundary">
          <div><span className="player-eyebrow">BLACKMASK BOUNDARY</span><h2>Adaptive rendering ≠ weaker governance.</h2></div>
          <p>Profile changes may alter geometry, DPR, animation and input affordances. They may not alter canonical business truth, permissions, evidence meaning or the user’s ability to complete the core task.</p>
        </section>
      </main>

      <footer className="player-footer">
        <span>TypeScript 7 · React 19 · Vite 8 · Three.js</span>
        <span>POC-01 · PREVIEW BEFORE PROMOTION</span>
      </footer>
    </div>
  );
}
