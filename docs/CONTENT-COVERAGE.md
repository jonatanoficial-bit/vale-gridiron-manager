# Cobertura de conteúdo

## Estado após o Lote 06

| Camada | Estado | Regra |
| --- | --- | --- |
| Contratos de dados | Pronto | Snapshots, fontes por ID, RuleSets, métricas de cobertura e cenários de carreira. |
| NFL 2026 | Parcial | 32 franquias, AFC/NFC e divisões registradas; Buffalo Bills tem 77 linhas de roster e 4 cargos de staff importados em snapshot de 13 OUT 2026. As demais 31 franquias, fixtures e mídia continuam pendentes. |
| UFL 2026 | Parcial | 8 equipes e 3 marcos de calendário registrados; a tabela de 43 jogos e o staff ainda não foram importados. |
| NCAA FBS/FCS 2026 | Pendente | As fontes oficiais e RuleSets estão declarados, mas nenhuma universidade foi adicionada sem validação de football e temporada. |
| Equipes, atletas e técnicos | Parcial | Há 77 atletas e 4 cargos de staff do Buffalo Bills com fonte, data e status por campo. Não existem NPCs substitutos. |
| Contratos e ratings | Parcial | Apenas o prazo público de cinco anos de Joe Brady foi registrado; salário é nulo. Contratos de atletas e ratings de simulação seguem pendentes. |
| Escudos de times | Parcial | 32 NFL e 8 UFL foram registrados com arquivo, fonte e estado de direitos; uniformes, fotos e demais mídia seguem pendentes. |
| Imagens e uniformes de terceiros | Pendente | Entram somente com asset registrado e autorizado. |
| Emblema VALE GridIron Manager | Pronto | PNG original fornecido pelo usuário foi copiado sem alteração para `public/brand/vale-gridiron-manager.png` e aplicado ao cabeçalho e lobby. |
| Campo de futebol americano de referência | Pronto para interface | PNG fornecido pelo usuário foi copiado sem alteração para `public/media/campo-futebol-americano-referencia.png`; é uma referência visual, não o estádio oficial de uma equipe. |
| SimEngine e transmissão tática | Parcial | Há motor determinístico e campo 2D com marcadores neutros. Não existem ratings, escalações, uniformes ou representações individuais no cálculo ou no canvas. |
| Carreira do técnico do usuário | Parcial | Dossiê persistente, XP, reputação, objetivos e inbox funcionam localmente. Clube, oferta, entrevista, contrato e salário continuam nulos até uma vaga real ser importada. |

## Contrato de snapshot

Cada entidade integrada tem `seasonId`, `sourceAsOfDate`, `contentRightsStatus` e fontes por ID. Uma lacuna de conteúdo aparece como pendência, nunca como identidade criada para decoração.

## Corte e relatório

- Corte de identificação do catálogo: `2026-10-11`; snapshot de roster do Buffalo Bills: `2026-10-13`.
- NFL: identificação `32/32`; roster importado `1/32` (77 linhas), staff `1/32` (4 cargos), contrato público parcial `1`; jogos, uniformes, faces e ratings `0` até importação verificada.
- UFL: identificação `8/8`; marcos do calendário `3/43`; demais campos pendentes.
- NCAA FBS/FCS: importador e fontes cadastrados, sem instituições adicionadas até a validação do diretório e do patrocínio de football.
