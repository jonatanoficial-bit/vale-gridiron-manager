# Lote 03 — Elencos reais e mídia real

## Escopo recebido

O Lote 03 pede banco de elencos reais completo e mídia real: atletas, técnicos, contratos, fotos, logos, uniformes, estádio e atributos de simulação; fornecedores, arquivos, duplicatas, histórico e versionamento. O aceite exige dados comprovados por snapshot importado, nenhuma identidade fictícia e relatório de ausências.

## Entrega parcial registrada

Esta entrega implementa uma primeira vertical verificável, e não declara o lote inteiro como concluído:

- `tools/import-nfl-roster.mjs` baixa a página oficial de roster do Buffalo Bills, extrai as linhas publicadas, impede IDs duplicados, gera checksum SHA-256 e atualiza o módulo versionado.
- O snapshot `NFL_2026_2026-10-13` preserva 77 linhas de roster publicadas pela NFL para Buffalo Bills, com URL de atleta, camisa, posição, status, altura, peso, experiência e faculdade quando disponibilizados.
- A comissão técnica contém somente Joe Brady, Pete Carmichael, Jim Leonhard e Jeff Rodgers, conforme a página oficial do clube.
- A notícia oficial de Joe Brady registra somente o prazo de cinco anos. Salário permanece `null` por não ter sido publicado pela fonte consultada.
- A rota `#/elenco` expõe data da fonte, checksum, contagem, filtro e relatório de pendências.

## Ausências declaradas

| Campo | Estado | Motivo |
| --- | --- | --- |
| Outras franquias NFL | Pendente | Cada franquia precisa de importação e snapshot próprio. |
| UFL e NCAA | Pendente | Não houve snapshot individual validado neste lote parcial. |
| Contratos de atletas e salários de staff | Pendente | Não foram publicados pela fonte usada; nenhum valor foi estimado. |
| Retratos, uniformes, estádios e fotos | Pendente | Não foram adicionados sem arquivo e manifesto de direitos por asset. |
| Atributos e ratings de simulação | Pendente | O motor do Lote 04 existe somente com baseline neutro; não há ratings arbitrários ou atribuídos a atletas. |

## Fontes do snapshot

- NFL, [Buffalo Bills roster 2026](https://www.nfl.com/teams/buffalo-bills/roster), consultado em 2026-10-13.
- Buffalo Bills, [coaching staff](https://www.buffalobills.com/team/coaches-roster/), consultado em 2026-10-13.
- Buffalo Bills, [Joe Brady agrees to terms to be the next head coach](https://www.buffalobills.com/news/joe-brady-agrees-to-terms-to-be-the-next-buffalo-bills-head-coach), publicado em 2026-01-27.

Os nomes de entidades são usados para identificação factual da fonte; isto não declara afiliação oficial do produto com NFL ou Buffalo Bills.
