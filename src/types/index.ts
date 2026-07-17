export type Unidade = 'und' | 'm' | 'kit'

export type OrigemDado = {
  arquivo: string
  aba: string
  linha?: number
}

export type Material = {
  id: string
  nome: string
  codigo: string | null
  categoria: string
  subcategoria?: string
  unidade: Unidade
  pendenteCadastro: boolean
  origem?: OrigemDado
}

export type TipoServico =
  | 'rompimento'
  | 'troca-poste'
  | 'equipagem-poste'
  | 'caixa-danificada'
  | 'avulsa'

export type CapacidadeFibra = 6 | 12 | 24 | 36 | 72 | 144

export type TipoCaixa = 'cto-predial' | 'cto-poste' | 'ceo'

export type ModoRompimento = 'cabo' | 'kit' | ''

export type CaboSolicitado = {
  id: string
  capacidade: CapacidadeFibra
  metragem: number
}

export type DadosSolicitacao = {
  equipeRetirada: string
  dataRetirada: string
  os: string
  protocolo: string
  tipoServico: TipoServico
  modoRompimento: ModoRompimento
  kits: CapacidadeFibra[]
  cabos: CaboSolicitado[]
  quantidadePostes: number
  quantidadeRaquetes: number
  quantidadePostesAngulo: number
  quantidadePostesCto: number
  quantidadePostesComDrop: number
  tipoCaixa: TipoCaixa | ''
  trocarCaixaCompleta: boolean | null
  trocarSomenteSplitter: boolean | null
  splittagem: '1x8' | '1x16' | ''
  splittagemCtoPredial: '1x8' | '1x16' | ''
  quantidadeCaixas: number
  tipoCaixaAvulsa: 'ceo' | 'cto-predial' | 'cto-poste' | 'adesivos-cto-poste' | ''
  quantidadeCaixasAvulsas: number
  splittagemCtoPredialAvulsa: '1x8' | '1x16' | ''
  configuracaoCtoPosteAvulsa: '1x8' | '2x1x8' | '1x16' | ''
  quantidadeAdesivoInternoCtoPoste: number
  quantidadeAdesivoExternoCtoPoste: number
}

export type ItemSolicitacao = {
  id: string
  materialId: string
  nome: string
  codigo: string | null
  categoria: string
  quantidade: number
  unidade: Unidade
  pendenteCadastro: boolean
  automatico: boolean
  regras: string[]
}

export type RegraMaterial = {
  id: string
  nome: string
  descricao: string
  condicao: (dados: DadosSolicitacao) => boolean
  acao: (dados: DadosSolicitacao) => ItemSolicitacao[]
}

export type ResultadoValidacao = {
  erros: string[]
  avisos: string[]
}
