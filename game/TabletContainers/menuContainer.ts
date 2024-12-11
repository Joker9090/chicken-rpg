import EventsCenterManager from "../services/EventsCenter";


export type buttonMenu = {
    coords:  number[],
    texture: string,
    visible: boolean,
}

export class menuContainer extends Phaser.GameObjects.Container {
    scene: Phaser.Scene;
    closeButton: Phaser.GameObjects.Image;
    activeTween: Phaser.Tweens.Tween | null = null;
    eventCenter = EventsCenterManager.getInstance();
    settingsButton: Phaser.GameObjects.Image;

    //handleGoback: () => void;
    handleMove: Function;
    handleClose: Function;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        handleToMove: Function,
        handleToClose: Function,

    ) {
        super(scene,x, y);
        this.scene = scene;
        this.handleMove = handleToMove;
        this.handleClose = handleToClose;


        const tweenButtonOver = (_target: any, scale: number = 1.2) => {
            this.activeTween = this.scene.tweens.add({
                targets: _target,
                scaleX: scale,
                scaleY: scale,
                duration: 300,
                yoyo: true,
                repeat: -1,
                ease: 'lineal',
            });
        }

        const tweenButtonOut = (_target: any, scale: number = 1) => {
            this.activeTween = this.scene.tweens.add({
                targets: _target,
                scaleX: scale,
                scaleY: scale,
                duration: 200,
                ease: 'Bounce.easeOut'
            });

        }

        const buttonsData = [
            {
                coords:  [-850, 0],//Stats
                texture: "tabletStats2",
                visible: true,

            },
            /*{
                coords: [0, 500],//Settings
                texture: "tabletSettings",
                visible: false,
            },*/
            {
                coords: [850, 0],//MoneyMovement
                texture: "tabletNotReady",
                visible: false,
            },
            {
                coords: [0, 0],
                texture: "tabletNotReady",
                visible: false,
            },
            {
                coords: [0, 0],
                texture: "tabletNotReady",
                visible: false,
            },
        ];


        //Menu containers
        const topContainer = this.scene.add.container(0, -170);
        const centerContainer = this.scene.add.container(0, -100);

        //TOP CONTAINER ->

        this.closeButton = this.scene.add.image(355, 0, "btnExit").setInteractive();

        this.closeButton.on('pointerup', () => {
            this.handleClose();
            console.log("CLOSE");
        });
        this.closeButton.on("pointerover", () => {
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOver(this.closeButton);
        });
        this.closeButton.on("pointerout", () => {
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOut(this.closeButton);
        });

        this.settingsButton = this.scene.add.image(-355, 0, "tabletSettings").setScale(0.8).setInteractive();

        this.settingsButton.on('pointerup', () => {
            //console.log("go back function: ", this.handleGoback);
            console.log("Settings");
            //this.handleGoback();
        });
        this.settingsButton.on("pointerover", () => {
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOver(this.settingsButton, 1);
        });
        this.settingsButton.on("pointerout", () => {
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOut(this.settingsButton, 0.8);
        });


        topContainer.add([this.closeButton,this.settingsButton]);

        //Top container <---
        //Grid menu
        let menuButtonsGrid = this.scene.add.group();

        let startX = -170; 
        let startY = -60;
        let cellWidth = 210; // Ancho de cada celda
        let cellHeight = 210; // Alto de cada celda

        buttonsData.forEach((buttonMenu: buttonMenu , index: number) => {
            let buttonImg = this.scene.add.image(0,0, buttonMenu.texture).setInteractive();

            if(buttonMenu.visible) {
                buttonImg.on('pointerup', () => {
                    this.handleMove(buttonMenu.coords);
                });
                buttonImg.on("pointerover", () => {
                    if (this.activeTween) this.activeTween.stop();
                    tweenButtonOver(buttonImg);
                });
                buttonImg.on("pointerout", () => {
                    if (this.activeTween) this.activeTween.stop();
                    tweenButtonOut(buttonImg);
                });
            }else {
                buttonImg.setAlpha(0.5);
            }

            menuButtonsGrid.add(buttonImg);

        });
        
        Phaser.Actions.GridAlign(menuButtonsGrid.getChildren(), {
            width: 2, // Cantidad de columnas
            height: 2, // Calcula automáticamente el número de filas
            cellWidth: cellWidth,
            cellHeight: cellHeight,
            x: startX,
            y: startY,
        });

        // <-- Grid de Opciones

        centerContainer.add(menuButtonsGrid.getChildren());


        //Left container <---


        this.add([
            topContainer,
            centerContainer,

        ]);

        console.log("CONTAINER STAT: ", this);

        this.scene.add.existing(this)
        //this.scene.cameras.main.ignore(this)

    }
}