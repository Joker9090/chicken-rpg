
import { Physics } from "phaser";
export const ISOSPRITE: string = "IsoSprite";
// @ts-ignore
import IsoSprite from "@/node_modules/phaser3-plugin-isometric/src/IsoSprite.js";
import { init } from "next/dist/compiled/webpack/webpack";

export class IsoSpriteBox extends IsoSprite {
  scene: Phaser.Scene;
  isoX: number = 0;
  isoY: number = 0;
  isoZ: number = 0;
  body?: Physics.Arcade.Body;
  container: Phaser.GameObjects.Container;
  primarySprite?: Phaser.GameObjects.Sprite;
  self: Phaser.Physics.Arcade.Sprite;
  isoConfig?: {x: number, y: number};
  customDepth?: number;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    z: number,
    texture: string,
    frame: string | number,
    group?: Phaser.GameObjects.Group,
  ) {
    // @ts-ignore
    super(scene, x, y, z, texture, frame);
    this.scene = scene;
    this.self = this as unknown as Phaser.Physics.Arcade.Sprite;
    this.self.setAlpha(1)
    group?.add(this.self);
    this.scene.isoPhysics.world.enable(this);
    this.scene.add.existing(this.self);
   
    const body = this.body as Physics.Arcade.Body
    body.collideWorldBounds = true;
    this.container = scene.add.container(0, 0);
    this.init(x,y,z)
  }
  
  init (x: number, y: number, z: number) {
    this.isoX = x;
    this.isoY = y;
    this.isoZ = z;
  }

  preUpdate(time: number, delta: number) {

      super.preUpdate(time, delta);
      this.container.setDepth(this.customDepth || this.self.depth);
      this.container.setPosition(this.self.x, this.self.y, this.self.z);
  }

  setTileTexture(texture: string) {
    this.self.setTexture(texture)
  }
}
