import { Physics } from "phaser";
import { ConfigMovementForceType, PhysicsIsoForceType } from "../types";
import { Player } from "../Assets/Player";

export default class Movement2 {
  player: Player;
  game: Phaser.Scene;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  config: ConfigMovementForceType;

  constructor(
    player: Player,
    game: Phaser.Scene,
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    config: ConfigMovementForceType
  ) {
    this.player = player;
    this.game = game;
    this.cursors = cursors;
    this.config = config;
  }

  update() {
    if (this.player.self.body) {
      let velocity = this.player.self.body.velocity;
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

      velocity.x =
        velocity.x != 0
          ? velocity.x +
            (velocity.x > 0 ? -this.config.pxForce : this.config.pxForce)
          : xVelocity;
      velocity.y =
        velocity.y != 0
          ? velocity.y +
            (velocity.y > 0 ? -this.config.pxForce : this.config.pxForce)
          : yVelocity;
    }
  }
}
