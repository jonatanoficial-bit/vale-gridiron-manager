# Status do Lote 01

## Implementado

- Base Vite + React + TypeScript strict.
- Design system de interface esportiva responsivo, inspirado na direção visual fornecida sem usar imagens como botões.
- Lobby e rotas navegáveis para Carreira, Temporada Sandbox e Jogo Único.
- Perfil do técnico com save local de demonstração.
- Contratos de dados, página de cobertura e bloqueios honestos para conteúdo que ainda não existe.
- Manifesto web básico, workflow de validação e deploy para GitHub Pages.
- Testes de boot, rota e persistência do perfil.

## Simplificado

- A persistência usa `localStorage` até a implementação de slots e migração em IndexedDB.
- O service worker é uma fundação de cache simples; uma estratégia completa de offline será tratada no Lote 11.
- O cabeçalho usa uma trava tipográfica temporária porque o PNG citado não está disponível no diretório local da tarefa.

## Planejado / não implementado

- Inventário factual de ligas, clubes, atletas, técnicos e calendários (Lote 02 e 03).
- SimEngine, EventLog, regras de partida e estatísticas (Lote 04).
- Campo e transmissão 2D (Lote 05).
- Carreira, mercado, treino, finanças e sistemas profundos (Lotes 06 a 09).
