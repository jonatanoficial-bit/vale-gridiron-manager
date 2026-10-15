# Lotes 10–12 — apresentação, continuidade e auditoria

## Entregue nesta iteração

### Lote 10 — UX, acessibilidade e identidade

- Direção de interface mais próxima de transmissão esportiva/console: brilho de botões, superfícies em camadas, fundo cinematográfico, cartões de modo e feedback de interação.
- Duas artes de ambiente originais e neutras: estádio de transmissão e túnel de carreira. Elas não exibem logotipo, clube, atleta ou texto identificável.
- Campo da transmissão usa o estádio neutro como base visual; o `FieldCanvas` continua a desenhar bola, descidas, linhas e 22 marcadores a partir de `GameState`.
- Escudos e nomes publicados dos clubes selecionados aparecem acima do campo, sem criar uniformes, atletas ou identidades novas.
- Preferência de reduzir movimento respeitada pelo app e por `prefers-reduced-motion`.

### Lote 11 — save, continuidade e PWA

- Save existente em `localStorage` é espelhado em IndexedDB quando disponível no navegador.
- Ajustes incluem exportação e importação de arquivo JSON do save local, com validação básica de schema.
- Service worker progressivo faz cache das respostas same-origin já visitadas para continuidade offline após carregamento.
- A aplicação mantém o manifest PWA e a base de GitHub Pages.

### Lote 12 — integração e regressão

- Assistente de transmissão automática: chama jogadas pelo plano tático, pausa em quarta descida e red zone crítica, explica o cenário e permite escolha manual.
- A seleção do usuário atualiza o mesmo `GameState`/EventLog e a transmissão retoma automaticamente.
- Sessões táticas concluídas somam XP de perfil local; a trilha de credenciais mostra marcos transparentes, sem moeda, compra, sorteio ou associação a organização real.
- Testes unitários cobrem recomendações/pausas do piloto; testes de aplicação, carreira, operações e motor continuam ativos.

## Evidências desta entrega

- `pnpm build`: concluído com sucesso.
- `pnpm test`: 22 testes aprovados.
- Verificação em navegador local: pré-jogo, início de transmissão, pausa de quarta descida, decisão `Punt` e retomada do piloto confirmados.

## Limites que permanecem bloqueados

- O aceite integral dos Lotes 04–09 ainda depende de RuleSets completos, rosters/ratings, calendários, contratos, mercado, standings e dados universitários versionados.
- O aceite integral do Lote 10 precisa de teste em aparelhos móveis físicos, áudio e os idiomas adicionais.
- O aceite integral do Lote 11 requer teste de recuperação/offline no bundle publicado e infraestrutura de sincronização em nuvem, que é opcional.
- O aceite integral do Lote 12 requer simulações de longa duração possíveis com calendário e universo de dados completos, além de auditoria final de direitos e release candidate.

Nenhuma lacuna foi preenchida com universidades, jogadores, técnicos, clubes ou logos inventados.
