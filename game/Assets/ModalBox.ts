import RPG from "../rpg";
import { ModalConfig } from "./ModalContainer";




export class ModalBox extends Phaser.GameObjects.Container {
    scene: RPG;
    saveButton: Phaser.GameObjects.Image;
    constructor(
        scene: RPG,
        x: number,
        y: number,
        modalConfig: ModalConfig,
    ) {
        super(scene, x, y);
        this.scene = scene;

        const backgroundLess = scene.add.rectangle(0, 0,  window.innerWidth, window.innerHeight, 0x000000, 0.5);
        backgroundLess.setInteractive();

        const modalBackground = this.scene.add.image(0, 0, "background").setOrigin(0.5)

        const handleClose = () => {
            console.log("data?:", modalConfig);
            this.setVisible(!this.visible)
        }


        this.saveButton = this.scene.add.image(-140, 120, "save").setOrigin(0.5).setInteractive().setScale(.7)
        this.saveButton.on('pointerup', () => {
            handleClose()
            this.saveButton.setTexture("save");
        })

        this.add([
            backgroundLess,
            modalBackground,
            this.saveButton
        ]);

        this.setVisible(true)

    }
}