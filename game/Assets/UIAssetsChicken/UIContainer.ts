import RPG from "@/game/rpg";
import Phaser from "phaser";
import { UIInterface } from "./UiInterface";
import { Bar, Clock, Timer } from "./Timer";
import roomMap from "../../maps/room";


export default class UIContainer extends Phaser.GameObjects.Container {

    scene: RPG;
    clock: Clock;
    paper: Phaser.GameObjects.Image;
    walletBar: Phaser.GameObjects.Image;
    coinsCount: Phaser.GameObjects.Text;
    lvlMarker: Phaser.GameObjects.Image;
    bar1: Phaser.GameObjects.Image;
    bar2: Phaser.GameObjects.Image;
    nivel: string
    constructor(
        scene: RPG,
        x: number,
        y: number,
        nivel: string,
    ) {
        // @ts-ignore
        super(scene, x, y);
        this.scene = scene;
        this.nivel = nivel
        this.clock = new Clock(this.scene, window.innerWidth - 120, 180)
        this.walletBar = this.scene.add.image(-170, 250, "coinUi").setOrigin(0.5);
        this.walletBar.setPosition(window.innerWidth - 50 - this.walletBar.width / 2, 75);
        this.coinsCount = this.scene.add.text(-160, 250, "300", {
            fontFamily: "MontserratSemiBold",
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);
        this.coinsCount.setPosition(window.innerWidth - 40 - this.walletBar.width / 2, 75);

        this.paper = this.scene.add.image(window.innerWidth - 50, window.innerHeight - 50, "iconNewsOff").setOrigin(0, 1);
        this.paper.setPosition(window.innerWidth - 50 - this.paper.width, window.innerHeight - 50)

        this.lvlMarker = this.scene.add.image(50, 50, "lvlMarker").setOrigin(0);


        this.bar1 = this.scene.add.image(50, 140, "varStar").setOrigin(0);


        this.bar2 = this.scene.add.image(50, 190, "varSmile").setOrigin(0);


        const timer1 = this.scene.time.addEvent({
            delay: 5000, // ms
            callback: () => {
                this.coinsCount.setText((parseInt(this.coinsCount.text) + 10).toString())
            },
            //args: [],
            callbackScope: this,
            loop: true,
        });


        const timer2 = this.scene.time.addEvent({
            delay: 500, // ms
            callback: () => {
                this.paper.setTexture("iconNewsOn").setPosition(window.innerWidth - 35 - this.paper.width, window.innerHeight - 50)
            },
            //args: [],
            callbackScope: this,
            repeat: 1,
        });

        const buttonChangeScene = this.scene.add.image(50, window.innerHeight - 50, nivel === "room" ? "goBack" : "goRoom").setOrigin(0, 1).setInteractive();
        buttonChangeScene.on('pointerdown', () => {
            if (nivel === "room") {
                this.scene.changeSceneTo("MenuScene", "RPG", undefined)
            } else {
                this.scene.changeSceneTo("RPG", "RPG", { maps: roomMap.map((m) => (typeof m === "string" ? m : JSON.stringify(m))) })
            }
        })

        this.add([
            this.bar1,
            this.bar2,
            this.lvlMarker,
            this.clock,
            this.paper,
            this.walletBar,
            this.coinsCount,
            buttonChangeScene
        ])

        this.scene.add.existing(this)
        this.scene.cameras.main.ignore(this)

    }

    changeMoney(amount: number) {
        this.coinsCount.setText((Number(this.coinsCount.text) - amount).toString())
    }

}