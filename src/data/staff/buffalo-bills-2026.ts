import type { StaffContractRecord, StaffRosterRecord } from '../../domain/roster'

const snapshot = {
  seasonId: 'NFL_2026_2026-10-13',
  sourceAsOfDate: '2026-10-13',
  contentRightsStatus: 'pending' as const,
}

export const BILLS_2026_STAFF: StaffRosterRecord[] = [
  { id: 'nfl-2026-buffalo-bills-joe-brady', name: 'Joe Brady', teamId: 'nfl-buffalo-bills', role: 'Head Coach', sourceId: 'bills-coaching-staff-2026', identityStatus: 'ready', contractStatus: 'partial', mediaStatus: 'pending', ...snapshot },
  { id: 'nfl-2026-buffalo-bills-pete-carmichael', name: 'Pete Carmichael', teamId: 'nfl-buffalo-bills', role: 'Offensive Coordinator', sourceId: 'bills-coaching-staff-2026', identityStatus: 'ready', contractStatus: 'pending', mediaStatus: 'pending', ...snapshot },
  { id: 'nfl-2026-buffalo-bills-jim-leonhard', name: 'Jim Leonhard', teamId: 'nfl-buffalo-bills', role: 'Defensive Coordinator', sourceId: 'bills-coaching-staff-2026', identityStatus: 'ready', contractStatus: 'pending', mediaStatus: 'pending', ...snapshot },
  { id: 'nfl-2026-buffalo-bills-jeff-rodgers', name: 'Jeff Rodgers', teamId: 'nfl-buffalo-bills', role: 'Special Teams Coordinator', sourceId: 'bills-coaching-staff-2026', identityStatus: 'ready', contractStatus: 'pending', mediaStatus: 'pending', ...snapshot },
]

export const BILLS_2026_STAFF_CONTRACTS: StaffContractRecord[] = [
  {
    id: 'nfl-2026-buffalo-bills-joe-brady-head-coach-contract',
    staffId: 'nfl-2026-buffalo-bills-joe-brady',
    teamId: 'nfl-buffalo-bills',
    durationYears: 5,
    salary: null,
    sourceId: 'bills-joe-brady-contract-2026',
    contractStatus: 'partial',
    notes: 'A fonte oficial informa acordo de cinco anos; nenhum valor de salário foi registrado.',
    ...snapshot,
  },
]
