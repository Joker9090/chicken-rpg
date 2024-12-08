import Phaser from "phaser";
import BetweenScenes, { BetweenScenesStatus } from "./BetweenScenes";
import AssetsLoader, { SceneKeys } from "./AssetsLoader";
import RPG from "../rpg";
import AmbientBackgroundScene from "../ambientAssets/backgroundScene";
import TestScene from "../TestScene";

export default class MultiScene extends Phaser.Scene {

  scenekey?: string;
  assetLoaderClass?: AssetsLoader;
  sceneData?: any;
  sceneToStop?: string;

  constructor(scenekey?: string, sceneToStop?: string, sceneData?: any, loadKey?: string) {
    super({ key: "MultiScene", active: true });
    this.scenekey = scenekey;
    this.sceneToStop = sceneToStop;
    this.sceneData = sceneData;
  }

  preload(data: any) {
    this.game.plugins.removeScenePlugin("IsoPlugin");
    this.game.plugins.removeScenePlugin("IsoPhysics");
    this.assetLoaderClass = new AssetsLoader(this, ["BaseLoad"]);
    this.assetLoaderClass.runPreload(() => {
      if (this.scenekey) {
        this.makeTransition(this.scenekey, this.sceneToStop ?? undefined, this.sceneData ?? undefined);
      } else {
        // this.makeTransition("MenuScene", undefined);
         this.makeTransition("RPG", undefined, "ROOM");
        // this.makeTransition("TestScene", undefined);

        // this.makeTransition("RPG", undefined, "CITY");
   
      }
    });
  }
  
  makeTransition(sceneName: string, sceneToStop?: string | undefined, data?: any) {
    const getBetweenScenesScene = this.game.scene.getScene(
      "BetweenScenes"
    ) as BetweenScenes;
    if (getBetweenScenesScene) {
      if (getBetweenScenesScene.status != BetweenScenesStatus.IDLE)
        return false;

      switch (sceneName) {
        case "TestScene":
          this.scene.add("TestScene", new TestScene(), true);
          this.time.delayedCall(1000, () => {
            this.scene.remove("MultiScene");
          });
          break;
        default:
          getBetweenScenesScene.changeSceneTo(sceneName, sceneToStop, data);
          this.time.delayedCall(1000, () => {
            this.scene.remove("MultiScene");
          });
        break;
      }
    } else {
      const rpg = new RPG("ROOM");
      this.scene.add("RPG", rpg, true);
      this.time.delayedCall(1000, () => {
        this.scene.remove("MultiScene");
      });
    }
  }

  update() {
  }
}
