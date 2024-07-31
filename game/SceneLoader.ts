import Phaser, { Loader } from "phaser";
import BetweenScenes from "./BetweenScenes";
import LoadingBar from "./Assets/Loading/LoadingBar";
export type SceneKeys = "Level1" | "Loading";

export type LoadTypes = "image" | "spritesheet" | "audio";

const loadAssets = {
  Loading: {
    assets: [
      // LOADING
      ["image", "bgInicio1", "/assets/Loading/bg1.png"],
      ["image", "bgInicio2", "/assets/Loading/bg2.png"],
      ["image", "bgInicio3", "/assets/Loading/bg3.png"],
      ["image", "bgInicio4", "/assets/Loading/bg4.png"],
      ["image", "loadingBar", "/assets/Loading/loadingBarEmpty.png"],
      ["image", "logoLoading", "/assets/Loading/logo.png"],
      ["image", "carga", "/assets/Loading/carga.png"],
      ["image", "logoNoswar", "/assets/Menu/logoNoswar.png"],

    ],
  },
  Level1: {
    assets: [
      //background
      ["image", "backgroundSpace", "/assets/background/bg1.png"],
      ["image", "stars", "/assets/background/bg2.png"],
      ["image", "backgroundLight", "/assets/background/bg3.png"],
      ["image", "backgroundLightColored", "/assets/background/bg4.png"],
      ["image", "bottomGalaxy", "/assets/background/bg5.png"],
      ["image", "topGalaxy", "/assets/background/bg6.png"],
      //default
      ["image", "cube", "/images/cube.png"],
      ["image", "D", "/assets/Pisos/baldozas/baldoza1.png"],
      ["image", "1", "/images/baldoza1.png"],
      //botones
      ["image", "BN|C-", "/assets/Pisos/baldozaBtnOff/btnOff7.png"],
      ["image", "BN|C+", "/assets/Pisos/baldozaBtnOn/btnOn7.png"],
      ["image", "BN|R-", "/assets/Pisos/baldozaBtnOneWay/btnOff1.png"],
      ["image", "BN|R+", "/assets/Pisos/baldozaBtnOneWay/btnOn2.png"],
      ["image", "BN|L-", "/assets/Pisos/baldozaBtnOneWay/btnOff2.png"],
      ["image", "BN|L+", "/assets/Pisos/baldozaBtnOneWay/btnOn1.png"],
      ["image", "BN|B-", "/assets/Pisos/baldozaBtnOneWay/btnOff3.png"],
      ["image", "BN|B-", "/assets/Pisos/baldozaBtnOneWay/btnOn3.png"],
      ["image", "BN|T-", "/assets/Pisos/baldozaBtnOneWay/btnOff4.png"],
      ["image", "BN|T+", "/assets/Pisos/baldozaBtnOneWay/btnOn4.png"],
      //caminos
      ["image", "W|C-", "/assets/Pisos/baldozas/baldoza2.png"],
      ["image", "W|C+", "/assets/Pisos/baldozas/baldozaConLuz2.png"],
      ["image", "W|BT-", "/assets/Pisos/baldozas/baldoza3.png"],
      ["image", "W|BT+", "/assets/Pisos/baldozas/baldozaConLuz3.png"],
      ["image", "W|LR-", "/assets/Pisos/baldozas/baldoza4.png"],
      ["image", "W|LR+", "/assets/Pisos/baldozas/baldozaConLuz4.png"],
      ["image", "W|BR-", "/assets/Pisos/baldozas/baldoza5.png"],
      ["image", "W|BR+", "/assets/Pisos/baldozas/baldozaConLuz5.png"],
      ["image", "W|TR-", "/assets/Pisos/baldozas/baldoza6.png"],
      ["image", "W|TR+", "/assets/Pisos/baldozas/baldozaConLuz6.png"],
      ["image", "W|LT-", "/assets/Pisos/baldozas/baldoza7.png"],
      ["image", "W|LT+", "/assets/Pisos/baldozas/baldozaConLuz7.png"],
      ["image", "W|LB-", "/assets/Pisos/baldozas/baldoza8.png"],
      ["image", "W|LB+", "/assets/Pisos/baldozas/baldozaConLuz8.png"],
      ["image", "W|T-", "/assets/Pisos/baldozas/baldozaFinal1.png"],
      ["image", "W|T+", "/assets/Pisos/baldozas/baldozaFinal6.png"],
      ["image", "W|B-", "/assets/Pisos/baldozas/baldozaFinal2.png"],
      ["image", "W|B+", "/assets/Pisos/baldozas/baldozaFinal5.png"],
      ["image", "W|R-", "/assets/Pisos/baldozas/baldozaFinal3.png"],
      ["image", "W|R+", "/assets/Pisos/baldozas/baldozaFinal7.png"],
      ["image", "W|L-", "/assets/Pisos/baldozas/baldozaFinal4.png"],
      ["image", "W|L+", "/assets/Pisos/baldozas/baldozaFinal8.png"],
      //saltos
      ["image", "J", "/assets/Pisos/plataformaSalto1.png"],
      ["image", "J|arrows", "/assets/Pisos/platFlechasSalto1.png"],
      //toxica
      ["image", "T", "/assets/Pisos/plataformaToxica.png"],
      //portales
      // ["image", "PO+", "/assets/Pisos/plataformaLenta2.png"],
      ["image", "PO+", "/assets/assets/tp/tpBase.png"],
      ["image", "PO+top", "/assets/assets/tp/Tp2.png"],
      ["image", "PO+ligth", "/assets/assets/tp/Tp3.png"],
      ["image", "PO+backLigth", "/assets/assets/tp/Tp3.png"],
      //
      ["image", "6", "/images/baldoza3.png"],
      ["image", "6.1", "/images/baldoza3_1.png"],
      //rotas
      ["image", "CO", "/assets/Pisos/plataformaRota.png"],
      ["image", "CO2", "/assets/Pisos/plataformaRota2.png"],
      ["image", "CO3", "/assets/Pisos/plataformaRota3.png"],
      //hielo
      ["image", "I", "/assets/Pisos/plataformaHielo.png"],
      //fin
      ["image", "E-", "/assets/Pisos/plataformaFin2.png"],
      ["image", "E+", "/assets/Pisos/plataformaFin.png"],
      //inicio
      ["image", "11", "/assets/Pisos/plataformaInicio.png"],
      // SPRITESHEETS
      [
        "spritesheet",
        "player",
        "/assets/ballMoves.png",
        { frameWidth: 50, frameHeight: 50 },
      ],
      [
        "spritesheet",
        "ballAnim",
        "/assets/ballAnim.png",
        { frameWidth: 100, frameHeight: 100 },
      ],
      [
        "spritesheet",
        "tileToxic",
        "/assets/spriteToxic.png",
        { frameWidth: 300, frameHeight: 170 },
      ],
      // ["spritesheet", "tileToxic", "/assets/ballAnim.png",{ frameWidth: 100, frameHeight: 100 },],
      // ["spritesheet", "tileIce", "/assets/ballAnim.png",{ frameWidth: 100, frameHeight: 100 },],
      //barrierTowers
      ["image", "BT|LR-", "/assets/assets/cercaDeLuz/posteOff4.png"],
      ["image", "BT|LR+", "/assets/assets/cercaDeLuz/poste4.png"],
      ["image", "BT2|LR-", "/assets/assets/cercaDeLuz/posteOff3.png"],
      ["image", "BT2|LR+", "/assets/assets/cercaDeLuz/poste3.png"],
      //barriers
      ["image", "B+", "/assets/assets/cercaDeLuz/laserTrimmed.png"],
      //collectables
      ["image", "S", "/assets/assets/collectables/star1.png"],
      ["image", "S2", "/assets/assets/collectables/star2.png"],
      // between scenes
      ["image", "block", "/50x50.png"],
      //UI
      ["image", "emptyHeart", "/assets/UI/UILevel/emptyHeart.png"],
      ["image", "emptyLife", "/assets/UI/UILevel/emptyLife.png"],
      ["image", "fullLife", "/assets/UI/UILevel/fullLife.png"],
      ["image", "fullHeart", "/assets/UI/UILevel/heart.png"],
      ["image", "starOn", "/assets/UI/UILevel/UIstar1.png"],
      ["image", "starOff", "/assets/UI/UILevel/UIstar0.png"],
      ["image", "test", "/assets/UI/UILevel/test.png"],
      ["image", "config", "/assets/UI/UILevel/settingsGame.png"],
      ["image", "clock", "/assets/UI/UILevel/reloj.png"],
      ["image", "clockBorder", "/assets/UI/UILevel/borde.png"],
      ["image", "holder", "/assets/UI/UILevel/holder.png"],
      ["image", "barLife", "/assets/UI/UILevel/barraDeVida.png"],
      //audio
      ["audio", "barrierSound", "assets/audio/barrierSound.wav"],
      ["audio", "starSound", "assets/audio/starSound.wav"],
      ["audio", "jumpSound", "assets/audio/jumpSound.wav"],
      ["audio", "breakSound1", "assets/audio/breakSound1.wav"],
      ["audio", "breakSound2", "assets/audio/breakSound2.wav"],
      ["audio", "btnOn", "assets/audio/btnOn.wav"],
      ["audio", "btnOff", "assets/audio/btnOff.wav"],
      ["audio", "teleport", "assets/audio/teleport.wav"],
      ["audio", "music", "assets/audio/music.mp3"],
      ["audio", "music2", "assets/audio/music2.mp3"],
      ["audio", "menuBtn", "assets/audio/startBtnSound.wav"],
      ["audio", "interfaceBtn", "assets/audio/interfaceSound.wav"],
      ["audio", "spawn", "assets/audio/spawn.mp3"],
      ["audio", "lose", "assets/audio/lose.mp3"],
      ["audio", "win", "assets/audio/win.mp3"],
      // UI settings modal
      ["image", "btnOk", "/assets/UI/settingsModal/btnOk.png"],
      ["image", "btnOkClick", "/assets/UI/settingsModal/btnOkClick.png"],
      ["image", "btnOkHover", "/assets/UI/settingsModal/btnOkHover.png"],
      ["image", "btnExit", "/assets/UI/settingsModal/exit.png"],
      ["image", "btnExitClick", "/assets/UI/settingsModal/exitClick.png"],
      ["image", "btnExitHover", "/assets/UI/settingsModal/exitHover.png"],
      ["image", "btnHome", "/assets/UI/settingsModal/home.png"],
      ["image", "btnHomeClick", "/assets/UI/settingsModal/homeClick.png"],
      ["image", "btnHomeHover", "/assets/UI/settingsModal/homeHover.png"],
      ["image", "musicIcon", "/assets/UI/settingsModal/music.png"],
      ["image", "soundIcon", "/assets/UI/settingsModal/sound.png"],
      [
        "image",
        "backgroundSettings",
        "/assets/UI/settingsModal/backgroundSettings.png",
      ],
      ["image", "backgroundSelectorOn", "/assets/UI/settingsModal/on.png"],
      ["image", "backgroundSelectorOff", "/assets/UI/settingsModal/off.png"],
      ["image", "selector", "/assets/UI/settingsModal/onOffSelector.png"],
      ["image", "volOn", "/assets/UI/settingsModal/volEmpty.png"],
      ["image", "volOnCrop", "/assets/UI/settingsModal/volFullCrop.png"],
      ["image", "volOff", "/assets/UI/settingsModal/volFull.png"],
      ["image", "volSelector", "/assets/UI/settingsModal/volSelector.png"],
      // UI win modal
      ["image", "btnNext", "/assets/UI/losewinModal/next.png"],
      ["image", "btnNextClick", "/assets/UI/losewinModal/nextClick.png"],
      ["image", "btnNextHover", "/assets/UI/losewinModal/nextHover.png"],
      ["image", "btnRetry", "/assets/UI/losewinModal/retry.png"],
      ["image", "btnRetryClick", "/assets/UI/losewinModal/retryClick.png"],
      ["image", "btnRetryHover", "/assets/UI/losewinModal/retryHover.png"],
      ["image", "stars1", "/assets/UI/losewinModal/stars1.png"],
      ["image", "stars0", "/assets/UI/losewinModal/stars0.png"],
      ["image", "stars2", "/assets/UI/losewinModal/stars2.png"],
      ["image", "stars3", "/assets/UI/losewinModal/stars3.png"],
      ["image", "btnExitLose", "/assets/UI/losewinModal/exitLose.png"],
      ["image", "btnExitClickLose", "/assets/UI/losewinModal/exitClickLose.png"],
      ["image", "btnExitHoverLose", "/assets/UI/losewinModal/exitHoverLose.png"],
      ["image", "backgroundNextLevel", "/assets/UI/losewinModal/nextLevel.png"],
      ["image", "backgroundLose", "/assets/UI/losewinModal/lose.png"],
      ["image", "starsFull", "/assets/UI/losewinModal/starsFull.png"],
      ["image", "shareLose", "/assets/UI/losewinModal/shareLose.png"],
      ["image", "shareClickLose", "/assets/UI/losewinModal/shareClickLose.png"],
      ["image", "shareHoverLose", "/assets/UI/losewinModal/shareHoverLose.png"],
      ["image", "share", "/assets/UI/losewinModal/share.png"],
      ["image", "shareClick", "/assets/UI/losewinModal/shareClick.png"],
      ["image", "shareHover", "/assets/UI/losewinModal/shareHover.png"],
      ["image", "exitWin", "/assets/UI/losewinModal/exit_2.png"],
      ["image", "exitWinClick", "/assets/UI/losewinModal/exitClick_2.png"],
      ["image", "exitWineHover", "/assets/UI/losewinModal/exitHover_2.png"],
      ["image", "winGameBackground", "/assets/UI/losewinModal/winGameBg.png"],
      ["image", "gameOverBackground", "/assets/UI/losewinModal/youLose.png"],
      // ICONS UI
      ["image", "iconTpOn", "/assets/UI/Icons/iconTpOn.png"],
      ["image", "iconTpOff", "/assets/UI/Icons/iconTpOn.png"],
      ["image", "iconFinishOn", "/assets/UI/Icons/iconFinalOk.png"],
      ["image", "iconFinishOff", "/assets/UI/Icons/iconFinalNo.png"],
      ["image", "iconHeal", "/assets/UI/Icons/iconHeal.png"],
      ["image", "iconToxic", "/assets/UI/Icons/iconToxic.png"],
      // INTRO
      ["image", "logoNoswar", "/assets/Intro/logo.png"],
      // Menu
      ["image", "menuBackground1", "/assets/Menu/bg1.png"],
      ["image", "menuBackground2", "/assets/Menu/bg2.png"],
      ["image", "menuBackground3", "/assets/Menu/bg3.png"],
      ["image", "menuBackground4", "/assets/Menu/bg4.png"],
      ["image", "btnExitMenu", "/assets/Menu/btnExit.png"],
      ["image", "btnExitMenuClick", "/assets/Menu/btnExitClick.png"],
      ["image", "btnExitMenuHover", "/assets/Menu/btnExitHover.png"],
      ["image", "btnPlay", "/assets/Menu/btnPlay.png"],
      ["image", "btnPlayClick", "/assets/Menu/btnPlayClick.png"],
      ["image", "btnPlayHover", "/assets/Menu/btnPlayHover.png"],
      ["image", "btnSettings", "/assets/Menu/btnSettings.png"],
      ["image", "btnSettingsHover", "/assets/Menu/btnSettingsHover.png"],
      ["image", "btnSettingsClick", "/assets/Menu/btnSettingsClick.png"],
      ["image", "btnStats", "/assets/Menu/btnStats.png"],
      ["image", "btnStatsHover", "/assets/Menu/btnStatsHover.png"],
      ["image", "btnStatsClick", "/assets/Menu/btnStatsClick.png"],
      ["image", "btnCredits", "/assets/Menu/btnCredits.png"],
      ["image", "btnCreditsHover", "/assets/Menu/btnCreditsHover.png"],
      ["image", "btnCreditsClick", "/assets/Menu/btnCreditsClick.png"],
      ["image", "btnCreditsClickB", "/assets/Menu/btnCreditsClickB.png"],
      ["image", "logoMenu", "/assets/Menu/logo.png"],
      // MenuLevel
      ["image", "btnBack", "/assets/LevelMenu/btnBack.png"],
      ["image", "btnBackHover", "/assets/LevelMenu/btnBackHover.png"],
      ["image", "btnBackClick", "/assets/LevelMenu/btnBackClick.png"],
      ["image", "lvlBlocked", "/assets/LevelMenu/lvlBlocked.png"],
      ["image", "lvlEmpty", "/assets/LevelMenu/lvlEmpty.png"],
      ["image", "lvlClick", "/assets/LevelMenu/lvlClick.png"],
      ["image", "lvlHover", "/assets/LevelMenu/lvlHover.png"],
      ["image", "okBtnLevel", "/assets/LevelMenu/okBtn.png"],
      ["image", "okBtnLevelClick", "/assets/LevelMenu/okBtnClick.png"],
      ["image", "okBtnLevelHover", "/assets/LevelMenu/okBtnHover.png"],
      // Credits
      ["image", "nano", "/assets/Credits/nano.png"],
      ["image", "lu", "/assets/Credits/lu.png"],
      ["image", "juampi", "/assets/Credits/juampi.png"],
      ["image", "colo", "/assets/Credits/colo.png"],
      ["image", "flor", "/assets/Credits/flor.png"],
      ["image", "nanoHover", "/assets/Credits/nanoHover.png"],
      ["image", "luHover", "/assets/Credits/luHover.png"],
      ["image", "juampiHover", "/assets/Credits/juampiHover.png"],
      ["image", "coloHover", "/assets/Credits/coloHover.png"],
      ["image", "florHover", "/assets/Credits/florHover.png"],
      ["image", "titleCredits", "/assets/Credits/credits.png"],
      ["image", "chiste", "/assets/Credits/image.png"],

    ],
  },
};

