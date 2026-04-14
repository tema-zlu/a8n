import Phaser from 'phaser'

import {
  ANIMATION,
  ASSET,
  DIRECTION,
  ENTITY_TYPE,
  ROBOT_JOB,
  ROBOT_STATE,
} from '@/common'
import { SCALE, TILE_SIZE } from '@/config'
import { Entity } from '@/objects'
import { Direction, RobotJob } from '@/types'

const IDLE_ANIMATION = {
  [ROBOT_STATE.IDLE]: {
    [DIRECTION.UP]: ANIMATION.ROBOT.IDLE_UP,
    [DIRECTION.RIGHT]: ANIMATION.ROBOT.IDLE_RIGHT,
    [DIRECTION.DOWN]: ANIMATION.ROBOT.IDLE_DOWN,
    [DIRECTION.LEFT]: ANIMATION.ROBOT.IDLE_LEFT,
  },
  [ROBOT_STATE.AXE]: {
    [DIRECTION.UP]: ANIMATION.ROBOT.AXE_IDLE_UP,
    [DIRECTION.RIGHT]: ANIMATION.ROBOT.AXE_IDLE_RIGHT,
    [DIRECTION.DOWN]: ANIMATION.ROBOT.AXE_IDLE_DOWN,
    [DIRECTION.LEFT]: ANIMATION.ROBOT.AXE_IDLE_LEFT,
  },
  [ROBOT_STATE.BASKET]: {
    [DIRECTION.UP]: ANIMATION.ROBOT.BASKET_IDLE_UP,
    [DIRECTION.RIGHT]: ANIMATION.ROBOT.BASKET_IDLE_RIGHT,
    [DIRECTION.DOWN]: ANIMATION.ROBOT.BASKET_IDLE_DOWN,
    [DIRECTION.LEFT]: ANIMATION.ROBOT.BASKET_IDLE_LEFT,
  },
  [ROBOT_STATE.BASKET_WOODS]: {
    [DIRECTION.UP]: ANIMATION.ROBOT.BASKET_WOODS_IDLE_UP,
    [DIRECTION.RIGHT]: ANIMATION.ROBOT.BASKET_WOODS_IDLE_RIGHT,
    [DIRECTION.DOWN]: ANIMATION.ROBOT.BASKET_WOODS_IDLE_DOWN,
    [DIRECTION.LEFT]: ANIMATION.ROBOT.BASKET_WOODS_IDLE_LEFT,
  },
  [ROBOT_STATE.BASKET_WATER]: {
    [DIRECTION.UP]: ANIMATION.ROBOT.BASKET_WATER_IDLE_UP,
    [DIRECTION.RIGHT]: ANIMATION.ROBOT.BASKET_WATER_IDLE_RIGHT,
    [DIRECTION.DOWN]: ANIMATION.ROBOT.BASKET_WATER_IDLE_DOWN,
    [DIRECTION.LEFT]: ANIMATION.ROBOT.BASKET_WATER_IDLE_LEFT,
  },
}

const MOVE_ANIMATION = {
  [ROBOT_STATE.IDLE]: {
    [DIRECTION.UP]: ANIMATION.ROBOT.WALK_UP,
    [DIRECTION.RIGHT]: ANIMATION.ROBOT.WALK_RIGHT,
    [DIRECTION.DOWN]: ANIMATION.ROBOT.WALK_DOWN,
    [DIRECTION.LEFT]: ANIMATION.ROBOT.WALK_LEFT,
  },
  [ROBOT_STATE.AXE]: {
    [DIRECTION.UP]: ANIMATION.ROBOT.AXE_WALK_UP,
    [DIRECTION.RIGHT]: ANIMATION.ROBOT.AXE_WALK_RIGHT,
    [DIRECTION.DOWN]: ANIMATION.ROBOT.AXE_WALK_DOWN,
    [DIRECTION.LEFT]: ANIMATION.ROBOT.AXE_WALK_LEFT,
  },
  [ROBOT_STATE.BASKET]: {
    [DIRECTION.UP]: ANIMATION.ROBOT.BASKET_WALK_UP,
    [DIRECTION.RIGHT]: ANIMATION.ROBOT.BASKET_WALK_RIGHT,
    [DIRECTION.DOWN]: ANIMATION.ROBOT.BASKET_WALK_DOWN,
    [DIRECTION.LEFT]: ANIMATION.ROBOT.BASKET_WALK_LEFT,
  },
  [ROBOT_STATE.BASKET_WOODS]: {
    [DIRECTION.UP]: ANIMATION.ROBOT.BASKET_WOODS_WALK_UP,
    [DIRECTION.RIGHT]: ANIMATION.ROBOT.BASKET_WOODS_WALK_RIGHT,
    [DIRECTION.DOWN]: ANIMATION.ROBOT.BASKET_WOODS_WALK_DOWN,
    [DIRECTION.LEFT]: ANIMATION.ROBOT.BASKET_WOODS_WALK_LEFT,
  },
  [ROBOT_STATE.BASKET_WATER]: {
    [DIRECTION.UP]: ANIMATION.ROBOT.BASKET_WATER_WALK_UP,
    [DIRECTION.RIGHT]: ANIMATION.ROBOT.BASKET_WATER_WALK_RIGHT,
    [DIRECTION.DOWN]: ANIMATION.ROBOT.BASKET_WATER_WALK_DOWN,
    [DIRECTION.LEFT]: ANIMATION.ROBOT.BASKET_WATER_WALK_LEFT,
  },
}

