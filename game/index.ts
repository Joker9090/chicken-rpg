import RPG from "./rpg";
import map from "./maps/city";
import MultiScene from "./Loader/MultiScene";

export default class Game {
  game?: Phaser.Game;
  config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: 600,
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

  constructor(canvas: HTMLCanvasElement, maps: string[], scenes: (typeof MultiScene | typeof RPG)[]) {
    // const gamelvl1 = new IsoExperimentalMap(maps);
    // const gameBetweenScenes = new BetweenScenesScene();
    // const gameLoader = new SceneLoader();
    // const uiScene = new UIScene();
    // const musicManager = new MusicManager();
    // const menu = new Menu();
    // const credits = new Credits();
    // const levelMenu = new LevelMenu();

    
    // const rpg = new RPG(
    //   map.map((m) => (typeof m === "string" ? m : JSON.stringify(m)))
    // );
    // const rpg = new RPG(map.map((m) => (typeof m === "string" ? m : JSON.stringify(m))))
    // const multiScene = new MultiScene()
    this.config.canvas = canvas;
    // this.config.scene = [gameLoader, gamelvl1, gameBetweenScenes, uiScene, musicManager, menu, credits, levelMenu]
    // this.config.scene = [rpg];
    // this.config.scene = [multiScene, rpg];
    console.log(scenes);
    this.config.scene = scenes;
    console.log(this.config)
  }

  init() {
    const game = new Phaser.Game(this.config);
    // game.scene.start("MultiScene");
    // game.scene.start("RPG");
    this.game = game;
    return game;
  }
}
