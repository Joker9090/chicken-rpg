import Phaser, { Scene } from "phaser";
import EventsCenter from "./services/EventsCenter";

export default class MusicManager extends Phaser.Scene {
  music?:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  soundStatus: boolean = false
  musicStatus: boolean = false
  gameScene?: Scene

  constructor() {
    super({ key: "MusicManager" });

    EventsCenter.on("toggleSound", this.onToggleSound, this);
    EventsCenter.on("toggleMusic", this.handleToggleMusic, this);
  }

  stopMusic() {
    if (this.music) {
      this.music.stop();
      this.music.destroy();
    }
  }

  playMusic(name: string) {
    if (this.music) {
      this.music.stop();
    }
    this.music = this.sound.add(name).setVolume(!this.musicStatus ? 0.05 : 0);
    this.music.play();
    console.log(name, this.music, 'playMusic')
  }

  onToggleSound(data: any) {
    const {on, gameScene} = data
    EventsCenter.emit("toggleBtnSound", on);
    // const gameScene = this.game.scene.getScene("IsoExperimentalMap")
    console.log(gameScene, 'qsyche')
    this.soundStatus = !on
    const volume = on ? 0.3 : 0
    //@ts-ignore
    const sounds = [gameScene.spawnSound, gameScene.loseSound, gameScene.winSound];
    sounds.forEach((s: any) => s && s.setVolume(volume))
    console.log()
    //@ts-ignore
    if (gameScene.isoGroup) {
      //@ts-ignore
      gameScene.isoGroup.getChildren().forEach((obj: any) => {
          if (obj.sound) {
              if (Array.isArray(obj.sound)) obj.sound.forEach((s: any) => s.setVolume(volume))
              else obj.sound.setVolume(volume)
          }
      });
    }
  }

  create(/* {song} */) {
    //TODO: el create se ejecuta cuando entras al juego, no en el menu
    // this.game.events.on('toggleMusic', this.handleToggleMusic, this);
    this.game.events.on('musicVolumeChanged', this.musicVolumeChanged, this);
    // this.gameScene = this.game.scene.getScene("IsoExperimentalMap")
  }

  handleToggleMusic(status: boolean) {
    console.log('juampi66666', status)
    this.musicStatus = status
    if (!status) {
      this.music?.setVolume(0.05);
    } else {
      this.music?.setVolume(0);
    }
  }

  musicVolumeChanged(volume: number) {
    console.log(this.music, volume, 'keykey')
    if (this.music) {
      console.log(this.music.volume, volume, 'volume')
      this.music.setVolume(0.5*volume);
    }
  }
}
