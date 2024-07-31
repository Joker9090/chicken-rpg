import { Player } from "../Player";
import { GenericTile } from "./GenericTile";

export class ButtonTile extends GenericTile {

    constructor(scene: Phaser.Scene, x: number, y: number, z: number, texture: string, frame?: string | number, group?: Phaser.GameObjects.Group) {
        super(scene, x, y, z, texture, 0, group);
        this.isoConfig = {x: x, y: y}
        this.isConnectable = true;
        this.objectType = "ButtonTile";
        this.sound = [scene.sound.add('btnOff'), scene.sound.add('btnOn')];
        this.sound.forEach((s: any) => s.setVolume(0.1));
        
        this.playSound = (player: Player) => {
            if (!player.playerOnObj || player.playerOnObj !== this.objectType) {
              if (this.sound) {
                  if (this.isOn) this.sound[0].play()
                  else this.sound[1].play()
                } 
            }
          }
    }
}