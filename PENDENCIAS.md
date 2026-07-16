# Pendências conhecidas

## Cadastro necessário

Os seis registros abaixo são exibidos como `PENDENTE DE CADASTRO` em `src/data/materiaisPendentes.ts`:

| Registro temporário | Motivo |
| --- | --- |
| Kit para cabo de 6 fibras | O diagrama menciona o kit, mas não há nome corporativo/código inequívoco na planilha. |
| Kit para cabo de 12 fibras | Mesmo caso. |
| Kit para cabo de 24 fibras | Mesmo caso. |
| Kit para cabo de 36 fibras | Mesmo caso. |
| Kit para cabo de 72 fibras | Mesmo caso. |
| Kit para cabo de 144 fibras | Mesmo caso. |

Para resolver, atualize o nome, o código e a unidade diretamente nesse arquivo. Após confirmação da composição, crie também uma regra específica em `src/rules/regrasMateriais.ts`.

## Regras que precisam de confirmação operacional

1. **Quantidade de kits por metragem:** o fluxo pede a metragem associada a um kit, mas não informa a fórmula de arredondamento ou a composição. O teste correspondente está marcado como pendente.
2. **CTO de prédio:** o diagrama não traz um código de material. O MVP usa o Mini DIO/CDOI da lista de projeto como escolha conservadora para troca completa, devendo ser homologado.
3. **Relação entre curva e CTO:** o MVP trata curvas e CTOs como grupos exclusivos dentro do total de postes, calculando o restante como postes retos. Drops de cliente são validados como subconjunto do total, sem duplicar a ferragem. Caso um mesmo poste possa pertencer aos dois grupos na operação, a regra deverá ser revista.
4. **Divergências de descrição na planilha:** algumas linhas de `Lista de Ferragem` e `Lista Projeto` apresentam nomes/códigos aparentemente deslocados. As regras foram limitadas aos vínculos confirmáveis.
5. **Estoque e aprovação:** não há fonte de saldo, aprovação, destinatários ou e-mail de expedição para integração automática. O MVP gera o texto e o TXT, mas não envia o e-mail.
