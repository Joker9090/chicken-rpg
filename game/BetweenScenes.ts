import Phaser, { Scene } from "phaser";
import IsoExperimentalMap from "./scene";
import axios from "axios";
import { LevelDataType } from "./types";
import UIScene from "./UIScene";
import GlobalDataSingleton from "./services/GlobalData";
import EventsCenter from "./EventsCenter";

export enum BetweenScenesStatus {
  IDLE,
  PROCCESSING,
  WAITING,
}

export default class BetweenScenesScene extends Phaser.Scene {
  status: BetweenScenesStatus;
  blocks?: Phaser.GameObjects.Group;
  newSceneName?: string;
  newSceneWith?: LevelDataType;
  firstRender: boolean = true;
  startTime: number = 0;
  sceneNameStop?: string;
  constructor() {
    super({ key: "BetweenScenes" });
    this.status = BetweenScenesStatus.IDLE;
  }

  changeSceneTo(
    sceneNameStart: string,
    sceneNameStop: string,
    data?: LevelDataType
  ) {
    this.sceneNameStop = sceneNameStop;
    if (this.status == BetweenScenesStatus.IDLE) {
      this.newSceneName = sceneNameStart;
      if (data) this.newSceneWith = data;
      this.status = BetweenScenesStatus.PROCCESSING;
      this.scene.launch(this);
      this.scene.bringToTop("BetweenScenes");
    }
  }

  loadNewScene() {
    if (this.status == BetweenScenesStatus.PROCCESSING) {
      if (this.sceneNameStop) {
        const sceneToStop = this.getSceneByName(this.sceneNameStop);
        const startScene = () => {
          const sceneToStopUi = this.getSceneByName("UIScene") as UIScene;
          sceneToStopUi.destroy();
          sceneToStopUi.scene.stop();
          if (
            this.newSceneName === "IsoExperimentalMap" &&
            this.sceneNameStop
          ) {
            const sceneToStopIso = this.getSceneByName("IsoExperimentalMap");
            this.removeScene(sceneToStopIso, () => {
              const axiosInstance = axios.create({
                baseURL: "/",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              const levelId = this.newSceneWith?.level
                ? this.newSceneWith?.level
                : 1;
              axiosInstance.get(`/api/${levelId}`).then((res) => {
                const map = res.data.maps;
                let sceneCreatedConfig = new IsoExperimentalMap(map);
                const sceneToPlay = this.scene.add(
                  "IsoExperimentalMap",
                  sceneCreatedConfig
                );
                if (sceneToPlay) {
                  this.scene.moveBelow(this, sceneToPlay);
                  this.scene.launch(sceneToPlay).bringToTop();
                }
                this.turnOff();
              });
            });
          } else if (this.newSceneName) {
            GlobalDataSingleton.resetGlobal();
            this.scene.launch(this.newSceneName).bringToTop();
            this.turnOff();
          }
        };
        if (this.sceneNameStop === "IsoExperimentalMap") {
          startScene();
        } else {
          this.stopScene(sceneToStop, startScene);
        }
      } else {
      }
    }
  }

  finishLogic() {
    this.newSceneName = undefined;
    this.newSceneWith = undefined;
    this.sceneNameStop = undefined;
    this.firstRender = true;
    this.status = BetweenScenesStatus.IDLE;
    this.scene.stop();
  }

  getSceneByName(sceneKey: string) {
    return this.scene.get(sceneKey);
  }

  removeScene(scene: Scene, callBack: Function) {
    // if (scene.destroy) scene.destroy();
    scene.events.once(
      "destroy",
      () => {
        callBack();
      },
      this
    );
    scene.scene.remove();
  }

  stopScene(scene: Scene, callBack: Function) {
    scene.scene.stop();
    callBack();
  }

  addScene(keyName: string, url: string, callBack: Function) {
    import(url).then((mainScene) => {
      const scene = this.scene.add(keyName, mainScene.default, true);
      callBack(scene);
    });
  }

  turnOff() {
    const self = this;
    let i = 0;
    let ii = 0;
    //@ts-ignore
    this.blocks.children.iterate((c) => {
      const child = c as Phaser.GameObjects.GameObject;
      this.tweens.add({
        targets: child,
        scale: 0,
        angle: 180,
        ease: "Power2",
        duration: 1000,
        delay: i * 50,
        repeat: 0,
        yoyo: false,
        hold: 200,
        //  onCompleteParams: self,
        onComplete: ii == 107 ? self.finishLogic.bind(self) : () => {},
      });
      i++;
      ii++;
      if (i % 12 === 0) {
        i = 0;
      }
    });
  }

  turnOn() {
    const self = this;
    let i = 0;
    let ii = 0;
    //@ts-ignore
    this.blocks.children.iterate((c) => {
      const child = c as Phaser.GameObjects.GameObject;
      const { width, height } = this.cameras.main;
      const scale = Math.max(width / 20, height / 15);
      this.tweens.add({
        targets: child,
        scale: scale,
        angle: 180,
        ease: "Power2",
        duration: 1000,
        delay: i * 50,
        repeat: 0,
        yoyo: false,
        hold: 200,
        onComplete: ii == 107 ? self.loadNewScene.bind(self) : () => {},
      });
      i++;
      ii++;

      if (i % 12 === 0) {
        i = 0;
      }
    });
  }

  create() {
    this.firstRender = true;
    this.blocks = this.add.group({
      key: "block",
      repeat: 107,
      setScale: { x: 0, y: 0 },
    });
    const { width, height } = this.cameras.main;
    Phaser.Actions.GridAlign(this.blocks.getChildren(), {
      width: 12,
      height: 9,
      cellWidth: width / 12,
      cellHeight: height / 9,
      x: 0,
      y: 0,
    });
  }

  update(time: number) {
    if (this.startTime == 0) {
      this.startTime = time;
    }
    if (this.firstRender && time - this.startTime > 980) {
      this.firstRender = false;
      this.turnOn();
    }
  }
}
