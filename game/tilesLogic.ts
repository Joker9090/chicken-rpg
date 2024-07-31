// import { GameObjects } from "phaser";
// import MapManager from "./mapManager";
// import { GameObjectsIsoSpriteType } from "./types";
// import { GenericTile } from "./Assets/GenericTile";
// import { Player } from "./Assets/Player";
// import { TileObject } from "./Assets/TileObject";

// type IsoAddType = GameObjects.GameObjectFactory & {
//     isoSprite: (x:number,y:number,z:number,text:string,group: Phaser.GameObjects.Group | undefined) => GameObjectsIsoSpriteType;
// }

// type Props = {
//   a: string, b: number, c: number, that: MapManager, self: any, conf: any, objectKey: string
// }

// // const h = 1600;
// // const hPlayer = 2860

// export const baseTile = (props: Props) => {
//   const { a, b, c, that, self, conf, objectKey } = props;
//   const h = conf.height || 2000
//   let tile;
//   tile =  new GenericTile(
//     that.game,
//     that.setPosFromAnchor(b, c).x,
//     that.setPosFromAnchor(b, c).y,
//     h,
//     a, 
//     0,
//     self.isoGroup,
//     objectKey
//     );
//     tile.isoConfig = {x: b, y: c}
//     //tile.setTint(0xDC341D);
//     that.game.isoPhysics.world.enable(tile);
//     if(tile.body) {
//       tile.body.collideWorldBounds = true;
//       tile.body.immovable = true;
//       tile.body.allowGravity = false;
//     }
//     tile.objectType = "base";
//     console.log(tile, 'keydata')
//     return tile
//   }
  
// export const playerTile = (props: Props) => {
//   const { a, b, c, that, self, objectKey } = props;
//   let player;
//   player =  new Player(
//     that.game,
//     that.setPosFromAnchor(b, c).x,
//     that.setPosFromAnchor(b, c).y,
//     2860,
//     "ballAnim",
//     0,
//     self.isoGroup
//   );
//   player.self.setScale(0.1)
//   if(player.primarySprite) player.primarySprite.setScale(1)

// }

// export const collapsableTile = (props: Props) => {
//   const { a, b, c, that, self, conf, objectKey } = props;
//   const h = conf.height || 2000
//   let tile;
//   tile =  new GenericTile(
//       that.game,
//       that.setPosFromAnchor(b, c).x,
//       that.setPosFromAnchor(b, c).y,
//       h,
//       a,
//       0,
//       self.isoGroup,
//       objectKey
//     );
//     tile.isoConfig = {x: b, y: c}
//     tile.objectType = "8";
//     that.game.isoPhysics.world.enable(tile);
//     if (tile.body){
//       tile.body.collideWorldBounds = true;
//       tile.body.allowGravity = false;
//       tile.body.immovable = true;
//     }
//     tile.isCollapsable = true;
//     tile.health = 3;
//     tile.states = ['CO3', 'CO2'];
//     tile.behavior = (player: Player, _tile: GenericTile) => {
//       if (!player.playerOnCollapsable && _tile.health && _tile.states) {
//           player.playerOnCollapsable = true;
//           --_tile.health
//           _tile.setTileTexture(_tile.states[_tile.health-1])
//           if (!_tile.health) self.isoGroup.remove(_tile, true)
//       }
//     };
//     tile.objectType = "CollapsableTile";
// }

// export const jumpTile = (props: Props) => {
//   const { a, b, c, that, self, conf, objectKey } = props;
//   const h = conf.height || 2000
//   let tile;
//   tile =  new GenericTile(
//     that.game,
//     that.setPosFromAnchor(b, c).x,
//     that.setPosFromAnchor(b, c).y,
//     h,
//     a, 
//     0,
//     self.isoGroup,
//     objectKey
//   );
//   tile.isoConfig = {x: b, y: c}
//   // tile.setTint(0x8ECAE6);

//   tile.objectType = a;
//   that.game.isoPhysics.world.enable(tile);
//   if(tile.body) {
//     tile.body.collideWorldBounds = true;
//     tile.body.immovable = true;
//     tile.body.allowGravity = false;
//   }
//   tile.isJump = true;
//   tile.objectType = "JumpTile"
// }

// export const buttonTile = (props: Props) => {
//   const { a, b, c, that, self, conf, objectKey } = props;
//   const h = conf.height || 2000
//   let tile: GenericTile;
//   tile =  new GenericTile(
//     that.game,
//     that.setPosFromAnchor(b, c).x,
//     that.setPosFromAnchor(b, c).y,
//     h,
//     a, 
//     0,
//     self.isoGroup,
//     objectKey
//   );
//   tile.isoConfig = {x: b, y: c}
//   //tile.setTint(0xDC341D);
  
//   that.game.isoPhysics.world.enable(tile);
//   if(tile.body) {
//     tile.body.collideWorldBounds = true;
//     tile.body.immovable = true;
//     tile.body.allowGravity = true;
//   }
//   tile.isBtn = true;
//   tile.objectType = "ButtonTile";
// }

