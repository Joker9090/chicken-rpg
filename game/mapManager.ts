import { Physics, Game, Scene, GameObjects } from "phaser";
import { Player } from "./Assets/Player";
import IsoExperimentalMap from "./rpg";
import { ConfObjectType, GameObjectsIsoSpriteType, IsoAddType } from "./types";
import { IsoSpriteBox } from "./Assets/IsoSpriteBox";

export default class MapManager {
  game: IsoExperimentalMap;
  mapFile: string;
  rows: string[];
  posOfAnchor: [number, number];
  distanceOfTiles: { width: number; height: number };

  constructor(map: string, game: IsoExperimentalMap) {
    this.game = game;
    this.mapFile = map;
    this.rows = [];
    this.posOfAnchor = [0, 0];
    this.distanceOfTiles = { width: 50, height: 50 };
    this.initMapParser();
    this.drawMap = this.drawMap.bind(this);
    this.setPosFromAnchor = this.setPosFromAnchor.bind(this);
  }

  initMapParser() {
    this.rows = this.mapFile.split("\n");
    this.iterateMapRows();
  }

  iterateMapRows(fn?: Function) {
    let blocks;
    for (let row_i = 0; row_i < this.rows.length; row_i += 1) {
      blocks = this.rows[row_i].split(" ");
      for (let block_i = 0; block_i < blocks.length; block_i += 1) {
        if (blocks[block_i] === "2") this.posOfAnchor = [row_i, block_i];
        if (typeof fn === "function") fn(blocks[block_i], row_i, block_i);
      }
    }
  }

  setPosFromAnchor(rowI: number, blockI: number) {
    return {
      x: (this.posOfAnchor[0] + blockI) * this.distanceOfTiles.width,
      y: (this.posOfAnchor[1] + rowI) * this.distanceOfTiles.height,
    };
  }

  drawMap(isoGroup: Phaser.GameObjects.Group | undefined, conf: ConfObjectType, lvlConf: any) {
      player: IsoSpriteBox;
    const self = this;
    this.iterateMapRows((a: string, b: number, c: number) => {
      //TODO: usar json de cada objeto en vez de la clave compuesta
      const compoundKey = (lvlConf?.tiles && lvlConf?.tiles[a]?.compoundKey) ? lvlConf?.tiles[a]?.compoundKey : lvlConf.tiles[a] ? lvlConf.tiles[a] : ''
      const keys = a.split('/')
      const tileType = keys[0].split('|')[0].replace(/[-+]/g, "")
      // if(tileType !== 'P' && conf.structure) conf.structure(keys[0], b, c, self, conf, keys[1])
      if(tileType !== 'P' && conf.structure) conf.structure(compoundKey ? compoundKey.split('/')[0] : '', b, c, self, conf, (compoundKey && compoundKey.split('/')[1]) ? compoundKey.split('/')[1] : compoundKey)
      if (conf && conf[tileType] && typeof conf[tileType] == "function") {
        conf[tileType](keys[0], b, c, self, conf, keys[1]);
      } 
    });
  }
}
