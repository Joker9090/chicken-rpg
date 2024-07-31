import Phaser, { Physics, Scene } from "phaser";
import { IsoSpriteBox } from "./IsoSpriteBox";

export class Bullet extends IsoSpriteBox {
  scene: Phaser.Scene;
  isoX: number = 0;
  isoY: number = 0;
  isoZ: number = 0;
  body?: Phaser.Physics.Arcade.Body;
  primarySprite: Phaser.GameObjects.Sprite;
  self: Phaser.Physics.Arcade.Sprite;
  isBullet = true
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
    this.scene = scene;
    this.self = this as unknown as Phaser.Physics.Arcade.Sprite;
    group?.add(this.self);
    this.self.setAlpha(0)
    this.scene.add.existing(this.self);
    this.scene.isoPhysics.world.enable(this);
    const body = this.body as Physics.Arcade.Body
    body.collideWorldBounds = false;
    body.allowGravity = false

    this.primarySprite = scene.add.sprite(0, 0, texture);
    super.init(x, y, z);

    this.primarySprite.setOrigin(0.5, 0.5)
    this.container.setDepth(5000)
    this.container.add(this.primarySprite)
    this.scene.isoPhysics.world.enable(this.primarySprite);
    
  }

  fireDirectionTo (gameObject: Physics.Arcade.Sprite, speed: number) {

    const angle = Phaser.Math.Angle.BetweenPoints(this.self, gameObject);
    this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed, 0);
    // angle to x and y
    setTimeout(() => {
      this.setVelocity(0,0,0)
      this.self.removeFromUpdateList()
      this.primarySprite.removeFromUpdateList()
      this.container.removeFromUpdateList()
      this.self.setAlpha(0)
      this.primarySprite.setAlpha(0)
    },500)
  }

  setVelocity(x: number, y: number, z: number) {
    //@ts-ignore
    this.body?.velocity.setTo(x, y, z)
  }
  setPosition(x: number, y: number, z: number) {
    //@ts-ignore
    this.body?.position.setTo(x, y, z)
  }
 
  preUpdate(time: number, delta: number) {
      super.preUpdate(time, delta);
      this.container.setPosition(this.self.x, this.self.y, this.self.z);
  }

}