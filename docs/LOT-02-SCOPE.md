# Lote 02 — inventário técnico 2026

## Implementado com evidência

- Quatro snapshots versionados: NFL, NCAA FBS, NCAA FCS e UFL, todos com corte em `2026-10-11`.
- Registro de fonte por ID, data de corte, regra de temporada e estado de cobertura.
- 32 franquias NFL, com AFC/NFC e divisões verificadas.
- 8 equipes UFL 2026, com os marcos de abertura, playoffs e Championship.
- RuleSets separados para NFL, NCAA FBS, NCAA FCS e UFL; nenhum formato foi inventado para simular regras ausentes.
- Relatório de cobertura que expõe, por competição, o que foi obtido e o que ainda não existe no pacote.
- 32 escudos NFL de arquivos publicados pela NFL e os oito escudos UFL de um lineup publicado por UFL on FOX. Os arquivos foram preservados sem edição e constam do manifesto de ativos.

## Deliberadamente pendente

- Rosters, staff, contratos, atributos e calendários completos.
- Universidades e conferências FBS/FCS por snapshot validado.
- Uniformes, fotos, estádios e outras mídias.
- Execução de regras, simulação e qualquer placar de partida.

As pendências continuam explícitas no produto. Não há atletas, técnicos, universidades, equipes ou logos fictícios para preencher lacunas.

## Fontes registradas

- NFL: franquias, classificação, agenda, roster e Football Operations.
- NCAA: diretório de membros, patrocínio de football, estatísticas FBS e College Football Playoff.
- UFL: visão 2026, agenda 2026 e lineup de escudos UFL on FOX.

As URLs exatas e o escopo de cada fonte estão centralizados em `src/data/catalog-2026.ts`.
