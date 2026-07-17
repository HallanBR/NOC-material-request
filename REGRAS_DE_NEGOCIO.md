# Regras de negócio

As regras estão centralizadas em `src/rules/regrasMateriais.ts`. Cada uma possui identificador, nome, descrição, condição e ação testável.

| ID | Regra | Ação |
| --- | --- | --- |
| `RG-POSTE-RAQUETE` | Quantidade de raquetes maior que zero. | Multiplica a composição de raquete da aba `Lista de Ferragem`. |
| `RG-POSTE-RETO` | Há total de postes após descontar curvas e CTOs. | Calcula postes retos como `total - curvas - CTOs` e aplica a ferragem correspondente. |
| `RG-POSTE-ANGULO` | Há postes com curva. | Aplica a composição de ângulo. |
| `RG-POSTE-CTO` | Há postes com CTO. | Aplica a composição de CTO. |
| `RG-CABO-AFETADO` | Há uma linha de cabo com metragem maior que zero. | Adiciona cada linha de cabo de 6/12/24/36/72/144 fibras separadamente, mesmo quando a fibra se repete. |
| `RG-KIT-PENDENTE` | A inclusão de kit foi marcada. | Inclui o kit selecionado como `PENDENTE DE CADASTRO`. |
| `RG-CAIXA-COMPLETA` | CTO de poste ou CEO danificada com troca completa confirmada. | Inclui CTO de poste ou CEO conforme o tipo escolhido. |
| `RG-SPLITTER` | Troca apenas do splitter e splittagem informada. | Inclui splitter 1x8 ou 1x16. |
| `RG-CTO-POSTE-ADESIVO-INTERNO` / `EXTERNO` | Há troca completa de CTO de poste. | Inclui um adesivo interno e um externo por CTO. |
| `RG-CTO-PREDIAL-SPLITTER-BOX` | CTO de prédio com splittagem 1x8 ou 1x16 escolhida. | Inclui a splitter box correspondente na mesma quantidade de CTOs. |
| `RG-CTO-PREDIAL-ADESIVO` | Há solicitação de CTO de prédio. | Inclui um adesivo por CTO de prédio solicitada. |
| `RG-AVULSA-CAIXA` | CEO ou CTO de poste foi escolhido em solicitação avulsa. | Inclui a caixa escolhida. |
| `RG-AVULSA-CTO-PREDIAL-SPLITTER-BOX` | CTO de prédio avulsa com splittagem escolhida. | Inclui a splitter box na mesma quantidade das CTOs. |
| `RG-AVULSA-CTO-PREDIAL-ADESIVO` | Há CTO de prédio avulsa. | Inclui um adesivo por CTO de prédio. |
| `RG-AVULSA-SPLITTER-1X8` / `1X16` | Há quantidade informada para splitter de CTO de poste avulsa. | Inclui os splitters conectorizados informados. |
| `RG-AVULSA-CTO-POSTE-ADESIVO-INTERNO` / `EXTERNO` | Há CTO de poste avulsa. | Inclui um adesivo interno e um externo por CTO. |
| `RG-AVULSA-ADESIVO-INTERNO` / `EXTERNO` | Foi escolhida a solicitação somente de adesivos. | Inclui apenas as quantidades informadas para cada adesivo. |

## Critérios de validação

- Equipe de retirada, data prevista, OS e protocolo são obrigatórios.
- Rompimento exige uma escolha exclusiva entre cabo ou kit.
- Cada linha de cabo requer metragem maior que zero.
- Curvas e CTOs não podem superar o total de postes; a quantidade de postes com drop também não pode superá-lo. O drop é uma característica do poste, não uma segunda composição que se soma às ferragens dele.
- CTO de prédio exige quantidade e escolha entre splitter box 1x8 ou 1x16, sem perguntas de troca completa ou troca apenas do splitter.
- Na solicitação avulsa, CTO de prédio e CTO de poste são opções diferentes. CTO de prédio recebe seu adesivo; CTO de poste recebe adesivos interno e externo. O modo somente adesivos aceita quantidades independentes.
- Códigos ausentes não bloqueiam a geração quando o dado estiver marcado como pendência; geram aviso explícito e aparecem no corpo do e-mail.

## Rastreabilidade

O repositório contém somente o catálogo operacional mínimo usado pelas regras. A planilha corporativa e seus arquivos derivados permanecem fora do versionamento.
