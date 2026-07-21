import { materialPorCodigo } from '../data/materiais'
import type { CapacidadeFibra, CapacidadeKit, DadosSolicitacao, ItemSolicitacao, Material, RegraMaterial, Unidade } from '../types'

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
    { codigo: '424', quantidade: 1 }, { codigo: '802', quantidade: 2 },
  ],
  cto: [
    { codigo: '207', quantidade: 1 }, { codigo: '243', quantidade: 2 }, { codigo: '206', quantidade: 2 },
    { codigo: '424', quantidade: 2 }, { codigo: '133', quantidade: 2 }, { codigo: '551', quantidade: 2 },
    { codigo: '802', quantidade: 2 }, { codigo: '688', quantidade: 1 },
  ],
}

const capacidadeParaCodigo: Record<CapacidadeFibra, string> = { 6: '1698', 12: '50', 24: '51', 36: '66', 72: '86', 144: '1725' }
const capacidadeParaCodigoAlca: Record<CapacidadeFibra, string> = { 6: '1057', 12: '1057', 24: '1763', 36: '1763', 72: '67', 144: '1720' }
const capacidadeParaCodigoKit: Record<CapacidadeKit, string> = { 24: '2292', 36: '2293', 72: '2294', 144: '2295' }
const limitePorPosteParaMateriaisComuns: Record<string, number> = { '207': 1, '243': 2, '206': 2, '424': 2, '802': 2 }

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
    id: 'RG-KIT-ROMPIMENTO',
    nome: 'Kits para rompimento',
    descricao: 'Inclui o kit cadastrado correspondente a cada capacidade selecionada.',
    condicao: (dados) => dados.modoRompimento === 'kit' && dados.kits.length > 0,
    acao: (dados) => dados.kits.flatMap((capacidade) =>
      criarItem(materialPorCodigo(capacidadeParaCodigoKit[capacidade]), 1, 'RG-KIT-ROMPIMENTO', 'kit'),
    ),
  },
  {
    id: 'RG-ALCA-POR-CABO',
    nome: 'Alças conforme o cabo selecionado',
    descricao: 'Inclui a quantidade informada de alças, usando o código correspondente a cada linha de cabo.',
    condicao: (dados) =>
      servicoUsaPostes(dados) &&
      dados.cabos.some((cabo) => cabo.quantidadeAlcasPlaquetas > 0),
    acao: (dados) =>
      dados.cabos.flatMap((cabo) =>
        criarItem(
          materialPorCodigo(capacidadeParaCodigoAlca[cabo.capacidade]),
          cabo.quantidadeAlcasPlaquetas,
          `RG-ALCA-POR-CABO-${cabo.id}`,
          'und',
        ),
      ),
  },
  {
    id: 'RG-PLAQUETA-POR-CABO',
    nome: 'Plaquetas conforme o cabo selecionado',
    descricao: 'Inclui a quantidade informada de plaquetas de identificação amarela por linha de cabo.',
    condicao: (dados) =>
      servicoUsaPostes(dados) &&
      dados.cabos.some((cabo) => cabo.quantidadeAlcasPlaquetas > 0),
    acao: (dados) =>
      dados.cabos.flatMap((cabo) =>
        criarItem(
          materialPorCodigo('184'),
          cabo.quantidadeAlcasPlaquetas,
          `RG-PLAQUETA-POR-CABO-${cabo.id}`,
          'und',
        ),
      ),
  },
  {
    id: 'RG-CTO-PREDIAL-SPLITTER-BOX',
    nome: 'Splitter box da CTO de prédio',
    descricao: 'Inclui a splitter box 1x8 ou 1x16 escolhida para cada CTO de prédio.',
    condicao: (dados) =>
      dados.tipoServico === 'caixa-danificada' && dados.tipoCaixa === 'cto-predial' &&
      dados.splittagemCtoPredial !== '' && dados.quantidadeCaixas > 0,
    acao: (dados) => criarItem(
      materialPorCodigo(dados.splittagemCtoPredial === '1x8' ? '1643' : '2029'),
      dados.quantidadeCaixas,
      'RG-CTO-PREDIAL-SPLITTER-BOX',
    ),
  },
  {
    id: 'RG-CTO-PREDIAL-ADESIVO',
    nome: 'Adesivo da CTO de prédio',
    descricao: 'Inclui um adesivo para cada CTO de prédio solicitada.',
    condicao: (dados) =>
      dados.tipoServico === 'caixa-danificada' && dados.tipoCaixa === 'cto-predial' &&
      dados.quantidadeCaixas > 0,
    acao: (dados) => criarItem(
      materialPorCodigo('1760'), dados.quantidadeCaixas, 'RG-CTO-PREDIAL-ADESIVO',
    ),
  },
  {
    id: 'RG-CAIXA-COMPLETA',
    nome: 'Troca de caixa completa',
    descricao: 'Inclui a caixa correspondente quando a troca completa foi confirmada.',
    condicao: (dados) =>
      dados.tipoServico === 'caixa-danificada' &&
      (dados.tipoCaixa === 'cto-poste' || dados.tipoCaixa === 'ceo') &&
      dados.trocarCaixaCompleta === true && dados.quantidadeCaixas > 0,
    acao: (dados) => {
      const codigo = dados.tipoCaixa === 'ceo' ? '103' : '1066'
      return criarItem(materialPorCodigo(codigo), dados.quantidadeCaixas, 'RG-CAIXA-COMPLETA')
    },
  },
  {
    id: 'RG-CTO-POSTE-ADESIVO-INTERNO',
    nome: 'Adesivo interno da CTO de poste completa',
    descricao: 'Inclui um adesivo interno para cada CTO de poste completa.',
    condicao: (dados) =>
      dados.tipoServico === 'caixa-danificada' && dados.tipoCaixa === 'cto-poste' &&
      dados.trocarCaixaCompleta === true && dados.quantidadeCaixas > 0,
    acao: (dados) => criarItem(
      materialPorCodigo('1756'), dados.quantidadeCaixas, 'RG-CTO-POSTE-ADESIVO-INTERNO',
    ),
  },
  {
    id: 'RG-CTO-POSTE-ADESIVO-EXTERNO',
    nome: 'Adesivo externo da CTO de poste completa',
    descricao: 'Inclui um adesivo externo para cada CTO de poste completa.',
    condicao: (dados) =>
      dados.tipoServico === 'caixa-danificada' && dados.tipoCaixa === 'cto-poste' &&
      dados.trocarCaixaCompleta === true && dados.quantidadeCaixas > 0,
    acao: (dados) => criarItem(
      materialPorCodigo('1682'), dados.quantidadeCaixas, 'RG-CTO-POSTE-ADESIVO-EXTERNO',
    ),
  },
  {
    id: 'RG-SPLITTER',
    nome: 'Troca apenas do splitter',
    descricao: 'Inclui o splitter de 1x8 ou 1x16 informado para a caixa danificada.',
    condicao: (dados) =>
      dados.tipoServico === 'caixa-danificada' &&
      (dados.tipoCaixa === 'cto-poste' || dados.tipoCaixa === 'ceo') &&
      dados.trocarCaixaCompleta === false &&
      dados.trocarSomenteSplitter === true && dados.splittagem !== '' && dados.quantidadeCaixas > 0,
    acao: (dados) => {
      const codigo = dados.tipoCaixa === 'cto-poste'
        ? dados.splittagem === '1x8' ? '1575' : '713'
        : dados.splittagem === '1x8' ? '1758' : '204'
      return criarItem(materialPorCodigo(codigo), dados.quantidadeCaixas, 'RG-SPLITTER')
    },
  },
  {
    id: 'RG-AVULSA-CAIXA',
    nome: 'Caixa em solicitação avulsa',
    descricao: 'Inclui CEO ou o gabinete de CTO de poste adequado à configuração escolhida.',
    condicao: (dados) =>
      dados.tipoServico === 'avulsa' &&
      (dados.tipoCaixaAvulsa === 'ceo' ||
        (dados.tipoCaixaAvulsa === 'cto-poste' && dados.configuracaoCtoPosteAvulsa !== '')) &&
      dados.quantidadeCaixasAvulsas > 0,
    acao: (dados) => {
      const codigo = dados.tipoCaixaAvulsa === 'ceo'
        ? '103'
        : dados.configuracaoCtoPosteAvulsa === '1x16' ? '700' : '1066'
      return criarItem(
        materialPorCodigo(codigo), dados.quantidadeCaixasAvulsas, 'RG-AVULSA-CAIXA',
      )
    },
  },
  {
    id: 'RG-AVULSA-CTO-PREDIAL-SPLITTER-BOX',
    nome: 'Splitter box de CTO de prédio avulsa',
    descricao: 'Inclui a splitter box escolhida na mesma quantidade das CTOs de prédio.',
    condicao: (dados) =>
      dados.tipoServico === 'avulsa' && dados.tipoCaixaAvulsa === 'cto-predial' &&
      dados.splittagemCtoPredialAvulsa !== '' && dados.quantidadeCaixasAvulsas > 0,
    acao: (dados) => criarItem(
      materialPorCodigo(dados.splittagemCtoPredialAvulsa === '1x8' ? '1643' : '2029'),
      dados.quantidadeCaixasAvulsas,
      'RG-AVULSA-CTO-PREDIAL-SPLITTER-BOX',
    ),
  },
  {
    id: 'RG-AVULSA-CTO-PREDIAL-ADESIVO',
    nome: 'Adesivo de CTO de prédio avulsa',
    descricao: 'Inclui um adesivo para cada CTO de prédio solicitada.',
    condicao: (dados) =>
      dados.tipoServico === 'avulsa' && dados.tipoCaixaAvulsa === 'cto-predial' &&
      dados.quantidadeCaixasAvulsas > 0,
    acao: (dados) => criarItem(
      materialPorCodigo('1760'), dados.quantidadeCaixasAvulsas, 'RG-AVULSA-CTO-PREDIAL-ADESIVO',
    ),
  },
  {
    id: 'RG-AVULSA-CTO-POSTE-ADESIVO-INTERNO',
    nome: 'Adesivo interno de CTO de poste',
    descricao: 'Inclui um adesivo interno para cada CTO de poste solicitada.',
    condicao: (dados) =>
      dados.tipoServico === 'avulsa' && dados.tipoCaixaAvulsa === 'cto-poste' &&
      dados.configuracaoCtoPosteAvulsa !== '' && dados.quantidadeCaixasAvulsas > 0,
    acao: (dados) => criarItem(
      materialPorCodigo('1756'), dados.quantidadeCaixasAvulsas, 'RG-AVULSA-CTO-POSTE-ADESIVO-INTERNO',
    ),
  },
  {
    id: 'RG-AVULSA-CTO-POSTE-ADESIVO-EXTERNO',
    nome: 'Adesivo externo de CTO de poste',
    descricao: 'Inclui um adesivo externo para cada CTO de poste solicitada.',
    condicao: (dados) =>
      dados.tipoServico === 'avulsa' && dados.tipoCaixaAvulsa === 'cto-poste' &&
      dados.configuracaoCtoPosteAvulsa !== '' && dados.quantidadeCaixasAvulsas > 0,
    acao: (dados) => criarItem(
      materialPorCodigo('1682'), dados.quantidadeCaixasAvulsas, 'RG-AVULSA-CTO-POSTE-ADESIVO-EXTERNO',
    ),
  },
  {
    id: 'RG-AVULSA-CTO-POSTE-SPLITTER-EXTRA-1X8',
    nome: 'Segundo splitter 1x8 de CTO de poste avulsa',
    descricao: 'Inclui um splitter 1x8 separado por CTO quando a montagem com dois splitters foi escolhida.',
    condicao: (dados) =>
      dados.tipoServico === 'avulsa' && dados.tipoCaixaAvulsa === 'cto-poste' &&
      dados.configuracaoCtoPosteAvulsa === '2x1x8' && dados.quantidadeCaixasAvulsas > 0,
    acao: (dados) => criarItem(
      materialPorCodigo('1575'), dados.quantidadeCaixasAvulsas, 'RG-AVULSA-CTO-POSTE-SPLITTER-EXTRA-1X8',
    ),
  },
  {
    id: 'RG-AVULSA-CTO-POSTE-SPLITTER-1X16',
    nome: 'Splitter 1x16 de CTO de poste avulsa',
    descricao: 'Inclui um splitter 1x16 separado por gabinete desmontado.',
    condicao: (dados) =>
      dados.tipoServico === 'avulsa' && dados.tipoCaixaAvulsa === 'cto-poste' &&
      dados.configuracaoCtoPosteAvulsa === '1x16' && dados.quantidadeCaixasAvulsas > 0,
    acao: (dados) => criarItem(
      materialPorCodigo('713'), dados.quantidadeCaixasAvulsas, 'RG-AVULSA-CTO-POSTE-SPLITTER-1X16',
    ),
  },
  {
    id: 'RG-AVULSA-ADESIVO-INTERNO',
    nome: 'Adesivo interno avulso para CTO de poste',
    descricao: 'Inclui somente a quantidade de adesivos internos informada.',
    condicao: (dados) =>
      dados.tipoServico === 'avulsa' && dados.tipoCaixaAvulsa === 'adesivos-cto-poste' &&
      dados.quantidadeAdesivoInternoCtoPoste > 0,
    acao: (dados) => criarItem(
      materialPorCodigo('1756'), dados.quantidadeAdesivoInternoCtoPoste, 'RG-AVULSA-ADESIVO-INTERNO',
    ),
  },
  {
    id: 'RG-AVULSA-ADESIVO-EXTERNO',
    nome: 'Adesivo externo avulso para CTO de poste',
    descricao: 'Inclui somente a quantidade de adesivos externos informada.',
    condicao: (dados) =>
      dados.tipoServico === 'avulsa' && dados.tipoCaixaAvulsa === 'adesivos-cto-poste' &&
      dados.quantidadeAdesivoExternoCtoPoste > 0,
    acao: (dados) => criarItem(
      materialPorCodigo('1682'), dados.quantidadeAdesivoExternoCtoPoste, 'RG-AVULSA-ADESIVO-EXTERNO',
    ),
  },
]

