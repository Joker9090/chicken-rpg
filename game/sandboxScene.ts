import { GameObjects, Physics, Scene } from "phaser";
//@ts-ignore
import IsoPlugin, { IsoPhysics, IsoSprite } from "phaser3-plugin-isometric";
import MapManager from "@/game/mapManager";
import MovVelocity from "./movement/MovVelocity";
import MovForce from "./movement/MovForce";
import MovTile from "./movement/MovTile";
import {
  baseTile,
  buttonTile,
  collapsableTile,
  endTile,
  jumpTile,
  playerTile,
  wayTile,
} from "./tilesLogic";
import { Player } from "./Assets/Player";
import { IsoSpriteBox } from "./Assets/IsoSpriteBox";
import { Bullet } from "./Assets/Bullet";
import { getDimensionOfMaps } from "./helpers/helpers";
import { GenericTile } from "./Assets/GenericTile";

export type IsoSceneType = {
  isoPhysics: any;
};
export type SceneWithIsoType = Scene & IsoSceneType;

export default class IsoSandboxScene extends Scene {
  maps: string[];
  mapsBuilded: any[] = [];
  isoPhysics: IsoPhysics;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  isoGroup?: Phaser.GameObjects.Group;
  JumpTilesGroup?: Phaser.GameObjects.Group;
  ButtonTilesGroup?: Phaser.GameObjects.Group;
  WayTilesGroup?: Phaser.GameObjects.Group;
  BreakTilesGroup?: Phaser.GameObjects.Group;
  input: any;
  player?: Player;
  actualMapPos?: MapManager;
  MovVelocity?: MovVelocity;
  MovForce?: MovForce;
  MovTile?: MovTile;
  btnTime: number = 0;
  matriz: any[][] = [];
  background?: GameObjects.Image;
  starsBackground?: GameObjects.Image;
  initialPosition?: number[];
  constructor(maps: string[]) {
    const sceneConfig = {
      key: "IsoSandboxScene",
      mapAdd: { isoPlugin: "iso", isoPhysics: "isoPhysics" },
    };
    super(sceneConfig);
    this.maps = [
      "0 0 0 2 0 \n0 0 0 0 0 \n0 0 0 3 0 \n0 0 0 0 0 \n0 0 0 0 0",
      "4 4 4 2 4 \n4 4 4 4 4 \n4 4 4 6 4 \n4 4 4 4 4 \n4 4 4 4 4",
    ];
  }

