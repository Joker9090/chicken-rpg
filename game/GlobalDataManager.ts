import Phaser from "phaser";
import RPG from "./rpg";
import { Events } from "matter";
import EventsCenterManager from "./services/EventsCenter";
import { ProductToBuy } from "./Assets/Modals/ModalTypes";
import newsMockData from "./MockData/News.json";

export type newsType = {
  id: number;
  image: string;
  title: string;
  description: string;
  reward: {
    money: number;
    reputation: number;
    happines: number
  };
  time: number | null;
  requirements: string[] | null;
  readed: boolean;
}

export type newsRequirementsType = {
  id: number,
  name: string,
  description: string,
  price: number
}

export type stateTypes = number | boolean | ProductToBuy[] | newsType[] | newsRequirementsType[];

export type globalState = {
  playerMoney: number;
  timeOfDay: 0 | 1 | 2 | 3;
  inventary: ProductToBuy[];
  newsToRead: boolean;
  news: newsType[];
  newsRequirements: newsRequirementsType[];
}

export default class GlobalDataManager extends Phaser.Scene {
  private state: globalState;
  dayState: "IDLE" | "RUNNING" = "IDLE";
  eventCenter = EventsCenterManager.getInstance();
  constructor() {
    super({ key: "GlobalDataManager", active: true });

    //Events  -->
    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.BUY_ITEM, (payload: ProductToBuy) => {
      this.addInventary(payload);
      this.changeMoney(-payload.reward);
    }, this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.READ_NEWSPAPER, (newsId: number) => {
      const newNews = this.state.news.map((news) => {
        if (news.id === newsId) {
          news.readed = true;
        }
        return news;
      });
      this.changeState("news", newNews);
      this.changeState("news", newNews);

    }, this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.BUY_ITEMS, (payload: ProductToBuy[]) => {
      let moneyLess = 0;
      payload.forEach((item) => {
        this.addInventary(item);
        moneyLess += item.reward;
      });
      this.changeMoney(-moneyLess);
    }, this);

    // this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.UPDATE, ()=>this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_STATE) ,this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.GET_INVENTARY, () => {
      return this.getInventary();
    }, this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.UPDATE_STATE, () => {
      return this.getState();
    }, this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.GET_STATE, () => {
      return this.getState();
    }, this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.GET_OBJECTINVENTARY, (payload: string) => {
      return this.getObjectInventary(payload);
    }, this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.CHANGE_MONEY, (payload: number) => {
      this.changeMoney(payload);
    }, this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.TIME_CHANGE, (payload: number) => {
      this.passTime(payload);
    }, this);

    // <--- Events
    // axios

    this.state = {
      playerMoney: 300,
      timeOfDay: 0,
      newsToRead: false,
      inventary: [
        {
          title: "Bicicle",
          picture: "cama",
          pictureOn: "cama",
          text: "Cama",
          reward: 0,
          isSelected: false,
          roomInformation: {
            assetInRoom: "bicicle",
            frontContainer: true,
          },
        },
        {
          title: "Cama",
          picture: "cama",
          pictureOn: "cama",
          text: "Cama",
          reward: 0,
          isSelected: false,
          roomInformation: {
            assetInRoom: "camera",
            frontContainer: false,
          },
        },
        {
          title: "Cama",
          picture: "cama",
          pictureOn: "cama",
          text: "Cama",
          reward: 0,
          isSelected: false,
          roomInformation: {
            assetInRoom: "degree",
            frontContainer: false,
          },
        },
      ],
      news: newsMockData.news,
      newsRequirements: newsMockData.requirements,
      // missionsActive: any[]
      // items: any[]
      // news: any[{}]
    };
  }

  // getRandomMissions(){
  //   missions.random()
  // }

  changeState(key: string, value: stateTypes) {
    this.state = { ...this.state, [key]: value }
    this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_STATE);
  }

  changeMoney(amount: number) {
    this.changeState("playerMoney", this.state.playerMoney + amount);
    // this.state.playerMoney += amount;
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
    if (this.state.inventary.some(product => product.title === item.title)) {
      return;
    } else {
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
    this.state.newsToRead = true;

  }

  update() { }
}
