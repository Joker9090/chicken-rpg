
export default class BackgroundMenu extends Phaser.GameObjects.Container{

    backgroundMenu: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y);
        this.backgroundMenu = scene.add.image(0, 0, "backgroundMenu")


        // this.scene.tweens.add({
        //     targets:[this.backgroundMenu],
        //     alpha: 1,
        //     duration: 4000,
        //     repeat: -1,
        //     repeatDelay: 4000,
        //     hold: 4000,
        //     yoyo: true,
        //     ease: 'ease'
        // })

        this.add([this.backgroundMenu]);
        this.scene.add.existing(this)
    }
}