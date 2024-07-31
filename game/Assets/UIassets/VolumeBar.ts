import Phaser, { Input } from "phaser";

// Scene in class
class VolumeBar extends Phaser.GameObjects.Container {
    background?: Phaser.GameObjects.Sprite;
    selector?: Phaser.GameObjects.Sprite;
    backgroundTextures?: string[];
    selectorTextures?: string;
    colorBackground: Phaser.GameObjects.Sprite;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        backgroundTextures: string[],
        selectorTextures: string,
        key?: string,
    ) {
        super(scene);
        this.scene = scene;
        this.scene.events.on('selectorStatusChanged', this.updateStatus, this);
        this.backgroundTextures = backgroundTextures;
        this.selectorTextures = selectorTextures;
        this.background = this.scene.add.sprite(0, 0, this.backgroundTextures[1]).setDepth(9)
        this.colorBackground = this.scene.add.sprite(0, 0, this.backgroundTextures[0]).setDepth(99).setOrigin(0, 0.5)
        const fixVolBar = this.scene.add.sprite(0, 0, "volOnCrop").setDepth(99).setOrigin(0, 0.5)
        fixVolBar.setPosition(-this.colorBackground.width/2, 0)
        this.colorBackground.setPosition(-this.colorBackground.width/2 + 7, 0).setScale(0.6,1)
        this.selector = this.scene.add.sprite(16, -1, this.selectorTextures).setDepth(99999)

        this.add([this.background, this.colorBackground, fixVolBar, this.selector]);
        this.setDepth(210);
        scene.add.existing(this);
        this.setPosition(x, y);
        this.setVisible(true);
        this.selector.setInteractive({draggable: true})

        this.selector.on('drag', (pointer: any, newPos: number, dragX: number) => {
            dragX = Phaser.Math.Clamp(newPos, -63, 63);
            this.selector?.setPosition(dragX, -1)
            this.setVolume(dragX, key ?? '')
        });
    }

    turnOn(){
        this.selector?.setPosition(16,-1)
        this.colorBackground.setScale(0.6,1)
    }

    updateStatus(data: any){
        this[`${data.type}State` as keyof this] = data.status
    }

    //TODO: hacer que el rango de volumen dependa del volumen por defecto seteado en el objeto
    //TODO: no checkear por key, hacer clases de cada barra por separado
    setVolume(volume : number, key: string,) {
        const mm = this.scene.game.scene.getScene(
            "MusicManager"
          );
        const newVolume = (volume + 63) / 126
        if (key === 'music') {
            //@ts-ignore
            if (!mm.musicStatus) this.scene.game.events.emit('musicVolumeChanged', newVolume);
        } else if (key === 'sound') {
            //@ts-ignore
            if (!mm.soundStatus) {
                //@ts-ignore
                if (this.scene.gameScene) {
                //@ts-ignore
                    this.scene.gameScene.isoGroup.getChildren().forEach((obj: any) => {
                        if (obj.sound) {
                            if (Array.isArray(obj.sound)) obj.sound.forEach((s: any) => s.setVolume(newVolume))
                            else obj.sound.setVolume(newVolume)
                        }
                    });
                }
            }
        }
        const newWidth = Phaser.Math.Clamp(newVolume, 0, 0.9);
        this.colorBackground.setScale(newWidth, 1)
        console.log("SETTING VOLUME TO INTENSITY: ", newVolume)
    }
}
export default VolumeBar;
