import RPG from "@/game/rpg";

export default class ModalSettings extends Phaser.GameObjects.Container {

    scene: RPG;

    timer?: Phaser.GameObjects.Image;

    exitButton: Phaser.GameObjects.Image;
    cancelButton: Phaser.GameObjects.Image;
    saveButton: Phaser.GameObjects.Image;
    texturesExit: string[] = ["exit", "exitClick", "exitHover"];
    texturesSave: string[] = ["save", "saveClick", "saveHover"];
    texturesCancel: string[] = ["cancel", "cancelClick", "cancelHover"];

    varVolEmpty: Phaser.GameObjects.Image;
    varVolFull: Phaser.GameObjects.Image;
    selectorVolume: Phaser.GameObjects.Image;

    varMusicEmpty: Phaser.GameObjects.Image;
    varMusicFull: Phaser.GameObjects.Image;
    selectorMusic: Phaser.GameObjects.Image;

    constructor(
        scene: RPG,
        x: number,
        y: number,
    ) {
        // @ts-ignore
        super(scene, x, y);
        this.scene = scene;

        const modalBack = this.scene.add.image(0, 0, "background").setOrigin(0.5)

        const handleClose = () => {
            this.setVisible(!this.visible)
        }

        // EXIT BUTTON
        this.exitButton = this.scene.add.image(modalBack.width / 2 - 30, -modalBack.height / 2 + 15, "exit").setOrigin(1, 0).setInteractive().setScale(0.5)
        this.exitButton.on('pointerdown', () => {
            this.exitButton.setTexture(this.texturesExit[2])
        })
        this.exitButton.on('pointerover', () => {
            this.exitButton.setTexture(this.texturesExit[1])
        })
        this.exitButton.on('pointerout', () => {
            this.exitButton.setTexture(this.texturesExit[0])
        })
        this.exitButton.on('pointerup', () => {
            handleClose()
            this.exitButton.setTexture(this.texturesExit[0])
        })
        // CANCEL BUTTON
        this.cancelButton = this.scene.add.image(140, 120, "cancel").setOrigin(0.5).setInteractive().setScale(.7)
        this.cancelButton.on('pointerdown', () => {
            this.cancelButton.setTexture(this.texturesCancel[2])
        })
        this.cancelButton.on('pointerover', () => {
            this.cancelButton.setTexture(this.texturesCancel[1])
        })
        this.cancelButton.on('pointerout', () => {
            this.cancelButton.setTexture(this.texturesCancel[0])
        })
        this.cancelButton.on('pointerup', () => {
            handleClose()
            this.cancelButton.setTexture(this.texturesCancel[0])
        })
        // SAVE BUTTON
        this.saveButton = this.scene.add.image(-140, 120, "save").setOrigin(0.5).setInteractive().setScale(.7)
        this.saveButton.on('pointerdown', () => {
            this.saveButton.setTexture(this.texturesSave[2])
        })
        this.saveButton.on('pointerover', () => {
            this.saveButton.setTexture(this.texturesSave[1])
        })
        this.saveButton.on('pointerout', () => {
            this.saveButton.setTexture(this.texturesSave[0])
        })
        this.saveButton.on('pointerup', () => {
            handleClose()
            this.saveButton.setTexture(this.texturesSave[0])
        })
        // VOLUMEN
        this.varVolEmpty = this.scene.add.image(0, -100, "varEmpty").setOrigin(0, 0.5).setScale(0.5, 1)
        this.varVolFull = this.scene.add.image(0, -100, "varFull").setOrigin(0, 0.5).setScale(0.25, 1)
        const position = (this.varVolEmpty.width) / 4 - 50
        this.varVolEmpty.setPosition(-position, -100)
        this.varVolFull.setPosition(-position, -100)
        this.selectorVolume = this.scene.add.image(50, -100, "varSelector").setScale(0.6).setInteractive({ draggable: true })
        this.selectorVolume.on('drag', (pointer: any, newPos: number, dragX: number) => {
            dragX = Phaser.Math.Clamp(newPos, -140, 240);
            this.selectorVolume?.setPosition(dragX, -100);
            const scaler = (dragX + 140) / 380 * 0.5
            this.varVolFull.setScale(scaler, 1)
        })
        const textVol = this.scene.add.text(-position - 100, -100, "VOLUME", {
            color: "black",
            fontSize: 20,
            fontStyle: "bold",
        }).setOrigin(0.5)
        // MUSIC
        this.varMusicEmpty = this.scene.add.image(0, -100, "varEmpty").setOrigin(0, 0.5).setScale(0.5, 1)
        this.varMusicFull = this.scene.add.image(0, -100, "varFull").setOrigin(0, 0.5).setScale(0.25, 1)
        this.varMusicEmpty.setPosition(-position, 0)
        this.varMusicFull.setPosition(-position, 0)
        this.selectorMusic = this.scene.add.image(50, 0, "varSelector").setScale(0.6).setInteractive({ draggable: true })
        this.selectorMusic.on('drag', (pointer: any, newPos: number, dragX: number) => {
            dragX = Phaser.Math.Clamp(newPos, -140, 240);
            this.selectorMusic?.setPosition(dragX, 0)
            const scaler = (dragX + 140) / 380 * 0.5
            this.varMusicFull.setScale(scaler, 1)
        })
        const textMusic = this.scene.add.text(-position - 100, -0, "MUSIC", {
            color: "black",
            fontSize: 20,
            fontStyle: "bold",
        }).setOrigin(0.5)

        this.add([
            modalBack,
            this.exitButton,
            this.cancelButton,
            this.saveButton,
            this.varVolEmpty,
            this.varVolFull,
            this.varMusicEmpty,
            this.varMusicFull,
            textVol,
            textMusic,
            this.selectorMusic,
            this.selectorVolume,

        ])

        this.setVisible(false)
    }
}