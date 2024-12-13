import RPG from "@/game/rpg";
import { Inventory, ModalConfig, ProductToBuy, modalType } from "../ModalTypes";
import EventsCenterManager from "../../../services/EventsCenter";
import { ModalBase } from "./ModalBase";



export class ModalPC extends ModalBase {
    scene: RPG;
    agreeButton: Phaser.GameObjects.Image;
    cancelButton: Phaser.GameObjects.Image;
    activeTween: Phaser.Tweens.Tween | null = null;
    canBuy: boolean = false;
    constructor(
        scene: RPG,
        x: number,
        y: number,
    ) {
        super(scene, x, y);
        this.scene = scene;

        const handleAgreeModalRoom = (bought: ProductToBuy[]) => {
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.BUY_ITEMS, bought);
            // if (bought instanceof Array) {
            // } else {
            //     this.eventCenter.emitEvent(this.eventCenter.possibleEvents.BUY_ITEM, bought);
            // }
        }
        // separar items que van al shop de los que son el inventario
        const modalConfig = {
            type: modalType.PC,
            title: "MERCADO DE PULGAS ONLINE",
            picture: "desafioTest2",
            text: "CAMARA",
            products: [
                {
                    id: 1,
                    title: "Bicicleta",
                    picture: "bicicletaOff",
                    pictureOn: "bicicletaOn",
                    text: "Bicicleta",
                    reward: 200,
                    hasIt: false,
                    roomInformation: {
                        "assetInRoom": "bicicle",
                        "frontContainer": true
                    }
                },
                {
                    id: 2,
                    title: "Cámara de fotos",
                    picture: "camaraShop",
                    pictureOn: "camaraShopOn",
                    text: "CAMARA",
                    reward: 100,
                    hasIt: false,
                    roomInformation: {
                        "assetInRoom": "camera",
                        "frontContainer": true
                    }
                }, {
                    id: 3,
                    title: "Curso de fotografía",
                    picture: "certificadoOff",
                    pictureOn: "certificadoOn",
                    text: "Curso de fotografía",
                    reward: 100,
                    hasIt: false,
                    roomInformation: {
                        assetInRoom: "degree",
                        frontContainer: true
                    }
                },
                {
                    id: 4,
                    title: "Mochila de delivery",
                    picture: "bagOff",
                    pictureOn: "bagOn",
                    text: "Mochila de delivery",
                    reward: 100,
                    hasIt: false,
                    roomInformation: {
                        assetInRoom: "",//TODO AGREGAR ASSET CUANDO ESTE
                        frontContainer: false
                    }
                }
            ],
            agreeFunction: handleAgreeModalRoom,
        }

