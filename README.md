# Solicitações de materiais — NOC

Aplicação web estática para montar solicitações de materiais do NOC, aplicar regras de ferragem e gerar o e-mail/TXT de expedição.

## O que o sistema faz

- registra equipe de retirada, data prevista, OS e protocolo em campos separados;
- trata rompimento, troca/equipagem de poste, caixa danificada e solicitação avulsa;
- permite informar múltiplos trechos de cabo, inclusive com a mesma capacidade;
- calcula ferragens por postes retos, curvas, CTOs e raquetes;
- gera e-mail e arquivo TXT com código, nome e quantidade dos materiais;
- mantém o rascunho somente no `localStorage` do navegador.

## Execução local

Requer Node.js LTS (20 ou superior).

```bash
npm install
npm run dev
```

Para validar a aplicação:

```bash
npm run test
npm run build
```

## Segurança dos dados

O repositório contém somente o catálogo operacional mínimo necessário às regras da aplicação. Planilhas corporativas, capturas de tela, catálogos importados, scripts de importação e diretórios gerados permanecem locais e estão no `.gitignore`.

## Publicação

Cada envio para a branch `main` executa o workflow em `.github/workflows/deploy-pages.yml`, gera a aplicação e publica no GitHub Pages.

## Estrutura

```text
src/
  components/       Interface
  data/             Catálogo operacional mínimo e configuração
  hooks/            Persistência local do rascunho
  rules/            Regras de negócio
  services/         Validação, geração e exportação
  tests/            Testes automatizados
  types/            Tipos de domínio
```

Documentação complementar: [regras de negócio](REGRAS_DE_NEGOCIO.md) e [pendências](PENDENCIAS.md).
