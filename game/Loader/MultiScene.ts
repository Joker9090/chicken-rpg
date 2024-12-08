import Phaser from "phaser";
import BetweenScenes, { BetweenScenesStatus } from "./BetweenScenes";
import AssetsLoader, { SceneKeys } from "./AssetsLoader";
import map from "../maps/city";
import map2 from "../maps/room";
import RPG from "../rpg";
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
    console.log("ARIEL 2DO ROUND", this.scenekey, this.sceneToStop, this.sceneData)
    this.assetLoaderClass = new AssetsLoader(this, ["BaseLoad"]);
    this.assetLoaderClass.runPreload(() => {
      if (this.scenekey) {
        this.makeTransition(this.scenekey, this.sceneToStop ?? undefined, this.sceneData ?? undefined);
      } else {
        // this.makeTransition("MenuScene", undefined);
        this.makeTransition("TestScene", undefined);
        // this.makeTransition("RPG", undefined, { maps: map2.map((m) => (typeof m === "string" ? m : JSON.stringify(m))) });
        // this.makeTransition("RPG", undefined, { maps: map.map((m) => (typeof m === "string" ? m : JSON.stringify(m))) });
      }
    });
  }
  
  makeTransition(sceneName: string, sceneToStop?: string | undefined, data?: any) {
    const getBetweenScenesScene = this.game.scene.getScene(
      "BetweenScenes"
    ) as BetweenScenes;
    if (getBetweenScenesScene) {
      console.log("ENTRO ACA BETWEEN", sceneName)
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
      console.log("ENTRO ACA ELSE", sceneName)
      switch (sceneName) {
        case "RPG":
            const rpg = new RPG(
              map.map((m: any) => (typeof m === "string" ? m : JSON.stringify(m)))
            );
            this.scene.add("RPG", rpg, true);
            //   this.scene.start(sceneName, data);
            this.time.delayedCall(1000, () => {
              this.scene.remove("MultiScene");
            });
          break;
        case "TestScene":
          this.scene.add("TestScene", new TestScene(), true);
          this.time.delayedCall(1000, () => {
            this.scene.remove("MultiScene");
          });
          break;
      }
     
    }
  }

  update() {
  }
}
