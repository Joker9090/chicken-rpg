import RPG from "@/game/rpg";
import { modalType } from "./ModalTypes";
import { ModalPC } from "./ModalsBuilders/ModalPC";
import { ModalQUEST } from "./ModalsBuilders/ModalQUEST";
import { ModalBase } from "./ModalsBuilders/ModalBase";
import { MultiViewModal } from "./ModalsBuilders/MultiViewModal";


export class ModalManager {
    scene: RPG;
    activeModal: ModalPC | ModalQUEST | MultiViewModal | ModalBase | undefined = undefined;
    constructor(
        scene: RPG,
    ) {
        this.scene = scene;
    }

    createModal(modalOption: modalType) {
        switch (modalOption) {
            case modalType.QUEST:
                this.activeModal = new ModalQUEST(this.scene, window.innerWidth / 2, window.innerHeight / 2);
                break;
            case modalType.PC:
                //this.activeModal = new ModalPC(this.scene, window.innerWidth / 2, window.innerHeight / 2);
                this.activeModal = new MultiViewModal(this.scene, window.innerWidth / 2, window.innerHeight / 2);
                break;
            case modalType.PHONE:
                this.activeModal = new MultiViewModal(this.scene, window.innerWidth / 2, window.innerHeight / 2);
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