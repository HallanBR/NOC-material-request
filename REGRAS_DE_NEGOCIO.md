# Regras de negócio

As regras estão centralizadas em `src/rules/regrasMateriais.ts`. Cada uma possui identificador, nome, descrição, condição e ação testável.

| ID | Regra | Ação |
| --- | --- | --- |
| `RG-POSTE-RAQUETE` | Quantidade de raquetes maior que zero. | Multiplica a composição de raquete da aba `Lista de Ferragem`. |
| `RG-POSTE-RETO` | Há total de postes após descontar curvas e CTOs. | Calcula os postes retos restantes e aplica a ferragem correspondente. |
| `RG-POSTE-ANGULO` | Há postes com curva. | Aplica dois parafusos M2 (um por suporte BAP), um olhal e dois anéis guia por poste, além das demais ferragens. |
| `RG-POSTE-CTO` | Há postes com CTO. | Aplica a composição de CTO. |
| `RG-CABO-AFETADO` | Há uma linha de cabo com metragem maior que zero. | Adiciona cada linha de cabo de 6/12/24/36/72/144 fibras separadamente, mesmo quando a fibra se repete. |
| `RG-KIT-ROMPIMENTO` | A inclusão de kit foi marcada. | Inclui o kit cadastrado de 24, 36, 72 ou 144 fibras. |
| `RG-ALCA-POR-KIT` | Há quantidade de alças informada para um kit selecionado. | Inclui o modelo de alça correspondente à capacidade do kit de 24, 36, 72 ou 144 fibras. |
| `RG-ALCA-POR-CABO` | Há quantidade informada de acessórios em uma linha de cabo. | Inclui a quantidade de alças informada, de acordo com a capacidade escolhida. |
| `RG-PLAQUETA-POR-CABO` | Há quantidade informada de acessórios em uma linha de cabo. | Inclui a mesma quantidade de plaquetas de identificação amarela e soma todas as linhas em um único item. |
| `RG-CAIXA-COMPLETA` | CTO de poste ou CEO danificada com troca completa confirmada. | Inclui CTO de poste ou CEO conforme o tipo escolhido. |
| `RG-SPLITTER` | Troca apenas do splitter e splittagem informada. | Inclui splitter 1x8 ou 1x16. |
| `RG-CTO-POSTE-ADESIVO-INTERNO` / `EXTERNO` | Há troca completa de CTO de poste. | Inclui um adesivo interno e um externo por CTO. |
| `RG-CTO-PREDIAL-SPLITTER-BOX` | CTO de prédio com splittagem 1x8 ou 1x16 escolhida. | Inclui a splitter box correspondente na mesma quantidade de CTOs. |
| `RG-CTO-PREDIAL-ADESIVO` | Há solicitação de CTO de prédio. | Inclui um adesivo por CTO de prédio solicitada. |
| `RG-AVULSA-CAIXA` | CEO ou CTO de poste foi escolhido em solicitação avulsa. | Inclui a CEO, a CTO montada 1066 ou o gabinete desmontado 700 conforme a configuração. |
| `RG-AVULSA-CTO-PREDIAL-SPLITTER-BOX` | CTO de prédio avulsa com splittagem escolhida. | Inclui a splitter box na mesma quantidade das CTOs. |
| `RG-AVULSA-CTO-PREDIAL-ADESIVO` | Há CTO de prédio avulsa. | Inclui um adesivo por CTO de prédio. |
| `RG-AVULSA-CTO-POSTE-SPLITTER-EXTRA-1X8` | Foi escolhida a CTO com dois splitters 1x8. | Inclui uma CTO 1066 já montada e mais um splitter 1575 separado por CTO. |
| `RG-AVULSA-CTO-POSTE-SPLITTER-1X16` | Foi escolhida a CTO com splitter 1x16. | Inclui um gabinete desmontado 700 e um splitter 713 separado por CTO. |
| `RG-AVULSA-CTO-POSTE-ADESIVO-INTERNO` / `EXTERNO` | Há CTO de poste avulsa. | Inclui um adesivo interno e um externo por CTO. |
| `RG-AVULSA-ADESIVO-INTERNO` / `EXTERNO` | Foi escolhida a solicitação somente de adesivos. | Inclui apenas as quantidades informadas para cada adesivo. |

## Critérios de validação

- Equipe de retirada, data prevista, OS e protocolo são obrigatórios.
- Rompimento exige uma escolha exclusiva entre cabo ou kit.
- Kits de 6 e 12 fibras não são oferecidos. Os kits disponíveis são 24, 36, 72 e 144 fibras; para cada kit selecionado, o usuário pode informar a quantidade desejada da alça correspondente.
- Cada linha de cabo requer metragem maior que zero.
- A capacidade de cada linha de cabo define o modelo de alça. O usuário informa a quantidade de alças e plaquetas por linha; a interface recomenda duas unidades de cada item por poste. As linhas de cabos e alças permanecem separadas, enquanto as plaquetas de código 184 são agrupadas e somadas em um único item.
- Curvas e CTOs não podem superar o total de postes individualmente. Um mesmo poste pode ter curva e CTO; os materiais comuns respeitam o limite do total de postes e não são duplicados.
- O total de postes já considera os materiais para equipagem de drops de clientes; não há campo separado para drops.
- CTO de prédio exige quantidade e escolha entre splitter box 1x8 ou 1x16, sem perguntas de troca completa ou troca apenas do splitter.
- Na solicitação avulsa, CTO de prédio e CTO de poste são opções diferentes. A CTO de poste com 1x8 usa o código 1066, que já inclui um splitter. A opção com dois splitters 1x8 acrescenta um código 1575 por CTO. A opção 1x16 usa o gabinete desmontado 700 mais um splitter 713 por CTO.
- CTO de prédio recebe seu adesivo; CTO de poste recebe adesivos interno e externo. O modo somente adesivos aceita quantidades independentes.
- Códigos ausentes não bloqueiam a geração quando o dado estiver marcado como pendência; geram aviso explícito e aparecem no corpo do e-mail.

## Rastreabilidade

O repositório contém somente o catálogo operacional mínimo usado pelas regras. A planilha corporativa e seus arquivos derivados permanecem fora do versionamento.
