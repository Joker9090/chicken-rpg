import Phaser from "phaser";
import UI, { UIConfig } from "../UIAssetsChicken/UI";

// Scene in class
class PersonCredit extends Phaser.GameObjects.Container {
  scene: Phaser.Scene;
  ring?: Phaser.GameObjects.Sprite;
  photo: string[];
  name: string;
  rol: string;
  image?: Phaser.GameObjects.Sprite;
  rolText?: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    photo: string[],
    name: string,
    rol: string,
    offsetNameX?: number
  ) {
    super(scene, x, y);
    this.scene = scene;
    this.photo = photo;
    this.name = name;
    this.rol = rol;
    let xPhoto = 80;
    if (offsetNameX) {
      xPhoto = 80 + offsetNameX;
    }
    this.image = this.scene.add.sprite(0, 0, photo[0]).setOrigin(0.5)
    this.rolText = this.scene.add.text(0, 200, rol, { fontSize: 20, fontFamily: "Quicksand", fontStyle: "bold"}).setOrigin(0.5);
    this.add([this.image, this.rolText]);
    scene.add.existing(this);
    this.image.setInteractive();
    this.image.on("pointerover", ()=>this.changeTexture(true))
    this.image.on("pointerout", ()=>this.changeTexture(false))
  }

  changeTexture(change?: boolean) {
    if (change) {
        this.image?.setTexture(this.photo[1]);
    } else {   
        this.image?.setTexture(this.photo[0]);
    }
  }
}
export default PersonCredit;
