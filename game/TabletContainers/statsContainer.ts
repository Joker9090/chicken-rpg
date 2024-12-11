import { globalState, missionsType, newsType, transactionsType } from "../GlobalDataManager";
import EventsCenterManager from "../services/EventsCenter";

export class statsContainer extends Phaser.GameObjects.Container {
    scene: Phaser.Scene;
    closeButton: Phaser.GameObjects.Image;
    gobackButton: Phaser.GameObjects.Image;
    activeTween: Phaser.Tweens.Tween | null = null;
    eventCenter = EventsCenterManager.getInstance();

    handleGoback: Function;
    handleClose: Function;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        goback: Function,
        handleToClose: Function,

    ) {
        super(scene,x, y);
        this.scene = scene;
        this.handleGoback = goback;
        this.handleClose = handleToClose;

        const globalData: globalState = EventsCenterManager.emitWithResponse(EventsCenterManager.possibleEvents.GET_STATE, null)

        const tweenButtonOver = (_target: any) => {
            this.activeTween = this.scene.tweens.add({
                targets: _target,
                scaleX: 1.2,
                scaleY: 1.2,
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

        const hideButtons = (_target: any[]) => {
            this.activeTween = this.scene.tweens.add({
                targets: _target,
                alpha: 0,
                duration: 1000,
                ease: 'ease',
                onComplete: () => {
                    _target.forEach((element) => {
                        element.visible = false;
                    });
                }
            });
        }

        const showButtons = (_target: any[]) => {
            _target.forEach((element) => {
                element.visible = true;
            });
            this.activeTween = this.scene.tweens.add({
                targets: _target,
                alpha: 1,
                duration: 1000,
                ease: 'ease',
            });
        }


        //Menu containers
        const topContainer = this.scene.add.container(0, -170);
        const leftContainer = this.scene.add.container(-170, 5);
        const rightUpContainer = this.scene.add.container(150, -140);
        const rightDownContainer = this.scene.add.container(150, 55);

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

        this.gobackButton = this.scene.add.image(-375, 0, "tabletback").setScale(0.8).setInteractive();

        this.gobackButton.on('pointerup', () => {
            console.log("go back function: ", this.handleGoback);
            console.log("Goback");
            this.handleGoback();
        });
        this.gobackButton.on("pointerover", () => {
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOver(this.gobackButton);
        });
        this.gobackButton.on("pointerout", () => {
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOut(this.gobackButton,0.8);
        });


        topContainer.add([this.closeButton, this.gobackButton]);

        //Top container <---

        //LEFT CONTAINER ->

        const leftBackground = this.scene.add.image(0,0,"tabletStatLeft").setScale(0.5);

        const moneyText = this.scene.add.text(-20, -165, `${globalData.playerMoney}`, {fontFamily: "MontserratSemiBold", fontSize: 24, color: "#000000"});

        //Grid de transacciones -->
        let transactionsGridGroupAmount = this.scene.add.group();
        let transactionsGridGroupDescription = this.scene.add.group();

        let amountStartX = -115;
        let descriptionStartX = -50;
        let startY = -100;
        let rowHeight = 40;

        globalData.transactions.forEach((transaction: transactionsType, index: number) => {
            const amountText = transaction.amount > 0
                ? `+${transaction.amount} `
                : `${transaction.amount} `;


            //const dateText = this.scene.add.text(0, 0, transaction.date, { fontSize: '16px', color: '#ffffff' });
            const amount = this.scene.add.text(150, 0, amountText, {
                fontFamily: "MontserratSemiBold",
                fontSize: '16px',
                color: transaction.amount > 0 ? '#00ff00' : '#ff0000'
            });
            const description = this.scene.add.text(250, 0, transaction.description, { 
                fontFamily: "MontserratSemiBold",
                fontSize: '16px', 
                color: '#ffffff',
                align: 'right',// no hace nada 
             });

            const groupAmount = this.scene.add.group();
            //group.add(dateText);
            groupAmount.add(amount);

            const groupDescription = this.scene.add.group();
            groupDescription.add(description);



            Phaser.Actions.GridAlign(groupAmount.getChildren(), {
                width: 2,
                height: 1,
                cellWidth: 50,
                cellHeight: 80,
                x: amountStartX,
                y: startY + index * rowHeight
            });

            Phaser.Actions.GridAlign(groupDescription.getChildren(), {
                width: 2,
                height: 1,
                cellWidth: 50,
                cellHeight: 80,
                x: descriptionStartX,
                y: startY + index * rowHeight
            });

            
            groupAmount.getChildren().forEach(child => transactionsGridGroupAmount.add(child));
            groupDescription.getChildren().forEach(child => transactionsGridGroupDescription.add(child));
        });

        // <-- Grid de transacciones
  
        
        leftContainer.add([leftBackground, moneyText ]);

        leftContainer.add(transactionsGridGroupAmount.getChildren());
        leftContainer.add(transactionsGridGroupDescription.getChildren());

        //Left container <---

        //RightUp CONTAINER ->
        const rightUpBackground = this.scene.add.image(0,0,"tabletRightUp").setScale(0.5);

        const actualHappiness = this.scene.add.text(-100, -6, `${globalData.happiness.actualValue}`, {fontFamily: "MontserratSemiBold", fontSize: 24, color: "#000000"});
        const maxHappiness = this.scene.add.text(20, -6, `${globalData.happiness.maxValue}`, {fontFamily: "MontserratSemiBold", fontSize: 24, color: "#000000"});

        rightUpContainer.add([rightUpBackground, actualHappiness ,maxHappiness ]);

        //RightUp container <---

        //RightDown CONTAINER ->
        const rightDownBackground = this.scene.add.image(0,0,"tabletRightDown").setScale(0.5);


        //Grid de Misiones -->
        let misionsGridGroupDone = this.scene.add.group();
        let misionsGridGroupPaper = this.scene.add.group();

        let misionStartX = -150;
        let paperStartX = 5;
        let misionsStartY = -50;
        let misionRowHeight = 40;

        globalData.availableMissions.forEach((availableMission: missionsType, index: number) => {
            const misionTitle = availableMission.title;

            const amount = this.scene.add.text(150, 0, misionTitle, {
                fontFamily: "MontserratSemiBold",
                fontSize: '12px',
                color: '#000000'
            });

            const groupMisions = this.scene.add.group();
            groupMisions.add(amount);


            Phaser.Actions.GridAlign(groupMisions.getChildren(), {
                width: 1,
                height: 1,
                cellWidth: 30,
                cellHeight: 80,
                x: misionStartX,
                y: misionsStartY + index * misionRowHeight
            });


            groupMisions.getChildren().forEach(child => misionsGridGroupDone.add(child));
        
        });

        globalData.news.forEach((newPaper: newsType, index: number) => {

            if(newPaper.readed) {

                const misionTitle = newPaper.title;
                const newsTitle = this.scene.add.text(250, 0, misionTitle, { 
                    fontFamily: "MontserratSemiBold",
                    fontSize: '12px', 
                    color: '#000000',
                 });
                const groupPaper = this.scene.add.group();
                groupPaper.add(newsTitle);

                Phaser.Actions.GridAlign(groupPaper.getChildren(), {
                    width: 1,
                    height: 1,
                    cellWidth: 30,
                    cellHeight: 80,
                    x: paperStartX,
                    y: misionsStartY + index * misionRowHeight
                });
                groupPaper.getChildren().forEach(child => misionsGridGroupPaper.add(child));
            }

        });

        // <-- Grid de Misiones

        rightDownContainer.add([rightDownBackground, ]);
        rightDownContainer.add(misionsGridGroupDone.getChildren());
        rightDownContainer.add(misionsGridGroupPaper.getChildren());


        //RightDown container <---

        this.add([
            topContainer,
            leftContainer,
            rightUpContainer,
            rightDownContainer
        ]);

        console.log("CONTAINER STAT: ", this);

        this.scene.add.existing(this)
        //this.scene.cameras.main.ignore(this)

    }
}