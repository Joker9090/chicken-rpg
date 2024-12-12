import Phaser from "phaser";


export enum PossibleMovements {
  // LEFT0 = "P-LEFT0",
  LEFT1 = "P-LEFT1",
  LEFT2 = "P-LEFT2",
  // TOP0 = "P-TOP0",
  TOP1 = "P-TOP1",
  TOP2 = "P-TOP2",
  // RIGHT0 = "P-RIGHT0",
  RIGHT1 = "P-RIGHT1",
  RIGHT2 = "P-RIGHT2",
  // BOTTOM0 = "P-BOTTOM0",
  BOTTOM1 = "P-BOTTOM1",
  BOTTOM2 = "P-BOTTOM2",
}

export enum PlayerParts {
  TORSO = "torso",
  LEFT_HAND = "leftHand",
  RIGHT_HAND = "rightHand",
  HEAD = "head",
  LEGS = "legs",
} ;

export type FramesForMovementsType = {
    [PlayerParts.TORSO]: number[];
    [PlayerParts.LEFT_HAND]: number[];
    [PlayerParts.RIGHT_HAND]: number[];
    [PlayerParts.HEAD]: number[];
    [PlayerParts.LEGS]: number[];
};

export type FramesForMovementsGroupType = {
  [key in PossibleMovements]: FramesForMovementsType;
};

export const FramesForMovements: FramesForMovementsGroupType = {
  [PossibleMovements.LEFT1]: {
    [PlayerParts.TORSO]: [10,11,12,13,14,15,16,17,18,19],
    [PlayerParts.LEFT_HAND]: [0,1,2,3,4,5,6,7,8,9],
    [PlayerParts.RIGHT_HAND]: [20,21,22,23,24,25,26,27,28,29],
    [PlayerParts.HEAD]: [0,1,2,3,4,5,6,7,8,9],
    [PlayerParts.LEGS]: [0,1,2,3,4,5,6,7,8,9],
  },
  [PossibleMovements.LEFT2]: {
    [PlayerParts.TORSO]: [40,41,42,43,44,45,46,47,48,49],
    [PlayerParts.LEFT_HAND]: [30,31,32,33,34,35,36,37,38,39],
    [PlayerParts.RIGHT_HAND]: [50,51,52,53,54,55,56,57,58,59],
    [PlayerParts.HEAD]: [10,11,12,13,14,15,16,17,18,19],
    [PlayerParts.LEGS]: [10,11,12,13,14,15,16,17,18,19],
  },
  [PossibleMovements.BOTTOM1]: {
    [PlayerParts.TORSO]: [70,71,72,73,74,75,76,77,78,79],
    [PlayerParts.LEFT_HAND]: [60,61,62,63,64,65,66,67,68,69],
    [PlayerParts.RIGHT_HAND]: [80,81,82,83,84,85,86,87,88,89],
    [PlayerParts.HEAD]: [20,21,22,23,24,25,26,27,28,29],
    [PlayerParts.LEGS]: [20,21,22,23,24,25,26,27,28,29],
  },
  [PossibleMovements.BOTTOM2]: {
    [PlayerParts.TORSO]: [100,101,102,103,104,105,106,107,108,109],
    [PlayerParts.LEFT_HAND]: [90,91,92,93,94,95,96,97,98,99],
    [PlayerParts.RIGHT_HAND]: [110,111,112,113,114,115,116,117,118,119],
    [PlayerParts.HEAD]: [30,31,32,33,34,35,36,37,38,39],
    [PlayerParts.LEGS]: [30,31,32,33,34,35,36,37,38,39],
  },
  [PossibleMovements.RIGHT1]: {
    [PlayerParts.TORSO]: [130,131,132,133,134,135,136,137,138,139],
    [PlayerParts.LEFT_HAND]: [120,121,122,123,124,125,126,127,128,129],
    [PlayerParts.RIGHT_HAND]: [140,141,142,143,144,145,146,147,148,149],
    [PlayerParts.HEAD]: [40,41,42,43,44,45,46,47,48,49],
    [PlayerParts.LEGS]: [40,41,42,43,44,45,46,47,48,49],
  },
  [PossibleMovements.RIGHT2]: {
    [PlayerParts.TORSO]: [160,161,162,163,164,165,166,167,168,169],
    [PlayerParts.LEFT_HAND]: [150,151,152,153,154,155,156,157,158,159],
    [PlayerParts.RIGHT_HAND]: [170,171,172,173,174,175,176,177,178,179],
    [PlayerParts.HEAD]: [50,51,52,53,54,55,56,57,58,59],
    [PlayerParts.LEGS]: [50,51,52,53,54,55,56,57,58,59],
  },
  [PossibleMovements.TOP1]: {
    [PlayerParts.TORSO]: [190,191,192,193,194,195,196,197,198,199],
    [PlayerParts.LEFT_HAND]: [180,181,182,183,184,185,186,187,188,189],
    [PlayerParts.RIGHT_HAND]: [200,201,202,203,204,205,206,207,208,209],
    [PlayerParts.HEAD]: [60,61,62,63,64,65,66,67,68,69],
    [PlayerParts.LEGS]: [60,61,62,63,64,65,66,67,68,69],
  },
  [PossibleMovements.TOP2]: {
    [PlayerParts.TORSO]: [220,221,222,223,224,225,226,227,228,229],
    [PlayerParts.LEFT_HAND]: [210,211,212,213,214,215,216,217,218,219],
    [PlayerParts.RIGHT_HAND]: [230,231,232,233,234,235,236,237,238,239],
    [PlayerParts.HEAD]: [70,71,72,73,74,75,76,77,78,79],
    [PlayerParts.LEGS]: [70,71,72,73,74,75,76,77,78,79],
  },
}

