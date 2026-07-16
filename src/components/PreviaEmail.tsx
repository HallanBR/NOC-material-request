import type { SolicitacaoGerada } from '../services/geradorSolicitacao'

type PreviaEmailProps = {
  solicitacao: SolicitacaoGerada
  aoCopiarAssunto: () => void
  aoCopiarTexto: () => void
  aoBaixarTxt: () => void
  aoEditar: () => void
}

export function PreviaEmail({
  solicitacao,
  aoCopiarAssunto,
  aoCopiarTexto,
  aoBaixarTxt,
  aoEditar,
}: PreviaEmailProps) {
  return (
    <section className="cartao cartao-previa" id="previa-email" aria-labelledby="previa-titulo">
      <div className="cabecalho-secao">
        <div>
          <p className="sobretitulo">Etapa 3 de 3</p>
          <h2 id="previa-titulo">Prévia do e-mail</h2>
        </div>
        <span className="selo selo-pronto">Pronto para expedição</span>
      </div>
      <div className="assunto-email">
        <span>Assunto sugerido</span>
        <strong>{solicitacao.assunto}</strong>
        <button className="botao-link" onClick={aoCopiarAssunto} type="button">
          Copiar assunto
        </button>
      </div>
      <pre className="corpo-email">{solicitacao.corpo}</pre>
      <div className="acoes-previa">
        <button className="botao botao-principal" onClick={aoCopiarTexto} type="button">
          Copiar texto do e-mail
        </button>
        <button className="botao botao-secundario" onClick={aoBaixarTxt} type="button">
          Baixar arquivo TXT
        </button>
        <button className="botao botao-neutro" onClick={aoEditar} type="button">
          Editar solicitação
        </button>
      </div>
    </section>
  )
}
