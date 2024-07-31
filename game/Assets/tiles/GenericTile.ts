import { Physics } from "phaser";
export const ISOSPRITE: string = "IsoSprite";
// @ts-ignore
import { IsoSpriteBox } from "../IsoSpriteBox";
import { Player } from "../Player";

export class GenericTile extends IsoSpriteBox {
  itemType?: string;
  health?: number;
  states?: string[];
  isPlayer?: boolean;
  imageOff?: string;
  imageOn?: string;
  isConnectable?: boolean;
  active?: boolean;
  behavior?: Function;
  onConnect?: Function;
  isoConfig?: { x: number; y: number };
  isOn?: boolean;
  objectType: string = "base";
  sound?: any

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    z: number,
    texture: string,
    frame: string | number,
    group?: Phaser.GameObjects.Group
  ) {
    // @ts-ignore
    super(scene, x, y, z, texture, frame);
    this.isOn = texture.includes('+')
    this.imageOff = texture.replace(/\+/g, "-");
    this.imageOn = texture.replace(/\-/g, "+");    
    this.self = this as unknown as Phaser.Physics.Arcade.Sprite;
    group?.add(this.self);
    this.scene.add.existing(this.self);
    super.init(x, y, z);
    const body = this.body as Physics.Arcade.Body;
    body.collideWorldBounds = true;
    body.immovable = true;
    body.allowGravity = false;
    scene.isoPhysics.world.enable(this);

    
  }
  
  toggleImage() {
    if (this.isOn) {
      if (this.imageOn) this.self.setTexture(this.imageOn)
      this.self.setAlpha(1)
    } else {
      if(this.imageOff) this.self.setTexture(this.imageOff)
      else this.self.setAlpha(0)
    }
  }

  playSound = (player: Player) => {
    if (!player.playerOnObj || player.playerOnObj !== this.objectType) {
      if (this.sound) {
        if (Array.isArray(this.sound)) {
          this.sound[Math.floor(Math.random() * this.sound.length)].play()
        } else this.sound.play();
      }
    }
  }
}
