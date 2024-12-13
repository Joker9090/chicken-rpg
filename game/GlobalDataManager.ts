import Phaser from "phaser";
import RPG from "./rpg";
import { Events } from "matter";
import EventsCenterManager from "./services/EventsCenter";
import { happinessType, Inventory, missionRequirements, missionsType, newsType, ProductToBuy, transactionsType } from "./Assets/Modals/ModalTypes";
import newsMockData from "./MockData/News.json";
import inventoryMockData from "./MockData/Inventory.json";
import missionsMockData from "./MockData/Missions.json";
import missionRequirementsMockData from "./MockData/Requirements.json";
import tabletMockData from "./MockData/Tablet.json";

export type stateTypes = number | boolean | ProductToBuy[] | newsType[] | missionRequirements[] | missionsType[] | Inventory[] | happinessType | transactionsType[];


export type globalState = {
  playerMoney: number;
  reputation: number;
  happiness: happinessType;

  timeOfDay: 1 | 2 | 3 | 4;
  hoursPassed: number;
  sleepping: boolean;

  inventary: Inventory[];
  transactions: transactionsType[];

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

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.BUY_ITEMS, (payload: ProductToBuy[]) => {
      let moneyLess = 0;
      payload.forEach((item) => {
        this.addInventary(item);
        moneyLess += item.reward;
      });
      this.changeMoney(-moneyLess);
    }, this);
  
    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.READ_NEWSPAPER, (newsId: number) => {
      const newNews = this.state.news.map((news) => {
        if (news.id === newsId) {
          news.readed = true;
        }
        return news;
      });
      this.changeState(["news"], [newNews]);
      const news = this.state.news.find((news) => news.id === newsId);
      if (news?.missionId && news?.missionId?.length > 0) {
        news.missionId.forEach((missionId) => {
          this.eventCenter.emit(this.eventCenter.possibleEvents.ADD_MISSION, missionId);
        });
      }
    }, this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.MAKE_MISSION, (missionId: number) => {
      const mission = this.state.availableMissions.find((mission) => mission.id === missionId);
      if (mission) {
        const keysToBeChanged = ["playerMoney", "doneMissions", "availableMissions", "reputation", "happiness"];
        const newMoney = this.state.playerMoney + mission.reward.money;
        const newDoneMissions = [...this.state.doneMissions, { ...mission, done: true }];
        const newAvailableMissions = this.state.availableMissions.filter((mission) => mission.id !== missionId);
        const newReputation = this.state.reputation + mission.reward.reputation;
        const newHappiness = {
          actualValue: this.state.happiness.actualValue + mission.reward.happiness,
          maxValue: this.state.happiness.maxValue
        }
        const valuesToBeChanged = [
          newMoney,
          newDoneMissions,
          newAvailableMissions,
          newReputation,
          newHappiness
        ];
        this.changeState(keysToBeChanged, valuesToBeChanged);
        if (mission.time > 0){
          this.time.delayedCall(400, ()=>{
            this.eventCenter.emit(this.eventCenter.possibleEvents.TIME_CHANGE, mission.time);
          })
        }
      }
    }, this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.ADD_MISSION, (missionId: number) => {
      const mission = this.state.allMissions.find((mission) => mission.id === missionId);
      if (mission) {
        const newAvailableMissions = this.state.availableMissions
        newAvailableMissions.push({ ...mission, available: true, done: false });
        this.changeState(["availableMissions"], [newAvailableMissions]);
      }
    }, this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.LEAVE_ROOM, ()=>{

    } ,this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.LEAVE_CITY, ()=>{

    } ,this);

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.RESTART_NEWS, ()=>{
      const newNews = this.state.news.map((news) => {
        news.readed = false;
        return news;
      });
      this.changeState(["news"], [newNews]);
    } ,this);

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

    this.eventCenter.turnEventOn("GlobalDataManager", this.eventCenter.possibleEvents.SLEEP, () => {
      this.changeState(["timeOfDay", "hoursPassed", "sleeping"], [4, 4 - this.state.timeOfDay, true]);
      this.time.delayedCall(1200, () => {
        this.sleep();
      })
    }, this);

    // <--- Events

    this.state = {
      playerMoney: 300,
      reputation: 10,
      happiness: tabletMockData.happiness,

      timeOfDay: 1,
      hoursPassed: 0,
      sleepping: false,

      inventary: inventoryMockData.inventary,
      transactions: tabletMockData.transactionsHistorial,

      newsToRead: false,
      news: newsMockData.news,

      missionRequirements: missionRequirementsMockData.requirements,
      allMissions: missionsMockData.missions,
      availableMissions: missionsMockData.missions.filter((mission) => mission.available),
      doneMissions: missionsMockData.missions.filter((mission) => mission.done),
    };
  }

  changeState(keys: string[], values: stateTypes[]) {
    keys.forEach((key, index) => {
      this.state = { ...this.state, [key]: values[index] }
    });
    // this.state = { ...this.state, [key]: value }
    this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_STATE);
  }

  changeMoney(amount: number) {
    this.changeState(["playerMoney"], [this.state.playerMoney + amount]);
  }

  checkRequirements(requirements: missionRequirements) {
    switch (requirements.type) {
      case "money":
        return this.state.playerMoney >= requirements.price;
      case "item":
        return this.state.inventary.some((product) => product.title === requirements.name);
      default:
        return false;
    }
  }

  sleep() {
    this.changeState(["timeOfDay", "hoursPassed", "sleepping"], [1, 0, false]);
  }

  passTime(amount: number) {
      let newTimeOfDay = this.state.timeOfDay + amount;
      if (newTimeOfDay > 4) newTimeOfDay = 1;
      this.changeState(["hoursPassed", "timeOfDay"], [amount, newTimeOfDay ]);
  }

  addInventary(item: ProductToBuy) {
    if (this.state.inventary.some(product => product.id === item.id)) {
      return;
    } else {
      const oldState = [...this.state.inventary];
      const newItem = {
        id: item.id,
        title: item.title,
        image: item.picture,
        description: item.text,
        price: item.reward,
        roomInformation: item.roomInformation
      }
      oldState.push(newItem);
      this.changeState(["inventary"], [oldState]);
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
