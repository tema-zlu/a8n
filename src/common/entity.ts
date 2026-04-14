import { EntityType } from '@/types'

export const ENTITY_TYPE: Record<EntityType, EntityType> = {
  HOUSE: 'HOUSE',
  WELL: 'WELL',
  TREE: 'TREE',
  WOOD: 'WOOD',
} as const
