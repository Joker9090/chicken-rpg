import RPG from "@/game/rpg";
import { modalType } from "./ModalTypes";
import { ModalPC } from "./ModalsBuilders/ModalPC";
import { ModalQUEST } from "./ModalsBuilders/ModalQUEST";
import { ModalBase } from "./ModalsBuilders/ModalBase";
import { ModalNews } from "./ModalsBuilders/ModalNews";


export class ModalManager {
    scene: RPG;
    activeModal: ModalPC | ModalQUEST | ModalNews | undefined = undefined;
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
                this.activeModal = new ModalPC(this.scene, window.innerWidth / 2, window.innerHeight / 2);
                break;
            case modalType.NEWS:
                this.activeModal = new ModalNews(this.scene, window.innerWidth / 2, window.innerHeight / 2);
                break;
        }
    }

    destroyModal() {
        if (this.activeModal) {
            this.activeModal = undefined;
        }
    }
}