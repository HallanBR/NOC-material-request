import type { ItemSolicitacao } from '../types'

type ListaMateriaisProps = { itens: ItemSolicitacao[] }

export function ListaMateriais({ itens }: ListaMateriaisProps) {
  return (
    <section className="cartao" aria-labelledby="lista-materiais-titulo">
      <div className="cabecalho-secao">
        <div>
          <p className="sobretitulo">Etapa 2 de 3</p>
          <h2 id="lista-materiais-titulo">Materiais calculados</h2>
        </div>
        <span className="contador-catalogo">{itens.length} item(ns)</span>
      </div>
      {itens.length === 0 ? (
        <p className="estado-vazio">Preencha as condições da demanda para calcular os materiais automaticamente.</p>
      ) : (
        <ul className="lista-unica-materiais">
          {itens.map((item) => (
            <li className="linha-material" key={item.id}>
              <div className="identificacao-material">
                <strong>{item.nome}</strong>
                <span>Código: {item.codigo ?? 'PENDENTE DE CADASTRO'} · {item.categoria}</span>
                {item.pendenteCadastro && <span className="selo selo-pendente">Cadastro pendente</span>}
                <span className="regra-automatica">Adicionado automaticamente pela regra: {item.regras.join(', ')}</span>
              </div>
              <div className="quantidade-material"><strong>{item.quantidade} {item.unidade}</strong></div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