  preload() {
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

  create() {
    this.starsBackground = this.add.image(-500, -1000, "stars");
    this.background = this.add.image(-500, -1000, "backgroundSpace");
    this.isoPhysics.world.setBounds(-1024, -1024, 1024 * 2, 1024 * 2);
    this.isoPhysics.world.gravity.setTo(0, 0, -500);
    this.isoPhysics.projector.origin.setTo(0.5, 0.3);
    this.scale.resize(window.innerWidth, window.innerHeight);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.isoGroup = this.add.group();
    this.spawnTiles();
    this.generarMatriz();

    window.addEventListener("resize", () => {
      this.scale.resize(window.innerWidth, window.innerHeight);
      this.scale.updateBounds();
    });

    this.cameras.main.setZoom(0.7);
    this.cameras.main.setViewport(0, 0, window.innerWidth, window.innerHeight);

    if (this.player) {
      this.initialPosition = [
        this.player?.isoX,
        this.player?.isoY,
        this.player?.isoZ,
      ];
    }
    if (this.cursors && this.player && this.player.body) {
      this.MovVelocity = new MovVelocity(this.player, this, this.cursors, {
        pxVelocity: 300,
        resistence: 0.9,
      });
    }
    setInterval(this.createBullet.bind(this), 1000);
    // this.createBullet()
  }

  createBullet() {
    if (this.player) {
      const bullet = new Bullet(this, 1, 1, 2100, "cube", 1, this.isoGroup);
      bullet.fireDirectionTo(this.player.self, 1000);
    }
  }

  update() {
    const self = this;
    this.colliders();
    if (self.player) this.animateBackground(self.player);
    if (this.MovVelocity && this.cursors) {
      this.MovVelocity.update();
      if (self.player) self.player.updateAnim(this.cursors);
    }
  }

  //   this._isoBounds.widthX
  // this._isoBounds.widthY
  // this._isoBounds.height

  // this._isoBounds.x
  // this._isoBounds.y
  // this._isoBounds.z

  colliders() {
    if (this.player && this.player.body) {
      // this.isoGroup?.getChildren().forEach((child) => {
      //   const _child = child as unknown as IsoSpriteBox;
      //   if (_child.intersects && _child.primarySprite) {
      //     const playerRectangle = new Phaser.Geom.Rectangle(
      //       this.player?.isoX,
      //       this.player?.isoY,
      //       this.player?._isoBounds.widthX,
      //       this.player?._isoBounds.height
      //     );
      //     console.log(
      //       playerRectangle.contains(_child.isoX, _child.isoY),
      //       "ARIEL"
      //     );

      //     _child.intersects(
      //       this.player,
      //       _child,
      //       this.isoPhysics.world.intersects(
      //         this.player?.primarySprite.body,
      //         _child.primarySprite.body
      //       )
      //     );
      //   }
      // });
      this.isoPhysics.world.collide(
        this.player,
        this.isoGroup?.getChildren(),
        (a: Player, b: GenericTile) => {
          switch (b.objectType) {
            case "JumpTile":
              if (this.player?.body) {
                this.player?.setVelocity(
                  this.player.body.velocity.x,
                  this.player.body.velocity.y,
                  600
                );
              }
              break;
            case "ButtonTile":
              if (!a.playerOnButton) {
                a.playerOnButton = true;
                this.resetMatrixConected();
                this.connect(b);
                this.toggleImage(b);
              }
              break;
            case "CollapsableTile":
              if (b.behavior) {
                b.behavior(a, b, self);
              }
              break;
            case "EndTile":
              this.lose();
            default:
              a.playerOnButton = false;
              a.playerOnCollapsable = false;
          }
        },
        () => true,
        this
      );
      if (this.player.isoZ < 1000) this.lose();
    }
  }

  lose() {
    if (this.player && this.initialPosition)
      this.player.setPosition(
        this.initialPosition[0],
        this.initialPosition[1],
        this.initialPosition[2]
      );
    this.player?.setVelocity(0, 0, 0);
  }

  animateBackground(player: Player) {
    if (this.background && this.starsBackground && player) {
      const x = -500;
      const y = -1000;
      const { x: x2, y: y2 } = player.self;
      const calcDiffX = (x2 - x) / 1.5; //mas grande menos movimiento
      const calcDiffY = (y2 - y) / 1.5;
      this.background
        .setPosition(x + calcDiffX, y + calcDiffY)
        .setDepth(9)
        .setScale(1.5);
      this.starsBackground
        .setPosition(x + calcDiffX, y + calcDiffY)
        .setDepth(99)
        .setScale(1.5);
    }
  }

  connect(element: any) {
    const fila = this.matriz.find((row) => row.map((t) => t).includes(element));
    if (fila) {
      const indexFila = this.matriz.indexOf(fila);
      const indexColumn = fila?.indexOf(element);
      // Verificar si el elemento ya fue visitado antes de continuar
      if (!element.visited) {
        element.visited = true; // Marcar el elemento como visitado
        this.checkAdjacent(indexFila, indexColumn);
      }
    }
  }

  checkAdjacent(row: number, column: number) {
    const adjacentPositions = [
      { row: row - 1, column }, // Arriba
      { row: row + 1, column }, // Abajo
      { row, column: column - 1 }, // Izquierda
      { row, column: column + 1 }, // Derecha
    ];

    adjacentPositions.forEach((pos) => {
      const { row, column } = pos;
      if (
        row >= 0 &&
        row < this.matriz.length &&
        column >= 0 &&
        column < this.matriz[0].length
      ) {
        const adjacentElement = this.matriz[row][column];
        if (
          adjacentElement &&
          adjacentElement.isWay &&
          !adjacentElement.visited
        ) {
          this.toggleImage(adjacentElement);
          this.connect(adjacentElement);
        }
      }
    });
  }

  resetMatrixConected() {
    this.matriz.forEach((row) => {
      row.forEach((element) => {
        if (element && element.visited) {
          element.visited = false;
        }
      });
    });
  }

  generarMatriz() {
    let maxFila = 0;
    let maxColumna = 0;
    this.matriz = new Array(5).fill(null).map((a) => new Array(9).fill(null));
    this.children.getChildren().forEach((tile: IsoSprite) => {
      if (tile.body) {
        let filaActual = tile.body?.position.x / tile.height;
        let columnaActual = tile.body?.position.y / tile.height;
        if (tile.texture?.key != "cube") {
          maxFila = filaActual > maxFila ? filaActual : maxFila;
          maxColumna = columnaActual > maxColumna ? columnaActual : maxColumna;
        }
      }
      if (tile.isoConfig) {
        if (!this.matriz[tile.isoConfig.y]) this.matriz[tile.isoConfig.y] = [];
        this.matriz[tile.isoConfig.y][tile.isoConfig.x] = tile;
      }
    });
    this.children.getChildren().forEach((tile: IsoSprite) => {
      if (tile.texture?.key != "cube" && tile.texture?.key != undefined) {
        if (tile.body && tile.body.position) {
          let fila = tile.body?.position.x / tile.height;
          let columna = tile.body?.position.y / tile.height;
          this.matriz[fila][columna] = tile;
        }
      }
    });
  }

  toggleImage(tile: any) {
    if (tile.texture.key === tile.imageOff) {
      tile.setTexture(tile.imageOn);
    } else if (tile.texture.key === tile.imageOn) {
      tile.setTexture(tile.imageOff);
    }
  }

  drawPlayer() {
    this.actualMapPos = new MapManager(this.maps[0] as unknown as string, this);
    const self = this;
    const conf = {
      height: 1600,
      "1": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
        baseTile({ a, b, c, that, self , conf , objectKey}),
      "3": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
        playerTile({ a, b, c, that, self , conf , objectKey}),
      "4": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
        buttonTile({ a, b, c, that, self , conf , objectKey}),
      "5": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
        wayTile({ a, b, c, that, self , conf , objectKey}),
      "8": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
        collapsableTile({ a, b, c, that, self , conf , objectKey}),
      "9": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
        jumpTile({ a, b, c, that, self , conf , objectKey}),
      "10": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
        endTile({ a, b, c, that, self , conf , objectKey}),
      "11": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
        endTile({ a, b, c, that, self , conf , objectKey}),
    };
    //@ts-ignore
    this.actualMapPos.drawMap(this.isoGroup, conf);
    this.isoGroup?.getChildren().map((item: any) => {
      var cam = this.cameras.main;
      if (item.isPlayer) {
        this.player = item;
        this.player?.self.setDepth(1);
        if (this.player) cam.startFollow(this.player, true, 0.1, 0.1);
      }
    });
  }

  spawnTiles() {
    this.drawPlayer();
    const self = this;
    for (let index = 1; index < this.maps.length; index++) {
      const m = new MapManager(this.maps[index], this);
      // const map = this.maps[index];
      const h = 1000 + index * 600;
      // const m = new MapManager(map, this);
      const conf = {
        height: 1600,
        "1": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
          baseTile({ a, b, c, that, self , conf , objectKey}),
        "3": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
          playerTile({ a, b, c, that, self , conf , objectKey}),
        "4": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
          buttonTile({ a, b, c, that, self , conf , objectKey}),
        "5": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
          wayTile({ a, b, c, that, self , conf , objectKey}),
        "8": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
          collapsableTile({ a, b, c, that, self , conf , objectKey}),
        "9": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
          jumpTile({ a, b, c, that, self , conf , objectKey}),
        "10": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
          endTile({ a, b, c, that, self , conf , objectKey}),
        "11": (a: string, b: number, c: number, that: MapManager, objectKey: string) =>
          endTile({ a, b, c, that, self , conf , objectKey}),
      };
      //@ts-ignore
      m.drawMap(this.isoGroup, conf);
    }
  }
}
