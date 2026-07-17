import { describe, expect, it } from 'vitest'
import { criarDadosIniciais } from '../data/configuracao'
import { validarSolicitacao } from '../services/validacoes'

const dadosValidos = () => ({
  ...criarDadosIniciais(),
  equipeRetirada: 'ATELECOM',
  os: 'OS-12345',
  protocolo: 'PROTO-67890',
  modoRompimento: 'cabo' as const,
  cabos: [{ id: 'trecho-1', capacidade: 6 as const, metragem: 100 }],
})

describe('validação da solicitação', () => {
  it('exige somente os dados operacionais mínimos', () => {
    const resultado = validarSolicitacao(criarDadosIniciais())

    expect(resultado.erros).toEqual(expect.arrayContaining([
      'Informe a equipe que irá retirar o material.',
      'Informe a OS.',
      'Informe o protocolo.',
    ]))
    expect(resultado.erros).not.toEqual(expect.arrayContaining(['Informe a cidade de atendimento.']))
  })

  it('rejeita cabo sem metragem', () => {
    const dados = dadosValidos()
    dados.cabos[0].metragem = 0
    const resultado = validarSolicitacao(dados)

    expect(resultado.erros).toContain('Informe uma metragem maior que zero para o cabo de 6 fibras.')
  })

  it('não permite drops acima do total de postes', () => {
    const dados = dadosValidos()
    dados.quantidadePostes = 12
    dados.quantidadePostesComDrop = 13
    const resultado = validarSolicitacao(dados)

    expect(resultado.erros).toContain('A quantidade de postes com drop de cliente não pode ser maior que o total de postes a equipar.')
  })

  it('permite gerar um rompimento com os dados mínimos', () => {
    expect(validarSolicitacao(dadosValidos()).erros).toEqual([])
  })

  it('exige splitter quando CTO de poste é solicitada de forma avulsa', () => {
    const dados = {
      ...criarDadosIniciais(),
      equipeRetirada: 'ATELECOM',
      os: 'OS-12345',
      protocolo: 'PROTO-67890',
      tipoServico: 'avulsa' as const,
      tipoCaixaAvulsa: 'cto-poste' as const,
    }
    const resultado = validarSolicitacao(dados)

    expect(resultado.erros).toContain('Informe a quantidade de pelo menos um splitter para a CTO de poste.')
  })

  it('exige somente a splittagem específica para CTO de prédio', () => {
    const dados = {
      ...criarDadosIniciais(),
      equipeRetirada: 'ATELECOM',
      os: 'OS-12345',
      protocolo: 'PROTO-67890',
      tipoServico: 'caixa-danificada' as const,
      tipoCaixa: 'cto-predial' as const,
      quantidadeCaixas: 2,
    }

    const incompleta = validarSolicitacao(dados)
    expect(incompleta.erros).toContain('Selecione o splitter 1x8 ou 1x16 para a CTO de prédio.')
    expect(incompleta.erros).not.toContain('Informe se a troca será da caixa completa.')
    expect(incompleta.erros).not.toContain('Informe se será realizada apenas a troca do splitter.')

    expect(validarSolicitacao({ ...dados, splittagemCtoPredial: '1x16' }).erros).toEqual([])
  })

  it('exige a splittagem para CTO de prédio avulsa', () => {
    const dados = {
      ...criarDadosIniciais(),
      equipeRetirada: 'ATELECOM',
      os: 'OS-12345',
      protocolo: 'PROTO-67890',
      tipoServico: 'avulsa' as const,
      tipoCaixaAvulsa: 'cto-predial' as const,
      quantidadeCaixasAvulsas: 2,
    }

    expect(validarSolicitacao(dados).erros).toContain(
      'Selecione o splitter 1x8 ou 1x16 para a CTO de prédio avulsa.',
    )
    expect(validarSolicitacao({ ...dados, splittagemCtoPredialAvulsa: '1x8' }).erros).toEqual([])
  })

  it('permite solicitar apenas um dos adesivos para CTO de poste', () => {
    const dados = {
      ...criarDadosIniciais(),
      equipeRetirada: 'ATELECOM',
      os: 'OS-12345',
      protocolo: 'PROTO-67890',
      tipoServico: 'avulsa' as const,
      tipoCaixaAvulsa: 'adesivos-cto-poste' as const,
    }

    expect(validarSolicitacao(dados).erros).toContain(
      'Informe a quantidade de pelo menos um adesivo interno ou externo para CTO de poste.',
    )
    expect(validarSolicitacao({ ...dados, quantidadeAdesivoExternoCtoPoste: 4 }).erros).toEqual([])
  })
})
