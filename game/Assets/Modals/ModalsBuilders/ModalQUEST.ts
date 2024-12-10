import RPG from "@/game/rpg";
import { ModalConfig, ProductToBuy, modalType } from "../ModalTypes";
import EventsCenterManager from "../../../services/EventsCenter";
import { ModalBase } from "./ModalBase";
import { globalState } from "@/game/GlobalDataManager";
import { PinIsoSpriteBox } from "../../pinIsoSpriteBox";



export class ModalQUEST extends ModalBase {
    scene: RPG;
    agreeButton: Phaser.GameObjects.Image;
    cancelButton: Phaser.GameObjects.Image;
    activeTween: Phaser.Tweens.Tween | null = null;

    eventCenter = EventsCenterManager.getInstance();
    constructor(
        scene: RPG,
        x: number,
        y: number,
        pin: PinIsoSpriteBox | undefined
    ) {
        super(scene, x, y);
        this.scene = scene;

        const globalData: globalState = EventsCenterManager.emitWithResponse(EventsCenterManager.possibleEvents.GET_STATE, null)

        const availableMissions = globalData.availableMissions;

        const missionsSelected = availableMissions[Math.floor(Math.random() * availableMissions.length)];

        const handleAgreeModal = (amount: number, timePass: number) => {
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.MAKE_MISSION, missionsSelected.id);
            if (pin){
                pin.self.destroy();
            }
        }

        const modalConfig: ModalConfig = {
            type: modalType.QUEST,
            // requirements: missionsSelected.requirements,
            requires: "camera",
            requirePicture: "camaraWhite",
            title: missionsSelected.title,
            picture: "fotoCamara",
            // picture: missionsSelected.picture,
            time: missionsSelected.time,
            text: missionsSelected.description,
            reward: missionsSelected.reward.money,
            agreeFunction: handleAgreeModal,
        }

