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
})
