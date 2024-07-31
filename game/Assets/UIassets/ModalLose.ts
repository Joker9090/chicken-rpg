import Phaser from "phaser";
import Selector from "./Selector";
import VolumeBar from "./VolumeBar";
import { Audio, LevelDataType } from "@/game/types";
import BetweenScenes from "@/game/BetweenScenes";
import EventsCenter from "@/game/EventsCenter";
import UIScene from "@/game/UIScene";
import GlobalDataSingleton from "@/game/services/GlobalData";

// Scene in class
class LoseModal extends Phaser.GameObjects.Container {
  settingsBackground?: Phaser.GameObjects.Sprite;
  btnExit?: Phaser.GameObjects.Sprite;
  btnRetry?: Phaser.GameObjects.Sprite;
  btnHome?: Phaser.GameObjects.Sprite;
  level?: number;
  score?: number;
  lifes?: number;
  onClickSound?: Audio;

  changeTexture(btn: string, interaction?: string) {
    const texturesBtns = {
      retry: {
        normal: "btnRetry",
        pressed: "btnRetryClick",
        hover: "btnRetryHover",
      },
      exit: {
        normal: "btnExitLose",
        pressed: "btnExitClickLose",
        hover: "btnExitHoverLose",
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

  onToggleSound (status: boolean) {
    console.log(status, this.onClickSound, 'toggleBtnSound')
    if (status) this.onClickSound?.setVolume(0.2)
    else this.onClickSound?.setVolume(0)    
  }

  constructor(
    scene: UIScene,
    x: number,
    y: number,
    level: number,
    score: number,
    lifes: number
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
      .text(0, -10, "LEVEL " + this.level.toString(), {
        fontSize: 40,
        strokeThickness: 4,
        fontFamily: "Quicksand"
      })
      .setOrigin(0.5);
    const text2 = this.scene.add
      .text(0, 30, "SCORE " + this.score.toString() , {
        fontSize: 25,
        strokeThickness: 1,
        fontFamily: "Quicksand"
      })
      .setOrigin(0.5);

    

    this.settingsBackground = this.scene.add
      .sprite(0, 0, "backgroundLose")
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(999999999);
    // RETRY
    this.btnRetry = this.scene.add
      .sprite(50, 0, "btnRetry")
      .setOrigin(0.5, 0.5)
      .setPosition(50, 150)
      .setScrollFactor(0)
      .setScale(1.2)
      .setInteractive();
    this.btnRetry.on("pointerdown", () => {
      this.changeTexture("retry", "pressed");
      this.onClickSound?.play()
    });
    this.btnRetry.on("pointerout", () => this.changeTexture("retry"));
    this.btnRetry.on("pointerover", () => this.changeTexture("retry", "hover"));
    this.btnRetry.on('pointerup', () => {
      if (this.level && this.score && this.lifes){
        this.setVisible(false)
        GlobalDataSingleton.setNewValue({ lifeBar: 11 });
        this.retryLevel()
        this.makeTransition("IsoExperimentalMap", "IsoExperimentalMap", {
          level: this.level,
        });
      }
})
    // EXIT
    this.btnExit = this.scene.add
      .sprite(200, 0, "btnExitLose")
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
      .sprite(-50, 0, "btnHome")
      .setOrigin(0.5, 0.5)
      .setPosition(-50, 150)
      .setScrollFactor(0)
      .setScale(1.2)
      .setInteractive();
      this.btnHome.on('pointerup', () => {
            this.setVisible(false);
            this.makeTransition("Menu", "IsoExperimentalMap")
    })
    this.btnHome.on("pointerout", () => this.changeTexture("home"));
    this.btnHome.on("pointerover", () => this.changeTexture("home", "hover"));
    this.btnHome.on("pointerdown", () => {
      this.onClickSound?.play()
      this.changeTexture("home", "click")
    });
    this.add([
      this.settingsBackground,
      this.btnExit,
      this.btnHome,
      this.btnRetry,
      text1,
      text2,
    ]);
    this.setDepth(999999999);
    this.scene.add.existing(this);
    this.setPosition(x, y);
    this.setVisible(true);
  }
}
export default LoseModal;
