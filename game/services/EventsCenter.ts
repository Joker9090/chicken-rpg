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
                SHOW_MODAL: "showModal",
                HIDE_MODAL: "hideModal",
                MISSIONS_UPDATE: "missionsUpdate",
                TOGGLE_SOUND: "toggleSound",
                TOGGLE_MUSIC: "toggleMusic",
                TOGGLE_BTN_SOUND: "toggleBtnSound",
                TOGGLE_BTN_MUSIC: "toggleBtnMusic",
                FINAL_TILE_TOGGLE: "finalTileToggle",
                BUY_ITEM: "buyItem",
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