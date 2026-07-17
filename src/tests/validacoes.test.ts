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

  it('exige splitter quando CTO é solicitada de forma avulsa', () => {
    const dados = {
      ...criarDadosIniciais(),
      equipeRetirada: 'ATELECOM',
      os: 'OS-12345',
      protocolo: 'PROTO-67890',
      tipoServico: 'avulsa' as const,
      tipoCaixaAvulsa: 'cto' as const,
    }
    const resultado = validarSolicitacao(dados)

    expect(resultado.erros).toContain('Informe a quantidade de pelo menos um splitter para a CTO.')
  })
})
