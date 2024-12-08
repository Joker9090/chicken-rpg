import Phaser from "phaser";
import MultiScene from "./Loader/MultiScene";
import roomMap from "./maps/Room";
import cityMap from "./maps/City";
import EventsCenterManager from "./services/EventsCenter";
import AmbientBackgroundScene from "./ambientAssets/backgroundScene";



export default class MenuScene extends Phaser.Scene {
  leftMenuItem?: Phaser.GameObjects.Image;
  rightMenuItem?: Phaser.GameObjects.Image;
  backgroundCity?: Phaser.GameObjects.Image;
  backgroundSky?: Phaser.GameObjects.Image;
  playButton?: Phaser.GameObjects.Image;
  container?: Phaser.GameObjects.Container;
  constructor() {
    const sceneConfig = { key: "MenuScene" };
    super(sceneConfig);
  }

  preload() {
  }

  create(data: {maps: string[]}) {
    
    let AmbientScene = this.game.scene.getScene("AmbientBackgroundScene")
    if (!AmbientScene) {
      AmbientScene = new AmbientBackgroundScene("MenuScene")
      this.scene.add("AmbientBackgroundScene", AmbientScene, true);
      AmbientScene.scene.sendToBack("AmbientBackgroundScene");
    } else {
      AmbientScene.scene.restart({sceneKey: "MenuScene"})
    }
    // const AmbientScene = new AmbientBackgroundScene("MenuScene")
    // this.ambientScenes.push(AmbientScene);
    // this.scene.add("AmbientBackgroundScene", AmbientScene, true);
    // AmbientScene.scene.sendToBack("AmbientBackgroundScene");
    
    const eventsCenter = EventsCenterManager.getInstance();

    eventsCenter.turnEventOn(this.scene.key, eventsCenter.possibleEvents.READY, this.addPlayBtn, this)


    const middlePoint = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }
    this.container = this.add.container(middlePoint.x, middlePoint.y)
    // create a simple menu
    this.backgroundSky = this.add.image(0, 0, "backgroundMenu").setScale(1).setAlpha(0)
    this.backgroundCity = this.add.image(-50, 100, "backgroundCity").setScale(0.8)
    this.tweens.add({
      targets: this.backgroundCity,
      y: '+=40',
      duration: 28000,
      ease: 'ease',
      yoyo: true,
      loop: -1
    })

    this.leftMenuItem = this.add.image(-window.innerWidth/2, -window.innerHeight/2, "leftMenuItem").setScale(1).setOrigin(0).setScale(0.8)
    this.tweens.add({
      targets: this.leftMenuItem,
      y: '-=150',
      x: '-=150',
      duration: 66666,
      ease: 'ease',
      yoyo: true,
      loop: -1
    })
    this.rightMenuItem = this.add.image(window.innerWidth/2, window.innerHeight/2, "rightMenuItem").setScale(1).setOrigin(1).setScale(0.8)
    this.tweens.add({
      targets: this.rightMenuItem,
      y: '+=150',
      x: '+=150',
      duration: 65555,
      ease: 'ease',
      yoyo: true,
      loop: -1
    })


    
    this.container.add([
      this.backgroundSky, 
      this.leftMenuItem, 
      this.rightMenuItem, 
      this.backgroundCity, 
    ])
    
  } 

  addPlayBtn() {
    if(this.container) {
      this.playButton = this.add.image(0, 0, "playButton")
      .setScale(0)
      .setInteractive()
        .on('pointerdown', () => {
          const multiScene = new MultiScene("RPG", "MenuScene", "ROOM");
          this.scene.add("MultiScene", multiScene, true); 
        });
  
        this.tweens.add({
          targets: this.playButton,
          scale: 1.5,
          duration: 1000,
          delay: 2000,
          ease: 'bounce',
          onComplete: () => {
            this.tweens.add({
              targets: this.playButton,
              scale: 1.45,
              duration: 1000,
              ease: 'bounce',
              yoyo: true,
              loop: -1
            })
          }
        })
  
      this.container.add([
        this.playButton, 
      ])
    }
  }

  update() {
  }
}
