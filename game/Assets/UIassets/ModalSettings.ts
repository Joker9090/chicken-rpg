import Phaser from "phaser";
import RPG from "@/game/rpg";
import { close } from "node:inspector/promises";

export class ModalSettings extends Phaser.GameObjects.Container {

    modal?: Phaser.GameObjects.Image;
    settingsIcon?: Phaser.GameObjects.Image;

    constructor(
        scene: RPG,
        x: number,
        y: number,
    ) {
        super(scene, x, y);

        const modalContainer = scene.add.container(window.innerWidth / 2, -window.innerHeight / 2).setVisible(true)
        const modalRectangle = scene.add.rectangle(0, 0, 400, 300, 0xff00ff, 0.9).setOrigin(0.5)
        // CLOSE BUTTON
        const closeButton = scene.add.rectangle(0, 60, 300, 60, 0xff0000, 0.9).setOrigin(0.5).setInteractive();
        const textClose = scene.add.text(198, -155, "X", {
            fontSize: 40,
            fontStyle: "bold",
            color: "black",
        }).setOrigin(1, 0)
        closeButton.on('pointerdown', () => {
            modalContainer.setVisible(false)
            console.log("CLICK DETECTED")
        })
        // EXIT BUTTON
        const exitButton = scene.add.rectangle(200, -150, 30, 30, 0xffffff, 0.9).setOrigin(1, 0).setInteractive();
        const textExit = scene.add.text(0, -60, "EXIT", {
            fontSize: 40,
            fontStyle: "bold",
            color: "black",
        }).setOrigin(0.5)
        exitButton.on('pointerdown', () => {
            modalContainer.setVisible(false)
            console.log("CLICK DETECTED")
        })
        // CONTINUE BUTTON
        const continueButton = scene.add.rectangle(0, -60, 300, 60, 0x0000ff, 0.9).setOrigin(0.5).setInteractive();
        const textContinue = scene.add.text(0, 60, "CONTINUE", {
            fontSize: 40,
            fontStyle: "bold",
            color: "black",
        }).setOrigin(0.5)
        continueButton.on('pointerdown', () => {
            modalContainer.setVisible(false)
            console.log("CLICK DETECTED")
        })

        
        modalContainer.add([
            modalRectangle,
            exitButton,
            closeButton,
            continueButton,
            textContinue,
            textExit,
            textClose,
        ])

        this.settingsIcon = scene.add.image(20, -20, "settingsIcon").setOrigin(0, 1).setInteractive();
        this.settingsIcon.on('pointerdown', () => {
            console.log("CLICK DETECTED")
            modalContainer.setVisible(!modalContainer.visible)
        })

        this.add([
            this.settingsIcon,
            modalContainer
        ])
    }

}