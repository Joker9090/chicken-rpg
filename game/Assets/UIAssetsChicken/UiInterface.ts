import RPG from "@/game/rpg";
import Phaser from "phaser";
import ModalSettings from "./ModalSettings";


export class UIInterface extends Phaser.GameObjects.Container {
    scene: RPG;
    constructor(
        scene: RPG,
        x: number,
        y: number,
    ) {
        // @ts-ignore
        super(scene, x, y);
        this.scene = scene;

        const containerModalSettings = new ModalSettings(this.scene, window.innerWidth / 2, -window.innerHeight / 2);

        const handleClose = () => {
            containerModalSettings.setVisible(!containerModalSettings.visible)
        }


        const settingsIcon = this.scene.add.image(20, -20, "settingsIcon").setOrigin(0, 1).setInteractive().setScale(0.7);

        settingsIcon.on('pointerdown', () => {
            handleClose()
        })

        const helpIcon = this.scene.add.image(20, -80, "helpIcon").setOrigin(0, 1).setInteractive().setScale(0.7);

        helpIcon.on('pointerdown', () => {
            // handleHelp()
        })

        // check if is mobile 

        if (window.innerWidth < 900 && this.scene.UICamera) {
            settingsIcon.y = (window.innerHeight * -1) + 50
            settingsIcon.x = this.scene.UICamera?.width / 2 
            settingsIcon.setOrigin(0.5)

            const zoomInIcon = this.scene.add.image(this.scene.UICamera?.width - 80, -20, "settingsIcon").setOrigin(0, 1).setInteractive().setScale(0.7);

            zoomInIcon.on('pointerdown', () => {
                this.scene.eventEmitter?.emit("zoomIn", {});
                
            })
    
            const zoomOut = this.scene.add.image(this.scene.UICamera?.width - 80, -80, "settingsIcon").setOrigin(0, 1).setInteractive().setScale(0.7);
    
            zoomOut.on('pointerdown', () => {
                this.scene.eventEmitter?.emit("zoomOut", {});
            })
            this.add([
                // containerModalHelp,
                zoomInIcon,
                zoomOut,
            ])
            // add arrow movement buttons
            
            if(this.scene.player) {
                const leftButton = this.scene.add.image(20,-60, "settingsIcon").setOrigin(0, 1).setInteractive().setScale(0.5);
                leftButton.on('pointerdown', () => {
                    this.scene.eventEmitter?.emit("moveLeft", {});
                })
                const rightButton = this.scene.add.image(100, -60, "settingsIcon").setOrigin(0, 1).setInteractive().setScale(0.5);
                rightButton.on('pointerdown', () => {
                    this.scene.eventEmitter?.emit("moveRight", {});
                })
                const topButton = this.scene.add.image(60, -100, "settingsIcon").setOrigin(0, 1).setInteractive().setScale(0.5);
                topButton.on('pointerdown', () => {
                    this.scene.eventEmitter?.emit("moveTop", {});
                })
                const botButton = this.scene.add.image(60, -20, "settingsIcon").setOrigin(0, 1).setInteractive().setScale(0.5);
                botButton.on('pointerdown', () => {
                    this.scene.eventEmitter?.emit("moveBottom", {});
                })
                this.add([
                    // containerModalHelp,
                    leftButton,
                    rightButton,
                    topButton,
                    botButton
                ])
            }
            


        }
        
       



        this.add([
            // containerModalHelp,
            containerModalSettings,
            settingsIcon,
            // helpIcon,
        ])
    }
}
