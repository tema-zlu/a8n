import * as Phaser from 'phaser';



import { SCENE } from '@/common';





export class HudScene extends Phaser.Scene {
  public status!: Phaser.GameObjects.Text

  constructor() {
    super({
      key: SCENE.HUD,
    })
  }

  public create() {
    this.status = this.add
      .text(10, 10, '')
      .setFill('#000000')
      .setFontSize(20)
      .setLineSpacing(10)
      .setData({
        temp: 0,
        water: 0,
        wood: 0,
      })
  }

  private get statusText() {
    const text: string[] = []
    if (this.status.data.values.temp !== undefined) {
      text.push(`🌡️ ${this.status.data.values.temp.toFixed(0)}`)
    }
    if (this.status.data.values.water !== undefined) {
      text.push(`💧️ ${this.status.data.values.water.toFixed(0)}`)
    }
    if (this.status.data.values.wood !== undefined) {
      text.push(`🪵 ${this.status.data.values.wood.toFixed(0)}`)
    }
    return text.join('\n')
  }

  public update(time: number, delta: number) {
    super.update(time, delta)
    this.status.setText(this.statusText)
  }
}
