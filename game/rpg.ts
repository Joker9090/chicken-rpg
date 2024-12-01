import { GameObjects, Scene } from "phaser";
//@ts-ignore
import IsoPlugin, { IsoPhysics } from "phaser3-plugin-isometric";
import MapManager from "@/game/mapManager";
import { ConfObjectType } from "./types";
import { RpgIsoSpriteBox } from "./Assets/rpgIsoSpriteBox";
import { RpgIsoPlayer } from "./Assets/rpgIsoPlayer";
import { RpgIsoPlayerPrincipal } from "./Assets/rpgIsoPlayerPrincipal";
import { RpgIsoPlayerSecundarioTalker } from "./Assets/rpgIsoPlayerSecundarioTalker";
import UIContainer from "./Assets/UIAssetsChicken/UIContainer";
import { CubeIsoSpriteBox } from "./Assets/cubeIsoSpriteBox";
import { PinIsoSpriteBox } from "./Assets/pinIsoSpriteBox";
import { TrafficLightIsoSpriteBox } from "./Assets/trafficLightIsoSpriteBox";
import { BuildingSpriteBox } from "./Assets/buildingSpriteBox";
import { ModalConfig, ModalContainer } from "./Assets/ModalContainer";
import BetweenScenes from "./Loader/BetweenScenes";
import MultiScene from "./Loader/MultiScene";
import roomMap from "./maps/room";
import cityMap from "./maps/city";
import GlobalDataManager from "./GlobalDataManager";
import { possibleEvents, turnEventOn } from "./EventsCenter";

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
  maps: string[];
  withPlayer: Boolean;
  cameraTunnel?: Phaser.GameObjects.Arc;
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
  group?: Phaser.GameObjects.Group;
  distanceBetweenFloors: number = 50;
  eventEmitter?: Phaser.Events.EventEmitter;
  UICont?: UIContainer;
  rectInteractive?: Phaser.GameObjects.Rectangle;
  rectInteractive2?: Phaser.GameObjects.Rectangle;
  rectInteractive3?: Phaser.GameObjects.Rectangle;
  sky1?: Phaser.GameObjects.Rectangle;
  sky2?: Phaser.GameObjects.Rectangle;
  sky3?: Phaser.GameObjects.Rectangle;
  sky4?: Phaser.GameObjects.Rectangle;
  constructor(maps: string[]) {
    const sceneConfig = {
      key: "RPG",
      mapAdd: { isoPlugin: "iso", isoPhysics: "isoPhysics" },
    };
    super(sceneConfig);
    this.maps = maps;
    this.sceneKey = sceneConfig.key;
    this.withPlayer = true;

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

    this.load.spritesheet("walkRight-1", "/images/chicken/playerWalk.png", {
      frameWidth: 200,
      frameHeight: 250,
      startFrame: 0,
      endFrame: 9
    });

    this.load.spritesheet("walkRight-2", "/images/chicken/playerWalk.png", {
      frameWidth: 200,
      frameHeight: 250,
      startFrame: 10,
      endFrame: 19
    });

    this.load.spritesheet("walkTop-1", "/images/chicken/playerWalk2.png", {
      frameWidth: 200,
      frameHeight: 250,
      startFrame: 0,
      endFrame: 9
    });

    this.load.spritesheet("walkTop-2", "/images/chicken/playerWalk2.png", {
      frameWidth: 200,
      frameHeight: 250,
      startFrame: 10,
      endFrame: 19
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

    // for (let index = 0; index < 6; index++) {
    //   this.load.spritesheet(
    //     `columna-${index}`,
    //     "/images/chicken/piedraAbajo.png",
    //     {
    //       frameWidth: 100,
    //       frameHeight: 100,
    //       startFrame: index + 18,
    //     }
    //   );
    // }

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


  openModal() {
    const globalDataManager = this.game.scene.getScene("GlobalDataManager") as GlobalDataManager
    const handleAgreeModal = () => {
      globalDataManager.passTime(1)
      this.isoGroup?.getChildren().forEach((child) => {
        if (child.type === "PIN") {
          const pin = child as unknown as PinIsoSpriteBox;
          pin.self.destroy();
        }
      });
    }
    const cityModal: ModalConfig = {
      type: modalType.QUEST,
      title: "FOTOS EMBLEMATICAS",
      picture: "fotoCamara",
      time: "6",
      text: "Sal a tomar fotos al parque.",
      reward: "15",
      agreeFunction: handleAgreeModal,
    }
    const ModalTest = new ModalContainer(this, 0, 0, cityModal);
  }

  changeSceneTo(sceneToStart: string, sceneToStop: string, data: any) {
    this.game.plugins.removeScenePlugin("IsoPlugin");
    this.game.plugins.removeScenePlugin("IsoPhysics");
    const multiScene = new MultiScene(sceneToStart, sceneToStop, data);
    this.game.scene.getScenes(true)[0].scene.add("MultiScene", multiScene, true);
    // this.scene.add("MultiScene", multiScene, true); 
  }

  makeDayCycle = (index: number, callback: Function) => {
    if (this.sky1 && this.sky2 && this.sky3 && this.sky4) {
      const DayDuration = 2000
      const skies = [this.sky1, this.sky2, this.sky3, this.sky4]
      if (index === 3) {
        this.tweens.add({
          targets: skies[index],
          alpha: 0,
          duration: DayDuration / 4,
          onComplete: () => {
            skies[index].setAlpha(0)
          }
        })
        this.tweens.add({
          targets: skies[0],
          alpha: 1,
          duration: DayDuration / 4,
          onComplete: () => {
            skies[0].setAlpha(1)
            callback(0, callback)
          }
        })
      } else {
        this.tweens.add({
          targets: skies[index],
          alpha: 0,
          duration: DayDuration / 4,
          onComplete: () => {
            skies[index].setAlpha(0)
          }
        })
        this.tweens.add({
          targets: skies[index + 1],
          alpha: 1,
          duration: DayDuration / 4,
          onComplete: () => {
            skies[index + 1].setAlpha(1)
            callback(index + 1, callback)
          }
        })
      }
    }
  }

  create() {
    const lvlData = JSON.parse(this.maps[0]);


    // SKY
    const skyCam = this.cameras.add(0, 0, window.innerWidth, window.innerHeight);
    this.cameras.cameras = [skyCam, this.cameras.main];

    this.sky4 = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x1f3558).setAlpha(0).setOrigin(0)
    this.sky1 = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0xaefbff).setAlpha(0).setOrigin(0)
    this.sky2 = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x4ddbff).setAlpha(0).setOrigin(0)
    this.sky3 = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0xffd194).setAlpha(0).setOrigin(0)
    const skies = [this.sky1, this.sky2, this.sky3, this.sky4]

    this.cameras.main.ignore([this.sky1, this.sky2, this.sky3, this.sky4])



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
      let isIdleAnim =
        index + floor >= 16 && index + floor + 3 <= 32 ? true : false;

      this.anims.create({
        key: posiblePositions[index],
        frames: this.anims.generateFrameNumbers("chicken", {
          start: index + floor,
          end: index + floor + 3,
        }),
        frameRate: 10,
        repeat: isIdleAnim ? -1 : 1,
      });
      // if (index + floor >= 16 && index + floor + 3 <= 32)
      //   console.log("es idle: ", index + floor, index + floor + 3);
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
    this.UICont = new UIContainer(this, 0, 0, lvlData.nivel);
    this.UICamera = this.cameras.add(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
    this.UICamera.ignore(this.isoGroup);
    skyCam.ignore(this.isoGroup);
    const forestContainers = this.forest.map((arbolito) => arbolito.container);
    this.UICamera.ignore([this.sky1, this.sky2, this.sky3, this.sky4])
    this.UICamera.ignore(forestContainers);
    skyCam.ignore(forestContainers);
    skyCam.ignore(this.UICont);


    const globalDataManager = this.game.scene.getScene("GlobalDataManager") as GlobalDataManager
    skies[globalDataManager.getState().timeOfDay].setAlpha(1)
    
    //Room events ---->
    const handleAgreeModal = () => {
      globalDataManager.passTime(1)
    }

    const handleAgreeModalRoom = () => {
      globalDataManager.changeMoney(-100)
    }

    const cityModal: ModalConfig = {
      type: modalType.QUEST,
      title: "FOTOS EMBLEMATICAS",
      picture: "imageModalPhoto",
      time: "6",
      text: "Sal a tomar fotos al parque.",
      reward: "15",
      agreeFunction: handleAgreeModal,
    }

    const roomModal: ModalConfig = {
      type: modalType.PC,
      title: "MERCADO DE PULGAS ONLINE",
      picture: "desafioTest2",
      text: "CAMARA",
      reward: "100",
      agreeFunction: handleAgreeModalRoom,
    }

    if (lvlData.nivel == "room") {
      const firstPos = this.isoGroup.children.entries[0] as unknown as RpgIsoSpriteBox;
      const backgroundContainer = this.add.container(firstPos.self.x, firstPos.self.y).setDepth(999999)
      const backgroundContainer2 = this.add.container(firstPos.self.x, firstPos.self.y)
      const background = this.add.image(-300, 300, "backgroundMenu").setScale(1).setScale(2.5).setScrollFactor(1);
      let backgroundRoom = this.add.image(-75, 35, "HabitacionFinalMai").setOrigin(0.5);
      let pcGlow = this.add.image(-75, 35, "pcGlow").setOrigin(0.5).setVisible(false);
      let puertaGlow = this.add.image(-75, 35, "puertaGlow").setOrigin(0.5).setVisible(false);
      let cama = this.add.image(-75, 35, "cama").setOrigin(0.5).setVisible(false);

      this.rectInteractive = this.add.rectangle(350, -20, 100, 100, 0x6666ff, 0).setInteractive();
      this.rectInteractive.on('pointerdown', () => {
        const roomModalTest = new ModalContainer(this, 0, 0, roomModal);
      });
      this.rectInteractive.on("pointerover", () => {
        pcGlow.setVisible(true);
      });
      this.rectInteractive.on("pointerout", () => {
        pcGlow.setVisible(false);
      });

      this.rectInteractive2 = this.add.rectangle(-550, 65, 150, 360, 0x6666ff, 0).setInteractive();
      this.rectInteractive2.on('pointerdown', () => {
        this.changeSceneTo("RPG", "RPG", { maps: cityMap.map((m) => (typeof m === "string" ? m : JSON.stringify(m))) })
      });
      this.rectInteractive2.on("pointerover", () => {
        puertaGlow.setVisible(true);
      });
      this.rectInteractive2.on("pointerout", () => {
        puertaGlow.setVisible(false);
      });

      this.rectInteractive3 = this.add.rectangle(- 50, - 20, 100, 100, 0x6666ff, 0).setInteractive();

      this.rectInteractive3.on('pointerdown', () => {
        globalDataManager.passTime(1)
      });
      this.rectInteractive3.on("pointerover", () => {
        cama.setVisible(true);
      });
      this.rectInteractive3.on("pointerout", () => {
        cama.setVisible(false);
      });

      backgroundContainer2.add([
        background,
        backgroundRoom,
      ])

      backgroundContainer.add([
        pcGlow,
        puertaGlow,
        cama,
        this.rectInteractive,
        this.rectInteractive2,
        this.rectInteractive3,
      ]);
      this.UICamera.ignore(backgroundContainer);
      this.UICamera.ignore(backgroundContainer2);
      skyCam.ignore(backgroundContainer);
      skyCam.ignore(backgroundContainer2);
    }
    // <--- Room events


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

    // fire function only once after 300 ms

    this.time.delayedCall(300, () => {
      this.getObjectByType("PIN")?.forEach((_pin: GameObjects.GameObject) => {
        const pin = _pin as unknown as PinIsoSpriteBox;
        if (this.isoGroup) pin.updatePin(this.isoGroup);
      });
    });

    // if (lvlData.nivel == "room") this.cameras.main.stopFollow().setPosition(500, -300);
    if (this.player) {
      //@ts-ignore
      if (lvlData.nivel == "room") this.cameras.main.stopFollow().centerOn(this.player.x + 400, this.player.y - 250);
    }

  }

  getObjectByType(type: string) {
    return this.isoGroup?.children.entries.filter((t) => {
      const tile = t as unknown as RpgIsoSpriteBox;
      return tile.type === type;
    });
  }

  spawnObjects() {
    this.UICamera;
    let scalar = 0;
    let h;

    const _lvlConf = this.maps[0];
    const lvlConf = JSON.parse(_lvlConf);

    this.distanceBetweenFloors = lvlConf.distanceBetweenFloors;
    h = this.distanceBetweenFloors;

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

  spawnTiles() {
    const self = this;
    let pos = 0;
    let h: number;

    const _lvlConf = this.maps[0];
    const lvlConf = JSON.parse(_lvlConf);

    this.distanceBetweenFloors = lvlConf.distanceBetweenFloors;
    h = this.distanceBetweenFloors;

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
            case "STREET-A":
              self.createStreetTile(b, c, that, conf, pos, "street-a");
              break;
            case "STREET-B":
              self.createStreetTile(b, c, that, conf, pos, "street-b");
              break;
            case "STREET-C":
              self.createStreetTile(b, c, that, conf, pos, "street-c");
              break;
            case "SIDEWALK":
              self.createStreetTile(b, c, that, conf, pos, "side-walk");
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
            case "CUBE":
              self.createCubeTile(b, c, that, conf, pos, "cube1");
              break;
            case "PIN":
              self.createPinTile(b, c, that, conf, pos, "pin");
              break;
            case "TRAFFIC-LIGHT-A":
              self.createTrafficLightTile(
                b,
                c,
                that,
                conf,
                pos,
                "traffic-light-a"
              );
              break;
            case "TRAFFIC-LIGHT-B":
              self.createTrafficLightTile(
                b,
                c,
                that,
                conf,
                pos,
                "traffic-light-b"
              );
              break;
            case "BUILDING":
              self.createBuilding(b, c, that, conf, pos, "buildingTEST");
              break;
            case "BUILDINGBLOCK":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "solidBlock"
              );
              break;
            case "BUILDINGWINDOW1":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "window1"
              );
              break;
            case "BUILDINGWINDOW2":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "window2"
              );
              break;
            case "BUILDINGWINDOW3":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "window3"
              );
              break;
            case "BUILDINGWINDOWB1":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "windowB1"
              );
              break;
            case "BUILDINGWINDOWB2":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "windowB2"
              );
              break;
            case "BUILDINGWINDOWB3":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "windowB3"
              );
              break;
            case "BUILDINGDOORLEFTCORNER":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "buildingDoorLeftCorner"
              );
              break;
            case "BUILDINGDOORRIGHTCORNER":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "buildingDoorRightCorner"
              );
              break;
            case "BUILDINGDOORLEFT":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "doorLeftSide"
              );
              break;
            case "BUILDINGDOORRIGHT":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "doorRightSide"
              );
              break;
            case "BUILDINGTOP1":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test1"
              );
              break;
            case "BUILDINGTOP2":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test2"
              );
              break;
            case "BUILDINGTOP3":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test3"
              );
              break;
            case "BUILDINGTOP4":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test4"
              );
              break;
            case "BUILDINGTOP5":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test5"
              );
              break;
            case "BUILDINGTOP1B":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test1B"
              );
              break;
            case "BUILDINGTOP2B":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test2B"
              );
              break;
            case "BUILDINGTOP3B":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test3B"
              );
              break;
            case "BUILDINGTOP4B":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "test4B"
              );
              break;
            case "BUILDINGTOP5B":
              self.createBloqueBuildingTile(
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
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "blockBuilding-b"
              );
              break;
            case "BUILDINGBLOCKBASE":
              self.createBloqueBuildingTile(
                b,
                c,
                that,
                conf,
                pos,
                "blockBuildingBase"
              );
              break;
            case "BUILDINGBLOCKEMPTY":
              self.createBloqueBuildingTile(
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
      this.isoGroup,
      matrixPosition
    );
    tileObj.self.setAlpha(0.7);
    tileObj.self.setTint(0x000000);
    tileObj.self.setOrigin(0.42 + 0.03, 0.8 + 0.03);
    tileObj.self.setAngle(100);
    tileObj.self.setScale(0.6);
    const tree = this.add.sprite(0, 0, "tree");
    tree.setOrigin(0.42, 0.75);
    tileObj.customDepth = tileObj.self.depth + this.distanceBetweenFloors;
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
      this.isoGroup,
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
      this.isoGroup,
      matrixPosition,
      undefined,
      this.distanceBetweenFloors
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
      this.isoGroup,
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
      this.isoGroup,
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
      if (this.player) this.player.clearPossibleMovements();
      tileObj.highlightedTiles = [];
      // clean tint from all tiles
      // @ts-ignore
      this.isoGroup?.children.each((t: RpgIsoSpriteBox) => {
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
      this.isoGroup,
      matrixPosition
    );
    pos++;
    tileObj.type = "STONE";

    //if height is 75 tint tile
    tileObj.tileX = b;
    tileObj.tileY = c;
    tileObj.self.on("pointerover", this.highlightTile(tileObj));
    tileObj.self.on("pointerout", this.noHighlightTile(tileObj));
    tileObj.self.on("pointerdown", this.destroyTile(tileObj));

    // console.log(tileObj);
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
      "grassTEST", //"bloque-" + Math.floor(Math.random() * 6),
      0,
      this.isoGroup,
      matrixPosition
    );
    pos++;

    tileObj.type = "GRASS";
    // tileObj.self.setTint(0x0000ff);
    // tileObj.self.on("pointerdown", () => console.log('pointer en grass',tileObj));
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
      this.isoGroup,
      matrixPosition
    );
    pos++;

    tileObj.type = "GRASS";
    // tileObj.self.setTint(0x222222);
    // tileObj.self.on("pointerdown", () => console.log('pointer en grass',tileObj));
  }

  makeOpacityNearPlayer() {
    if (!this.cameraTunnel) {
      this.cameraTunnel = this.add.circle(
        this.player?.self.x,
        this.player?.self.y,
        100,
        0x6666ff,
        0
      );
      this.cameraTunnel.setDepth(100000);
    } else
      this.cameraTunnel.setPosition(this.player?.self.x, this.player?.self.y);

    const checkCameraContains = (t: RpgIsoSpriteBox) => {
      return this.cameraTunnel?.getBounds().contains(t.self.x, t.self.y);
    };

    const checkObjectIsInFrontOfPlayer = (
      t: RpgIsoSpriteBox,
      player: RpgIsoPlayerPrincipal
    ) => {
      if (t.matrixPosition && player.matrixPosition) {
        // check if x is the same and y is above
        if (
          t.matrixPosition.x === player.matrixPosition.x &&
          t.matrixPosition.y > player.matrixPosition.y
        )
          return true;
        // check if y is the same and x is above
        if (
          t.matrixPosition.y === player.matrixPosition.y &&
          t.matrixPosition.x > player.matrixPosition.x
        )
          return true;
        // check if both are above
        if (
          t.matrixPosition.y > player.matrixPosition.y &&
          t.matrixPosition.x > player.matrixPosition.x
        )
          return true;

        return false;
      }
      return false;
    };

    //@ts-ignore
    this.isoGroup?.children.each((_t) => {
      const t = _t as unknown as RpgIsoSpriteBox;
      if (
        t.type == "STONE" &&
        t.matrixPosition &&
        this.player?.matrixPosition
      ) {
        if (
          checkCameraContains(t) &&
          checkObjectIsInFrontOfPlayer(t, this.player)
        ) {
          t.self.setAlpha(0.05);
        } else t.self.setAlpha(1);
      }
    });
  }

  update() {
    const self = this;
    if (self.player && self.cursors) {
      self.player.updateAnim(self.cursors);
      this.makeOpacityNearPlayer();
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
