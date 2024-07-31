import LevelMenu from "@/game/LevelMenu";
import Phaser from "phaser";

export type lvlSlotConfig = {
  texture: string[];
  pos: {
    x: number;
    y: number;
  };
  scale: number;
  visible: boolean;
  id: number;
  function: Function;
};

// Scene in class
class lvlSlot extends Phaser.GameObjects.Image {
  scene: LevelMenu;
  groupItem?: Phaser.GameObjects.Group;
  text?: Phaser.GameObjects.Text;
  constructor(
    scene: LevelMenu,
    config: lvlSlotConfig,
    group?: Phaser.GameObjects.Group
  ) {
    super(
      scene,
      config.pos.x,
      config.pos.y,
      config.visible ? config.texture[0] : config.texture[1]
    );

    this.scene = scene;
    scene.add.existing(this);
    this.setDepth(100);
    this.setScale(config.scale);
    this.setInteractive();
    this.on("pointerup", config.visible ? ()=>{
      config.function()
      this.setTexture(config.texture[0])

    } : ()=>{});
    this.on("pointerover", config.visible ? ()=>{
      this.setTexture(config.texture[2])
    }: ()=>{})
    this.on("pointerout", config.visible ? ()=>{
      this.setTexture(config.texture[0])
    }: ()=>{})
    this.on("pointerdown", config.visible ? ()=>{
      this.setTexture(config.texture[3])
    }: ()=>{})
    if (group) {
      this.groupItem = group;
      this.groupItem.add(this);
    }
  }
}

export default lvlSlot;
