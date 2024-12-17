
export type globalType = {
  GlobalDataInstance?: GlobalData;
};

export type starByLevelType = {
  1: boolean,
  2: boolean,
  3: boolean,
  4: boolean,
  5: boolean,
}

export type Scope = {
  lifes?: number;
  time?: number;
  stars?: number;
  lifeBar?: number;
  levelCode?: string;
  levelAvailable?: number;
  level?: number;
  conditionals?: number[];
  starByLevel?: starByLevelType;
};

class GlobalData {
  timerInterval?: NodeJS.Timeout | undefined;
  listeners?: ((scope: Scope) => void)[];
  scope: Scope = {
    lifes: 3,
    time: 180,
    stars: 0,
    lifeBar: 11,
    levelCode: "",
    levelAvailable: 1,
    level: 3,
    conditionals: [15, 30, 45],
    starByLevel: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    }
  };

  constructor() {
    if ((global as globalType).GlobalDataInstance) {
      throw new Error("New instance cannot be created!!");
    } else {
    }
    (global as globalType).GlobalDataInstance = this;
  }

  setNewValue(newValues: Scope) {
    this.scope = { ...this.scope, ...newValues };
    this.fireListeners();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      const initValue = this.scope.time ?? 180;
      if (initValue >= 0) {
        this.setNewValue({ time: initValue - 0.5 });
      } else {
        this.stopTimer();
      }
    }, 500);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  resetGlobal() {
    this.stopTimer();
    this.setNewValue({
      lifes: 3,
      time: 180,
      stars: 0,
      lifeBar: 11,
      starByLevel: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      }
    });
  }

  getScope() {
    return this.scope;
  }

  fireListeners() {
    // @ts-ignore
    if (this.listeners) {
      // @ts-ignore
      this.listeners.forEach((listener) => {
        listener(this.scope);
      });
    }
  }

  addListener(listener: (scope: Scope) => void) {
    // @ts-ignore
    if (!this.listeners) {
      // @ts-ignore
      this.listeners = [];
    }
    // @ts-ignore
    this.listeners.push(listener);
    listener(this.scope);
  }

  removeListener(listener: (scope: Scope) => void) {
    // @ts-ignore
    if (this.listeners) {
      // @ts-ignore
      this.listeners = this.listeners.filter((l) => l !== listener);
    }
  }
}

let GlobalDataSingleton;
if (!(global as globalType).GlobalDataInstance)
  GlobalDataSingleton = new GlobalData();
else GlobalDataSingleton = (global as globalType).GlobalDataInstance;
export default GlobalDataSingleton as GlobalData;
