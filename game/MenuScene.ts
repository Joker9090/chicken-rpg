import Phaser from "phaser";
import MultiScene from "./Loader/MultiScene";
import roomMap from "./maps/room";
import cityMap from "./maps/city";
import { possibleEvents, turnEventOn } from "./EventsCenter";


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

    turnEventOn(this.scene.key, possibleEvents.READY, this.addPlayBtn, this)


    const middlePoint = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }
    this.container = this.add.container(middlePoint.x, middlePoint.y)
    // create a simple menu
    this.backgroundSky = this.add.image(0, 0, "backgroundMenu").setScale(1)
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
          const multiScene = new MultiScene("RPG", "MenuScene", { maps: roomMap.map((m) => (typeof m === "string" ? m : JSON.stringify(m))) });
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
