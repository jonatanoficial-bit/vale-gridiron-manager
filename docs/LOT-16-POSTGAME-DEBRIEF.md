# Ciclo 16 — Sala de análise pós-jogo

## Entrega

Depois que o `SimEngine` encerra uma transmissão, a tela exibe o **Relatório do Técnico**. A seção contém:

- a margem que o próprio estado final calculou;
- até três eventos decisivos do EventLog, em ordem cronológica inversa;
- um foco de preparação para a próxima transmissão.

O foco é determinístico. Turnovers têm prioridade; na ausência deles, a leitura usa a margem final e a identidade ofensiva do plano local.

## Limite de dados

O recurso não consulta, atribui ou inventa informações de jogadores, treinadores, clubes, ligas ou competições reais. O texto visível declara que se trata de uma análise local da execução do SimEngine e não de um resultado oficial.

Também não grava XP, reputação, título, standings, contrato ou proposta. Essas dependências permanecem bloqueadas até que snapshots licenciados e auditáveis sejam integrados.

## Verificação

`src/sim/debrief.test.ts` cobre uma execução determinística completa e a prioridade de proteção da posse para uma interceptação registrada. O build TypeScript garante que o painel consuma somente o contrato de `GameState`.
