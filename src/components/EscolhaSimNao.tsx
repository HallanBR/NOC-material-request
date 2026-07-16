type EscolhaSimNaoProps = {
  id: string
  legenda: string
  valor: boolean | null
  aoAlterar: (valor: boolean) => void
}

export function EscolhaSimNao({ id, legenda, valor, aoAlterar }: EscolhaSimNaoProps) {
  return (
    <fieldset className="escolha-sim-nao">
      <legend>{legenda}</legend>
      <label>
        <input
          type="radio"
          name={id}
          checked={valor === true}
          onChange={() => aoAlterar(true)}
        />
        Sim
      </label>
      <label>
        <input
          type="radio"
          name={id}
          checked={valor === false}
          onChange={() => aoAlterar(false)}
        />
        Não
      </label>
    </fieldset>
  )
}
