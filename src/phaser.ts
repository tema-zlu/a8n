import * as Phaser from 'phaser'

import { SCENE } from '@/common'
import { HudScene } from '@/scenes/hud'
import { PreloadScene } from '@/scenes/preload'
import { WorldScene } from '@/scenes/world'

const phaser = new Phaser.Game({
  type: Phaser.AUTO,
  autoFocus: true,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  input: {
    keyboard: false,
  },
  parent: 'phaser',
  scale: {
    width: 540,
    height: 540,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: '#000000',
})

phaser.scene.add(SCENE.PRELOAD, PreloadScene)
phaser.scene.add(SCENE.WORLD, WorldScene)
phaser.scene.add(SCENE.HUD, HudScene)

phaser.scene.start(SCENE.PRELOAD)
