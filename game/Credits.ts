import Phaser, { Scene } from "phaser";
import BetweenScenes, { BetweenScenesStatus } from "./BetweenScenes";
import PersonCredit from "./Assets/Credits/PersonCredit";
import { Audio } from "./types";
import UIScene from "./UIScene";

export default class Credits extends Phaser.Scene {
  /* map */

  person1?: PersonCredit;
  person2?: PersonCredit;
  person3?: PersonCredit;
  person4?: PersonCredit;
  person5?: PersonCredit;

  /* controls */
  EscKeyboard?: Phaser.Input.Keyboard.Key;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  title?: Phaser.GameObjects.Image;

  background1?: Phaser.GameObjects.Image;
  background2?: Phaser.GameObjects.Image;
  background3?: Phaser.GameObjects.Image;
  background4?: Phaser.GameObjects.Image;

  exit?: Phaser.GameObjects.Image;
  onClickSound?: Audio
  UIReference: any

  constructor() {
    super({ key: "Credits" });
  }

  init() {
    this.cursors = this.input.keyboard?.createCursorKeys();
  }

  makeTransition(sceneNameStart: string, sceneNameStop: string, data: any) {
    const getBetweenScenesScene = this.game.scene.getScene(
      "BetweenScenes"
    ) as BetweenScenes;
    getBetweenScenesScene.changeSceneTo(sceneNameStart, sceneNameStop, data);
  }
  changeTexture(btn: string, interaction?: string) {
    const texturesBtns = {
      exit: {
        normal: "btnBack",
        pressed: "btnBackClick",
        hover: "btnBackHover",
      },
    };
    switch (btn) {
      case "exit":
        switch (interaction) {
          case "pressed":
            this.exit?.setTexture(texturesBtns.exit.pressed);
          case "hover":
            this.exit?.setTexture(texturesBtns.exit.hover);
            break;
          default:
            this.exit?.setTexture(texturesBtns.exit.normal);
        }
        break;
    }
  }
  create() {
    /* Controls */
    this.UIReference = this.game.scene.getScene("UIScene")
    this.onClickSound = this.UIReference.sound.add('interfaceBtn')
    this.onClickSound?.setVolume(0.5)
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.background1 = this.add
      .image(width / 2, height / 2, "menuBackground1")
      .setOrigin(0.5)
      .setScale(1.5);
    this.title = this.add
      .image(width / 2, 100, "titleCredits")
      .setOrigin(0.5)
      .setScale(1);
    this.background2 = this.add
      .image(width / 2, height / 2, "menuBackground2")
      .setOrigin(0.5)
      .setScale(1.5);
    this.background3 = this.add
      .image(0, height / 2, "menuBackground3")
      .setOrigin(0, 0.5)
      .setScale(1, 1.3);
    this.background4 = this.add
      .image(width, height / 2, "menuBackground4")
      .setOrigin(1, 0.5)
      .setScale(1, 1.3);

    this.EscKeyboard = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
    this.exit = this.add
      .image(100, 100, "btnBack")
      .setOrigin(0.5)
      .setInteractive();
    this.exit.on("pointerdown", () => {
      this.changeTexture("exit", "pressed");
      this.onClickSound?.play()
    });
    this.exit.on("pointerover", () => this.changeTexture("exit", "hover"));
    this.exit.on("pointerout", () => this.changeTexture("exit"));

    this.exit.on("pointerup", () => {
      this.changeTexture("exit", "normal");
      //@ts-ignore
      this.musicManager?.stopMusic();
      this.makeTransition("Menu", "Credits", { fontFamily: "Quicksand" });
    });
    const LogoNoswar = this.add.image(width  - 100, height  - 100, "logoNoswar").setOrigin(0.5).setDepth(9999)

    this.person1 = new PersonCredit(this, width / 6, height / 2, ["nano", "nanoHover"], "Nano", "Developer")
    this.person2 = new PersonCredit(this, 2 * width / 6, height / 2, ["lu", "luHover"], "Lu", "Project Manager")
    this.person3 = new PersonCredit(this, 3 * width / 6, height / 2, ["flor", "florHover"], "Flor", "Graphic Designer")
    this.person4 = new PersonCredit(this, 4 * width / 6, height / 2, ["juampi", "juampiHover"], "JP", "Developer")
    this.person5 = new PersonCredit(this, 5 * width / 6, height / 2, ["colo", "coloHover"], "Colo", "Developer")

    // this.addTweens()
  }

  update() {
    if (this.EscKeyboard)
      this.EscKeyboard.on("down", () => {
        this.makeTransition("Credits", "Menu", {});
        // this.scene.start("Menu");
      });
    if (this.cursors)
      this.cursors.space.on("down", () => {
        this.makeTransition("Credits", "Menu", {});
        //this.scene.start("Menu");
      });
  }

  addTweens() {
    this.tweens.add({
      targets: this.person1,
      y: "-=20",
      ease: "linear",
      duration: 3000,
      yoyo: true,
      delay: 100,
      loop: -1,
    });
    this.tweens.add({
      targets: this.person2,
      y: "-=20",
      ease: "linear",
      duration: 3000,
      yoyo: true,
      delay: 600,
      loop: -1,
    });
    this.tweens.add({
      targets: this.person3,
      y: "+=20",
      ease: "linear",
      duration: 3000,
      yoyo: true,
      delay: 500,
      loop: -1,
    });
    this.tweens.add({
      targets: this.person4,
      y: "+=20",
      ease: "linear",
      duration: 3000,
      yoyo: true,
      delay: 200,
      loop: -1,
    });
    this.tweens.add({
      targets: this.person5,
      y: "+=20",
      ease: "linear",
      duration: 3000,
      yoyo: true,
      loop: -1,
      delay: 300,
    });
  }
}