export default class TestScene extends Phaser.Scene {
  constructor() {
    super({ key: "TestScene", active: true });
  }

  create() {
    const player = new PlayerBuilder(this);
    this.add.existing(player.getContainer());
    player.getContainer().setPosition(100, 100);
    //player.selectMovement(PossibleMovements.LEFT2);

    const play = () => {
      player.chainMovement([
        PossibleMovements.RIGHT1, PossibleMovements.RIGHT2,PossibleMovements.RIGHT1, PossibleMovements.RIGHT2,
        PossibleMovements.BOTTOM1, PossibleMovements.BOTTOM2,PossibleMovements.BOTTOM1, PossibleMovements.BOTTOM2,
        PossibleMovements.LEFT1, PossibleMovements.LEFT2,PossibleMovements.LEFT1, PossibleMovements.LEFT2,
        PossibleMovements.RIGHT1, PossibleMovements.RIGHT2,PossibleMovements.RIGHT1, PossibleMovements.RIGHT2,
      ])
    }
    

    //@ts-ignore
    const head01 = new Phaser.GameObjects.Text(this, 600, 50, "NORMAL HEAD", { fill: "#0f0" });
    head01.setInteractive().on("pointerdown", () => { 
      player.buildPlayer("01","01","01","01","01"); 
      player.stopAllAnimations()
      play() 
    })
    this.add.existing(head01);
    //@ts-ignore
    const head02 = new Phaser.GameObjects.Text(this, 600, 150, "PINK HEAD", { fill: "#0f0" });
    head02.setInteractive().on("pointerdown", () => { 
      player.buildPlayer("01","01","01","02","01"); 
      player.stopAllAnimations()
      play()
    })
    this.add.existing(head02);
  }

  update() {}
}