// Scene in class
class SceneLoader extends Phaser.Scene {
  background1?: Phaser.GameObjects.Image;
  background2?: Phaser.GameObjects.Image;
  background3?: Phaser.GameObjects.Image;
  background4?: Phaser.GameObjects.Image;
  logo?: Phaser.GameObjects.Image;
  loadingBar?: LoadingBar;
  readyToStart: boolean = false;
  constructor() {
    super({ key: "SceneLoader" });
  }
  preload(this: SceneLoader) {
    window.addEventListener("resize", () => {
      this.scale.resize(window.innerWidth, window.innerHeight);
      this.scale.updateBounds();
    });
    this.scale.resize(window.innerWidth, window.innerHeight);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.cameras.main.width = width;
    this.cameras.main.height = height;
    this.cameras.main.setBackgroundColor(
      Phaser.Display.Color.GetColor(30, 30, 30)
    );

    const scenesTitles: Array<SceneKeys> = ["Loading"];
    for (let i = 0; i < scenesTitles.length; i++) {
      loadAssets[scenesTitles[i]].assets.map((sceneAssetConfig) => {
        const type = sceneAssetConfig[0] as LoadTypes;
        const name = sceneAssetConfig[1] as string;
        const src = sceneAssetConfig[2] as string;
        const config = sceneAssetConfig[3] as any;
        if (config) {
          this.load[type](name, src, config);
        } else {
          this.load[type](name, src);
        }
      });
    }
    this.load.on("progress", function (value: number) {});
    /*Load Fonts*/
    const FontQuickSand = this.add.text(0, 0, ":)", {
      fontFamily: "Quicksand",
    });
  }

