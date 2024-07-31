import Phaser from "phaser";
import { Audio, LevelDataType } from "@/game/types";
import BetweenScenes from "@/game/BetweenScenes";
import EventsCenter from "@/game/EventsCenter";
import UIScene from "@/game/UIScene";
import MainMenuScene from "@/game/Menu";
import GlobalDataSingleton from "@/game/services/GlobalData";

// Scene in class
class WinGameModal extends Phaser.GameObjects.Container {
  settingsBackground?: Phaser.GameObjects.Sprite;
  btnShare?: Phaser.GameObjects.Sprite;
  btnExit?: Phaser.GameObjects.Sprite;
  stars?: Phaser.GameObjects.Sprite;
  level?: number;
  score?: number;
  lifes?: number;
  onClickSound?: Audio;

  changeTexture(btn: string, interaction?: string) {
    const texturesBtns = {
      share: {
        normal: "share",
        pressed: "shareClick",
        hover: "shareHover",
      },
      exit: {
        normal: "exitWin",
        pressed: "exitWinClick",
        hover: "exitWineHover",
      },
      stars: {
        stars1: "starsFull",
      },
    };
    switch (btn) {
      case "share":
        switch (interaction) {
          case "hover":
            this.btnShare?.setTexture(texturesBtns.share.hover);
            break;
          case "pressed":
            this.btnShare?.setTexture(texturesBtns.share.pressed);
            break;
          default:
            this.btnShare?.setTexture(texturesBtns.share.normal);
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
    onSelect?: Function,
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
    const text2 = this.scene.add
      .text(0, 90, "SCORE", {
        fontSize: 35,
        fontFamily: "Quicksand"
      })
      .setOrigin(0.5);
    const text3 = this.scene.add
      .text(0, 130, this.score.toString(), {
        fontSize: 55,
        fontFamily: "Quicksand"
      })
      .setOrigin(0.5);
    this.stars = this.scene.add.sprite(0, -170, "starsFull").setOrigin(0.5, 0.5);

    this.settingsBackground = this.scene.add
      .sprite(0, 0, "winGameBackground")
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(999999999);
    // NEXT
    this.btnShare = this.scene.add
      .sprite(-40, 190, "share")
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setInteractive();
    this.btnShare.on("pointerdown", () => {
      this.changeTexture("share", "pressed");
      this.onClickSound?.play()
    });
    this.btnShare.on("pointerout", () => this.changeTexture("share"));
    this.btnShare.on("pointerover", () => this.changeTexture("share", "hover"));
    this.btnShare.on("pointerup", () => {
      if (this.level && this.score && this.lifes){
        // onSelect("nextLevel")
        EventsCenter.emit("share")
        this.setVisible(false)
        GlobalDataSingleton.resetGlobal();
        this.makeTransition("Menu", "IsoExperimentalMap");
      }
    });
    
    // EXIT
    this.btnExit = this.scene.add
      .sprite(40, 190, "exitWin")
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setInteractive();

    this.btnExit.on("pointerdown", () => {
      this.changeTexture("exit", "pressed");
      this.setVisible(false);
      GlobalDataSingleton.resetGlobal();
      this.makeTransition("Menu", "IsoExperimentalMap");
      this.onClickSound?.play()
    });
    this.btnExit.on("pointerout", () => this.changeTexture("exit"));
    this.btnExit.on("pointerover", () => this.changeTexture("exit", "hover"));
   
    this.add([
      this.settingsBackground,
      this.btnShare,
      this.btnExit,
      this.stars,
      text2,
      text3,
    ]);
    this.setDepth(999999999);
    this.scene.add.existing(this);
    this.setPosition(x, y);
    this.setVisible(true);
  }
}
export default WinGameModal;
