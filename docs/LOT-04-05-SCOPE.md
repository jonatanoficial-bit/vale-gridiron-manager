# Lotes 04 e 05 — motor de jogo e transmissão 2D

## Entrega desta etapa

- `src/sim/engine.ts` implementa um SimEngine TypeScript puro, com seed, estado imutável por retorno, posse, descidas, distância, relógio, placar, troca de posse, touchdown, ponto extra, field goal, punt, interceptação e turnover on downs.
- O EventLog é a única origem das projeções em `src/sim/stats.ts`; a tela não altera o estado do motor nem cria estatísticas por conta própria.
- Mesma seed e mesma sequência de chamadas produzem o mesmo estado e log.
- `src/broadcast/FieldCanvas.tsx` renderiza o campo tático 2D, 22 marcadores, bola, linha de scrimmage e linha de primeira descida a partir do `GameState`.
- A rota `#/jogo-unico` permite selecionar duas identidades de time existentes no catálogo e jogar manualmente ou simular até o fim.
- O perfil de carreira exibe confirmação acessível de save e uma ação explícita para continuar para a temporada.

## Limites conscientes desta entrega

- O motor usa baseline tático **neutro**. Não há rating, nome, posição, retrato ou contrato de atleta inserido no cálculo.
- Os escudos exibidos pertencem ao catálogo registrado nos Lotes 02–03. Os marcadores de campo são geométricos e neutros: não são atletas, uniformes ou retratos oficiais.
- Ainda não há formação/escalação individual, penalties, lesões, review, conversões de dois pontos, overtime, mercado ou regras completas por liga. O rótulo na interface deixa essa cobertura clara.
- Os quatro quartos seguem 15 minutos no protótipo; a integração completa de `RuleSet` por NFL, NCAA e UFL permanece uma etapa posterior.

## Critérios verificados

- Determinismo para seed e chamadas iguais.
- Uma ação de jogo registra `snap` antes da ação resultante.
- Pontos só são adicionados por evento de touchdown, ponto extra ou field goal convertido.
- A simulação termina com `end-game` e mantém o EventLog como fonte da projeção de estatísticas.

## Referência de escopo

As diretrizes de SimEngine, EventLog, renderização 2D e separação entre cálculo e visual foram aplicadas da Bíblia Mestra fornecida pelo usuário. :codex-file-citation{path="C:\\Users\\jonat\\Pictures\\Futebol Americano\\VALE GRIDIRON MANAGER — BÍBLIA MESTRE OFICIAL _ 12 LOTES _ DOCUMENTO VIVO.pdf" purpose="source"}
