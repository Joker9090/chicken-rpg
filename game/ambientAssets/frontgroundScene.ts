
export default class AmbientFrontgroundScene extends Phaser.Scene{

    snowFlake?: Phaser.GameObjects.Image;

    constructor() {
        super({ key: "AmbientFrontgroundScene" });
    }

    create(){
        // this.snowFlake = this.add.image(window.innerWidth/2, -200, "snowFlake").setScale(0.1);

        // this.add.particles(0, 100, 'snowFlake', {
        //     x: { start: window.innerWidth/2, end: 640, steps: 16, yoyo: true },
        //     y: { start: -200, end: window.innerHeight + 200, steps: 16, yoyo: true },
        //     lifespan: 3000,
        //     gravityY: 200,
        //     scale: 0.15
        // });

        // this.tweens.add({
        //     targets:[this.snowFlake],
        //     y: window.innerHeight + 200,
        //     duration: 4000,
        //     repeat: -1,
        //     hold: 500,
        //     onComplete: () => {
        //         this.snowFlake?.setPosition(Math.random() * window.innerWidth, -200);
        //     },
        //     ease: 'ease'
        // })
        // this.tweens.add({
        //     targets:[this.snowFlake],
        //     x: '+=25',
        //     duration: 4000,
        //     repeat: -1,
        //     hold: 500,
        //     ease: 'ease'
        // })
    }
}