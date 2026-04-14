import Phaser from 'phaser';



import { ASSET, ENTITY_TYPE, SCENE } from '@/common';
import { Entity } from '@/objects';
import { HudScene } from '@/scenes/hud';





export class House extends Entity {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.setData({
      temp: 21,
      wood: 10,
      water: 10,
      food: 10,
    })
    this.on(Phaser.Data.Events.CHANGE_DATA, () => {
      this.scene.scene.get<HudScene>(SCENE.HUD).status.data.values =
        this.data.values
    })
  }

  public update() {
    super.update()
    this.data.values.temp -= 0.0001
    this.data.values.water -= 0.0001
  }

  public get class() {
    return ENTITY_TYPE.HOUSE
  }

  public get texture() {
    return ASSET.WORLD.OBJECT_1
  }

  public get config() {
    return {
      width: 5,
      height: 5,
      tiles: [
        [11, 12, 8, 9, 10],
        [51, 52, 48, 49, 50],
        [86, 87, 88, 89, 90],
        [126, 127, 176, 129, 130],
        [166, 167, 216, 169, 170],
      ],
      overlap: [
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 0, 1, 1],
      ],
      collide: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
      ],
      action: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
      ],
    }
  }
}
