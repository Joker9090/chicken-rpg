import RPG from "@/game/rpg";
import Phaser from "phaser";
import { UIInterface } from "./UiInterface";
import { Timer } from "./Timer";

export default class UIContainer extends Phaser.GameObjects.Container {

    scene: RPG;
    timer?: Timer
    uiInterface: UIInterface
    constructor(
        scene: RPG,
        x: number,
        y: number,
    ) {
        // @ts-ignore
        super(scene, x, y);
        this.scene = scene;
       
        this.timer = new Timer(this.scene, 100, 50)
        this.uiInterface = new UIInterface(this.scene, 0, window.innerHeight)


        this.add([
            this.timer,
            this.uiInterface
        ])

        this.scene.add.existing(this)
        this.scene.cameras.main.ignore(this)
        
    }

    
}