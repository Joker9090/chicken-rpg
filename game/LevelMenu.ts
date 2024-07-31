import Phaser from "phaser";
import BetweenScenes, { BetweenScenesStatus } from "./BetweenScenes";
import { Audio } from "@/game/types";
import SettingsModal from "./Assets/UIassets/ModalSettings";
import UI, { UIConfig } from "./Assets/UIassets/UI";
import lvlSlot, { lvlSlotConfig } from "./Assets/UIassets/lvlSlot";
import GlobalDataSingleton from "./services/GlobalData";

export default class LevelMenu extends Phaser.Scene {
  logo?: Phaser.GameObjects.Image;

  levelGroup?: Phaser.GameObjects.Group;
  ok?: Phaser.GameObjects.Image;
  back?: Phaser.GameObjects.Image;
  exit?: Phaser.GameObjects.Image;
  container?: Phaser.GameObjects.Container;
  levelsContainer?: Phaser.GameObjects.Container;

  background1?: Phaser.GameObjects.Image;
  background2?: Phaser.GameObjects.Image;
  background3?: Phaser.GameObjects.Image;
  background4?: Phaser.GameObjects.Image;

  codeText?: Phaser.GameObjects.Text;
  codeTextInput?: Phaser.GameObjects.Text;
  keyboard?: Phaser.Input.Keyboard.KeyboardPlugin;
  UIReference: any
  onClickSound?: Audio;

  constructor() {
    super({ key: "LevelMenu" });
  }

  init() { }

  changeTexture(btn: string, interaction?: string) {
    const texturesBtns = {
      level: {
        normal: "lvlEmpty",
        hover: "lvlHover",
      },
      exit: {
        normal: "btnExitMenu",
        pressed: "btnExitMenuClick",
        hover: "btnExitMenuHover",
      },
      back: {
        normal: "btnBack",
        pressed: "btnBackClick",
        hover: "btnBackHover",
      },
      ok: {
        normal: "okBtnLevel",
        pressed: "okBtnLevelClick",
        hover: "okBtnLevelHover",
      },
    };
    switch (btn) {
      case "level":
        switch (interaction) {
          case "hover":
            // this.level?.setTexture(texturesBtns.level.hover);
            break;
          default:
          // this.level?.setTexture(texturesBtns.level.normal);
        }
        break;
      case "exit":
        switch (interaction) {
          case "pressed":
            this.exit?.setTexture(texturesBtns.exit.pressed);
            break;
          case "hover":
            this.exit?.setTexture(texturesBtns.exit.hover);
            break;

          default:
            this.exit?.setTexture(texturesBtns.exit.normal);
        }
        break;
      case "back":
        switch (interaction) {
          case "pressed":
            this.back?.setTexture(texturesBtns.back.pressed);
            break;
          case "hover":
            this.back?.setTexture(texturesBtns.back.hover);
            break;
          default:
            this.back?.setTexture(texturesBtns.back.normal);
        }
        break;
      case "ok":
        switch (interaction) {
          case "pressed":
            this.ok?.setTexture(texturesBtns.ok.pressed);
            break;
          case "hover":
            this.ok?.setTexture(texturesBtns.ok.hover);
            break;
          default:
            this.ok?.setTexture(texturesBtns.ok.normal);
        }
        break;
    }
  }

  makeTransition(sceneNameStart: string, sceneNameStop: string, data: any) {
    const getBetweenScenesScene = this.game.scene.getScene(
      "BetweenScenes"
    ) as BetweenScenes;
    getBetweenScenesScene.changeSceneTo(sceneNameStart, sceneNameStop, data);
  }

  addTweens() {
    this.tweens.add({
      targets: this.logo,
      y: -20,
      ease: "Bounce.inOut",
      duration: 2000,
      yoyo: true,
    });
  }

  goToLvl(lvl: number) {
    GlobalDataSingleton.setNewValue({ level: lvl })
    this.makeTransition("IsoExperimentalMap", "LevelMenu", { level: lvl });
    //@ts-ignore
    this.game.scene.getScene("MusicManager").playMusic('music2')
  }

