import Phaser from "phaser";
import MultiScene from "./Loader/MultiScene";


export default class ManagerScene extends Phaser.Scene {

  scenekey?: string;
  sceneData?: any;
  sceneToStop?: string;
  loadKey?: string;

  constructor(scenekey?: string, sceneToStop?: string, sceneData?: any, loadKey?: string) {
    super({ key: "MultiScene", active: true });
    this.scenekey = scenekey;
    this.sceneToStop = sceneToStop;
    this.sceneData = sceneData;
    this.loadKey = loadKey
  }


  create(data: {
    scenekey?: string, sceneToStop?: string, sceneData?: any, loadKey?: string
  }) {
    const newMultiScene = new MultiScene("MenuScene", this.sceneToStop, this.sceneData, this.loadKey)
    this.scene.add("MultiScene", newMultiScene, true);
  }

  update() {
  }
}
