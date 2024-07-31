import Phaser from "phaser";
import UI, { UIConfig } from "./UI";

// Scene in class
class BarLife extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  holder: Phaser.GameObjects.Sprite;
  lifeGroup: Phaser.GameObjects.Group;
  amount?: number;
  constructor(scene: Phaser.Scene, x: number, y: number, amount: number) {
    super(scene, x, y);
    this.scene = scene;
    this.amount = amount;
    this.holder = this.scene.add.sprite(0, 0, "holder").setOrigin(0, 0.5);
    this.lifeGroup = this.scene.add.group();
    let xpos = 0;
    if (amount)
      for (let i = 0; i < amount; i++) {
        xpos = i * 15 + 10;
        const lifeConfig: UIConfig = {
          texture: "barLife",
          pos: { x: xpos, y: 0 },
          scale: 1,
        };
        const coras = new UI(this.scene, lifeConfig, this.lifeGroup)
          .setOrigin(0, 0.5)
          .setScrollFactor(0, 0);
        this.add(coras);
      }
    this.add([this.holder]);
    this.width = this.holder.width;
    scene.add.existing(this);
  }

  updateLifes() {
    
  }
}

export default BarLife;
