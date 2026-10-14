# VALE GridIron Manager

Fundação técnica dos Lotes 01 a 05 para o manager de futebol americano VALE GridIron Manager.

## O que está pronto

- Shell responsivo com os modos Carreira, Temporada Sandbox e Jogo Único.
- Perfil de técnico salvo localmente.
- Contratos TypeScript e status explícito do catálogo real.
- Testes de boot, rota e persistência.
- Workflow de validação e deploy no GitHub Pages.
- Inventário 2026 com snapshots explícitos de NFL, NCAA FBS/FCS e UFL.
- 32 franquias NFL e 8 equipes UFL registradas por ID, fonte e data de corte.
- RuleSets separados, relatório de cobertura por campo e seleção sandbox persistente.
- Rota de elenco com o primeiro snapshot de roster auditável: Buffalo Bills, 77 linhas publicadas pela NFL em 13 de outubro de 2026.
- Quatro cargos de comissão técnica do Buffalo Bills e o prazo publicado do acordo de Joe Brady, sem inventar salários, ratings, retratos ou contratos ausentes.
- Quatro avatares cinematográficos originais e fictícios para o perfil do usuário, persistidos no modo Carreira e separados do banco de dados de pessoas reais.
- SimEngine determinístico com seed, EventLog, placar, posse, descidas, relógio e projeção de estatísticas baseada somente nos eventos.
- Partida 2D jogável em `#/jogo-unico`, com Canvas tático, play-by-play e marcadores neutros enquanto os rosters e uniforms oficiais não forem cobertos.
- Confirmação explícita ao salvar o perfil de carreira, com caminho direto para a temporada.

## Conteúdo real

Os Lotes 02 e 03 registram apenas o que foi efetivamente obtido: a identificação estrutural de NFL e UFL, os snapshots 2026, fontes, marcos UFL e um primeiro roster auditável do Buffalo Bills. Os 32 escudos NFL e os oito escudos UFL foram adicionados sem alteração e constam do manifesto. As outras 31 franquias NFL, UFL, NCAA FBS/FCS, contratos de atletas, fotos, uniformes, estádio e ratings continuam explicitamente pendentes. Nenhum nome, atributo ou valor é inventado para completar lacunas. Consulte [`docs/CONTENT-COVERAGE.md`](docs/CONTENT-COVERAGE.md), [`docs/LOT-02-SCOPE.md`](docs/LOT-02-SCOPE.md), [`docs/LOT-03-SCOPE.md`](docs/LOT-03-SCOPE.md) e [`docs/rights/TEAM-LOGOS-2026.md`](docs/rights/TEAM-LOGOS-2026.md).

O PNG original do emblema foi copiado sem modificação para `public/brand/vale-gridiron-manager.png` e está aplicado no cabeçalho e lobby. O campo de futebol americano fornecido como referência visual também foi incluído sem alteração em `public/media/`; ele não representa um estádio oficial de clube.

## Desenvolvimento

```bash
pnpm install
pnpm dev
pnpm test
pnpm run build
```

As rotas principais são `#/`, `#/carreira`, `#/temporada`, `#/elenco` e `#/jogo-unico`.

## Publicação

Após o primeiro push, em **Settings → Pages**, selecione **GitHub Actions** como fonte de publicação. O workflow em `.github/workflows/pages.yml` executa lint, testes, build e deployment para a branch `main`.
