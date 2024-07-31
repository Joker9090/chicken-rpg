import Phaser, { Physics, Scene } from "phaser";
import { IsoSpriteBox } from "./IsoSpriteBox";

export class Player extends IsoSpriteBox {
  scene: Phaser.Scene;
  isoX: number = 0;
  isoY: number = 0;
  isoZ: number = 0;
  body?: Phaser.Physics.Arcade.Body;
  //@ts-ignore
  primarySprite: Phaser.GameObjects.Sprite;
  self: Phaser.Physics.Arcade.Sprite;
  isPlayer = true;
  canTp = true
  teleported = false
  playerOnButton: boolean = false;
  touchedMap: boolean = false;
  playerOnToxic?: boolean = false;
  playerOnObj: boolean | string = false;

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
    // this.self.setAlpha(0);

    this.scene.add.existing(this.self);
    this.scene.isoPhysics.world.enable(this);
    const body = this.body as Physics.Arcade.Body;
    body.collideWorldBounds = false;
    body.allowGravity = true;
    this.primarySprite = scene.add.sprite(0, 0, texture);
    super.init(x, y, z);

    this.primarySprite.setOrigin(0.5, 0.5);
    this.container.setDepth(5000);
    this.primarySprite.setAlpha(1)
    this.container.add(this.primarySprite);
    this.scene.isoPhysics.world.enable(this.primarySprite);
    const ballFramesDown = this.scene.anims.generateFrameNumbers("ballAnim", {
      frames: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 0,
      ],
    });
    const ballFramesUp = this.scene.anims.generateFrameNumbers("ballAnim", {
      frames: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 0,
      ].reverse(),
    });
    const ballFramesRight = this.scene.anims.generateFrameNumbers("ballAnim", {
      frames: [
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 30,
      ],
    });
    const ballFramesLeft = this.scene.anims.generateFrameNumbers("ballAnim", {
      frames: [
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 30,
      ].reverse(),
    });

    this.scene.anims.create({
      key: "ballMovesLeft",
      frames: ballFramesLeft,
      frameRate: 11,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "ballMovesTop",
      frames: ballFramesUp,
      frameRate: 11,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "ballMovesBot",
      frames: ballFramesDown,
      frameRate: 11,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "ballMovesRight",
      frames: ballFramesRight,
      frameRate: 11,
      repeat: -1,
    });
  }
  updateAnim(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursors) {
      const { up, down, left, right } = cursors;
      if (up.isUp && down.isUp && left.isUp && right.isUp) 
      this.primarySprite.anims.stop();
      else if (up.isDown) this.primarySprite.anims.play("ballMovesTop", true);
      else if (down.isDown) this.primarySprite.anims.play("ballMovesBot", true);
      else if (left.isDown) this.primarySprite.anims.play("ballMovesLeft", true);
      else if (right.isDown) this.primarySprite.anims.play("ballMovesRight", true);
    }
  }
  setVelocity(x: number, y: number, z: number) {
    //@ts-ignore
    this.body?.velocity.setTo(x, y, z);
  }
  setPosition(x: number, y: number, z: number) {
    //@ts-ignore
    this.body?.position.setTo(x, y, z);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    this.container.setPosition(this.self.x, this.self.y, this.self.z);
  }
}
