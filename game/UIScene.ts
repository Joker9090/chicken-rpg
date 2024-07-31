import Phaser, { GameObjects } from "phaser";
import UI, { UIConfig } from "./Assets/UIassets/UI";
import TextBox from "./Assets/UIassets/TextBox";
import SettingsModal from "./Assets/UIassets/ModalSettings";
import EventsCenter from "./EventsCenter";
import IsoExperimentalMap from "./scene";
import BarLife from "./Assets/UIassets/barLife";
import WinModal from "./Assets/UIassets/ModalWin";
import LoseModal from "./Assets/UIassets/ModalLose";
import WinGameModal from "./Assets/UIassets/ModalWinGame";
import GlobalDataSingleton, { Scope } from "./services/GlobalData";
import { Audio, LevelDataType } from "./types";
import BetweenScenes from "./BetweenScenes";
import GameOverModal from "./Assets/UIassets/ModalGameOver";

export default class UIScene extends Phaser.Scene {
  //tutorial
  tutorialTextBox?: TextBox;
  modalSettings?: SettingsModal;
  modalWin?: WinModal | WinGameModal;
  modalLose?: LoseModal;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  iconTp?: Phaser.GameObjects.Image;
  iconFinish?: Phaser.GameObjects.Image;
  iconToxic?: Phaser.GameObjects.Image;
  iconHeal?: Phaser.GameObjects.Image;
  configButton?: Phaser.GameObjects.Image;

  starsText?: Phaser.GameObjects.Text;
  stars: number = 0;
  starsIcon?: Phaser.GameObjects.Image;

  lifesGroup?: Phaser.GameObjects.Group;
  statesGroup?: Phaser.GameObjects.Group;
  lifeBar2?: BarLife;
  lifeBarStatus: number = 11;
  lifeState: number = 0;
  lifesCounter?: Phaser.GameObjects.Image;
  lifes: number = 3;
  allowRerenderLifeBar: boolean = true;
  level?: number;
  startingTime?: number;

  timerIcon?: Phaser.GameObjects.Image;
  timerBorder?: Phaser.GameObjects.Image;
  timerText?: Phaser.GameObjects.Text;
  timeLevel: number = 181;

  containerTop?: Phaser.GameObjects.Container;
  containerBottom?: Phaser.GameObjects.Container;
  iconStates?: string[];
  width?: number;
  height?: number;

  onClickSound?: Audio;

  listener?: (scope: Scope) => void;

  constructor() {
    super({ key: "UIScene" });
  }

  makeTransition(
    sceneNameStart: string,
    sceneNameStop: string,
    data?: LevelDataType
  ) {
    const getBetweenScenesScene = this.game.scene.getScene(
      "BetweenScenes"
    ) as BetweenScenes;
    getBetweenScenesScene.changeSceneTo(sceneNameStart, sceneNameStop, data);
  }

