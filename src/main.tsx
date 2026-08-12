import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { SiteExperience } from './SiteExperience';
import { startExperienceRuntime } from './experienceRuntime';
import './styles.css';
import './spatial.css';
import './directory.css';
import './mission.css';
import './now.css';
import './foc.css';
import './site-experience.css';
import './system-atlas.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <SiteExperience />
  </React.StrictMode>,
);

requestAnimationFrame(() => {
  startExperienceRuntime();
});
