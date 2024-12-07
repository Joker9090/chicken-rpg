import RPG from "@/game/rpg";
import EventsCenterManager from "../../../services/EventsCenter";

export class ModalBase extends Phaser.GameObjects.Container {
    scene: RPG;
    modalContainerWithElements: Phaser.GameObjects.Container;
    handleClose: () => void;
    eventCenter = EventsCenterManager.getInstance();
    constructor(
        scene: RPG,
        x: number,
        y: number,

    ) {
        super(scene, x, y);
        this.scene = scene;

        const backgroundLess = scene.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x000000, 0.5);
        backgroundLess.setInteractive();
        backgroundLess.on('pointerdown', () => {
            this.handleClose();
        });
        this.modalContainerWithElements = this.scene.add.container(-window.innerWidth, 0);

        this.scene.tweens.chain({
            targets: this.modalContainerWithElements,
            tweens: [
                {
                    x: 0,
                    ease: 'power3',
                    duration: 750
                },
            ],
            onComplete: () => {
                this.modalContainerWithElements.x = 0;
                this.modalContainerWithElements.y = 0;
            }
        });

        this.handleClose = () => {
            const chain = this.scene.tweens.chain({
                targets: this.modalContainerWithElements,
                //persist: true,
                tweens: [
                    {
                        x: -window.innerWidth,
                        ease: 'power3',
                        duration: 750,
                    },
                ],
                onComplete: () => {
                    this.destroy(); //CHEQUEAR
                    this.eventCenter.emitEvent(this.eventCenter.possibleEvents.CLOSE_MODAL, undefined);
                }
            });
        }

        this.add([
            backgroundLess,
            this.modalContainerWithElements,
        ]);

        this.scene.add.existing(this)
        this.scene.cameras.main.ignore(this)


    }
}