import Phaser from "phaser";

//const EventsCenter = new Phaser.Events.EventEmitter();

export type activeEvents = {
    [key: string]: [string, Function][]
};


export interface globalType {
    eventsCenterInstance?: EventsCenterManager,
  }

class EventsCenterManager extends Phaser.Events.EventEmitter {
    activeEvents: activeEvents;
    possibleEvents:{ [key: string]: string};
    constructor() {
        if ((global as globalType).eventsCenterInstance) {
            throw new Error('New instance cannot be created!!')
        } else {
            super();   
            this.activeEvents = {};

            this.possibleEvents = {
                READY: "ready", // WHEN THE GAME IS READY AND USER DATA HAS BEEN LOADED
                CHANGE_SCENE: "changeScene", // WHEN THE GAME IS READY AND USER DATA HAS BEEN LOADED

                INFO_UPDATE: "infoUpdate", // EVERY TIME THE INFO IS UPDATED IN GLOBAL DATA MANAGER
                UPDATE: "update",
                UPDATE_STATE: "updateState",

                LEAVE_ROOM: "leaveRoom",
                LEAVE_CITY: "leaveCity",


                CHANGE_DATE: "changeDate", // PASS OF TIME
                TIME_CHANGE: "timeChange",
                SLEEP: "sleep", // SLEEP

                OPEN_MODAL: "openModal", // OPEN MODAL
                CLOSE_MODAL: "closeModal", // CLOSE MODAL

                OPEN_TABLET_MENU: "openTabletMenu", // OPEN TABLET MENU
                CLOSE_TABLET_MENU: "closeTabletMenu", // CLOSE TABLET MENU

                GET_NEWS: "getNews", // GET NEWS
                RESTART_NEWS: "getNews", // GET NEWS
                READ_NEWSPAPER: "readNewspaper", // READ NEWSPAPER AND CHANGE AVAILABLE MISSIONS IN CITY
                MISSIONS_UPDATE: "missionsUpdate", // COMPLETES A MISSION = REWARD + TIME PASS

                MAKE_MISSION: "makeMission", // MAKE A MISSION
                INPROGRESS_MISSION: "inprogressMission", // INPROGRESS A MISSION
                START_MINIGAME: "startMinigame", // INPROGRESS A MISSION
                DRAW_MINIGAME: "drawMinigame", // INPROGRESS A MISSION
                ADD_MISSION: "addMission", // ADD A MISSION
                CHECK_MISSION_REQUIREMENTS: "checkMissionRequirements", // CHECK MISSION REQUIREMENTS TO MAKE IT

                TOGGLE_SOUND: "toggleSound",
                TOGGLE_MUSIC: "toggleMusic",
                TOGGLE_BTN_SOUND: "toggleBtnSound",
                TOGGLE_BTN_MUSIC: "toggleBtnMusic",
                FINAL_TILE_TOGGLE: "finalTileToggle",

                BUY_ITEM: "buyItem",
                BUY_ITEMS: "buyItems",
                GET_INVENTARY: "getInventary",
                GET_OBJECTINVENTARY: "getObjectInventary",

                GET_STATE: "getState",
                CHANGE_MONEY: "changeMoney",
            }

        }
        (global as globalType).eventsCenterInstance = this
    }
    
    getInstance(): this {
        return this
    }

    turnEventOn (sceneKey:string, event: string, callback: Function, context: any) {
        this.activeEvents[sceneKey as keyof activeEvents] = this.activeEvents[sceneKey as keyof activeEvents] || []
        this.activeEvents[sceneKey as keyof activeEvents].push([event, callback])
        this.on(event, callback, context);
    }

    turnEventOff (sceneKey:string, event: string, context: any) {
        this.activeEvents[sceneKey as keyof activeEvents] = this.activeEvents[sceneKey as keyof activeEvents] || []
        this.activeEvents[sceneKey as keyof activeEvents] = this.activeEvents[sceneKey as keyof activeEvents].filter(([e, cb]) => {
            if (e === event) {
                this.off(e, cb, context);
                return false
            }
            return true
        })
    }

    emitEvent (event: string, data: any) {
        this.emit(event, data);
    }

    emitWithResponse(event: string, data: any): any {
        const listeners = this.listeners(event);
        if (listeners.length === 0) return undefined;
        if (listeners.length > 1) {
            console.warn(`Event "${event}" has multiple listeners; only the first response will be used.`);
        }
    
        return listeners[0](data);
    }

    turnOffAllEventsByScene (sceneKey: string)  {
        this.activeEvents[sceneKey as keyof activeEvents] = this.activeEvents[sceneKey as keyof activeEvents] || []
        this.activeEvents[sceneKey as keyof activeEvents].forEach(([event, callback]) => {
            this.off(event, callback);
        })
    }
}

let EventsCenterSingleton;
if (!(global as globalType).eventsCenterInstance) EventsCenterSingleton = new EventsCenterManager()
else EventsCenterSingleton = (global as globalType).eventsCenterInstance
export default EventsCenterSingleton as EventsCenterManager

//export default EventsCenter;