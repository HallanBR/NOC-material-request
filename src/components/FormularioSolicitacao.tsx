import { EscolhaSimNao } from './EscolhaSimNao'
import { SelecaoCabos } from './SelecaoCabos'
import type { CapacidadeFibra, DadosSolicitacao, ModoRompimento } from '../types'
import { quantidadePostesRetos } from '../rules/regrasMateriais'

type FormularioSolicitacaoProps = {
  dados: DadosSolicitacao
  aoAlterar: (alteracoes: Partial<DadosSolicitacao>) => void
}

const capacidades: CapacidadeFibra[] = [6, 12, 24, 36, 72, 144]

const servicos = [
  { valor: 'rompimento', rotulo: 'Rompimento' },
  { valor: 'troca-poste', rotulo: 'Troca de poste' },
  { valor: 'equipagem-poste', rotulo: 'Equipagem de novo poste' },
  { valor: 'caixa-danificada', rotulo: 'Caixa danificada' },
  { valor: 'avulsa', rotulo: 'Solicitação avulsa' },
] as const

export function FormularioSolicitacao({ dados, aoAlterar }: FormularioSolicitacaoProps) {
  const mostrarPostes =
    dados.tipoServico === 'troca-poste' ||
    dados.tipoServico === 'equipagem-poste' ||
    (dados.tipoServico === 'rompimento' && dados.modoRompimento === 'cabo')
  const postesRetos = quantidadePostesRetos(dados)

  const selecionarModoRompimento = (modoRompimento: ModoRompimento) => {
    aoAlterar({
      modoRompimento,
      kits: modoRompimento === 'kit' ? dados.kits : [],
      cabos: modoRompimento === 'cabo' ? dados.cabos : [],
    })
  }

  const alternarKit = (capacidade: CapacidadeFibra) =>
    aoAlterar({
      kits: dados.kits.includes(capacidade)
        ? dados.kits.filter((item) => item !== capacidade)
        : [...dados.kits, capacidade],
    })

  return (
    <section className="cartao" id="formulario-solicitacao" aria-labelledby="solicitacao-titulo">
      <div className="cabecalho-secao">
        <div>
          <p className="sobretitulo">Etapa 1 de 3</p>
          <h2 id="solicitacao-titulo">Dados da solicitação</h2>
        </div>
        <span className="campo-obrigatorio">* Obrigatório</span>
      </div>

      <div className="bloco-formulario">
        <div className="grade-formulario grade-resumida">
          <label className="campo-largo">
            <span>Equipe que irá retirar o material *</span>
            <input
              value={dados.equipeRetirada}
              onChange={(event) => aoAlterar({ equipeRetirada: event.target.value })}
              placeholder="Ex.: ATELECOM"
            />
          </label>
          <label>
            <span>OS *</span>
            <input value={dados.os} onChange={(event) => aoAlterar({ os: event.target.value })} />
          </label>
          <label>
            <span>Protocolo *</span>
            <input value={dados.protocolo} onChange={(event) => aoAlterar({ protocolo: event.target.value })} />
          </label>
          <label>
            <span>Data prevista para retirada *</span>
            <input type="date" value={dados.dataRetirada} onChange={(event) => aoAlterar({ dataRetirada: event.target.value })} />
          </label>
          <label>
            <span>Tipo de serviço *</span>
            <select
              value={dados.tipoServico}
              onChange={(event) => aoAlterar({ tipoServico: event.target.value as DadosSolicitacao['tipoServico'] })}
            >
              {servicos.map((servico) => <option key={servico.valor} value={servico.valor}>{servico.rotulo}</option>)}
            </select>
          </label>
        </div>
      </div>

      {dados.tipoServico === 'rompimento' && (
        <div className="bloco-formulario bloco-dinamico">
          <h3>Detalhes do rompimento</h3>
          <fieldset className="escolha-sim-nao escolha-modo">
            <legend>Como será atendido? *</legend>
            <label>
              <input type="radio" name="modo-rompimento" checked={dados.modoRompimento === 'cabo'} onChange={() => selecionarModoRompimento('cabo')} />
              Lançar cabo completo
            </label>
            <label>
              <input type="radio" name="modo-rompimento" checked={dados.modoRompimento === 'kit'} onChange={() => selecionarModoRompimento('kit')} />
              Inserir kit em cabo existente
            </label>
          </fieldset>
          {dados.modoRompimento === 'cabo' && <SelecaoCabos dados={dados} aoAlterar={aoAlterar} />}
          {dados.modoRompimento === 'kit' && (
            <div className="subsecao-formulario">
              <h3>Quais kits?</h3>
              <div className="opcoes-inline">
                {capacidades.map((capacidade) => (
                  <label key={capacidade}>
                    <input type="checkbox" checked={dados.kits.includes(capacidade)} onChange={() => alternarKit(capacidade)} />
                    Kit de {capacidade} fibras
                  </label>
                ))}
              </div>
              <p className="texto-ajuda destaque-pendente">Os kits continuam identificados como pendentes até a confirmação de seus códigos.</p>
            </div>
          )}
        </div>
      )}

      {(dados.tipoServico === 'troca-poste' || dados.tipoServico === 'equipagem-poste') && (
        <div className="bloco-formulario bloco-dinamico">
          <h3>Cabos do atendimento</h3>
          <SelecaoCabos dados={dados} aoAlterar={aoAlterar} titulo="Cabos a lançar" />
        </div>
      )}

      {mostrarPostes && (
        <div className="bloco-formulario bloco-dinamico">
          <h3>Postes e ferragens</h3>
          <p className="texto-ajuda">Informe o total a equipar e a divisão entre curvas e CTOs. Os demais são tratados como postes retos.</p>
          <div className="grade-formulario grade-postes-logica">
            <label>
              <span>Total de postes a equipar</span>
              <input min="0" type="number" value={dados.quantidadePostes || ''} onChange={(event) => aoAlterar({ quantidadePostes: Number(event.target.value) })} />
            </label>
            <label>
              <span>Postes com curva</span>
              <input min="0" type="number" value={dados.quantidadePostesAngulo || ''} onChange={(event) => aoAlterar({ quantidadePostesAngulo: Number(event.target.value) })} />
            </label>
            <label>
              <span>Postes com CTO</span>
              <input min="0" type="number" value={dados.quantidadePostesCto || ''} onChange={(event) => aoAlterar({ quantidadePostesCto: Number(event.target.value) })} />
            </label>
            <label>
              <span>Quantidade de raquetes</span>
              <input min="0" type="number" value={dados.quantidadeRaquetes} onChange={(event) => aoAlterar({ quantidadeRaquetes: Number(event.target.value) })} />
            </label>
            <label>
              <span>Postes com drop de cliente</span>
              <input min="0" type="number" value={dados.quantidadePostesComDrop || ''} onChange={(event) => aoAlterar({ quantidadePostesComDrop: Number(event.target.value) })} />
            </label>
          </div>
          <p className="resumo-postes">Postes retos calculados: <strong>{postesRetos}</strong></p>
        </div>
      )}

      {dados.tipoServico === 'caixa-danificada' && (
        <div className="bloco-formulario bloco-dinamico">
          <h3>Tratamento da caixa danificada</h3>
          <div className="grade-formulario grade-curta">
            <label>
              <span>Tipo de caixa *</span>
              <select value={dados.tipoCaixa} onChange={(event) => aoAlterar({ tipoCaixa: event.target.value as DadosSolicitacao['tipoCaixa'] })}>
                <option value="">Selecione</option>
                <option value="cto-predial">CTO de prédio</option>
                <option value="cto-poste">CTO de poste</option>
                <option value="ceo">CEO</option>
              </select>
            </label>
            <label>
              <span>Quantidade de caixas</span>
              <input min="1" type="number" value={dados.quantidadeCaixas || ''} onChange={(event) => aoAlterar({ quantidadeCaixas: Number(event.target.value) })} />
            </label>
          </div>
          <EscolhaSimNao id="troca-caixa" legenda="Trocar caixa completa?" valor={dados.trocarCaixaCompleta} aoAlterar={(trocarCaixaCompleta) => aoAlterar({ trocarCaixaCompleta })} />
          {dados.trocarCaixaCompleta === false && (
            <>
              <EscolhaSimNao id="troca-splitter" legenda="Trocar apenas splitter?" valor={dados.trocarSomenteSplitter} aoAlterar={(trocarSomenteSplitter) => aoAlterar({ trocarSomenteSplitter })} />
              {dados.trocarSomenteSplitter === true && (
                <label className="campo-numerico-condicional">
                  <span>Splittagem</span>
                  <select value={dados.splittagem} onChange={(event) => aoAlterar({ splittagem: event.target.value as DadosSolicitacao['splittagem'] })}>
                    <option value="">Selecione</option><option value="1x8">1x8</option><option value="1x16">1x16</option>
                  </select>
                </label>
              )}
            </>
          )}
        </div>
      )}

      {dados.tipoServico === 'avulsa' && (
        <div className="bloco-formulario bloco-dinamico">
          <h3>Caixa para solicitação avulsa</h3>
          <div className="grade-formulario grade-curta">
            <label>
              <span>Tipo de caixa *</span>
              <select value={dados.tipoCaixaAvulsa} onChange={(event) => aoAlterar({ tipoCaixaAvulsa: event.target.value as DadosSolicitacao['tipoCaixaAvulsa'] })}>
                <option value="">Selecione</option><option value="ceo">CEO</option><option value="cto">CTO</option>
              </select>
            </label>
            <label>
              <span>Quantidade de caixas</span>
              <input min="1" type="number" value={dados.quantidadeCaixasAvulsas || ''} onChange={(event) => aoAlterar({ quantidadeCaixasAvulsas: Number(event.target.value) })} />
            </label>
          </div>
          {dados.tipoCaixaAvulsa === 'cto' && (
            <div className="subsecao-formulario">
              <h3>Splitters da CTO</h3>
              <p className="texto-ajuda">Informe a quantidade de cada splittagem; é permitido solicitar vários splitters iguais.</p>
              <div className="grade-formulario grade-curta">
                <label><span>Splitter 1x8</span><input min="0" type="number" value={dados.quantidadeSplitter1x8 || ''} onChange={(event) => aoAlterar({ quantidadeSplitter1x8: Number(event.target.value) })} /></label>
                <label><span>Splitter 1x16</span><input min="0" type="number" value={dados.quantidadeSplitter1x16 || ''} onChange={(event) => aoAlterar({ quantidadeSplitter1x16: Number(event.target.value) })} /></label>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