export const calcularMateriaisAutomaticos = (dados: DadosSolicitacao): ItemSolicitacao[] => {
  const itens = regrasMateriais.filter((regra) => regra.condicao(dados)).flatMap((regra) => regra.acao(dados))
  const agrupados = new Map<string, ItemSolicitacao>()
  for (const item of itens) {
    const preservarLinha =
      item.regras[0].startsWith('RG-CABO-AFETADO-') ||
      item.regras[0].startsWith('RG-ALCA-POR-CABO-')
    const chave = preservarLinha ? item.id : item.materialId
    const existente = agrupados.get(chave)
    if (existente) {
      existente.quantidade += item.quantidade
      existente.regras = [...new Set([...existente.regras, ...item.regras])]
    } else {
      agrupados.set(chave, { ...item })
    }
  }
  return [...agrupados.values()].map((item) => {
    if (!item.codigo || !limitePorPosteParaMateriaisComuns[item.codigo]) return item

    const quantidadeDaRaquete = (composicoes.raquete.find((material) => material.codigo === item.codigo)?.quantidade ?? 0) * dados.quantidadeRaquetes
    const limiteDosPostes = limitePorPosteParaMateriaisComuns[item.codigo] * dados.quantidadePostes
    const quantidadeDosPostes = Math.max(0, item.quantidade - quantidadeDaRaquete)

    return {
      ...item,
      quantidade: quantidadeDaRaquete + Math.min(quantidadeDosPostes, limiteDosPostes),
    }
  })
}
