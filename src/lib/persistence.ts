import type { CoachProfile } from '../domain/contracts'

const PROFILE_KEY = 'vale-gridiron-manager:coach-profile:v1'

const defaultProfile: CoachProfile = {
  name: '',
  nationality: 'Brasil',
  difficulty: 'Equilibrada',
  philosophy: 'Ataque equilibrado',
  reduceMotion: false,
}

export function loadCoachProfile(): CoachProfile {
  try {
    const saved = window.localStorage.getItem(PROFILE_KEY)
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile
  } catch {
    return defaultProfile
  }
}

export function saveCoachProfile(profile: CoachProfile) {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}
