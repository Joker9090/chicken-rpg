import Phaser from "phaser";
import RPG from "./rpg";
import { Events } from "matter";
import EventsCenterManager from "./services/EventsCenter";
/*import {
  turnEventOn,
  possibleEvents,
  turnEventOff,
  emitEvent,
} from "./services/EventsCenter"; */
// import missions from "./missions";

export default class GlobalDataManager extends Phaser.Scene {
  private state: {
    playerMoney: number;
    timeOfDay: 0 | 1 | 2 | 3;
    newNews: boolean;
    inventary: string[];
  };
  dayState: "IDLE" | "RUNNING" = "IDLE";
  //@ts-ignore
  eventCenter: EventsCenterManager;
  constructor() {
    super({ key: "GlobalDataManager", active: true });
    this.eventCenter = EventsCenterManager.getInstance();
    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.BUY_ITEM, (payload: string) => {
      console.log("nano pre paco: ", this.state.inventary);
      console.log("Nano destructor",payload);
      this.addInventary(payload);
      console.log("nano deja el paco: ", this.state.inventary);
    },this);
    // axios

    this.state = {
      playerMoney: 300,
      timeOfDay: 0,
      newNews: false,
      inventary: [],
      // missionsActive: any[]
      // items: any[]
      // news: any[{}]
    };
  }
  
  // getRandomMissions(){
  //   missions.random()
  // }

  newNews(state: boolean) {
    this.state.newNews = state;
  }

  changeMoney(amount: number) {
    this.state.playerMoney += amount;
  }

  passTime(amount: number) {
    if (this.dayState === "RUNNING") return;
    else {
      this.dayState = "RUNNING";
      const gameScene = this.game.scene.getScene("RPG") as RPG;
      // gameScene.UICont?.clock.passTime(amount);
      // gameScene.makeDayCycle(this.state.timeOfDay, () => {
      //   this.dayState = "IDLE";
      // });
      this.state.timeOfDay += amount;
      if (this.state.timeOfDay > 3) this.state.timeOfDay = 0;
    }
  }

  addInventary(item: string) {
    console.log("Item a agregar: ", item);
    if(this.state.inventary.includes(item)) {
      console.log("1");
      return;
    }else {
      console.log("2");
      this.state.inventary.push(item);
    }
  }

  public getState() {
    return this.state;
  }

  create() {
    const eventCenter = EventsCenterManager.getInstance();

    const timer0 = this.time.addEvent({
      delay: 10000, // ms
      callback: () => {
        eventCenter.emitEvent(eventCenter.possibleEvents.READY, null);
        this.newNews(true);
      },
      //args: [],
      callbackScope: this,
    });
  }

  update() {}
}
