
import { Physics } from "phaser";
export const ISOSPRITE: string = "IsoSprite";
// @ts-ignore
import { RpgIsoSpriteBox } from "./rpgIsoSpriteBox";
import { Player } from "./Player";
import { RpgIsoPlayerPrincipal } from "./rpgIsoPlayerPrincipal";

export class PinIsoSpriteBox extends RpgIsoSpriteBox {
 
  type: string = "PIN";

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    z: number,
    texture: string,
    frame: string | number,
    group?: Phaser.GameObjects.Group,
    matrixPosition?: {x: number, y: number, h: number},
    interactivityPosition?: {x: number, y: number, w: number, h: number},
  ) {
    super(scene, x, y, z, texture, frame, group, matrixPosition, interactivityPosition);

    this.self.setScale(0.8);

  }

  updatePin(group: Phaser.GameObjects.Group) {
   this.scene.add.tween({
    targets: this.self,
    y: "-=50",
    duration: 2000,
    repeat: -1,
    yoyo: true,
    ease: "power1",
    });
  }
}
