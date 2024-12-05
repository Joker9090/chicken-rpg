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
    paper: Phaser.GameObjects.Image;
    walletBar: Phaser.GameObjects.Image;
    coinsCount: Phaser.GameObjects.Text;
    lvlMarker: Phaser.GameObjects.Image;
    bar1: Phaser.GameObjects.Image;
    bar2: Phaser.GameObjects.Image;
    nivel: 'ROOM' | 'CITY';
    eventCenter = EventsCenterManager.getInstance();
    stateGlobal: globalState;
    constructor(
        scene: RPG,
        x: number,
        y: number,
        nivel: 'ROOM' | 'CITY',
    ) {
        super(scene, x, y);
        this.scene = scene;
        this.nivel = nivel

        this.stateGlobal = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.UPDATE_STATE, null);
        
        this.clock = new Clock(this.scene, window.innerWidth - 120, 180)
        this.walletBar = this.scene.add.image(-170, 250, "coinUi").setOrigin(0.5);
        this.walletBar.setPosition(window.innerWidth - 50 - this.walletBar.width / 2, 75);
        this.coinsCount = this.scene.add.text(-160, 250, this.stateGlobal.playerMoney.toString(), {
            fontFamily: "MontserratSemiBold",
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);
        this.coinsCount.setPosition(window.innerWidth - 40 - this.walletBar.width / 2, 75);
        console.log(this.coinsCount, "COINS COUNT in constructor")

        this.paper = this.scene.add.image(window.innerWidth - 50, window.innerHeight - 50, "iconNewsOff").setOrigin(0, 1).setInteractive();
        this.paper.setPosition(window.innerWidth - 50 - this.paper.width, window.innerHeight - 50)
        this.paper.on('pointerdown', () => {
            rectangleNews.setVisible(true)
            this.scene.tweens.add({
                targets: paperNews,
                scale: 1,
                duration: 500,
                ease: 'Power2',
            })
        })
        this.lvlMarker = this.scene.add.image(50, 50, "lvlMarker").setOrigin(0);
        this.bar1 = this.scene.add.image(50, 140, "varStar").setOrigin(0);
        this.bar2 = this.scene.add.image(50, 190, "varSmile").setOrigin(0);

        // const timer1 = this.scene.time.addEvent({
        //     delay: 5000, // ms
        //     callback: () => {
        //         globalDataManager.changeMoney(10)
        //     },
        //     //args: [],
        //     callbackScope: this,
        //     loop: true,
        // });

        this.eventCenter.turnEventOn("RPG", this.eventCenter.possibleEvents.UPDATE_STATE, () => {
            this.stateGlobal = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, null);
            console.log(this.coinsCount, "COINS COUNT in event")
            this.coinsCount.setText(this.stateGlobal.playerMoney.toString())
          },this);



        const buttonChangeScene = this.scene.add.image(50, window.innerHeight - 50, nivel === "ROOM" ? "goBack" : "goRoom").setOrigin(0, 1).setInteractive();
        buttonChangeScene.on('pointerdown', () => {
            if (nivel === "ROOM") {
                changeSceneTo(this.scene, "MenuScene", "RPG", undefined)
            } else {
                changeSceneTo(this.scene, "RPG", "RPG", "ROOM")
            }
        })

        const rectangleNews = this.scene.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x000000, 0.5).setOrigin(0, 0).setInteractive().setVisible(false);
        const paperNews = this.scene.add.image(window.innerWidth / 2, window.innerHeight / 2, "modalNews").setOrigin(0.5).setScale(0.8).setInteractive().setScale(0);

        this.add([
            this.bar1,
            this.bar2,
            this.lvlMarker,
            this.clock,
            this.paper,
            this.walletBar,
            this.coinsCount,
            buttonChangeScene,
            rectangleNews,
            paperNews
        ])

        this.scene.add.existing(this)
        this.scene.cameras.main.ignore(this)

    }

    changeMoney(amount: number) {
        this.coinsCount.setText((Number(this.coinsCount.text) - amount).toString())
    }

}