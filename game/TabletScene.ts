import { globalState } from "./GlobalDataManager";
import { menuContainer } from "./TabletContainers/menuContainer";
import { statsContainer } from "./TabletContainers/statsContainer";
import EventsCenterManager from "./services/EventsCenter";

export default class TabletScene extends Phaser.Scene {

    worldSize = { width: 850, height: 500 };
    tabletShown: boolean = true;


    tabletBorder?: Phaser.GameObjects.Image;
    mask?: Phaser.Display.Masks.GeometryMask;
    group?: Phaser.GameObjects.Group;
    eventCenter = EventsCenterManager.getInstance();
    stateGlobal: globalState;

    constructor(x: number, y: number) {
        super({ key: "TabletScene" });

        this.stateGlobal = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, null);
    }

    showOrHideTablet() {
        this.tweens.add({
            targets: [this.cameras.main],
            y: this.tabletShown ? window.innerHeight + 200 : window.innerHeight / 2 - this.worldSize.height / 2 ,
            duration: 700,
            ease: 'ease'
        })

        this.tweens.add({
            targets: [this.cameras.getCamera("itemsCam")],
            y: this.tabletShown ? window.innerHeight + 200 : window.innerHeight / 2 - this.worldSize.height / 2 + 20 ,
            duration: 700,
            ease: 'ease'
        })
        this.tabletShown = !this.tabletShown;
    }
    
    moveCamerasTo(coords: number[]) {
        //this.cameras.getCamera("itemsCam")?.pan(coords[0], coords[1], 1000, 'Linear', true);
        this.cameras.getCamera("itemsCam")?.pan(coords[0], coords[1], 200, 'Linear', true);
    }

    create() {

        //this.stateGlobal = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, null);
        console.log("State david: ", this.stateGlobal);

        this.cameras.main.setViewport(window.innerWidth / 2 - this.worldSize.width / 2, this.tabletShown ? window.innerHeight / 2 - this.worldSize.height / 2 : window.innerHeight + 200, this.worldSize.width, this.worldSize.height)
        this.cameras.main.centerOn(0, 0)
<<<<<<< HEAD
        this.tabletBorder = this.add.image(0, 0, "fondoTabletOp2").setOrigin(0).setScale(0.5).setScrollFactor(0)
        console.log(this.tabletBorder.width, this.tabletBorder.height);
=======
        this.tabletBorder = this.add.image(0, 0, "fondoTablet").setOrigin(0).setScale(0.5).setScrollFactor(0)
>>>>>>> 55dce5787430ff248bf153be7d5c3bcfbc6fb415
        // const graphics = this.add.graphics();
        // graphics.fillStyle(0x000000, 0.7);
        // graphics.fillRoundedRect(-this.worldSize.width / 2 + 20, -this.worldSize.height / 2 + 33, this.worldSize.width - 46, this.worldSize.height - 60, 7);
        // this.mask = graphics.createGeometryMask();

        const handleMoveMenu = () => {
            console.log("se mueve al menu !");
            this.moveCamerasTo(middlePositions[0]);
        }

        const handleMove = (coords: number[]) => {
            console.log("se mueve al settings !");
            this.moveCamerasTo(coords);
        };

        const handleHideShowTablet = () => {
            this.showOrHideTablet();
        }

        const middlePositions = [
            [0, 0], //MENU
            [0, this.worldSize.height],//Settings
            [-this.worldSize.width, 0],//Stats
            [this.worldSize.width, 0]//MoneyMovement
        ]

        const tabletItemsCamera = this.cameras.add(window.innerWidth/2 - this.worldSize.width/2 + 20, window.innerHeight/2 - this.worldSize.height/2 + 20, this.worldSize.width - 60, this.worldSize.height - 65, false, "itemsCam")
        tabletItemsCamera.centerOn(0, 0)
        // tabletItemsCamera.setViewport(window.innerWidth / 2 - this.worldSize.width / 2, this.worldSize.width - 46, this.worldSize.height - 60)
        tabletItemsCamera.ignore(this.tabletBorder);

        // NO BORRAR, PARA TESTEO
        /*const MenuInicial = this.add.rectangle(0, 0, this.worldSize.width, this.worldSize.height, 0x00ff00).setOrigin(0).setOrigin(0.5).setVisible(true).setInteractive().on("pointerdown", () => {
            this.moveCamerasTo(middlePositions[1])
        })

        const Settings = this.add.rectangle(0, this.worldSize.height, this.worldSize.width, this.worldSize.height, 0xffff00).setOrigin(0).setOrigin(0.5).setVisible(true).setInteractive().on("pointerdown", () => {
            this.moveCamerasTo(middlePositions[2])
        })

        
        const Stats = this.add.rectangle(-this.worldSize.width, 0, this.worldSize.width, this.worldSize.height, 0x00ffff).setOrigin(0).setOrigin(0.5).setVisible(true).setInteractive().on("pointerdown", () => {
            this.moveCamerasTo(middlePositions[3])
        })

    
        const MoneyMovement = this.add.rectangle(this.worldSize.width, 0, this.worldSize.width, this.worldSize.height, 0xffffff).setOrigin(0).setOrigin(0.5).setVisible(true).setInteractive().on("pointerdown", () => {
            this.moveCamerasTo(middlePositions[0])
        }) */

        //--> Containers del menu
        const containerMenu = new menuContainer(this, 0, 0, handleMove, handleHideShowTablet);
        const containerStats = new statsContainer(this, -this.worldSize.width, 0, handleMoveMenu,handleHideShowTablet);
        //const containerSettings = this.add.container(0, this.worldSize.height);

        //<-- Containers del menu

        this.cameras.main.ignore([/*MenuInicial,
            Settings,
            Stats,
            MoneyMovement,*/
            containerStats,
            containerMenu,
        ]);

        //setTimeout(() => {
        //    this.moveCamerasTo(middlePositions[1])
        //}, 3000);




        console.log("CAMARAS NANO! ", this.cameras.main, this.cameras.getCamera("itemsCam"));
    }
}