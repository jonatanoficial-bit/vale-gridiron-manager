import type { RosterCoverageReport } from '../domain/roster'
import { BILLS_2026_ROSTER, BILLS_2026_ROSTER_IMPORT } from './imports/buffalo-bills-2026'
import { BILLS_2026_STAFF, BILLS_2026_STAFF_CONTRACTS } from './staff/buffalo-bills-2026'

export { BILLS_2026_ROSTER, BILLS_2026_ROSTER_IMPORT, BILLS_2026_STAFF, BILLS_2026_STAFF_CONTRACTS }

export const LOTE_03_NFL_SNAPSHOT = {
  id: 'NFL_2026_2026-10-13',
  leagueId: 'nfl' as const,
  seasonYear: 2026,
  sourceAsOfDate: '2026-10-13',
  sourceIds: ['nfl-roster-buffalo-2026', 'bills-coaching-staff-2026', 'bills-joe-brady-contract-2026'],
  contentRightsStatus: 'pending' as const,
}

export const ROSTER_COVERAGE_2026: RosterCoverageReport[] = [
  {
    snapshotId: LOTE_03_NFL_SNAPSHOT.id,
    teamId: 'nfl-buffalo-bills',
    rosterRows: BILLS_2026_ROSTER.length,
    staffRows: BILLS_2026_STAFF.length,
    athleteContracts: 0,
    staffContracts: BILLS_2026_STAFF_CONTRACTS.length,
    portraitAssets: 0,
    uniformAssets: 0,
    stadiumAssets: 0,
    simulationProfiles: 0,
    contentRightsStatus: 'pending',
    notes: 'Primeiro import auditável do Lote 03. As outras 31 franquias NFL, UFL e NCAA seguem pendentes por snapshot próprio.',
  },
]

export function positionGroups() {
  return [...new Set(BILLS_2026_ROSTER.map((player) => player.position))].sort()
}
