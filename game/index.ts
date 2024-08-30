import BetweenScenesScene from "./BetweenScenes";
import Credits from "./Credits";
import Intro from "./Intro";
import Menu from "./Menu";
import SceneLoader from "./SceneLoader";
import UIScene from "./UIScene";
import MusicManager from "./MusicManagger";
import IsoSandboxScene from "./sandboxScene";
import IsoExperimentalMap from "./scene";
import LevelMenu from "./LevelMenu";
import RPG from "./rpg";

export default class Game {
  game?: Phaser.Game;
  config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 400 },
        debug: true,
        debugShowBody: true,
        debugShowStaticBody: true,
        debugShowVelocity: true,
        debugVelocityColor: 0xffff00,
        debugBodyColor: 0x0000ff,
        debugStaticBodyColor: 0xffffff,
      },
    },
  };

  constructor(canvas: HTMLCanvasElement, maps: string[]) {
    // const gamelvl1 = new IsoExperimentalMap(maps);
    // const gameBetweenScenes = new BetweenScenesScene();
    // const gameLoader = new SceneLoader();
    // const uiScene = new UIScene();
    // const musicManager = new MusicManager();
    // const menu = new Menu();
    // const credits = new Credits();
    // const levelMenu = new LevelMenu();

    const map = [
      {
        nivel: "uno",
        player: "pepito",
        musica: "bkg-uno.mp3",
        ballTexture: "123",
        gravity: 9.8,
        tiles: {
          "1": "GRASS",
          "3": "BLOQUE-1",
          "4": "BLOQUERANDOM",
          "5": "COLUMNALARGA",
          "6": "COLUMNACORTA",
          "7": "SEMIBLOQUE",
          "8": "TREE",
          PN: "PLAYER-N",
          PS: "PLAYER-S",
          PE: "PLAYER-E",
          PW: "PLAYER-W",
        },
      },
      // MAP PLAYER / ITEMS CONFIG
      [
          "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" +
          "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" +
          "0 0 0 0 0 0 0 0 0 0 0 0 PN 0 0 0\n" +
          "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" +
          "0 0 0 0 0 0 0 0 0 0 0 0 0 PW 0 0\n" +
          "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" +
          "0 0 0 0 0 0 0 0 0 0 0 0 PE 0 0 0\n" +
          "0 0 0 PS 0 0 0 0 0 0 0 0 0 0 0 0",
      ],
      // BASE
        "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1\n" +
        "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1\n" +
        "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1\n" +
        "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1\n" +
        "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1\n" +
        "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1\n" +
        "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1\n" +
        "1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1",
      // ONE
      "8 8 8 0 0 0 0 0 0 0 0 0 0 0 0 0\n" +
        "8 8 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 8 4 4 4 4 4 4 4 5 0 0 0 0 0 0\n" +
        "0 8 4 0 0 4 0 0 0 0 0 0 0 0 0 0\n" +
        "8 8 4 0 0 4 4 4 4 5 0 0 0 0 0 0\n" +
        "0 8 4 0 0 4 8 8 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 8 0 0 0 0 0 0 8 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
      // TWO
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 4 4 4 4 4 4 0 5 0 0 0 0 0 0\n" +
        "0 0 4 4 4 4 4 4 0 0 0 0 0 0 0 0\n" +
        "0 0 4 4 4 4 4 4 0 5 0 0 0 0 0 0\n" +
        "0 0 4 4 4 4 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
      // THREE
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 4 4 4 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 4 4 4 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0\n" +
        "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
    ];

    const map2 = [
      {
        nivel: "uno",
        player: "pepito",
        musica: "bkg-uno.mp1",
        ballTexture: "123",
        gravity: 9.8,
        tiles: {
          "1": "A",
          "3": "B",
          "4": "C",
          "5": "W",
          "6": "E",
          "7": "F",
          "8": "G",
        },
      },
      "0 0 0 P 0 0 0 0 0 2",
      "5 5 5 5\n5 5 5 5\n5 5 5 5\n5 5 5 5\n5 5 5 5\n5 5 5 5",
      "5 5 5 5\n5 0 0 5\n5 0 0 5\n5 0 0 5\n5 0 0 5\n5 5 5 5",
      "5 5 5 5\n5 0 0 5\n5 0 0 5\n5 0 0 5\n5 0 0 5\n5 5 5 5",
    ];
    const rpg = new RPG(
      map.map((m) => (typeof m === "string" ? m : JSON.stringify(m)))
    );
    this.config.canvas = canvas;
    // this.config.scene = [gameLoader, gamelvl1, gameBetweenScenes, uiScene, musicManager, menu, credits, levelMenu]
    this.config.scene = [rpg];
  }

  init() {
    const game = new Phaser.Game(this.config);
    game.scene.start("RPG");
    this.game = game;
    return game;
  }
}
