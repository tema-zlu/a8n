import * as Phaser from 'phaser'

import { DIRECTION } from '@/common'
import { SCALE, TILE_SIZE } from '@/config'
import { WorldScene } from '@/scenes/world'
import { Coords, Direction, EntityConfig, EntityType } from '@/types'

export abstract class Entity extends Phaser.GameObjects.Container {
  declare scene: WorldScene

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x * SCALE, y * SCALE)
    this.scene.add.existing(this)
    this.scene.entities.add(this)
    this.setDepth(1)
    this.setScale(1)
    this.create()
  }

  public create() {
    for (let x = 0; x < this.config.width; x++) {
      for (let y = 0; y < this.config.height; y++) {
        this.add(
          this.scene.physics.add
            .image(
              x * TILE_SIZE + TILE_SIZE / 2,
              y * TILE_SIZE + TILE_SIZE / 2,
              this.texture,
              this.config.tiles[y][x]
            )
            .setImmovable()
            .setScale(SCALE)
            .setData({
              overlap: Boolean(this.config.overlap[y][x]),
              collide: Boolean(this.config.collide[y][x]),
              action: Boolean(this.config.action[y][x]),
            })
        )
        if (this.config.collide[y][x]) {
          this.scene.graph.addNode(
            `${this.coords.x + x}-${this.coords.y + y}`,
            {
              x: this.coords.x + x,
              y: this.coords.y + y,
              blocked: [
                DIRECTION.UP,
                DIRECTION.RIGHT,
                DIRECTION.DOWN,
                DIRECTION.LEFT,
              ],
            }
          )
        }
      }
    }
    this.createGraphNodeLinks()
  }

  public preDestroy() {
    super.preDestroy()
    for (let x = 0; x < this.config.width; x++) {
      for (let y = 0; y < this.config.height; y++) {
        if (this.config.collide[y][x]) {
          this.scene.graph.addNode(
            `${this.coords.x + x}-${this.coords.y + y}`,
            {
              x: this.coords.x + x,
              y: this.coords.y + y,
              blocked: [],
            }
          )
        }
      }
    }
    this.createGraphNodeLinks()
    this.scene.entities.delete(this)
  }

  public createGraphNodeLinks() {
    for (let x = -1; x < this.config.width + 1; x++) {
      for (let y = -1; y < this.config.height + 1; y++) {
        const node = this.scene.graph.getNode(
          `${this.coords.x + x}-${this.coords.y + y}`
        )
        if (node) {
          this.scene.createGraphNodeLinks(node)
        }
      }
    }
  }

  public abstract get class(): EntityType

  public abstract get texture(): string

  public abstract get config(): EntityConfig

  public get collide() {
    return this.getAll().filter((image) => image.data.values.collide)
  }

  public get overlap() {
    return this.getAll().filter((image) => image.data.values.overlap)
  }

  public get action() {
    return this.getAll().filter((image) => image.data.values.action)
  }

  public get nearActionCoords() {
    const coords: (Coords & { direction: Direction })[] = []
    for (let x = 0; x < this.config.width; x++) {
      for (let y = 0; y < this.config.height; y++) {
        if (this.config.action[y][x]) {
          coords.push(
            {
              x: this.coords.x + x,
              y: this.coords.y + y - 1,
              direction: DIRECTION.DOWN,
            },
            {
              x: this.coords.x + x + 1,
              y: this.coords.y + y,
              direction: DIRECTION.LEFT,
            },
            {
              x: this.coords.x + x,
              y: this.coords.y + y + 1,
              direction: DIRECTION.UP,
            },
            {
              x: this.coords.x + x - 1,
              y: this.coords.y + y,
              direction: DIRECTION.RIGHT,
            }
          )
        }
      }
    }
    return coords
  }

  public get coords() {
    return {
      x: this.x / TILE_SIZE,
      y: this.y / TILE_SIZE,
    }
  }
}
