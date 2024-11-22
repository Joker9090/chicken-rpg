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

        const backgroundLess = scene.add.rectangle(0, 0,  window.innerWidth, window.innerHeight, 0x000000, 0.5);
        backgroundLess.setInteractive();



        //Modals containers
        const topContainer = this.scene.add.container(0, -170);
        const leftContainer = this.scene.add.container(-150,0);
        const rightContainer = this.scene.add.container(150,0);

        //backgroundModal
        const modalBackground = this.scene.add.image(0, 0, "modalBackground").setOrigin(0.5);

        this.add([
            backgroundLess,
            modalBackground
        ]);

        const handleClose = () => {
            console.log("data?:", modalConfig);
            this.setVisible(!this.visible)
        }

        switch (modalConfig.type) {
            case modalType.QUEST:
                //TOP CONTAINER
                
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

                topContainer.add([
                    title_q,
                    btnExit,
                ]);
                
                //LEFT CONTAINER

                //@ts-ignore
                const photo_q = this.scene.add.image(-25,0, modalConfig.picture).setScale(1);

                leftContainer.add([
                    photo_q,
                ]);

                //RIGHT CONTAINER
                
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


                rightContainer.add([
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
                    topContainer,
                    leftContainer,
                    rightContainer,
                ]);

                break;
            case modalType.PC:
                
                //TOP CONTAINER
                const btnExit_p = this.scene.add.image(255, 0, "btnExit").setInteractive();

                btnExit_p.on('pointerup', () => {
                    handleClose();
                    console.log("btnExit");
                });
                btnExit_p.on("pointerover", () => {
                    console.log("hover");
                    btnExit_p.setAlpha(0.5);
                });
                btnExit_p.on("pointerout", () => {
                    console.log("hover out");
                    btnExit_p.setAlpha(1);
                });

                //@ts-ignore
                const title_p = this.scene.add.text(0, 5, modalConfig.title, {
                    fontFamily: "MontserratBold", 
                    fontStyle: "bold",
                    fontSize: '24px',
                    color: '#ffffff',
                }).setOrigin(0.5);

                topContainer.add([
                    title_p,
                    btnExit_p,
                ]);
                
                //LEFT CONTAINER

                //First element
                //@ts-ignore
                const photo_1_p = this.scene.add.image(-40,-40, "camaraShop").setScale(1).setAlpha(0.5).setInteractive();
                
                let select = false;
                photo_1_p.on('pointerup', () => {
                    photo_1_p.setTexture("camaraShopOn");
                    select = !select;
                });
                photo_1_p.on("pointerover", () => {
                    console.log("hover");
                    if(!select) {
                        photo_1_p.setTexture("camaraShop");
                        photo_1_p.setAlpha(1);
                    }
                });
                photo_1_p.on("pointerout", () => {
                    console.log("hover out");
                    if(!select) {
                        photo_1_p.setTexture("camaraShop");
                        photo_1_p.setAlpha(0.5);
                    }
                });

                const rewardBackground_1_p = this.scene.add.image(-80, 10,"barraTitle").setOrigin(0,-0.1).setScale(0.28,1.3);

                //@ts-ignore
                const reward_1_p = this.scene.add.text(-55, 30, modalConfig.reward, {
                    fontFamily: "MontserratSemiBold", 
                    fontSize: '24px',
                    color: '#ffffff',
                }).setOrigin(0.5);
                
                const coinIcon_1_p = this.scene.add.image(-20 , 30, "coin");

                //Second element

                //@ts-ignore
                const photo_2_p = this.scene.add.image(150,-40, "camaraShop").setScale(1).setAlpha(0.5).setInteractive();

                const rewardBackground_2_p = this.scene.add.image(110, 10,"barraTitle").setOrigin(0,-0.1).setScale(0.28,1.3);

                //@ts-ignore
                const reward_2_p = this.scene.add.text(135, 30, "-", {
                    fontFamily: "MontserratSemiBold", 
                    fontSize: '24px',
                    color: '#ffffff',
                }).setOrigin(0.5);
                
                const coinIcon_2_p = this.scene.add.image(160 , 30, "coin");

                //Third element
                //@ts-ignore
                const photo_3_p = this.scene.add.image(340,-40, "camaraShop").setScale(1).setAlpha(0.5).setInteractive();

                const rewardBackground_3_p = this.scene.add.image(300, 10,"barraTitle").setOrigin(0,-0.1).setScale(0.28,1.3);

                //@ts-ignore
                const reward_3_p = this.scene.add.text(315, 30, "-", {
                    fontFamily: "MontserratSemiBold", 
                    fontSize: '24px',
                    color: '#ffffff',
                }).setOrigin(0.5);
                
                const coinIcon_3_p = this.scene.add.image(350 , 30, "coin");

                leftContainer.add([
                    photo_1_p,
                    rewardBackground_1_p,
                    reward_1_p,
                    coinIcon_1_p,
                    photo_2_p,
                    rewardBackground_2_p,
                    reward_2_p,
                    coinIcon_2_p,
                    photo_3_p,
                    rewardBackground_3_p,
                    reward_3_p,
                    coinIcon_3_p,
                ]);

                //RIGHT CONTAINER

                rightContainer.add([
   
                ]);

                console.log("ENTRO QUEST");
                this.add([
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
            modalConfig.agreeFunction();
            handleClose();
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