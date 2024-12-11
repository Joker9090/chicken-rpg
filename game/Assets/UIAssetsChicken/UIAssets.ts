import Phaser from "phaser";
import RPG from "@/game/rpg";
import EventsCenterManager from "../../services/EventsCenter";


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

export class Avatar extends Phaser.GameObjects.Container {

    // avatarStats: Phaser.GameObjects.Image;
    // avatarBackground: Phaser.GameObjects.Image;
    // avatarGlow: Phaser.GameObjects.Image;
    // avatar: Phaser.GameObjects.Image;

  constructor(
    scene: RPG,
    x: number,
    y: number,
  ) {
    super(scene, x, y);



  
    this.add([
    ])
  }

}


export class DayBlock extends Phaser.GameObjects.Container {
  lineDayBlock: Phaser.GameObjects.Image;
  dayBlock1: Phaser.GameObjects.Image;
  dayBlock2: Phaser.GameObjects.Image;
  dayBlock3: Phaser.GameObjects.Image;
  dayBlock4: Phaser.GameObjects.Image;
  flecha: Phaser.GameObjects.Image;
  // timerCall: Phaser.Time.TimerEvent;
  eventCenter = EventsCenterManager.getInstance();

  constructor(
    scene: RPG,
    x: number,
    y: number,
  ) {
    super(scene, x, y);

    this.dayBlock1 = this.scene.add.image(0, 0, 'dayBlock1').setOrigin(0.5)
    const widthBlock = this.dayBlock1.width / 2
    const heightBlock = this.dayBlock1.height
    this.dayBlock1.setPosition(-widthBlock * 1.5 - 30, heightBlock / 2 + 15).setScale(0.5)
    this.dayBlock2 = this.scene.add.image(-widthBlock * .5 - 10, heightBlock / 2 + 15, 'dayBlock2').setOrigin(0.5).setScale(0.5)
    this.dayBlock3 = this.scene.add.image(widthBlock * .5 + 10, heightBlock / 2 + 15, 'dayBlock3').setOrigin(0.5).setScale(0.5)
    this.dayBlock4 = this.scene.add.image(widthBlock * 1.5 + 30, heightBlock / 2 + 15, 'dayBlock4').setOrigin(0.5).setScale(0.5)
    this.lineDayBlock = this.scene.add.image(0, heightBlock / 2 + 15, 'lineDayBlocks').setOrigin(0.5)
    const arrowPossiblePositions = [this.dayBlock1.x, this.dayBlock2.x, this.dayBlock3.x, this.dayBlock4.x]
    this.flecha = this.scene.add.image(arrowPossiblePositions[0], 15, 'flecha').setOrigin(0.5).setScale(0.5)

    this.add([
      this.lineDayBlock,
      this.dayBlock1,
      this.dayBlock2,
      this.dayBlock3,
      this.dayBlock4,
      this.flecha
    ])

    this.setActiveBlock(0)
  }

  setActiveBlock(blockDay: number) {
    switch (blockDay) {
      case 0:
        this.dayBlock1.setTexture("dayBlock1Active")
        break;
      case 1:
        this.dayBlock2.setTexture("dayBlock2Active")
        break;
      case 2:
        this.dayBlock3.setTexture("dayBlock3Active")
        break;
      case 3:
        this.dayBlock4.setTexture("dayBlock4Active")
        break;
      default:
        this.dayBlock1.setTexture("dayBlock1Active")
        break;
    }
  }

  passTime(amount: number) {

  }
}