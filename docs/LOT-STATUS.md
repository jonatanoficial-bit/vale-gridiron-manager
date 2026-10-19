# Status dos lotes

## Ciclo de produção 16 — sala de análise pós-jogo

- Uma partida finalizada abre um relatório local de técnico com a margem final, até três pontos de virada e um foco para a próxima transmissão.
- Cada item nasce exclusivamente do `GameState`, EventLog e plano tático local que já produziram a execução; não há coleta ou composição de dados externos.
- Perdas de posse priorizam uma leitura de proteção da bola; sem elas, a leitura considera a margem da simulação ou a identidade ofensiva escolhida.

### Limites preservados

- O relatório não atribui estatísticas, desempenho, título, vitória, derrota ou narrativa a atletas, clubes ou competições reais.
- Não altera XP, reputação, contratos, ofertas ou standings. É uma camada de revisão para a transmissão local.

## Ciclo de produção 15 — assistente tático adaptável

- Jogo Único agora oferece os modos Guiado, Estratégico e Automático antes e durante a transmissão.
- Guiado pausa também em terceiras descidas relevantes e explica o contexto; Estratégico preserva as pausas de quarta descida/red zone; Automático deixa o piloto seguir sem interrupção.
- O nível escolhido altera somente a interface de decisão. Seed, regras do SimEngine, EventLog e projeções continuam determinísticos.

### Limites preservados

- As leituras são regras transparentes do protótipo, não scouting, ratings, recomendações de uma liga ou desempenho real de atletas.
- O modo automático não cria resultados oficiais, histórico de clubes, ranking ou progresso comprado.

## Ciclo de produção 14 — slots manuais de save

- Três slots nomeados são gravados no mesmo IndexedDB do espelho ativo.
- Cada slot mostra técnico, nível, semana de desenvolvimento e data da cópia antes de uma restauração.
- A restauração normaliza saves de carreira anteriores e também atualiza o espelho de recuperação.

### Limites preservados

- Slots permanecem locais ao navegador/dispositivo; não há login, cloud ou sincronização entre dispositivos.
- A restauração substitui somente escolhas e progresso do usuário, sem criar conteúdo esportivo ou alterar snapshots do catálogo.

## Ciclo de produção 13 — carreira semanal e recuperação de save

- Semana de desenvolvimento local conecta treino, scouting e partida tática em três checkpoints persistentes.
- A recompensa é fixa (60 XP e 1 reputação) e só é liberada após os três checkpoints; não há compra, sorteio ou recompensa aleatória.
- O ciclo declara explicitamente que não equivale a semana, rodada ou resultado de competição real.
- O Cofre de Save agora lê o último espelho compatível do IndexedDB por ação explícita do usuário.

### Limites preservados

- Não há calendário, clube, vaga, contrato, ranking, atleta ou resultado oficial criado pelo ciclo.
- Slots nomeados, recuperação automática com comparação de versão e sincronização em nuvem continuam fora deste ciclo.

## Lotes 10, 11 e 12 — integração parcial, com evidência

- UX de transmissão com campo cinematográfico neutro, HUD de clubes e piloto tático que pausa em cenários críticos.
- Direção visual de console, cards de modos com arte, controles com feedback e suporte a movimento reduzido.
- Auto-save em localStorage com espelho IndexedDB, export/import de save JSON e service worker progressivo.
- XP por sessões táticas concluídas e trilha de credenciais somente para o perfil do usuário.
- Build e 22 testes automatizados aprovados; fluxo de pausa e retomada também revisado no navegador local.

### Pendente para o aceite completo

- Lote 10: áudio, internacionalização e teste em aparelhos físicos.
- Lote 11: teste de recuperação offline no deploy, slots/recuperação avançada, cloud opcional e auditoria de licenças final.
- Lote 12: stress de temporadas baseado em dados completos, release candidate, créditos e auditoria final de direitos.

## Lotes 07, 08 e 09 — sistemas estruturais, com dados bloqueados onde necessário

- `#/gestao` oferece três áreas jogáveis: pipeline universitário, front office profissional e tática/performance.
- O plano local persiste treino, scouting, instalações e identidade tática; esses parâmetros entram no SimEngine e produzem diferenças determinísticas no EventLog.
- O pipeline universitário não cria instituições, athletes, prospects ou rankings. O painel profissional não cria contratos, cap hit, transações ou propostas.

### Pendente para o aceite completo

- Lote 07: diretórios universitários, prospects, elegibilidade por atleta, conferências, calendários e postseason por temporada.
- Lote 08: contratos e cap hit de atletas, free agency, trades, draft, waivers, calendário, standings e playoffs versionados.
- Lote 09: ratings, staff, lesões, química por atleta, dados de scouting e economia por liga com fontes e metodologia auditáveis.

## Lote 06 — parcial, com save funcional

- Dossiê local persistente para o técnico do usuário com XP, reputação, inbox e objetivos.
- Uma partida tática finalizada registra a análise no desenvolvimento do usuário.
- O painel de vagas informa a ausência de oportunidades verificadas; não cria propostas, contrato, salário ou clube fictício.

### Pendente para o aceite completo

- Vagas universitárias/NFL reais por temporada, entrevistas, propostas, contratos, demissões e mudanças de clube dependem de staff e mercado importados por snapshot.

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
- Lobby e rotas navegáveis para Carreira, Temporada e Jogo Único.
- Perfil do técnico com save local de demonstração.
- Contratos de dados, página de cobertura e bloqueios honestos para conteúdo que ainda não existe.
- Manifesto web básico, workflow de validação e deploy para GitHub Pages.
- Testes de boot, rota e persistência do perfil.

### Simplificado

- O save usa `localStorage` como cópia principal e espelho de um slot ativo em IndexedDB; múltiplos slots e recuperação avançada continuam pendentes.
- O service worker usa cache progressivo de recursos visitados; a verificação de recuperação offline no deploy continua pendente.
- O cabeçalho usa uma trava tipográfica temporária porque o PNG citado não está disponível no diretório local da tarefa.

### Planejado / não implementado

- Inventário de atletas, técnicos, contratos, uniformes e mídia (Lote 03).
- Mercado, treino, finanças e sistemas profundos (Lotes 07 a 09); a carreira segue parcial até receber vagas e contratos reais.

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
