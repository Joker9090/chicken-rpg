import { GameObjects, Scene } from "phaser";
//@ts-ignore
import IsoPlugin, { IsoPhysics } from "phaser3-plugin-isometric";
import MapManager from "@/game/mapManager";
import { ConfObjectType } from "./types";
import { RpgIsoSpriteBox } from "./Assets/rpgIsoSpriteBox";
import { RpgIsoPlayerPrincipal } from "./Assets/rpgIsoPlayerPrincipal";
import { RpgIsoPlayerSecundarioTalker } from "./Assets/rpgIsoPlayerSecundarioTalker";
import UIContainer from "./Assets/UIAssetsChicken/UIContainer";
import { PinIsoSpriteBox } from "./Assets/pinIsoSpriteBox";
import { ModalConfig, ModalContainer } from "./Assets/ModalContainer";
import GlobalDataManager from "./GlobalDataManager";
import { changeSceneTo, getObjectByType, makeOpacityNearPlayer } from "./helpers/helpers";
import Room from "./maps/Room";
import TileCreator from "./helpers/TileCreator";
import City from "./maps/City";

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

export enum modalType {
  QUEST,
  PC,
}

export default class RPG extends Scene {

  tileCreator: TileCreator;
  mapType: 'ROOM' | 'CITY' = 'ROOM';
  map?: Room;
  mapBlueprint?: any[];
  UIContainer?: UIContainer;


  withPlayer: Boolean;
  cameraTunnel?: Phaser.GameObjects.Arc;

  mapsBuilded: any[] = []; // q vergis es esto?

  isoPhysics: IsoPhysics;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  isoGroup?: Phaser.GameObjects.Group;
  sceneKey: string;
  forest: Array<RpgIsoSpriteBox> = [];
  player?: RpgIsoPlayerPrincipal;
  NPCTalker?: RpgIsoPlayerSecundarioTalker;
  UICamera?: Phaser.Cameras.Scene2D.Camera;
  group?: Phaser.GameObjects.Group;
  distanceBetweenFloors: number = 50;
  eventEmitter?: Phaser.Events.EventEmitter;

  input: any;

  // sky1?: Phaser.GameObjects.Rectangle;
  // sky2?: Phaser.GameObjects.Rectangle;
  // sky3?: Phaser.GameObjects.Rectangle;
  // sky4?: Phaser.GameObjects.Rectangle;

  constructor(mapType: 'ROOM' | 'CITY') {
    const sceneConfig = {
      key: "RPG",
      mapAdd: { isoPlugin: "iso", isoPhysics: "isoPhysics" },
    };
    super(sceneConfig);
    this.mapType = mapType;
    this.sceneKey = sceneConfig.key;
    this.withPlayer = true;
    switch (this.mapType) {
      case 'ROOM':
        this.map = new Room(this)
        this.mapBlueprint = this.map.map.map((m) => (typeof m === "string" ? m : JSON.stringify(m)));
        break;
      case 'CITY':
        this.map = new City(this)
        this.mapBlueprint = this.map.map.map((m) => (typeof m === "string" ? m : JSON.stringify(m)));
        break;
      default:
        this.map = new Room(this)
        this.mapBlueprint = this.map.map.map((m) => (typeof m === "string" ? m : JSON.stringify(m)));
        break;
    }
    this.tileCreator = new TileCreator(this)
  }

