# Matriz de testes - Lotes 01–16

| Área | Evidência atual | Comando |
| --- | --- | --- |
| Boot | Renderização do lobby e dos três modos | `pnpm test` |
| Rotas | Carreira abre por CTA/hash | `pnpm test` |
| Persistência base | Perfil do técnico é salvo em `localStorage` e o app tenta espelhar o bundle ativo em IndexedDB | `pnpm test` |
| Catálogo Lote 02 | NFL tem 32 IDs, UFL tem 8 e há quatro RuleSets separados | `pnpm test` |
| Sandbox | Equipe real selecionada no catálogo é persistida localmente | `pnpm test` |
| Importação Lote 03 | Roster Buffalo Bills tem 77 IDs distintos, Josh Allen preserva os campos publicados e o contrato parcial de Joe Brady não inventa salário | `pnpm test` |
| Rota de elenco | `#/elenco` mostra o snapshot e link oficial do atleta | `pnpm test` |
| Avatar de carreira | Escolha de avatar cinematográfico fictício atualiza o perfil e é persistida no `localStorage` | `pnpm test` |
| Piloto de transmissão | Recomenda chamadas por contexto e pausa em quarta descida antes da escolha do usuário | `pnpm test` |
| Confirmação de carreira | Salvar perfil confirma o resultado no formulário e oferece continuidade | `pnpm test` |
| SimEngine Lote 04 | Determinismo por seed, `snap` antes da ação, pontos apenas por eventos de pontuação e fim de partida | `pnpm test` |
| Transmissão Lote 05 | Campo Canvas consome estado do motor; o App abre a partida e mostra EventLog/placar | `pnpm test` |
| Carreira Lote 06 | Dossiê do usuário nasce sem clube/vaga inventada e objetivos só recompensam uma vez | `pnpm test` |
| Ciclo local Lote 13 | Treino, scouting e partida são necessários para encerrar uma semana de desenvolvimento; cada checkpoint só conta uma vez | `pnpm test` |
| Recuperação Lote 13 | Contrato do bundle de save é validado antes de importação/recuperação | `pnpm test` |
| Assistência Lote 15 | Guiado pausa em terceira descida relevante; Estratégico e Automático preservam os limites de intervenção definidos | `pnpm test` |
| Sala de filme Ciclo 16 | Relatório final extrai até três eventos decisivos e prioriza proteção da posse quando há turnover no EventLog | `pnpm test` |
| Slots Lote 14 | Resumo de slot preserva nome do técnico, nível, semana e estado vazio sem adicionar dados esportivos | `pnpm test` |
| Universidade Lote 07 | Pipeline de recrutamento, portal, elegibilidade e pós-temporada informa lacunas sem gerar universidades ou atletas | revisão de UI + `pnpm test` |
| Profissional Lote 08 | Front office separa o ciclo profissional; cap, trades, waivers e contratos ficam bloqueados sem dados importados | revisão de UI + `pnpm test` |
| Tática e gestão Lote 09 | Plano persistente altera treino/scouting e entra no SimEngine sem perder determinismo | `pnpm test` |
| Tipagem e build | TypeScript strict e bundle Vite | `pnpm build` |
| Qualidade estática | Lint do repositório | `pnpm lint` |
| GitHub Pages | Workflow cria o artefato `dist` | GitHub Actions após o push |

Os testes não substituem a futura validação de rulesets completos, rosters, ratings e assets licenciados por competição.
