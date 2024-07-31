import { GenericTile } from "./GenericTile";

export class DefaultTile extends GenericTile {

    constructor(scene: Phaser.Scene, x: number, y: number, z: number, texture: string, frame?: string | number, group?: Phaser.GameObjects.Group) {
        super(scene, x, y, z, texture, 0, group);
        this.isConnectable = false;
        this.objectType = "base";
    }
}