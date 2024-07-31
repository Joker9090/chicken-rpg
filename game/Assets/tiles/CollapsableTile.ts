import { Player } from "../Player";
import { GenericTile } from "./GenericTile";

export class CollapsableTile extends GenericTile {

    constructor(scene: Phaser.Scene, x: number, y: number, z: number, texture: string, frame?: string | number, group?: Phaser.GameObjects.Group) {
        super(scene, x, y, z, texture, 0, group);
        this.objectType = "CollapsableTile";
        this.isConnectable = false;
        this.isoConfig = {x: x, y: y}
        this.health = 3;
        this.states = ['CO3', 'CO2'];
        this.sound = [scene.sound.add('breakSound1'), scene.sound.add('breakSound2')];
        this.sound.forEach((s: any) => s.setVolume(0.5));

        this.behavior = (player: Player, _tile: GenericTile) => {
          if ((!player.playerOnObj || player.playerOnObj !== this.objectType) && _tile.health && _tile.states) {
              --_tile.health
              _tile.setTileTexture(_tile.states[_tile.health-1])
              if (!_tile.health) group?.remove(_tile as any, true)
          }
        };
    }
}