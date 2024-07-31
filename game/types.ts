import { GameObjects, Physics } from "phaser";
import MapManager from "./mapManager";

export type GameObjectsIsoSpriteType = GameObjects.Sprite & {
  isoX: number;
  isoY: number;
  isoZ: number;
  objectType: string;
  body: Physics.Arcade.Body;
  itemType?: string;
  isCollapsable?: boolean;
  health?: number;
  states?: string[];
  isPlayer?: boolean;
  isTileGreen?: boolean;
  isJump?: boolean;
  istile?: boolean;
  isBtn?: boolean;
  imageOff?: string;
  imageOn?: string;
  isWay?: boolean;
  isOn?: boolean;
  behavior?: Function;
  onConnect?: Function;
  isEnd?: boolean;
};

export type LevelDataType = {
  level: number;
}

export type IsoAddType = GameObjects.GameObjectFactory & {
  isoSprite: (
    x: number,
    y: number,
    z: number,
    text: string,
    group: Phaser.GameObjects.Group | undefined
  ) => GameObjectsIsoSpriteType;
};

export type ConfObjectType = {
  [key: string]: (a: string, b: number, c: number, that: MapManager, conf : any , objectKey: string | null) => void;
} & {
  height: number;
};

export type PhysicsIsoForceType = Phaser.Physics.Arcade.Body & {
    velocity: {
        x: number;
        y: number;
        z: number;
        setTo: (a: number, b: number, c: number) => void
    }
}

export type ConfigMovementForceType = {
    pxVelocity: number;
    pxForce: number;
}


export type PhysicsIsoTileType = Phaser.Physics.Arcade.Body & {
    velocity: {
        x: number;
        y: number;
        z: number;
        setTo: (a: number, b: number, c: number) => void
    }
}

export type ConfigMovementTileType = {
    tileSize: number;
}

export type PhysicsIsoVelocityType = Phaser.Physics.Arcade.Body & {
    velocity: {
      x: number;
      y: number;
      z: number;
      setTo: (a: number, b: number, c: number) => void;
    };
  };
  
  export type ConfigMovementVelocityType = {
    pxVelocity: number;
    resistence?: number
  };

  export type LevelJSON = {
    nivel: string; 
    player: string; 
    musica: string; 
    ballTexture: string; 
    gravity: number; 
    tiles?: { [key: string]: string };
  }

  export type TileCreatorParams = TileType | ObjType | Direction | boolean | null;

  export enum Direction {
    LT = "LT",
    TR = "TR",
    LR = "LR",
    BL = "BL",
    BR = "BR",
    BT = "BT",
    R = "R",
    L = "L",
    T = "T",
    B = "B"
  }
  
  export enum TileType {
    D = "D",
    CO = "CO",
    BN = "BN",
    J = "J",
    T = "T",
    I = "I",
    E = "E",
    W = "W",
    PO = "PO"
  }

  export enum ObjType {
    BT = "BT",
    BT2 = "BT2",
    B = "B",
    S = "S",
    S2 = "S2"
  }

  export type Audio = Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound
  