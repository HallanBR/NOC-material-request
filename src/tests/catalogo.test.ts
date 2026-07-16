import { describe, expect, it } from 'vitest'
import { materialPorCodigo, materiais } from '../data/materiais'

describe('catálogo operacional público', () => {
  it('mantém apenas os materiais necessários ao fluxo, sem dados de origem', () => {
    expect(materiais.map((item) => item.categoria)).toEqual(
      expect.arrayContaining(['OPERACIONAL', 'KIT']),
    )
    expect(materiais.every((item) => item.origem === undefined)).toBe(true)
  })

  it('oferece as seis capacidades de cabo necessárias à solicitação', () => {
    expect(materialPorCodigo('1698')?.unidade).toBe('m')
    expect(materialPorCodigo('50')?.unidade).toBe('m')
    expect(materialPorCodigo('51')?.unidade).toBe('m')
    expect(materialPorCodigo('66')?.unidade).toBe('m')
    expect(materialPorCodigo('86')?.unidade).toBe('m')
    expect(materialPorCodigo('1725')?.unidade).toBe('m')
  })
})
