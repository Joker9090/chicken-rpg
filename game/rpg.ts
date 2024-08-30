import { GameObjects, Physics, Scene } from "phaser";
//@ts-ignore
import IsoPlugin, { IsoPhysics, IsoSprite } from "phaser3-plugin-isometric";
import MapManager from "@/game/mapManager";
import MovVelocity from "./movement/MovVelocity";
import MovForce from "./movement/MovForce";
import MovTile from "./movement/MovTile";
import { Player } from "./Assets/Player";
import { Audio, ConfObjectType, LevelDataType } from "./types";
import { TileFactory } from "./Assets/factories/TileFactory";
import { TileObjectFactory } from "./Assets/factories/TileObjectFactory";
import BetweenScenes, { BetweenScenesStatus } from "./BetweenScenes";
import EventsCenter from "./EventsCenter";
import UIScene from "./UIScene";
import GlobalDataSingleton from "./services/GlobalData";
import { RpgIsoSpriteBox } from "./Assets/rpgIsoSpriteBox";
import { RpgIsoPlayer } from "./Assets/rpgIsoPlayer";
import { RpgIsoPlayerPrincipal } from "./Assets/rpgIsoPlayerPrincipal";
import { RpgIsoPlayerSecundarioTalker } from "./Assets/rpgIsoPlayerSecundarioTalker";
// import UIScene from "./UIScene";

export type IsoSceneType = {
  isoPhysics: any;
};
export type SceneWithIsoType = Scene & IsoSceneType;

export enum statusEnum {
  STOPPED,
  RUNNING,
  LOSING,
  IDLE,
  WINNING,
}

export default class RPG extends Scene {
  maps: string[];
  mapsBuilded: any[] = [];
  input: any;
  isoPhysics: IsoPhysics;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  isoGroup?: Phaser.GameObjects.Group;
  sceneKey: string;
  forest: Array<RpgIsoSpriteBox> = [];
  player?: RpgIsoPlayerPrincipal;
  NPCTalker?: RpgIsoPlayerSecundarioTalker;
  UICamera?: Phaser.Cameras.Scene2D.Camera;

  constructor(maps: string[]) {
    const sceneConfig = {
      key: "RPG",
      mapAdd: { isoPlugin: "iso", isoPhysics: "isoPhysics" },
    };
    super(sceneConfig);
    this.maps = maps;
    this.sceneKey = sceneConfig.key;
  }

  preload() {
    this.load.image("tile", "/images/bloque.png");
    this.load.spritesheet("chicken", "/images/chicken/spritesheetChicken.png", {
      frameWidth: 552 / 4,
      frameHeight: 1152 / 12,
      startFrame: 0,
    });

    this.load.image("tree", "/images/chicken/tree.png");

    for (let index = 0; index < 6; index++) {
      this.load.spritesheet(
        `bloque-${index}`,
        "/images/chicken/piedraAbajo.png",
        {
          frameWidth: 100,
          frameHeight: 100,
          startFrame: index,
        }
      );
    }

    for (let index = 0; index < 6; index++) {
      this.load.spritesheet(
        `semibloque-${index}`,
        "/images/chicken/piedraAbajo.png",
        {
          frameWidth: 100,
          frameHeight: 100,
          startFrame: index + 6,
        }
      );
    }

    for (let index = 0; index < 6; index++) {
      this.load.spritesheet(
        `columna-${index}`,
        "/images/chicken/piedraAbajo.png",
        {
          frameWidth: 100,
          frameHeight: 100,
          startFrame: index + 18,
        }
      );
    }

    this.load.scenePlugin({
      key: "IsoPlugin",
      url: IsoPlugin,
      sceneKey: "iso",
    });

    this.load.scenePlugin({
      key: "IsoPhysics",
      url: IsoPhysics,
      sceneKey: "isoPhysics",
    });
  }

  destroy() {}