  preload() {
    // ASSETS UI ->
    this.load.image("background", "/assets/chickenUIAssets/background.png");
    this.load.image("settingsIcon", "/assets/chickenUIAssets/settingsIcon.png");
    this.load.image("helpIcon", "/assets/chickenUIAssets/helpIcon.png");

    this.load.image("exit", "/assets/chickenUIAssets/cerrar.png");
    this.load.image("exitClick", "/assets/chickenUIAssets/cerrarClick.png");
    this.load.image("exitHover", "/assets/chickenUIAssets/cerrarHover.png");

    this.load.image("save", "/assets/chickenUIAssets/save.png");
    this.load.image("saveClick", "/assets/chickenUIAssets/saveClick.png");
    this.load.image("saveHover", "/assets/chickenUIAssets/saveHover.png");

    this.load.image("cancel", "/assets/chickenUIAssets/cancel.png");
    this.load.image("cancelClick", "/assets/chickenUIAssets/cancelClick.png");
    this.load.image("cancelHover", "/assets/chickenUIAssets/cancelHover.png");

    this.load.image("on", "/assets/chickenUIAssets/on.png");
    this.load.image("off", "/assets/chickenUIAssets/off.png");

    this.load.image("varFull", "/assets/chickenUIAssets/varFull.png");
    this.load.image("varEmpty", "/assets/chickenUIAssets/varEmpty.png");
    this.load.image("varSelector", "/assets/chickenUIAssets/varSelector.png");

    this.load.image("reloj", "/assets/UI/UILevel/reloj.png");

    this.load.image("coinUi", "/assets/UI/UiChiken/coinUi.png");
    this.load.image("barEmpty", "/assets/UI/UiChiken/barEmpty.png");
    this.load.image("varStar", "/assets/UI/UiChiken/varStar.png");
    this.load.image("varFullLila", "/assets/UI/UiChiken/varFullLila.png");
    this.load.image("varFullYellow", "/assets/UI/UiChiken/varFullYellow.png");
    this.load.image("varSmile", "/assets/UI/UiChiken/varSmile.png");
    this.load.image("iconNewsOff", "/assets/UI/UiChiken/iconNewsOff.png");
    this.load.image("iconNewsOn", "/assets/UI/UiChiken/iconNews.png");


    // <- ASSETS UI

    //Modal assets
    this.load.image("modalBackground", "/assets/modalAssets/modal.png");
    this.load.image("desafioTest1", "/assets/modalAssets/maskImg2.png");
    this.load.image("desafioTest2", "/assets/modalAssets/maskImg3.png");
    this.load.image("barraTitle", "/assets/modalAssets/barraTittle.png");
    this.load.image("btnExit", "/assets/modalAssets/btnExit.png");
    this.load.image("barritaOff", "/assets/modalAssets/barritaOff.png");
    this.load.image("barritaOn", "/assets/modalAssets/barritaOn.png");
    this.load.image("btn", "/assets/modalAssets/btn.png");
    this.load.image("iconClock", "/assets/modalAssets/iconClock.png");
    this.load.image("iconMoon", "/assets/modalAssets/iconMoon.png");
    this.load.image("iconSun", "/assets/modalAssets/iconSun.png");
    this.load.image("iconSunrise", "/assets/modalAssets/iconSunrise.png");
    this.load.image("iconSunset", "/assets/modalAssets/iconSunset.png");
    this.load.image("coin", "/assets/modalAssets/coin.png");
    this.load.image("camaraGrey", "/assets/modalAssets/masUi/camaraGrey.png");
    this.load.image("camaraWhite", "/assets/modalAssets/masUi/camaraWhite.png");
    this.load.image("camaraGreen", "/assets/modalAssets/masUi/camaraGreen.png");
    this.load.image("camaraShop", "/assets/modalAssets/camaraShop.png");
    this.load.image("camaraShopOn", "/assets/modalAssets/camaraShopOn.png");

    //Room assets
    this.load.image("room1", "/assets/room/room1.png");
    this.load.image("room2", "/assets/room/room2.png");
    this.load.image("HabitacionFinalMai", "/assets/room/HabitacionFinalMai.png");
    this.load.image("pcGlow", "/assets/room/CompuGlow.png");
    this.load.image("cama", "/assets/room/cama.png");
    this.load.image("puertaGlow", "/assets/room/PuertaGlow.png");


    // otros assets
    this.load.image("tile", "/images/bloque.png");
    this.load.image("pin", "/images/pin.png");
    this.load.image("street-a", "/images/street-a.png");
    this.load.image("street-b", "/images/street-b.png");
    this.load.image("street-c", "/images/street-c.png");
    this.load.image("cube1", "/images/cube1.png");
    this.load.image("traffic-light-a", "/images/traffic-light-a.png");
    this.load.image("traffic-light-b", "/images/traffic-light-b.png");
    this.load.image("grassTEST", "/images/bloque1TEST.png");
    this.load.image("buildingTEST", "/images/building1TEST.png");
    this.load.image("blockBuilding", "/images/bloque3TEST.png");
    this.load.image("blockBuilding-b", "/images/bloque4TEST.png");
    this.load.image("blockBuildingBase", "/images/bloque2TEST.png");
    this.load.image("blockBuildingEmpty", "/images/bloque5TEST.png");



    this.load.spritesheet("chicken", "/images/chicken/spritesheetChicken.png", {
      frameWidth: 552 / 4,
      frameHeight: 1152 / 12,
      startFrame: 0,
    });

    this.load.spritesheet("player", "/images/chicken/spritesheetPlayer.png", {
      frameWidth: 200,
      frameHeight: 250,
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


  // openModal() {
  //   const globalDataManager = this.game.scene.getScene("GlobalDataManager") as GlobalDataManager
  //   const handleAgreeModal = () => {
  //     globalDataManager.passTime(1)
  //     this.isoGroup?.getChildren().forEach((child) => {
  //       if (child.type === "PIN") {
  //         const pin = child as unknown as PinIsoSpriteBox;
  //         pin.self.destroy();
  //       }
  //     });
  //   }
  //   const cityModal: ModalConfig = {
  //     type: modalType.QUEST,
  //     title: "FOTOS EMBLEMATICAS",
  //     picture: "fotoCamara",
  //     time: "6",
  //     text: "Sal a tomar fotos al parque.",
  //     reward: "15",
  //     agreeFunction: handleAgreeModal,
  //   }
  //   const ModalTest = new ModalContainer(this, 0, 0, cityModal);
  // }


  // makeDayCycle = (index: number, callback: Function) => {
  //   if (this.sky1 && this.sky2 && this.sky3 && this.sky4) {
  //     const DayDuration = 2000
  //     const skies = [this.sky1, this.sky2, this.sky3, this.sky4]
  //     if (index === 3) {
  //       this.tweens.add({
  //         targets: skies[index],
  //         alpha: 0,
  //         duration: DayDuration / 4,
  //         onComplete: () => {
  //           skies[index].setAlpha(0)
  //         }
  //       })
  //       this.tweens.add({
  //         targets: skies[0],
  //         alpha: 1,
  //         duration: DayDuration / 4,
  //         onComplete: () => {
  //           skies[0].setAlpha(1)
  //           callback(0, callback)
  //         }
  //       })
  //     } else {
  //       this.tweens.add({
  //         targets: skies[index],
  //         alpha: 0,
  //         duration: DayDuration / 4,
  //         onComplete: () => {
  //           skies[index].setAlpha(0)
  //         }
  //       })
  //       this.tweens.add({
  //         targets: skies[index + 1],
  //         alpha: 1,
  //         duration: DayDuration / 4,
  //         onComplete: () => {
  //           skies[index + 1].setAlpha(1)
  //           callback(index + 1, callback)
  //         }
  //       })
  //     }
  //   }
  // }

  create() {
    this.isoGroup = this.add.group();

    // SKY
    // const skyCam = this.cameras.add(0, 0, window.innerWidth, window.innerHeight);
    // this.cameras.cameras = [skyCam, this.cameras.main];

    // this.sky4 = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x1f3558).setAlpha(0).setOrigin(0)
    // this.sky1 = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0xaefbff).setAlpha(0).setOrigin(0)
    // this.sky2 = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x4ddbff).setAlpha(0).setOrigin(0)
    // this.sky3 = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0xffd194).setAlpha(0).setOrigin(0)
    // const skies = [this.sky1, this.sky2, this.sky3, this.sky4]

    // this.cameras.main.ignore([this.sky1, this.sky2, this.sky3, this.sky4])



    // makeDayCycle(0, makeDayCycle)
    // SKY 


    this.isoPhysics.world.setBounds(-1024, -1024, 1024 * 2, 1024 * 4);
    this.isoPhysics.projector.origin.setTo(0.5, 0.3); // permitime dudas
    this.isoPhysics.world.gravity.setTo(0); // permitime dudas
    const ee = this.events;
    this.eventEmitter = ee;

    // resize the game
    this.scale.resize(window.innerWidth, window.innerHeight);

    // agregamos controles de teclado
    this.cursors = this.input.keyboard.createCursorKeys();

    // una creacion de un group para guardar todos los tiles

    const posiblePositions = [
      "idle-w",
      "idle-s",
      "idle-e",
      "idle-n",
      "walk-w",
      "walk-s",
      "walk-e",
      "walk-n",
    ];

    for (let index = 0; index < 8; index++) {
      if (index >= 0 && index <= 3) {
        this.anims.create({
          key: posiblePositions[index],
          frames: this.anims.generateFrameNumbers("player", {
            start: index === 0 ? 14 : index === 1 ? 34 : index === 2 ? 55 : 65,
            end: index === 0 ? 14 : index === 1 ? 34 : index === 2 ? 55 : 65,
          }),
          frameRate: 20,
          repeat: -1,
        });
      } else {
        this.anims.create({
          key: posiblePositions[index],
          frames: this.anims.generateFrameNumbers("player", {
            start: index === 4 ? 0 : index === 5 ? 20 : index === 6 ? 40 : 60,
            end: index === 4 ? 19 : index === 5 ? 39 : index === 6 ? 59 : 79,
          }),
          frameRate: 40,
          repeat: -1,
        });
      }
    }

    // crea lo tiles
    this.spawnTiles();
    this.spawnObjects();
    this.cameras.main.setZoom(0.6);
    this.cameras.main.setViewport(0, 0, window.innerWidth, window.innerHeight);


    // let playerInfo = globalDataManager.getState()

    // const ui = new UI(this)

    // ui.hidrate(playerInfo)
    // turnEventOn(this.scene.key, possibleEvents.INFO_UPDATE, ui.hidrate, this)



    // WORKKSHOP NANEX
    this.UIContainer = new UIContainer(this, 0, 0, this.mapType);
    this.UICamera = this.cameras.add(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
    this.UICamera.ignore(this.isoGroup);
    const forestContainers = this.forest.map((arbolito) => arbolito.container);

    // skyCam.ignore(this.isoGroup);
    // this.UICamera.ignore([this.sky1, this.sky2, this.sky3, this.sky4])
    this.UICamera.ignore(forestContainers);
    // skyCam.ignore(forestContainers);
    // skyCam.ignore(this.UIContainer);


    const globalDataManager = this.game.scene.getScene("GlobalDataManager") as GlobalDataManager
    // skies[globalDataManager.getState().timeOfDay].setAlpha(1)

    //Room events ---->
  

    this.map?.addMapFunctionalities();

    if (!this.withPlayer) {
      this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
        if (pointer.isDown) {
          this.cameras.main.scrollX -= pointer.velocity.x / 2;
          this.cameras.main.scrollY -= pointer.velocity.y / 2;
        }
      });
    }

    this.input.on(
      "wheel",
      (
        pointer: Phaser.Input.Pointer,
        gameObjects: any[],
        deltaX: number,
        deltaY: number,
        deltaZ: number
      ) => {
        if (deltaY > 0) {
          var newZoom = this.cameras.main.zoom - 0.1;
          if (newZoom > 0.3) {
            this.cameras.main.zoom = newZoom;
          }
        }

        if (deltaY < 0) {
          var newZoom = this.cameras.main.zoom + 0.1;
          if (newZoom < 1.3) {
            this.cameras.main.zoom = newZoom;
          }
        }
      }
    );

    if (window.innerWidth < 900) {
      this.eventEmitter?.addListener(
        "zoomIn",
        () => {
          var newZoom = this.cameras.main.zoom + 0.1;
          if (newZoom < 1.3) {
            this.cameras.main.zoom = newZoom;
          }
        },
        this
      );
      this.eventEmitter?.addListener(
        "zoomOut",
        () => {
          var newZoom = this.cameras.main.zoom - 0.1;
          if (newZoom > 0.3) {
            this.cameras.main.zoom = newZoom;
          }
        },
        this
      );

      if (this.player) {
        this.eventEmitter?.addListener(
          "moveLeft",
          () => {
            this.player?.move("w", -1, 0);
          },
          this
        );

        this.eventEmitter?.addListener(
          "moveRight",
          () => {
            this.player?.move("e", 1, 0);
          },
          this
        );

        this.eventEmitter?.addListener(
          "moveTop",
          () => {
            this.player?.move("n", 0, 1);
          },
          this
        );

        this.eventEmitter?.addListener(
          "moveBottom",
          () => {
            this.player?.move("s", 0, -1);
          },
          this
        );
      }
    }

    this.time.delayedCall(300, () => {
      getObjectByType(this, "PIN")?.forEach((_pin: GameObjects.GameObject) => {
        const pin = _pin as unknown as PinIsoSpriteBox;
        if (this.isoGroup) pin.updatePin(this.isoGroup);
      });
    });
  }


  spawnObjects() {
    if (this.mapBlueprint){

    let scalar = 0;
    let h;
    const _lvlConf = this.mapBlueprint[0];
    const lvlConf = JSON.parse(_lvlConf);

    this.distanceBetweenFloors = lvlConf.distanceBetweenFloors;
    h = this.distanceBetweenFloors;

    const objectsMaps = JSON.parse(this.mapBlueprint[1]);

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

            if (objectKey == "PLAYER-S") {
              if (this.withPlayer) {
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
                  "Pepe",
                  this.distanceBetweenFloors
                );
              }
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
      m.drawMap(this.isoGroup, conf, lvlConf);
    }
  }

  }

  spawnTiles() {
    if (this.mapBlueprint){
    const self = this;
    let pos = 0;
    let h: number;
// this.makeTransition("RPG", undefined, { maps: map2.map((m) => (typeof m === "string" ? m : JSON.stringify(m))) });
    const _lvlConf = this.mapBlueprint[0];
    const lvlConf = JSON.parse(_lvlConf);

    this.distanceBetweenFloors = lvlConf.distanceBetweenFloors;
    h = this.distanceBetweenFloors;

    // function tweenTile(tile: RpgIsoSpriteBox) {
    //   return () => {
    //     self.tweens.add({
    //       targets: tile.self,
    //       isoZ: tile.isoZ + 10,
    //       duration: 200,
    //       yoyo: true,
    //       repeat: 0,
    //     });
    //   };
    // }

    let scalar = 0;
    let startOnMap = 2;

    for (let index = startOnMap; index < this.mapBlueprint.length; index++) {
      // reverse the map string
      const map = this.mapBlueprint[index];

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
              this.tileCreator.createGrassTile(b, c, that, conf, pos);
              break;
            case "STREET-A":
              this.tileCreator.createStreetTile(b, c, that, conf, pos, "street-a");
              break;
            case "STREET-B":
              this.tileCreator.createStreetTile(b, c, that, conf, pos, "street-b");
              break;
            case "STREET-C":
              this.tileCreator.createStreetTile(b, c, that, conf, pos, "street-c");
              break;
            case "SIDEWALK":
              this.tileCreator.createStreetTile(b, c, that, conf, pos, "side-walk");
              break;
            case "BLOQUERANDOM":
              this.tileCreator.createBloqueRandomTile(b, c, that, conf, pos, index);
              break;
            case "BLOQUE-1":
              this.tileCreator.createBloqueTile(b, c, that, conf, pos, objectKey);
              break;
            case "COLUMNALARGA":
              this.tileCreator.createColumnaTile(b, c, that, conf, pos, "columna-0");
              break;
            case "COLUMNACORTA":
              this.tileCreator.createColumnaTile(b, c, that, conf, pos, "columna-1");
              break;
            case "SEMIBLOQUE":
              this.tileCreator.createSemiBloque(b, c, that, conf, pos, "semibloque-0");
              break;
            case "TREE":
              this.tileCreator.createTreeTile(b, c, that, conf, pos);
              break;
            case "CUBE":
              this.tileCreator.createCubeTile(b, c, that, conf, pos, "cube1");
              break;
            case "PIN":
              this.tileCreator.createPinTile(b, c, that, conf, pos, "pin");
              break;
            case "TRAFFIC-LIGHT-A":
              this.tileCreator.createTrafficLightTile(
                b,
                c,
                that,
                conf,
                pos,
                "traffic-light-a"
              );
              break;
            case "TRAFFIC-LIGHT-B":
              this.tileCreator.createTrafficLightTile(
                b,
                c,
                that,
                conf,
                pos,
                "traffic-light-b"
              );
              break;
            case "BUILDING":
              this.tileCreator.createBuilding(b, c, that, conf, pos, "buildingTEST");
              break;
            case "BUILDINGBLOCK":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "solidBlock"
              );
              break;
            case "BUILDINGWINDOW1":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "window1"
              );
              break;
            case "BUILDINGWINDOW2":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "window2"
              );
              break;
            case "BUILDINGWINDOW3":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "window3"
              );
              break;
            case "BUILDINGWINDOWB1":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "windowB1"
              );
              break;
            case "BUILDINGWINDOWB2":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "windowB2"
              );
              break;
            case "BUILDINGWINDOWB3":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "windowB3"
              );
              break;
            case "BUILDINGDOORLEFTCORNER":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "buildingDoorLeftCorner"
              );
              break;
            case "BUILDINGDOORRIGHTCORNER":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "buildingDoorRightCorner"
              );
              break;
            case "BUILDINGDOORLEFT":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "doorLeftSide"
              );
              break;
            case "BUILDINGDOORRIGHT":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "doorRightSide"
              );
              break;
            case "BUILDINGTOP1":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test1"
              );
              break;
            case "BUILDINGTOP2":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test2"
              );
              break;
            case "BUILDINGTOP3":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test3"
              );
              break;
            case "BUILDINGTOP4":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test4"
              );
              break;
            case "BUILDINGTOP5":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test5"
              );
              break;
            case "BUILDINGTOP1B":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test1B"
              );
              break;
            case "BUILDINGTOP2B":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test2B"
              );
              break;
            case "BUILDINGTOP3B":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test3B"
              );
              break;
            case "BUILDINGTOP4B":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test4B"
              );
              break;
            case "BUILDINGTOP5B":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test5B"
              );
              break;
            //nuevo
            case "BUILDINGBLOCK-B":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "blockBuilding-b"
              );
              break;
            case "BUILDINGBLOCKBASE":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "blockBuildingBase"
              );
              break;
            case "BUILDINGBLOCKEMPTY":
              this.tileCreator.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "blockBuildingEmpty"
              );
              break;
          }
        },
      };
      //@ts-ignore
      m.drawMap(this.isoGroup, conf, lvlConf);
    }
  }
  }


  update() {
    const self = this;
    if (self.player && self.cursors) {
      self.player.updateAnim(self.cursors);
      makeOpacityNearPlayer(this);
      //console.log(this.player?.isoX, this.player?.isoY, "ARIEL")
      if (
        this.player?.isoX === 660 &&
        this.player?.isoY === 55 &&
        this.player.facingDirection === "e"
      )
        this.NPCTalker?.interact();
      else this.NPCTalker?.breakInteract();
    }
  }
}
