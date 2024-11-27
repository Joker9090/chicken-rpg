import Phaser from "phaser";
import RPG from "@/game/rpg";

export class Timer extends Phaser.GameObjects.Container {

  constructor(
    scene: RPG,
    x: number,
    y: number,
  ) {
    super(scene, x, y);

    const graphics = this.scene.add.graphics()
    graphics.lineStyle(4, 0xffffff, 1);
    graphics.strokeRoundedRect(-75, -30, 120, 60, 15);

    const timer = this.scene.add.image(-40, 0, "reloj").setOrigin(0.5)
    const timerCounter = this.scene.add.text(0, 0, "0", {
      fontSize: 40,
      fontStyle: "bold"
    }).setOrigin(0, 0.5)

    // setInterval(() => {
    //   timerCounter.setText((Number(timerCounter.text) + 1).toString())
    //   const count = Number(timerCounter.text)
    //   if (count > 9 && count <= 99) {
    //     graphics.clear()
    //     graphics.lineStyle(4, 0xffffff, 1);
    //     graphics.strokeRoundedRect(-75, -30, 140, 60, 15);
    //   } else if (count === 100 && count <= 999) {
    //     graphics.clear()
    //     graphics.lineStyle(4, 0xffffff, 1);
    //     graphics.strokeRoundedRect(-75, -30, 170, 60, 15);
    //   } else if (count > 999) {
    //     graphics.clear()
    //     graphics.lineStyle(4, 0xffffff, 1);
    //     graphics.strokeRoundedRect(-75, -30, 200, 60, 15);
    //   }
    // }, 1000)

    const timerCall = this.scene.time.addEvent({
      delay: 1000, // ms
      callback: () => {
        timerCounter.setText((Number(timerCounter.text) + 1).toString())
        const count = Number(timerCounter.text)
        if (count > 9 && count <= 99) {
          graphics.clear()
          graphics.lineStyle(4, 0xffffff, 1);
          graphics.strokeRoundedRect(-75, -30, 140, 60, 15);
        } else if (count === 100 && count <= 999) {
          graphics.clear()
          graphics.lineStyle(4, 0xffffff, 1);
          graphics.strokeRoundedRect(-75, -30, 170, 60, 15);
        } else if (count > 999) {
          graphics.clear()
          graphics.lineStyle(4, 0xffffff, 1);
          graphics.strokeRoundedRect(-75, -30, 200, 60, 15);
        }
      },
      callbackScope: this,
      loop: true,
    });
    

    this.add([
      graphics,
      timer,
      timerCounter
    ])
  }

}

export class Bar extends Phaser.GameObjects.Container {
  constructor(
    scene: RPG,
    x: number,
    y: number,
    iconTexture: string,
  ) {
    super(scene, x, y);

    const graphics = this.scene.add.graphics()
    graphics.lineStyle(4, 0xffffff, 1);
    graphics.strokeRoundedRect(-10, -15, 200, 30, 30);
    // create a function that recieves a number and updates the fill of the bar
    const FillRect = (fill: number) => {
      graphics.clear()
      graphics.strokeRoundedRect(-10, -15, 200, 30, 30);
      graphics.lineStyle(4, 0xffffff, 1);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillRoundedRect(-10, -15, fill, 30, 15);
    }

    const icon = this.scene.add.image(0, 0, iconTexture).setOrigin(0.5).setScale(0.1)
    let fillNumber = 190

    const timerCall = this.scene.time.addEvent({
      delay: 1000, // ms
      callback: () => {
        fillNumber -= 1
        if (fillNumber < 150) icon.setTint(0xff0000);
        FillRect(fillNumber)
      },
      callbackScope: this,
      loop: true,
    });

    this.add([
      graphics,
      icon,
    ])
  }

}


export class Clock extends Phaser.GameObjects.Container {
  clockPointer: Phaser.GameObjects.Image;
  clock: Phaser.GameObjects.Image;
  timerCall: Phaser.Time.TimerEvent;
  constructor(
    scene: RPG,
    x: number,
    y: number,
  ) {
    super(scene, x, y);

    this.clock = this.scene.add.image(0, 0, 'clockDay').setOrigin(0.5).setScale(1)
    this.clockPointer = this.scene.add.image(0, 0, 'clockPointer').setOrigin(0.5).setScale(1).setRotation(-Math.PI/4)

    // this.timerCall = this.scene.time.addEvent({
    //   delay: 1000, // ms
    //   callback: () => {
    //     this.clockPointer.angle += Math.PI
    //   },
    //   callbackScope: this,
    //   loop: true,
    // });
    this.scene.tweens.add({
      targets: this.clockPointer,
      rotation: Math.PI*2 - Math.PI/4,
      duration: 60000,
      repeat: -1,
    })

    this.add([
      this.clock,
      this.clockPointer,
    ])
  }

  stopOrStartClock() {
    this.timerCall.paused = this.timerCall.paused ? false : true
  }

  setMomentDay(time: 1 | 2 | 3 | 4) {
    this.clockPointer.setRotation(time*Math.PI/2)
  }
}