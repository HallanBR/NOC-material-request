import { useEffect } from 'react'
import { criarDadosIniciais } from '../data/configuracao'
import type { DadosSolicitacao } from '../types'

const CHAVE_RASCUNHO = 'noc-solicitacao-materiais-rascunho-v2'

export type Rascunho = { dados: DadosSolicitacao }
type DadosLegados = Partial<DadosSolicitacao> & {
  protocoloOs?: string
  quantidadeSplitter1x8?: number
  quantidadeSplitter1x16?: number
}

export const carregarRascunho = (): Rascunho | null => {
  try {
    const valor = localStorage.getItem(CHAVE_RASCUNHO)
    if (!valor) return null

    const rascunho = JSON.parse(valor) as { dados?: DadosLegados }
    if (!rascunho.dados) return null

    const {
      protocoloOs,
      quantidadeSplitter1x8: _quantidadeSplitter1x8,
      quantidadeSplitter1x16: _quantidadeSplitter1x16,
      ...dadosAtuais
    } = rascunho.dados
    return {
      dados: {
        ...criarDadosIniciais(),
        ...dadosAtuais,
        os: dadosAtuais.os ?? protocoloOs ?? '',
        protocolo: dadosAtuais.protocolo ?? '',
        configuracaoCtoPosteAvulsa: dadosAtuais.configuracaoCtoPosteAvulsa ??
          (dadosAtuais.tipoCaixaAvulsa === 'cto-poste' ? '1x8' : ''),
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