  create() {
    //default
    this.isoPhysics.world.setBounds(-1024, -1024, 1024 * 2, 1024 * 4);
    this.isoPhysics.projector.origin.setTo(0.5, 0.3); // permitime dudas
    this.isoPhysics.world.gravity.setTo(0); // permitime dudas

    // resize the game
    this.scale.resize(window.innerWidth, window.innerHeight);

    // agregamos controles de teclado
    this.cursors = this.input.keyboard.createCursorKeys();

    // una creacion de un group para guardar todos los tiles
    this.isoGroup = this.add.group();

    const posiblePositions = [
      "attack-s",
      "attack-e",
      "attack-n",
      "attack-w",
      "idle-s",
      "idle-e",
      "idle-n",
      "idle-w",
      "walk-s",
      "walk-e",
      "walk-n",
      "walk-w",
    ];

    for (let index = 0; index < 12; index++) {
      let floor = index > 0 ? index * 3 : 0;

      this.anims.create({
        key: posiblePositions[index],
        frames: this.anims.generateFrameNumbers("chicken", {
          start: index + floor,
          end: index + floor + 3,
        }),
        frameRate: 10,
        repeat: index + floor >= 16 && index + floor + 3 <= 32 ? -1 : 1,
      });
      if (index + floor >= 16 && index + floor + 3 <= 32)
        console.log("es idle: ", index + floor, index + floor + 3);
    }

    // crea lo tiles
    this.spawnTiles();
    this.spawnObjects();

    this.cameras.main.setZoom(0.9);
    this.cameras.main.setViewport(0, 0, window.innerWidth, window.innerHeight);
    let cameraFollow = false;

    // tween camera zoom after 200 ms
    // setTimeout(() => {
    //   this.cameras.main.zoomTo(1.1, 200);
    // }, 200);

    let pos = 0;

    // @ts-ignore
    // this.isoGroup?.children.each((tile: RpgIsoSpriteBox) => {
    //   if (pos == 1 && tile && !cameraFollow) {
    //     console.log("SIGO", tile);
    //     // cameraFollow = true;
    //     // this.cameras.main.startFollow(tile);
    //   }
    // });

    // after 3 seconds, log positions of tiles every 10 tiles
    // setTimeout(() => {
    //
    // },
    // 1000);

    //  this.input.on("pointermove",(pointer) => {
    //   console.log("aca")
    //  });

    // this.input.on("pointermove",(pointer) => {
    //   const { x,y } = this.input.mousePointer
    // this.cameras.main.centerOn(x, y);
    // const w = window.innerWidth
    // const h = window.innerHeight
    // this.forest.forEach((tree) => {
    //   console.log("aca",tree)
    //     //Detect if mouse is in the top, bottom and left or right part of the screen
    //     let pushX, pushY = 0
    //     if (x > w / 2) {
    //       pushX = 0.06;
    //     } else {
    //       pushX = -0.06;
    //     }

    //     if(y > h /2) {
    //       pushY = 0.06;
    //     } else {
    //       pushY = -0.06;
    //     }

    //     tree.self.setOrigin(0.92+pushX, 0.85+pushY)
    // })
    // })

    // const chicken = new RpgIsoSpriteBox(this, 700, 215, 100, "chicken", 17, this.isoGroup);
    // const chickenBOT = new RpgIsoSpriteBox(this, 750, 215, 100, "chicken", 17, this.isoGroup);

    // chicken.self.play("atack-s");
    // chickenBOT.self.play("atack-n");

    // this.cameras.main.startFollow(chicken);
  }

