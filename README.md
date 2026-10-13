# VALE GridIron Manager

Fundação técnica dos Lotes 01 e 02 para o manager de futebol americano VALE GridIron Manager.

## O que está pronto

- Shell responsivo com os modos Carreira, Temporada Sandbox e Jogo Único.
- Perfil de técnico salvo localmente.
- Contratos TypeScript e status explícito do catálogo real.
- Testes de boot, rota e persistência.
- Workflow de validação e deploy no GitHub Pages.
- Inventário 2026 com snapshots explícitos de NFL, NCAA FBS/FCS e UFL.
- 32 franquias NFL e 8 equipes UFL registradas por ID, fonte e data de corte.
- RuleSets separados, relatório de cobertura por campo e seleção sandbox persistente.

## Conteúdo real

O Lote 02 registra apenas o que foi efetivamente obtido: a identificação estrutural de NFL e UFL, os snapshots 2026, fontes e marcos UFL. Os 32 escudos NFL e os oito escudos UFL foram adicionados sem alteração e constam do manifesto; rosters, técnicos, fixtures completos, FBS/FCS, contratos, fotos e uniformes continuam explicitamente pendentes. Nenhum nome é inventado para completar lacunas. Consulte [`docs/CONTENT-COVERAGE.md`](docs/CONTENT-COVERAGE.md), [`docs/LOT-02-SCOPE.md`](docs/LOT-02-SCOPE.md) e [`docs/rights/TEAM-LOGOS-2026.md`](docs/rights/TEAM-LOGOS-2026.md).

O PNG oficial do emblema deve ser copiado sem modificação para `public/brand/` assim que o arquivo estiver disponível no checkout local. O sistema não o redesenha.

## Desenvolvimento

```bash
pnpm install
pnpm dev
pnpm test
pnpm run build
```

As rotas principais são `#/`, `#/carreira`, `#/temporada` e `#/jogo-unico`.

## Publicação

Após o primeiro push, em **Settings → Pages**, selecione **GitHub Actions** como fonte de publicação. O workflow em `.github/workflows/pages.yml` executa lint, testes, build e deployment para a branch `main`.
