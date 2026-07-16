export const nomeArquivoSolicitacao = (projeto: string) => {
  const nomeSeguro = projeto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
  return `solicitacao-materiais-${nomeSeguro || 'noc'}.txt`
}

export const criarArquivoTxt = (conteudo: string) => new Blob([conteudo], { type: 'text/plain;charset=utf-8' })

export const baixarArquivoTxt = (conteudo: string, projeto: string) => {
  const url = URL.createObjectURL(criarArquivoTxt(conteudo))
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivoSolicitacao(projeto)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
