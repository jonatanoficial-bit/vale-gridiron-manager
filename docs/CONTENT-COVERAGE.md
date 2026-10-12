# Cobertura de conteúdo

## Estado no Lote 01

| Camada | Estado | Regra |
| --- | --- | --- |
| Contratos de dados | Pronto | Tipos iniciais de snapshot, save e perfil no código. |
| Ligas e calendários | Pendente | Serão importados no Lote 02 com fonte e data de corte. |
| Equipes, atletas e técnicos | Pendente | Não há nomes ou substitutos fictícios neste pacote. |
| Imagens, uniformes e logos de terceiros | Pendente | Entram somente com asset registrado e autorizado. |
| Emblema VALE GridIron Manager | Pendente de cópia local | O arquivo original deve ser incluído em `public/brand/` sem alterações. |

## Contrato de snapshot

Cada entidade integrada deve ter `seasonId`, `sourceAsOfDate` e `contentRightsStatus`. Uma lacuna de conteúdo precisa aparecer como pendência, nunca como identidade criada para decoração.
