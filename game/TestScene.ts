import Phaser from "phaser";


export enum PossibleMovements {
  LEFT0 = "P-LEFT0",
  LEFT1 = "P-LEFT1",
  LEFT2 = "P-LEFT2",
  TOP0 = "P-TOP0",
  TOP1 = "P-TOP1",
  TOP2 = "P-TOP2",
  RIGHT0 = "P-RIGHT0",
  RIGHT1 = "P-RIGHT1",
  RIGHT2 = "P-RIGHT2",
  BOTTOM0 = "P-BOTTOM0",
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
    [PlayerParts.TORSO]: [30,31,32,33,34,35,36,37,38,39],
    [PlayerParts.LEFT_HAND]: [30,31,32,33,34,35,36,37,38,39],
    [PlayerParts.RIGHT_HAND]: [50,51,52,53,54,55,56,57,58,59],
    [PlayerParts.HEAD]: [30,31,32,33,34,35,36,37,38,39],
    [PlayerParts.LEGS]: [30,31,32,33,34,35,36,37,38,39],
  }
}

export default class TestScene extends Phaser.Scene {
  constructor() {
    super({ key: "TestScene", active: true });
  }

  create() {
    const player = new PlayerBuilder(this);
    this.add.existing(player.getContainer());
    player.selectMovement(PossibleMovements.LEFT1);
    //player.chainMovement([PossibleMovements.LEFT1, PossibleMovements.LEFT2])
  }

  update() {}
}

class PlayerBuilder {
  // this is a class to consolidate different player parts and create a player
  private torsoSelected = "01";
  private headSelected = "01";
  private legsSelected = "01";
  private torso: Phaser.GameObjects.Sprite;
  private leftHand: Phaser.GameObjects.Sprite;
  private rightHand: Phaser.GameObjects.Sprite;
  private head: Phaser.GameObjects.Sprite;
  private legs: Phaser.GameObjects.Sprite;
  private container: Phaser.GameObjects.Container;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    console.log("PLAYER BUILDER");
    this.scene = scene;

    const { torso, leftHand, rightHand, head, legs } = this.buildPlayer();
    this.torso = torso;
    this.leftHand = leftHand;
    this.rightHand = rightHand;
    this.head = head;
    this.legs = legs;

    this.container = this.scene.add.container(0, 100);
    this.container.add([
      this.leftHand,
      this.torso,
      this.rightHand,
      this.head,
      this.legs,
    ]);

    // this.selectMovement(PossibleMovements.LEFT1);
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

  buildAnimations(animations: PlayerParts[],sprite?: Phaser.GameObjects.Sprite ) {
    for (let animation of animations) {
      const animationParts = Object.keys(FramesForMovements) as unknown as PossibleMovements[]
      for (let animationPart of animationParts) {
        const frames: FramesForMovementsType = FramesForMovements[animationPart];
        let _animation = (["leftHand","rightHand"].indexOf(animation) == -1) ? animation : "torso"
        this.scene.anims.create({
          key: `${animationPart}-${animation}`,
          frames: this.scene.anims.generateFrameNumbers(
            `${_animation}-${this.getSelectionFromPart(animation)}`,
            { frames: frames[animation] }
          ),
          frameRate: 11,
          repeat: -1,

        });
     
      }
    }
   
  }


  buildPlayer(leftHandSelected: string = "01", torsoSelected: string = "01", rightHandSelected: string = "01", headSelected: string = "01", legsSelected: string = "01") {
    return {
      torso: this.selectTorso(torsoSelected),
      leftHand: this.selectLeftHand(leftHandSelected),
      rightHand: this.selectRightHand(rightHandSelected),
      head: this.selectHead(headSelected),
      legs: this.selectLegs(legsSelected),
    };
  }

  selectLeftHand(leftHandSelected: string) {
    if (this.leftHand) this.leftHand.destroy();
    this.torsoSelected = leftHandSelected;
    const leftHand = this.scene.add
      .sprite(100, 100, "torso-" + this.torsoSelected, 0)
      .setAlpha(0.9);
    
    this.buildAnimations([PlayerParts.LEFT_HAND]);
    return leftHand;
  }

  selectTorso(torsoSelected: string) {
    if (this.torso) this.torso.destroy();
    this.torsoSelected = torsoSelected;
    const torso = this.scene.add
      .sprite(100, 100, "torso-" + this.torsoSelected, 0)
      .setAlpha(0.5);
    this.buildAnimations([PlayerParts.TORSO]);
    return torso;
  }

  selectRightHand(rightHandSelected: string) {
    if (this.rightHand) this.rightHand.destroy();
    this.torsoSelected = rightHandSelected;
    const rightHand = this.scene.add
      .sprite(100, 100, "torso-" + this.torsoSelected, 0)
      .setAlpha(0.2);
    this.buildAnimations([PlayerParts.RIGHT_HAND]);
    return rightHand;
  }

  selectHead(headSelected: string) {
    if (this.head) this.head.destroy();
    this.torsoSelected = headSelected;
    const head = this.scene.add
      .sprite(100, 100, "head-" + this.headSelected, 0)
      .setAlpha(0.1);
    this.buildAnimations([PlayerParts.HEAD]);
    return head;
  }

  selectLegs(legsSelected: string) {
    if (this.legs) this.legs.destroy();
    this.torsoSelected = legsSelected;
    const legs = this.scene.add
      .sprite(100, 100, "legs-" + this.legsSelected, 0)
      .setAlpha(0.1);
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
      const firstAnim = possibleMovements[0];
      p.playAfterRepeat(`${firstAnim}-${part}`,1);
      console.log(possibleMovements.filter((v,index) => index > 0).map(v => `${v}-${part}`))
      p.chain(possibleMovements.filter((v,index) => index > 0).map(v => `${v}-${part}`))
    }
  }

  selectMovement(possibleMovement: PossibleMovements) {
    // all PlayerParts enum values in an array
    const playerParts = Object.values(PlayerParts) as unknown as PlayerParts[];

    this.orderSpritesForMovement(possibleMovement);


    for (let part of playerParts) {
      const p = this.getPartByKeyname(part);
      p.play(`${possibleMovement}-${part}`);
    }
  }

  orderSpritesForMovement(possibleMovement: PossibleMovements) {
    console.log("orderSpritesForMovement")
    // this.torso.setDepth(100)
    this.container.sendToBack(this.leftHand)


  }
}