const WORK_ANIMATION = {
  [ROBOT_STATE.AXE]: {
    [DIRECTION.UP]: ANIMATION.ROBOT.AXE_SLASH_UP,
    [DIRECTION.RIGHT]: ANIMATION.ROBOT.AXE_SLASH_RIGHT,
    [DIRECTION.DOWN]: ANIMATION.ROBOT.AXE_SLASH_DOWN,
    [DIRECTION.LEFT]: ANIMATION.ROBOT.AXE_SLASH_LEFT,
  },
  [ROBOT_STATE.BASKET]: {
    [DIRECTION.UP]: ANIMATION.ROBOT.BASKET_THRUST_UP,
    [DIRECTION.RIGHT]: ANIMATION.ROBOT.BASKET_THRUST_RIGHT,
    [DIRECTION.DOWN]: ANIMATION.ROBOT.BASKET_THRUST_DOWN,
    [DIRECTION.LEFT]: ANIMATION.ROBOT.BASKET_THRUST_LEFT,
  },
}

const MOVE_CONFIG = {
  [DIRECTION.UP]: {
    to: { y: -2 * TILE_SIZE },
    diff: { y: -TILE_SIZE },
  },
  [DIRECTION.RIGHT]: {
    to: { x: 2 * TILE_SIZE },
    diff: { x: TILE_SIZE },
  },
  [DIRECTION.DOWN]: {
    to: { y: 2 * TILE_SIZE },
    diff: { y: TILE_SIZE },
  },
  [DIRECTION.LEFT]: {
    to: { x: -2 * TILE_SIZE },
    diff: { x: -TILE_SIZE },
  },
}

type ActionKeys = Record<'axe' | 'basket' | 'water', Phaser.Input.Keyboard.Key>

export class Robot extends Phaser.GameObjects.Container {
  public cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys
  public actionKeys?: ActionKeys

  public character: Phaser.GameObjects.Sprite
  public action: Phaser.GameObjects.Zone

