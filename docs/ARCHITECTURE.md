# Arquitetura dos Lotes 01–09

## Objetivo desta entrega

Esta base implementa o shell navegável para os três modos, contratos iniciais de dados, persistência local do perfil do técnico, uma interface responsiva e a automação de validação/deploy para GitHub Pages.

## Organização

- `src/App.tsx`: shell, navegação por hash, carreira, catálogo e telas de partida.
- `src/sim/`: SimEngine puro, tipos, EventLog e projeção de estatísticas.
- `src/broadcast/FieldCanvas.tsx`: Canvas tático que consome o estado do motor sem alterá-lo.
- `src/career/progress.ts`: dossiê local do UserCoach, objetivos, XP, reputação e inbox.
- `src/operations/plan.ts`: plano local de universidade/profissional/performance, sessões de treino, ciclo de scouting e persistência do Centro de Futebol.
- `src/domain/contracts.ts`: contratos tipados de perfil, cobertura e snapshots.
- `src/data/content-status.ts`: estado explícito da cobertura de conteúdo real.
- `src/lib/persistence.ts`: persistência transitória do perfil em `localStorage`.
- `public/`: manifest, service worker simples, emblema VALE e campo de referência fornecidos pelo usuário, preservados sem alterações, e avatares originais de perfil em `public/avatars/`.

## Decisões de base

As rotas `#/carreira`, `#/temporada`, `#/elenco`, `#/jogo-unico` e `#/gestao` são independentes. A aplicação não contém elenco, equipe, técnico, calendário, logo de terceiros ou uniforme inventado. O catálogo real é incorporado por snapshots versionados; o primeiro roster auditável entrou no Lote 03. O motor dos Lotes 04–05 usa parâmetros neutros até que os campos individuais tenham fonte e direitos registrados. O Lote 09 fornece ao motor um plano local e tipado (identidade, agressividade, prontidão, fadiga e química), que é diferente de ratings de atleta ou dados oficiais.

O navegador é o runtime principal. GitHub Pages hospeda somente a aplicação estática; não há promessa de Node ou Python no Pages.
