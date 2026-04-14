import createGraph, { Graph, Node } from 'ngraph.graph'
import { aStar, PathFinder } from 'ngraph.path'
import * as Phaser from 'phaser'

import { ASSET, DIRECTION, ENTITY_TYPE, ROBOT_STATE, SCENE } from '@/common'
import { SCALE } from '@/config'
import { Entity, House, Robot, Tree, Well, Wood } from '@/objects'
import { sval } from '@/sval'
import {
  Coords,
  Direction,
  EntityType,
  GraphLinkData,
  GraphNodeData,
  RobotJob,
} from '@/types'

import TiledObject = Phaser.Types.Tilemaps.TiledObject

export class WorldScene extends Phaser.Scene {
  public robot!: Robot
  public tilemap!: Phaser.Tilemaps.Tilemap
  public graph!: Graph<GraphNodeData, GraphLinkData>
  public pathFinder!: PathFinder<GraphNodeData>
  public layers!: Phaser.Tilemaps.TilemapLayer[]
  public entities!: Set<Entity>

  constructor() {
    super({
      key: SCENE.WORLD,
    })
    this.entities = new Set()
  }

  public create() {
    this.createGraph()
    this.createMap()
    this.createRobot()
    this.createEntities()
    this.createGraphLinks()
    this.createColliders()
    this.createBlockly()
  }

  public update() {
    this.robot.update()
    this.entities.forEach((entity) => entity.update())
  }

  public createGraph() {
    this.graph = createGraph()
    this.pathFinder = aStar(this.graph, {
      oriented: true,
      blocked: (_from, _to, link) => link.data.blocked,
      distance: () => 1,
    })
  }

  public createMap() {
    this.tilemap = this.make.tilemap({ key: ASSET.WORLD.MAP })

    const tilesets = [
      this.tilemap.addTilesetImage('collide', ASSET.WORLD.TILESET_COLLIDE),
      this.tilemap.addTilesetImage('tileset-1', ASSET.WORLD.TILESET_1),
      this.tilemap.addTilesetImage('tileset-2', ASSET.WORLD.TILESET_2),
    ].filter((tileset) => !!tileset)

    this.physics.world.setBounds(
      0,
      0,
      this.tilemap.widthInPixels * SCALE,
      this.tilemap.heightInPixels * SCALE
    )

    this.layers = this.tilemap.layers
      .map(({ name, x, y, visible, data }, i) => {
        data.forEach((tiles) => {
          tiles.forEach((tile) => {
            if (tile.index === -1) {
              return
            }
            const node = this.graph.addNode(`${tile.x}-${tile.y}`, {
              x: tile.x,
              y: tile.y,
              blocked: [],
            })
            if (tile.properties.ge_collide || tile.properties.ge_collide_up) {
              node.data.blocked.push(DIRECTION.UP)
            }
            if (
              tile.properties.ge_collide ||
              tile.properties.ge_collide_right
            ) {
              node.data.blocked.push(DIRECTION.RIGHT)
            }
            if (tile.properties.ge_collide || tile.properties.ge_collide_down) {
              node.data.blocked.push(DIRECTION.DOWN)
            }
            if (tile.properties.ge_collide || tile.properties.ge_collide_left) {
              node.data.blocked.push(DIRECTION.LEFT)
            }
          })
        })
        const layer = this.tilemap.createLayer(name, tilesets, x, y)
        if (!layer) {
          return undefined
        }
        layer.setScale(SCALE)
        layer.setVisible(visible)
        if (name.startsWith('behind/')) {
          layer.setDepth(10)
        }
        layer.setCollisionByProperty({
          ge_collide: true,
          // ge_collide_up: true,
          // ge_collide_right: true,
          // ge_collide_down: true,
          // ge_collide_left: true,
        })
        return layer
      })
      .filter((layer) => !!layer)
  }

  public createGraphLinks() {
    this.graph.forEachNode((node) => {
      this.createGraphNodeLinks(node)
    })
  }

  public createGraphNodeLinks(node: Node<GraphNodeData>) {
    const up = this.graph.getNode(`${node.data.x}-${node.data.y - 1}`)
    const right = this.graph.getNode(`${node.data.x + 1}-${node.data.y}`)
    const down = this.graph.getNode(`${node.data.x}-${node.data.y + 1}`)
    const left = this.graph.getNode(`${node.data.x - 1}-${node.data.y}`)
    if (up) {
      this.graph.addLink(node.id, up.id, {
        direction: DIRECTION.UP,
        blocked: up.data.blocked.includes(DIRECTION.DOWN),
      })
    }
    if (right) {
      this.graph.addLink(node.id, right.id, {
        direction: DIRECTION.RIGHT,
        blocked: right.data.blocked.includes(DIRECTION.LEFT),
      })
    }
    if (down) {
      this.graph.addLink(node.id, down.id, {
        direction: DIRECTION.DOWN,
        blocked: down.data.blocked.includes(DIRECTION.UP),
      })
    }
    if (left) {
      this.graph.addLink(node.id, left.id, {
        direction: DIRECTION.LEFT,
        blocked: left.data.blocked.includes(DIRECTION.RIGHT),
      })
    }
  }

  public createRobot() {
    // house
    // this.robot = new Robot(this, 80, 100)
    this.robot = new Robot(this, 78, 96)
    this.robot.data.values.state = ROBOT_STATE.IDLE
    // trees
    // this.robot = new Robot(this, 30, 20)
    // this.robot.data.values.state = ROBOT_STATE.AXE
    // this.robot.data.values.state = ROBOT_STATE.BASKET_WOODS
    // woods
    // this.robot = new Robot(this, 100, 60)
    // this.robot.data.values.state = ROBOT_STATE.BASKET
    // well
    // this.robot = new Robot(this, 25, 90)
    // this.robot.data.values.state = ROBOT_STATE.BASKET
  }