        const selectStates: boolean[] = (modalConfig.products ?? []).map(() => false);
        const createdProducts: { image: Phaser.GameObjects.Image, rewardBackground: Phaser.GameObjects.Image, coinIcon: Phaser.GameObjects.Image, text: Phaser.GameObjects.Text, isSelected: boolean }[] = [];
        //const globalDataManager = this.scene.game.scene.getScene("GlobalDataManager") as GlobalDataManager;
        const inventary = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_INVENTARY, null);

        //Modals containers
        const topContainer = this.scene.add.container(0, -170);
        const leftContainer = this.scene.add.container(-150, 0);
        const rightContainer = this.scene.add.container(150, 0);



        //backgroundModal
        const modalBackground = this.scene.add.image(0, 0, "modalBackground").setOrigin(0.5);

        //modalContainerWithElements.setAngle(35);

        //LEFT BUTTON
        this.agreeButton = this.scene.add.image(0, 0, "btn").setOrigin(0.5).setInteractive();

        const leftTextButton = this.scene.add.text(0, 0, "ACEPTAR", {
            fontFamily: "MontserratSemiBold",
            fontSize: '16px',
            color: '#ffffff',
        }).setOrigin(0.5);


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

        const tweenButtonOut = (_target: any) => {
            this.activeTween = this.scene.tweens.add({
                targets: _target,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Bounce.easeOut'
            });

        }

        if (modalConfig.products && modalConfig.products.length > 0) {
            selectStates.forEach((state, index) => {
                if (modalConfig.products && inventary.some((product: ProductToBuy) => product.title === modalConfig.products![index].title)) {
                    selectStates[index] = true;

                } else selectStates[index] = false;
            });
        }


        const btnExit = this.scene.add.image(255, 0, "btnExit").setInteractive();

        btnExit.on('pointerup', () => {
            this.handleClose();
        });
        btnExit.on("pointerover", () => {
            //btnExit.setAlpha(0.5);
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOver(btnExit);
        });
        btnExit.on("pointerout", () => {
            //btnExit.setAlpha(1);
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOut(btnExit);
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
        const photo_q = this.scene.add.image(-20, 10, modalConfig.picture).setScale(1);
        const graphics = this.scene.make.graphics();
        graphics.fillRoundedRect(-100, -100, 170, 220, 20);
        const mask = graphics.createGeometryMask();
        // photo_q.setMask(mask);

        leftContainer.add([
            // graphics,
            photo_q,
        ]);

        //RIGHT CONTAINER

        //row 1
        //@ts-ignore
        const timeNumber_q = this.scene.add.text(-175, -100, `${modalConfig.time}`, {
            fontFamily: "MontserratSemiBold",
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);
        const timeIcon_q = this.scene.add.image(-145, -105, "iconClock").setOrigin(0.5);

        //row 2
        const subTitleBackground_1_q = this.scene.add.image(-185, -80, "barraTitle").setOrigin(0, -0.1).setScale(1);
        const subTitle_1_q = this.scene.add.text(-170, -70, "REQUISITOS", {
            fontFamily: "MontserratSemiBold",
            fontSize: '14px',
            color: '#ffffff',
        });

        //row 3
        //@ts-ignore
        const requirePicture = this.scene.add.image(-160, -30, modalConfig.requirePicture).setScale(1);

        //Check si tiene el objeto
        const haveObject = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_OBJECTINVENTARY, modalConfig.requires);
        if (haveObject != undefined) {
            requirePicture.setTint(0x00ff00);
            this.agreeButton.setAlpha(1);
            leftTextButton.setAlpha(1);
        } else {
            requirePicture.setTint(0xff0000);
            this.agreeButton.setAlpha(0.5);
            leftTextButton.setAlpha(0.5);
        }

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

        const subTitleBackground_2_q = this.scene.add.image(-185, 55, "barraTitle").setOrigin(0, -0.1).setScale(1);
        const subTitle_2_q = this.scene.add.text(-170, 65, "RECOMPENSA", {
            fontFamily: "MontserratSemiBold",
            fontSize: '14px',
            color: '#ffffff',
        });

        //@ts-ignore
        const reward_q = this.scene.add.text(-170, 105, `${modalConfig.reward}`, {
            fontFamily: "MontserratSemiBold",
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);

        const coinIcon = this.scene.add.image(-140, 105, "coin");


        rightContainer.add([
            timeNumber_q,
            timeIcon_q,
            subTitleBackground_1_q,
            subTitle_1_q,
            requirePicture,
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

        this.add([
            topContainer,
            leftContainer,
            rightContainer,
        ]);

        this.agreeButton.on('pointerup', () => {

            if (haveObject != undefined) {
                modalConfig.agreeFunction(modalConfig.reward, modalConfig.time);
                this.handleClose();
            }
        });


        //Buttons Container
        const buttonsContainer = this.scene.add.container(0, 175);
        const leftButtonContainer = this.scene.add.container(-100, 0);
        const rightButtonContainer = this.scene.add.container(100, 0);

        //LEFT BUTTON
        //this.agreeButton = this.scene.add.image(0, 0, "btn").setOrigin(0.5).setInteractive();



        //not enough money text
        const leftTextNotMoney = this.scene.add.text(0, -30, "NO TIENES SUFICIENTE DINERO", {
            fontFamily: "MontserratSemiBold",
            fontSize: '14px',
            color: '#ff0011',
        }).setOrigin(0.5).setVisible(false);




        this.agreeButton.on("pointerover", () => {
            //this.agreeButton.setAlpha(0.5);
            //leftTextButton.setAlpha(0.5);
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOver(leftButtonContainer);
        });
        this.agreeButton.on("pointerout", () => {
            //this.agreeButton.setAlpha(1);
            //leftTextButton.setAlpha(1);
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOut(leftButtonContainer);
        });



        leftButtonContainer.add([
            this.agreeButton,
            leftTextButton,
            leftTextNotMoney
        ]);

        //RIGHT BUTTON
        this.cancelButton = this.scene.add.image(0, 0, "btn").setOrigin(0.5).setInteractive();

        const rightTextButton = this.scene.add.text(0, 0, "CANCELAR", {
            fontFamily: "MontserratSemiBold",
            fontSize: '16px',
            color: '#ffffff',
        }).setOrigin(0.5);

        this.cancelButton.on('pointerup', () => {
            leftTextNotMoney.setVisible(false);
            leftTextButton.setAlpha(1);
            this.agreeButton.setAlpha(1);
            this.handleClose()
        });

        this.cancelButton.on("pointerover", () => {
            //this.cancelButton.setAlpha(0.5);
            //rightTextButton.setAlpha(0.5);
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOver(rightButtonContainer);
        });
        this.cancelButton.on("pointerout", () => {
            //this.cancelButton.setAlpha(1);
            //rightTextButton.setAlpha(1);
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOut(rightButtonContainer);
        });



        rightButtonContainer.add([
            this.cancelButton,
            rightTextButton
        ]);

        buttonsContainer.add([
            leftButtonContainer,
            rightButtonContainer,
        ]);


        this.modalContainerWithElements.add([
            modalBackground,
            topContainer,
            leftContainer,
            rightContainer,
            buttonsContainer
        ]);

        this.setVisible(true)

    }
}