import { calcularMateriaisAutomaticos } from '../rules/regrasMateriais'
import type { DadosSolicitacao, ResultadoValidacao } from '../types'

export const validarSolicitacao = (dados: DadosSolicitacao): ResultadoValidacao => {
  const erros: string[] = []
  const avisos: string[] = []

  if (!dados.equipeRetirada.trim()) erros.push('Informe a equipe que irá retirar o material.')
  if (!dados.dataRetirada) erros.push('Informe a data prevista para retirada.')
  if (!dados.os.trim()) erros.push('Informe a OS.')
  if (!dados.protocolo.trim()) erros.push('Informe o protocolo.')

  if (dados.tipoServico === 'rompimento') {
    if (!dados.modoRompimento) erros.push('Escolha se o rompimento será atendido com cabo ou com kit.')
    if (dados.modoRompimento === 'kit' && dados.kits.length === 0) {
      erros.push('Selecione pelo menos um kit para o rompimento.')
    }
    if (dados.modoRompimento === 'cabo' && dados.cabos.length === 0) {
      erros.push('Adicione pelo menos um cabo para o rompimento.')
    }
  }

  const usaPostes =
    dados.tipoServico === 'troca-poste' ||
    dados.tipoServico === 'equipagem-poste' ||
    (dados.tipoServico === 'rompimento' && dados.modoRompimento === 'cabo')

  if (usaPostes) {
    for (const cabo of dados.cabos) {
      if (!Number.isFinite(cabo.metragem) || cabo.metragem <= 0) {
        erros.push(`Informe uma metragem maior que zero para o cabo de ${cabo.capacidade} fibras.`)
      }
    }

    if (dados.quantidadePostesAngulo > dados.quantidadePostes) {
      erros.push('A quantidade de postes com curva não pode ser maior que o total de postes a equipar.')
    }
    if (dados.quantidadePostesCto > dados.quantidadePostes) {
      erros.push('A quantidade de postes com CTO não pode ser maior que o total de postes a equipar.')
    }
  }

  if (dados.tipoServico === 'caixa-danificada') {
    if (!dados.tipoCaixa) erros.push('Selecione o tipo da caixa danificada.')
    if (dados.quantidadeCaixas <= 0) erros.push('A quantidade de caixas deve ser maior que zero.')

    if (dados.tipoCaixa === 'cto-predial') {
      if (!dados.splittagemCtoPredial) {
        erros.push('Selecione o splitter 1x8 ou 1x16 para a CTO de prédio.')
      }
    } else if (dados.tipoCaixa) {
      if (dados.trocarCaixaCompleta === null) erros.push('Informe se a troca será da caixa completa.')
      if (dados.trocarCaixaCompleta === false && dados.trocarSomenteSplitter === null) {
        erros.push('Informe se será realizada apenas a troca do splitter.')
      }
      if (dados.trocarSomenteSplitter === true && !dados.splittagem) {
        erros.push('Selecione a splittagem do splitter a substituir.')
      }
    }
  }

  if (dados.tipoServico === 'avulsa') {
    if (!dados.tipoCaixaAvulsa) erros.push('Selecione o tipo da solicitação avulsa.')

    if (dados.tipoCaixaAvulsa && dados.tipoCaixaAvulsa !== 'adesivos-cto-poste' && dados.quantidadeCaixasAvulsas <= 0) {
      erros.push('A quantidade de caixas deve ser maior que zero.')
    }
    if (dados.tipoCaixaAvulsa === 'cto-predial' && !dados.splittagemCtoPredialAvulsa) {
      erros.push('Selecione o splitter 1x8 ou 1x16 para a CTO de prédio avulsa.')
    }
    if (
      dados.tipoCaixaAvulsa === 'cto-poste' &&
      !dados.configuracaoCtoPosteAvulsa
    ) {
      erros.push('Selecione a configuração de splitter da CTO de poste.')
    }
    if (
      dados.tipoCaixaAvulsa === 'adesivos-cto-poste' &&
      dados.quantidadeAdesivoInternoCtoPoste <= 0 && dados.quantidadeAdesivoExternoCtoPoste <= 0
    ) {
      erros.push('Informe a quantidade de pelo menos um adesivo interno ou externo para CTO de poste.')
    }
  }

  const itensAutomaticos = calcularMateriaisAutomaticos(dados)
  if (itensAutomaticos.length === 0) {
    erros.push('Informe as condições da solicitação para gerar pelo menos um material automaticamente.')
  }

  const pendentes = itensAutomaticos.filter((item) => item.pendenteCadastro || !item.codigo)
  if (pendentes.length > 0) {
    avisos.push(`${pendentes.length} item(ns) será(ão) gerado(s) como PENDENTE DE CADASTRO.`)
  }

  return { erros, avisos }
}
