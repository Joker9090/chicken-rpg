export type ProductToBuy = {
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

