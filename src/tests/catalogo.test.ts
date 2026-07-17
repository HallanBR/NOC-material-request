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
    expect(materialPorCodigo('1698')).toMatchObject({ nome: 'CABO CFOA-SM-AS80 06FO NR', unidade: 'm' })
    expect(materialPorCodigo('50')).toMatchObject({ nome: 'CABO CFOA-SM-AS80-S 12FO', unidade: 'm' })
    expect(materialPorCodigo('51')).toMatchObject({ nome: 'CABO CFOA-SM-AS80-S 24FO', unidade: 'm' })
    expect(materialPorCodigo('66')).toMatchObject({ nome: 'CABO CFOA-SM-AS80-S 36FO', unidade: 'm' })
    expect(materialPorCodigo('86')).toMatchObject({ nome: 'CABO CFOA-SM-AS-80-S 72FO', unidade: 'm' })
    expect(materialPorCodigo('1725')).toMatchObject({ nome: 'CABO CFOA-SM-AS80-S 144FO', unidade: 'm' })
  })

  it('oferece os materiais corretos para CTO de prédio', () => {
    expect(materialPorCodigo('1643')?.nome).toBe('SPLITTER BOX PLC 1X8 APC')
    expect(materialPorCodigo('2029')?.nome).toBe('SPLITTER BOX PLC 1X16 APC')
    expect(materialPorCodigo('1760')?.nome).toBe('ADESIVOS SPLITTER BOX - 10X10')
  })

  it('oferece splitters e adesivos corretos para CTO de poste', () => {
    expect(materialPorCodigo('1066')?.nome).toBe('GABINETE 18 - CTO (MONTADO C/SPLITTER 1x8)')
    expect(materialPorCodigo('700')?.nome).toBe('GABINETE 18 - CTO (DESMONTADO)')
    expect(materialPorCodigo('1756')?.nome).toBe('ADESIVO PARA CTO - INTERNO')
    expect(materialPorCodigo('1682')?.nome).toBe('ADESIVO PARA CTO - EXTERNO SEM IDENTIFICACAO')
    expect(materialPorCodigo('1575')?.nome).toBe('SPLITTER 1x8 CONECTORIZADO')
    expect(materialPorCodigo('713')?.nome).toBe('SPLITTER PLC 1x16 CONECTORIZADO SC/APC VERDE')
  })
})
