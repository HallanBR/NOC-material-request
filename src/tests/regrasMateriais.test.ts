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
})
