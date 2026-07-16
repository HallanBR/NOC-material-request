# Análise de requisitos e fontes

## Arquivos analisados

| Arquivo | Uso identificado |
| --- | --- |
| `Lista de Materiais - Documento Modelo 20260305.xlsx` | Fonte de materiais, códigos, categorias e matrizes de ferragem. |
| `Solicitação de materiais.drawio.html` | Fluxo de decisão para rompimento, postes, cabos, kits e caixas. |
| `Captura de tela 2026-07-15 204652.png` | Modelo de comunicação para expedição por e-mail. |

## Planilha

O arquivo Excel possui as abas: `Lista de Ferragem ` (com espaço final no nome), `Serviços`, `Lista Projeto`, `Planos de Conta`, `Centros de Custo`, `Base`, `Validação Mat.`, `Retirada`, `Devolução`, `Preço Materiais XX` e `Difusão de Custos XX`.

As abas diretamente usadas pelo MVP são:

- **Lista de Ferragem** (54 linhas): contém a matriz de quantidades por tipo de poste, as fórmulas de totalização e os códigos MK dos itens de ferragem.
- **Lista Projeto** (99 linhas): fornece o catálogo operacional organizado nas categorias `LANÇAMENTO`, `EMENDA`, `EVENTO` e `POP`. O importador normalizou 79 materiais dessas categorias.
- **Preço Materiais XX**: complementa os cabos de 24, 36, 72 e 144 fibras que não aparecem na área operacional da `Lista Projeto`.
- **Base** (3.537 linhas): catálogo corporativo de apoio, usado na planilha para consultas de custo. Seus códigos HB não são necessariamente os códigos MK utilizados no e-mail; por isso o sistema prioriza o código da coluna **Cód. MK** da `Lista Projeto` e da aba de preços.
- **Serviços**, **Planos de Conta**, **Centros de Custo**, **Validação Mat.**, **Retirada**, **Devolução** e **Difusão de Custos XX** foram inspecionadas. Elas apoiam custo, estoque, retirada/devolução ou classificação financeira, sem regras inequívocas para a geração do e-mail deste MVP.

### Matriz encontrada em `Lista de Ferragem`

As composições abaixo foram implementadas multiplicando cada item pela quantidade informada:

| Tipo | Composição principal por unidade |
| --- | --- |
| Raquete | Fita BAP 2, Suporte BAP 2, Parafuso M2 2, Suporte REX 2, Isolador 2, Olhal 2, Alça de cordoalha 2, Cordoalha 40 m, Suporte Opt Loop 2, Kit Tap Bracket 2 e Anel Guia AGF 4. |
| Reto | Fita BAP 1, Suporte BAP 1, Parafuso M2 1, Suporte dielétrico 1 e Anel Guia AGF 2. |
| Ângulo | Fita BAP 1, Suporte BAP 2, Parafuso M2 2, Olhal 2, Alça para cabo 2 e Anel Guia AGF 4. |
| Ancoragem | Fita BAP 1, Suporte BAP 2, Parafuso M2 2, Olhal 2, Alça para cabo 2 e Anel Guia AGF 2. |
| CTO | Fita BAP 1, Suporte BAP 2, Parafuso M2 2, Olhal 2, Alça para cabo 2, Fita Fusimec 2, Fecho para Fusimec 2, Anel Guia AGF 4 e Cruzeta 1. |
| CTO ponta de cabo | Fita BAP 1, Suporte BAP 1, Parafuso M2 1, Olhal 1, Alça para cabo 1, Fita Fusimec 2, Fecho 2, Anel Guia AGF 4 e Cruzeta 1. |
| Ancoragem drop | Fita Fusimec 1, Fecho 1 e Anel Guia AGF 4. |

Os códigos MK usados para essas regras foram encontrados em `Lista Projeto`, por exemplo: Fita BAP `207`, Suporte BAP `243`, Parafuso M2 `206`, Olhal `424`, Alça para cabo `1057`, Fita Fusimec `133`, Fecho `551`, Anel Guia `802` e Cruzeta `688`.

## Diagrama de fluxo

O diagrama não segue uma notação formal e apresenta rótulos repetidos. A interpretação funcional foi:

1. A solicitação pode partir de **rompimento** ou de **caixa danificada**.
2. Para rompimento, há decisões para inserir kits, selecionar cabos de 6/12/24/36/72/144 fibras, informar metragem, quantidade de postes e necessidade de raquete.
3. Para troca/equipagem de poste, há decisões sobre quantidade, CTO, drop de cliente, troca de CTO e postes com ângulo.
4. Para caixa danificada, há caminhos para CTO predial, CTO de poste ou CEO; troca completa; troca apenas do splitter; e opções de 1x8 e 1x16.
5. Os destinos “Separar materiais” foram interpretados como o ponto de aplicação das regras e geração da lista.

O sistema apresenta esses caminhos como campos condicionais, mas não converte decisões sem relação material confirmada em regras automáticas.

## Print do e-mail

O print demonstra um tom operacional e objetivo:

- abertura com **“Prezados,”**;
- introdução curta formalizando a solicitação para o setor;
- bloco “Detalhes da solicitação” com protocolo, OS e data prevista de retirada;
- lista em uma linha por item: `código - descrição - quantidade unidade`;
- encerramento com **“Atenciosamente,”** e assinatura.

Esse padrão foi usado no gerador. Após a validação operacional, o MVP mantém apenas equipe de retirada, protocolo/OS, data prevista, tipo de serviço e a justificativa dos itens automáticos.

## Ambiguidades e decisões conservadoras

- O diagrama pede a metragem de um kit, mas não informa o código do kit, sua composição nem uma fórmula de conversão. Os kits são gerados como `PENDENTE DE CADASTRO`, uma unidade por seleção.
- O diagrama contém “CTO de prédio”, mas não associa uma descrição/código empresarial inequívoco. Na troca completa o MVP usa o item `MINI DIO CDOI-AS8-S0108` disponível na planilha; esta associação deve ser validada pela operação.
- A planilha possui aparentes divergências de rótulo entre algumas linhas da matriz e da lista de projeto (notadamente Fio de Espinar/Fita Fusimec). Apenas materiais usados nas regras receberam código quando a correspondência era confirmável; o restante ficou fora de regras automáticas.
- A planilha não fornece uma relação formal entre serviço de mão de obra, estoque disponível e autorização de expedição. Esses controles permanecem fora do MVP sem backend.
