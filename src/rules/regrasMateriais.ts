import { materialPorCodigo, materialPorId } from '../data/materiais'
import type { DadosSolicitacao, ItemSolicitacao, Material, RegraMaterial, Unidade } from '../types'

type Composicao = { codigo: string; quantidade: number; unidade?: Unidade }

const composicoes: Record<'raquete' | 'reto' | 'angulo' | 'cto', Composicao[]> = {
  raquete: [
    { codigo: '207', quantidade: 2 }, { codigo: '243', quantidade: 2 }, { codigo: '206', quantidade: 2 },
    { codigo: '813', quantidade: 2 }, { codigo: '815', quantidade: 2 }, { codigo: '424', quantidade: 2 },
    { codigo: '831', quantidade: 2 }, { codigo: '2057', quantidade: 40, unidade: 'm' },
    { codigo: '1543', quantidade: 2 }, { codigo: '1544', quantidade: 2 }, { codigo: '802', quantidade: 4 },
  ],
  reto: [
    { codigo: '207', quantidade: 1 }, { codigo: '243', quantidade: 1 }, { codigo: '206', quantidade: 1 },
    { codigo: '219', quantidade: 1 }, { codigo: '802', quantidade: 2 },
  ],
  angulo: [
    { codigo: '207', quantidade: 1 }, { codigo: '243', quantidade: 2 }, { codigo: '206', quantidade: 2 },
    { codigo: '424', quantidade: 2 }, { codigo: '1057', quantidade: 2 }, { codigo: '802', quantidade: 4 },
  ],
  cto: [
    { codigo: '207', quantidade: 1 }, { codigo: '243', quantidade: 2 }, { codigo: '206', quantidade: 2 },
    { codigo: '424', quantidade: 2 }, { codigo: '1057', quantidade: 2 }, { codigo: '133', quantidade: 2 },
    { codigo: '551', quantidade: 2 }, { codigo: '802', quantidade: 4 }, { codigo: '688', quantidade: 1 },
  ],
}

const capacidadeParaCodigo: Record<number, string> = { 6: '1698', 12: '50', 24: '51', 36: '66', 72: '86', 144: '1725' }

export const quantidadePostesRetos = (dados: DadosSolicitacao) =>
  Math.max(0, dados.quantidadePostes - dados.quantidadePostesAngulo - dados.quantidadePostesCto)

const servicoUsaPostes = (dados: DadosSolicitacao) =>
  dados.tipoServico === 'troca-poste' ||
  dados.tipoServico === 'equipagem-poste' ||
  (dados.tipoServico === 'rompimento' && dados.modoRompimento === 'cabo')

const criarItem = (
  material: Material | undefined,
  quantidade: number,
  regra: string,
  unidade?: Unidade,
): ItemSolicitacao[] => {
  if (!material || quantidade <= 0) return []
  return [{
    id: `auto-${material.id}-${regra}`,
    materialId: material.id,
    nome: material.nome,
    codigo: material.codigo,
    categoria: material.categoria,
    quantidade,
    unidade: unidade ?? material.unidade,
    pendenteCadastro: material.pendenteCadastro,
    automatico: true,
    regras: [regra],
  }]
}

const aplicarComposicao = (tipo: keyof typeof composicoes, quantidade: number, regra: string) =>
  composicoes[tipo].flatMap((item) =>
    criarItem(materialPorCodigo(item.codigo), item.quantidade * quantidade, regra, item.unidade),
  )

const regrasPoste: RegraMaterial[] = [
  {
    id: 'RG-POSTE-RETO',
    nome: 'Ferragem dos postes retos restantes',
    descricao: 'Calcula postes retos como total de postes menos postes com curva e postes com CTO.',
    condicao: (dados) => servicoUsaPostes(dados) && quantidadePostesRetos(dados) > 0,
    acao: (dados) => aplicarComposicao('reto', quantidadePostesRetos(dados), 'RG-POSTE-RETO'),
  },
  {
    id: 'RG-POSTE-ANGULO',
    nome: 'Ferragem de postes com curva',
    descricao: 'Aplica a matriz de ângulo para a quantidade de postes com curva.',
    condicao: (dados) => servicoUsaPostes(dados) && dados.quantidadePostesAngulo > 0,
    acao: (dados) => aplicarComposicao('angulo', dados.quantidadePostesAngulo, 'RG-POSTE-ANGULO'),
  },
  {
    id: 'RG-POSTE-CTO',
    nome: 'Ferragem de postes com CTO',
    descricao: 'Aplica a matriz de CTO para a quantidade informada.',
    condicao: (dados) => servicoUsaPostes(dados) && dados.quantidadePostesCto > 0,
    acao: (dados) => aplicarComposicao('cto', dados.quantidadePostesCto, 'RG-POSTE-CTO'),
  },
  {
    id: 'RG-POSTE-RAQUETE',
    nome: 'Ferragem de raquetes',
    descricao: 'Aplica a matriz de raquete para a quantidade informada.',
    condicao: (dados) => servicoUsaPostes(dados) && dados.quantidadeRaquetes > 0,
    acao: (dados) => aplicarComposicao('raquete', dados.quantidadeRaquetes, 'RG-POSTE-RAQUETE'),
  },
]