  spawnObjects() {
    let scalar = 0;
    let h = 50;

    const lvlConf = this.maps[0];
    const objectsMaps = JSON.parse(this.maps[1]);

    for (let index = 0; index < objectsMaps.length; index++) {
      const map = objectsMaps[index];

      // const h = 1000 + index * 600;
      scalar = index;
      const m = new MapManager(map, this as any);
      const conf = {
        height: h * scalar,
        structure: (
          a: string,
          b: number,
          c: number,
          that: MapManager,
          conf: ConfObjectType,
          objectKey: string
        ) => {
          //
          const { game, setPosFromAnchor } = that;

          const { height } = conf;
          const x = setPosFromAnchor(b, c).x;
          const y = setPosFromAnchor(b, c).y;

          let direction = undefined;
          switch (objectKey) {
            case "PLAYER-E":
              direction = "e";
              break;
            case "PLAYER-N":
              direction = "n";
              break;
            case "PLAYER-S":
              direction = "s";
              break;
            case "PLAYER-W":
              direction = "w";
              break;
          }
          if (direction) {
            let matrixPosition = {
              x: b,
              y: c,
              h: height,
            };

            console.log("object key: ", objectKey);
            if (objectKey == "PLAYER-S") {
              this.player = new RpgIsoPlayerPrincipal(
                this, // Scene
                x, // x
                y, // y
                height + h, // height
                "chicken", // spriteName
                17, // baseFrame
                this.isoGroup, // group
                direction, // direction
                matrixPosition,
                "Pepe"
              );
            } else {
              this.NPCTalker = new RpgIsoPlayerSecundarioTalker(
                this, // Scene
                x, // x
                y, // y
                height + h, // height
                "chicken", // spriteName
                17, // baseFrame
                this.isoGroup, // group
                direction, // direction
                matrixPosition
              );
              // if (direction === "n") {
              //   a.velocity = 3;
              // }
            }
          }
        },
      };
      //@ts-ignore
      m.drawMap(this.isoGroup, conf, JSON.parse(lvlConf));
    }
  }
  spawnTiles() {
    const self = this;
    let pos = 0;
    const lvlConf = this.maps[0];

    function tweenTile(tile: RpgIsoSpriteBox) {
      return () => {
        self.tweens.add({
          targets: tile.self,
          isoZ: tile.isoZ + 10,
          duration: 200,
          yoyo: true,
          repeat: 0,
        });
      };
    }

    let scalar = 0;
    let startOnMap = 2;
    let h = 50;

    for (let index = startOnMap; index < this.maps.length; index++) {
      // reverse the map string
      const map = this.maps[index];

      // const h = 1000 + index * 600;
      scalar = index - startOnMap;
      const m = new MapManager(map, this as any);
      const conf = {
        height: h * scalar,
        structure: (
          a: string,
          b: number,
          c: number,
          that: MapManager,
          conf: ConfObjectType,
          objectKey: string
        ) => {
          switch (objectKey) {
            case "GRASS":
              self.createGrassTile(b, c, that, conf, pos);
              break;
            case "BLOQUERANDOM":
              self.createBloqueRandomTile(b, c, that, conf, pos, index);
              break;
            case "BLOQUE-1":
              self.createBloqueTile(b, c, that, conf, pos, objectKey);
              break;
            case "COLUMNALARGA":
              self.createColumnaTile(b, c, that, conf, pos, "columna-0");
              break;
            case "COLUMNACORTA":
              self.createColumnaTile(b, c, that, conf, pos, "columna-1");
              break;
            case "SEMIBLOQUE":
              self.createSemiBloque(b, c, that, conf, pos, "semibloque-0");
              break;
            case "TREE":
              self.createTreeTile(b, c, that, conf, pos);
              break;
          }
        },
      };
      //@ts-ignore
      m.drawMap(this.isoGroup, conf, JSON.parse(lvlConf));
    }
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
 
    tileObj = new RpgIsoSpriteBox(game, x, y, height, tile, 0, this.isoGroup,matrixPosition);
    pos++;

    tileObj.type = "STONE";

    //if height is 75 tint tile

    // tileObj.self.on("pointerover", tweenTile(tileObj));
    // console.log(tileObj);
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

    tileObj = new RpgIsoSpriteBox(game, x, y, height, tile, 0, this.isoGroup,matrixPosition);
    pos++;

    tileObj.type = "STONE";

    //if height is 75 tint tile

    // tileObj.self.on("pointerover", tweenTile(tileObj));
    // console.log(tileObj);
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

    tileObj = new RpgIsoSpriteBox(game, x, y, height, "tree", 0, this.isoGroup,matrixPosition);
    tileObj.self.setAlpha(0.7);
    tileObj.self.setTint(0x000000);
    tileObj.self.setOrigin(0.42 + 0.03, 0.80 + 0.03);
    tileObj.self.setAngle(100)
    tileObj.self.setScale(0.6)
    const tree = this.add.sprite(0, 0, "tree");
    tree.setOrigin(0.42, 0.75);
    tileObj.customDepth = tileObj.self.depth + 50;
    tileObj.container.add(tree);
    pos++;
    tileObj.type = "TREE";

    this.forest.push(tileObj);
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
      this.isoGroup,
      matrixPosition
    );
    pos++;
    tileObj.type = "STONE";

    //if height is 75 tint tile

    // tileObj.self.on("pointerover", tweenTile(tileObj));
    // console.log(tileObj);
    // log the position of tile every 10 tiles
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

      const floorTiles = this.isoGroup?.children.entries.filter((t) => {
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
      tileObj.highlightedTiles = [];
      // clean tint from all tiles
      // @ts-ignore
      this.isoGroup?.children.each((t: RpgIsoSpriteBox) => {
        if (t.type == "STONE" || t.type == "GRASS") t.self.clearTint();
      });
    };
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
      this.isoGroup,
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

    // console.log(tileObj);
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
      "tile", //"bloque-" + Math.floor(Math.random() * 6),
      0,
      this.isoGroup,
      matrixPosition
    );
    pos++;

    tileObj.type = "GRASS";
  }

  update() {
    const self = this;
    if (self.player && self.cursors) {
      self.player.updateAnim(self.cursors);
      console.log(this.player?.isoX, this.player?.isoY, "ARIEL")
    }
    if (this.player?.isoX === 660 && this.player?.isoY === 55 && this.player.facingDirection === 'e') this.NPCTalker?.interact()
    else this.NPCTalker?.breakInteract()
  }
}
