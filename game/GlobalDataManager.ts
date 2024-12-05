import Phaser from "phaser";
import RPG from "./rpg";
import { Events } from "matter";
import EventsCenterManager from "./services/EventsCenter";
import { ProductToBuy } from "./Assets/ModalContainer";
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
    inventary: ProductToBuy[];
  };
  dayState: "IDLE" | "RUNNING" = "IDLE";
  eventCenter = EventsCenterManager.getInstance();
  constructor() {
    super({ key: "GlobalDataManager", active: true });

    //Events  -->

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.BUY_ITEM, (payload: ProductToBuy) => {
      this.addInventary(payload);
      this.changeMoney(-payload.reward);
    },this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.BUY_ITEMS, (payload: ProductToBuy[]) => {
      let moneyLess = 0;
      payload.forEach((item) => {
        this.addInventary(item);
        moneyLess += item.reward;
        
      });
      this.changeMoney(-moneyLess);
    },this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.GET_INVENTARY, () => {
      return this.getInventary();
    },this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.GET_STATE, () => {
      return this.getState();
    },this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.GET_OBJECTINVENTARY, (payload: string) => {
      return this.getObjectInventary(payload);
    },this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.CHANGE_MONEY, (payload: number) => {
      this.changeMoney(payload);
    },this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.TIME_CHANGE, (payload: number) => {
      this.passTime(payload);
    },this);

    // <--- Events
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

  addInventary(item: ProductToBuy) {
    if(this.state.inventary.some(product => product.title === item.title)) {
      return;
    }else {
      this.state.inventary.push(item);
    }
  }

  getObjectInventary(title: string) {
    return this.state.inventary.find((product) => product.title === title);
  }

  public getState() {
    return this.state;
  }

  public getInventary() {
    return this.state.inventary;
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
