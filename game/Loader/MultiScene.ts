import Phaser from "phaser";
import BetweenScenes, { BetweenScenesStatus } from "./BetweenScenes";
import AssetsLoader, { SceneKeys } from "./AssetsLoader";
import RPG from "../rpg";
import AmbientBackgroundScene from "../ambientAssets/backgroundScene";
import EventsCenter from "../services/EventsCenter";

export default class MultiScene extends Phaser.Scene {

  scenekey?: string;
  assetLoaderClass?: AssetsLoader;
  sceneData?: any;
  sceneToStop?: string;
  eventCenter = EventsCenter.getInstance();


  constructor(scenekey?: string, sceneToStop?: string, sceneData?: any, loadKey?: string) {
    super({ key: "MultiScene", active: true });
    this.scenekey = scenekey;
    this.sceneToStop = sceneToStop;
    this.sceneData = sceneData;

  }

  preload(data: any) {
    this.game.plugins.removeScenePlugin("IsoPlugin");
    this.game.plugins.removeScenePlugin("IsoPhysics");
    this.load.image("loadingBlock1", "/images/bloque2TEST.png");
    this.load.image("loadingBlock2", "/images/bloque.png");
    this.load.image("loadingBlock3", "/images/street-a.png");
    this.load.image("loadingBlock4", "/images/street-c.png");
    this.load.image("loadingBlock5", "/images/buildingTest/test5.png");
    
    
    this.assetLoaderClass = new AssetsLoader(this, ["BaseLoad"]);
    this.assetLoaderClass.runPreload(() => {
      if (this.scenekey) {
        this.makeTransition(this.scenekey, this.sceneToStop ?? undefined, this.sceneData ?? undefined);
      } else {
        // this.makeTransition("MenuScene", undefined);
        this.makeTransition("RPG", undefined, "ROOM");
        //this.makeTransition("RPG", undefined, "CITY");
   
      }
    });
  }
  
  makeTransition(sceneName: string, sceneToStop?: string | undefined, data?: any) {
    this.eventCenter.emit(this.eventCenter.possibleEvents.CHANGE_SCENE);
    const getBetweenScenesScene = this.game.scene.getScene(
      "BetweenScenes"
    ) as BetweenScenes;
    if (getBetweenScenesScene) {
      if (getBetweenScenesScene.status != BetweenScenesStatus.IDLE)
        return false;
      getBetweenScenesScene.scene.bringToTop("BetweenScenes")
      getBetweenScenesScene.changeSceneTo(sceneName, sceneToStop, data);
      this.time.delayedCall(1000, () => {
        this.scene.remove("MultiScene");
      });
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
