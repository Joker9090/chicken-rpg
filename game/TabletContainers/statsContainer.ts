
export class statsContainer extends Phaser.GameObjects.Container {
    scene: Phaser.Scene;
    closeButton: Phaser.GameObjects.Image;
    gobackButton: Phaser.GameObjects.Image;
    activeTween: Phaser.Tweens.Tween | null = null;
    handleGoback: () => void;
    //handleClose: () => void;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        goback: Function,

    ) {
        super(scene,x, y);
        this.scene = scene;
        this.handleGoback = () => goback();

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


        //Menu containers
        const topContainer = this.scene.add.container(0, -190);
        const leftContainer = this.scene.add.container(-200, -5);
        const rightUpContainer = this.scene.add.container(120, -150);
        const rightDownContainer = this.scene.add.container(120, 45);

        //TOP CONTAINER ->

        this.closeButton = this.scene.add.image(355, 0, "btnExit").setInteractive();

        this.closeButton.on('pointerup', () => {
            //this.handleClose();
            console.log("CLOSE");
        });
        this.closeButton.on("pointerover", () => {
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOver(this.closeButton);
        });
        this.closeButton.on("pointerout", () => {
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOut(this.closeButton);
        });

        this.gobackButton = this.scene.add.image(-375, 0, "goBack").setScale(0.5).setInteractive();

        this.gobackButton.on('pointerup', () => {
            //this.handleGoback();
            console.log("Goback");
        });
        this.gobackButton.on("pointerover", () => {
            //if (this.activeTween) this.activeTween.stop();
            //tweenButtonOver(this.gobackButton);
        });
        this.gobackButton.on("pointerout", () => {
            //if (this.activeTween) this.activeTween.stop();
            //tweenButtonOut(this.gobackButton);
        });


        topContainer.add([this.closeButton, this.gobackButton]);

        //Top container <---

        //LEFT CONTAINER ->

        const leftBackground = this.scene.add.image(0,0,"tabletStatLeft").setScale(0.5);

        leftContainer.add([leftBackground, ]);

        //Left container <---

        //RightUp CONTAINER ->
        const rightUpBackground = this.scene.add.image(0,0,"tabletRightUp").setScale(0.5);

        rightUpContainer.add([rightUpBackground, ]);

        //RightUp container <---

        //RightDown CONTAINER ->
        const rightDownBackground = this.scene.add.image(0,0,"tabletRightDown").setScale(0.5);

        rightDownContainer.add([rightDownBackground, ]);

        //RightDown container <---

        this.add([
            topContainer,
            leftContainer,
            rightUpContainer,
            rightDownContainer
        ]);

        console.log("CONTAINER STAT: ", this);

        this.scene.add.existing(this)
        //this.scene.cameras.main.ignore(this)

    }
}