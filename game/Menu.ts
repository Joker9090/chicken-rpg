import Phaser from "phaser";
import BetweenScenes, { BetweenScenesStatus } from "./BetweenScenes";
import SettingsModal from "./Assets/UIassets/ModalSettings";
import { Audio } from "./types";
import EventsCenter from "./EventsCenter";

export default class MainMenuScene extends Phaser.Scene {
  logo?: Phaser.GameObjects.Image;

  play?: Phaser.GameObjects.Image;
  stats?: Phaser.GameObjects.Image;
  settings?: Phaser.GameObjects.Image;
  exit?: Phaser.GameObjects.Image;
  credits?: Phaser.GameObjects.Image;
  
  container?: Phaser.GameObjects.Container;

  background1?: Phaser.GameObjects.Image;
  background2?: Phaser.GameObjects.Image;
  background3?: Phaser.GameObjects.Image;
  background4?: Phaser.GameObjects.Image;

  modalSettings?: SettingsModal;

  musicManager?: Phaser.Scene
  onClickSound?: Audio;

  constructor() {
    super({ key: "Menu" });
  }

  init() { }


  changeTexture(btn: string, interaction?: string) {
    const texturesBtns = {
      play: {
        normal: "btnPlay",
        pressed: "btnPlayClick",
        hover: "btnPlayHover"
      },
      exit: {
        normal: "btnExitMenu",
        pressed: "btnExitMenuClick",
        hover: "btnExitMenuHover"
      },
      settings: {
        normal: "btnSettings",
        pressed: "btnSettingsClick",
        hover: "btnSettingsHover"
      },
      stats: {
        normal: "btnStats",
        pressed: "btnStatsClick",
        hover: "btnStatsHover"
      },
      credits: {
        normal: "btnCredits",
        pressed: "btnCreditsClickB",
        hover: "btnCreditsHover"
      },
    }
    switch (btn) {
      case "play":
        switch (interaction) {
          case "pressed":
            this.play?.setTexture(texturesBtns.play.pressed);
            break;
          case "hover":
            this.play?.setTexture(texturesBtns.play.hover);
            break;
          default:
            this.play?.setTexture(texturesBtns.play.normal);
        }
        break;
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
      case "settings":
        switch (interaction) {
          case "pressed":
            this.settings?.setTexture(texturesBtns.settings.pressed);
            break;
          case "hover":
            this.settings?.setTexture(texturesBtns.settings.hover);
            break;
          default:
            this.settings?.setTexture(texturesBtns.settings.normal);
        }
        break;
      case "stats":
        switch (interaction) {
          case "pressed":
            this.stats?.setTexture(texturesBtns.stats.pressed);
            break;
          case "hover":
            this.stats?.setTexture(texturesBtns.stats.hover);
            break;
          default:
            this.stats?.setTexture(texturesBtns.stats.normal);
        }
        break;
        case "credits":
          switch (interaction) {
            case "pressed":
              this.credits?.setTexture(texturesBtns.credits.pressed);
              break;
            case "hover":
              this.credits?.setTexture(texturesBtns.credits.hover);
              break;
            default:
              this.credits?.setTexture(texturesBtns.credits.normal);
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

  openModal(modal: SettingsModal) {
    if (modal?.visible) {
      modal.setVisible(false);
    } else {
      modal?.setVisible(true);
    }
  }

  addTweens() {
    this.tweens.add({
      targets: this.logo,
      y: -20,
      ease: "Bounce.inOut",
      duration: 3000,
      yoyo: true,
      loop: -1,
    })
  }

  onToggleSound (status: boolean) {
    this.onClickSound?.setVolume(status ? 0.2 : 0)
  }

  create() {
    window.addEventListener("resize", () => {
      this.scale.resize(window.innerWidth, window.innerHeight);
      this.scale.updateBounds();
    });
    this.scale.resize(window.innerWidth, window.innerHeight);
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.modalSettings = new SettingsModal(
      //@ts-ignore
      this,
      width / 2,
      height / 2,
      true
    );
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

      const LogoNoswar = this.add.image(width/2 - 100, height/2 - 100, "logoNoswar").setOrigin(0.5).setDepth(9999)

      this.play = this.add.image(0, 250, "btnPlay").setOrigin(0.5).setInteractive();
      this.play.on("pointerdown", () => {
      this.changeTexture("play", "pressed")
      this.onClickSound?.play()
    })
    this.play.on("pointerup", () => {
      this.changeTexture("play", "normal")
      this.makeTransition("LevelMenu", "Menu", { level: 1 })
    })
    this.play.on('pointerout', () => this.changeTexture("play"))

    this.play.on('pointerover', () => this.changeTexture("play", "hover"))
    this.settings = this.add.image(-200, 250, "btnSettings").setOrigin(0.5).setInteractive();
    this.settings.on("pointerdown", () => {
      this.changeTexture("settings", "pressed")
      this.onClickSound?.play()
    })
    this.settings.on('pointerover', () => this.changeTexture("settings", "hover"))
    this.settings.on('pointerout', () => this.changeTexture("settings"))

    this.settings.on("pointerup", () => {
      this.changeTexture("settings", "normal")
      if (this.modalSettings) this.openModal(this.modalSettings)
    })

    // this.stats = this.add.image(200, 250, "btnStats").setOrigin(0.5).setInteractive();
    // this.stats.on("pointerdown", () => {
    //   this.changeTexture("stats", "pressed")
    //   this.onClickSound?.play()
    // })
    // this.stats.on("pointerup", () => {
    //   this.changeTexture("stats", "normal")
    //   this.makeTransition("Credits", "Menu", {})
    // })
    
    // this.stats.on('pointerover', () => this.changeTexture("stats", "hover"))
    // this.stats.on('pointerout', () => this.changeTexture("stats"))
    
    this.credits = this.add.image(200, 250, "btnCredits").setOrigin(0.5).setInteractive();
    this.credits.on("pointerdown", () => {
      this.changeTexture("credits", "pressed")
      this.onClickSound?.play()
    })
    this.credits.on("pointerup", () => {
      this.changeTexture("credits", "normal")
      this.makeTransition("Credits", "Menu", {})
    })
    
    this.credits.on('pointerover', () => this.changeTexture("credits", "hover"))
    this.credits.on('pointerout', () => this.changeTexture("credits"))

    this.exit = this.add.image(width / 2 - 100, - height / 2 + 100, "btnExitMenu").setOrigin(0.5).setInteractive();
    this.exit.on("pointerdown", () => {
      this.changeTexture("exit", "pressed")
      this.onClickSound?.play()
    })
    this.exit.on('pointerover', () => this.changeTexture("exit", "hover"))
    this.exit.on('pointerout', () => this.changeTexture("exit"))

    this.exit.on("pointerup", () => {
      this.changeTexture("exit", "normal")
      //@ts-ignore
      this.musicManager?.stopMusic()
      this.makeTransition("Menu", "Menu", {})
    })
    this.logo = this.add.image(-20, 0, "logoMenu").setOrigin(0.5);

    this.container = this.add.container(width / 2, height / 2);
    this.container.add([
      this.play,
      this.settings,
      // this.stats,
      this.credits,
      this.exit,
      this.logo,
      LogoNoswar
    ]);
    this.addTweens()

    this.musicManager = this.game.scene.getScene("MusicManager");
    this.onClickSound = this.sound.add('menuBtn');
    this.onClickSound.setVolume(0.2)
    //@ts-ignore
    this.musicManager.playMusic('music')
    EventsCenter.on("toggleBtnSound", this.onToggleSound, this);
  }

  update() { }
}
