import RPG from "@/game/rpg";
import { ModalConfig, ProductToBuy, modalType } from "../ModalTypes";
import EventsCenterManager from "../../../services/EventsCenter";
import { ModalBase } from "./ModalBase";
import { globalState } from "@/game/GlobalDataManager";
import { info } from "console";



export class ModalNews extends ModalBase {
    scene: RPG;
    agreeButton: Phaser.GameObjects.Image;
    activeTween: Phaser.Tweens.Tween | null = null;

    constructor(
        scene: RPG,
        x: number,
        y: number,
    ) {
        super(scene, x, y);
        this.scene = scene;

        const globalData: globalState = EventsCenterManager.emitWithResponse(EventsCenterManager.possibleEvents.GET_STATE, null)

        const allNews = globalData.news

        const availableNews = allNews.filter(news => !news.readed);

        const newsSelected = availableNews[Math.floor(Math.random() * availableNews.length)];
        EventsCenterManager.emit(this.eventCenter.possibleEvents.READ_NEWSPAPER, newsSelected.id);

        //Modals containers
        const topContainer = this.scene.add.container(0, -170);
        const leftContainer = this.scene.add.container(-150, 0);
        const rightContainer = this.scene.add.container(150, 0);

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


        // INFO CONTAINER
        const infoContainer = this.scene.add.container(0, 0);

        //do redondea esquinas de rectangleTitle

        const rectangleTitle = this.scene.add.rectangle(140, -105, 290, 80, 0xBAB8BC, 0.5).setOrigin(0.5);
        const rectangleDescription = this.scene.add.rectangle(140, 75, 290, 250, 0xF1EFF4, 0.5).setOrigin(0.5);
        //const image = this.scene.add.image(-100, 0, newsSelected.image).setOrigin(0.5).setScale(0.45).setRotation(-Math.PI / 4);
        const image = this.scene.add.image(-165, 45, newsSelected.image).setOrigin(0.5).setScale(0.5);
        const borderImage = this.scene.add.image(-165, 45, "bordeImgDiario").setOrigin(0.5).setScale(0.5);
        const title = this.scene.add.text(130, -105, newsSelected.title, {
            fontFamily: "MontserratBold",
            fontSize: '18px',
            color: '#ffffff',
            wordWrap: { width: 290, useAdvancedWrap: true }
        }).setOrigin(0.5);

    
        const description = this.scene.add.text(140, -20, newsSelected.description, {
            fontFamily: "MontserratRegular",
            fontSize: '16px',
            color: '#ffffff',
            wordWrap: { width: 290, useAdvancedWrap: true }
        }).setOrigin(0.5);
        /* const reward = this.scene.add.text(50, 50, `Recompensa: $${newsSelected.reward.money}`, {
            fontFamily: "MontserratRegular",
            fontSize: '16px',
            color: '#ffffff',
        }).setOrigin(0.5); */
        /* const time = this.scene.add.text(50, 100, `Tiempo: ${newsSelected.time} minutos`, {
            fontFamily: "MontserratRegular",
            fontSize: '16px',
            color: '#ffffff',
        }).setOrigin(0.5); */
        // const requirements = this.scene.add.text(0, 200, `Requisitos: ${newsSelected.requirements.join(", ")}`, {
        //     fontFamily: "MontserratRegular",
        //     fontSize: '16px',
        //     color: '#ffffff',
        // }).setOrigin(0.5);
        infoContainer.add([
            rectangleTitle,
            rectangleDescription,
            image,
            borderImage,
            title,
            description,
            //reward,
            //time,
            // requirements,
        ]);

        //backgroundModal
        const modalBackground = this.scene.add.image(0, 0, "diarioBackground").setOrigin(0.5).setScale(0.5);

        //LEFT BUTTON
        this.agreeButton = this.scene.add.image(0, 0, "btn").setOrigin(0.5).setInteractive();

        const leftTextButton = this.scene.add.text(0, 0, "CONTINUAR", {
            fontFamily: "MontserratSemiBold",
            fontSize: '16px',
            color: '#ffffff',
        }).setOrigin(0.5);



        //TOP CONTAINER
        const btnExit_p = this.scene.add.image(255, -40, "btnExit").setInteractive();

        btnExit_p.on('pointerup', () => {
            this.handleClose();
        });
        btnExit_p.on("pointerover", () => {
            //btnExit_p.setAlpha(0.5);
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOver(btnExit_p);
        });
        btnExit_p.on("pointerout", () => {
            //btnExit_p.setAlpha(1);
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOut(btnExit_p);
        });

        //@ts-ignore
        const title_p = this.scene.add.text(0, -25, "NEWS", {
            fontFamily: "MontserratBold",
            fontStyle: "bold",
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);

        topContainer.add([
            title_p,
            btnExit_p,
        ]);

        this.agreeButton.on('pointerup', () => { this.handleClose() });

        // this.add([
        //     topContainer,
        //     leftContainer,
        //     rightContainer,
        //     infoContainer,
        // ]);


        //Buttons Container
        const buttonsContainer = this.scene.add.container(130, 225);

        //LEFT BUTTON
        //this.agreeButton = this.scene.add.image(0, 0, "btn").setOrigin(0.5).setInteractive();


        this.agreeButton.on("pointerover", () => {
            //this.agreeButton.setAlpha(0.5);
            //leftTextButton.setAlpha(0.5);
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOver(buttonsContainer);
        });
        this.agreeButton.on("pointerout", () => {
            //this.agreeButton.setAlpha(1);
            //leftTextButton.setAlpha(1);
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOut(buttonsContainer);
        });



        buttonsContainer.add([
            this.agreeButton,
            leftTextButton,
        ]);


        this.modalContainerWithElements.add([
            modalBackground,
            topContainer,
            leftContainer,
            rightContainer,
            infoContainer,
            buttonsContainer
        ]);
    }
}