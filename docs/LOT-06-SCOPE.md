# Lote 06 — carreira do técnico do usuário

## Implementado

- Dossiê local persistente para a entidade `UserCoach`, separada de técnicos reais.
- XP, reputação, objetivos e inbox com mensagens de sistema e de cobertura.
- Meta de análise de catálogo e meta de partida: uma partida finalizada no SimEngine pode concluir a análise do usuário.
- Estado explícito de clube atual vazio, sem contrato, salário, entrevista ou oferta criados sem snapshot que comprove a oportunidade.
- Painel de mercado de trabalho que informa `0 vagas verificadas` para FBS/FCS, UFL e NFL na cobertura atual.

## Limites declarados

- A trajetória completa pedida pelo Lote 06 depende de vagas, staffs e contratos reais por temporada. Esses campos não existem de forma completa no catálogo atual e permanecem bloqueados.
- XP e reputação são um modelo de progresso do usuário; não são rating, currículo ou vínculo de uma pessoa real.
- Não há demissão, mudança de clube, proposta, entrevista ou salário simulados sem dados que os sustentem.

## Próxima dependência

Após a importação verificável de vagas e staff por snapshot, o dossiê poderá abrir ofertas reais compatíveis. Até lá, preserva o save e a progressão sem inventar mercado de trabalho.

## Referência de escopo

O dossiê, XP, reputação, objetivos, vagas, inbox, contratos e mudanças de clube foram delimitados conforme a Bíblia Mestra fornecida pelo usuário. :codex-file-citation{path="C:\\Users\\jonat\\Pictures\\Futebol Americano\\VALE GRIDIRON MANAGER — BÍBLIA MESTRE OFICIAL _ 12 LOTES _ DOCUMENTO VIVO.pdf" purpose="source"}