  declare body: Phaser.Physics.Arcade.Body

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x * TILE_SIZE, y * TILE_SIZE)

    this.cursorKeys = this.scene.input.keyboard?.createCursorKeys()
    this.actionKeys = this.scene.input.keyboard?.addKeys({
      axe: Phaser.Input.Keyboard.KeyCodes.A,
      basket: Phaser.Input.Keyboard.KeyCodes.B,
      water: Phaser.Input.Keyboard.KeyCodes.W,
    }) as ActionKeys

    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)
    this.body?.setSize(TILE_SIZE, TILE_SIZE)
    this.body?.setOffset(0, 0)
    this.body?.setCollideWorldBounds(true)

    this.setDepth(2)
    this.setScale(1)
    this.setData({
      direction: DIRECTION.DOWN,
      state: ROBOT_STATE.BASKET,
      moving: false,
      working: 0,
      overlap: null,
      entity: null as Entity | null,
    })

    this.character = new Phaser.GameObjects.Sprite(
      scene,
      TILE_SIZE / 2,
      0,
      ASSET.OBJECT.ROBOT
    )
    this.character.setDepth(1)
    this.add(this.character)

    this.action = new Phaser.GameObjects.Zone(
      scene,
      TILE_SIZE / 2,
      TILE_SIZE / 2 + TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    )
    this.scene.physics.add.existing(this.action)
    // @ts-ignore
    this.action.body!.setSize(TILE_SIZE, TILE_SIZE)
    // @ts-ignore
    this.action.body!.setOffset(0, 0)
    this.action.setDepth(0)
    this.add(this.action)

    this.scene.cameras.main.startFollow(
      this,
      true,
      undefined,
      undefined,
      -TILE_SIZE / 2,
      -TILE_SIZE / 2
    )
  }

  public get coords() {
    return {
      x: this.x / TILE_SIZE,
      y: this.y / TILE_SIZE,
    }
  }

  public get direction() {
    if (this.data.values.working) {
      return
    }
    if (this.cursorKeys?.left.isDown) {
      return DIRECTION.LEFT
    } else if (this.cursorKeys?.right.isDown) {
      return DIRECTION.RIGHT
    } else if (this.cursorKeys?.up.isDown) {
      return DIRECTION.UP
    } else if (this.cursorKeys?.down.isDown) {
      return DIRECTION.DOWN
    }
    return
  }

  public get job() {
    if (this.data.values.working) {
      return
    }
    if (!this.data.values.entity) {
      return
    }
    switch (this.data.values.entity.class) {
      case ENTITY_TYPE.WELL:
        if (this.cursorKeys?.space.isDown) {
          return ROBOT_JOB.GET_WATER
        }
        return undefined
      case ENTITY_TYPE.TREE:
        if (this.cursorKeys?.space.isDown) {
          return ROBOT_JOB.CUT_TREE
        }
        return
      case ENTITY_TYPE.WOOD:
        if (this.cursorKeys?.space.isDown) {
          return ROBOT_JOB.GET_WOODS
        }
        return
      case ENTITY_TYPE.HOUSE:
        switch (this.data.values.state) {
          case ROBOT_STATE.BASKET_WATER:
            if (this.cursorKeys?.space.isDown) {
              return ROBOT_JOB.PUT_WATER
            }
            return
          case ROBOT_STATE.BASKET_WOODS:
            if (this.cursorKeys?.space.isDown) {
              return ROBOT_JOB.PUT_WOODS
            }
            return
          case ROBOT_STATE.BASKET:
            if (this.actionKeys?.basket.isDown) {
              return ROBOT_JOB.PUT_BASKET
            }
            return
          case ROBOT_STATE.AXE:
            if (this.actionKeys?.axe.isDown) {
              return ROBOT_JOB.PUT_AXE
            }
            return
          case ROBOT_STATE.IDLE:
            if (this.actionKeys?.basket.isDown) {
              return ROBOT_JOB.GET_BASKET
            }
            if (this.actionKeys?.axe.isDown) {
              return ROBOT_JOB.GET_AXE
            }
            return
        }
    }
  }

  public update() {
    super.update()
    if (this.data.values.overlap) {
      this.data.values.overlap()
    }
    if (this.data.values.action) {
      this.data.values.action()
    }
    if (this.direction) {
      this.move(this.direction)
    } else if (this.job) {
      this.work(this.job)
    } else {
      this.idle()
    }
    switch (this.data.values.direction) {
      case DIRECTION.UP:
        this.action.setPosition(TILE_SIZE / 2, TILE_SIZE / 2 - TILE_SIZE)
        break
      case DIRECTION.RIGHT:
        this.action.setPosition(TILE_SIZE / 2 + TILE_SIZE, TILE_SIZE / 2)
        break
      case DIRECTION.DOWN:
        this.action.setPosition(TILE_SIZE / 2, TILE_SIZE / 2 + TILE_SIZE)
        break
      case DIRECTION.LEFT:
        this.action.setPosition(TILE_SIZE / 2 - TILE_SIZE, TILE_SIZE / 2)
        break
    }
  }

  public turn(direction: Direction, callback?: Function) {
    this.data.values.direction = direction
    setTimeout(() => {
      callback?.()
    }, 100)
  }

  public move(direction: Direction, callback?: Function) {
    if (this.data.values.moving) {
      callback?.()
      return
    }
    this.data.values.moving = true
    this.data.values.direction = direction
    this.character.anims.play(
      MOVE_ANIMATION[this.data.values.state][direction] ||
        MOVE_ANIMATION.IDLE[direction],
      true
    )
    const { to, diff } = MOVE_CONFIG[direction]
    this.scene.tweens.add({
      targets: this.body?.velocity,
      ...to,
      duration: 500,
      ease: Phaser.Math.Easing.Stepped,
      onComplete: (_tween, _target, x, y) => {
        if (diff.x) {
          this.setX(this.x !== x ? x + diff.x : x)
        }
        if (diff.y) {
          this.setY(this.y !== y ? y + diff.y : y)
        }
        this.body?.setVelocity(0)
        this.data.values.moving = false
        callback?.()
      },
      onCompleteParams: [this.x, this.y],
    })
  }

  public idle() {
    if (this.data.values.moving || this.data.values.working) {
      return
    }
    this.data.values.moving = false
    clearTimeout(this.data.values.working)
    this.data.values.working = 0
    this.character.anims.play(
      IDLE_ANIMATION[this.data.values.state][this.data.values.direction],
      true
    )
  }

  public work(job: RobotJob, callback?: Function) {
    if (this.data.values.working) {
      callback?.()
      return
    }
    switch (job) {
      case ROBOT_JOB.GET_WATER:
        this.workGetWater(callback)
        break
      case ROBOT_JOB.PUT_WATER:
        this.workPutWater(callback)
        break
      case ROBOT_JOB.GET_WOODS:
        this.workGetWood(callback)
        break
      case ROBOT_JOB.PUT_WOODS:
        this.workPutWoods(callback)
        break
      case ROBOT_JOB.GET_BASKET:
        this.workGetBasket(callback)
        break
      case ROBOT_JOB.PUT_BASKET:
        this.workPutBasket(callback)
        break
      case ROBOT_JOB.GET_AXE:
        this.workGetAxe(callback)
        break
      case ROBOT_JOB.PUT_AXE:
        this.workPutAxe(callback)
        break
      case ROBOT_JOB.CUT_TREE:
        this.workCutTree(callback)
        break
      case ROBOT_JOB.ADD_TEMP:
        this.workAddTemp(callback)
        break
    }
  }

  public workGetWater(callback?: Function) {
    if (
      this.data.values.state !== ROBOT_STATE.BASKET ||
      this.data.values.entity?.class !== ENTITY_TYPE.WELL
    ) {
      callback?.()
      return
    }
    clearTimeout(this.data.values.working)
    this.character.anims.play(
      WORK_ANIMATION[this.data.values.state][this.data.values.direction],
      true
    )
    this.data.values.working = setTimeout(() => {
      clearTimeout(this.data.values.working)
      this.data.values.working = 0
      this.data.values.state = ROBOT_STATE.BASKET_WATER
      callback?.()
    }, 10 * this.character.anims.duration)
  }

  public workPutWater(callback?: Function) {
    if (
      this.data.values.state !== ROBOT_STATE.BASKET_WATER ||
      this.data.values.entity?.class !== ENTITY_TYPE.HOUSE
    ) {
      callback?.()
      return
    }
    clearTimeout(this.data.values.working)
    this.data.values.working = setTimeout(() => {
      clearTimeout(this.data.values.working)
      this.data.values.working = 0
      this.data.values.state = ROBOT_STATE.BASKET
      this.data.values.entity.data.values.water += 10
      callback?.()
    }, 100)
  }

  public workGetWood(callback?: Function) {
    if (
      this.data.values.state !== ROBOT_STATE.BASKET ||
      this.data.values.entity?.class !== ENTITY_TYPE.WOOD
    ) {
      callback?.()
      return
    }
    clearTimeout(this.data.values.working)
    this.character.anims.play(
      WORK_ANIMATION[this.data.values.state][this.data.values.direction],
      true
    )
    this.data.values.working = setTimeout(() => {
      clearTimeout(this.data.values.working)
      this.data.values.working = 0
      this.data.values.state = ROBOT_STATE.BASKET_WOODS
      this.data.values.entity.destroy(true)
      this.data.values.entity = null
      callback?.()
    }, 10 * this.character.anims.duration)
  }

  public workPutWoods(callback?: Function) {
    if (
      this.data.values.state !== ROBOT_STATE.BASKET_WOODS ||
      this.data.values.entity?.class !== ENTITY_TYPE.HOUSE
    ) {
      callback?.()
      return
    }
    clearTimeout(this.data.values.working)
    this.data.values.working = setTimeout(() => {
      clearTimeout(this.data.values.working)
      this.data.values.working = 0
      this.data.values.state = ROBOT_STATE.BASKET
      this.data.values.entity.data.values.wood += 5
      callback?.()
    }, 100)
  }

  public workGetAxe(callback?: Function) {
    if (
      this.data.values.state !== ROBOT_STATE.IDLE ||
      this.data.values.entity?.class !== ENTITY_TYPE.HOUSE
    ) {
      callback?.()
      return
    }
    clearTimeout(this.data.values.working)
    this.data.values.working = setTimeout(() => {
      clearTimeout(this.data.values.working)
      this.data.values.working = 0
      this.data.values.state = ROBOT_STATE.AXE
      callback?.()
    }, 100)
  }

  public workPutAxe(callback?: Function) {
    if (
      this.data.values.state !== ROBOT_STATE.AXE ||
      this.data.values.entity?.class !== ENTITY_TYPE.HOUSE
    ) {
      callback?.()
      return
    }
    clearTimeout(this.data.values.working)
    this.data.values.working = setTimeout(() => {
      clearTimeout(this.data.values.working)
      this.data.values.working = 0
      this.data.values.state = ROBOT_STATE.IDLE
      callback?.()
    }, 100)
  }

  public workGetBasket(callback?: Function) {
    if (
      this.data.values.state !== ROBOT_STATE.IDLE ||
      this.data.values.entity?.class !== ENTITY_TYPE.HOUSE
    ) {
      callback?.()
      return
    }
    clearTimeout(this.data.values.working)
    this.data.values.working = setTimeout(() => {
      clearTimeout(this.data.values.working)
      this.data.values.working = 0
      this.data.values.state = ROBOT_STATE.BASKET
      callback?.()
    }, 100)
  }

  public workPutBasket(callback?: Function) {
    if (
      this.data.values.state !== ROBOT_STATE.BASKET ||
      this.data.values.entity?.class !== ENTITY_TYPE.HOUSE
    ) {
      return
    }
    clearTimeout(this.data.values.working)
    this.data.values.working = setTimeout(() => {
      clearTimeout(this.data.values.working)
      this.data.values.working = 0
      this.data.values.state = ROBOT_STATE.IDLE
      callback?.()
    }, 100)
  }

  public workCutTree(callback?: Function) {
    if (
      this.data.values.state !== ROBOT_STATE.AXE ||
      this.data.values.entity?.class !== ENTITY_TYPE.TREE
    ) {
      return
    }
    clearTimeout(this.data.values.working)
    this.character.anims.play(
      WORK_ANIMATION[this.data.values.state][this.data.values.direction],
      true
    )
    this.data.values.working = setTimeout(() => {
      clearTimeout(this.data.values.working)
      this.data.values.working = 0
      this.data.values.entity.destroy(true)
      this.data.values.entity = null
      // @ts-ignore
      const entity = this.scene.createEntityFromTiledObject({
        type: ENTITY_TYPE.WOOD,
        x: (this.x + this.action.x - TILE_SIZE / 2) / SCALE,
        y: (this.y + this.action.y + TILE_SIZE / 2) / SCALE,
        width: TILE_SIZE / SCALE,
        height: (2 * TILE_SIZE) / SCALE,
      })
      // @ts-ignore
      this.scene.createRobotEntityColliders(entity)
      callback?.()
    }, 10 * this.character.anims.duration)
  }

  public workAddTemp(callback?: Function) {
    if (
      this.data.values.state !== ROBOT_STATE.IDLE ||
      this.data.values.entity?.class !== ENTITY_TYPE.HOUSE ||
      this.data.values.entity?.data.values.wood <= 0
    ) {
      callback?.()
      return
    }
    clearTimeout(this.data.values.working)
    this.data.values.working = setTimeout(() => {
      clearTimeout(this.data.values.working)
      this.data.values.working = 0
      this.data.values.entity.data.values.wood -= 1
      this.data.values.entity.data.values.temp += 2
      callback?.()
    }, 100)
  }
}
