import RPG from "@/game/rpg";
import Phaser from "phaser";
import { UIInterface } from "./UiInterface";
import { Bar, Clock, Timer } from "./Timer";
import roomMap from "../../maps/Room";
import GlobalDataManager, { globalState } from "@/game/GlobalDataManager";
import EventsCenterManager from "../../services/EventsCenter";
import { changeSceneTo } from "@/game/helpers/helpers";


export default class UIContainer extends Phaser.GameObjects.Container {

    scene: RPG;
    clock: Clock;
    walletBar: Phaser.GameObjects.Image;
    coinsCount: Phaser.GameObjects.Text;
    lvlMarker: Phaser.GameObjects.Image;
    tabletIcon: Phaser.GameObjects.Image;
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
        
        // -> CLOCK
        this.clock = new Clock(this.scene, window.innerWidth - 120, 180)
        // -> CLOCK

        // -> WALLET
        this.walletBar = this.scene.add.image(-170, 250, "coinUi").setOrigin(0.5);
        this.walletBar.setPosition(window.innerWidth - 50 - this.walletBar.width / 2, 75);
        this.coinsCount = this.scene.add.text(-160, 250, this.stateGlobal.playerMoney.toString(), {
            fontFamily: "MontserratSemiBold",
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);
        this.coinsCount.setPosition(window.innerWidth - 40 - this.walletBar.width / 2, 75);
        // <- WALLET

       // -> LVL MARKER
        this.lvlMarker = this.scene.add.image(50, 50, "lvlMarker").setOrigin(0);
       // <- LVL MARKER

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

        this.tabletIcon = this.scene.add.image(window.innerWidth - 50 , window.innerHeight - 50, "tabletIcon").setOrigin(1).setInteractive().on('pointerdown', () => {
            this.scene.tabletScene?.showOrHideTablet();
        });

        this.add([
            this.lvlMarker,
            this.clock,
            this.walletBar,
            this.coinsCount,
            buttonChangeScene,
            this.tabletIcon,
        ])
        this.scene.add.existing(this)
        this.scene.cameras.main.ignore(this)
    }

    updateData(data: globalState){
        this.coinsCount.setText(data.playerMoney.toString())
        // nbivel del pj
        // barra de stamina
        // barra de respeto
        // info del celu
        // tiempo del dia
    }

    changeMoney(amount: number) {
        this.coinsCount.setText((Number(this.coinsCount.text) - amount).toString())
    }

}