import type { CatalogSelection, CoachProfile } from '../domain/contracts'

const PROFILE_KEY = 'vale-gridiron-manager:coach-profile:v1'
const CATALOG_SELECTION_KEY = 'vale-gridiron-manager:catalog-selection:v1'

const defaultProfile: CoachProfile = {
  name: '',
  avatarId: 'sideline-command',
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

const defaultCatalogSelection: CatalogSelection = {
  seasonId: 'NFL_2026_2026-10-11',
  franchiseId: null,
}

export function loadCatalogSelection(): CatalogSelection {
  try {
    const saved = window.localStorage.getItem(CATALOG_SELECTION_KEY)
    return saved ? { ...defaultCatalogSelection, ...JSON.parse(saved) } : defaultCatalogSelection
  } catch {
    return defaultCatalogSelection
  }
}

export function saveCatalogSelection(selection: CatalogSelection) {
  window.localStorage.setItem(CATALOG_SELECTION_KEY, JSON.stringify(selection))
}
