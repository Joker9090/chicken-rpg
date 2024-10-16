import RPG from "@/game/rpg";
import Phaser from "phaser";
import { ModalSettings } from "./ModalSettings";

export class UIContainer extends Phaser.GameObjects.Container {

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
        // TIMER
        const graphics = scene.add.graphics(); 
        graphics.lineStyle(4, 0xffffff, 1);
        graphics.strokeRoundedRect(10, 20, 150, 60, 15);
        this.timer = this.scene.add.image(40, 50, "reloj").setOrigin(0, 0.5); 

        const timerCounter = this.scene.add.text(110, 50, "0", {
            fontSize: 40,
            fontStyle: "bold",
        }).setOrigin(0, 0.5)
        setInterval(() => {
            timerCounter.setText((Number(timerCounter.text) + 1).toString())
        }, 1000)


        const settings = new ModalSettings(this.scene, 0, window.innerHeight)


        this.add([
            graphics,
            this.timer,
            timerCounter,
            settings
        ])

        this.scene.add.existing(this)
        this.scene.cameras.main.ignore(this)
        
    }
}