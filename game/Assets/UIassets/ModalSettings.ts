import RPG from "@/game/rpg";
import Phaser from "phaser";

export default class ModalSettings extends Phaser.GameObjects.Container {

    scene: RPG;
    timer?: Phaser.GameObjects.Image
    constructor(
        scene: RPG,
        x: number,
        y: number,
    ) {
        // @ts-ignore
        super(scene, x, y);
        this.scene = scene;

        const containerModal = this.scene.add.container(window.innerWidth / 2, -window.innerHeight / 2);
        const modalBack = this.scene.add.image(0, 0, "background").setOrigin(0.5)

        const handleClose = () => {
            containerModal.setVisible(!containerModal.visible)
        }

        const settingsIcon = this.scene.add.image(20, -20, "settingsIcon").setOrigin(0, 1).setInteractive().setScale(0.7);

        settingsIcon.on('pointerdown', () => {
            handleClose()
        })

        const texturesCancel = ["cancel", "cancelHover", "cancelClick"]

        const cancelButton = this.scene.add.image(150, 100, "cancel").setOrigin(0.5).setInteractive()

        cancelButton.on('pointerdown', () => {
            cancelButton.setTexture(texturesCancel[2])
        })
        cancelButton.on('pointerover', () => {
            cancelButton.setTexture(texturesCancel[1])
        })
        cancelButton.on('pointerout', () => {
            cancelButton.setTexture(texturesCancel[0])
        })
        cancelButton.on('pointerup', () => {
            handleClose()
            cancelButton.setTexture(texturesCancel[0])
        })

        
        const varVolEmpty = this.scene.add.image(0, -100, "varEmpty").setOrigin(0, 0.5).setScale(0.5, 1)
        
        const varVolFull = this.scene.add.image(0, -100, "varFull").setOrigin(0, 0.5).setScale(0.2, 1)
        const position = (varVolEmpty.width)/4
        
        varVolEmpty.setPosition(-position, -100)
        varVolFull.setPosition(-position, -100)

        containerModal.add([
            modalBack,
            cancelButton,
            varVolEmpty,
            varVolFull
        ])

        this.add([
            containerModal,
            settingsIcon,
        ])



    }
}