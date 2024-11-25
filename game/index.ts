import RPG from "./rpg";
//import map from "./maps/city";
import map from "./maps/room";
import MultiScene from "./Loader/MultiScene";
import BetweenScenes from "./Loader/BetweenScenes";

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
    // const gamelvl1 = new IsoExperimentalMap(maps);
    // const gameLoader = new SceneLoader();
    // const uiScene = new UIScene();
    // const musicManager = new MusicManager();
    // const menu = new Menu();
    // const credits = new Credits();
    // const levelMenu = new LevelMenu();
    const multiScene = new MultiScene()
    const gameBetweenScenes = new BetweenScenes();
    
    // const rpg = new RPG(
    //   map.map((m) => (typeof m === "string" ? m : JSON.stringify(m)))
    // );
    this.config.canvas = canvas;
    // this.config.scene = [gameLoader, gamelvl1, gameBetweenScenes, uiScene, musicManager, menu, credits, levelMenu]
    this.config.scene = [multiScene, gameBetweenScenes];
  }

  init() {
    const game = new Phaser.Game(this.config);
    game.scene.start("MultiScene");
    this.game = game;
    return game;
  }
}
