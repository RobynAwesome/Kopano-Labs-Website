import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { startExperienceRuntime } from './experienceRuntime';
import './styles.css';
import './spatial.css';
import './directory.css';
import './mission.css';
import './now.css';
import './foc.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

requestAnimationFrame(() => {
  startExperienceRuntime();
});