  createUI(lifes: number, widthScreen: number, heightScreen: number) {
    let quantityLifes = 0;
    let xpos = 0;
    if (lifes)
      for (let i = 0; i < lifes; i++) {
        quantityLifes += 1;
        xpos = 80 + i * 55;
        const lifeConfig: UIConfig = {
          texture: "fullHeart",
          pos: { x: xpos, y: 60 },
          scale: 0.9,
        };
        const coras = new UI(this, lifeConfig, this.lifesGroup).setScrollFactor(
          0,
          0
        );
        this.containerTop?.add(coras);
        this.lifesGroup?.setDepth(9999);
      }
    // iconTpOn

    const iconFinish: UIConfig = {
      texture: "iconFinishOff",
      pos: { x: widthScreen - 100, y: 0 },
      scale: 1,
    };
    const iconTp: UIConfig = {
      texture: "iconTpOn",
      pos: { x: -200, y: 0 },
      scale: 1,
    };
    const iconToxic: UIConfig = {
      texture: "iconToxic",
      pos: { x: -200, y: 0 },
      scale: 1,
    };
    const iconHeal: UIConfig = {
      texture: "iconHeal",
      pos: { x: -200, y: 0 },
      scale: 1,
    };
    const configButtonConfig: UIConfig = {
      texture: "config",
      pos: { x: 100, y: 0 },
      scale: 1,
    };
    const timerIconConfig: UIConfig = {
      texture: "clock",
      pos: { x: widthScreen - 160, y: 60 },
      scale: 1,
    };
    const timerBorderConfig: UIConfig = {
      texture: "clockBorder",
      pos: { x: widthScreen - 125, y: 60 },
      scale: 1,
    };
    const starsIconConfig: UIConfig = {
      texture: "starOff",
      pos: { x: widthScreen - 350, y: 60 },
      scale: 1,
    };
    const lifeBarConfig: UIConfig = {
      texture: "fullLife",
      pos: { x: widthScreen / 2, y: 60 },
      scale: 0.9,
    };
    this.iconTp = new UI(this, iconTp).setScrollFactor(0, 0).setVisible(false);
    this.iconFinish = new UI(this, iconFinish);
    this.iconToxic = new UI(this, iconToxic)
      .setScrollFactor(0, 0)
      .setVisible(false);
    this.iconHeal = new UI(this, iconHeal).setVisible(false);
    this.configButton = new UI(this, configButtonConfig);
    this.timerIcon = new UI(this, timerIconConfig);
    this.timerBorder = new UI(this, timerBorderConfig);
    this.starsIcon = new UI(this, starsIconConfig);
    this.lifeBar2 = new BarLife(this, 0, 0, this.lifeBarStatus);
    this.lifeBar2.setPosition(widthScreen / 2 - this.lifeBar2.width / 2, 60);

    this.onClickSound = this.sound.add('interfaceBtn')
    const mm = this.game.scene.getScene(
      "MusicManager"
    )
    //@ts-ignore
    this.onClickSound.setVolume(mm.soundStatus ? 0 : 0.5)
    this.configButton.on("pointerdown", () => this.onClickSound?.play());
    // this.lifesCounter = new UI(this, lifesCounterConfig);
    this.containerBottom?.add([
      this.iconTp,
      this.iconFinish,
      this.iconToxic,
      this.iconHeal,
      this.configButton,
    ]);

    this.containerTop?.add([this.timerIcon, this.timerBorder, this.starsIcon]);
  }

  showIcon(item: string) {
    if (item === "toxic") {
      this.iconToxic?.setVisible(true);
      setTimeout(() => {
        this.iconToxic?.setVisible(false);
      }, 2000);
    } else if (item === "heal") {
      this.iconHeal?.setVisible(true);
      setTimeout(() => {
        this.iconHeal?.setVisible(false);
      }, 2000);
    } else if (item === "portal") {
      this.iconTp?.setVisible(true);
      setTimeout(() => {
        this.iconTp?.setVisible(false);
      }, 2000);
    } else if (item === "finishOn") {
      this.iconFinish?.setTexture("iconFinishOn");
    } else if (item === "finishOff") {
      this.iconFinish?.setTexture("iconFinishOff");
    }
  }

  getItem(item: string) {
    if (item === "star") {
      if (this.level && GlobalDataSingleton.scope.starByLevel) {
        const level = this.level
        const starsByLevel = GlobalDataSingleton.scope.starByLevel
        const newStarsByLevel = { ...starsByLevel, [level]: true }
        GlobalDataSingleton.setNewValue({ stars: this.stars + 1, starByLevel: newStarsByLevel });
      }
    } else if (item === "time") {
      GlobalDataSingleton.setNewValue({ time: this.timeLevel + 10 });
    } else {
      // continue...
    }
  }

  loseLife() {
    if (this.level !== 1) this.showIcon("finishOff");
    const newLifes = this.lifes - 1;
    GlobalDataSingleton.setNewValue({ lifes: newLifes, lifeBar: 11 });
    
    if (newLifes > 0) {
      this.lose();
    } else {
      this.gameOver();
    }
  }

  gameOver = () => {
    GlobalDataSingleton.stopTimer();
    const finalTime = GlobalDataSingleton.getScope().time;
    if (finalTime && this.startingTime) {
      const score = this.startingTime - finalTime;
      if (this.width && this.level && this.height) {
        this.modalWin = new GameOverModal(
          this,
          this.width / 2,
          this.height / 2,
          this.level,
          Math.floor(score),
          this.lifes
        );
      }
    }
  };

  reRenderLifes(lifesRemaining: number) {
    if (this.lifesGroup) {
      const lifesChilds = [];
      let lifeToTheRight = null;
      let highestX = Number.NEGATIVE_INFINITY;
      for (let i = 0; i < this.lifesGroup.getLength(); i++) {
        const child = this.lifesGroup.getChildren()[
          i
        ] as Phaser.GameObjects.Image;
        if (child.x > highestX) {
          lifesChilds.push(child);
        } else {
          lifesChilds.unshift(child);
        }
      }
      for (let i = 0; i < 3 - lifesRemaining; i++) {
        lifesChilds[2 - i].setTexture("emptyHeart");
      }
    }
  }

