
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

    this.self.setScale(0.9);

  }

  getTileAt(
    matrixPosition: { x: number; y: number; h: number },
    group: Phaser.GameObjects.Group,
  ) {
    const tiles = group?.children.entries as unknown as RpgIsoSpriteBox[];
    console.log("matrixPosition",matrixPosition)
    const allTiles = tiles.filter((tile) => tile.matrixPosition);


    
    if (this.matrixPosition) {
      let _tile: RpgIsoSpriteBox | undefined;

      (allTiles).forEach((tile) => {
        if (tile.matrixPosition) {
          const { x, y, h } = tile.matrixPosition;
          if (
            x == matrixPosition.x &&
            y == matrixPosition.y &&
            h == matrixPosition.h
          ) {
            _tile = tile;
          }
        }
      });

      return [_tile];
    } else {
      return [undefined]
    }
  }

  updatePin(group: Phaser.GameObjects.Group) {
    console.log("UPDATEPIN FN", group)
    const result = this.getTileAt(this.matrixPosition as {x: number, y: number, h: number}, group);
    if (this.matrixPosition) {
      const {x,y,h} = this.matrixPosition;
      let actualHeight = h;
      let checkOrder = [
        [x -1 ,y + 1,actualHeight], [x, y + 1, actualHeight], [x + 1, y + 1, actualHeight],
        [x -1 ,y,actualHeight], [x, y, actualHeight], [x - 1, y, actualHeight],
        [x -1 ,y - 1,actualHeight], [x, y - 1, actualHeight], [x + 1, y - 1, actualHeight],
      ]

      let _tiles = checkOrder.map((c) => {
        const [x,y,h] = c;
        return this.getTileAt({x,y,h}, group)[0];
      });
      console.log("_tiles",_tiles)
    }


    // get all tiles around the pin
    // 0 0 0
    // 0 1 0
    // 0 0 0

    

    

  }
}
