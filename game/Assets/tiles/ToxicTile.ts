import { Player } from "../Player";
import { GenericTile } from "./GenericTile";

export class ToxicTile extends GenericTile {

    constructor(scene: Phaser.Scene, x: number, y: number, z: number, texture: string, frame?: string | number, group?: Phaser.GameObjects.Group) {
        super(scene, x, y, z, "tileToxic", 0, group);
        this.isConnectable = false;
        this.objectType = "ToxicTile";



        // ANIM SPRITESHEET
        const arrayRange = (start: number, stop: number, step:number) =>
            Array.from(
            { length: (stop - start) / step + 1 },
            (value, index) => start + index * step
            );
        const arrayFrames = arrayRange(0,59,1)
        const toxicAnim = this.scene.anims.generateFrameNumbers("tileToxic", {
            frames: arrayFrames,
          });
          this.scene.anims.create({
            key: "toxicAnim",
            frames: toxicAnim,
            frameRate: 30,
            repeat: -1,
          }); 
          this.self.anims.play("toxicAnim", true)
        // ANIM SPRITESHEET

    }



    effect(player: Player){
        if (!player.playerOnToxic) {
            player.playerOnToxic = true;
            // this.scene.uiReference.loseLife(1)
        }
    }
}