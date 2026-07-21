import { useEffect } from 'react'
import { criarDadosIniciais } from '../data/configuracao'
import type { CaboSolicitado, CapacidadeKit, DadosSolicitacao, TipoServico } from '../types'

const CHAVE_RASCUNHO = 'noc-solicitacao-materiais-rascunho-v2'
const capacidadesKitsAtuais: CapacidadeKit[] = [24, 36, 72, 144]

export type Rascunho = { dados: DadosSolicitacao }
type DadosLegados = Omit<Partial<DadosSolicitacao>, 'tipoServico' | 'quantidadeAlcasPorKit'> & {
  tipoServico?: TipoServico | 'troca-poste'
  quantidadeAlcasPorKit?: Partial<Record<CapacidadeKit, number>>
  protocoloOs?: string
  quantidadeSplitter1x8?: number
  quantidadeSplitter1x16?: number
  quantidadePostesComDrop?: number
}
type CaboLegado = Omit<CaboSolicitado, 'quantidadeAlcasPlaquetas'> & {
  quantidadeAlcasPlaquetas?: number
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
      quantidadePostesComDrop: _quantidadePostesComDrop,
      ...dadosAtuais
    } = rascunho.dados
    const dadosIniciais = criarDadosIniciais()
    return {
      dados: {
        ...dadosIniciais,
        ...dadosAtuais,
        tipoServico: dadosAtuais.tipoServico === 'troca-poste'
          ? 'equipagem-poste'
          : dadosAtuais.tipoServico ?? dadosIniciais.tipoServico,
        os: dadosAtuais.os ?? protocoloOs ?? '',
        protocolo: dadosAtuais.protocolo ?? '',
        kits: (dadosAtuais.kits ?? []).filter((capacidade): capacidade is CapacidadeKit =>
          capacidadesKitsAtuais.includes(capacidade as CapacidadeKit),
        ),
        quantidadeAlcasPorKit: {
          ...dadosIniciais.quantidadeAlcasPorKit,
          ...dadosAtuais.quantidadeAlcasPorKit,
        },
        cabos: ((dadosAtuais.cabos ?? []) as CaboLegado[]).map((cabo) => ({
          ...cabo,
          quantidadeAlcasPlaquetas: cabo.quantidadeAlcasPlaquetas ?? 2 * (dadosAtuais.quantidadePostes ?? 0),
        })),
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
