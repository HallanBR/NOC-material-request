import { useEffect } from 'react'
import type { DadosSolicitacao } from '../types'

const CHAVE_RASCUNHO = 'noc-solicitacao-materiais-rascunho-v2'

export type Rascunho = { dados: DadosSolicitacao }

export const carregarRascunho = (): Rascunho | null => {
  try {
    const valor = localStorage.getItem(CHAVE_RASCUNHO)
    return valor ? (JSON.parse(valor) as Rascunho) : null
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
