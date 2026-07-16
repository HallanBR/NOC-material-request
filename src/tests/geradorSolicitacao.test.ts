import { describe, expect, it } from 'vitest'
import { criarDadosIniciais } from '../data/configuracao'
import { materialPorCodigo } from '../data/materiais'
import { criarArquivoTxt, nomeArquivoSolicitacao } from '../services/exportadorTxt'
import { gerarAssunto, gerarSolicitacao } from '../services/geradorSolicitacao'
import type { ItemSolicitacao } from '../types'

const dados = { ...criarDadosIniciais(), equipeRetirada: 'ATELECOM', protocoloOs: '113626180184543141' }

const itemAutomatico = (): ItemSolicitacao => {
  const material = materialPorCodigo('1698')!
  return { id: 'auto-cabo', materialId: material.id, nome: material.nome, codigo: material.codigo, categoria: material.categoria, quantidade: 250, unidade: 'm', pendenteCadastro: false, automatico: true, regras: ['RG-CABO-AFETADO-trecho-1'] }
}

describe('geração do e-mail e TXT', () => {
  it('monta um assunto com o protocolo', () => {
    expect(gerarAssunto(dados)).toBe('Solicitação de materiais - 113626180184543141')
  })

  it('gera corpo com equipe de retirada e item automático', () => {
    const solicitacao = gerarSolicitacao(dados, [itemAutomatico()])

    expect(solicitacao.corpo).toContain('Retirada por: ATELECOM')
    expect(solicitacao.corpo).toContain('1698 - CABO CFOA-SM-ASU-80-S 06 FIBRAS - 250 m')
    expect(solicitacao.corpo).not.toContain('[Regra:')
    expect(solicitacao.corpo).toContain('Atenciosamente,\nNOC')
  })

  it('prepara um TXT com nome seguro para download', () => {
    const arquivo = criarArquivoTxt('conteúdo de teste')

    expect(nomeArquivoSolicitacao('OS 123')).toBe('solicitacao-materiais-os-123.txt')
    expect(arquivo.size).toBeGreaterThan(0)
  })
})
