import RPG from "@/game/rpg";
import Phaser from "phaser";
import { UIInterface } from "./UiInterface";
import { Timer } from "./Timer";

export default class UIContainer extends Phaser.GameObjects.Container {

    scene: RPG;
    timer?: Timer;
    // uiInterface: UIInterface;
    leftContainer: Phaser.GameObjects.Container;
    rightContainer: Phaser.GameObjects.Container;
    constructor(
        scene: RPG,
        x: number,
        y: number,
    ) {
        // @ts-ignore
        super(scene, x, y);
        this.scene = scene;
       
        this.timer = new Timer(this.scene, 100, 50)
        // this.uiInterface = new UIInterface(this.scene, 0, window.innerHeight)

        this.leftContainer = this.scene.add.container(0,0);

        const smileBar = this.scene.add.image(150,150,"varSmile").setOrigin(0.5);
        const starBar = this.scene.add.image(150,200, "varStar").setOrigin(0.5);

        this.leftContainer.add([
            smileBar,
            starBar,
        ]);

        this.rightContainer = this.scene.add.container(window.innerWidth,0);

        const walletBar = this.scene.add.image(-170,150, "coinUi").setOrigin(0.5);

        const coinsCount = this.scene.add.text(-160, 150, "300", {
            fontFamily: "MontserratSemiBold", 
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);

        const paper = this.scene.add.image(-150,(window.innerHeight - 50), "iconNewsOff").setOrigin(0.5);

        this.rightContainer.add([
            paper,
            walletBar,
            coinsCount,
        ]);

        this.add([
            this.leftContainer,
            this.rightContainer,
            //this.timer,
            // this.uiInterface,
        ])

        this.scene.add.existing(this)
        this.scene.cameras.main.ignore(this)
        
    }

    
}