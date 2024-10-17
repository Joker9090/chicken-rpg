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

    setInterval(() => {
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
      } else if (count > 999 ) {
        graphics.clear()
        graphics.lineStyle(4, 0xffffff, 1);
        graphics.strokeRoundedRect(-75, -30, 200, 60, 15); 
      }
    }, 1000)

    this.add([
        graphics,
        timer,
        timerCounter
    ])
  }

}