import RPG from "@/game/rpg";
import Phaser from "phaser";
import { UIInterface } from "./UiInterface";
import { Bar, Timer } from "./Timer";

export default class UIContainer extends Phaser.GameObjects.Container {

    scene: RPG;
    timer?: Timer;
    barSmile?: Bar;
    // uiInterface: UIInterface;
    // leftContainer: Phaser.GameObjects.Container;
    // rightContainer: Phaser.GameObjects.Container;
    constructor(
        scene: RPG,
        x: number,
        y: number,
    ) {
        // @ts-ignore
        super(scene, x, y);
        this.scene = scene;
       
        this.timer = new Timer(this.scene, 100, 50).setScale(0.7)
        this.barSmile = new Bar(this.scene, 70, 130, "smilyFace")

        const walletBar = this.scene.add.image(-170, 250, "coinUi").setOrigin(0.5);
        walletBar.setPosition(window.innerWidth - 50 - walletBar.width/2, 75);
        const coinsCount = this.scene.add.text(-160, 250, "300", {
            fontFamily: "MontserratSemiBold", 
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);
        coinsCount.setPosition(window.innerWidth - 40 - walletBar.width/2, 75);

        const paper = this.scene.add.image(window.innerWidth - 50, window.innerHeight - 50, "iconNewsOff").setOrigin(0, 1);
        paper.setPosition(window.innerWidth - 50 - paper.width, window.innerHeight - 50)



          const timer1 = this.scene.time.addEvent({
            delay: 5000, // ms
            callback: () => {
                coinsCount.setText((parseInt(coinsCount.text) + 10).toString())
            },
            //args: [],
            callbackScope: this,
            loop: true,
          });


        const timer2 = this.scene.time.addEvent({
            delay: 500, // ms
            callback: ()=>{
            paper.setTexture("iconNewsOn").setPosition(window.innerWidth - 35 - paper.width, window.innerHeight - 50)
            },
            //args: [],
            callbackScope: this,
            repeat: 1,
          });
          

        this.add([
            this.barSmile,
            paper,
            walletBar,
            coinsCount,
            // this.leftContainer,
            // this.rightContainer,
            this.timer,
            // this.uiInterface,
        ])

        this.scene.add.existing(this)
        this.scene.cameras.main.ignore(this)
        
    }

    
}