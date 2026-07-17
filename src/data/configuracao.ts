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
    cabos: [],
    quantidadePostes: 0,
    quantidadeRaquetes: 0,
    quantidadePostesAngulo: 0,
    quantidadePostesCto: 0,
    quantidadePostesComDrop: 0,
    tipoCaixa: '',
    trocarCaixaCompleta: null,
    trocarSomenteSplitter: null,
    splittagem: '',
    quantidadeCaixas: 1,
    tipoCaixaAvulsa: '',
    quantidadeCaixasAvulsas: 1,
    quantidadeSplitter1x8: 0,
    quantidadeSplitter1x16: 0,
  }
}
