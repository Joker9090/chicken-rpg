import Phaser from "phaser";

const EventsCenter = new Phaser.Events.EventEmitter();

let activeEvents: {
    [key: string]: [string, Function][]
} = {}

export const possibleEvents = {
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
}

export const turnEventOn = (sceneKey:string, event: string, callback: Function, context: any) => {
    activeEvents[sceneKey] = activeEvents[sceneKey] || []
    activeEvents[sceneKey].push([event, callback])
    EventsCenter.on(event, callback, context);
}

export const turnEventOff = (sceneKey:string, event: string, context: any) => {
    activeEvents[sceneKey] = activeEvents[sceneKey] || []
    activeEvents[sceneKey] = activeEvents[sceneKey].filter(([e, cb]) => {
        if (e === event) {
            EventsCenter.off(e, cb, context);
            return false
        }
        return true
    })
}

export const emitEvent = (event: string, data: any) => {
    EventsCenter.emit(event, data);
}

export const turnOffAllEventsByScene = (sceneKey: string) => {
    activeEvents[sceneKey] = activeEvents[sceneKey] || []
    activeEvents[sceneKey].forEach(([event, callback]) => {
        EventsCenter.off(event, callback);
    })
}

export default EventsCenter;