  loseLifeBar(data: any) {
    const {amount, loseSound} = data
    if (this.lifeBarStatus && this.lifeState === 0) {
      this.lifeState = 1;
      const newLifeBarBars = this.lifeBarStatus - amount;
      GlobalDataSingleton.setNewValue({ lifeBar: newLifeBarBars });
      this.reRenderLifeBar(newLifeBarBars)
      console.log("entró acá ARIEL 1")
      if (newLifeBarBars <= 0) {
        GlobalDataSingleton.stopTimer();
        this.loseLife();
        loseSound.play()
      }
    } else {
      console.log("entró acá ARIEL 2")
    }
  }

  reRenderLifeBar(lifeBarBars: number) {
    console.log("ARIEL 4")
    this.lifeBar2?.destroy();
    if (lifeBarBars >= 0) {
      this.lifeBar2 = new BarLife(this, 0, 0, lifeBarBars);
    } else {
      this.lifeBar2 = new BarLife(this, 0, 0, 0);
    }
    this.lifeBar2.setPosition(
      window.innerWidth / 2 - this.lifeBar2.width / 2,
      60
    );
    if (this.lifeState === 1) {
      setTimeout(() => {
        this.lifeState = 0;
        console.log("ARIEL 4")
      }, 3000);
    }
  }

  openModal(modal: SettingsModal) {
    if (modal?.visible) {
      modal.setVisible(false);
    } else {
      modal?.setVisible(true);
    }
  }

  win() {
    GlobalDataSingleton.stopTimer();
    const finalTime = GlobalDataSingleton.getScope().time;
    if (finalTime && this.startingTime) {
      const score = this.startingTime - finalTime;
      if (this.listener) GlobalDataSingleton.removeListener(this.listener);
      if (this.width && this.level && this.height) {
        if (this.modalWin) {
          this.modalWin.destroy();
          if (this.level === 5) {
            this.modalWin = new WinGameModal(
              this,
              this.width / 2,
              this.height / 2,
              this.level,
              Math.floor(score),
              this.lifes
            );
          } else {
            this.modalWin = new WinModal(
              this,
              this.width / 2,
              this.height / 2,
              this.level,
              Math.floor(score),
              this.lifes
              // this.onSelectModalAction
            );
          }
        } else {
          if (this.level === 5) {
            this.modalWin = new WinGameModal(
              this,
              this.width / 2,
              this.height / 2,
              this.level,
              Math.floor(score),
              this.lifes
            );
          } else {
            this.modalWin = new WinModal(
              this,
              this.width / 2,
              this.height / 2,
              this.level,
              Math.floor(score),
              this.lifes
            );
          }
        }
      }
    }
  }

  lose() {
    GlobalDataSingleton.stopTimer();
    const finalTime = GlobalDataSingleton.getScope().time;
    if (finalTime && this.startingTime) {
      const score = this.startingTime - finalTime;
      if (this.listener) GlobalDataSingleton.removeListener(this.listener);
      if (this.width && this.level && this.height) {
        if (this.modalLose) {
          this.modalLose.destroy();
          this.modalLose = new LoseModal(
            this,
            this.width / 2,
            this.height / 2,
            this.level,
            Math.floor(score),
            this.lifes
          );
        } else {
          this.modalLose = new LoseModal(
            this,
            this.width / 2,
            this.height / 2,
            this.level,
            Math.floor(score),
            this.lifes
          );
        }
      }
    }
  }

  onToggleSound (status: boolean) {
    this.onClickSound?.setVolume(status ? 0.5 : 0)
  }

