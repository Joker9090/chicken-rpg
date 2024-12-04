
export default class TestBack extends Phaser.GameObjects.Container{

    day: Phaser.GameObjects.Image;
    night: Phaser.GameObjects.Image;
    stars: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y);
        this.day = scene.add.image(0, 0, "day").setAlpha(0);
        this.night = scene.add.image(0, 0, "night");
        this.stars = scene.add.image(0, 0, "stars");

        this.scene.tweens.add({
            targets:[this.stars, this.night],
            alpha: 0,
            duration: 4000,
            repeat: -1,
            yoyo: true,
            repeatDelay: 4000,
            hold: 4000,
            ease: 'ease'
        })

        this.scene.tweens.add({
            targets:[this.day],
            alpha: 1,
            duration: 4000,
            repeat: -1,
            repeatDelay: 4000,
            hold: 4000,
            yoyo: true,
            ease: 'ease'
        })

        this.add([this.day, this.night, this.stars]);
        this.scene.add.existing(this)
    }
}