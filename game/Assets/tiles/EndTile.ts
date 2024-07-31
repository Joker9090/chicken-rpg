import EventsCenter from "@/game/EventsCenter";
import { GenericTile } from "./GenericTile";

export class EndTile extends GenericTile {

    constructor(scene: Phaser.Scene, x: number, y: number, z: number, texture: string, frame?: string | number, group?: Phaser.GameObjects.Group) {
        super(scene, x, y, z, texture, 0, group);
        this.isConnectable = true;
        this.isoConfig = {x: x, y: y}
        this.objectType = "EndTile";
        this.onConnect = () => {
            this.toggleImage()
            this.isOn = !this.isOn
            EventsCenter.emit("finalTileToggle", this.isOn)
        }
    }
}