export const regrasMateriais: RegraMaterial[] = [
  ...regrasPoste,
  {
    id: 'RG-CABO-AFETADO',
    nome: 'Cabos selecionados',
    descricao: 'Inclui cada linha de cabo com a metragem própria, inclusive capacidades repetidas.',
    condicao: (dados) =>
      dados.cabos.length > 0 &&
      (dados.tipoServico === 'troca-poste' ||
        dados.tipoServico === 'equipagem-poste' ||
        (dados.tipoServico === 'rompimento' && dados.modoRompimento === 'cabo')),
    acao: (dados) => dados.cabos.flatMap((cabo) =>
      criarItem(materialPorCodigo(capacidadeParaCodigo[cabo.capacidade]), cabo.metragem, `RG-CABO-AFETADO-${cabo.id}`, 'm'),
    ),
  },
  {
    id: 'RG-KIT-PENDENTE',
    nome: 'Kits indicados no fluxo',
    descricao: 'Inclui um registro pendente por kit selecionado, pois o diagrama não informa código corporativo.',
    condicao: (dados) => dados.modoRompimento === 'kit' && dados.kits.length > 0,
    acao: (dados) => dados.kits.flatMap((capacidade) =>
      criarItem(materialPorId(`kit-${capacidade}-pendente`), 1, 'RG-KIT-PENDENTE', 'kit'),
    ),
  },
  {
    id: 'RG-CAIXA-COMPLETA',
    nome: 'Troca de caixa completa',
    descricao: 'Inclui a caixa correspondente quando a troca completa foi confirmada.',
    condicao: (dados) =>
      dados.tipoServico === 'caixa-danificada' && dados.trocarCaixaCompleta === true && dados.quantidadeCaixas > 0,
    acao: (dados) => {
      const codigo = dados.tipoCaixa === 'ceo' ? '103' : dados.tipoCaixa === 'cto-predial' ? '2258' : '1066'
      return criarItem(materialPorCodigo(codigo), dados.quantidadeCaixas, 'RG-CAIXA-COMPLETA')
    },
  },
  {
    id: 'RG-SPLITTER',
    nome: 'Troca apenas do splitter',
    descricao: 'Inclui o splitter de 1x8 ou 1x16 informado para a caixa danificada.',
    condicao: (dados) =>
      dados.tipoServico === 'caixa-danificada' && dados.trocarCaixaCompleta === false &&
      dados.trocarSomenteSplitter === true && dados.splittagem !== '' && dados.quantidadeCaixas > 0,
    acao: (dados) => criarItem(
      materialPorCodigo(dados.splittagem === '1x8' ? '1758' : '204'), dados.quantidadeCaixas, 'RG-SPLITTER',
    ),
  },
  {
    id: 'RG-AVULSA-CAIXA',
    nome: 'Caixa em solicitação avulsa',
    descricao: 'Inclui CEO ou CTO de acordo com a escolha do usuário.',
    condicao: (dados) => dados.tipoServico === 'avulsa' && dados.tipoCaixaAvulsa !== '' && dados.quantidadeCaixasAvulsas > 0,
    acao: (dados) => criarItem(
      materialPorCodigo(dados.tipoCaixaAvulsa === 'ceo' ? '103' : '1066'),
      dados.quantidadeCaixasAvulsas,
      'RG-AVULSA-CAIXA',
    ),
  },
  {
    id: 'RG-AVULSA-SPLITTER-1X8',
    nome: 'Splitter 1x8 em solicitação avulsa',
    descricao: 'Inclui a quantidade indicada de splitters 1x8 para CTO.',
    condicao: (dados) => dados.tipoServico === 'avulsa' && dados.tipoCaixaAvulsa === 'cto' && dados.quantidadeSplitter1x8 > 0,
    acao: (dados) => criarItem(materialPorCodigo('1758'), dados.quantidadeSplitter1x8, 'RG-AVULSA-SPLITTER-1X8'),
  },
  {
    id: 'RG-AVULSA-SPLITTER-1X16',
    nome: 'Splitter 1x16 em solicitação avulsa',
    descricao: 'Inclui a quantidade indicada de splitters 1x16 para CTO.',
    condicao: (dados) => dados.tipoServico === 'avulsa' && dados.tipoCaixaAvulsa === 'cto' && dados.quantidadeSplitter1x16 > 0,
    acao: (dados) => criarItem(materialPorCodigo('204'), dados.quantidadeSplitter1x16, 'RG-AVULSA-SPLITTER-1X16'),
  },
]

export const calcularMateriaisAutomaticos = (dados: DadosSolicitacao): ItemSolicitacao[] => {
  const itens = regrasMateriais.filter((regra) => regra.condicao(dados)).flatMap((regra) => regra.acao(dados))
  const agrupados = new Map<string, ItemSolicitacao>()
  for (const item of itens) {
    const preservarLinha = item.regras[0].startsWith('RG-CABO-AFETADO-')
    const chave = preservarLinha ? item.id : item.materialId
    const existente = agrupados.get(chave)
    if (existente) {
      existente.quantidade += item.quantidade
      existente.regras = [...new Set([...existente.regras, ...item.regras])]
    } else {
      agrupados.set(chave, { ...item })
    }
  }
  return [...agrupados.values()]
}