export class PlayerBuilder {
  // this is a class to consolidate different player parts and create a player
  private torsoSelected = "01";
  private headSelected = "02";
  private legsSelected = "01";
  private torso: Phaser.GameObjects.Sprite;
  private leftHand: Phaser.GameObjects.Sprite;
  private rightHand: Phaser.GameObjects.Sprite;
  private head: Phaser.GameObjects.Sprite;
  private legs: Phaser.GameObjects.Sprite;
  private container: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = this.scene.add.container(0, 0);
    const { torso, leftHand, rightHand, head, legs } = this.buildPlayer(this.torsoSelected, this.torsoSelected, this.torsoSelected, this.headSelected, this.legsSelected);
    
    //
    this.torso = torso;
    this.leftHand = leftHand;
    this.rightHand = rightHand;
    this.head = head;
    this.legs = legs;


    const playerParts = Object.values(PlayerParts) as unknown as PlayerParts[];
    for (let part of playerParts) {
      const p = this.getPartByKeyname(part);
      p.on("animationstart", ({key}: Phaser.Animations.Animation, {textureKey}: Phaser.Animations.AnimationFrame) => {
        const possibleMovement = Object.values(PossibleMovements).find(v => v ==`P-${key.split("-")[1]}`) ?? PossibleMovements.LEFT1;
        const version = textureKey.split("-")[1];
        const part = Object.values(PlayerParts).find(v => v ==`${textureKey.split("-")[0]}`) ?? PlayerParts.TORSO;
        this.orderSpritesForMovement(possibleMovement, part, version);
      })
    }

