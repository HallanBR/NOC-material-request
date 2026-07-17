import { describe, expect, it } from 'vitest'
import { criarDadosIniciais } from '../data/configuracao'
import { calcularMateriaisAutomaticos, quantidadePostesRetos } from '../rules/regrasMateriais'

describe('regras de materiais', () => {
  it('calcula postes retos pelo saldo do total após curvas e CTOs', () => {
    const dados = criarDadosIniciais()
    dados.tipoServico = 'equipagem-poste'
    dados.quantidadePostes = 12
    dados.quantidadePostesAngulo = 3
    dados.quantidadePostesCto = 2

    const itens = calcularMateriaisAutomaticos(dados)

    expect(quantidadePostesRetos(dados)).toBe(7)
    expect(itens.find((item) => item.codigo === '219')?.quantidade).toBe(7)
  })

  it('aplica a composição de CTO somente aos postes com CTO', () => {
    const dados = criarDadosIniciais()
    dados.tipoServico = 'equipagem-poste'
    dados.quantidadePostes = 12
    dados.quantidadePostesCto = 3

    const itens = calcularMateriaisAutomaticos(dados)

    expect(itens.find((item) => item.codigo === '133')?.quantidade).toBe(6)
    expect(itens.find((item) => item.codigo === '688')?.quantidade).toBe(3)
  })

  it('mantém linhas repetidas para o mesmo tipo de cabo', () => {
    const dados = criarDadosIniciais()
    dados.modoRompimento = 'cabo'
    dados.cabos = [
      { id: 'trecho-a', capacidade: 6, metragem: 250 },
      { id: 'trecho-b', capacidade: 6, metragem: 180 },
    ]

    const itens = calcularMateriaisAutomaticos(dados).filter((item) => item.codigo === '1698')

    expect(itens.map((item) => item.quantidade)).toEqual([250, 180])
  })

  it('mantém kits como pendentes quando o código não existe na fonte', () => {
    const dados = criarDadosIniciais()
    dados.modoRompimento = 'kit'
    dados.kits = [6]

    const kit = calcularMateriaisAutomaticos(dados).find((item) => item.materialId === 'kit-6-pendente')

    expect(kit).toMatchObject({ codigo: null, pendenteCadastro: true, quantidade: 1, unidade: 'kit' })
  })

  it('não duplica a ferragem de poste quando há drop de cliente', () => {
    const dados = criarDadosIniciais()
    dados.tipoServico = 'equipagem-poste'
    dados.quantidadePostes = 12
    dados.quantidadePostesComDrop = 2

    const itens = calcularMateriaisAutomaticos(dados)

    expect(itens.find((item) => item.codigo === '802')?.quantidade).toBe(24)
    expect(itens.find((item) => item.codigo === '133')).toBeUndefined()
  })
  it('calcula 32 aneis para 12 postes, sendo 3 curvas e 1 CTO, mesmo com drop nos 12', () => {
    const dados = criarDadosIniciais()
    dados.tipoServico = 'equipagem-poste'
    dados.quantidadePostes = 12
    dados.quantidadePostesAngulo = 3
    dados.quantidadePostesCto = 1
    dados.quantidadePostesComDrop = 12

    const itens = calcularMateriaisAutomaticos(dados)

    expect(itens.find((item) => item.codigo === '802')?.quantidade).toBe(32)
  })

  it('inclui a splitter box escolhida e um adesivo por CTO de prédio', () => {
    for (const [splittagem, codigo] of [['1x8', '1643'], ['1x16', '2029']] as const) {
      const dados = criarDadosIniciais()
      dados.tipoServico = 'caixa-danificada'
      dados.tipoCaixa = 'cto-predial'
      dados.quantidadeCaixas = 3
      dados.splittagemCtoPredial = splittagem

      const itens = calcularMateriaisAutomaticos(dados)

      expect(itens.find((item) => item.codigo === codigo)?.quantidade).toBe(3)
      expect(itens.find((item) => item.codigo === '1760')?.quantidade).toBe(3)
      expect(itens.find((item) => item.codigo === '2258')).toBeUndefined()
      expect(itens.find((item) => item.codigo === '1758')).toBeUndefined()
      expect(itens.find((item) => item.codigo === '204')).toBeUndefined()
    }
  })

  it('aplica a lógica predial também à CTO de prédio avulsa', () => {
    const dados = criarDadosIniciais()
    dados.tipoServico = 'avulsa'
    dados.tipoCaixaAvulsa = 'cto-predial'
    dados.quantidadeCaixasAvulsas = 2
    dados.splittagemCtoPredialAvulsa = '1x16'

    const itens = calcularMateriaisAutomaticos(dados)

    expect(itens.find((item) => item.codigo === '2029')?.quantidade).toBe(2)
    expect(itens.find((item) => item.codigo === '1760')?.quantidade).toBe(2)
    expect(itens.find((item) => item.codigo === '1066')).toBeUndefined()
  })

  it('usa a CTO já montada quando a configuração padrão tem um splitter 1x8', () => {
    const dados = criarDadosIniciais()
    dados.tipoServico = 'avulsa'
    dados.tipoCaixaAvulsa = 'cto-poste'
    dados.quantidadeCaixasAvulsas = 3
    dados.configuracaoCtoPosteAvulsa = '1x8'

    const itens = calcularMateriaisAutomaticos(dados)

    expect(itens.find((item) => item.codigo === '1066')?.quantidade).toBe(3)
    expect(itens.find((item) => item.codigo === '700')).toBeUndefined()
    expect(itens.find((item) => item.codigo === '1575')).toBeUndefined()
    expect(itens.find((item) => item.codigo === '713')).toBeUndefined()
    expect(itens.find((item) => item.codigo === '1756')?.quantidade).toBe(3)
    expect(itens.find((item) => item.codigo === '1682')?.quantidade).toBe(3)
  })

  it('adiciona um splitter 1x8 separado por CTO quando são escolhidos dois splitters', () => {
    const dados = criarDadosIniciais()
    dados.tipoServico = 'avulsa'
    dados.tipoCaixaAvulsa = 'cto-poste'
    dados.quantidadeCaixasAvulsas = 2
    dados.configuracaoCtoPosteAvulsa = '2x1x8'

    const itens = calcularMateriaisAutomaticos(dados)

    expect(itens.find((item) => item.codigo === '1066')?.quantidade).toBe(2)
    expect(itens.find((item) => item.codigo === '1575')?.quantidade).toBe(2)
    expect(itens.find((item) => item.codigo === '700')).toBeUndefined()
    expect(itens.find((item) => item.codigo === '713')).toBeUndefined()
  })

  it('usa gabinete desmontado e splitter separado para CTO de poste 1x16', () => {
    const dados = criarDadosIniciais()
    dados.tipoServico = 'avulsa'
    dados.tipoCaixaAvulsa = 'cto-poste'
    dados.quantidadeCaixasAvulsas = 2
    dados.configuracaoCtoPosteAvulsa = '1x16'

    const itens = calcularMateriaisAutomaticos(dados)

    expect(itens.find((item) => item.codigo === '700')?.quantidade).toBe(2)
    expect(itens.find((item) => item.codigo === '713')?.quantidade).toBe(2)
    expect(itens.find((item) => item.codigo === '1066')).toBeUndefined()
    expect(itens.find((item) => item.codigo === '1575')).toBeUndefined()
    expect(itens.find((item) => item.codigo === '1756')?.quantidade).toBe(2)
    expect(itens.find((item) => item.codigo === '1682')?.quantidade).toBe(2)
  })

  it('permite solicitar somente um tipo de adesivo para CTO de poste', () => {
    const dados = criarDadosIniciais()
    dados.tipoServico = 'avulsa'
    dados.tipoCaixaAvulsa = 'adesivos-cto-poste'
    dados.quantidadeAdesivoExternoCtoPoste = 5

    const itens = calcularMateriaisAutomaticos(dados)

    expect(itens.find((item) => item.codigo === '1682')?.quantidade).toBe(5)
    expect(itens.find((item) => item.codigo === '1756')).toBeUndefined()
    expect(itens.find((item) => item.codigo === '1066')).toBeUndefined()
  })

  it('inclui adesivos na CTO de poste completa e usa splitter conectorizado na troca', () => {
    const caixaCompleta = criarDadosIniciais()
    caixaCompleta.tipoServico = 'caixa-danificada'
    caixaCompleta.tipoCaixa = 'cto-poste'
    caixaCompleta.trocarCaixaCompleta = true
    caixaCompleta.quantidadeCaixas = 2

    const itensCaixaCompleta = calcularMateriaisAutomaticos(caixaCompleta)
    expect(itensCaixaCompleta.find((item) => item.codigo === '1066')?.quantidade).toBe(2)
    expect(itensCaixaCompleta.find((item) => item.codigo === '1756')?.quantidade).toBe(2)
    expect(itensCaixaCompleta.find((item) => item.codigo === '1682')?.quantidade).toBe(2)

    const somenteSplitter = criarDadosIniciais()
    somenteSplitter.tipoServico = 'caixa-danificada'
    somenteSplitter.tipoCaixa = 'cto-poste'
    somenteSplitter.trocarCaixaCompleta = false
    somenteSplitter.trocarSomenteSplitter = true
    somenteSplitter.splittagem = '1x8'

    const itensSomenteSplitter = calcularMateriaisAutomaticos(somenteSplitter)
    expect(itensSomenteSplitter.find((item) => item.codigo === '1575')?.quantidade).toBe(1)
    expect(itensSomenteSplitter.find((item) => item.codigo === '1758')).toBeUndefined()
  })
})
