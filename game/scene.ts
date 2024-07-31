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

export default class IsoExperimentalMap extends Scene {
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
  level?: number
  background?: GameObjects.Image;
  starsBackground?: GameObjects.Image;
  backgroundLight?: GameObjects.Image;
  backgroundLightColored?: GameObjects.Image;
  bottomGalaxy?: GameObjects.Image;
  topGalaxy?: GameObjects.Image;
  initialPosition?: number[];
  sceneKey: string;
  sceneStatus: statusEnum = statusEnum.IDLE;
  uiReference?: UIScene;
  losingLife: boolean = false;
  music?: Audio;
  spawnSound?: Audio
  loseSound?: Audio
  winSound?: Audio
  firstCollition: boolean = true

  constructor(maps: string[]) {
    const sceneConfig = {
      key: "IsoExperimentalMap",
      mapAdd: { isoPlugin: "iso", isoPhysics: "isoPhysics" },
    };
    super(sceneConfig);
    this.maps = maps;
    this.sceneKey = sceneConfig.key;
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

  loseLife(resetBarLife?: boolean) {
    EventsCenter.emit("loseLife");
    this.scene.pause();
    this.loseSound?.play()
  }

  win() {
    EventsCenter.emit("win");
    this.scene.pause();
    this.winSound?.play()
  }

  destroy(){
    
  }

  create() {
    this.starsBackground = this.add.image(-500, -1000, "stars");
    this.background = this.add.image(-500, -1000, "backgroundSpace");
    this.backgroundLight = this.add.image(-500, -1000, "backgroundLight");
    this.backgroundLightColored = this.add.image(
      -500,
      -1000,
      "backgroundLightColored"
    );
    this.bottomGalaxy = this.add.image(-500, -1000, "bottomGalaxy");
    this.topGalaxy = this.add.image(-500, -1000, "topGalaxy");
    //default
    this.isoPhysics.world.setBounds(-1024, -1024, 1024 * 2, 1024 * 4);
    this.isoPhysics.world.gravity.setTo(0, 0, -500);
    this.isoPhysics.projector.origin.setTo(0.5, 0.3);
    this.scale.resize(window.innerWidth, window.innerHeight);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.isoGroup = this.add.group();
    this.spawnSound = this.sound.add('spawn').setVolume(0.1)
    this.loseSound = this.sound.add('lose').setVolume(0.5)
    this.winSound = this.sound.add('win').setVolume(0.5)
  
    this.drawPlayer();

    this.level = GlobalDataSingleton.scope.level
    this.spawnTiles();
    this.generarMatriz();
    const MusicManager = this.game.scene.getScene("MusicManager");
    //TODO: parche: ejecuto el toggleSound para setear el sonido igual que en el nivel anterior
    //@ts-ignore
    EventsCenter.emit("toggleSound", {on: !MusicManager.soundStatus, gameScene: this});
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
      });
    }
    this.sceneStatus = statusEnum.RUNNING;
    /* UI SCENE  */
    const UIScene = this.game.scene.getScene("UIScene") as UIScene;
    this.uiReference = UIScene;
    this.scene.launch(UIScene).moveBelow("UIScene", this.sceneKey);
    // AUDIO CONFIG
    if (!MusicManager?.scene.isActive()) {
      // this.scene.launch(MusicManager, { level: this.level, lifes: this.lifes, game: this, levelTime: this.levelTime ? this.levelTime : 180 }).moveBelow("MusicManager", this.sceneKey)
      this.scene.launch(MusicManager).moveBelow("MusicManager", this.sceneKey);
    } else {
      this.scene.moveBelow("MusicManager", this.sceneKey);
    }
    this.adjustObjectsDepth();
  }

  update() {
    //TODO: soluciona el depth de la barrera, rompe en algunas sobreposiciones
    // this.adjustObjectsDepth();
    const self = this;
    this.colliders();
    if (self.player && self.cursors) {
      this.animateBackground(self.player);
      self.player.updateAnim(self.cursors);
    }
    if (this.MovVelocity) this.MovVelocity.update();
  }

  makeTransition(
    sceneNameStart: string,
    sceneNameStop: string,
    data?: LevelDataType
  ) {
    const getBetweenScenesScene = this.game.scene.getScene(
      "BetweenScenes"
    ) as BetweenScenes;
    getBetweenScenesScene.changeSceneTo(sceneNameStart, sceneNameStop, data);
  }

  adjustObjectsDepth() {
    this.isoGroup?.getChildren().forEach((obj: any) => {
      if (obj.texture.key === "ballAnim") {
        console.log(this.player);
        // const a = 0;
        // obj.setDepth(a);
        if (this.player)
          if (this.player.isoZ < 2068) {
            const a = 10000;
            obj.setDepth(a);
            //@ts-ignore
            console.log(this.player.depth);
          }
      }
      if (obj.texture.key !== "ballAnim") {
        //@ts-ignore
        const depth = obj.isoY + 100;
        //@ts-ignore
        obj.setDepth(depth);
      }
    });
  }



  colliders() {
    if (this.player && this.player.body) {
      if (this.cursors) {
        this.MovVelocity = new MovVelocity(this.player, this, this.cursors, {
          pxVelocity: 300,
        });
      }
      this.isoPhysics.world.collide(
        this.player,
        this.isoGroup?.getChildren(),
        (a: Player, b: any) => {
          if (b.objectType === "ObjectItem")
          if (b.objectType !== "PortalTile" && this.player)
            this.player.canTp = true;
          if (this.firstCollition) {
            this.spawnSound?.play()
            this.firstCollition = false
          }
          switch (b.objectType) {
            case "JumpTile":
              b.playSound(a);
              if (this.player?.body) {
                this.player?.setVelocity(
                  this.player.body.velocity.x,
                  this.player.body.velocity.y,
                  600
                );
              }
              break;
            case "BarrierTower":
              if (this.player?.body) {
              }
              break;
            case "Barrier":
              if (this.player?.body) {
                b.playSound(a);
              }
              break;
            case "ButtonTile":
              if (!a.playerOnButton) {
                a.playerOnButton = true;
                this.resetMatrixConected();
                this.connect(b);
                this.toggleImage(b);
                b.isOn = !b.isOn
                b.playSound(a)
              }
              break;
            case "CollapsableTile":
              if (b.behavior) {
                b.behavior(a, b, self);
                b.playSound(a);
              }
              break;
            case "PortalTile":
              EventsCenter.emit("portalTaken");
              const otherPortal = this.matriz
              .flat() 
              .find(tile => tile && tile.objectType === "PortalTile" && tile !== b);
              if (otherPortal && this.player && (!a.playerOnObj || a.playerOnObj !== b.objectType)) {
                  const { isoX, isoY, isoZ } = otherPortal;
                  this.player.setPosition(isoX + 50, isoY + 50, this.player.isoZ + 100);
                  b.playSound(a)
              }
              break;
            case "Star":
              b.grabItem();
              b.playSound(a);
              break;
            case "ToxicTile":
              b.effect(a);
              EventsCenter.emit("toxic", { amount: 3, loseSound: this.loseSound });
              break;
            case "EndTile":
              b.isOn && this.win();
              break;
            case "IceTile":
              if (this.player && this.cursors)
                this.MovVelocity = new MovVelocity(
                  this.player,
                  this,
                  this.cursors,
                  {
                    pxVelocity: 600,
                  }
                );
              break;
            default:
              //TODO: quitar flags y usar la flag dinamica (playerOnObj)
              a.playerOnButton = false;
              a.playerOnToxic = false;
              a.playerOnObj = false;
          }
          a.playerOnObj = b.objectType
        },
        () => true,
        this
      );
      if (this.player.isoZ < 1000) {
        if (!this.losingLife) {
          this.losingLife = true;
          this.loseLife();
        }
      }
    }
  }

  animateBackground(player: Player) {
    const backgrounds = [
      { element: this.starsBackground, depth: 99, scale: 1.5 },
      { element: this.background, depth: 9, scale: 1.5 },
      { element: this.backgroundLight, depth: 99, scale: 1.5 },
      { element: this.backgroundLightColored, depth: 99, scale: 1.5},
      { element: this.bottomGalaxy, depth: 99, scale: 1.5 },
      { element: this.topGalaxy, depth: 99, scale: 1.5 },
    ];
    

    if (player) {
      const x = -500;
      const y = -1000;
      const { x: x2, y: y2 } = player.self;
      const calcDiffX = (x2 - x) / 1.5; // más grande, menos movimiento
      const calcDiffY = (y2 - y) / 1.5;

      backgrounds.forEach((bg) => {
        if (bg.element) {
          bg.element
            .setPosition(x + calcDiffX, y + calcDiffY)
            .setDepth(bg.depth)
            .setScale(bg.scale);
        }
      });
    }
  }

  connect(element: any) {
    const fila = this.matriz.find((row) => row.map((t) => t).includes(element));
    if (fila) {
      const indexFila = this.matriz.indexOf(fila);
      const indexColumn = fila?.indexOf(element);
      if (!element.visited) {
        element.visited = true; // Marcar el elemento como visitado
        this.checkAdjacent(indexFila, indexColumn, element);
      }
    }
    this.adjustObjectsDepth();
  }

  checkAdjacent(row: number, column: number, prevElement: IsoSprite) {
    const prevElemetDirection = prevElement.texture.key.split("|")[1] ?? "C";
    let adjacentPositions = [];
    if (prevElemetDirection.includes("L"))
      adjacentPositions.push({ row: row - 1, column });
    if (prevElemetDirection.includes("R"))
      adjacentPositions.push({ row: row + 1, column });
    if (prevElemetDirection.includes("T"))
      adjacentPositions.push({ row, column: column - 1 });
    if (prevElemetDirection.includes("B"))
      adjacentPositions.push({ row, column: column + 1 });
    if (prevElemetDirection.includes("C")) {
      adjacentPositions = [
        { row: row - 1, column }, // Arriba
        { row: row + 1, column }, // Abajo
        { row, column: column - 1 }, // Izquierda
        { row, column: column + 1 }, // Derecha
      ];
    }

    adjacentPositions.forEach((pos) => {
      const { row, column } = pos;
      if (
        row >= 0 &&
        row < this.matriz.length &&
        column >= 0 &&
        column < this.matriz[0].length
      ) {
        const adjacentElement = this.matriz[row][column];
        const hasDirection = adjacentElement?.texture.key.split("|").length > 1;
        const adyKey = adjacentElement?.texture.key;
        const adyX = adjacentElement?.isoConfig.x;
        const adyY = adjacentElement?.isoConfig.y;
        const prevX = prevElement.isoConfig.x;
        const prevY = prevElement.isoConfig.y;
        if (
          (adyX > prevX && adyKey.includes("T")) ||
          (adyX < prevX && adyKey.includes("B")) ||
          (adyY < prevY && adyKey.includes("R")) ||
          (adyY > prevY && adyKey.includes("L")) ||
          adyKey?.includes("C") ||
          !hasDirection
        ) {
          if (adjacentElement && !adjacentElement.visited) {
            const tileObject = adjacentElement.primarySprite ?? null;
            if (tileObject)
              tileObject.forEach(
                (to: any) => to.isConnectable && to.onConnect()
              );
            if (adjacentElement.isConnectable) {
              if (adjacentElement.onConnect) adjacentElement.onConnect();
              this.toggleImage(adjacentElement);
              this.connect(adjacentElement);
            }
          }
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
    this.matriz = new Array(9).fill(null).map(() => new Array(9).fill(null));
    this.children.getChildren().forEach((tile: IsoSprite) => {
      if (tile.isoConfig) {
        if (!this.matriz[tile.isoConfig.y]) this.matriz[tile.isoConfig.y] = [];
        this.matriz[tile.isoConfig.y][tile.isoConfig.x] = tile;
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
    this.actualMapPos = new MapManager(this.maps[1] as unknown as string, this);
    const self = this;
    const conf = {
      height: 1600,
      P: (
        a: string,
        b: number,
        c: number,
        that: MapManager,
        conf: ConfObjectType,
        objectKey: string
      ) => {
        const player = new Player(
          that.game,
          that.setPosFromAnchor(b, c).x + 50,
          that.setPosFromAnchor(b, c).y + 50,
          2860,
          "ballAnim",
          0,
          self.isoGroup
        );
        player.self.setScale(0.1);
        if (player.primarySprite) player.primarySprite.setScale(1);
        return player;
      },
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
    // this.drawPlayer();
    const self = this;
    const m = new MapManager(this.maps[2], this);
    const lvlConf = this.maps[0];
    for (let index = 2; index < this.maps.length; index++) {
      const map = this.maps[index];
      // const h = 1000 + index * 600;
      const h = 1600;
      const m = new MapManager(map, this);
      const conf = {
        height: h,
        structure: (
          a: string,
          b: number,
          c: number,
          that: MapManager,
          conf: ConfObjectType,
          objectKey: string
        ) => {
          const { game, setPosFromAnchor } = that;
          const { height } = conf;
          const x = setPosFromAnchor(b, c).x;
          const y = setPosFromAnchor(b, c).y;
          let tileObj;

          const tile = TileFactory.createObject(
            game,
            x,
            y,
            height,
            a,
            0,
            self.isoGroup
          );
          if (tile?.isoConfig) tile.isoConfig = { x: b, y: c };
          if (objectKey) {
            tileObj = TileObjectFactory.createObject(
              game,
              x,
              y,
              height + 630,
              objectKey,
              0,
              self.isoGroup
            );
          }
          if (tile)
            //@ts-ignore
            tile.primarySprite = tileObj as GameObjects.Sprite[] | undefined;
          // if (tile?.primarySprite)
          //   tile?.primarySprite.forEach((to) => to.setOrigin(0.5, 0.5));
        },
      };
      //@ts-ignore
      m.drawMap(this.isoGroup, conf, lvlConf);
    }
  }
}
