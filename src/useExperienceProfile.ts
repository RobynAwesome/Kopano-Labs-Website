import { useEffect, useState } from 'react';
import {
  getExperienceProfile,
  KPGS_PROFILE_CHANGE_EVENT,
  type ExperienceProfile,
} from './experienceRuntime';

export function useExperienceProfile() {
  const [profile, setProfile] = useState<ExperienceProfile>(() => getExperienceProfile());

  useEffect(() => {
    const handleProfileChange = (event: Event) => {
      const detail = (event as CustomEvent<ExperienceProfile>).detail;
      setProfile(detail ?? getExperienceProfile());
    };

    window.addEventListener(KPGS_PROFILE_CHANGE_EVENT, handleProfileChange);
    return () => window.removeEventListener(KPGS_PROFILE_CHANGE_EVENT, handleProfileChange);
  }, []);

  return profile;
}
