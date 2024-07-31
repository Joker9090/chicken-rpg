import Phaser from "phaser";
import Selector from "./Selector";
import VolumeBar from "./VolumeBar";
import { Audio, LevelDataType } from "@/game/types";
import BetweenScenes from "@/game/BetweenScenes";
import EventsCenter from "@/game/EventsCenter";
import UIScene from "@/game/UIScene";
import GlobalDataSingleton from "@/game/services/GlobalData";

// Scene in class
class WinModal extends Phaser.GameObjects.Container {
  settingsBackground?: Phaser.GameObjects.Sprite;
  btnNext?: Phaser.GameObjects.Sprite;
  btnExit?: Phaser.GameObjects.Sprite;
  btnRetry?: Phaser.GameObjects.Sprite;
  btnHome?: Phaser.GameObjects.Sprite;
  stars?: Phaser.GameObjects.Sprite;
  level?: number;
  score?: number;
  lifes?: number;
  onClickSound?: Audio;

  changeTexture(btn: string, interaction?: string | number) {
    const texturesBtns = {
      next: {
        normal: "btnNext",
        pressed: "btnNextClick",
        hover: "btnNextHover",
      },
      retry: {
        normal: "btnRetry",
        pressed: "btnRetryClick",
        hover: "btnRetryHover",
      },
      exit: {
        normal: "btnExit",
        pressed: "btnExitClick",
        hover: "btnExitHover",
      },
      home: {
        normal: "btnHome",
        pressed: "btnHomeClick",
        hover: "btnHomeHover",
      },
      stars: {
        stars1: "stars1",
        stars2: "stars2",
        stars3: "stars3",
      },
    };
    switch (btn) {
      case "next":
        switch (interaction) {
          case "hover":
            this.btnNext?.setTexture(texturesBtns.next.hover);
            break;
          case "pressed":
            this.btnNext?.setTexture(texturesBtns.next.pressed);
            break;
          default:
            this.btnNext?.setTexture(texturesBtns.next.normal);
        }
        break;
      case "exit":
        switch (interaction) {
          case "hover":
            this.btnExit?.setTexture(texturesBtns.exit.hover);
            break;
          case "pressed":
            this.btnExit?.setTexture(texturesBtns.exit.pressed);
            break;
          default:
            this.btnExit?.setTexture(texturesBtns.exit.normal);
        }
        break;
      case "retry":
        switch (interaction) {
          case "hover":
            this.btnRetry?.setTexture(texturesBtns.retry.hover);
            break;
          case "pressed":
            this.btnRetry?.setTexture(texturesBtns.retry.pressed);
            break;
          default:
            this.btnRetry?.setTexture(texturesBtns.retry.normal);
        }
        break;
      case "home":
        switch (interaction) {
          case "hover":
            this.btnHome?.setTexture(texturesBtns.home.hover);
            break;
          case "pressed":
            this.btnHome?.setTexture(texturesBtns.home.pressed);
            break;
          default:
            this.btnHome?.setTexture(texturesBtns.home.normal);
        }
        break;
    }
  }

  makeTransition(
    sceneNameStart: string,
    sceneNameStop: string,
    data?: LevelDataType | undefined
  ) {
    const getBetweenScenesScene = this.scene.game.scene.getScene(
      "BetweenScenes"
    ) as BetweenScenes;
    getBetweenScenesScene.changeSceneTo(sceneNameStart, sceneNameStop, data);
  }

