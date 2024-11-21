import RPG, { modalType } from "@/game/rpg";
import { ModalBox } from "./ModalBox";

export type ModalConfig = {
    type: modalType;
    title?: string;
    time?: string;
    picture?: string;
    text?: string;
    reward?: string;
    agreedButtom?: any;
    closeButtom?: any;
    background?: Phaser.GameObjects.Image;
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