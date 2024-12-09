import { RpgIsoSpriteBox } from "../Assets/rpgIsoSpriteBox";
import { changeSceneTo } from "../helpers/helpers";
import EventsCenter from "../services/EventsCenter";
import RPG from "../rpg";
import { globalState } from "../GlobalDataManager";
import { ModalConfig, modalType, ProductToBuy } from "../Assets/Modals/ModalTypes";

export default class Room {

  scene: RPG;
  map: any[];
  interactiveComputer?: Phaser.GameObjects.Rectangle;
  interactiveDoor?: Phaser.GameObjects.Rectangle;
  interactiveBed?: Phaser.GameObjects.Rectangle;
  eventCenter = EventsCenter.getInstance();
  imagesPositions: { x: number; y: number } = { x: -75, y: 35 };
  backgroundContainer?: Phaser.GameObjects.Container;
  frontContainer?: Phaser.GameObjects.Container;

  constructor(scene: RPG) {
    this.scene = scene;

    this.map = [
      {
        nivel: "room",
        player: "pepito",
        musica: "bkg-uno.mp3",
        ballTexture: "123",
        gravity: 9.8,
        distanceBetweenFloors: 50,
        tiles: {
          "1": "GRASS",
          "3": "BLOQUE-1",
          "4": "BLOQUERANDOM",
          "5": "COLUMNALARGA",
          "6": "COLUMNACORTA",
          "7": "SEMIBLOQUE",
          "8": "TREE",
          "9": "CUBE",
          "23": "BUILDINGBLOCKEMPTY",
          PN: "PLAYER-N",
          PS: "PLAYER-S",
          PE: "PLAYER-E",
          PW: "PLAYER-W",
        },
      },

      // MAP PLAYER / ITEMS CONFIG
      [
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 PS 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0",
      ],
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23\n" +
      "23 23 23 23 23 23 23 23 23 23",

      // ONE
      "23 0 0 0 0 0 0 0 0 23\n" +
      "23 23 0 0 0 0 0 0 0 23\n" +
      "23 23 0 0 0 0 0 0 0 23\n" +
      "23 23 0 0 0 0 0 0 0 23\n" +
      "0 23 0 0 0 0 0 0 0 23\n" +
      "0 23 0 0 0 0 0 0 0 23\n" +
      "23 23 0 0 0 0 0 0 0 23\n" +
      "0 0 0 0 0 0 0 0 23 23\n" +
      "0 0 0 0 0 0 0 0 23 23\n" +
      "0 0 0 0 0 0 0 0 23 23\n" +
      "0 0 0 0 0 0 0 0 23 23\n" +
      "0 0 0 0 0 0 0 0 23 23\n" +
      "0 0 0 0 0 0 0 0 23 23\n" +
      "0 0 0 0 0 0 0 0 23 23\n" +
      "0 0 0 0 0 0 0 0 23 23",

    ];
  }

  drawItems(items: ProductToBuy[]) {
    items.forEach(item => {
      if (!item.roomInformation) return;
      const itemToDraw = this.scene.add.image(this.imagesPositions.x, this.imagesPositions.y, item.roomInformation.assetInRoom).setOrigin(0.5);
      item.roomInformation.frontContainer ? this.frontContainer?.add(itemToDraw) : this.backgroundContainer?.add(itemToDraw);
    });
  }

  addMapFunctionalities(globalState: globalState) {
    if (this.scene.player) {
      // @ts-ignore
      this.scene.cameras.main.stopFollow().centerOn(this.scene.player.x + 400, this.scene.player.y - 250);
      this.scene.player.self.setScale(1.4);
    }

    const firstPos = this.scene.isoGroup?.children.entries[0] as unknown as RpgIsoSpriteBox;
    this.frontContainer = this.scene.add.container(firstPos.self.x, firstPos.self.y).setDepth(999999)
    this.backgroundContainer = this.scene.add.container(firstPos.self.x, firstPos.self.y)

    // -> BASIC ITEMS
    let backgroundRoom = this.scene.add.image(this.imagesPositions.x, this.imagesPositions.y, "HabitacionFinalMai").setOrigin(0.5);

    let pcGlow = this.scene.add.image(this.imagesPositions.x, this.imagesPositions.y, "pcGlow").setOrigin(0.5).setVisible(false);
    this.interactiveComputer = this.scene.add.rectangle(350, -20, 100, 100, 0x6666ff, 0.3).setInteractive();
    this.interactiveComputer.on('pointerdown', () => {
      // const roomModalTest = new ModalContainer(this.scene, 0, 0, roomModal);
      this.eventCenter.emitEvent(this.eventCenter.possibleEvents.OPEN_MODAL, { modalType: modalType.NEWS });
    });
    this.interactiveComputer.on("pointerover", () => {
      pcGlow.setVisible(true);
    });
    this.interactiveComputer.on("pointerout", () => {
      pcGlow.setVisible(false);
    });

    let puertaGlow = this.scene.add.image(this.imagesPositions.x, this.imagesPositions.y, "puertaGlow").setOrigin(0.5).setVisible(false);
    this.interactiveDoor = this.scene.add.rectangle(-550, 65, 150, 360, 0x6666ff, 0.3).setInteractive();
    this.interactiveDoor.on('pointerdown', () => {
      changeSceneTo(this.scene, "RPG", "RPG", "CITY")
    });
    this.interactiveDoor.on("pointerover", () => {
      puertaGlow.setVisible(true);
    });
    this.interactiveDoor.on("pointerout", () => {
      puertaGlow.setVisible(false);
    });

    let cama = this.scene.add.image(this.imagesPositions.x, this.imagesPositions.y, "cama").setOrigin(0.5).setVisible(false);
    this.interactiveBed = this.scene.add.rectangle(-150, 20, 130, 200, 0x6666ff, 0.3).setRotation(Math.PI / 3).setInteractive();
    this.interactiveBed.on('pointerdown', () => {
      // globalDataManager.passTime(1)
    });
    this.interactiveBed.on("pointerover", () => {
      cama.setVisible(true);
    });
    this.interactiveBed.on("pointerout", () => {
      cama.setVisible(false);
    });

    this.backgroundContainer.add([
      backgroundRoom,
    ])

    this.scene.UICamera?.ignore(this.backgroundContainer);
    this.scene.UICamera?.ignore(this.frontContainer);
    // <- BASIC ITEMS

    // -> ITEMS IN INVENTORY FROM GLOBAL STATE
    this.drawItems(globalState.inventary);
    // <- ITEMS IN INVENTORY FROM GLOBAL STATE

    this.frontContainer.add([
      pcGlow,
      puertaGlow,
      cama,
      this.interactiveComputer,
      this.interactiveDoor,
      this.interactiveBed,
    ]);
  }
}
