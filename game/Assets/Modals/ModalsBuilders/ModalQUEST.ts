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
            // this.eventCenter.emitEvent(this.eventCenter.possibleEvents.INPROGRESS_MISSION, missionsSelected.id);
            if (pin) {
                pin.self.destroy();
            }
        }

        // fotoCamara
        // walkDogs
        // defaultImage
        // deliverFood

        const modalConfig: ModalConfig = {
            type: modalType.QUEST,
            requirements: missionsSelected.requirements,
            // requires: "camera",
            // requirePicture: "camaraWhite",
            title: missionsSelected.title,
            picture: missionsSelected.picture,
            // picture: missionsSelected.picture,
            time: missionsSelected.time,
            text: missionsSelected.description,
            reward: missionsSelected.reward,
            agreeFunction: handleAgreeModal,
        }

        //const globalDataManager = this.scene.game.scene.getScene("GlobalDataManager") as GlobalDataManager;
        const inventary = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_INVENTARY, null);

        //Modals containers
        const topContainer = this.scene.add.container(0, -170);
        const leftContainer = this.scene.add.container(-150, 0);
        const rightContainer = this.scene.add.container(150, 10);



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
        const photo_q = this.scene.add.image(-20, -2, modalConfig.picture).setScale(1);
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
        const description = this.scene.add.text(-24, -110, `${modalConfig.text}`, {
            fontFamily: "MontserratSemiBold",
            fontSize: '14px',
            color: '#ffffff',
            wordWrap: { width: 300 },
            fixedWidth: 300,
            fixedHeight: 0,
        }).setOrigin(0.5).setAlign('left').setLineSpacing(3);
        //const timeIcon_q = this.scene.add.image(-145, -105, "iconClock").setOrigin(0.5);

        //row 2
        const subTitleBackground_1_q = this.scene.add.image(-185, -80, "barraTitle").setOrigin(0, -0.1).setScale(1);
        const subTitle_1_q = this.scene.add.text(-170, -70, "REQUISITOS", {
            fontFamily: "MontserratSemiBold",
            fontSize: '14px',
            color: '#ffffff',
        });

        //row 3
        let haveObjects: boolean[] = []
     
        const requirementsData = globalData.missionRequirements.filter((requirement) => modalConfig.requirements.includes(requirement.id));

        for (let i = 0; i < requirementsData.length; i++) {
            //@ts-ignore
            const requireItem = this.scene.add.image(-160 - i * -30, -30, requirementsData[i].miniImageModal)
            rightContainer.add(requireItem);
            //Check si tiene el objeto
            const haveObject = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.CHECK_MISSION_REQUIREMENTS, requirementsData[i]);
            if (haveObject) {
                requireItem.setTint(0x00ff00);
                this.agreeButton.setAlpha(1);
                leftTextButton.setAlpha(1);
                haveObjects.push(true);
            } else {
                requireItem.setTint(0xff0000);
                this.agreeButton.setAlpha(0.5);
                leftTextButton.setAlpha(0.5);
                haveObjects.push(false);
            }
        }

        //row 4
        const morningIcon_q = this.scene.add.image(-150, 10, "iconSunrise").setScale(1.2);
        const afternoonIcon_q = this.scene.add.image(-80, 10, "iconSun").setScale(1.2);
        const eveningIcon_q = this.scene.add.image(-10, 10, "iconSunset").setScale(1.2);
        const nightIcon_q = this.scene.add.image(60, 10, "iconMoon").setScale(1.2);
        const blocksOfTime = [morningIcon_q, afternoonIcon_q, eveningIcon_q, nightIcon_q];
        //row 5

        const morningBar_q = this.scene.add.image(-150, 35, modalConfig.time > 0 ? "barritaOn" : "barritaOff").setScale(1);
        const afternoonBar_q = this.scene.add.image(-80, 35, modalConfig.time > 1 ? "barritaOn" : "barritaOff").setScale(1);
        const eveningBar_q = this.scene.add.image(-10, 35, modalConfig.time > 2 ? "barritaOn" : "barritaOff").setScale(1);
        const nightBar_q = this.scene.add.image(60, 35, modalConfig.time > 3 ? "barritaOn" : "barritaOff").setScale(1);
        const blocksOfTimeBar = [morningBar_q, afternoonBar_q, eveningBar_q, nightBar_q];

        if (modalConfig.time + globalData.timeOfDay <= 4) {
            haveObjects.push(true)
        } else {
            haveObjects.push(false)
            //timeNumber_q.setTint(0xff0000);
            this.agreeButton.setAlpha(0.5);
            leftTextButton.setAlpha(0.5);
            for (let i = 0; i < modalConfig.time; i++) {
                blocksOfTime[i].setTint(0xff0000);
                blocksOfTimeBar[i].setTint(0xff0000);
            }
        }

        //row 6

        const subTitleBackground_2_q = this.scene.add.image(-185, 55, "barraTitle").setOrigin(0, -0.1).setScale(1);
        const subTitle_2_q = this.scene.add.text(-170, 65, "RECOMPENSA", {
            fontFamily: "MontserratSemiBold",
            fontSize: '14px',
            color: '#ffffff',
        });

        //@ts-ignore
        const reward_q = this.scene.add.text(-160, 110, `${modalConfig.reward.money}`, {
            fontFamily: "MontserratSemiBold",
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);

        const coinIcon = this.scene.add.image(-120, 110, "coinModalIcon");

        const reward_q2 = this.scene.add.text(-60, 110, `${modalConfig.reward.reputation}`, {
            fontFamily: "MontserratSemiBold",
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);

        const reputationIcon = this.scene.add.image(-30, 110, "reputationModalIcon");

        const reward_q3 = this.scene.add.text(40, 110, `${modalConfig.reward.happiness}`, {
            fontFamily: "MontserratSemiBold",
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);

        const happinessIcon = this.scene.add.image(70, 110, "happinessModalIcon");


        rightContainer.add([
            /*timeNumber_q,*/
            /*timeIcon_q,*/
            description,
            subTitleBackground_1_q,
            subTitle_1_q,
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
            coinIcon,
            reward_q2,
            reputationIcon,
            reward_q3,
            happinessIcon,
        ]);

        this.add([
            topContainer,
            leftContainer,
            rightContainer,
        ]);

        const canDoMission = haveObjects.every((haveObject) => haveObject);

        if (!canDoMission) {
            this.agreeButton.setAlpha(0.5);
                leftTextButton.setAlpha(0.5);
        } else {
            this.agreeButton.setAlpha(1);
            leftTextButton.setAlpha(1);
        }

        this.agreeButton.on('pointerup', () => {
            // check if haveObjects is all trues
            if (canDoMission) {
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