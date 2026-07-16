import type { DadosSolicitacao, ItemSolicitacao } from '../types'

export type SolicitacaoGerada = { assunto: string; corpo: string; pendencias: ItemSolicitacao[] }

const formatarData = (data: string) => {
  if (!data) return 'Não informada'
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

const formatarQuantidade = (quantidade: number) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(quantidade)

const rotuloServico: Record<DadosSolicitacao['tipoServico'], string> = {
  rompimento: 'Rompimento',
  'troca-poste': 'Troca de poste',
  'equipagem-poste': 'Equipagem de novo poste',
  'caixa-danificada': 'Caixa danificada',
  avulsa: 'Solicitação avulsa',
}

export const gerarAssunto = (dados: DadosSolicitacao) =>
  `Solicitação de materiais - ${dados.protocoloOs.trim() || 'NOC'}`

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
    `Protocolo/OS: ${dados.protocoloOs}`,
    `Retirada por: ${dados.equipeRetirada}`,
    `Data prevista para retirada: ${formatarData(dados.dataRetirada)}`,
    `Tipo de serviço: ${rotuloServico[dados.tipoServico]}`,
    '',
    'Lista de materiais:',
    '',
    ...materiais,
    '',
    ...linhasPendencias,
    'Atenciosamente,',
    'NOC',
  ].join('\n')

  return { assunto: gerarAssunto(dados), corpo, pendencias }
}
