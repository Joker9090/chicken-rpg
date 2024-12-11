import RPG from "@/game/rpg";
import Phaser from "phaser";
import { UIInterface } from "./UiInterface";
import { Bar, DayBlock, Timer } from "./UIAssets";
import roomMap from "../../maps/Room";
import GlobalDataManager, { globalState } from "@/game/GlobalDataManager";
import EventsCenterManager from "../../services/EventsCenter";
import { changeSceneTo } from "@/game/helpers/helpers";


export default class UIContainer extends Phaser.GameObjects.Container {

    scene: RPG;
    nivel: 'ROOM' | 'CITY';
    // eventCenter = EventsCenterManager.getInstance();
    stateGlobal: globalState;
    constructor(
        scene: RPG,
        x: number,
        y: number,
        nivel: 'ROOM' | 'CITY',
        data: globalState
    ) {
        super(scene, x, y);
        this.scene = scene;
        this.nivel = nivel
        this.stateGlobal = data
        
        const dayBlock = new DayBlock(scene, window.innerWidth/2, 0)

        // -> BUTTON CHANGE SCENE
        const buttonChangeScene = this.scene.add.image(50, window.innerHeight - 50, nivel === "ROOM" ? "goBack" : "goRoom").setOrigin(0, 1).setInteractive();
        buttonChangeScene.on('pointerdown', () => {
            if (nivel === "ROOM") {
                changeSceneTo(this.scene, "MenuScene", "RPG", undefined)
            } else {
                changeSceneTo(this.scene, "RPG", "RPG", "ROOM")
            }
        })
        // <- BUTTON CHANGE SCENE

        this.add([
            buttonChangeScene,
            dayBlock,
        ])
        this.scene.add.existing(this)
        this.scene.cameras.main.ignore(this)
    }

    updateData(data: globalState){
        // this.coinsCount.setText(data.playerMoney.toString())
        // nbivel del pj
        // barra de stamina
        // barra de respeto
        // info del celu
        // tiempo del dia
    }

    changeMoney(amount: number) {
        // this.coinsCount.setText((Number(this.coinsCount.text) - amount).toString())
    }

}