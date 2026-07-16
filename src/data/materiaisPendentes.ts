import type { Material } from '../types'

export const materiaisPendentes: Material[] = [6, 12, 24, 36, 72, 144].map((fibras) => ({
  id: `kit-${fibras}-pendente`,
  nome: `KIT PARA CABO DE ${fibras} FIBRAS — PENDENTE DE CADASTRO`,
  codigo: null,
  categoria: 'KIT',
  subcategoria: `${fibras} fibras`,
  unidade: 'kit',
  pendenteCadastro: true,
}))