// export const wayTile = (props: Props) => {
//   const { a, b, c, that, self, conf, objectKey } = props;
//   const h = conf.height || 2000
//   let tile;
//   tile = new GenericTile(
//     that.game,
//     that.setPosFromAnchor(b, c).x,
//     that.setPosFromAnchor(b, c).y,
//     h,
//     a, 
//     0,
//     self.isoGroup,
//     objectKey
//     );
//     tile.isoConfig = {x: b, y: c}
//   //tile.setTint(0xDC341D);

//   that.game.isoPhysics.world.enable(tile);
//   if(tile.body) {
//     tile.body.collideWorldBounds = true;
//     tile.body.immovable = true;
//     tile.body.allowGravity = false;
//   }
//   tile.isConnectable = true;
// }

// export const endTile = (props: Props) => {
//   const { a, b, c, that, self, conf, objectKey } = props;
//   const h = conf.height || 2000
//   let tile: GenericTile;
//   tile = new GenericTile(
//     that.game,
//     that.setPosFromAnchor(b, c).x,
//     that.setPosFromAnchor(b, c).y,
//     h,
//     a, 
//     0,
//     self.isoGroup,
//     objectKey
//   );
//   console.log(tile, 'key 123')
//   tile.isoConfig = {x: b, y: c}
//   that.game.isoPhysics.world.enable(tile);
//   if(tile.body) {
//     tile.body.collideWorldBounds = true;
//     tile.body.immovable = true;
//     tile.body.allowGravity = false;
//   }
//   tile.isEnd = true;
//   tile.isOn = a.includes('-')
//   tile.onConnect = () => {
//     toggleImage(tile);
//     tile.isOn = !tile.isOn
//   }
//   tile.behavior = () => {
//     if (tile.isOn) window.location.reload();
//   }
//   tile.objectType = "EndTile";
// }

// // export const testTile = (props: Props) => {
// //   const { a, b, c, that, self, conf, objectKey } = props;
// //   const h = conf.height || 2000
// //   let text
// //   if (a === "4") text = "test4"
// //   else if (a === "5") text = "test5"
// //   else if (a === "8") text = "test8"
// //   else text = "test6"
// //   let tile: GenericTile;
// //   tile =  new GenericTile(
// //     that.game,
// //     that.setPosFromAnchor(b, c).x,
// //     that.setPosFromAnchor(b, c).y,
// //     h,
// //     text, 
// //     0,
// //     self.isoGroup
// //   );
// //   tile.isoConfig = {x: b, y: c}
// //   tile.objectType = a;
  
// //   that.game.isoPhysics.world.enable(tile);
// //   if(tile.body) {
// //     tile.body.collideWorldBounds = true;
// //     tile.body.immovable = true;
// //     tile.body.allowGravity = false;
// //   }
// //   tile.isJump = true;
// //   tile.objectType = "base"
// //   if (a === "6"){
// //     // let r1 , r2
// //     tile.intersects = (a:Player, b:GenericTile, value: boolean) => {
// //       // if (r1) r1.destroy()
// //       // if (r2) r2.destroy()
// //       // if (value === true) {
// //         // console.log(a._isoBounds, b._isoBounds)
// //         const playerRectangle = new Phaser.Geom.Rectangle(a.self.x, a.self.y, a.self.width, a.self.height)
// //         // r1 = new Phaser.GameObjects.Rectangle(self ,a.self.x, a.self.y, a.self.width, a.self.height, 0xff0000).setDepth(999999999999999999999999)
// //         // r1.setPosition(a.self.x, a.self.y)
// //         // self.add.existing(r1);
        
// //         const tileRectangle = new Phaser.Geom.Rectangle(b.self.x - b.self.width/2, b.self.y - b.self.height/2, b.self.width/2, b.self.height/2)
// //         // r2 = new Phaser.GameObjects.Rectangle(self ,b.self.x, b.self.y, b.self.width/4, b.self.height/4, 0x00ff00).setDepth(999999999999999999999999)
// //         // // r2.setRotation(Math.PI/4)
// //         // r2.setPosition(b.self.x, b.self.y-b.self.height/2)
// //         // self.add.existing(r2);
// //         // console.log(playerRectangle.contains(tileRectangle.x, tileRectangle.y), "ARIEL");
// //         if (value === true) {
// //           // console.log(Phaser.Geom.Rectangle.ContainsRect(r2, r1))
// //           // console.log(r1.x,r1.y)
// //           // console.log(r2.x,r2.y)
// //           // console.log(r1.width, r1.height)
// //           // console.log(r2.width, r2.height)
// //           if (Phaser.Geom.Rectangle.ContainsRect(playerRectangle, tileRectangle) === false){
// //             b.customDepth = 5001
// //           }
// //         }
// //         else {
// //           b.customDepth = undefined
// //         }
// //         // iso bound con x,y,z entren en el x,y,z del otro
// //       }
    
// //     tile.primarySprite = that.game.add.sprite(0,0,'test9');
// //     tile.primarySprite.setOrigin(0.5, 0.75)
// //     tile.container.add(tile.primarySprite)
// //     self.isoGroup.add(tile.primarySprite)
// //     that.game.isoPhysics.world.enable(tile.primarySprite);
// //   }

// // }

// const toggleImage = (tile: any) => {
//   if (tile.texture.key === tile.imageOff) {
//     tile.setTexture(tile.imageOn);
//   } else if (tile.texture.key === tile.imageOn) {
//     tile.setTexture(tile.imageOff);
//   }

// }