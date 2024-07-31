import { Physics, Scene } from "phaser";
export const ISOSPRITE: string = "IsoSprite";
// @ts-ignore
import IsoSprite from "@/node_modules/phaser3-plugin-isometric/src/IsoSprite.js";
import { init } from "next/dist/compiled/webpack/webpack";
import { IsoSpriteBox } from "../IsoSpriteBox";
import { Player } from "../Player";

export class TileObject extends IsoSpriteBox {
  scene: Phaser.Scene;
  customDepth?: number;
  objectType?: string = "ObjectItem";
  group?: Phaser.GameObjects.Group;
  imgOn?: string;
  imgOff?: string;
  isOn?: boolean;
  hasOffTexture?: boolean = false;
  isConnectable?: boolean = true;
  onConnect?: Function;
  offsetY?: number = 1;
  offsetX: number = 0.5;
  isoConfig?: { x: number; y: number; } | undefined;
  sound?: any

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    z: number,
    texture: string,
    frame?: string | number,
    props?: {
      group?: Phaser.GameObjects.Group,
      hasOffTexture?: boolean,
      objectType?: string,
      offsetY?: number,
      customDepth?: number,
    }
  ) {
    // @ts-ignore    
    const {group, objectType, offsetY, offsetX, hasOffTexture} = props || {};
    const newTexture = (texture.includes('-') && !hasOffTexture) ? texture.replace('-', '+') : texture
    super(scene, x, y, z, newTexture, frame ?? 0);
    this.offsetY = offsetY || this.offsetY
    this.offsetX = offsetX || this.offsetX
    this.objectType = objectType || this.objectType
    this.isOn = texture.includes('+');
    this.imgOn = this.isOn ? texture : texture.replace('-', '+');
    this.imgOff = !hasOffTexture ? undefined : this.isOn ? texture.replace('+', '-') : texture;
    this.group = group 
    this.hasOffTexture = hasOffTexture || this.hasOffTexture;
    this.self.setAlpha(1)
    if (!this.imgOff && !this.isOn) this.self.setAlpha(0)
    if(props && props.customDepth) {
      this.customDepth = props.customDepth
    }
    this.scene = scene;
    this.scene.add.existing(this.self);
    this.self.setOrigin(0.5, 0.5);
    if (this.group) this.group.add(this.self);
    super.init(x, y, z);
    const body = this.body as Physics.Arcade.Body;
    body.collideWorldBounds = false;
    body.allowGravity = false;
    this.container.setDepth(10000);
    body.immovable = true 
  }

  toggleObjImage() {
    if (!this.isOn) {
      if (this.imgOn) this.self.setTexture(this.imgOn)
      this.self.setAlpha(1)
      if  (this.body) this.body.enable = true;
    } else {
      if(this.imgOff) this.self.setTexture(this.imgOff)
      else {
        this.self.setAlpha(0)
        if  (this.body) this.body.enable = false;
      }
    }
  }

  playSound = (player: Player) => {
    if (!player.playerOnObj || player.playerOnObj !== this.objectType) {
        this.sound.play();
    }
  }
}