  createLevelGrid(availableLevels?: number) {
    let levels = 0;
    let xpos = 0;
    let ypos = -80;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.levelsContainer = this.add.container(width / 2, height / 2);
    for (let i = 0; i < 20; i++) {
      let isVisible = false;
      if (availableLevels) {
        if (i < availableLevels) isVisible = true;
      } else {
        if (i === 0) isVisible = true;
      }
      levels += 1;
      xpos = -400 + i * 80;
      if (i > 9) {
        ypos = 0;
        xpos = -400 + (i - 10) * 80;
      }
      const text = this.add
        .text(xpos, ypos, (i + 1).toString(), {
          fontSize: 25,
          color: "white",
          fontFamily: "Quicksand",
          fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setVisible(isVisible);
      const levelConfig: lvlSlotConfig = {
        texture: ["lvlEmpty", "lvlBlocked", "lvlHover", "lvlClick"],
        pos: { x: xpos, y: ypos },
        scale: 0.9,
        visible: isVisible,
        id: i + 1,
        function: () => this.goToLvl(i + 1),
      };
      const level = new lvlSlot(
        this,
        levelConfig,
        this.levelGroup
      ).setScrollFactor(0, 0);
      this.levelsContainer?.add([level, text]);
    }
  }

  create() {
    this.codeText = this.add
      .text(0, 160, "INSERT CODE TO UNLOCK LEVEL", {
        fontSize: 28,
        color: "white",
        fontFamily: "Quicksand",
        fontStyle: 'bold'

      })
      .setOrigin(0.5);
    this.codeTextInput = this.add
      .text(0, 223, "", {
        fontSize: 28,
        color: "white",
        fontFamily: "Quicksand",
      })
      .setOrigin(0.5);
    const rect = this.add.graphics();
    rect.lineStyle(2, 0xffffff, 1);
    rect.strokeRoundedRect(-150, 200, 300, 50, 10);
    //Agregar text area

    this.UIReference = this.game.scene.getScene("UIScene")
    this.onClickSound = this.UIReference.sound.add('interfaceBtn')
    this.onClickSound?.setVolume(0.5)

    window.addEventListener("resize", () => {
      this.scale.resize(window.innerWidth, window.innerHeight);
      this.scale.updateBounds();
    });
    this.scale.resize(window.innerWidth, window.innerHeight);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.background1 = this.add
      .image(width / 2, height / 2, "menuBackground1")
      .setOrigin(0.5)
      .setScale(1.5);
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

    const scope = GlobalDataSingleton.getScope()
    this.createLevelGrid(scope.levelAvailable);

    const validateCode = () => {
      if (this.codeTextInput?.text === "DEMO") {
        GlobalDataSingleton.setNewValue({ levelCode: "DEMO", levelAvailable: 5 })
        this.levelsContainer?.destroy();
        this.createLevelGrid(5);
      } else {
        const errorMessage = this.add
          .text(width / 2, height / 2 + 273, "Código incorrecto", {
            fontSize: 28,
            color: "red",
            fontFamily: "Quicksand",
          })
          .setOrigin(0.5);
        setTimeout(() => {
          errorMessage.destroy();
        }, 2000);
      }
    };

    this.ok = this.add
      .image(0, 300, "okBtnLevel")
      .setOrigin(0.5)
      .setInteractive();
    this.ok.on("pointerdown", () => {
      this.changeTexture("ok", "pressed")
      this.onClickSound?.play()
    });
    this.ok.on("pointerup", () => {
      this.changeTexture("ok", "normal");
      validateCode();
    });
    this.ok.on("pointerover", () => {
      this.changeTexture("ok", "hover");
    });
    this.ok.on("pointerout", () => {
      this.changeTexture("ok");
    });
    this.back = this.add
      .image(-width / 2 + 100, -height / 2 + 100, "btnBack")
      .setOrigin(0.5)
      .setInteractive();
    this.back.on("pointerdown", () => {
      this.changeTexture("back", "pressed")
      this.onClickSound?.play()
    });
    this.back.on("pointerup", () => {
      this.changeTexture("back", "normal");
      this.makeTransition("Menu", "LevelMenu", {});
    });
    this.back.on("pointerover", () => {
      this.changeTexture("back", "hover");
    });
    this.back.on("pointerout", () => {
      this.changeTexture("back");
    });
    // this.exit = this.add
    //   .image(width / 2 - 100, -height / 2 + 100, "btnExitMenu")
    //   .setOrigin(0.5)
    //   .setInteractive();
    // this.exit.on("pointerdown", () => {
    //   this.changeTexture("exit", "pressed")
    //   this.onClickSound?.play()
    // });
    // this.exit.on("pointerup", () => {
    //   this.changeTexture("exit", "normal");
    //   this.makeTransition("Menu", "LevelMenu", {});
    // });
    // this.exit.on("pointerover", () => this.changeTexture("exit", "hover"));
    // this.exit.on("pointerout", () => this.changeTexture("exit"));

    this.container = this.add.container(width / 2, height / 2);
    this.container.add([
      this.back,
      this.ok,
      // this.exit,
      this.codeText,
      rect,
      this.codeTextInput,
    ]);
    this.addTweens();
    // @ts-ignore
    this.input.keyboard.on("keydown", (e) => {
      if (this.codeTextInput) {
        const TextCode = this.codeTextInput.text;
        if (e.keyCode === 8) {
          const newCode = TextCode.substring(0, TextCode.length - 1);
          this.codeTextInput?.setText(newCode.toUpperCase());
        } else if (e.keyCode <= 90 && e.keyCode >= 65) {
          const newCode = TextCode + e.key;
          this.codeTextInput?.setText(newCode.toUpperCase());
        } else if (e.keyCode === 13) {
          validateCode();
        }
      }
    });
  }

  update() { }
}
