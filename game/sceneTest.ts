import { GameObjects, Physics, Scene } from "phaser";
//@ts-ignore
import IsoPlugin, { IsoPhysics } from "phaser3-plugin-isometric";
import MapManager from "@/game/mapManager";
import MovVelocity from "./movement/MovVelocity";
import MovForce from "./movement/MovForce";
import MovTile from "./movement/MovTile";
import { Player } from "./Assets/Player";
import { IsoSpriteBox } from "./Assets/IsoSpriteBox";
import BetweenScenes, { BetweenScenesStatus } from "./BetweenScenes";

export type IsoSceneType = {
  isoPhysics: any;
};



export type SceneWithIsoType = Scene & IsoSceneType;

export default class SceneTest extends Scene {
  maps: string[];
  mapsBuilded: any[] = [];
  isoPhysics: any;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  isoGroup: any;
  input: any;
  player: any;
  actualMapPos: any;
  MovVelocity?: MovVelocity;
  MovForce?: MovForce;
  MovTile?: MovTile;
  btnTime: number = 0;
  matriz: any[][] = [];
  background?: GameObjects.Image;
  starsBackground?: GameObjects.Image;

  constructor(maps: string[]) {
    const sceneConfig = {
      key: "2",
      mapAdd: { isoPlugin: "iso", isoPhysics: "isoPhysics" },
    };
    super(sceneConfig);
    this.maps = maps;
  }

  preload() {
    this.load.scenePlugin({
      key: "IsoPlugin",
      url: IsoPlugin,
      sceneKey: "iso",
    });

    this.load.scenePlugin({
      key: "IsoPhysics",
      url: IsoPhysics,
      sceneKey: "isoPhysics",
    });
  }


  create() {
    this.starsBackground = this.add.image(-500, -1000, "stars");
    this.background = this.add.image(-500, -1000, "backgroundSpace");
    this.isoPhysics.world.setBounds(-1024, -1024, 1024 * 2, 1024 * 2);
    this.isoPhysics.world.gravity.setTo(0, 0, -500);
    this.isoPhysics.projector.origin.setTo(0.5, 0.3);
    this.scale.resize(window.innerWidth, window.innerHeight);
    this.cursors = this.input.keyboard.createCursorKeys();
    setTimeout(() => {
      const getBetweenScenesScene = this.game.scene.getScene(
        "BetweenScenes"
      ) as BetweenScenes;
      this.lose()
    },10000)
  }


  makeTransition(sceneName: string, data: any) {
    const getBetweenScenesScene = this.game.scene.getScene(
      "BetweenScenes"
    ) as BetweenScenes;
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

  lose() {
    this.makeTransition("SceneLoader", {});
  }

  update() {
  }

}