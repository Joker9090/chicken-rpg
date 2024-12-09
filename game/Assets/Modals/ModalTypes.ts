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
    PHONE,
  }

export type ModalConfig = {
    type: modalType;
    requires?: string;
    requirePicture?: string;
    title?: string;
    time?: number;
    picture?: string;
    text?: string;
    reward?: number;
    agreedButtom?: any;
    closeButtom?: any;
    background?: Phaser.GameObjects.Image;
    products?: ProductToBuy[];
    subModal?: ModalConfig;
    agreeFunction: Function;
};

