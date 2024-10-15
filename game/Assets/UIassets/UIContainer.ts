import Phaser from "phaser";
import RPG from "@/game/rpg";
import { Timer } from "./Timer";
import { ModalSettings } from "./ModalSettings";

export class UIContainer extends Phaser.GameObjects.Container {
  timer?: Timer
  modalSettings?: ModalSettings
  // coinCounter?: CoinCounter
  constructor(
    scene: RPG,
    x: number,
    y: number,
  ) {
    super(scene, x, y);
    
    this.timer = new Timer(scene, 100, 50);
    this.modalSettings = new ModalSettings(scene, 0, window.innerHeight)
    this.add([
      this.timer,
      this.modalSettings,
    ])

    scene.cameras.main.ignore(this)
    this.scene.add.existing(this)
  }

}