
import { Physics } from "phaser";
export const ISOSPRITE: string = "IsoSprite";
// @ts-ignore
import { RpgIsoSpriteBox } from "./rpgIsoSpriteBox";

export class TrafficLightIsoSpriteBox extends RpgIsoSpriteBox {
 
  type: string = "TRAFFICLIGHT";

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

    this.self.setScale(1.25);
    this.isoX = this.isoX - 30;
    this.isoY = this.isoY - 10;
    this.self.setTint(0xcccccc)

  }

}
