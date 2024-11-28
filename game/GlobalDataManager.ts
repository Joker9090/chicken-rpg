import Phaser from "phaser";
import MultiScene from "./Loader/MultiScene";
import RPG from "./rpg";


export default class GlobalDataManager extends Phaser.Scene {

  state: {
    playerMoney: number;
    timeOfDay: 0 | 1 | 2 | 3;
    newNews: boolean;
  }
  dayState: 'IDLE' | 'RUNNING' = 'IDLE'
  constructor() {
    super({ key: "GlobalDataManager", active: true });

    this.state = {
      playerMoney: 300,
      timeOfDay: 0,
      newNews: false,
  }
}

  newNews(state: boolean) {
    this.state.newNews = state;
  }

  changeMoney(amount: number) { 
    this.state.playerMoney += amount;
  }

  passTime(amount: number) {
    if (this.dayState === 'RUNNING') return
    else {
      this.dayState = 'RUNNING'
      const gameScene = this.game.scene.getScene("RPG") as RPG
      gameScene.UICont?.clock.passTime(amount)
      gameScene.makeDayCycle(this.state.timeOfDay, ()=>{
        this.dayState = 'IDLE'
      })
      this.state.timeOfDay += amount
      if (this.state.timeOfDay > 3) this.state.timeOfDay = 0
    }
  }

  getState(){
    return this.state
  }

  create() {
    const timer0 = this.time.addEvent({
      delay: 10000, // ms
      callback: () => {
          this.newNews(true)
      },
      //args: [],
      callbackScope: this,
  });
  }

  update() {
  }
}
