import { GenericTile } from "./GenericTile";

export class IceTile extends GenericTile {

    constructor(scene: Phaser.Scene, x: number, y: number, z: number, texture: string, frame?: string | number, group?: Phaser.GameObjects.Group) {
        super(scene, x, y, z, texture, 0, group);
        this.isConnectable = false;
        this.isoConfig = {x: x, y: y}
        this.objectType = "IceTile";
    }
}