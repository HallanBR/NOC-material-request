import type { Material } from '../types'
import { materiaisPublicos } from './materiaisPublicos'

export const materiais: Material[] = materiaisPublicos

export const materialPorCodigo = (codigo: string) =>
  materiais.find((material) => material.codigo === codigo)

export const materialPorId = (id: string) => materiais.find((material) => material.id === id)

export const categoriasMateriais = () =>
  [...new Set(materiais.map((material) => material.categoria))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  )
