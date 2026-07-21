import { beforeEach, describe, expect, it } from 'vitest'
import { carregarRascunho } from '../hooks/useRascunho'

const CHAVE_RASCUNHO = 'noc-solicitacao-materiais-rascunho-v2'

describe('migração do rascunho', () => {
  beforeEach(() => localStorage.clear())

  it('preserva o valor combinado antigo no campo OS e solicita um protocolo separado', () => {
    localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify({
      dados: { equipeRetirada: 'ATELECOM', protocoloOs: 'OS-LEGADA' },
    }))

    const rascunho = carregarRascunho()

    expect(rascunho?.dados.os).toBe('OS-LEGADA')
    expect(rascunho?.dados.protocolo).toBe('')
  })

  it('migra uma CTO de poste antiga para a montagem padrão com splitter 1x8', () => {
    localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify({
      dados: {
        tipoServico: 'avulsa',
        tipoCaixaAvulsa: 'cto-poste',
        quantidadeSplitter1x8: 1,
        quantidadeSplitter1x16: 0,
      },
    }))

    const rascunho = carregarRascunho()

    expect(rascunho?.dados.configuracaoCtoPosteAvulsa).toBe('1x8')
    expect(rascunho?.dados).not.toHaveProperty('quantidadeSplitter1x8')
    expect(rascunho?.dados).not.toHaveProperty('quantidadeSplitter1x16')
  })

  it('remove kits de 6 e 12 fibras que deixaram de existir', () => {
    localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify({
      dados: { kits: [6, 12, 24, 72] },
    }))

    const rascunho = carregarRascunho()

    expect(rascunho?.dados.kits).toEqual([24, 72])
  })

  it('migra a antiga troca de poste para equipagem de poste', () => {
    localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify({
      dados: { tipoServico: 'troca-poste' },
    }))

    expect(carregarRascunho()?.dados.tipoServico).toBe('equipagem-poste')
  })

  it('adiciona as quantidades de alças por kit aos rascunhos antigos', () => {
    localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify({
      dados: { kits: [24, 72] },
    }))

    expect(carregarRascunho()?.dados.quantidadeAlcasPorKit).toEqual({ 24: 0, 36: 0, 72: 0, 144: 0 })
  })

  it('atribui a recomendação de alças e plaquetas aos cabos de rascunhos antigos', () => {
    localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify({
      dados: {
        quantidadePostes: 3,
        cabos: [{ id: 'cabo-legado', capacidade: 24, metragem: 100 }],
      },
    }))

    const rascunho = carregarRascunho()

    expect(rascunho?.dados.cabos[0]?.quantidadeAlcasPlaquetas).toBe(6)
  })
})
