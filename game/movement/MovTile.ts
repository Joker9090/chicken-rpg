import { Physics } from "phaser";
import { ConfigMovementTileType, PhysicsIsoTileType } from "../types";




export default class Movement3 {
    body: PhysicsIsoTileType;
    game: Phaser.Scene;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    movementTime: number = 0;
    config: ConfigMovementTileType;

    constructor(body: PhysicsIsoTileType, game: Phaser.Scene, cursors: Phaser.Types.Input.Keyboard.CursorKeys, config: ConfigMovementTileType) {
        this.body = body;
        this.game = game;
        this.cursors = cursors;
        this.config = config;
    }

    update() {
    
        let position = this.body.position;
        if (position) {
            if(this.game.time.now - this.movementTime > 200) {
                if (this.cursors.left.isDown) {
                    position.x -= this.config.tileSize;
                    this.movementTime = this.game.time.now;
                } else if (this.cursors.right.isDown) {
                    position.x += this.config.tileSize;
                    this.movementTime = this.game.time.now;
                }
                if (this.cursors.up.isDown) {
                    position.y -= this.config.tileSize;
                    this.movementTime = this.game.time.now;
                } else if (this.cursors.down.isDown) {
                    position.y += this.config.tileSize;
                    this.movementTime = this.game.time.now;
                }
            }
            
        }
    }
}
