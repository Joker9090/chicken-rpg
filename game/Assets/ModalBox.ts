import RPG, { modalType } from "../rpg";
import { ModalConfig } from "./ModalContainer";




export class ModalBox extends Phaser.GameObjects.Container {
    scene: RPG;
    agreeButton: Phaser.GameObjects.Image;
    cancelButton: Phaser.GameObjects.Image;
    constructor(
        scene: RPG,
        x: number,
        y: number,
        modalConfig: ModalConfig,
    ) {
        super(scene, x, y);
        this.scene = scene;

       /* modalBackground
        desafioTest
        barraTitle
        btnExit
        barritaOff
        barritaOn
        btn
        iconClock
        iconMoon
        iconSun
        iconSunrise
        iconSunset */

        const backgroundLess = scene.add.rectangle(0, 0,  window.innerWidth, window.innerHeight, 0x000000, 0.5);
        backgroundLess.setInteractive();

        this.add([
            backgroundLess,
        ]);

        const handleClose = () => {
            console.log("data?:", modalConfig);
            this.setVisible(!this.visible)
        }

        switch (modalConfig.type) {
            case modalType.QUEST:
                const modalBackground_q = this.scene.add.image(0, 0, "modalBackground").setOrigin(0.5);
                //TOP CONTAINER
                const topContainer_q = this.scene.add.container(0, -170);

                const btnExit = this.scene.add.image(255, 0, "btnExit").setInteractive();

                btnExit.on('pointerup', () => {
                    handleClose();
                    console.log("btnExit");
                });
                btnExit.on("pointerover", () => {
                    console.log("hover");
                    btnExit.setAlpha(0.5);
                });
                btnExit.on("pointerout", () => {
                    console.log("hover out");
                    btnExit.setAlpha(1);
                });

                //@ts-ignore
                const title_q = this.scene.add.text(0, 5, modalConfig.title, {
                    fontFamily: "MontserratBold", 
                    fontStyle: "bold",
                    fontSize: '24px',
                    color: '#ffffff',
                }).setOrigin(0.5);

                topContainer_q.add([
                    title_q,
                    btnExit,
                ]);
                
                //LEFT CONTAINER

                const leftContainer_q = this.scene.add.container(-150,0);
                //@ts-ignore
                const photo_q = this.scene.add.image(-25,0, modalConfig.picture).setScale(1);

                leftContainer_q.add([
                    photo_q,
                ]);

                //RIGHT CONTAINER
                
                const rightContainer_q = this.scene.add.container(150,0);
                //row 1
                //@ts-ignore
                const timeNumber_q = this.scene.add.text(-175, -100, modalConfig.time, {
                    fontFamily: "MontserratSemiBold", 
                    fontSize: '24px',
                    color: '#ffffff',
                }).setOrigin(0.5);
                const timeIcon_q =  this.scene.add.image(-145,-105, "iconClock").setOrigin(0.5);

                //row 2
                const subTitleBackground_1_q = this.scene.add.image(-185, -80,"barraTitle").setOrigin(0,-0.1).setScale(1);
                const subTitle_1_q = this.scene.add.text(-170, -70, "REQUISITOS", {
                    fontFamily: "MontserratSemiBold",
                    fontSize: '14px',
                    color: '#ffffff',
                });

                //row 3
                //@ts-ignore
                const text_q = this.scene.add.text(-170, -40, modalConfig.text, {
                    fontFamily: "MontserratSemiBold", 
                    fontSize: '14px',
                    color: '#ffffff',
                });

                //row 4
                const morningIcon_q = this.scene.add.image(-150, 10, "iconSunrise").setScale(1.2);
                const afternoonIcon_q = this.scene.add.image(-80, 10, "iconSun").setScale(1.2);
                const eveningIcon_q = this.scene.add.image(-10, 10, "iconSunset").setScale(1.2);
                const nightIcon_q = this.scene.add.image(60, 10, "iconMoon").setScale(1.2);

                //row 5
                const morningBar_q = this.scene.add.image(-150, 35, "barritaOn").setScale(1);
                const afternoonBar_q = this.scene.add.image(-80, 35, "barritaOff").setScale(1);
                const eveningBar_q = this.scene.add.image(-10, 35, "barritaOff").setScale(1);
                const nightBar_q = this.scene.add.image(60, 35, "barritaOff").setScale(1);

                //row 6

                const subTitleBackground_2_q = this.scene.add.image(-185, 55,"barraTitle").setOrigin(0,-0.1).setScale(1);
                const subTitle_2_q = this.scene.add.text(-170, 65, "RECOMPENSA", {
                    fontFamily: "MontserratSemiBold", 
                    fontSize: '14px',
                    color: '#ffffff',
                });

                //@ts-ignore
                const reward_q = this.scene.add.text(-170, 105, modalConfig.reward, {
                    fontFamily: "MontserratSemiBold", 
                    fontSize: '24px',
                    color: '#ffffff',
                }).setOrigin(0.5);
                
                const coinIcon = this.scene.add.image(-140 , 105, "coin");


                rightContainer_q.add([
                    timeNumber_q,
                    timeIcon_q,
                    subTitleBackground_1_q,
                    subTitle_1_q,
                    text_q,
                    morningIcon_q,
                    afternoonIcon_q,
                    eveningIcon_q,
                    nightIcon_q,
                    morningBar_q,
                    afternoonBar_q,
                    eveningBar_q,
                    nightBar_q,
                    subTitleBackground_2_q,
                    subTitle_2_q,
                    reward_q,
                    coinIcon
                ]);

                console.log("ENTRO QUEST");
                this.add([
                    modalBackground_q,
                    topContainer_q,
                    leftContainer_q,
                    rightContainer_q,
                ]);

                break;
            case modalType.PC:
                const modalBackground = this.scene.add.image(0, 0, "modalBackground-1").setOrigin(0.5);
                //TOP CONTAINER
                const topContainer = this.scene.add.container(0, -190);

                //@ts-ignore
                const title = this.scene.add.text(0, 0, modalConfig.title, {
                    fontSize: '24px',
                    color: '#000',
                }).setOrigin(0.5);

                const stars = this.scene.add.image(0, 70, "star").setScale(0.5);

                topContainer.add([
                    title,
                    stars
                ]);
                
                //LEFT CONTAINER
                const leftContainer = this.scene.add.container(-150,0);

                const photo = this.scene.add.image(-50,0, "person1");

                leftContainer.add([
                    photo,
                ]);

                //RIGHT CONTAINER
                const rightContainer = this.scene.add.container(150,0);

                rightContainer.add([
                    
                ]);

                console.log("ENTRO PC");
                this.add([
                    modalBackground,
                    topContainer,
                    leftContainer,
                    rightContainer,
                ]);
                break;
        
            default:
                break;
        }


        //Buttons Container
        const buttonsContainer = this.scene.add.container(0, 175);
        const leftButtonContainer = this.scene.add.container(-100, 0);
        const rightButtonContainer = this.scene.add.container(100, 0);

        //LEFT BUTTON
        this.agreeButton = this.scene.add.image(0, 0, "btn").setOrigin(0.5).setInteractive();

        const leftTextButton = this.scene.add.text(0, 0, "ACEPTAR", {
            fontFamily: "MontserratSemiBold", 
            fontSize: '16px',
            color: '#ffffff',
        }).setOrigin(0.5);

        this.agreeButton.on('pointerup', () => {
            handleClose()
            //this.agreeButton.setTexture("save");
        });

        this.agreeButton.on("pointerover", () => {
            console.log("hover");
            this.agreeButton.setAlpha(0.5);
            leftTextButton.setAlpha(0.5);
        });
        this.agreeButton.on("pointerout", () => {
            console.log("hover out");
            this.agreeButton.setAlpha(1);
            leftTextButton.setAlpha(1);
        });



        leftButtonContainer.add([
            this.agreeButton,
            leftTextButton
        ]);

        //RIGHT BUTTON
        this.cancelButton = this.scene.add.image(0 , 0, "btn").setOrigin(0.5).setInteractive();

        const rightTextButton = this.scene.add.text(0, 0, "CANCELAR", {
            fontFamily: "MontserratSemiBold", 
            fontSize: '16px',
            color: '#ffffff',
        }).setOrigin(0.5);

        this.cancelButton.on('pointerup', () => {
            handleClose()
            //this.agreeButton.setTexture("save");
        });

        this.cancelButton.on("pointerover", () => {
            console.log("hover");
            this.cancelButton.setAlpha(0.5);
            rightTextButton.setAlpha(0.5);
        });
        this.cancelButton.on("pointerout", () => {
            console.log("hover out");
            this.cancelButton.setAlpha(1);
            rightTextButton.setAlpha(1);
        });



        rightButtonContainer.add([
            this.cancelButton,
            rightTextButton
        ]);

        buttonsContainer.add([
            leftButtonContainer,
            rightButtonContainer,
        ]);

        this.add([
            buttonsContainer,
        ]);

 

        this.setVisible(true)

    }
}