import RPG from "./rpg";
import map from "./maps/city";
import MultiScene from "./Loader/MultiScene";

export default class Game {
  game?: Phaser.Game;
  config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: '100%',
    height: '100%',
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

  constructor(canvas: HTMLCanvasElement, maps: string[], scenes: (typeof MultiScene | typeof RPG)[]) {
    this.config.canvas = canvas;
    console.log(scenes);
    this.config.scene = scenes;
    console.log(this.config)
  }

  init() {
    const game = new Phaser.Game(this.config);
    this.game = game;
    return game;
  }
}
