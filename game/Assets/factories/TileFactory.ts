import { Scene } from "phaser";
import { DefaultTile } from "../tiles/DefaultTile";
import { WayTile } from "../tiles/WayTile";
import { ButtonTile } from "../tiles/ButtonTile";
import { JumpTile } from "../tiles/JumpTile";
import { CollapsableTile } from "../tiles/CollapsableTile";
import { EndTile } from "../tiles/EndTile";
import { IceTile } from "../tiles/IceTile";
import { PortalTile } from "../tiles/PortalTile";
import { ToxicTile } from "../tiles/ToxicTile";

export class TileFactory {
    static createObject(scene: Scene, x: number, y: number, z: number, texture: string, frame?: string | number, group?: Phaser.GameObjects.Group) {
        const key = texture.replace(/[+\-]/g, '').split('|')[0];
        switch (key) {
            case "D":
            return new DefaultTile(scene, x, y, z, texture, frame, group);
            case "W":
            return new WayTile(scene, x, y, z, texture, frame, group);
            case "J":
                return new JumpTile(scene, x, y, z, texture, frame, group);
            case "BN":
                return new ButtonTile(scene, x, y, z, texture, frame, group);
            case "CO":
                return new CollapsableTile(scene, x, y, z, texture, frame, group);
            case "I":
                return new IceTile(scene, x, y, z, texture, frame, group);
            // case "BG":
            //     return new Barrier(scene, x, y, z, texture, frame, group);
            case "E":
                return new EndTile(scene, x, y, z, texture, frame, group);    
            case "PO":
                return new PortalTile(scene, x, y, z, texture, frame, group);
            case "T":
                return new ToxicTile(scene, x, y, z, texture, frame, group);
            default:
            return null;
        }
    }
}