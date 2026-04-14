import { ASSET, ENTITY_TYPE } from '@/common'
import { Entity } from '@/objects'

export class Tree extends Entity {
  public get class() {
    return ENTITY_TYPE.TREE
  }

  public get texture() {
    return ASSET.WORLD.OBJECT_2
  }

  public get config() {
    return {
      width: 4,
      height: 5,
      tiles: [
        [212, 213, 214, 215],
        [232, 233, 234, 235],
        [252, 253, 254, 255],
        [272, 273, 274, 275],
        [292, 293, 294, 295],
      ],
      overlap: [
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 0, 0, 1],
      ],
      collide: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
      ],
      action: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
      ],
    }
  }
}
