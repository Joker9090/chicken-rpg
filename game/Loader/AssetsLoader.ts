import MultiScene from "./MultiScene";
import PreLoadScene from "./PreLoadScene";

export type SceneKeys =
  | "BaseLoad"

export type LoadTypes = "image" | "spritesheet" | "audio" | "svg" | "assetWithCallback";

const loadAssets = {

  BaseLoad: {
    assets: [
      ["image", "block", "/50x50.png"],
      ["image", "backgroundCity", "/images/menuScene/back.png"],
      ["image", "backgroundSky", "/images/menuScene/skyBack.png"],
      ["image", "playButton", "/images/menuScene/playButton.png"],
      ["image", "reloj", "/assets/UI/UILevel/reloj.png"],
      ["image", "tile", "/images/bloque.png"],
      ["image", "pin", "/images/pin.png"],
      ["image", "cube1", "/images/cube1.png"],
      ["image", "street-a", "/images/street-a.png"],
      ["image", "street-b", "/images/street-b.png"],
      ["image", "street-c", "/images/street-c.png"],
      ["image", "grassTEST", "/images/bloque1TEST.png"],
      ["image", "buildingTEST", "/images/building1TEST.png"],
      ["image", "blockBuilding", "/images/bloque3TEST.png"],
      ["image", "blockBuilding-b", "/images/bloque4TEST.png"],
      ["image", "blockBuildingBase", "/images/bloque2TEST.png"],
      ["image", "blockBuildingEmpty", "/images/bloque5TEST.png"],
      ["image", "tree", "/images/chicken/tree.png"],
      ["image", "traffic-light-a", "/images/traffic-light-a.png"],
      ["image", "traffic-light-b", "/images/traffic-light-b.png"],
      // ["svg", "chicken", "/images/chicken/spritesheetChicken.svg",
      //   {
      //     frameWidth: 138,
      //     frameHeight: 96,
      //     startFrame: 0,
      //   }],
      ["assetWithCallback", (scene: Phaser.Scene) => {
        for (let index = 0; index < 6; index++) {
          scene.load.spritesheet(
            `bloque-${index}`,
            "/images/chicken/piedraAbajo.png",
            {
              frameWidth: 100,
              frameHeight: 100,
              startFrame: index,
            }
          );
        }
      }],
      ["assetWithCallback", (scene: Phaser.Scene) => {
        for (let index = 0; index < 6; index++) {
          scene.load.spritesheet(
            `semibloque-${index}`,
            "/images/chicken/piedraAbajo.png",
            {
              frameWidth: 100,
              frameHeight: 100,
              startFrame: index + 6,
            }
          );
        }
      }],
      ["assetWithCallback", (scene: Phaser.Scene) => {
        for (let index = 0; index < 6; index++) {
          scene.load.spritesheet(
            `columna-${index}`,
            "/images/chicken/piedraAbajo.png",
            {
              frameWidth: 100,
              frameHeight: 100,
              startFrame: index + 18,
            }
          );
        }
      }],
    ]
  },
};

class AssetsLoader {
  scene: MultiScene | PreLoadScene;
  finished: boolean = false;
  loadKey: SceneKeys[] = ["BaseLoad"];
  constructor(scene: MultiScene | PreLoadScene, loadKey: SceneKeys[] = ["BaseLoad"]) {
    this.scene = scene;
    this.loadKey = loadKey;
  }

  runPreload(callback?: Function) {
    if (!this.finished) {
      var width = this.scene.cameras.main.width;
      var height = this.scene.cameras.main.height;
      var loadingText = this.scene.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: "Loading...",
        style: {
          font: "20px monospace",
          color: "#ff0000",
        },
      });
      var progressBar = this.scene.add.graphics();
      var progressBox = this.scene.add.graphics();
      progressBox.fillStyle(0x222222, 0.8);
      progressBox.fillRect(width / 2 - 160, height / 2 + 100, 320, 50);
      loadingText.setOrigin(0.5, 0.5);

      var percentText = this.scene.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: "0%",
        style: {
          font: "18px monospace",
          color: "#ff0000",
        },
      });

      percentText.setOrigin(0.5, 0.5);

      var assetText = this.scene.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: "",
        style: {
          font: "18px monospace",
          color: "#ff0000",
        },
      });

      assetText.setOrigin(0.5, 0.5);

      this.scene.load.on("progress", function (value: number) {
        percentText.setText(Math.floor(Number(value * 100)) + "%");
        progressBar.clear();
        progressBar.fillStyle(0xff0000, 1);
        progressBar.fillRect(
          width / 2 - 160,
          height / 2 + 100,
          300 * value,
          30
        );
      });

      this.scene.load.on("fileprogress", function (file: any) {
        assetText.setText("Loading asset: " + file.key);
      });

      this.scene.load.once("complete", function (this: AssetsLoader) {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
        this.finished = true;
        if (callback) callback()
      });

      const scenesTitles: Array<SceneKeys> = this.loadKey
      for (let i = 0; i < scenesTitles.length; i++) {
        loadAssets[scenesTitles[i]].assets.map((sceneAssetConfig) => {
          const type = sceneAssetConfig[0] as LoadTypes;
          if (type !== "assetWithCallback") {
          const name = sceneAssetConfig[1] as string;
          const src = sceneAssetConfig[2] as string;
          const config = sceneAssetConfig[3] as any;
          if (config) {
            this.scene.load[type](name, src, config);
          } else {
            this.scene.load[type](name, src);
          }
        } else {
          const callback = sceneAssetConfig[1] as Function;
          callback(this.scene);
        }
        });
      }
      const ArcadeFont = this.scene.add.text(0, 0, " .", {
        fontFamily: "Arcade",
      });
    }
  }
}

export default AssetsLoader;
