// @ts-ignore 
import { IsoPhysics } from 'phaser3-plugin-isometric';

declare module 'phaser' {
  interface Scene {
    isoPhysics: typeof IsoPhysics;
  }
}