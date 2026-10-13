# Matriz de testes - Lotes 01–03

| Área | Evidência atual | Comando |
| --- | --- | --- |
| Boot | Renderização do lobby e dos três modos | `pnpm test` |
| Rotas | Carreira abre por CTA/hash | `pnpm test` |
| Persistência base | Perfil do técnico é salvo em `localStorage` | `pnpm test` |
| Catálogo Lote 02 | NFL tem 32 IDs, UFL tem 8 e há quatro RuleSets separados | `pnpm test` |
| Sandbox | Equipe real selecionada no catálogo é persistida localmente | `pnpm test` |
| Importação Lote 03 | Roster Buffalo Bills tem 77 IDs distintos, Josh Allen preserva os campos publicados e o contrato parcial de Joe Brady não inventa salário | `pnpm test` |
| Rota de elenco | `#/elenco` mostra o snapshot e link oficial do atleta | `pnpm test` |
| Tipagem e build | TypeScript strict e bundle Vite | `pnpm build` |
| Qualidade estática | Lint do repositório | `pnpm lint` |
| GitHub Pages | Workflow cria o artefato `dist` | GitHub Actions após o push |

Os testes de motor, relógio, placar, simulação e transmissão 2D pertencem aos lotes posteriores e não são declarados como concluídos nesta entrega.
