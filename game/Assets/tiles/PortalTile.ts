import { GenericTile } from "./GenericTile";

export class PortalTile extends GenericTile {
    glow?: Phaser.GameObjects.Sprite
    top?: Phaser.GameObjects.Sprite
    backGlow?: Phaser.GameObjects.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number, z: number, texture: string, frame?: string | number, group?: Phaser.GameObjects.Group) {
        super(scene, x, y, z, texture, 0, group);
        this.isConnectable = true;
        this.isoConfig = {x: x, y: y}
        this.objectType = "PortalTile";
        this.top = this.scene.add.sprite(0, -166, 'PO+top')
        this.backGlow = this.scene.add.sprite(0, -166, 'PO+backLigth')
        this.glow = this.scene.add.sprite(0, -166, 'PO+ligth').setDepth(10000)
        this.container.add(this.top)
        this.container.add(this.glow)
        this.container.add(this.backGlow)
        this.onConnect = () => {
            this.toggleImage()
            this.isOn = !this.isOn
        }
        this.sound = scene.sound.add('teleport');
        this.sound.setVolume(0.1);
        console.log(this, 'juampi2')
    }
    /* FIX del portal 
    Si nos suscribimos al preUpdate de la escena, podemos obtener la referencia al jugador y establecer la profundidad personalizada del portal en relación con el jugador.
    Es necesario llamar a super.preUpdate porque este dispara la funcion nativa de pre Update que esta dentro del IsoSpriteBox
    Hay que modificar un poco la ecuacion pero ya es solo problema de matematicas
    */
   preUpdate(time: number, delta: number): void {
        if (this.scene.player) {
            if (this.scene.player.x < this.x && this.scene.player.y > this.y) {
                this.customDepth = this.scene.player.depth - 2;
            } else {
                this.customDepth = this.scene.player.depth + 2;
            }
        }
        super.preUpdate(time, delta);
        // console.log("BARTO AHORA?", this.scene.player)
    }
}