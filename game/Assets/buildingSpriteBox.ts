
import { Physics } from "phaser";
export const ISOSPRITE: string = "IsoSprite";
// @ts-ignore
import { RpgIsoSpriteBox } from "./rpgIsoSpriteBox";
import { Player } from "./Player";
import { RpgIsoPlayerPrincipal } from "./rpgIsoPlayerPrincipal";

export class BuildingSpriteBox extends RpgIsoSpriteBox {
 
  type: string = "Building";
  distanceBetweenFloors: number

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
    distanceBetweenFloors: number = 50
  ) {
    super(scene, x, y, z, texture, frame, group, matrixPosition, interactivityPosition);

    this.self.setScale(1);
    this.self.setOrigin(0.5, 1)
    this.isoX = this.isoX 
    this.isoY = this.isoY  
    this.distanceBetweenFloors = distanceBetweenFloors;
    // this.scene.add.existing(this.self);
  }

}
