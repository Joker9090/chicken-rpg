import RPG, { modalType } from "@/game/rpg";
import { ModalBox } from "./ModalBox";

export type ProductToBuy = {
    title: string,
    picture: string,
    pictureOn: string,
    text: string,
    reward: number,
    isSelected?: boolean,
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
    agreeFunction: Function;
};


export class ModalContainer extends Phaser.GameObjects.Container {
    scene: RPG;
    modalBox: ModalBox;
    modalConfig: ModalConfig;
    constructor(
        scene: RPG,
        x: number,
        y: number,
        modalConfig: ModalConfig,
    ) {
        super(scene,x,y);
        this.scene = scene;
        this.modalConfig = modalConfig;

        this.modalBox = new ModalBox(this.scene, window.innerWidth /2, window.innerHeight /2,this.modalConfig);

        this.add([
            this.modalBox,
        ])


        this.scene.add.existing(this)
        this.scene.cameras.main.ignore(this)
    }
}