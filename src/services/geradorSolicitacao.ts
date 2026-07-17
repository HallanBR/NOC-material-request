import type { DadosSolicitacao, ItemSolicitacao } from '../types'

export type SolicitacaoGerada = { assunto: string; corpo: string; pendencias: ItemSolicitacao[] }

const formatarData = (data: string) => {
  if (!data) return 'Não informada'
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

const formatarQuantidade = (quantidade: number) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(quantidade)

export const gerarAssunto = (dados: DadosSolicitacao) =>
  `Solicitação de materiais - OS ${dados.os.trim() || 'Não informada'} - Protocolo ${dados.protocolo.trim() || 'Não informado'}`

export const gerarSolicitacao = (dados: DadosSolicitacao, itens: ItemSolicitacao[]): SolicitacaoGerada => {
  const pendencias = itens.filter((item) => item.pendenteCadastro || !item.codigo)
  const materiais = itens.map((item) =>
    `${item.codigo ?? 'PENDENTE DE CADASTRO'} - ${item.nome} - ${formatarQuantidade(item.quantidade)} ${item.unidade}`,
  )
  const linhasPendencias = pendencias.length
    ? ['Pendências de cadastro:', ...pendencias.map((item) => `- ${item.nome}: código PENDENTE DE CADASTRO`), '']
    : []

  const corpo = [
    'Prezados,',
    '',
    'Venho por este canal formalizar a solicitação de material para atendimento da demanda abaixo.',
    '',
    'Detalhes da solicitação',
    '',
    `OS: ${dados.os}`,
    `Protocolo: ${dados.protocolo}`,
    `Retirada por: ${dados.equipeRetirada}`,
    `Data prevista para retirada: ${formatarData(dados.dataRetirada)}`,
    '',
    'Lista de materiais:',
    '',
    ...materiais,
    '',
    ...linhasPendencias,
    'Atenciosamente,',
  ].join('\n')

  return { assunto: gerarAssunto(dados), corpo, pendencias }
}
