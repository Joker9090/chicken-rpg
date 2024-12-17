import BackgroundMenu from "./backgroundMenu";
import TweenSky from "./TweenSky";


export default class AmbientBackgroundScene extends Phaser.Scene{
    container?: Phaser.GameObjects.Container;
    middlePoint: {
        x: number;
        y: number
    } 
    sceneKey: string;
    
    constructor(sceneKey: string) {
        super({ key: "AmbientBackgroundScene" });
        this.middlePoint = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        }
        this.sceneKey = sceneKey;

    }

    create(data: { sceneKey: string }) {
        if (Object.keys(data).length !== 0) this.sceneKey = data.sceneKey;
        switch(this.sceneKey){
            case "MenuScene":
                this.container = new BackgroundMenu(this, this.middlePoint.x, this.middlePoint.y, this.middlePoint.x*2, this.middlePoint.y*2);
                break;
            case "DayAndNight":
                this.container = new TweenSky(this, this.middlePoint.x, this.middlePoint.y, this.middlePoint.x*2, this.middlePoint.y*2);
                break;
        }
        
        
    // SKY
    // const skyCam = this.cameras.add(0, 0, window.innerWidth, window.innerHeight);
    // this.cameras.cameras = [skyCam, this.cameras.main];

    // this.sky4 = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x1f3558).setAlpha(0).setOrigin(0)
    // this.sky1 = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0xaefbff).setAlpha(0).setOrigin(0)
    // this.sky2 = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x4ddbff).setAlpha(0).setOrigin(0)
    // this.sky3 = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0xffd194).setAlpha(0).setOrigin(0)
    // const skies = [this.sky1, this.sky2, this.sky3, this.sky4]

    // this.cameras.main.ignore([this.sky1, this.sky2, this.sky3, this.sky4])



    // makeDayCycle(0, makeDayCycle)
    // SKY 
    }

    
  // makeDayCycle = (index: number, callback: Function) => {
  //   if (this.sky1 && this.sky2 && this.sky3 && this.sky4) {
  //     const DayDuration = 2000
  //     const skies = [this.sky1, this.sky2, this.sky3, this.sky4]
  //     if (index === 3) {
  //       this.tweens.add({
  //         targets: skies[index],
  //         alpha: 0,
  //         duration: DayDuration / 4,
  //         onComplete: () => {
  //           skies[index].setAlpha(0)
  //         }
  //       })
  //       this.tweens.add({
  //         targets: skies[0],
  //         alpha: 1,
  //         duration: DayDuration / 4,
  //         onComplete: () => {
  //           skies[0].setAlpha(1)
  //           callback(0, callback)
  //         }
  //       })
  //     } else {
  //       this.tweens.add({
  //         targets: skies[index],
  //         alpha: 0,
  //         duration: DayDuration / 4,
  //         onComplete: () => {
  //           skies[index].setAlpha(0)
  //         }
  //       })
  //       this.tweens.add({
  //         targets: skies[index + 1],
  //         alpha: 1,
  //         duration: DayDuration / 4,
  //         onComplete: () => {
  //           skies[index + 1].setAlpha(1)
  //           callback(index + 1, callback)
  //         }
  //       })
  //     }
  //   }
  // }
}