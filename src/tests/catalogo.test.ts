import { describe, expect, it } from 'vitest'
import { materialPorCodigo, materiais } from '../data/materiais'

describe('catálogo operacional público', () => {
  it('mantém apenas os materiais necessários ao fluxo, sem dados de origem', () => {
    expect(materiais.map((item) => item.categoria)).toEqual(expect.arrayContaining(['OPERACIONAL']))
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

  it('oferece alças em unidade conforme a capacidade do cabo', () => {
    expect(materialPorCodigo('1057')).toMatchObject({ nome: 'ALÇA PREF. CCE 6,80 A 7,40MM BRANCO - 06FO E 12FO', unidade: 'und' })
    expect(materialPorCodigo('1763')).toMatchObject({ nome: 'ALÇA PREF. CB.CCE-APL-ASF 9,3 - 10,1 MM - ROXA - 24FO E 36FO', unidade: 'und' })
    expect(materialPorCodigo('67')).toMatchObject({ nome: 'ALÇA PREF. 12,4 - 13,3MM - LARANJA CURTA - 72FO', unidade: 'und' })
    expect(materialPorCodigo('1720')).toMatchObject({ nome: 'ALÇA PREF. CABO OPTICO 15 A 16 - MARROM LONGA - 144FO', unidade: 'und' })
    expect(materialPorCodigo('831')?.unidade).toBe('und')
    expect(materialPorCodigo('184')).toMatchObject({ nome: 'PLAQUETA DE IDENTIFICACAO AMARELA', unidade: 'und' })
  })

  it('oferece apenas os kits de rompimento cadastrados', () => {
    expect(materialPorCodigo('2292')).toMatchObject({ nome: 'KIT EMERGENCIAL ROMPIMENTO FIBRA 24FO', unidade: 'kit' })
    expect(materialPorCodigo('2293')).toMatchObject({ nome: 'KIT EMERGENCIAL ROMPIMENTO FIBRA 36FO', unidade: 'kit' })
    expect(materialPorCodigo('2294')).toMatchObject({ nome: 'KIT EMERGENCIAL ROMPIMENTO FIBRA 72FO', unidade: 'kit' })
    expect(materialPorCodigo('2295')).toMatchObject({ nome: 'KIT EMERGENCIAL ROMPIMENTO FIBRA 144FO', unidade: 'kit' })
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
