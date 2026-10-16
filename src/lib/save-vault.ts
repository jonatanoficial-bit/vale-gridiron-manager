import type { CareerProgress, CatalogSelection, CoachProfile, OperationsPlan } from '../domain/contracts'

const DATABASE_NAME = 'vale-gridiron-manager'
const STORE_NAME = 'save-slots'
const ACTIVE_SLOT = 'active'

export interface SaveBundle {
  schemaVersion: 1
  exportedAt: string
  profile: CoachProfile
  catalogSelection: CatalogSelection
  careerProgress: CareerProgress | null
  operationsPlan: OperationsPlan
}

function openVault() {
  if (typeof window === 'undefined' || !('indexedDB' in window)) return Promise.resolve<IDBDatabase | null>(null)
  return new Promise<IDBDatabase | null>((resolve) => {
    const request = window.indexedDB.open(DATABASE_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => resolve(null)
  })
}

export async function mirrorSaveBundle(bundle: SaveBundle) {
  const database = await openVault()
  if (!database) return false
  return new Promise<boolean>((resolve) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).put(bundle, ACTIVE_SLOT)
    transaction.oncomplete = () => { database.close(); resolve(true) }
    transaction.onerror = () => { database.close(); resolve(false) }
    transaction.onabort = () => { database.close(); resolve(false) }
  })
}

export async function loadMirroredSaveBundle() {
  const database = await openVault()
  if (!database) return null
  return new Promise<SaveBundle | null>((resolve) => {
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const request = transaction.objectStore(STORE_NAME).get(ACTIVE_SLOT)
    request.onsuccess = () => {
      database.close()
      resolve(isSaveBundle(request.result) ? request.result : null)
    }
    request.onerror = () => {
      database.close()
      resolve(null)
    }
  })
}

export function makeSaveBundle(profile: CoachProfile, catalogSelection: CatalogSelection, careerProgress: CareerProgress | null, operationsPlan: OperationsPlan): SaveBundle {
  return { schemaVersion: 1, exportedAt: new Date().toISOString(), profile, catalogSelection, careerProgress, operationsPlan }
}

export function parseSaveBundle(value: string): SaveBundle | null {
  try {
    const parsed = JSON.parse(value)
    return isSaveBundle(parsed) ? parsed : null
  } catch {
    return null
  }
}

function isSaveBundle(value: unknown): value is SaveBundle {
  if (!value || typeof value !== 'object') return false
  const parsed = value as Partial<SaveBundle>
  return parsed.schemaVersion === 1
    && typeof parsed.exportedAt === 'string'
    && Boolean(parsed.profile)
    && Boolean(parsed.catalogSelection)
    && Boolean(parsed.operationsPlan)
    && Object.prototype.hasOwnProperty.call(parsed, 'careerProgress')
    && (parsed.careerProgress === null || typeof parsed.careerProgress === 'object')
}