  makeTransition(sceneNameStart: string, sceneNameStop: string, data: any) {
    const getBetweenScenesScene = this.game.scene.getScene(
      "BetweenScenes"
    ) as BetweenScenes;
    getBetweenScenesScene.changeSceneTo(sceneNameStart, sceneNameStop, data);
  }

  create(this: SceneLoader) {
    // this.makeTransition("Intro", "SceneLoader", {});
    // this.makeTransition("Intro", "SceneLoader", {});
    // this.makeTransition("LevelMenu", "SceneLoader", {});
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.background1 = this.add
      .image(width / 2, height / 2, "bgInicio1")
      .setOrigin(0.5);
    this.background2 = this.add
      .image(width / 2, height / 2, "bgInicio2")
      .setOrigin(0.5);
    this.background3 = this.add
      .image(width / 2, height / 2, "bgInicio3")
      .setOrigin(0.5);
    this.background4 = this.add
      .image(width / 2, height / 2, "bgInicio4")
      .setOrigin(0.5);
    this.logo = this.add
      .image(width / 2, height / 2, "logoLoading")
      .setOrigin(0.5);
    const text = this.add
      .text(width / 2, height / 2 + 200, "loading", {
        fontFamily: "Quicksand",
        fontSize: 23,
      })
      .setOrigin(0.5);
    this.loadingBar = new LoadingBar(this, width / 2, height / 2, 0);
    this.loadingBar.setPosition(
      width / 2 - this.loadingBar.width / 2,
      height / 2 + 250
    );

    const scenesTitles: Array<SceneKeys> = ["Level1"];
    for (let i = 0; i < scenesTitles.length; i++) {
      const step = loadAssets[scenesTitles[0]].assets.length / 12;
      loadAssets[scenesTitles[i]].assets.map((sceneAssetConfig, index) => {
        const type = sceneAssetConfig[0] as LoadTypes;
        const name = sceneAssetConfig[1] as string;
        const src = sceneAssetConfig[2] as string;
        const config = sceneAssetConfig[3] as any;
        if (config) {
          this.load[type](name, src, config);
        } else {
          this.load[type](name, src);
        }
        this.load.start();
        this.load.on("progress", (value: number) => {
          this.updateProgress(Math.floor(value * 12));
          if (value === 1) this.readyToStart = true;
        });
      });
    }
  }

  updateProgress(progress: number) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (progress) {
      this.loadingBar?.destroy();
      this.loadingBar = new LoadingBar(this, width / 2, height / 2, progress);
      this.loadingBar.setPosition(
        width / 2 - this.loadingBar.width / 2,
        height / 2 + 250
      );
    }
  }

  update(this: SceneLoader) {
    if (this.readyToStart) {
      this.makeTransition("Menu", "SceneLoader", {});
      // this.makeTransition("IsoExperimentalMap", "SceneLoader", {level:3});
      // this.makeTransition("LevelMenu", "SceneLoader", {level:1});
    }
  }
}
export default SceneLoader;
