import RPG from "@/game/rpg";
import { modalType } from "./ModalTypes";
import { ModalPC } from "./ModalsBuilders/ModalPC";
import { ModalQUEST } from "./ModalsBuilders/ModalQUEST";
import { ModalBase } from "./ModalsBuilders/ModalBase";
import { ModalNews } from "./ModalsBuilders/ModalNews";
import { MultiViewModal } from "./ModalsBuilders/MultiViewModal";
import { PinIsoSpriteBox } from "../pinIsoSpriteBox";
import { ModalForm } from "./ModalsBuilders/ModalForm";


export class ModalManager {
    scene: RPG;
    activeModal: ModalPC | ModalQUEST | MultiViewModal | ModalNews | ModalForm | undefined = undefined;
    pin?: PinIsoSpriteBox;
    constructor(
        scene: RPG,
    ) {
        this.scene = scene;
    }

    createModal(data: {modalType: modalType, pin?: PinIsoSpriteBox}) {
        if (data.pin) this.pin = data.pin;
        switch (data.modalType) {
            case modalType.QUEST:
                this.activeModal = new ModalQUEST(this.scene, window.innerWidth / 2, window.innerHeight / 2, this.pin);
                break;
            case modalType.PC:
                this.activeModal = new ModalPC(this.scene, window.innerWidth / 2, window.innerHeight / 2);
                break;
            case modalType.PHONE:
                this.activeModal = new MultiViewModal(this.scene, window.innerWidth / 2, window.innerHeight / 2);
                break;
            case modalType.NEWS:
                this.activeModal = new ModalNews(this.scene, window.innerWidth / 2, window.innerHeight / 2);
                //this.activeModal = new ModalForm(this.scene, window.innerWidth / 2, window.innerHeight / 2);
                break;
            case modalType.FORM:
                this.activeModal = new ModalForm(this.scene, window.innerWidth / 2, window.innerHeight / 2);
                break;
            default:
                break;
        }
    }

    destroyModal() {
        if (this.activeModal) {
            this.activeModal = undefined;
        }
    }
}