  create(this: UIScene) {
    window.addEventListener("resize", () => {
      this.scale.resize(window.innerWidth, window.innerHeight);
      this.scale.updateBounds();
    });
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.containerTop = this.add.container(0, 0).setDepth(99999);
    this.containerBottom = this.add
      .container(0, this.height - 60)
      .setDepth(99999);

    const mm = this.game.scene.getScene(
      "MusicManager"
    )

    this.modalSettings = new SettingsModal(
      this,
      this.width / 2,
      this.height / 2,
      false,
      //@ts-ignore
      mm.soundStatus,
      //@ts-ignore
      mm.musicStatus
    );

    this.timerText = this.add
      .text(0, 0, ``, {
        fontSize: 32,
        fontFamily: "Quicksand",
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0, 0)
      .setDepth(9999)
      .setSize(50, 50)
      .setPosition(this.width - 100, 60);
    this.lifesGroup = this.add.group();
    this.statesGroup = this.add.group();
    this.createUI(3, this.width, this.height);
    this.starsText = this.add
      .text(0, 0, `0`, {
        fontSize: 32,
        fontFamily: "Quicksand",
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0, 0)
      .setDepth(9999)
      .setSize(50, 50)

      .setPosition(this.width - 300, 60);
    this.containerTop.add([this.timerText, this.starsText]);

    // DATA SETTER
    this.listener = (scope: Scope) => {
      this.level = GlobalDataSingleton.scope.level
        ? GlobalDataSingleton.scope.level
        : 1;
      this.timeLevel = GlobalDataSingleton.scope.time
        ? GlobalDataSingleton.scope.time
        : 0;
      this.stars = GlobalDataSingleton.scope.stars
        ? GlobalDataSingleton.scope.stars
        : 0;
      this.lifes = GlobalDataSingleton.scope.lifes
        ? GlobalDataSingleton.scope.lifes
        : 3;
      this.lifeBarStatus = GlobalDataSingleton.scope.lifeBar
        ? GlobalDataSingleton.scope.lifeBar
        : 11;
      // set new values
      if (this.timeLevel <= 0) {
        this.gameOver();
      }
      this.timerText?.setText(Math.ceil(this.timeLevel).toString());
      this.starsText?.setText(this.stars.toString());
      this.reRenderLifes(this.lifes);
    };
    GlobalDataSingleton.addListener(this.listener);
    GlobalDataSingleton.startTimer();
    this.startingTime = GlobalDataSingleton.getScope().time;
    this.reRenderLifeBar(this.lifeBarStatus)
    this.containerBottom = this.add
      .container(0, this.height - 60)
      .setDepth(99999);

    /* TIMER */
    if (this.level === 1) {
      this.showIcon("finishOn");
    }

    this.configButton?.setInteractive();

    this.configButton?.on("pointerdown", () => {
      if (this.modalSettings) {
        this.openModal(this.modalSettings);
      } else {
      }
    });

    /* SCENE HANDLER */
    EventsCenter.on("portalTaken", this.portalFunction, this);
    EventsCenter.on("toxic", this.toxicFunction, this);
    EventsCenter.on("finalTileToggle", this.finalTileToggleFunction, this)
    EventsCenter.on("win", this.win, this);
    EventsCenter.on("loseLife", this.loseLife, this);
    EventsCenter.on("getItem", this.getItem, this);
    EventsCenter.on("toggleBtnSound", this.onToggleSound, this);
  }

  removeListenerEventsCenter() {
    EventsCenter.off("portalTaken", this.portalFunction, this);
    EventsCenter.off("toxic", this.toxicFunction, this);
    EventsCenter.off("finalTileToggle", this.finalTileToggleFunction, this)
    EventsCenter.off("win", this.win, this);
    EventsCenter.off("loseLife", this.loseLife, this);
    EventsCenter.off("getItem", this.getItem, this);
  }

  toxicFunction(data: any) {
    this.loseLifeBar(data);
    this.showIcon("toxic");
  }

  finalTileToggleFunction(data: any) {
    if (data === true) {
      this.showIcon("finishOn");
    } else if (data === false) {
      this.showIcon("finishOff");
    }
  }

  portalFunction() {
    this.showIcon("portal")
  }

  destroy() {
    GlobalDataSingleton.stopTimer();
    if (this.listener) GlobalDataSingleton.removeListener(this.listener);
    this.removeListenerEventsCenter()
    console.log("DESTROY ");
  }

  updateIconsPosition() {
    const mobileIcons = [this.iconToxic, this.iconTp, this.iconHeal];
    const filteredMobileIcons = mobileIcons.filter((a) => a?.visible);
    const positionsX = [200, 300, 400];
    const width = window.innerWidth;
    for (let i = 0; i <= filteredMobileIcons.length; i++) {
      filteredMobileIcons[i]?.setX(width - positionsX[i]);
    }
  }

  update() {
    this.updateIconsPosition();
  }
}
