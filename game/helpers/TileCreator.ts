import { BuildingSpriteBox } from "../Assets/buildingSpriteBox";
import { CubeIsoSpriteBox } from "../Assets/cubeIsoSpriteBox";
import { PinIsoSpriteBox } from "../Assets/pinIsoSpriteBox";
import { RpgIsoSpriteBox } from "../Assets/rpgIsoSpriteBox";
import { TrafficLightIsoSpriteBox } from "../Assets/trafficLightIsoSpriteBox";
import MapManager from "../mapManager";
import RPG from "../rpg";
import { ConfObjectType } from "../types";

export default class TileCreator {

    scene: RPG;

    constructor(scene: RPG) {
        this.scene = scene;
    }

    createColumnaTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;

        tileObj.type = "STONE";

        //if height is 75 tint tile

        // tileObj.self.on("pointerover", tweenTile(tileObj));
        // log the position of tile every 10 tiles
    }

    createSemiBloque(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;

        tileObj.type = "STONE";

        //if height is 75 tint tile

        // tileObj.self.on("pointerover", tweenTile(tileObj));
        // log the position of tile every 10 tiles
    }

    createTreeTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            "tree",
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        tileObj.self.setAlpha(0.7);
        tileObj.self.setTint(0x000000);
        tileObj.self.setOrigin(0.42 + 0.03, 0.8 + 0.03);
        tileObj.self.setAngle(100);
        tileObj.self.setScale(0.6);
        const tree = this.scene.add.sprite(0, 0, "tree");
        tree.setOrigin(0.42, 0.75);
        tileObj.customDepth = tileObj.self.depth + this.scene.distanceBetweenFloors;
        tileObj.container.add(tree);
        pos++;
        tileObj.type = "TREE";

        this.scene.forest.push(tileObj);
    }

    createBloqueTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        objectKey: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            objectKey.toLowerCase(),
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;
        tileObj.type = "STONE";

        //if height is 75 tint tile

        // tileObj.self.on("pointerover", tweenTile(tileObj));
        // log the position of tile every 10 tiles
    }

    createPinTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new PinIsoSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            this.scene.isoGroup,
            matrixPosition
        );
    }

    createCubeTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new CubeIsoSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            this.scene.isoGroup,
            matrixPosition,
            undefined,
            this.scene.distanceBetweenFloors
        );
    }

    createBuilding(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new BuildingSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            this.scene.isoGroup,
            matrixPosition
        );
    }

    createTrafficLightTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        tile: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new TrafficLightIsoSpriteBox(
            game,
            x,
            y,
            height,
            tile,
            0,
            this.scene.isoGroup,
            matrixPosition
        );
    }

    destroyTile(tileObj: RpgIsoSpriteBox) {
        return () => {
            // destroy all tiles in the highlightedTiles array
            if (tileObj.highlightedTiles === undefined) return;
            tileObj.highlightedTiles.forEach((tile: RpgIsoSpriteBox) => {
                if (tile.tileX === tileObj.tileX && tile.tileY === tileObj.tileY)
                    return;
                // @ts-ignore
                tile.destroy();
            });
            // @ts-ignore
            tileObj.destroy();
        };
    }

    highlightTile(tileObj: RpgIsoSpriteBox, tintTexture: number = 0xff0000) {
        // look the position of this tile in the map matrix
        return () => {
            if (tileObj.floor === undefined) return;
            // iterate isoGroup grab all tiles from the same floor

            const floorTiles = this.scene.isoGroup?.children.entries.filter((t) => {
                const tile = t as unknown as RpgIsoSpriteBox;
                return tile.floor === tileObj.floor;
            });
            tileObj.highlightedTiles = [];
            if (floorTiles) {
                floorTiles.forEach((t) => {
                    const tile = t as unknown as RpgIsoSpriteBox;
                    // detect those tiles that are next the position of the main tile
                    if (tileObj.tileX && tileObj.tileY) {
                        if (
                            (tile.tileX === tileObj.tileX - 1 &&
                                tile.tileY === tileObj.tileY) ||
                            (tile.tileX === tileObj.tileX + 1 &&
                                tile.tileY === tileObj.tileY) ||
                            (tile.tileY === tileObj.tileY - 1 &&
                                tile.tileX === tileObj.tileX) ||
                            (tile.tileY === tileObj.tileY + 1 &&
                                tile.tileX === tileObj.tileX) ||
                            (tile.tileX === tileObj.tileX && tile.tileY === tileObj.tileY)
                        ) {
                            if (tileObj.highlightedTiles) tileObj.highlightedTiles.push(tile);
                            tile.self.setTint(tintTexture);
                        }
                    }
                });
            }
            // tileObj.self.setTint(0xff0000);
        };
    }

    noHighlightTile(tileObj: RpgIsoSpriteBox) {
        return () => {
            if (this.scene.player) this.scene.player.clearPossibleMovements();
            tileObj.highlightedTiles = [];
            // clean tint from all tiles
            // @ts-ignore
            this.scene.isoGroup?.children.each((t: RpgIsoSpriteBox) => {
                if (t.type == "STONE") t.self.clearTint();
            });
        };
    }

    createBloqueBuildingTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        texture: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };
        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            texture,
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;
        tileObj.type = "STONE";

        //if height is 75 tint tile
        tileObj.tileX = b;
        tileObj.tileY = c;
        tileObj.self.on("pointerover", this.highlightTile(tileObj));
        tileObj.self.on("pointerout", this.noHighlightTile(tileObj));
        //tileObj.self.on("pointerdown", this.destroyTile(tileObj)); //TODO: COMENTADO DE MOMENTO

        // log the position of tile every 10 tiles
    }

    createBloqueRandomTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        indexMap: number
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;
        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };
        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            "bloque-" + Math.floor(Math.random() * 6),
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;
        tileObj.type = "STONE";

        //if height is 75 tint tile
        tileObj.floor = indexMap;
        tileObj.tileX = b;
        tileObj.tileY = c;
        tileObj.self.on("pointerover", this.highlightTile(tileObj));
        tileObj.self.on("pointerout", this.noHighlightTile(tileObj));
        tileObj.self.on("pointerdown", this.destroyTile(tileObj));

        // log the position of tile every 10 tiles
    }

    createGrassTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;

        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            "grassTEST", //"bloque-" + Math.floor(Math.random() * 6),
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;

        tileObj.type = "GRASS";
        // tileObj.self.setTint(0x0000ff);
    }

    createStreetTile(
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        pos: number,
        texture: string
    ) {
        const { game, setPosFromAnchor } = that;
        const { height } = conf;
        const x = setPosFromAnchor(b, c).x;
        const y = setPosFromAnchor(b, c).y;
        let tileObj;

        let matrixPosition = {
            x: b,
            y: c,
            h: height,
        };

        tileObj = new RpgIsoSpriteBox(
            game,
            x,
            y,
            height,
            texture, //"bloque-" + Math.floor(Math.random() * 6),
            0,
            this.scene.isoGroup,
            matrixPosition
        );
        pos++;

        tileObj.type = "GRASS";
        // tileObj.self.setTint(0x222222);
    }

}