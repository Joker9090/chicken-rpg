import EventsCenterManager from './EventsCenter'; // Adjust the path as necessary

/*export interface globalType {
    debunceInstance?: DebounceManager,
    //eventsCenterInstance?: EventsCenterManager,
  }*/
/*
class DebounceManager {
    activeDebounces: any[]
    constructor() {
        if ((global as globalType).debunceInstance) {
            throw new Error('New instance cannot be created!!')
        } else {
            this.activeDebounces = []
        }
        (global as globalType).debunceInstance = this
    }
    
    getInstance(): this {
        return this
    }

    createDebounceLogic(id: string, time: number, callBack: Function) {
        const exist = this.activeDebounces.find(d => d.id == id)
        if (exist) {
            clearTimeout(exist.timer)
            this.activeDebounces = this.activeDebounces.filter(d => d.id != id)
        }
        const timer = setTimeout(() => {
            const exist = this.activeDebounces.find(d => d.id == id)
            if (exist) {
                clearTimeout(exist.timer)
                this.activeDebounces = this.activeDebounces.filter(d => d.id != id)
            }
            callBack()
        }, time)
        this.activeDebounces.push({
            id: id,
            timer: timer,
            time: time
        })
    }
}

let DebounceManagerSingleton
if (!(global as globalType).debunceInstance) DebounceManagerSingleton = new DebounceManager()
else DebounceManagerSingleton = (global as globalType).debunceInstance
export default DebounceManagerSingleton as DebounceManager*/