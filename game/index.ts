import MultiScene from "./Loader/MultiScene";
import BetweenScenes from "./Loader/BetweenScenes";
import GlobalDataManager from "./GlobalDataManager";
import { NONE } from "phaser";
import TestScene from "./TestScene";

export default class Game {
  game?: Phaser.Game;
  config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
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
    const globalData = new GlobalDataManager();
    const multiScene = new MultiScene()
    const gameBetweenScenes = new BetweenScenes();
    this.config.canvas = canvas;
    this.config.scene = [multiScene, gameBetweenScenes, globalData];
  }

  init() {
    const game = new Phaser.Game(this.config);
    game.scene.start("MultiScene");
    this.game = game;
    return game;
  }
}
