import { configMinigame } from "@/game/maps/mapCreationFunctions";

export type ProductToBuy = {
    id: number,
    title: string,
    picture: string,
    pictureOn: string,
    text: string,
    reward: number,
    isSelected?: boolean,
    roomInformation?: {
        assetInRoom: string,
        frontContainer: boolean,
    }
}

export type Inventory = {
    id: number,
    title: string,
    image: string,
    description: string,
    price: number,
    roomInformation?: {
        assetInRoom: string,
        frontContainer: boolean,
    }
}

export enum modalType {
    QUEST,
    PC,
    NEWS,
    PHONE,
  }

export type ModalConfig = {
    type: modalType;
    requires?: string;
    requirePicture?: string;
    requirements: number[];
    title: string;
    time: number;
    picture?: string;
    text?: string;
    reward: {
        money: number,
        reputation: number,
        happiness: number,
    };
    agreedButtom?: any;
    closeButtom?: any;
    background?: Phaser.GameObjects.Image;
    products?: ProductToBuy[];
    subModal?: ModalConfig;
    agreeFunction: Function;
};


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
    inProgress: boolean
    isMinigame: boolean
    draw: boolean
    configMinigame?: configMinigame
  }
  
  export type happinessType = {
    actualValue: number,
    maxValue: number,
  }
  
  export type transactionsType = {
    date: string,
    amount: number,
    description: string
  }
  
  