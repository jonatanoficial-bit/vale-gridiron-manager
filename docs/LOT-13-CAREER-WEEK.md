# Ciclo de produção 13 — Semana de Desenvolvimento

## Escopo entregue

O perfil de carreira possui uma semana de desenvolvimento local, composta por três checkpoints:

1. executar uma sessão de treino;
2. rodar um ciclo de scouting;
3. finalizar uma partida tática no SimEngine.

Cada checkpoint é idempotente por semana. Depois dos três, o usuário pode encerrar o ciclo e recebe `60 XP` e `1` ponto de reputação. O evento fica no inbox local e a próxima semana começa vazia.

## Integridade de dados

O ciclo não é uma agenda esportiva. Ele não cria rodada, temporada, clube, universidade, atleta, vaga, contrato, negociação, ranking ou resultado oficial. O rótulo “semana” descreve somente uma unidade de preparo do perfil do usuário.

## Persistência

`CareerProgress.developmentWeek` é migrado na leitura de saves anteriores. O espelho ativo do IndexedDB pode ser recuperado manualmente em Ajustes. O bundle precisa ter o contrato mínimo válido antes de ser importado ou recuperado.

## Próximos passos possíveis

- slots nomeados com metadados e cópias de segurança;
- recuperação automática comparando versões/horários;
- agenda real somente quando houver snapshots versionados de competição, clubes e fixtures;
- ofertas e contratos somente depois de importar mercados/staff verificáveis.
