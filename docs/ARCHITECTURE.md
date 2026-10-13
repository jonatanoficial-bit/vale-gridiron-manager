# Arquitetura do Lote 01

## Objetivo desta entrega

Esta base implementa o shell navegável para os três modos, contratos iniciais de dados, persistência local do perfil do técnico, uma interface responsiva e a automação de validação/deploy para GitHub Pages.

## Organização

- `src/App.tsx`: shell, navegação por hash e telas do Lote 01.
- `src/domain/contracts.ts`: contratos tipados de perfil, cobertura e snapshots.
- `src/data/content-status.ts`: estado explícito da cobertura de conteúdo real.
- `src/lib/persistence.ts`: persistência transitória do perfil em `localStorage`.
- `public/`: manifest, service worker simples, emblema VALE e campo de referência fornecidos pelo usuário, preservados sem alterações, e avatares originais de perfil em `public/avatars/`.

## Decisões de base

As rotas `#/carreira`, `#/temporada`, `#/elenco` e `#/jogo-unico` são independentes. A aplicação não contém elenco, equipe, técnico, calendário, logo de terceiros ou uniforme inventado. O catálogo real é incorporado por snapshots versionados; o primeiro roster auditável entrou no Lote 03.

O navegador é o runtime principal. GitHub Pages hospeda somente a aplicação estática; não há promessa de Node ou Python no Pages.
