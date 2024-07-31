import { Physics } from "phaser";
import { ConfigMovementVelocityType, PhysicsIsoVelocityType } from "../types";
import { Player } from "../Assets/Player";

export default class Movement1 {
  player: Player;
  game: Phaser.Scene;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  config: ConfigMovementVelocityType;

  constructor(
    player: Player,
    game: Phaser.Scene,
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    config: ConfigMovementVelocityType
  ) {
    this.player = player;
    this.game = game;
    this.cursors = cursors;
    this.config = config;
  }

  update() {
    if (this.player.body) {
      let velocity = this.player.body.velocity;
      if (velocity) {
        const xVelocity = this.cursors.left.isDown
        ? -this.config.pxVelocity
        : this.cursors.right.isDown
        ? this.config.pxVelocity
        : velocity.x;
        const yVelocity = this.cursors.up.isDown
        ? -this.config.pxVelocity
        : this.cursors.down.isDown
        ? this.config.pxVelocity
        : velocity.y;
        
        velocity.x = xVelocity;
        velocity.y = yVelocity;
        if(!this.cursors.left.isDown && !this.cursors.right.isDown) {
          if(this.config.resistence) {
            if(velocity.x > 0 && velocity.x < 1 || velocity.x < 0 && velocity.x > -1) velocity.x = 0;
            else velocity.x = velocity.x * this.config.resistence
          } else velocity.x = 0;
        }
        if(!this.cursors.up.isDown && !this.cursors.down.isDown) {
          if(this.config.resistence) {
            if(velocity.y > 0 && velocity.y < 1 || velocity.y < 0 && velocity.y > -1) velocity.y = 0;
            else velocity.y = velocity.y * this.config.resistence
          } else velocity.y = 0;
        }
      }
    }
  }
}