        const globalState = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, null);
        const inventary = globalState.inventary;
        modalConfig.products?.forEach((product, index) => {
            if (inventary.some((item: Inventory) => item.id === product.id)) {
                product.hasIt = true;
            }
        })

        console.log(modalConfig)
        const selectedItems: any = []

        const selectStates: boolean[] = (modalConfig.products ?? []).map(() => false);
        const createdProducts: { image: Phaser.GameObjects.Image, rewardBackground: Phaser.GameObjects.Image, coinIcon: Phaser.GameObjects.Image, text: Phaser.GameObjects.Text, isSelected: boolean }[] = [];


        //Modals containers
        const topContainer = this.scene.add.container(0, -200);
        const leftContainer = this.scene.add.container(-150, 0);
        const rightContainer = this.scene.add.container(150, 0);

        //backgroundModal
        const modalBackground = this.scene.add.image(0, 0, "modalBackground").setOrigin(0.5).setScale(1.2);

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
                if (modalConfig.products && inventary.some((item: Inventory) => item.id === modalConfig.products![index].id)) {
                    selectStates[index] = true;
                } else selectStates[index] = false;
            });
        }


        //TOP CONTAINER
        const btnExit_p = this.scene.add.image(255, 0, "btnExit").setInteractive();

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

        const baseX = 60;
        const baseY = -80;
        const offsetX = 190;
        const offsetY = 170; // Distancia vertical entre filas

        const checkMoney = () => {
            let totalAmount = 0
            selectedItems.forEach((product: ProductToBuy) => {
                totalAmount += product.reward;
            })
            if (totalAmount > globalState.playerMoney) {
                leftTextNotMoney.setVisible(true);
                this.agreeButton.setAlpha(0.5);
                leftTextButton.setAlpha(0.5);
                this.canBuy = false;
            } else {
                leftTextNotMoney.setVisible(false);
                this.agreeButton.setAlpha(1);
                leftTextButton.setAlpha(1);
                this.canBuy = true;
            }
        }

        //LEFT CONTAINER
        modalConfig.products?.forEach((product, index) => {
            const x = index < 2
                ? baseX + index * offsetX // Primera fila
                : baseX + (index - 2) * offsetX; // Misma alineación horizontal para la segunda fila

            const y = index < 2
                ? baseY // Primera fila
                : baseY + offsetY; // Segunda fila, desplazada hacia abajo

            let isSelected = selectStates[index];

            const productImage = this.scene.add.image(x, y, product.picture)
                .setScale(1)
                .setAlpha(0.5)
                .setInteractive();


            if (product.hasIt) {
                productImage.setTexture(product.pictureOn);
            } else {
                if (product.reward > 0) {
                    // if(inventary.playerMoney >= product.reward){
                    productImage.on('pointerup', () => {
                        //@ts-ignore
                        if (!selectedItems.includes(product)) {
                            selectedItems.push(product);
                            productImage.setTexture(product.pictureOn);
                            checkMoney();
                        } else {
                            //@ts-ignore
                            selectedItems.splice(selectedItems.indexOf(product), 1);
                            productImage.setTexture(product.picture);
                            checkMoney();
                        }

                        // isSelected = !isSelected;
                        // productImage.setTexture(isSelected ? product.pictureOn : product.picture);
                        // selectStates[index] = isSelected;
                    });
                    //}
                    productImage.on("pointerover", () => {
                        //@ts-ignore
                        if (!selectedItems.includes(product)) {
                            productImage.setAlpha(1);
                        }
                    });
                    productImage.on("pointerout", () => {
                        //@ts-ignore
                        if (!selectedItems.includes(product)) {
                            productImage.setAlpha(0.5);
                        }
                    });
                }
            }



            const rewardBackground = this.scene.add.image(x - 40, y + 50, "barraTitle")
                .setOrigin(0, -0.1)
                .setScale(0.28, 1.3);


            const rewardText = this.scene.add.text(x - 15, y + 70, `${product.reward}`, {
                fontFamily: "MontserratSemiBold",
                fontSize: '24px',
                color: '#ffffff',
            }).setOrigin(0.5);


            const coinIcon = this.scene.add.image(x + 20, y + 70, "coin");

            createdProducts.push({ image: productImage, rewardBackground: rewardBackground, coinIcon: coinIcon, text: rewardText, isSelected: isSelected });
        });


        leftContainer.add([
            ...createdProducts.map(product => [product.image, product.rewardBackground, product.coinIcon, product.text]).flat(),
        ]);

        //RIGHT CONTAINER

        rightContainer.add([
        ]);

        //Agree button config
        this.agreeButton.on('pointerup', () => {
            if (!this.canBuy) return;
            modalConfig.agreeFunction(selectedItems);
            this.handleClose();
        });

        this.add([
            topContainer,
            leftContainer,
            rightContainer,
        ]);

        //Buttons Container
        const buttonsContainer = this.scene.add.container(0, 175);
        const leftButtonContainer = this.scene.add.container(-100, 40);
        const rightButtonContainer = this.scene.add.container(100, 40);

        //LEFT BUTTON
        //this.agreeButton = this.scene.add.image(0, 0, "btn").setOrigin(0.5).setInteractive();



        //not enough money text
        const leftTextNotMoney = this.scene.add.text(0, 15, "NO TIENES SUFICIENTE DINERO", {
            fontFamily: "MontserratSemiBold",
            fontSize: '12px',
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
            /*leftTextNotMoney*/
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
            leftTextNotMoney,
        ]);

        this.modalContainerWithElements.add([
            modalBackground,
            topContainer,
            leftContainer,
            rightContainer,
            buttonsContainer,
        ]);
    }
}