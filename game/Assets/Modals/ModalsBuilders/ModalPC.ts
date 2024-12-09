import RPG from "@/game/rpg";
import { ModalConfig, ProductToBuy, modalType } from "../ModalTypes";
import EventsCenterManager from "../../../services/EventsCenter";
import { ModalBase } from "./ModalBase";



export class ModalPC extends ModalBase {
    scene: RPG;
    agreeButton: Phaser.GameObjects.Image;
    cancelButton: Phaser.GameObjects.Image;
    activeTween: Phaser.Tweens.Tween | null = null;

    constructor(
        scene: RPG,
        x: number,
        y: number,
    ) {
        super(scene, x, y);
        this.scene = scene;

        const handleAgreeModalRoom = (bought: ProductToBuy | ProductToBuy[]) => {
            if (bought instanceof Array) {
                this.eventCenter.emitEvent(this.eventCenter.possibleEvents.BUY_ITEMS, bought);
            } else {
                this.eventCenter.emitEvent(this.eventCenter.possibleEvents.BUY_ITEM, bought);
            }
        }
        // separar items que van al shop de los que son el inventario
        const modalConfig: ModalConfig = {
            type: modalType.PC,
            title: "MERCADO DE PULGAS ONLINE",
            picture: "desafioTest2",
            text: "CAMARA",
            reward: 100,
            products: [
                {
                    title: "camera",
                    picture: "camaraShop",
                    pictureOn: "camaraShopOn",
                    text: "CAMARA",
                    reward: 100,
                }, {
                    title: "otro",
                    picture: "camaraShop",
                    pictureOn: "camaraShopOn",
                    text: "otro",
                    reward: 100,
                }, {
                    title: "CAMARA3",
                    picture: "camaraShop",
                    pictureOn: "camaraShop",
                    text: "CAMARA",
                    reward: 0,
                }
            ],
            agreeFunction: handleAgreeModalRoom,
        }

        const selectStates: boolean[] = (modalConfig.products ?? []).map(() => false);
        const createdProducts: { image: Phaser.GameObjects.Image, rewardBackground: Phaser.GameObjects.Image, coinIcon: Phaser.GameObjects.Image, text: Phaser.GameObjects.Text, isSelected: boolean }[] = [];

        const inventary = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_INVENTARY, null);

        //Modals containers
        const topContainer = this.scene.add.container(0, -170);
        const leftContainer = this.scene.add.container(-150, 0);
        const rightContainer = this.scene.add.container(150, 0);

        //backgroundModal
        const modalBackground = this.scene.add.image(0, 0, "modalBackground").setOrigin(0.5);

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

        const baseX = -40;
        const baseY = -40;
        const offsetX = 190;

        //LEFT CONTAINER
        modalConfig.products?.forEach((product, index) => {
            const x = baseX + index * offsetX;
            const y = baseY;

            let isSelected = selectStates[index];

            const productImage = this.scene.add.image(x, y, product.picture)
                .setScale(1)
                .setAlpha(0.5)
                .setInteractive();


            if (selectStates[index]) {
                productImage.setTexture(product.pictureOn);
            } else {
                if (product.reward > 0) {
                    // if(inventary.playerMoney >= product.reward){
                    productImage.on('pointerup', () => {
                        isSelected = !isSelected;
                        productImage.setTexture(isSelected ? product.pictureOn : product.picture);
                        selectStates[index] = isSelected;
                    });
                    //}
                    productImage.on("pointerover", () => {
                        if (!isSelected) {
                            productImage.setTexture(product.picture);
                            productImage.setAlpha(1);
                        }
                    });
                    productImage.on("pointerout", () => {
                        if (!isSelected) {
                            productImage.setTexture(product.picture);
                            productImage.setAlpha(0.5);
                        }
                    });
                }
            }





            const rewardBackground = this.scene.add.image(x - 40, 10, "barraTitle")
                .setOrigin(0, -0.1)
                .setScale(0.28, 1.3);


            const rewardText = this.scene.add.text(x - 15, 30, `${product.reward}`, {
                fontFamily: "MontserratSemiBold",
                fontSize: '24px',
                color: '#ffffff',
            }).setOrigin(0.5);


            const coinIcon = this.scene.add.image(x + 20, 30, "coin");

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

            const updatedProductsBought = modalConfig.products?.map((product, index) => ({
                ...product,
                isSelected: selectStates[index],
            }));

            const filteredProducts = updatedProductsBought?.filter(product => product.isSelected === true);

            const boughtProductsOrProduct = filteredProducts?.length === 1
                ? filteredProducts[0]
                : filteredProducts;

            if (filteredProducts && filteredProducts?.length === 1) {
                let cost = filteredProducts[0].reward;
                const playerState = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, null);
                if (playerState.playerMoney >= cost) {
                    leftTextNotMoney.setVisible(false);
                    modalConfig.agreeFunction(boughtProductsOrProduct);
                    this.handleClose();
                    //TODO- MEJORAR ESTO
                } else if (!filteredProducts.find(product => product.title == inventary.find((inventaryProduct: ProductToBuy) => inventaryProduct.title == product.title)?.title)) {
                    leftTextNotMoney.setVisible(true);
                    this.agreeButton.setAlpha(0.5);
                    leftTextButton.setAlpha(0.5);
                } else {
                    this.handleClose();
                }
            } else if (filteredProducts && filteredProducts?.length > 1) {
                let cost = filteredProducts.reduce((acc, product) => acc + product.reward, 0);
                const playerState = this.eventCenter.emitWithResponse(this.eventCenter.possibleEvents.GET_STATE, null);
                if (playerState.playerMoney >= cost) {
                    leftTextNotMoney.setVisible(false);
                    modalConfig.agreeFunction(boughtProductsOrProduct);
                    this.handleClose();
                    //TODO- MEJORAR ESTO
                } else if (!filteredProducts.find(product => product.title == inventary.find((inventaryProduct: ProductToBuy) => inventaryProduct.title == product.title)?.title)) {
                    leftTextNotMoney.setVisible(true);
                    this.agreeButton.setAlpha(0.5);
                    leftTextButton.setAlpha(0.5);
                } else {
                    this.handleClose();
                }

            } else {
                this.handleClose();
            }
        });

        this.add([
            topContainer,
            leftContainer,
            rightContainer,
        ]);


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
    }
}