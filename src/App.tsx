import { useMemo, useState } from 'react'
import { Alertas } from './components/Alertas'
import { FormularioSolicitacao } from './components/FormularioSolicitacao'
import { ListaMateriais } from './components/ListaMateriais'
import { PreviaEmail } from './components/PreviaEmail'
import { criarDadosIniciais } from './data/configuracao'
import { carregarRascunho, limparRascunho, useRascunho } from './hooks/useRascunho'
import { calcularMateriaisAutomaticos } from './rules/regrasMateriais'
import { baixarArquivoTxt } from './services/exportadorTxt'
import { gerarSolicitacao } from './services/geradorSolicitacao'
import { validarSolicitacao } from './services/validacoes'
import type { DadosSolicitacao } from './types'

const resultadoVazio = { erros: [], avisos: [] }

function App() {
  const rascunhoInicial = carregarRascunho()
  const [dados, setDados] = useState<DadosSolicitacao>(() => rascunhoInicial?.dados ?? criarDadosIniciais())
  const [tentouGerar, setTentouGerar] = useState(false)
  const [mostrarPrevia, setMostrarPrevia] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const itensAutomaticos = useMemo(() => calcularMateriaisAutomaticos(dados), [dados])
  const validacao = useMemo(() => validarSolicitacao(dados), [dados])
  const solicitacaoGerada = useMemo(() => gerarSolicitacao(dados, itensAutomaticos), [dados, itensAutomaticos])

  useRascunho({ dados })

  const atualizarDados = (alteracoes: Partial<DadosSolicitacao>) => {
    setDados((valorAtual) => ({ ...valorAtual, ...alteracoes }))
    setTentouGerar(false)
  }

  const gerar = () => {
    setTentouGerar(true)
    if (validacao.erros.length > 0) {
      setMensagem('Revise os campos indicados abaixo antes de gerar a solicitação.')
      document.getElementById('formulario-solicitacao')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setMostrarPrevia(true)
    setMensagem('Solicitação gerada. Revise a prévia antes de copiar ou baixar o texto.')
    window.setTimeout(() => document.getElementById('previa-email')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  const copiar = async (texto: string, descricao: string) => {
    try {
      await navigator.clipboard.writeText(texto)
      setMensagem(`${descricao} copiado para a área de transferência.`)
    } catch {
      setMensagem(`Não foi possível copiar automaticamente. Selecione e copie ${descricao.toLowerCase()} manualmente.`)
    }
  }

  const limpar = () => {
    setDados(criarDadosIniciais())
    limparRascunho()
    setMostrarPrevia(false)
    setTentouGerar(false)
    setMensagem('Formulário limpo e rascunho local removido.')
  }

  return (
    <div className="aplicacao">
      <header className="cabecalho-aplicacao">
        <div className="marca-noc" aria-hidden="true">NOC</div>
        <div>
          <p className="sobretitulo">Centro de Gerência de Redes</p>
          <h1>Solicitação de materiais</h1>
          <p>Informe a demanda e gere automaticamente a solicitação para expedição.</p>
        </div>
        <div className="status-rascunho">Rascunho salvo neste navegador</div>
      </header>

      <main className="conteudo-principal">
        {mensagem && <div className="mensagem-sucesso" role="status">{mensagem}</div>}
        <FormularioSolicitacao dados={dados} aoAlterar={atualizarDados} />
        <ListaMateriais itens={itensAutomaticos} />
        <Alertas resultado={tentouGerar ? validacao : validacao.avisos.length ? { erros: [], avisos: validacao.avisos } : resultadoVazio} />
        <div className="acoes-formulario">
          <button className="botao botao-principal" onClick={gerar} type="button">Gerar solicitação</button>
          <button className="botao botao-neutro" onClick={limpar} type="button">Limpar formulário</button>
        </div>
        {mostrarPrevia && (
          <PreviaEmail
            solicitacao={solicitacaoGerada}
            aoCopiarAssunto={() => void copiar(solicitacaoGerada.assunto, 'Assunto')}
            aoCopiarTexto={() => void copiar(solicitacaoGerada.corpo, 'Texto do e-mail')}
            aoBaixarTxt={() => { baixarArquivoTxt(solicitacaoGerada.corpo, dados.protocoloOs); setMensagem('Arquivo TXT preparado para download.') }}
            aoEditar={() => { document.getElementById('formulario-solicitacao')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setMensagem('Edite os campos necessários e gere a solicitação novamente.') }}
          />
        )}
      </main>
    </div>
  )
}

export default App
