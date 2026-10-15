# Lotes 07–09 — operações de futebol, com limites de dados

## Entregue nesta iteração

- Rota `#/gestao` com Centro de Futebol responsivo e três mesas de trabalho: universidade, operação profissional e tática/performance.
- Pipeline universitário navegável para recrutamento, portal, elegibilidade e pós-temporada. Ele não cria universidade, candidato, atleta, redshirt, scholarship ou ranking sem snapshot importado.
- Ciclo profissional com etapas de avaliação, free agency, draft e camp. O painel deixa explícitos `0` contratos de atletas com valor importado; trades, draft, waivers e prática ficam bloqueados enquanto os campos necessários não existirem.
- Plano persistente no navegador para identidade ofensiva/defensiva, agressividade, foco/intensidade de treino, prontidão, fadiga, química, scouting, instalações e reserva operacional interna.
- Treino e scouting alteram indicadores mensuráveis do modelo local; o plano é enviado ao SimEngine e altera o EventLog e projeções de estatística mantendo a mesma seed reproduzível.

## Estado de conteúdo e limites

- Os indicadores de treino, scouting, instalações e reserva são parâmetros do protótipo, não ratings, receitas, salários, cap hits ou desempenho oficial de clube/atleta.
- O único roster publicado segue sendo Buffalo Bills 2026, já descrito no Lote 03. Não há prospects universitários, elenco universitário, contratos de atletas ou universo profissional completo importados.
- Por esse motivo, os aceites de offseason completa college e temporada/offseason profissional completa permanecem pendentes de dados oficiais versionados.

## Testes

- Plano de operações: treino, scouting e limites de agressividade.
- SimEngine: plano aéreo e terrestre reproduzíveis e com projeções diferentes usando a mesma seed.
- Aplicação: persistência do plano e passagem dele para uma partida `lot-09-strategy-v1`.

## Próxima dependência

Importar snapshots autorizados por temporada para diretórios NCAA, prospects, calendários, contratos, transações, dados de cap e fixtures. Nenhuma dessas lacunas será preenchida com identidades fictícias.
