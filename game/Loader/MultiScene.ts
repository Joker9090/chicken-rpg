import Phaser from "phaser";
import BetweenScenes, { BetweenScenesStatus } from "./BetweenScenes";
import AssetsLoader, { SceneKeys } from "./AssetsLoader";
import map from "../maps/city";

export default class MultiScene extends Phaser.Scene {

  scenekey?: string;
  assetLoaderClass?: AssetsLoader;
  sceneData?: any;
  sceneToStop?: Phaser.Scene

  constructor(sceneToStop: Phaser.Scene, scenekey?: string, sceneData?: any, loadKey?: string) {
    super({ key: "MultiScene", active: true });
    console.log("HOLA")
    this.scenekey = scenekey;
    this.sceneData = sceneData;
    this.sceneToStop = sceneToStop;
    
  }


  preload() {
      this.assetLoaderClass = new AssetsLoader(this, ["BaseLoad"]);
      // const RPGScene = this.game.scene.getScene("RPG");
      // if (!RPGScene) {
      //   import("../rpg").then((module) => {
      //     this.scene.add("RPG", module.default);
      //   });
      //   // this.scene.add("RPG", RPG);
      // }
      this.assetLoaderClass.runPreload(() => {
        if(this.scenekey) {
          this.makeTransition(this.scenekey, this.sceneData ?? undefined);
        } else {
          console.log("ENTRO ACA 2")
          this.makeTransition("MenuScene", undefined);
          // this.makeTransition("RPG", { maps: map.map((m) => (typeof m === "string" ? m : JSON.stringify(m))) });
        }
      });
  }

  create(){
    const activeScenes = this.game.scene.getScenes(true);

    console.log("TEST", this.game)
  }

  makeTransition(sceneName: string, data: any) {
    const getBetweenScenesScene = this.game.scene.getScene(
      "BetweenScenes"
    ) as BetweenScenes;
    if (getBetweenScenesScene) {
      console.log("ENTRO ACA 111111")
      if (getBetweenScenesScene.status != BetweenScenesStatus.IDLE)
        return false;
      getBetweenScenesScene.changeSceneTo(sceneName, data);
      this.time.delayedCall(1000, () => {
        this.sceneToStop?.scene.stop()
        this.scene.stop();
      });
    } else {
      console.log("ENTRO ACA 1111112222222")
      this.scene.start(sceneName, data);
      this.time.delayedCall(1000, () => {
        this.scene.stop();
      });
    }
  }

  update() {
  }
}
