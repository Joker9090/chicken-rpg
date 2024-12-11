import Phaser from "phaser";
import RPG from "./rpg";
import { Events } from "matter";
import EventsCenterManager from "./services/EventsCenter";
import { ProductToBuy } from "./Assets/Modals/ModalTypes";
import newsMockData from "./MockData/News.json";
import inventoryMockData from "./MockData/Inventory.json";
import missionsMockData from "./MockData/Missions.json";
import missionRequirementsMockData from "./MockData/Requirements.json";

export type newsType = {
  id: number
  missionId: number[] 
  image: string
  title: string
  description: string
  reward: {
    money: number
    reputation: number
    happines: number
  }
  time: number 
  requirements: number[] 
  readed: boolean
}

export type missionRequirements = {
  id: number
  type: string
  name: string
  description: string
  price: number
  miniImageModal: string
}

export type missionsType = {
  id: number
  title: string
  requirements: number[]
  picture: string
  time: number 
  description: string
  reward: {
    money: number
    reputation: number
    happiness: number
  },
  available: boolean
  done: boolean
}

export type stateTypes = number | boolean | ProductToBuy[] | newsType[] | missionRequirements[] | missionsType[];

export type globalState = {
  playerMoney: number;
  timeOfDay: 0 | 1 | 2 | 3;
  inventary: ProductToBuy[];
  newsToRead: boolean;
  news: newsType[];
  missionRequirements: missionRequirements[];
  allMissions: missionsType[];
  availableMissions: missionsType[];
  doneMissions: missionsType[];
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
      const news = this.state.news.find((news) => news.id === newsId);
      if (news?.missionId && news?.missionId?.length > 0) {
        news.missionId.forEach((missionId) => {
          this.eventCenter.emit(this.eventCenter.possibleEvents.ADD_MISSION, missionId);
        });
      }

    }, this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.MAKE_MISSION, (missionId: number) => {
      const mission = this.state.availableMissions.find((mission) => mission.id === missionId);
      if (mission){
        this.changeMoney(mission.reward.money);
        this.changeState("doneMissions", [...this.state.doneMissions, {...mission, done: true}]);
        const newAvailableMissions = this.state.availableMissions.filter((mission) => mission.id !== missionId);
        this.changeState("availableMissions", newAvailableMissions);
      }
    }, this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.ADD_MISSION, (missionId: number) => {
      const mission = this.state.allMissions.find((mission) => mission.id === missionId);
      if (mission){
        const newAvailableMissions = this.state.availableMissions
        newAvailableMissions.push({...mission, available: true, done: false});
        this.changeState("availableMissions", newAvailableMissions);
      }
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

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.CHECK_MISSION_REQUIREMENTS, (payload: missionRequirements) => {
      return this.checkRequirements(payload);
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
      inventary: inventoryMockData.inventary,
      news: newsMockData.news,
      missionRequirements: missionRequirementsMockData.requirements,
      allMissions: missionsMockData.missions,
      availableMissions: missionsMockData.missions.filter((mission) => mission.available),
      doneMissions: missionsMockData.missions.filter((mission) => mission.done),
    };
  }

  changeState(key: string, value: stateTypes) {
    this.state = { ...this.state, [key]: value }
    this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_STATE);
    console.log(this.state, "NEW STATE IN CHANGE STATE")
  }

  changeMoney(amount: number) {
    this.changeState("playerMoney", this.state.playerMoney + amount);
  }

  checkRequirements(requirements: missionRequirements) {
     switch (requirements.type) {
      case "money":
        return this.state.playerMoney >= requirements.price;
      case "item":
        console.log(this.state.inventary, "INVENTARY")
        console.log(requirements, "REQUIREMENT")
        return this.state.inventary.some((product) => product.title === requirements.name);
      default:
        return false;
     }
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
      const oldState = [...this.state.inventary];
      oldState.push(item);
      this.changeState("inventary", oldState);
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
