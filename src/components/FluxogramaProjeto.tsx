type FluxogramaProjetoProps = {
  aoFechar: () => void
}

type EtapaFluxoProps = {
  titulo: string
  descricao: string
}

function EtapaFluxo({ titulo, descricao }: EtapaFluxoProps) {
  return (
    <div className="etapa-fluxo">
      <strong>{titulo}</strong>
      <span>{descricao}</span>
    </div>
  )
}

export function FluxogramaProjeto({ aoFechar }: FluxogramaProjetoProps) {
  return (
    <div className="modal-fluxograma" role="dialog" aria-modal="true" aria-labelledby="fluxograma-titulo">
      <section className="painel-fluxograma">
        <div className="cabecalho-fluxograma">
          <div>
            <p className="sobretitulo">Guia do sistema</p>
            <h2 id="fluxograma-titulo">Como funciona a solicitação</h2>
          </div>
          <button className="botao botao-neutro" onClick={aoFechar} type="button">Fechar</button>
        </div>

        <div className="fluxograma" aria-label="Fluxo de criação e geração de uma solicitação de materiais">
          <div className="fluxo-principal">
            <EtapaFluxo titulo="1. Dados da retirada" descricao="Equipe, OS, protocolo e data." />
            <span className="seta-fluxo" aria-hidden="true">↓</span>
            <EtapaFluxo titulo="2. Tipo de serviço" descricao="Define os campos e regras aplicáveis." />
          </div>

          <div className="seta-central-fluxo" aria-hidden="true">↓</div>
          <div className="ramificacoes-fluxo">
            <EtapaFluxo titulo="Rompimento" descricao="Cabo completo ou kit de 24, 36, 72 ou 144 FO." />
            <EtapaFluxo titulo="Equipagem de poste" descricao="Cabos, ferragens, curvas, CTOs e raquetes." />
            <EtapaFluxo titulo="Caixa danificada" descricao="CTO de prédio, CTO de poste ou CEO, com materiais correspondentes." />
            <EtapaFluxo titulo="Solicitação avulsa" descricao="CEO, CTOs ou adesivos solicitados individualmente." />
          </div>

          <div className="fluxo-principal fluxo-final">
            <span className="seta-fluxo" aria-hidden="true">↓</span>
            <EtapaFluxo titulo="3. Materiais calculados" descricao="Regras somam materiais, cabos, alças e plaquetas conforme as escolhas." />
            <span className="seta-fluxo" aria-hidden="true">↓</span>
            <EtapaFluxo titulo="4. Validação" descricao="Confere os campos obrigatórios e os limites dos postes." />
            <span className="seta-fluxo" aria-hidden="true">↓</span>
            <EtapaFluxo titulo="5. Prévia e TXT" descricao="Gera o texto de expedição para copiar ou baixar." />
          </div>
        </div>
      </section>
    </div>
  )
}
