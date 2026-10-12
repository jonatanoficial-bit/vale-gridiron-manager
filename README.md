# VALE GridIron Manager

Fundação técnica do Lote 01 para o manager de futebol americano VALE GridIron Manager.

## O que está pronto

- Shell responsivo com os modos Carreira, Temporada Sandbox e Jogo Único.
- Perfil de técnico salvo localmente.
- Contratos TypeScript e status explícito do catálogo real.
- Testes de boot, rota e persistência.
- Workflow de validação e deploy no GitHub Pages.

## Conteúdo real

Este lote não inclui equipes, atletas, técnicos, logos de terceiros, uniformes ou calendários fictícios. O inventário real e versionado é o escopo do Lote 02. Consulte [`docs/CONTENT-COVERAGE.md`](docs/CONTENT-COVERAGE.md).

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
