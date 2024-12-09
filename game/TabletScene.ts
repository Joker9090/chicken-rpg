
export default class TabletScene extends Phaser.Scene {

    snowFlake?: Phaser.GameObjects.Image;

    constructor(x: number, y: number) {
        super({ key: "TabletScene" });
    }

    create() {
        this.add.rectangle(0, 0, 300, 300, 0x000000, 0.3).setOrigin(0.5).setAlpha(0.5);
        this.add.rectangle(300, 0, 300, 300, 0x00ff00, 0.3).setOrigin(0.5).setAlpha(0.5);
        this.cameras.main.setViewport(window.innerHeight, window.innerWidth - 150, 300, 300)
        this.cameras.main.centerOn(0, 0)

        setTimeout(() => {
            this.tweens.add({
                targets: [this.cameras.main],
                y: window.innerHeight/2 - 150,
                hold: 3000,
                yoyo: true,
                zoom: 1,
                duration: 1000,
                ease: 'Linear'
            })
        }, 3000)
        setTimeout(() => {
            this.cameras.main.pan(300, 0, 800, 'Linear', undefined, (camera, progress) => {
                if (progress === 1) {
                    console.log(progress)
                    setTimeout(()=>{
                        this.cameras.main.pan(0, 0, 300)
                    }, 300 )
                }
            })
        }, 5000)
        // this.snowFlake = this.add.image(window.innerWidth/2, -200, "snowFlake").setScale(0.1);
        console.log(this, "SCENE CHIQUITA")
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