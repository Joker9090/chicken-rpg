export type BackgroundColors = {
    hover: number;
    normal: number;
    click: number;
}


export class LargeButtonWithText extends Phaser.GameObjects.Container {
    background: Phaser.GameObjects.Graphics;
    content: Phaser.GameObjects.Text;
    row: number;
    col: number;
    callback: Function;
    isActive: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, text: string, row: number, col: number, BackgroundColors: BackgroundColors = {hover: 0x0056b3, normal: 0x007bff, click: 0x140059}, callback: Function) {
        super(scene, x, y);

        this.row = row; // Posición para la grid si no uso el grid aling
        this.col = col; // Posición para la grid si no uso el grid aling
        this.callback = callback; 


        this.background = scene.add.graphics();
        this.drawBackground(width, height, BackgroundColors.normal);
        
        this.background.setInteractive(
            new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
            Phaser.Geom.Rectangle.Contains
        );
        this.drawBackground(width, height, BackgroundColors.normal); 


        this.content = scene.add.text(0, 0, text, {
            fontFamily: 'MontserratSemiBold',
            fontSize: '16px',
            color: '#ffffff',
            wordWrap: { width: width },
            fixedWidth: width,
            fixedHeight: height,
        }).setAlign('center').setOrigin(0.5);
        

        this.add([this.background, this.content]);

        this.background.on('pointerover', () => {
            if(!this.isActive)this.drawBackground(width,height,BackgroundColors.hover);
        });
        this.background.on('pointerout', () => {
            if(!this.isActive)this.drawBackground(width,height,BackgroundColors.normal);
        });

        
        this.background.on('pointerdown', () => {
            this.isActive = !this.isActive;
            if(this.isActive) this.drawBackground(width,height,BackgroundColors.click);
            else this.drawBackground(width,height,BackgroundColors.normal);
            if (callback) callback(this.row, this.col); // Pasar la posición a la función ?
        });

        scene.add.existing(this);
    }

    private drawBackground(width: number, height: number, color: number) {
        this.background.clear();
        this.background.fillStyle(color, 1);
        this.background.fillRoundedRect(-width / 2, -height / 2, width, height, 20);
    }
}
