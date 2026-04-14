import { ASSET, ENTITY_TYPE } from '@/common'
import { Entity } from '@/objects'

export class Well extends Entity {
  public get class() {
    return ENTITY_TYPE.WELL
  }

  public get texture() {
    return ASSET.WORLD.OBJECT_2
  }

  public get config() {
    return {
      width: 3,
      height: 5,
      tiles: [
        [280, 281, 282],
        [300, 301, 302],
        [320, 321, 322],
        [340, 341, 342],
        [360, 361, 362],
      ],
      overlap: [
        [1, 1, 0],
        [1, 1, 1],
        [1, 1, 1],
        [0, 0, 0],
        [0, 0, 0],
      ],
      collide: [
        [0, 0, 0],
        [0, 0, 0],
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 0],
      ],
      action: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
    }
  }
}
