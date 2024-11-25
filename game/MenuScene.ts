import Phaser from "phaser";
import MultiScene from "./Loader/MultiScene";
import map from "./maps/city";

export default class MenuScene extends Phaser.Scene {
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


    const middlePoint = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }
    this.container = this.add.container(middlePoint.x, middlePoint.y)
    // create a simple menu
    this.backgroundSky = this.add.image(0, 0, "backgroundSky").setScale(1.5)
    this.backgroundCity = this.add.image(-200, 50, "backgroundCity")
    this.tweens.add({
      targets: this.backgroundCity,
      y: '+=40',
      duration: 8000,
      ease: 'ease',
      yoyo: true,
      loop: -1
    })

    this.playButton = this.add.image(400, -200, "playButton")
    .setScale(0.30)
    .setInteractive()
      .on('pointerdown', () => {
        const multiScene = new MultiScene("RPG", "MenuScene", { maps: map.map((m) => (typeof m === "string" ? m : JSON.stringify(m))) });
        this.scene.add("MultiScene", multiScene, true); 
      });

      this.tweens.add({
        targets: this.playButton,
        scale: '+=0.05',
        duration: 1000,
        ease: 'ease',
        yoyo: true,
        loop: -1,
      })

    const title = this.add.text(0, -middlePoint.y + 200, "NOMBRE DEL JUEGO", { 
      color: "#000000",
      fontSize: 55,
      fontFamily: "Arcade",
    }).setOrigin(0.5, 0.5)
    title.setPosition(0, -middlePoint.y + title.height)
    this.container.add([
      this.backgroundSky, 
      this.backgroundCity, 
      this.playButton, 
      title
    ])

  } 

  update() {
  }
}
