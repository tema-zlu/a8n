import { ASSET, ENTITY_TYPE } from '@/common'
import { Entity } from '@/objects'

export class Wood extends Entity {
  public get class() {
    return ENTITY_TYPE.WOOD
  }

  public get texture() {
    return ASSET.WORLD.OBJECT_2
  }

  public get config() {
    return {
      width: 1,
      height: 2,
      tiles: [[4], [24]],
      overlap: [[1], [0]],
      collide: [[0], [1]],
      action: [[0], [1]],
    }
  }
}
