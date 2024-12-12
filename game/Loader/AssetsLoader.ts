import { start } from "repl";
import MultiScene from "./MultiScene";
import PreLoadScene from "./PreLoadScene";

export type SceneKeys =
  | "BaseLoad"

export type LoadTypes = "image" | "spritesheet" | "audio" | "svg" | "assetWithCallback";

const loadAssets = {

  BaseLoad: {
    assets: [
      // player
      ["spritesheet", "player", "/images/chicken/spritesheetPlayer2.png", { frameWidth: 200, frameHeight: 250, startFrame: 0 }],
      ["spritesheet", "playerIdle", "/images/chicken/playerIdle.png", { frameWidth: 200, frameHeight: 250, startFrame: 0 }],
      
      // between scenes
      ["image", "block", "/50x50.png"],

      // menu
      ["image", "backgroundCity", "/images/menuScene/backgroundCity.png"],

      // NEWS
      //["image", "newsImageTest", "/assets/news/modalNews.png"],
      
      // TABLET
      ["image", "fondoTablet", "/tabletScene/fondoTablet.png"],
      ["image", "fondoTabletOp2", "/tabletScene/fondoTabletOp2.png"],
      ["image", "tabletStatLeft", "/tabletScene/tabletStatLeft.png"],
      ["image", "tabletRightDown", "/tabletScene/tabletRightDown.png"],
      ["image", "tabletRightUp", "/tabletScene/tabletRightUp.png"],

      ["image", "tabletIcon", "/tabletScene/tabletIcon.png"],
      ["image", "tabletSettings", "/tabletScene/tabletSettings.png"],
      ["image", "tabletStats", "/tabletScene/tabletStats.png"],
      ["image", "tabletStats2", "/tabletScene/tabletStats2.png"],
      ["image", "tabletNotReady", "/tabletScene/tabletNotReady.png"],
      ["image", "tabletBack", "/tabletScene/tabletBack.png"],
      ["image", "btnCheck", "/tabletScene/btnCheck.png"],
      ["image", "btnCruz", "/tabletScene/btnCruz.png"],

      // room
      ["image", "room1", "/assets/room/room1.png"],
      ["image", "room2", "/assets/room/room2.png"],
      ["image", "HabitacionFinalMai", "/assets/room/HabitacionFinalMai.png"],
      ["image", "pcGlow", "/assets/room/CompuGlow.png"],
      ["image", "cama", "/assets/room/cama.png"],
      ["image", "puertaGlow", "/assets/room/PuertaGlow.png"],
      ["image", "camera", "/assets/room/camera.png"],
      ["image", "bicicle", "/assets/room/bicicle.png"],
      ["image", "degree", "/assets/room/degree.png"],
      ["image", "newspaper", "/assets/room/newspaper.png"],
      ["image", "newspaperGlow", "/assets/room/newspaperGlow.png"],

      // backgroundScenes ambient
      ["image", "statsBar", "/images/UIChicken/statsBar.png"],
      ["image", "clockDay", "/images/UIChicken/clockDay.png"],
      ["image", "backgroundSky", "/images/menuScene/skyBack.png"],
      ["image", "backgroundMenu", "/images/menuScene/backgroundMenu.png"],
      ["image", "day", "/ambient/day.png"],
      ["image", "night", "/ambient/night.png"],
      ["image", "stars", "/ambient/stars.png"],
      ["image", "snowFlake", "/ambient/snowFlake.png"],

      // UI
 
      ["image", "goBack", "/images/UIChicken/goBack.png"],
      ["image", "goRoom", "/images/UIChicken/goRoom.png"],
      ["image", "playButton", "/images/menuScene/playButton.png"],
      ["image", "leftMenuItem", "/images/menuScene/leftMenuItem.png"],
      ["image", "rightMenuItem", "/images/menuScene/rightMenuItem.png"],
      ["image", "coinUi", "/assets/UI/UiChiken/coinUi.png"],

      ["image", "dayBlock1", "/UI/dayBlocks/dayBlock1.png"],
      ["image", "dayBlock1Active", "/UI/dayBlocks/dayBlock1Active.png"],
      ["image", "dayBlock2", "/UI/dayBlocks/dayBlock2.png"],
      ["image", "dayBlock2Active", "/UI/dayBlocks/dayBlock2Active.png"],
      ["image", "dayBlock3", "/UI/dayBlocks/dayBlock3.png"],
      ["image", "dayBlock3Active", "/UI/dayBlocks/dayBlock3Active.png"],
      ["image", "dayBlock4", "/UI/dayBlocks/dayBlock4.png"],
      ["image", "dayBlock4Active", "/UI/dayBlocks/dayBlock4Active.png"],
      ["image", "lineDayBlocks", "/UI/dayBlocks/lineDayBlocks.png"],
      ["image", "flecha", "/UI/dayBlocks/flecha.png"],

      ["image", "avatar1", "/UI/avatar/avatar1.png"],
      ["image", "avatar2", "/UI/avatar/avatar2.png"],
      ["image", "avatarGlow", "/UI/avatar/avatarGlow.png"],
      ["image", "avatarStats", "/UI/avatar/avatarStats.png"],
      ["image", "avatarBackground", "/UI/avatar/avatarBackground.png"],




      // tiles  
      ["image", "tile", "/images/bloque.png"],
      ["image", "cube1", "/images/cube1.png"],
      ["image", "street-a", "/images/street-a.png"],
      ["image", "street-b", "/images/street-b.png"],
      ["image", "street-c", "/images/street-c.png"],
      ["image", "side-walk", "/images/side-walk.png"],
      ["image", "grassTEST", "/images/bloque1TEST.png"],
      ["image", "buildingTEST", "/images/building1TEST.png"],
      ["image", "blockBuilding", "/images/bloque3TEST.png"],
      ["image", "blockBuilding-b", "/images/bloque4TEST.png"],
      ["image", "blockBuildingBase", "/images/bloque2TEST.png"],
      ["image", "blockBuildingEmpty", "/images/bloque5TEST.png"],

      // items
      ["image", "traffic-light-a", "/images/traffic-light-a.png"],
      ["image", "traffic-light-b", "/images/traffic-light-b.png"],
      ["image", "tree", "/images/chicken/tree.png"],
      ["image", "pin", "/images/pin.png"],

      // modal
      ["image", "imageModalPhoto", "/assets/modalAssets/imageModalPhoto.png"],
      //["image", "modalNews", "/assets/modalAssets/modalNews.png"],
      ["image", "fotoCamara", "/assets/modalAssets/fotoCamara.png"],
      ["image", "modalBackground", "/assets/modalAssets/modal.png"],
      ["image", "desafioTest1", "/assets/modalAssets/maskImg2.png"],
      ["image", "desafioTest2", "/assets/modalAssets/maskImg3.png"],
      ["image", "barraTitle", "/assets/modalAssets/barraTittle.png"],
      ["image", "btnExit", "/assets/modalAssets/btnExit.png"],
      ["image", "barritaOff", "/assets/modalAssets/barritaOff.png"],
      ["image", "barritaOn", "/assets/modalAssets/barritaOn.png"],
      ["image", "btn", "/assets/modalAssets/btn.png"],
      ["image", "iconClock", "/assets/modalAssets/iconClock.png"],
      ["image", "iconMoon", "/assets/modalAssets/iconMoon.png"],
      ["image", "iconSun", "/assets/modalAssets/iconSun.png"],
      ["image", "iconSunrise", "/assets/modalAssets/iconSunrise.png"],
      ["image", "iconSunset", "/assets/modalAssets/iconSunset.png"],
      ["image", "coin", "/assets/modalAssets/coin.png"],
      ["image", "camaraGrey", "/assets/modalAssets/masUi/camaraGrey.png"],
      ["image", "camaraWhite", "/assets/modalAssets/masUi/camaraWhite.png"],
      ["image", "iconBici1", "/assets/modalAssets/iconBici1.png"],
      ["image", "iconCertif1", "/assets/modalAssets/iconCertif1.png"],
      ["image", "iconDona1", "/assets/modalAssets/iconDona1.png"],
      ["image", "iconMochila1", "/assets/modalAssets/iconMochila1.png"],

      ["image", "camaraGreen", "/assets/modalAssets/masUi/camaraGreen.png"],
      ["image", "camaraShop", "/assets/modalAssets/camaraShop.png"],
      ["image", "camaraShopOn", "/assets/modalAssets/camaraShopOn.png"],
      ["image", "certificadoOn", "/assets/modalAssets/certificadoOn.png"],
      ["image", "certificadoOff", "/assets/modalAssets/certificadoOff.png"],
      ["image", "bicicletaOn", "/assets/modalAssets/bicicletaOn.png"],
      ["image", "bicicletaOff", "/assets/modalAssets/bicicletaOff.png"],
      ["image", "bagOn", "/assets/modalAssets/bagOn.png"],
      ["image", "bagOff", "/assets/modalAssets/bagOff.png"],
      ["image", "coinModalIcon", "/assets/modalAssets/coinModalIcon.png"],
      ["image", "reputationModalIcon", "/assets/modalAssets/reputationModalIcon.png"],
      ["image", "happinessModalIcon", "/assets/modalAssets/happinessModalIcon.png"],
      
      ["image", "diarioBackground", "/assets/modalAssets/diarioBackground.png"],
      ["image", "imageDiarioGeneric", "/assets/modalAssets/imageDiarioGeneric.png"],
      ["image", "bordeImgDiario", "/assets/modalAssets/bordeImgDiario.png"],
      
  
      //Buildings
      ["image", "test1", "/images/buildingTest/test1.png"],
      ["image", "test2", "/images/buildingTest/test2.png"],
      ["image", "test3", "/images/buildingTest/test3.png"],
      ["image", "test4", "/images/buildingTest/test4.png"],
      ["image", "test5", "/images/buildingTest/test5.png"],
      ["image", "test1B", "/images/buildingTest/probando1.png"],
      ["image", "test2B", "/images/buildingTest/probando2.png"],
      ["image", "test3B", "/images/buildingTest/probando3.png"],
      ["image", "test4B", "/images/buildingTest/probando4.png"],
      ["image", "test5B", "/images/buildingTest/probando5.png"],
      ["image", "buildingDoorLeftCorner", "/images/buildingTest/buildingDoorLeftCorner.png"],
      ["image", "buildingDoorRightCorner", "/images/buildingTest/buildingDoorRightCorner.png"],
      ["image", "doorLeftSide", "/images/buildingTest/doorLeftSide.png"],
      ["image", "doorRightSide", "/images/buildingTest/doorRightSide.png"],
      ["image", "solidBlock", "/images/buildingTest/solidBlock.png"],
      ["image", "window1", "/images/buildingTest/window1.png"],
      ["image", "window2", "/images/buildingTest/window2.png"],
      ["image", "window3", "/images/buildingTest/window3.png"],
      ["image", "windowB1", "/images/buildingTest/windowB1.png"],
      ["image", "windowB2", "/images/buildingTest/windowB2.png"],
      ["image", "windowB3", "/images/buildingTest/windowB3.png"],

      // deprecated? 
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

  

  buildLoadingEffect(){
    const assetsToUse = [
      "loadingBlock1",
      "loadingBlock2",
      "loadingBlock3",
      "loadingBlock4",
      "loadingBlock5",
    ]
  
    const interval = setInterval(() => {
      
      let exist = true

      assetsToUse.map((asset) => {
        if(!this.scene.textures.exists(asset)){
          exist = false
        }
        return asset
      })

      if(exist){
        clearInterval(interval)
        logic()
      }
    },10)

    const logic = () => {
      const width = window.innerWidth; //this.scene.cameras.main.width // TODO REVISAR 
      const height = window.innerHeight; //this.scene.cameras.main.height // TODO REVISAR 
      const blockSize = 56
      const middlePoint = {
        x: width/2 - blockSize*3,
        y: height/2 - blockSize*3
      }

      // draw random blocks to appear from the bottom like fish jumping from the water
      const drawJump = () => {

        const random = Phaser.Math.Between(3, 8)
        const randomDelay =  () => Phaser.Math.Between(100, 500)
        
        const array = new Array(random).fill(0).map(_ => randomDelay())
        // position of the biggest number in the array

        const max = Math.max(...array)
        const index = array.indexOf(max)


        
        
        for (let i = 0; i < random; i++) {
          const randomX = Phaser.Math.Between(-80,80);
          const randomY = Phaser.Math.Between(-80, 80);
          const randomAngle = Phaser.Math.Between(-100, 100);
          const randomAsset = Phaser.Math.Between(0, assetsToUse.length - 1)
          const block = this.scene.add.image((width - 150) + randomX, height + 150, assetsToUse[randomAsset]).setDisplaySize(blockSize, blockSize)
          // block.alpha = 0
          const delay = randomDelay()
          block.setScale(0.5)
          this.scene.tweens.add({
            targets: block,
            // scale: 1,
            duration: 1000,
            delay: delay,
            ease: "Back.easeInOut",
            yoyo: true,
            y: "-="+(300 + randomY),
            onComplete: () => {
              block.destroy()
              if(i === index){
                drawJump()
              }
            }
          })
          this.scene.tweens.add({
            targets: block,
            // scale: 1,
            duration: 1000,
            delay: delay,
            ease: "linear",
            angle: randomAngle,
          })
        }
      }

      drawJump();

    }
  }
  runPreload(callback?: Function) {
    if (!this.finished) {

      this.buildLoadingEffect()
     
      var width = this.scene.cameras.main.width;
      var height = this.scene.cameras.main.height;
      var loadingText = this.scene.make.text({
        x: 100,
        y: height - 50,
        text: "Cargando...",
        style: {
          fontStyle: "bold",
          font: "20px monospace",
          color: "#ffffff",
        },
      });
      var progressBar = this.scene.add.graphics().setDepth(1001);
      var progressBox = this.scene.add.graphics().setDepth(1000);
      progressBox.fillStyle(0x222222, 0.8);
      progressBox.fillRect(0, height - 30, width, 50);
      loadingText.setOrigin(0.5, 0.5);

      var percentText = this.scene.make.text({
        x: 186,
        y: height - 50,
        text: "0%",
        style: {
          fontStyle: "bold",
          font: "20px monospace",
          color: "#ffffff",
        },
      });

      percentText.setOrigin(0.5, 0.5);

      // var assetText = this.scene.make.text({
      //   x: width / 2,
      //   y: height / 2 + 50,
      //   text: "",
      //   style: {
      //     font: "18px monospace",
      //     color: "#ff0000",
      //   },
      // });

      // assetText.setOrigin(0.5, 0.5);

      this.scene.load.on("progress", function (value: number) {
        percentText.setText(Math.floor(Number(value * 100)) + "%");
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(
          0,
          height - 30,
          width * value,
          30
        );
      });

      // this.scene.load.on("fileprogress", function (file: any) {
      //   assetText.setText("Loading asset: " + file.key);
      // });

      this.scene.load.once("complete", function (this: AssetsLoader) {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        // assetText.destroy();
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
        fontFamily: "MontserratSemiBold",
      });
      const ArcadeFont2 = this.scene.add.text(0, 0, " .", {
        fontFamily: "MontserratBold",
      });
    }
  }
}

export default AssetsLoader;
