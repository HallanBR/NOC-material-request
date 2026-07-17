import type { Material, Unidade } from '../types'

type RegistroPublico = readonly [codigo: string, nome: string, unidade: Unidade]

// Catálogo mínimo indispensável ao funcionamento da aplicação. Não contém preços,
// centros de custo, fornecedores nem referências ao arquivo corporativo de origem.
const registros: RegistroPublico[] = [
  ['207', 'FITA BAP', 'und'],
  ['243', 'SUPORTE BAP', 'und'],
  ['206', 'PARAFUSO M2', 'und'],
  ['813', 'SUPORTE REX', 'und'],
  ['815', 'ISOLADOR', 'und'],
  ['424', 'OLHAL', 'und'],
  ['1057', 'ALÇA PREFORMADA AMARRAÇÃO FINAL CABO CCE 6,80 A 7,40 MM BRANCO - CABO DE 06 E 12', 'm'],
  ['831', 'ALÇA PREFORMADA PARA CORDOALHA DE ACO- 3/16 -4,8MM - VERMELHO - CORDOALHA', 'm'],
  ['2057', 'CORDOALHA (METROS)', 'm'],
  ['1543', 'SUPORTE OPT LOOP (UNID.)', 'und'],
  ['1544', 'KIT TAP BRACKET', 'und'],
  ['219', 'SUPORTE DIELÉTRICO', 'und'],
  ['802', 'ANEL GUIA AGF', 'und'],
  ['133', 'FITA FUSIMEC (PADRÃO 1,25 METROS)', 'und'],
  ['551', 'FECHO P/ FITA FUSIMEC', 'und'],
  ['688', 'CRUZETA', 'und'],
  ['1698', 'CABO CFOA-SM-AS80 06FO NR', 'm'],
  ['50', 'CABO CFOA-SM-AS80-S 12FO', 'm'],
  ['51', 'CABO CFOA-SM-AS80-S 24FO', 'm'],
  ['66', 'CABO CFOA-SM-AS80-S 36FO', 'm'],
  ['86', 'CABO CFOA-SM-AS-80-S 72FO', 'm'],
  ['1725', 'CABO CFOA-SM-AS80-S 144FO', 'm'],
  ['103', 'CEO CAIXA EMENDA OPT 72F DUAL SVM 6.5-12', 'und'],
  ['1643', 'SPLITTER BOX PLC 1X8 APC', 'und'],
  ['2029', 'SPLITTER BOX PLC 1X16 APC', 'und'],
  ['1760', 'ADESIVOS SPLITTER BOX - 10X10', 'und'],
  ['1066', 'GABINETE 18 - CTO (MONTADO C/SPLITTER 1x8)', 'und'],
  ['700', 'GABINETE 18 - CTO (DESMONTADO)', 'und'],
  ['1756', 'ADESIVO PARA CTO - INTERNO', 'und'],
  ['1682', 'ADESIVO PARA CTO - EXTERNO SEM IDENTIFICACAO', 'und'],
  ['1575', 'SPLITTER 1x8 CONECTORIZADO', 'und'],
  ['713', 'SPLITTER PLC 1x16 CONECTORIZADO SC/APC VERDE', 'und'],
  ['1758', 'SPLITTER 1X8 DESCONECTORIZADO', 'und'],
  ['204', 'SPLITTER 1X16 DESCONECTORIZADO', 'und'],
]

export const materiaisPublicos: Material[] = registros.map(([codigo, nome, unidade]) => ({
  id: `operacional-${codigo}`,
  nome,
  codigo,
  categoria: 'OPERACIONAL',
  unidade,
  pendenteCadastro: false,
}))
