# Cobertura de conteúdo

## Estado após o Lote 02

| Camada | Estado | Regra |
| --- | --- | --- |
| Contratos de dados | Pronto | Snapshots, fontes por ID, RuleSets, métricas de cobertura e cenários de carreira. |
| NFL 2026 | Parcial | 32 franquias, AFC/NFC e divisões registradas; roster, staff, 272 fixtures e mídia continuam pendentes. |
| UFL 2026 | Parcial | 8 equipes e 3 marcos de calendário registrados; a tabela de 43 jogos e o staff ainda não foram importados. |
| NCAA FBS/FCS 2026 | Pendente | As fontes oficiais e RuleSets estão declarados, mas nenhuma universidade foi adicionada sem validação de football e temporada. |
| Equipes, atletas e técnicos | Pendente | Não há atletas ou NPCs substitutos neste pacote; isso é trabalho do Lote 03. |
| Escudos de times | Parcial | 32 NFL e 8 UFL foram registrados com arquivo, fonte e estado de direitos; uniformes, fotos e demais mídia seguem pendentes. |
| Imagens e uniformes de terceiros | Pendente | Entram somente com asset registrado e autorizado. |
| Emblema VALE GridIron Manager | Pendente de cópia local | O arquivo original deve ser incluído em `public/brand/` sem alterações. |

## Contrato de snapshot

Cada entidade integrada tem `seasonId`, `sourceAsOfDate`, `contentRightsStatus` e fontes por ID. Uma lacuna de conteúdo aparece como pendência, nunca como identidade criada para decoração.

## Corte e relatório

- Corte deste snapshot: `2026-10-11`.
- NFL: identificação `32/32`; rosters, técnicos, jogos, uniformes, faces e contratos `0` até importação verificada.
- UFL: identificação `8/8`; marcos do calendário `3/43`; demais campos pendentes.
- NCAA FBS/FCS: importador e fontes cadastrados, sem instituições adicionadas até a validação do diretório e do patrocínio de football.