  constructor(
    scene: UIScene,
    x: number,
    y: number,
    level: number,
    score: number,
    lifes: number,
  ) {
    super(scene);
    this.scene = scene;
    this.level = level;
    this.score = score;
    this.lifes = lifes;
    const mm = this.scene.game.scene.getScene('MusicManager')
    this.onClickSound = this.scene.sound.add('menuBtn');
    //@ts-ignore
    this.onClickSound?.setVolume(mm.soundStatus ? 0 : 0.2)
    const text1 = this.scene.add
      .text(0, -40, "LEVEL " + this.level.toString(), {
        fontSize: 40,
        fontFamily: "Quicksand",
        strokeThickness: 4,
      })
      .setOrigin(0.5);
    const text2 = this.scene.add
      .text(0, 10, "SCORE", {
        fontSize: 30,
        fontFamily: "Quicksand",
        strokeThickness: 1,
      })
      .setOrigin(0.5);
    const text3 = this.scene.add
      .text(0, 60, this.score.toString(), {
        fontSize: 50,
        fontFamily: "Quicksand",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    let starsTexture = "stars1"
    const conditionals = GlobalDataSingleton.getScope().conditionals
    if (conditionals) {
      if (this.score <= conditionals[0]) {
        starsTexture = "stars3"
      } else if (this.score > conditionals[0] && this.score <= conditionals[1]) {
        starsTexture = "stars2"
      } else if (this.score > conditionals[1] && this.score <= conditionals[2]) {
        starsTexture = "stars1"
      } else {
        starsTexture = "stars0"
      }
    }
    this.stars = this.scene.add.sprite(0, -147, starsTexture).setOrigin(0.5, 0.5);

    this.settingsBackground = this.scene.add
      .sprite(0, 0, "backgroundNextLevel")
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(999999999);
    // NEXT
    this.btnNext = this.scene.add
      .sprite(0, 0, "btnNext")
      .setOrigin(0.5, 0.5)
      .setPosition(0, 150)
      .setScrollFactor(0)
      .setInteractive();
    this.btnNext.on("pointerdown", () => {
      this.changeTexture("next", "pressed");
      this.onClickSound?.play()
    });
    this.btnNext.on("pointerout", () => this.changeTexture("next"));
    this.btnNext.on("pointerover", () => this.changeTexture("next", "hover"));
    this.btnNext.on("pointerup", () => {
      if (this.level && this.score && this.lifes) {
        this.setVisible(false)
        GlobalDataSingleton.setNewValue({ level: this.level + 1, lifeBar: 11 })
        this.makeTransition("IsoExperimentalMap", "IsoExperimentalMap", {
          level: this.level + 1,
        });
      }
    });
    // RETRY
    this.btnRetry = this.scene.add
      .sprite(100, 0, "btnRetry")
      .setOrigin(0.5, 0.5)
      .setPosition(90, 150)
      .setScrollFactor(0)
      .setInteractive();
    this.btnRetry.on("pointerdown", () => {
      this.changeTexture("retry", "pressed");
      this.onClickSound?.play()
    });
    this.btnRetry.on("pointerout", () => this.changeTexture("retry"));
    this.btnRetry.on("pointerover", () => this.changeTexture("retry", "hover"));
    this.btnRetry.on("pointerup", () => {
      if (this.level && this.score && this.lifes) {
        this.setVisible(false)
        this.retryLevel()
        GlobalDataSingleton.setNewValue({ lifeBar: 11 })

        this.makeTransition("IsoExperimentalMap", "IsoExperimentalMap", {
          level: this.level,
        });
      }
    });
    // EXIT
    this.btnExit = this.scene.add
      .sprite(200, 0, "btnExit")
      .setOrigin(0.5, 0.5)
      .setPosition(152, -215)
      .setScrollFactor(0)
      .setInteractive();

    this.btnExit.on("pointerdown", () => {
      this.changeTexture("exit", "pressed");
      this.setVisible(false);
      this.onClickSound?.play()
      this.makeTransition("Menu", "IsoExperimentalMap");

    });
    this.btnExit.on("pointerout", () => this.changeTexture("exit"));
    this.btnExit.on("pointerover", () => this.changeTexture("exit", "hover"));
    this.btnHome = this.scene.add
      .sprite(300, 0, "btnHome")
      .setOrigin(0.5, 0.5)
      .setPosition(-90, 150)
      .setScrollFactor(0)
      .setInteractive();
    this.btnHome.on("pointerup", () => {
      this.setVisible(false);
      this.makeTransition("Menu", "IsoExperimentalMap");
    });
    this.btnHome.on("pointerdown", () => {
      this.onClickSound?.play()
      this.changeTexture("home", "click")
    });
    this.btnHome.on('pointerover', () => this.changeTexture("home", "hover"))
    this.btnHome.on('pointerout', () => this.changeTexture("home"))
    this.add([
      this.settingsBackground,
      this.btnNext,
      this.btnExit,
      this.btnHome,
      this.btnRetry,
      this.stars,
      text1,
      text2,
      text3,
    ]);
    this.setDepth(999999999);
    this.scene.add.existing(this);
    this.setPosition(x, y);
    this.setVisible(true);
  }

  retryLevel() {
    const level = this.level
    const stars = GlobalDataSingleton.scope.stars
    const starsByLevel = GlobalDataSingleton.scope.starByLevel
    if (level && starsByLevel && stars) {
      const newStarsByLevel = { ...starsByLevel, [level]: false }
      //@ts-ignore
      const grabedStar = GlobalDataSingleton.getScope().starByLevel[level]
      if (grabedStar) {
        GlobalDataSingleton.setNewValue({ stars: stars - 1, starByLevel: newStarsByLevel });
      }
    }
  }
}
export default WinModal;
