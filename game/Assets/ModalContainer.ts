import RPG from "@/game/rpg";
import { ModalBox } from "./ModalBox";

export type ModalConfig = {
    title?: string;
    text?: string;
    agreedButtom?: any;
    closeButtom?: any;
    background?: string;
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

        this.modalBox = new ModalBox(this.scene, 0, window.innerHeight,this.modalConfig);

        this.add([
            this.modalBox,
        ])


        this.scene.add.existing(this)
        this.scene.cameras.main.ignore(this)
    }
}