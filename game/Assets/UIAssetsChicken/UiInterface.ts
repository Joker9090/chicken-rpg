import RPG from "@/game/rpg";
import Phaser from "phaser";
import ModalSettings from "./ModalSettings";


export class UIInterface extends Phaser.GameObjects.Container {
    scene: RPG;
    constructor(
        scene: RPG,
        x: number,
        y: number,
    ) {
        // @ts-ignore
        super(scene, x, y);
        this.scene = scene;

        const containerModalSettings = new ModalSettings(this.scene, window.innerWidth / 2, -window.innerHeight / 2);

        const handleClose = () => {
            containerModalSettings.setVisible(!containerModalSettings.visible)
        }


        const settingsIcon = this.scene.add.image(20, -20, "settingsIcon").setOrigin(0, 1).setInteractive().setScale(0.7);

        settingsIcon.on('pointerdown', () => {
            handleClose()
        })

        const helpIcon = this.scene.add.image(20, -80, "helpIcon").setOrigin(0, 1).setInteractive().setScale(0.7);

        helpIcon.on('pointerdown', () => {
            // handleHelp()
        })



        this.add([
            // containerModalHelp,
            containerModalSettings,
            settingsIcon,
            helpIcon,
        ])
    }
}
