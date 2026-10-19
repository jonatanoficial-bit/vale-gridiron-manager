# Ciclo 15 — Assistente tático adaptável

## Escopo entregue

O Jogo Único oferece uma escolha local para definir o quanto a transmissão deve explicar e interromper:

- **Guiado:** pausa em terceiras descidas com quatro ou mais jardas e nas decisões críticas já existentes. O painel explica a razão da chamada sugerida.
- **Estratégico:** pausa em quarta descida e red zone, mantendo o comportamento anterior como opção padrão.
- **Automático:** o piloto executa as chamadas determinísticas recomendadas sem criar uma pausa tática.

O usuário pode alternar esse nível durante a transmissão. O botão não altera a estratégia do plano, a seed, o EventLog ou as regras do motor; ele controla somente os momentos em que a interface pede uma decisão.

## Limites deliberados

- As mensagens de ajuda são explicações de mecânicas do protótipo. Não são recomendações oficiais, dados de scouting ou análise de clubes/jogadores reais.
- Não há bônus de XP, compra, sorte, penalidade ou resultado extra associado ao nível de ajuda.
- A assistência não mascara as lacunas de rosters, ratings, calendários, contratos ou regras por competição que ainda dependem de snapshots e direitos verificados.

## Verificação

- Testes do módulo cobrem o comportamento Guiado, Estratégico e Automático em estados determinísticos.
- A tela de pré-jogo exibe o nível selecionado e mantém os três modos acessíveis por teclado.
