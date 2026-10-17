# Ciclo de produção 14 — Slots Manuais de Save

## Escopo entregue

O Cofre de Save mantém três arquivos manuais: `ARQUIVO 01`, `ARQUIVO 02` e `ARQUIVO 03`. Cada registro guarda o mesmo `SaveBundle` que é exportado em JSON e apresenta, antes de restaurar:

- nome do técnico do usuário;
- nível derivado do XP local;
- número do ciclo de desenvolvimento;
- data/hora da gravação.

O espelho automático continua separado no slot `active` e segue sendo usado para a recuperação rápida.

## Segurança de estado

Ao restaurar, a carreira é normalizada para aceitar saves anteriores ao ciclo semanal. Quando o bundle não possui carreira, o registro de carreira local é removido de forma intencional para evitar que um perfil antigo reapareça após recarregar a página.

Os slots são estritamente locais ao IndexedDB do navegador. Eles não representam save em nuvem, conta, sincronização multiplayer ou cópia em outro dispositivo. A exportação JSON é a opção disponível para uma cópia externa.

## Limites de dados

O slot salva somente escolhas do usuário, progresso do UserCoach e o plano determinístico local. Ele não adiciona atletas, clubes, escudos, contratos, vagas, resultados, tabelas ou calendários oficiais.
