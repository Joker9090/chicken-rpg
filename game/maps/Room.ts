import { ModalConfig, ModalContainer } from "../Assets/ModalContainer";
import { RpgIsoSpriteBox } from "../Assets/rpgIsoSpriteBox";
import { changeSceneTo } from "../helpers/helpers";
import EventsCenter from "../services/EventsCenter";
import RPG, { modalType } from "../rpg";

export default class Room {

  scene: RPG;
  map: any[];
  rectInteractive?: Phaser.GameObjects.Rectangle;
  rectInteractive2?: Phaser.GameObjects.Rectangle;
  rectInteractive3?: Phaser.GameObjects.Rectangle;
  
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
      "1 0 0 0 0 0 0 0 0 0\n" +
      "1 1 0 0 0 0 0 0 0 0\n" +
      "1 1 0 0 0 0 0 0 0 0\n" +
      "1 1 0 0 0 0 0 0 0 0\n" +
      "0 1 0 0 0 0 0 0 0 0\n" +
      "0 1 0 0 0 0 0 0 0 0\n" +
      "1 1 0 0 0 0 0 0 0 0\n" +
      "0 0 0 0 0 0 0 0 0 0\n" +
      "0 0 0 0 0 0 0 0 0 0\n" +
      "0 0 0 0 0 0 0 0 0 0\n" +
      "0 0 0 0 0 0 0 0 0 0\n" +
      "0 0 0 0 0 0 0 0 0 0\n" +
      "0 0 0 0 0 0 0 0 0 0\n" +
      "0 0 0 0 0 0 0 0 0 0\n" +
      "0 0 0 0 0 0 0 0 0 0",

    ];
  }

  addMapFunctionalities() {
    const firstPos = this.scene.isoGroup?.children.entries[0] as unknown as RpgIsoSpriteBox;
    const backgroundContainer = this.scene.add.container(firstPos.self.x, firstPos.self.y).setDepth(999999)
    const backgroundContainer2 = this.scene.add.container(firstPos.self.x, firstPos.self.y)
    const background = this.scene.add.image(-300, 300, "backgroundMenu").setScale(1).setScale(2.5).setScrollFactor(1).setAlpha(0)
    let backgroundRoom = this.scene.add.image(-75, 35, "HabitacionFinalMai").setOrigin(0.5);
    let pcGlow = this.scene.add.image(-75, 35, "pcGlow").setOrigin(0.5).setVisible(false);
    let puertaGlow = this.scene.add.image(-75, 35, "puertaGlow").setOrigin(0.5).setVisible(false);
    let cama = this.scene.add.image(-75, 35, "cama").setOrigin(0.5).setVisible(false);
    if (this.scene.player) {
      // @ts-ignore
      this.scene.cameras.main.stopFollow().centerOn(this.scene.player.x + 400, this.scene.player.y - 250);
    }
    const handleAgreeModalRoom = (bought: any[]) => {
      const eventCenter = EventsCenter.getInstance();
      eventCenter.emitEvent(eventCenter.possibleEvents.BUY_ITEM, "camera");
      /*console.log("primer estado", globalDataManager.getState());
      const selectedItem = bought.find(item => item.isSelected === true);
      if (selectedItem && !globalDataManager.getState().inventary.includes(selectedItem.title.toLowerCase())) {
        globalDataManager.addInventary(selectedItem.title.toLowerCase());
        globalDataManager.changeMoney(-selectedItem.reward);
        console.log("ultimo estado", globalDataManager.getState());
      }*/
    }
    const roomModal: ModalConfig = {
      type: modalType.PC,
      title: "MERCADO DE PULGAS ONLINE",
      picture: "desafioTest2",
      text: "CAMARA",
      reward: "100",
      products: [
        {
          title: "CAMARA",
          picture: "camaraShop",
          pictureOn: "camaraShopOn",
          text: "CAMARA",
          reward: 100,
        },{
          title: "CAMARA2",
          picture: "camaraShop",
          pictureOn: "camaraShop",
          text: "CAMARA",
          reward: 0,
        },{
          title: "CAMARA3",
          picture: "camaraShop",
          pictureOn: "camaraShop",
          text: "CAMARA",
          reward: 0,
        }
      ],
      agreeFunction: handleAgreeModalRoom,
    }
    this.rectInteractive = this.scene.add.rectangle(350, -20, 100, 100, 0x6666ff, 0).setInteractive();
    this.rectInteractive.on('pointerdown', () => {
      const roomModalTest = new ModalContainer(this.scene, 0, 0, roomModal);
    });
    this.rectInteractive.on("pointerover", () => {
      pcGlow.setVisible(true);
    });
    this.rectInteractive.on("pointerout", () => {
      pcGlow.setVisible(false);
    });

    this.rectInteractive2 = this.scene.add.rectangle(-550, 65, 150, 360, 0x6666ff, 0).setInteractive();
    this.rectInteractive2.on('pointerdown', () => {
      changeSceneTo(this.scene, "RPG", "RPG", "CITY")
    });
    this.rectInteractive2.on("pointerover", () => {
      puertaGlow.setVisible(true);
    });
    this.rectInteractive2.on("pointerout", () => {
      puertaGlow.setVisible(false);
    });

    this.rectInteractive3 = this.scene.add.rectangle(- 50, - 20, 100, 100, 0x6666ff, 0).setInteractive();

    this.rectInteractive3.on('pointerdown', () => {
      // globalDataManager.passTime(1)
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
    this.scene.UICamera?.ignore(backgroundContainer);
    this.scene.UICamera?.ignore(backgroundContainer2);

  }
}
