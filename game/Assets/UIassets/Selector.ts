import EventsCenter from "@/game/EventsCenter";
import Phaser, { Scene } from "phaser";

// Scene in class
class Selector extends Phaser.GameObjects.Container {
    background?: Phaser.GameObjects.Sprite;
    selector?: Phaser.GameObjects.Sprite;
    status?: boolean;
    backgroundTextures?: string[];
    selectorTextures?: string;
    gameScene?: Scene

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        backgroundTextures: string[],
        selectorTextures: string,
        key?: string,
        status?: boolean
    ) {
        super(scene);
        this.scene = scene;
        this.backgroundTextures = backgroundTextures;
        this.selectorTextures = selectorTextures;
        this.status = status
        this.background = this.scene.add.sprite(0, 0, this.backgroundTextures[this.status ? 0 : 1])
        this.selector = this.scene.add.sprite(this.status ? -16 : 16, 1, this.selectorTextures)
        this.gameScene = scene.game.scene.getScene("IsoExperimentalMap")
        console.log(key, 'key setting init')

        this.add([this.background, this.selector]);
        this.setDepth(210);
        scene.add.existing(this);
        this.setPosition(x, y);
        this.setVisible(true);
        this.setSize(64,31)
        this.setInteractive()
        this.on("pointerdown", () => this.changeStatus(key ?? ''))
    }
    
    //TODO: no checkear por key, hacer clases de cada barra por separado
    changeStatus(key: string) {
        console.log(key, 'key setting', this.status, '')
        if (this.backgroundTextures && this.selectorTextures) {
            console.log('aca44')
            if (this.status) {
                this.status = false;
                this.scene.events.emit('selectorStatusChanged', { type: key, status: this.status });
                this.background?.setTexture(this.backgroundTextures[1])
                this.selector?.setPosition(16, 1)
                if (key === 'music') {
                    EventsCenter.emit("toggleMusic", false);
                } else if (key === 'sound') {
                    EventsCenter.emit("toggleSound", {on: true, gameScene: this.gameScene});

                    //@ts-ignore
                    // if (this.gameScene.isoGroup) {
                    //     //@ts-ignore
                    //     this.gameScene.isoGroup.getChildren().forEach((obj: any) => {
                    //         if (obj.sound) {
                    //             if (Array.isArray(obj.sound)) obj.sound.forEach((s: any) => s.setVolume(0.3))
                    //             else obj.sound.setVolume(0.3)
                    //         }
                    //     });
                    // }
                }
            } else {
                this.status = true;
                this.scene.events.emit('selectorStatusChanged', { type: key, status: this.status });
                this.background?.setTexture(this.backgroundTextures[0])
                this.selector?.setPosition(-16, 1)
                if (key === 'music') {
                    EventsCenter.emit("toggleMusic", true);
                } else if (key === 'sound') {
                    EventsCenter.emit("toggleSound", {on: false, gameScene: this.gameScene});
                    //@ts-ignore
                    // if (this.gameScene.isoGroup) {
                    //     //@ts-ignore
                    //     this.gameScene.isoGroup.getChildren().forEach((obj: any) => {
                    //         if (obj.sound) {
                    //             if (Array.isArray(obj.sound)) obj.sound.forEach((s: any) => s.setVolume(0))
                    //             else obj.sound.setVolume(0)
                    //         }
                    //     });
                    // }
                }
            }
        }
        console.log(this.status, 'data676')
    }
}
export default Selector;
