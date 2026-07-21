import type { DadosSolicitacao } from '../types'

export const criarDadosIniciais = (): DadosSolicitacao => {
  const hoje = new Date().toISOString().slice(0, 10)

  return {
    equipeRetirada: '',
    dataRetirada: hoje,
    os: '',
    protocolo: '',
    tipoServico: 'rompimento',
    modoRompimento: '',
    kits: [],
    quantidadeAlcasPorKit: { 24: 0, 36: 0, 72: 0, 144: 0 },
    cabos: [],
    quantidadePostes: 0,
    quantidadeRaquetes: 0,
    quantidadePostesAngulo: 0,
    quantidadePostesCto: 0,
    tipoCaixa: '',
    trocarCaixaCompleta: null,
    trocarSomenteSplitter: null,
    splittagem: '',
    splittagemCtoPredial: '',
    quantidadeCaixas: 1,
    tipoCaixaAvulsa: '',
    quantidadeCaixasAvulsas: 1,
    splittagemCtoPredialAvulsa: '',
    configuracaoCtoPosteAvulsa: '',
    quantidadeAdesivoInternoCtoPoste: 0,
    quantidadeAdesivoExternoCtoPoste: 0,
  }
}
