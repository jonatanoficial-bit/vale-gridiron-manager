import type { CoachAvatarId } from '../domain/contracts'

export interface CoachAvatarOption {
  id: CoachAvatarId
  label: string
  description: string
  path: string
}

export const COACH_AVATARS: CoachAvatarOption[] = [
  {
    id: 'sideline-command',
    label: 'Comando de sideline',
    description: 'Leitura de jogo sob as luzes do estádio.',
    path: '/avatars/coach-sideline-command.png',
  },
  {
    id: 'rain-tactician',
    label: 'Tático sob pressão',
    description: 'Decisões frias em uma noite de chuva.',
    path: '/avatars/coach-rain-tactician.png',
  },
  {
    id: 'facility-leader',
    label: 'Líder de preparação',
    description: 'Estratégia e desenvolvimento no centro de treino.',
    path: '/avatars/coach-facility-leader.png',
  },
  {
    id: 'veteran-vision',
    label: 'Visão veterana',
    description: 'Experiência e calma antes do kickoff.',
    path: '/avatars/coach-veteran-vision.png',
  },
  {
    id: 'brazilian-strategist',
    label: 'Estratégia brasileira',
    description: 'Leitura humana e comando sereno de sideline.',
    path: '/avatars/coach-brazilian-strategist.png',
  },
  {
    id: 'latino-analyst',
    label: 'Analista latino',
    description: 'Preparação, vídeo e decisões precisas.',
    path: '/avatars/coach-latino-analyst.png',
  },
  {
    id: 'east-asian-innovator',
    label: 'Inovação asiática',
    description: 'Tática moderna e estudo detalhado do adversário.',
    path: '/avatars/coach-east-asian-innovator.png',
  },
]

export function findCoachAvatar(id: CoachAvatarId) {
  return COACH_AVATARS.find((avatar) => avatar.id === id) ?? COACH_AVATARS[0]
}
