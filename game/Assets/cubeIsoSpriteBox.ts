
import { Physics } from "phaser";
export const ISOSPRITE: string = "IsoSprite";
// @ts-ignore
import { RpgIsoSpriteBox } from "./rpgIsoSpriteBox";
import { Player } from "./Player";
import { RpgIsoPlayerPrincipal } from "./rpgIsoPlayerPrincipal";

export class CubeIsoSpriteBox extends RpgIsoSpriteBox {
 
  type: string = "CUBE";
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

    this.self.setScale(0.9);
    this.distanceBetweenFloors = distanceBetweenFloors;
    // this.scene.add.existing(this.self);
  }

  moveCube(player: RpgIsoPlayerPrincipal) {
    console.log("moveCube")
    if(this.matrixPosition){
      const distance =  player.checkCubeAround(this.matrixPosition);
      console.log("distance: ", distance);
      if(distance && Math.abs(distance.x) + Math.abs(distance.y) /*+ Math.abs(distance.h) */ == 1) {
        let newDirection = player?.facingDirection;
        if (distance.x > 0) {
          newDirection = "w";
        } else if (distance.x < 0) {
          newDirection = "e";
        } else if (distance.y > 0) {
          newDirection = "s";
        } else if (distance.y < 0) {
          newDirection = "n";
        }
        
        const newMatrixPos = {x:this.matrixPosition.x + (distance.x), y: this.matrixPosition.y + (distance.y), h: 0};
        const nextTileToCube = player?.getObjectAt(newMatrixPos);
        console.log("nextTileToCube: ",nextTileToCube);

        if(nextTileToCube) {
          this.scene.tweens.add({
            targets: this.self,
            isoZ: this.isoZ, 
            isoX: nextTileToCube.isoX,
            isoY: nextTileToCube.isoY,
            duration: 400,
            yoyo: false,
            repeat: 0,
            onComplete: () => {
              this.matrixPosition = {...newMatrixPos, h: this.distanceBetweenFloors};
            },
          });
          //if(newDirection) player?.move(newDirection,(distance.x * -1), (distance.y * -1));
        }
          

      }
    }
  }
}
