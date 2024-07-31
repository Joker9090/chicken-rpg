import Phaser from "phaser";
import Selector from "./Selector";
import VolumeBar from "./VolumeBar";
import { Audio, LevelDataType } from "@/game/types";
import BetweenScenes from "@/game/BetweenScenes";
import UIScene from "@/game/UIScene";
import Menu from "@/game/Menu";
import EventsCenter from "@/game/EventsCenter";

// Scene in class
class SettingsModal extends Phaser.GameObjects.Container {
    settingsBackground?: Phaser.GameObjects.Sprite;
    btnOk?: Phaser.GameObjects.Sprite;
    btnExit?: Phaser.GameObjects.Sprite;
    btnHome?: Phaser.GameObjects.Sprite;
    musicIcon?: Phaser.GameObjects.Sprite;
    soundIcon?: Phaser.GameObjects.Sprite;
    textMusic?: Phaser.GameObjects.Text;
    textSound?: Phaser.GameObjects.Text;
    musicSelector?: Selector;
    soundSelector?: Selector;
    musicBar?: VolumeBar;
    soundBar?:VolumeBar;
    onClickSound?: Audio;


    changeTexture(btn: string, interaction?: string) {
        const texturesBtns = {
            ok: {
                normal: "btnOk",
                pressed: "btnOkClick",
                hover: "btnOkHover"
            },
            exit: {
                normal: "btnExit",
                pressed: "btnExitClick",
                hover: "btnExitHover"
            },
            home: {
                normal: "btnHome",
                pressed: "btnHomeClick",
                hover: "btnHomeHover"
            }
        }
        switch (btn) {
            case "ok":
                switch (interaction) {
                    case "hover":
                        this.btnOk?.setTexture(texturesBtns.ok.hover);
                        break;
                    case "pressed":
                        this.btnOk?.setTexture(texturesBtns.ok.pressed);
                        break;
                    default:
                        this.btnOk?.setTexture(texturesBtns.ok.normal);
                }
                break;
            case "exit":
                switch (interaction) {
                    case "hover":
                        this.btnExit?.setTexture(texturesBtns.exit.hover);
                        break;
                    case "pressed":
                        this.btnExit?.setTexture(texturesBtns.exit.pressed);
                        break;
                    default:
                        this.btnExit?.setTexture(texturesBtns.exit.normal);
                }
                break;
            case "home":
                switch (interaction) {
                    case "hover":
                        this.btnHome?.setTexture(texturesBtns.home.hover);
                        break;
                    case "pressed":
                        this.btnHome?.setTexture(texturesBtns.home.pressed);
                        break;
                    default:
                        this.btnHome?.setTexture(texturesBtns.home.normal);
                }
                break;
        }
    }

    makeTransition(
        sceneNameStart: string,
        sceneNameStop: string,
        data?: LevelDataType | undefined,
      ) {
        const getBetweenScenesScene = this.scene.game.scene.getScene(
          "BetweenScenes"
        ) as BetweenScenes;
        getBetweenScenesScene.changeSceneTo(sceneNameStart, sceneNameStop, data);
      }

    onToggleSound (status: boolean) {
        this.onClickSound?.setVolume(status ? 0.5 : 0)
    }

