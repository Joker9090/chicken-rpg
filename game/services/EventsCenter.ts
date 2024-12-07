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
                READY: "ready",
                INFO_UPDATE: "infoUpdate",
                CHANGE_DATE: "changeDate",
                OPEN_MODAL: "openModal",
                CLOSE_MODAL: "closeModal",
                MISSIONS_UPDATE: "missionsUpdate",
                TOGGLE_SOUND: "toggleSound",
                TOGGLE_MUSIC: "toggleMusic",
                TOGGLE_BTN_SOUND: "toggleBtnSound",
                TOGGLE_BTN_MUSIC: "toggleBtnMusic",
                FINAL_TILE_TOGGLE: "finalTileToggle",
                BUY_ITEM: "buyItem",
                BUY_ITEMS: "buyItems",
                GET_INVENTARY: "getInventary",
                GET_STATE: "getState",
                GET_OBJECTINVENTARY: "getObjectInventary",
                CHANGE_MONEY: "changeMoney",
                TIME_CHANGE: "timeChange",
                UPDATE_STATE: "updateState",
                UPDATE: "update",
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