    // this.buildPlayer = this.buildPlayer.bind(this);
    // this.selectMovement(PossibleMovements.LEFT1);
  }

  getPlayerParts() {
    return {
      torso: this.torso,
      leftHand: this.leftHand,
      rightHand: this.rightHand,
      head: this.head,
      legs: this.legs,
    };
  }

  buildContainer({ torso, leftHand, rightHand, head, legs }: { torso: Phaser.GameObjects.Sprite; leftHand: Phaser.GameObjects.Sprite; rightHand: Phaser.GameObjects.Sprite; head: Phaser.GameObjects.Sprite; legs: Phaser.GameObjects.Sprite; }) {
    this.stopAllAnimations();
    this.container.removeAll();

    this.container.add([
      this.leftHand,
      this.torso,
      this.rightHand,
      this.head,
      this.legs,
    ])
  }

  getSelectionFromPart(playerPart: PlayerParts){
    switch (playerPart) {
      case PlayerParts.TORSO:
        return this.torsoSelected;
      case PlayerParts.LEFT_HAND:
        return this.torsoSelected;
      case PlayerParts.RIGHT_HAND:
        return this.torsoSelected;
      case PlayerParts.HEAD:
        return this.headSelected;
      case PlayerParts.LEGS:
        return this.legsSelected;
    }
  }

  buildAnimations(animations: PlayerParts[]) {
    for (let animation of animations) {
      const animationParts = Object.keys(FramesForMovements) as unknown as PossibleMovements[]
      for (let animationPart of animationParts) {
        const frames: FramesForMovementsType = FramesForMovements[animationPart];
        let _animation = (["leftHand","rightHand"].indexOf(animation) == -1) ? animation : "torso"
        this.scene.anims.remove(`${animationPart}-${animation}`)
        this.scene.anims.create({
          key: `${animationPart}-${animation}`,
          frames: this.scene.anims.generateFrameNumbers(
            `${_animation}-${this.getSelectionFromPart(animation)}`,
            { frames: frames[animation] }
          ),
          frameRate: 20,
          // repeat: -1,

        });
     
      }
    }
   
  }


  buildPlayer(leftHandSelected: string = "01", torsoSelected: string = "01", rightHandSelected: string = "01", headSelected: string = "01", legsSelected: string = "01") {
    const obj = {
      torso: this.selectTorso(torsoSelected),
      leftHand: this.selectLeftHand(leftHandSelected),
      rightHand: this.selectRightHand(rightHandSelected),
      head: this.selectHead(headSelected),
      legs: this.selectLegs(legsSelected),
    };

    this.torso = obj.torso;
    this.leftHand = obj.leftHand;
    this.rightHand = obj.rightHand;
    this.head = obj.head;
    this.legs = obj.legs;

    this.buildContainer(this.getPlayerParts());

    return obj;


  }

  selectLeftHand(leftHandSelected: string) {
    if (this.leftHand) this.leftHand.destroy();
    this.torsoSelected = leftHandSelected;
    const leftHand = this.scene.add
      .sprite(0, 0, "torso-" + this.torsoSelected, 0)
      .setAlpha(0.9)
      .setOrigin(0.5);
    this.leftHand = leftHand;
    this.buildAnimations([PlayerParts.LEFT_HAND]);
    return leftHand;
  }

  selectTorso(torsoSelected: string) {
    if (this.torso) this.torso.destroy();
    this.torsoSelected = torsoSelected;
    const torso = this.scene.add
      .sprite(0, 0, "torso-" + this.torsoSelected, 0)
      .setAlpha(0.5)
      .setOrigin(0.5);

    this.torso = torso;
    this.buildAnimations([PlayerParts.TORSO]);
    return torso;
  }

  selectRightHand(rightHandSelected: string) {
    if (this.rightHand) this.rightHand.destroy();
    this.torsoSelected = rightHandSelected;
    const rightHand = this.scene.add
      .sprite(0, 0, "torso-" + this.torsoSelected, 0)
      .setAlpha(0.2)
      .setOrigin(0.5);
    this.rightHand = rightHand;
    this.buildAnimations([PlayerParts.RIGHT_HAND]);
    return rightHand;
  }

  selectHead(headSelected: string) {
    if (this.head) this.head.destroy(true);
    this.headSelected = headSelected;
    const head = this.scene.add
      .sprite(0, 0, "head-" + this.headSelected, 0)
      .setAlpha(0.1)
      .setOrigin(0.5);
    this.head = head;
    this.buildAnimations([PlayerParts.HEAD]);
    return head;
  }

  selectLegs(legsSelected: string) {
    if (this.legs) this.legs.destroy();
    this.legsSelected = legsSelected;
    const legs = this.scene.add
      .sprite(0, 0, "legs-" + this.legsSelected, 0)
      .setAlpha(0.1)
      .setOrigin(0.5);

    this.legs = legs;
    this.buildAnimations([PlayerParts.LEGS]);
    return legs;
  }


  getContainer() {
    return this.container;
  }

  getPartByKeyname(key: string) {
    switch (key) {
      case "torso":
        return this.torso;
      case "leftHand":
        return this.leftHand;
      case "rightHand":
        return this.rightHand;
      case "head":
        return this.head;
      case "legs":
        return this.legs;
        default:
        return new Phaser.GameObjects.Sprite(this.scene, 0, 0, "", 0);
    }
  }

  chainMovement(possibleMovements: PossibleMovements[]){
    const playerParts = Object.values(PlayerParts) as unknown as PlayerParts[];
    for (let part of playerParts) {
      const p = this.getPartByKeyname(part);
      p.anims.pause();
      
      p.play(`${possibleMovements[0]}-${part}`,true);
      p.chain(possibleMovements.filter((v,index) => index > 0).map(v => `${v}-${part}`));
      
    }
  }

  selectMovement(possibleMovement: PossibleMovements) {
    // all PlayerParts enum values in an array
    const playerParts = Object.values(PlayerParts) as unknown as PlayerParts[];

    for (let part of playerParts) {
      const p = this.getPartByKeyname(part);
      p.play(`${possibleMovement}-${part}`);
    }
  }

  orderSpritesForMovement(possibleMovement: PossibleMovements, part: PlayerParts, version: string) {
   // TODO: Se puede modificar los sprites separados antes de arrancar la animacion si es deseable
  }

  stopAllAnimations() {
    const playerParts = Object.values(PlayerParts) as unknown as PlayerParts[];
    for (let part of playerParts) {
      const p = this.getPartByKeyname(part);
      p.anims.pause();
    }
  }
}
