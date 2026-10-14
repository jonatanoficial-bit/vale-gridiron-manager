# Status dos lotes

## Lotes 04 e 05 — entregues como protótipo verificável

- SimEngine determinístico com seed, posse, descida/distância, relógio, placar e EventLog em `src/sim/`.
- Projeções de estatísticas derivadas do EventLog, sem atleta ou rating inventado.
- Jogo Único executável com escolhas de passe curto, corrida, punt, field goal e simulação até o fim.
- Campo 2D em Canvas com bola, linhas de scrimmage/primeira descida e 22 marcadores táticos neutros.
- Correção do fluxo de Carreira: salvar agora apresenta confirmação no próprio formulário e CTA de continuidade.

### Parcial / ainda pendente

- Rulesets completos por liga, penalties, lesões, reviews, overtime, formações e escalas individuais.
- Roster/ratings/uniformes autorizados para substituir os marcadores neutros.
- O Lote 05 não declara transmissão final enquanto esses dados e direitos não forem integrados.

## Lote 01 — concluído

- Base Vite + React + TypeScript strict.
- Design system de interface esportiva responsivo, inspirado na direção visual fornecida sem usar imagens como botões.
- Lobby e rotas navegáveis para Carreira, Temporada Sandbox e Jogo Único.
- Perfil do técnico com save local de demonstração.
- Contratos de dados, página de cobertura e bloqueios honestos para conteúdo que ainda não existe.
- Manifesto web básico, workflow de validação e deploy para GitHub Pages.
- Testes de boot, rota e persistência do perfil.

### Simplificado

- A persistência usa `localStorage` até a implementação de slots e migração em IndexedDB.
- O service worker é uma fundação de cache simples; uma estratégia completa de offline será tratada no Lote 11.
- O cabeçalho usa uma trava tipográfica temporária porque o PNG citado não está disponível no diretório local da tarefa.

### Planejado / não implementado

- Inventário de atletas, técnicos, contratos, uniformes e mídia (Lote 03).
- Carreira, mercado, treino, finanças e sistemas profundos (Lotes 06 a 09).

## Lote 02 — parcial, com evidência

- Snapshots versionados de NFL, NCAA FBS, NCAA FCS e UFL com corte em `2026-10-11`.
- 32 franquias NFL e 8 equipes UFL registradas por ID, fonte e status por campo.
- RuleSets separados, marcos confirmados da UFL e relatório de cobertura por campo.
- Escudos de NFL publicados pela própria liga e lineup de oito escudos UFL publicado por UFL on FOX, preservados sem alteração e registrados no manifesto de direitos.
- Nenhum atleta, técnico, universidade, uniforme ou contrato foi criado para preencher lacunas.

## Lote 03 — parcial, com evidência

- Importador reproduzível em `tools/import-nfl-roster.mjs`, com URL, data, checksum e proteção contra IDs duplicados.
- Snapshot `NFL_2026_2026-10-13`: 77 linhas publicadas no roster do Buffalo Bills, identificadas por fonte oficial da NFL.
- Comissão técnica oficial do Buffalo Bills: Joe Brady, Pete Carmichael, Jim Leonhard e Jeff Rodgers.
- O acordo de cinco anos de Joe Brady é registrado como parcial: a fonte não publica salário e o campo permanece nulo.
- Nenhum retrato, uniforme, estádio, atributo de simulação ou contrato de atleta foi criado sem fonte e autorização por campo.
- A cobertura continua `1/32` franquias NFL; UFL e NCAA permanecem pendentes de snapshots individuais.
