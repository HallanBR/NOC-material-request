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
      { id: 'trecho-a', capacidade: 6, metragem: 250, quantidadeAlcasPlaquetas: 0 },
      { id: 'trecho-b', capacidade: 6, metragem: 180, quantidadeAlcasPlaquetas: 0 },
    ]

    const itens = calcularMateriaisAutomaticos(dados).filter((item) => item.codigo === '1698')

    expect(itens.map((item) => item.quantidade)).toEqual([250, 180])
  })

  it('inclui os kits cadastrados de 24, 36, 72 e 144 fibras', () => {
    const dados = criarDadosIniciais()
    dados.modoRompimento = 'kit'
    dados.kits = [24, 72]

    const itens = calcularMateriaisAutomaticos(dados)

    expect(itens.find((item) => item.codigo === '2292')).toMatchObject({ quantidade: 1, unidade: 'kit', pendenteCadastro: false })
    expect(itens.find((item) => item.codigo === '2294')).toMatchObject({ quantidade: 1, unidade: 'kit', pendenteCadastro: false })
  })

  it('inclui a quantidade escolhida da alça correspondente a cada kit', () => {
    const dados = criarDadosIniciais()
    dados.modoRompimento = 'kit'
    dados.kits = [24, 36, 72, 144]
    dados.quantidadeAlcasPorKit = { 24: 2, 36: 3, 72: 4, 144: 5 }

    const itens = calcularMateriaisAutomaticos(dados)

    expect(itens.find((item) => item.codigo === '1763')?.quantidade).toBe(5)
    expect(itens.find((item) => item.codigo === '67')?.quantidade).toBe(4)
    expect(itens.find((item) => item.codigo === '1720')?.quantidade).toBe(5)
    expect(itens.find((item) => item.codigo === '184')).toBeUndefined()
  })

  it('calcula a ferragem base pelo total de postes a equipar', () => {
    const dados = criarDadosIniciais()
    dados.tipoServico = 'equipagem-poste'
    dados.quantidadePostes = 12

    const itens = calcularMateriaisAutomaticos(dados)

    expect(itens.find((item) => item.codigo === '802')?.quantidade).toBe(24)
    expect(itens.find((item) => item.codigo === '133')).toBeUndefined()
  })
  it('calcula dois anéis por poste, mesmo com curvas e CTOs', () => {
    const dados = criarDadosIniciais()
    dados.tipoServico = 'equipagem-poste'
    dados.quantidadePostes = 12
    dados.quantidadePostesAngulo = 3
    dados.quantidadePostesCto = 1

    const itens = calcularMateriaisAutomaticos(dados)

    expect(itens.find((item) => item.codigo === '802')?.quantidade).toBe(24)
  })

  it('não duplica materiais comuns quando o mesmo poste tem curva e CTO', () => {
    const dados = criarDadosIniciais()
    dados.tipoServico = 'equipagem-poste'
    dados.quantidadePostes = 1
    dados.quantidadePostesAngulo = 1
    dados.quantidadePostesCto = 1

    const itens = calcularMateriaisAutomaticos(dados)

    expect(itens.find((item) => item.codigo === '207')?.quantidade).toBe(1)
    expect(itens.find((item) => item.codigo === '243')?.quantidade).toBe(2)
    expect(itens.find((item) => item.codigo === '206')?.quantidade).toBe(2)
    expect(itens.find((item) => item.codigo === '424')?.quantidade).toBe(2)
    expect(itens.find((item) => item.codigo === '802')?.quantidade).toBe(2)
    expect(itens.find((item) => item.codigo === '133')?.quantidade).toBe(2)
    expect(itens.find((item) => item.codigo === '551')?.quantidade).toBe(2)
    expect(itens.find((item) => item.codigo === '688')?.quantidade).toBe(1)
  })

  it('aplica dois parafusos, um olhal e dois anéis por poste com curva', () => {
    const dados = criarDadosIniciais()
    dados.tipoServico = 'equipagem-poste'
    dados.quantidadePostes = 1
    dados.quantidadePostesAngulo = 1

    const itens = calcularMateriaisAutomaticos(dados)

    expect(itens.find((item) => item.codigo === '206')?.quantidade).toBe(2)
    expect(itens.find((item) => item.codigo === '424')?.quantidade).toBe(1)
    expect(itens.find((item) => item.codigo === '802')?.quantidade).toBe(2)
  })

  it('respeita a quantidade informada de alças e plaquetas por linha de cabo', () => {
    const dados = criarDadosIniciais()
    dados.tipoServico = 'equipagem-poste'
    dados.quantidadePostes = 3
    dados.quantidadePostesAngulo = 1
    dados.cabos = [
      { id: 'cabo-6', capacidade: 6, metragem: 100, quantidadeAlcasPlaquetas: 5 },
      { id: 'cabo-12', capacidade: 12, metragem: 100, quantidadeAlcasPlaquetas: 4 },
      { id: 'cabo-24', capacidade: 24, metragem: 100, quantidadeAlcasPlaquetas: 3 },
      { id: 'cabo-36', capacidade: 36, metragem: 100, quantidadeAlcasPlaquetas: 2 },
      { id: 'cabo-72', capacidade: 72, metragem: 100, quantidadeAlcasPlaquetas: 1 },
      { id: 'cabo-144', capacidade: 144, metragem: 100, quantidadeAlcasPlaquetas: 6 },
    ]

    const itens = calcularMateriaisAutomaticos(dados)
    const quantidades = (codigo: string) => itens.filter((item) => item.codigo === codigo).map((item) => item.quantidade)

    expect(quantidades('1057')).toEqual([5, 4])
    expect(quantidades('1763')).toEqual([3, 2])
    expect(quantidades('67')).toEqual([1])
    expect(quantidades('1720')).toEqual([6])
    expect(quantidades('184')).toEqual([21])
    expect(itens.filter((item) => ['1057', '1763', '67', '1720'].includes(item.codigo ?? '')).every((item) => item.unidade === 'und')).toBe(true)
  })

  it('agrupa plaquetas iguais sem agrupar alças e cabos', () => {
    const dados = criarDadosIniciais()
    dados.tipoServico = 'equipagem-poste'
    dados.quantidadePostes = 3
    dados.cabos = [
      { id: 'trecho-a', capacidade: 6, metragem: 100, quantidadeAlcasPlaquetas: 8 },
      { id: 'trecho-b', capacidade: 6, metragem: 200, quantidadeAlcasPlaquetas: 2 },
      { id: 'trecho-c', capacidade: 12, metragem: 300, quantidadeAlcasPlaquetas: 2 },
    ]

    const itens = calcularMateriaisAutomaticos(dados)

    expect(itens.filter((item) => item.codigo === '184')).toHaveLength(1)
    expect(itens.find((item) => item.codigo === '184')?.quantidade).toBe(12)
    expect(itens.filter((item) => item.codigo === '1057').map((item) => item.quantidade)).toEqual([8, 2, 2])
    expect(itens.filter((item) => item.codigo === '1698').map((item) => item.quantidade)).toEqual([100, 200])
    expect(itens.filter((item) => item.codigo === '50').map((item) => item.quantidade)).toEqual([300])
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
