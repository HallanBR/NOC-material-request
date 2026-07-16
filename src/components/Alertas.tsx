import type { ResultadoValidacao } from '../types'

export function Alertas({ resultado }: { resultado: ResultadoValidacao }) {
  if (!resultado.erros.length && !resultado.avisos.length) return null

  return (
    <div className="alertas" role="status">
      {resultado.erros.length > 0 && (
        <section className="alerta alerta-erro" aria-label="Pendências para geração">
          <strong>Revise antes de gerar</strong>
          <ul>
            {resultado.erros.map((erro) => (
              <li key={erro}>{erro}</li>
            ))}
          </ul>
        </section>
      )}
      {resultado.avisos.length > 0 && (
        <section className="alerta alerta-aviso" aria-label="Avisos">
          <strong>Atenção</strong>
          <ul>
            {resultado.avisos.map((aviso) => (
              <li key={aviso}>{aviso}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