    constructor(
        scene: UIScene | Menu,
        x: number,
        y: number,
        modalInMenu?: boolean,
        soundStatus?: boolean,
        musicStatus?: boolean
    ) {
        super(scene);
        this.scene = scene;
        this.musicSelector = new Selector(this.scene,100,-30,["backgroundSelectorOff", "backgroundSelectorOn"],"selector", 'music', musicStatus)
        this.soundSelector = new Selector(this.scene,-40,-30,["backgroundSelectorOff", "backgroundSelectorOn"],"selector", 'sound', soundStatus)
        this.musicBar = new VolumeBar(this.scene, 45, 70,["volOff", "volOn"],"volSelector", 'music')
        this.soundBar = new VolumeBar(this.scene, 45, 30,["volOff", "volOn"],"volSelector", 'sound')
        const mm = this.scene.game.scene.getScene('MusicManager')
        this.onClickSound = scene.sound.add('interfaceBtn')
        //@ts-ignore
        this.onClickSound?.setVolume(mm.soundStatus ? 0 : 0.5)
        console.log(this, 'modalSettings66')
        this.settingsBackground = this.scene.add
            .sprite(0, 0, "backgroundSettings")
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0)
            .setDepth(999999999);
        this.btnOk = this.scene.add.sprite(100, 0, "btnOk")
            .setOrigin(0.5, 0.5)
            .setPosition(40, 150)
            .setScrollFactor(0)
            .setInteractive()
        this.btnOk.on('pointerdown', () => {
            this.changeTexture("ok", "pressed")
            this.onClickSound?.play()
            this.setVisible(false)
        })
        this.btnOk.on('pointerup', () => this.changeTexture("ok"))
        this.btnOk.on('pointerout', () => this.changeTexture("ok"))
        this.btnOk.on('pointerover', () => this.changeTexture("ok", "hover"))
        this.btnExit = this.scene.add.sprite(200, 0, "btnExit")
            .setOrigin(0.5, 0.5)
            .setPosition(152, -215)
            .setScrollFactor(0)
            .setInteractive()
        this.btnExit.on('pointerdown', () => {
            this.changeTexture("exit", "pressed")
            this.onClickSound?.play()
            this.setVisible(false)
        })
        this.btnExit.on('pointerout', () => this.changeTexture("exit"))
        this.btnExit.on('pointerover', () => this.changeTexture("exit", "hover"))
        this.btnHome = this.scene.add.sprite(300, 0, "btnHome")
            .setOrigin(0.5, 0.5)
            .setPosition(-80, 150)
            .setScrollFactor(0)
            .setInteractive()
        this.btnHome.on('pointerup', () => {
            if (modalInMenu){
                this.setVisible(false)
            } else {
                this.setVisible(false)
                this.makeTransition("Menu", "IsoExperimentalMap")
            }
        })
        this.btnHome.on('pointerdown', () => {
            this.onClickSound?.play();
            this.changeTexture("home", "pressed")

        });
        this.btnHome.on('pointerover', () => this.changeTexture("home", "hover"))
        this.btnHome.on('pointerout', () => this.changeTexture("home"))

        this.musicSelector.setInteractive().on('pointerdown', () => {
            this.onClickSound?.play();
            this.musicBar?.turnOn()

        });

        this.soundSelector.setInteractive().on('pointerdown', () => {
            this.onClickSound?.play();
            this.soundBar?.turnOn()

        });
        //TODO: no se triguerea el sonido en las volumeBar
        // this.musicBar.setInteractive().on('pointerdown', () => {
        //     this.onClickSound?.play();
        // });

        // this.soundBar.setInteractive().on('pointerdown', () => {
        //     this.onClickSound?.play();
        // });
        this.musicIcon = this.scene.add.sprite(0, 100, "musicIcon")
            .setOrigin(0.5, 0.5)
            .setPosition(45, -30)
            .setScrollFactor(0)
        this.soundIcon = this.scene.add.sprite(0, 200, "soundIcon")
            .setOrigin(0.5, 0.5)
            .setPosition(-100, -30)
            .setScrollFactor(0)
        this.textMusic = this.scene.add.text(0, 200, "music", { fontSize: 24, fontFamily: "Quicksand" })
            .setOrigin(0.5, 0.5)
            .setPosition(-80, 70)
            .setScrollFactor(0)

        this.textSound = this.scene.add.text(0, 200, "sound", { fontSize: 24, fontFamily: "Quicksand" })
            .setOrigin(0.5, 0.5)
            .setPosition(-80, 30)
            .setScrollFactor(0)


        this.add([
            this.settingsBackground,
            this.btnOk,
            this.btnExit,
            this.btnHome,
            this.musicIcon,
            this.soundIcon,
            this.textMusic,
            this.textSound,
            this.musicSelector,
            this.soundSelector,
            this.musicBar,
            this.soundBar,
        ]);
        this.setDepth(999999999);
        this.scene.add.existing(this);
        this.setPosition(x, y);
        this.setVisible(false)
        EventsCenter.on("toggleBtnSound", this.onToggleSound, this);
    }
}
export default SettingsModal;
