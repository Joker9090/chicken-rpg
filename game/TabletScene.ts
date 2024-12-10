
export default class TabletScene extends Phaser.Scene {

    worldSize = { width: 850, height: 500 };
    tabletShown: boolean = false;


    tabletBorder?: Phaser.GameObjects.Image;
    mask?: Phaser.Display.Masks.GeometryMask;
    group?: Phaser.GameObjects.Group;

    constructor(x: number, y: number) {
        super({ key: "TabletScene" });
    }

    showOrHideTablet() {
        this.tweens.add({
            targets: [this.cameras.main, this.cameras.getCamera("itemsCam")],
            y: this.tabletShown ? window.innerHeight + 200 : window.innerHeight / 2 - 500,
            duration: 700,
            ease: 'ease'
        })
        this.tabletShown = !this.tabletShown;
    }

    moveCamerasTo(coords: number[]) {
        this.cameras.getCamera("itemsCam")?.pan(coords[0], coords[1], 1000, 'Linear', true);
    }

    create() {
        this.cameras.main.setViewport(window.innerWidth / 2 - this.worldSize.width / 2, this.tabletShown ? window.innerHeight / 2 - this.worldSize.height / 2 : window.innerHeight + 200, this.worldSize.width, this.worldSize.height)
        this.cameras.main.centerOn(0, 0)
        this.tabletBorder = this.add.image(0, 0, "fondoTablet").setOrigin(0).setScale(0.5).setScrollFactor(0)
        // const graphics = this.add.graphics();
        // graphics.fillStyle(0x000000, 0.7);
        // graphics.fillRoundedRect(-this.worldSize.width / 2 + 20, -this.worldSize.height / 2 + 33, this.worldSize.width - 46, this.worldSize.height - 60, 7);
        // this.mask = graphics.createGeometryMask();

        const middlePositions = [
            [0, 0],
            [0, this.worldSize.height],
            [-this.worldSize.width, 0],
            [this.worldSize.width, 0]
        ]

        const tabletItemsCamera = this.cameras.add(window.innerWidth/2 - this.worldSize.width/2 + 20, window.innerHeight/2 - this.worldSize.height/2 + 20, this.worldSize.width - 60, this.worldSize.height - 65, false, "itemsCam")
        tabletItemsCamera.centerOn(0, 0)
        // tabletItemsCamera.setViewport(window.innerWidth / 2 - this.worldSize.width / 2, this.worldSize.width - 46, this.worldSize.height - 60)
        tabletItemsCamera.ignore(this.tabletBorder);
        const containerMenu = this.add.container(0,0);
        const MenuInicial = this.add.rectangle(0, 0, this.worldSize.width, this.worldSize.height, 0x00ff00).setOrigin(0).setOrigin(0.5).setVisible(true).setInteractive().on("pointerdown", () => {
            this.moveCamerasTo(middlePositions[1])
        })
        const containerSettings = this.add.container(0, this.worldSize.height);
        
        const Settings = this.add.rectangle(0, this.worldSize.height, this.worldSize.width, this.worldSize.height, 0xffff00).setOrigin(0).setOrigin(0.5).setVisible(true).setInteractive().on("pointerdown", () => {
            this.moveCamerasTo(middlePositions[2])
        })
        const Stats = this.add.rectangle(-this.worldSize.width, 0, this.worldSize.width, this.worldSize.height, 0x00ffff).setOrigin(0).setOrigin(0.5).setVisible(true).setInteractive().on("pointerdown", () => {
            this.moveCamerasTo(middlePositions[3])
        })
        const MoneyMovement = this.add.rectangle(this.worldSize.width, 0, this.worldSize.width, this.worldSize.height, 0xffffff).setOrigin(0).setOrigin(0.5).setVisible(true).setInteractive().on("pointerdown", () => {
            this.moveCamerasTo(middlePositions[0])
        })

        this.cameras.main.ignore([MenuInicial,
            Settings,
            Stats,
            MoneyMovement])
        // MenuInicial.setMask(this.mask);
        // Settings.setMask(this.mask);
        // Stats.setMask(this.mask);
        // MoneyMovement.setMask(this.mask);

   

        // let int = 0;

        // setInterval(() => {
        //     int++;
        //     if (int === 0) this.cameras.getCamera("itemsCam")?.pan(middlePositions[0][0], middlePositions[0][1], 1000, 'Linear', true);
        //     if (int === 1) this.cameras.getCamera("itemsCam")?.pan(middlePositions[1][0], middlePositions[1][1], 1000, 'Linear', true);
        //     if (int === 2) this.cameras.getCamera("itemsCam")?.pan(middlePositions[0][0], middlePositions[0][1], 1000, 'Linear', true);
        //     if (int === 3) this.cameras.getCamera("itemsCam")?.pan(middlePositions[2][0], middlePositions[2][1], 1000, 'Linear', true);
        //     if (int === 4) {
        //         this.cameras.getCamera("itemsCam")?.pan(middlePositions[0][0], middlePositions[0][1], 1000, 'Linear', true);
        //         int = 0;
        //     }
        // }, 1000);


        // setTimeout(() => {
        //     this.showOrHideTablet();
        //     setTimeout(() => {
        //         this.showOrHideTablet();
        //     }, 3000);
        // }, 3000);
    }
}