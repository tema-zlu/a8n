import * as Phaser from 'phaser';



import { ANIMATION, ASSET, SCENE } from '@/common';
import { AnimationConfig } from '@/types';





const ROBOT_ANIMATIONS: [string, string, number, number][] = [
  [ANIMATION.ROBOT.IDLE_UP, ASSET.ANIMATION.ROBOT_IDLE, 0, 1],
  [ANIMATION.ROBOT.IDLE_LEFT, ASSET.ANIMATION.ROBOT_IDLE, 9, 10],
  [ANIMATION.ROBOT.IDLE_DOWN, ASSET.ANIMATION.ROBOT_IDLE, 18, 19],
  [ANIMATION.ROBOT.IDLE_RIGHT, ASSET.ANIMATION.ROBOT_IDLE, 27, 28],
  [ANIMATION.ROBOT.WALK_UP, ASSET.ANIMATION.ROBOT_WALK, 1, 8],
  [ANIMATION.ROBOT.WALK_LEFT, ASSET.ANIMATION.ROBOT_WALK, 10, 17],
  [ANIMATION.ROBOT.WALK_DOWN, ASSET.ANIMATION.ROBOT_WALK, 19, 26],
  [ANIMATION.ROBOT.WALK_RIGHT, ASSET.ANIMATION.ROBOT_WALK, 28, 35],
  [ANIMATION.ROBOT.AXE_IDLE_UP, ASSET.ANIMATION.ROBOT_AXE_WALK, 0, 0],
  [ANIMATION.ROBOT.AXE_IDLE_LEFT, ASSET.ANIMATION.ROBOT_AXE_WALK, 9, 9],
  [ANIMATION.ROBOT.AXE_IDLE_DOWN, ASSET.ANIMATION.ROBOT_AXE_WALK, 18, 18],
  [ANIMATION.ROBOT.AXE_IDLE_RIGHT, ASSET.ANIMATION.ROBOT_AXE_WALK, 27, 27],
  [ANIMATION.ROBOT.AXE_WALK_UP, ASSET.ANIMATION.ROBOT_AXE_WALK, 1, 8],
  [ANIMATION.ROBOT.AXE_WALK_LEFT, ASSET.ANIMATION.ROBOT_AXE_WALK, 10, 17],
  [ANIMATION.ROBOT.AXE_WALK_DOWN, ASSET.ANIMATION.ROBOT_AXE_WALK, 19, 26],
  [ANIMATION.ROBOT.AXE_WALK_RIGHT, ASSET.ANIMATION.ROBOT_AXE_WALK, 28, 35],
  [ANIMATION.ROBOT.AXE_SLASH_UP, ASSET.ANIMATION.ROBOT_AXE_SLASH, 1, 6],
  [ANIMATION.ROBOT.AXE_SLASH_LEFT, ASSET.ANIMATION.ROBOT_AXE_SLASH, 10, 15],
  [ANIMATION.ROBOT.AXE_SLASH_DOWN, ASSET.ANIMATION.ROBOT_AXE_SLASH, 19, 24],
  [ANIMATION.ROBOT.AXE_SLASH_RIGHT, ASSET.ANIMATION.ROBOT_AXE_SLASH, 28, 33],
  [ANIMATION.ROBOT.BASKET_IDLE_UP, ASSET.ANIMATION.ROBOT_BASKET_WALK, 0, 0],
  [ANIMATION.ROBOT.BASKET_IDLE_LEFT, ASSET.ANIMATION.ROBOT_BASKET_WALK, 9, 9],
  [ANIMATION.ROBOT.BASKET_IDLE_DOWN, ASSET.ANIMATION.ROBOT_BASKET_WALK, 18, 18],
  [
    ANIMATION.ROBOT.BASKET_IDLE_RIGHT,
    ASSET.ANIMATION.ROBOT_BASKET_WALK,
    27,
    27,
  ],
  [ANIMATION.ROBOT.BASKET_WALK_UP, ASSET.ANIMATION.ROBOT_BASKET_WALK, 1, 7],
  [ANIMATION.ROBOT.BASKET_WALK_LEFT, ASSET.ANIMATION.ROBOT_BASKET_WALK, 10, 16],
  [ANIMATION.ROBOT.BASKET_WALK_DOWN, ASSET.ANIMATION.ROBOT_BASKET_WALK, 19, 25],
  [
    ANIMATION.ROBOT.BASKET_WALK_RIGHT,
    ASSET.ANIMATION.ROBOT_BASKET_WALK,
    28,
    34,
  ],
  [ANIMATION.ROBOT.BASKET_THRUST_UP, ASSET.ANIMATION.ROBOT_BASKET_THRUST, 1, 7],
  [
    ANIMATION.ROBOT.BASKET_THRUST_LEFT,
    ASSET.ANIMATION.ROBOT_BASKET_THRUST,
    10,
    16,
  ],
  [
    ANIMATION.ROBOT.BASKET_THRUST_DOWN,
    ASSET.ANIMATION.ROBOT_BASKET_THRUST,
    19,
    25,
  ],
  [
    ANIMATION.ROBOT.BASKET_THRUST_RIGHT,
    ASSET.ANIMATION.ROBOT_BASKET_THRUST,
    28,
    34,
  ],
  [
    ANIMATION.ROBOT.BASKET_WOODS_IDLE_UP,
    ASSET.ANIMATION.ROBOT_BASKET_WOODS_WALK,
    0,
    0,
  ],
  [
    ANIMATION.ROBOT.BASKET_WOODS_IDLE_LEFT,
    ASSET.ANIMATION.ROBOT_BASKET_WOODS_WALK,
    9,
    9,
  ],
  [
    ANIMATION.ROBOT.BASKET_WOODS_IDLE_DOWN,
    ASSET.ANIMATION.ROBOT_BASKET_WOODS_WALK,
    18,
    18,
  ],
  [
    ANIMATION.ROBOT.BASKET_WOODS_IDLE_RIGHT,
    ASSET.ANIMATION.ROBOT_BASKET_WOODS_WALK,
    27,
    27,
  ],
  [
    ANIMATION.ROBOT.BASKET_WOODS_WALK_UP,
    ASSET.ANIMATION.ROBOT_BASKET_WOODS_WALK,
    1,
    8,
  ],
  [
    ANIMATION.ROBOT.BASKET_WOODS_WALK_LEFT,
    ASSET.ANIMATION.ROBOT_BASKET_WOODS_WALK,
    10,
    17,
  ],
  [
    ANIMATION.ROBOT.BASKET_WOODS_WALK_DOWN,
    ASSET.ANIMATION.ROBOT_BASKET_WOODS_WALK,
    19,
    26,
  ],
  [
    ANIMATION.ROBOT.BASKET_WOODS_WALK_RIGHT,
    ASSET.ANIMATION.ROBOT_BASKET_WOODS_WALK,
    28,
    34,
  ],
  [
    ANIMATION.ROBOT.BASKET_WATER_IDLE_UP,
    ASSET.ANIMATION.ROBOT_BASKET_WATER_WALK,
    0,
    0,
  ],
  [
    ANIMATION.ROBOT.BASKET_WATER_IDLE_LEFT,
    ASSET.ANIMATION.ROBOT_BASKET_WATER_WALK,
    9,
    9,
  ],
  [
    ANIMATION.ROBOT.BASKET_WATER_IDLE_DOWN,
    ASSET.ANIMATION.ROBOT_BASKET_WATER_WALK,
    18,
    18,
  ],
  [
    ANIMATION.ROBOT.BASKET_WATER_IDLE_RIGHT,
    ASSET.ANIMATION.ROBOT_BASKET_WATER_WALK,
    27,
    27,
  ],
  [
    ANIMATION.ROBOT.BASKET_WATER_WALK_UP,
    ASSET.ANIMATION.ROBOT_BASKET_WATER_WALK,
    1,
    8,
  ],
  [
    ANIMATION.ROBOT.BASKET_WATER_WALK_LEFT,
    ASSET.ANIMATION.ROBOT_BASKET_WATER_WALK,
    10,
    17,
  ],
  [
    ANIMATION.ROBOT.BASKET_WATER_WALK_DOWN,
    ASSET.ANIMATION.ROBOT_BASKET_WATER_WALK,
    19,
    26,
  ],
  [
    ANIMATION.ROBOT.BASKET_WATER_WALK_RIGHT,
    ASSET.ANIMATION.ROBOT_BASKET_WATER_WALK,
    28,
    34,
  ],
]

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENE.PRELOAD,
    })
  }

  public create() {
    this.scene.bringToTop()
    this.createAnimation(ROBOT_ANIMATIONS)
    this.scene.start(SCENE.WORLD)
    this.scene.start(SCENE.HUD)
  }

  public preload() {
    this.load.tilemapTiledJSON(ASSET.WORLD.MAP, 'assets/tilemap.json')
    this.load.image(ASSET.WORLD.TILESET_COLLIDE, 'assets/collide.png')
    this.load.image(ASSET.WORLD.TILESET_1, 'assets/tileset-1.png')
    this.load.image(ASSET.WORLD.TILESET_2, 'assets/tileset-2.png')
    this.load.spritesheet({
      key: ASSET.WORLD.OBJECT_1,
      url: 'assets/tileset-1.png',
      frameConfig: {
        frameWidth: 16,
        frameHeight: 16,
      },
    })
    this.load.spritesheet({
      key: ASSET.WORLD.OBJECT_2,
      url: 'assets/tileset-2.png',
      frameConfig: {
        frameWidth: 16,
        frameHeight: 16,
      },
    })
    this.loadRobot()
  }

  public loadRobot() {
    this.load.spritesheet({
      key: ASSET.ANIMATION.ROBOT_IDLE,
      url: 'assets/robot/idle.png',
      frameConfig: {
        frameWidth: 128,
        frameHeight: 128,
      },
    })
    this.load.spritesheet({
      key: ASSET.ANIMATION.ROBOT_WALK,
      url: 'assets/robot/walk.png',
      frameConfig: {
        frameWidth: 128,
        frameHeight: 128,
      },
    })
    this.load.spritesheet({
      key: ASSET.ANIMATION.ROBOT_AXE_WALK,
      url: 'assets/robot/axe-walk.png',
      frameConfig: {
        frameWidth: 128,
        frameHeight: 128,
      },
    })
    this.load.spritesheet({
      key: ASSET.ANIMATION.ROBOT_AXE_SLASH,
      url: 'assets/robot/axe-slash.png',
      frameConfig: {
        frameWidth: 128,
        frameHeight: 128,
      },
    })
    this.load.spritesheet({
      key: ASSET.ANIMATION.ROBOT_BASKET_WALK,
      url: 'assets/robot/basket-walk.png',
      frameConfig: {
        frameWidth: 128,
        frameHeight: 128,
      },
    })
    this.load.spritesheet({
      key: ASSET.ANIMATION.ROBOT_BASKET_THRUST,
      url: 'assets/robot/basket-thrust.png',
      frameConfig: {
        frameWidth: 128,
        frameHeight: 128,
      },
    })
    this.load.spritesheet({
      key: ASSET.ANIMATION.ROBOT_BASKET_WOODS_WALK,
      url: 'assets/robot/basket-woods-walk.png',
      frameConfig: {
        frameWidth: 128,
        frameHeight: 128,
      },
    })
    this.load.spritesheet({
      key: ASSET.ANIMATION.ROBOT_BASKET_WATER_WALK,
      url: 'assets/robot/basket-water-walk.png',
      frameConfig: {
        frameWidth: 128,
        frameHeight: 128,
      },
    })
  }

  public createAnimation(config: AnimationConfig) {
    config.forEach(([key, sprite, start, end]) => {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(sprite, {
          start,
          end,
        }),
        frameRate: 10,
        repeat: -1,
      })
    })
  }
}
