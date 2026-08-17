import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const adaptivePlayerPath = location.pathname.toLowerCase().startsWith('/adaptive-player/');

async function boot() {
  if (adaptivePlayerPath) {
    const { AdaptivePlayerApp } = await import('./AdaptivePlayerApp');
    root.render(
      <React.StrictMode>
        <AdaptivePlayerApp />
      </React.StrictMode>,
    );
    return;
  }

  await Promise.all([
    import('./spatial.css'),
    import('./directory.css'),
    import('./mission.css'),
    import('./now.css'),
    import('./foc.css'),
    import('./site-experience.css'),
    import('./system-atlas.css'),
    import('./visual-repair.css'),
    import('./cars4mars-simulation.css'),
  ]);

  const [{ App }, { SiteExperience }, { startExperienceRuntime }] = await Promise.all([
    import('./App'),
    import('./SiteExperience'),
    import('./experienceRuntime'),
  ]);

  root.render(
    <React.StrictMode>
      <App />
      <SiteExperience />
    </React.StrictMode>,
  );

  requestAnimationFrame(() => {
    startExperienceRuntime();
  });
}

void boot();
