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
| `RG-CAIXA-COMPLETA` | Caixa danificada com troca completa confirmada. | Inclui CTO, Mini DIO/CDOI ou CEO conforme o tipo escolhido. |
| `RG-SPLITTER` | Troca apenas do splitter e splittagem informada. | Inclui splitter 1x8 ou 1x16. |
| `RG-AVULSA-CAIXA` | CEO ou CTO foi escolhido em solicitação avulsa. | Inclui a caixa escolhida. |
| `RG-AVULSA-SPLITTER-1X8` / `1X16` | Há quantidade informada para splitter de CTO avulsa. | Inclui a quantidade indicada para cada splittagem. |

## Critérios de validação

- Equipe de retirada, data prevista e obra/OS/protocolo são obrigatórios.
- Rompimento exige uma escolha exclusiva entre cabo ou kit.
- Cada linha de cabo requer metragem maior que zero.
- Curvas e CTOs não podem superar o total de postes; a quantidade de postes com drop também não pode superá-lo. O drop é uma característica do poste, não uma segunda composição que se soma às ferragens dele.
- Troca de caixa exige tipo, quantidade e resposta para troca completa. Se a opção for apenas splitter, a splittagem é obrigatória. CTO avulsa exige pelo menos um splitter.
- Códigos ausentes não bloqueiam a geração quando o dado estiver marcado como pendência; geram aviso explícito e aparecem no corpo do e-mail.

## Rastreabilidade

Os materiais importados preservam arquivo, aba e linha de origem. O catálogo é atualizado pelo script `scripts/importarMateriais.mjs`; não altere o arquivo gerado manualmente.
