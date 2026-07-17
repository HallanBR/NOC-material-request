import { useEffect } from 'react'
import { criarDadosIniciais } from '../data/configuracao'
import type { DadosSolicitacao } from '../types'

const CHAVE_RASCUNHO = 'noc-solicitacao-materiais-rascunho-v2'

export type Rascunho = { dados: DadosSolicitacao }
type DadosLegados = Partial<DadosSolicitacao> & { protocoloOs?: string }

export const carregarRascunho = (): Rascunho | null => {
  try {
    const valor = localStorage.getItem(CHAVE_RASCUNHO)
    if (!valor) return null

    const rascunho = JSON.parse(valor) as { dados?: DadosLegados }
    if (!rascunho.dados) return null

    const { protocoloOs, ...dadosAtuais } = rascunho.dados
    return {
      dados: {
        ...criarDadosIniciais(),
        ...dadosAtuais,
        os: dadosAtuais.os ?? protocoloOs ?? '',
        protocolo: dadosAtuais.protocolo ?? '',
      } as DadosSolicitacao,
    }
  } catch {
    return null
  }
}

export const useRascunho = (rascunho: Rascunho) => {
  useEffect(() => {
    localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(rascunho))
  }, [rascunho])
}

export const limparRascunho = () => localStorage.removeItem(CHAVE_RASCUNHO)
