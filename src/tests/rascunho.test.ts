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
})