  public createEntities() {
    this.tilemap
      .getObjectLayerNames()
      .map((name) => this.tilemap.getObjectLayer(name))
      .filter((layer) => !!layer)
      .flatMap((layer) => layer.objects)
      .forEach((object) => this.createEntityFromTiledObject(object))
  }

  public createEntityFromTiledObject = (object: Partial<TiledObject>) => {
    if (
      object.x === undefined ||
      object.y === undefined ||
      object.height === undefined
    ) {
      return
    }
    switch (object.type) {
      case ENTITY_TYPE.HOUSE:
        return new House(this, object.x, object.y - object.height)
      case ENTITY_TYPE.TREE:
        return new Tree(this, object.x, object.y - object.height)
      case ENTITY_TYPE.WOOD:
        return new Wood(this, object.x, object.y - object.height)
      case ENTITY_TYPE.WELL:
        return new Well(this, object.x, object.y - object.height)
    }
  }

  public createColliders() {
    const entities = this.entities.values().toArray()
    this.physics.add.collider(this.robot, this.layers)
    entities.forEach((entity) => this.createRobotEntityColliders(entity))
  }

  public createRobotEntityColliders(entity: Entity) {
    this.physics.add.collider(this.robot, entity.collide)
    this.physics.add.overlap(
      this.robot,
      entity.overlap,
      this.handleRobotEntityOverlap
    )
    this.physics.add.overlap(
      this.robot.action,
      entity.action,
      this.handleRobotEntityAction
    )
  }

  public createBlockly() {
    const game = {
      queue: [] as Function[],
      main: () => void 0,
      process: () => {
        game.queue.shift()?.()
      },
      update: () => {
        if (game.queue.length === 0) {
          game.main()
        }
      },
      start: () => {
        this.events.on(Phaser.Scenes.Events.UPDATE, game.update)
        game.update()
        game.process()
      },
      stop: () => {
        this.events.off(Phaser.Scenes.Events.UPDATE, game.update)
        game.queue = []
      },
      robotWork: (job: RobotJob) => {
        game.queue.push(() => this.robot.work(job, game.process))
      },
      robotTurn: (direction: Direction) => {
        game.queue.push(() => this.robot.turn(direction, game.process))
      },
      robotMove: (direction: Direction) => {
        game.queue.push(() => this.robot.move(direction, game.process))
      },
      robotMoveTo: (coords: Coords) => {
        game.queue.push(() => {
          this.findPath(this.robot.coords, coords).forEach((direction) =>
            game.queue.unshift(() => this.robot.move(direction, game.process))
          )
          game.process()
        })
      },
      robotMoveToEntity: (type: EntityType) => {
        game.queue.push(() => {
          const directions = this.entities
            .values()
            .toArray()
            .filter((entity) => entity.class === type)
            .flatMap((entity) => entity.nearActionCoords)
            .map((coords) =>
              this.findPath(this.robot.coords, coords, coords.direction)
            )
            .filter((directions) => directions.length > 0)
            .sort((a, b) => (a.length > b.length ? 1 : -1))
            .at(0)
          if (!directions) {
            return
          }
          directions.forEach((direction, i) => {
            if (i === 0) {
              game.queue.unshift(() => this.robot.turn(direction, game.process))
            } else {
              game.queue.unshift(() => this.robot.move(direction, game.process))
            }
          })
          game.process()
        })
      },
    }
    sval.import({ game })
  }

  public findPath(
    from: { x: number; y: number },
    to: { x: number; y: number },
    direction?: Direction
  ) {
    const nodes = this.pathFinder.find(`${from.x}-${from.y}`, `${to.x}-${to.y}`)
    if (
      nodes.length === 0 ||
      (nodes.length === 1 && (from.x !== to.x || from.y !== to.y))
    ) {
      // console.warn(`no path found from ${from.x}-${from.y} to ${to.x}-${to.y}`)
      return []
    }
    const directions: Direction[] = []
    if (direction) {
      directions.push(direction)
    }
    for (let i = 0; i < nodes.length - 1; i++) {
      const link = this.graph.getLink(nodes[i + 1].id, nodes[i].id)
      if (!link) {
        // console.warn(`no link found from ${nodes[i + 1].id} to ${nodes[i].id}`)
        return []
      }
      directions.push(link.data.direction)
    }
    return directions
  }

  private handleRobotEntityOverlap: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback =
    (obj1, obj2) => {
      const robot = obj1 as Robot
      const entity = (obj2 as Phaser.Physics.Arcade.Image)
        .parentContainer as Entity
      if (robot.data.values.overlap) {
        return
      }
      entity.setDepth(robot.depth + 1)
      robot.data.values.overlap = () => {
        if (this.physics.overlap(robot, entity.overlap)) {
          return
        }
        entity.setDepth(robot.depth - 1)
        robot.data.values.overlap = null
      }
    }

  private handleRobotEntityAction: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback =
    (obj1, obj2) => {
      const robot = (obj1 as Phaser.GameObjects.Zone).parentContainer as Robot
      const entity = (obj2 as Phaser.Physics.Arcade.Image)
        .parentContainer as Entity
      if (robot.data.values.action) {
        return
      }
      robot.data.values.entity = entity
      robot.data.values.action = () => {
        if (this.physics.overlap(robot.action, entity.action)) {
          return
        }
        robot.data.values.action = null
        robot.data.values.entity = null
      }
    }
}
