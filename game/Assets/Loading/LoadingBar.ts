import Phaser from "phaser";
import UI, { UIConfig } from "../UIassets/UI";

// Scene in class
class LoadingBar extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  holder: Phaser.GameObjects.Sprite;
  loadingGroup: Phaser.GameObjects.Group;
  amount?: number;
  
  constructor(scene: Phaser.Scene, x: number, y: number, amount: number) {
    super(scene, x, y);
    this.scene = scene;
    this.amount = amount;
    this.holder = this.scene.add.sprite(0, 0, "loadingBar").setOrigin(0, 0.5);
    this.loadingGroup = this.scene.add.group();
    let xpos = 0;
    if (amount)
      for (let i = 0; i < amount; i++) {
        xpos = i * 20 + 8;
        const loadConfig: UIConfig = {
          texture: "carga",
          pos: { x: xpos, y: 0 },
          scale: 1,
        };
        const load = new UI(this.scene, loadConfig, this.loadingGroup)
          .setOrigin(0, 0.5)
          .setScrollFactor(0, 0);
        this.add(load);
      }
    this.add([this.holder]);
    this.width = this.holder.width;
    scene.add.existing(this);
  }
}

export default LoadingBar;
