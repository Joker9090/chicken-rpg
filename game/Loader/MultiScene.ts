import Phaser from "phaser";
import BetweenScenes, { BetweenScenesStatus } from "./BetweenScenes";
import AssetsLoader, { SceneKeys } from "./AssetsLoader";
import map from "../maps/city";

export default class MultiScene extends Phaser.Scene {

  scenekey?: string;
  assetLoaderClass?: AssetsLoader;
  sceneData?: any;

  constructor(scenekey?: string, sceneData?: any, loadKey?: string) {
    super({ key: "MultiScene", active: true });
    console.log("HOLA")
    this.scenekey = scenekey;
    this.sceneData = sceneData;
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
          this.makeTransition("RPG", { maps: map.map((m) => (typeof m === "string" ? m : JSON.stringify(m))) });
        }
      });
  }

  makeTransition(sceneName: string, data: any) {
    const getBetweenScenesScene = this.game.scene.getScene(
      "BetweenScenes"
    ) as BetweenScenes;
    console.log("BETWEEN SCENES", getBetweenScenesScene)
    if (getBetweenScenesScene) {
      if (getBetweenScenesScene.status != BetweenScenesStatus.IDLE)
        return false;
      getBetweenScenesScene.changeSceneTo(sceneName, data);
      this.time.delayedCall(1000, () => {
        this.scene.stop();
      });
    } else {
      this.scene.start(sceneName, data);
      this.time.delayedCall(1000, () => {
        this.scene.stop();
      });
    }
  }

  update() {
  }
}
