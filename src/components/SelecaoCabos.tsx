import type { CaboSolicitado, CapacidadeFibra, DadosSolicitacao } from '../types'

const capacidades: CapacidadeFibra[] = [6, 12, 24, 36, 72, 144]

type SelecaoCabosProps = {
  dados: DadosSolicitacao
  aoAlterar: (alteracoes: Partial<DadosSolicitacao>) => void
  titulo?: string
}

const criarLinhaCabo = (): CaboSolicitado => ({
  id: `cabo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  capacidade: 6,
  metragem: 0,
})

export function SelecaoCabos({ dados, aoAlterar, titulo = 'Cabos a solicitar' }: SelecaoCabosProps) {
  const postesComAlca = dados.quantidadePostesAngulo + dados.quantidadePostesCto
  const alterarCabo = (id: string, alteracoes: Partial<CaboSolicitado>) => {
    aoAlterar({
      cabos: dados.cabos.map((cabo) => (cabo.id === id ? { ...cabo, ...alteracoes } : cabo)),
    })
  }

  return (
    <div className="subsecao-formulario">
      <div>
        <h3>{titulo}</h3>
        <p className="texto-ajuda">
          Cada linha representa um cabo. Você pode repetir a mesma fibra quantas vezes forem necessárias.
        </p>
        {postesComAlca > 0 && (
          <p className="texto-ajuda destaque-pendente">
            Atenção: serão incluídas 2 alças por poste com curva ou CTO para cada linha de cabo, conforme a fibra escolhida.
          </p>
        )}
      </div>
      <div className="lista-cabos">
        {dados.cabos.map((cabo, indice) => (
          <div className="linha-cabo" key={cabo.id}>
            <label>
              <span>Cabo {indice + 1}</span>
              <select
                value={cabo.capacidade}
                onChange={(event) => alterarCabo(cabo.id, { capacidade: Number(event.target.value) as CapacidadeFibra })}
              >
                {capacidades.map((capacidade) => (
                  <option key={capacidade} value={capacidade}>
                    Cabo de {capacidade} fibras
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Metragem</span>
              <input
                min="0"
                step="1"
                type="number"
                value={cabo.metragem || ''}
                onChange={(event) => alterarCabo(cabo.id, { metragem: Number(event.target.value) })}
              />
            </label>
            <button
              className="botao-link perigo"
              onClick={() => aoAlterar({ cabos: dados.cabos.filter((item) => item.id !== cabo.id) })}
              type="button"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
      <button
        className="botao botao-secundario botao-adicionar-cabo"
        onClick={() => aoAlterar({ cabos: [...dados.cabos, criarLinhaCabo()] })}
        type="button"
      >
        Adicionar outro cabo
      </button>
    </div>
  )
}
