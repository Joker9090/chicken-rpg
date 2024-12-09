import Phaser from 'phaser';
import { ModalBase } from './ModalBase'; 
import RPG from '@/game/rpg';

type SubView = {
    title?: string,
    content?: string,
    background?: Phaser.GameObjects.Image;
    goback: Function, // conectar boton aca || createButton?
}

type PrincipalView = {
    //closeButton
    //Array sub view buttons ?
}

export class MultiViewModal extends ModalBase {
    currentView: string = 'main'; 
    buttons: Phaser.GameObjects.Container [] = [];

    constructor(scene: RPG, x: number, y: number) {
        super(scene, x, y);
        this.scene = scene;

        const modalBackground = this.scene.add.image(0, 0, 'modalBackground').setOrigin(0.5);
        

        // Contenedores para las vistas
        const mainView = this.createMainView();
        const subView1 = this.createSubView('Sub View 1', 'Content Sub View 1').setVisible(false);
        const subView2 = this.createSubView('Sub View 2', 'Content Sub View 2').setVisible(false);



        //cambiar entre vistas
        const showView = (view: string) => {

            this.buttons.forEach(button => {
                const key = button.getData('key');
                if (view === 'main') {
                    button.setVisible(key !== 'main');
                } else {
                    button.setVisible(key === 'main');
                }
            });

            mainView.setVisible(false);
            subView1.setVisible(false);
            subView2.setVisible(false);
            if (view === 'main') {
                mainView.setVisible(true);
                subView1.setVisible(false);
                subView2.setVisible(false);
            } else if (view === 'subView1') {
                mainView.setVisible(false);
                subView1.setVisible(true);
                subView2.setVisible(false);
            } else if (view === 'subView2') {
                mainView.setVisible(false);
                subView1.setVisible(false);
                subView2.setVisible(true);
            }

            this.currentView = view;
        };

        this.buttons.push(
            this.createButton(-100, 100, 'Go to View 1', () => showView('subView1'), 'subView1'),
            this.createButton(100, 100, 'Go to View 2', () => showView('subView2'), 'subView2'),
            this.createButton(0, 160, 'Back to Main', () => showView('main'), 'main').setVisible(false)
        );

        this.buttons.forEach(button => this.add(button));

        const buttonsContainer = this.scene.add.container(0, 0, this.buttons);

        this.add([modalBackground, mainView, subView1,subView2,buttonsContainer]);
    }

  
    createMainView(){
        const container = this.scene.add.container(0, 0);
        const text = this.scene.add.text(-100, 0, 'Main View', { fontSize: '32px', color: '#ffffff' });
        container.add(text);
        return container;
    }

    createSubView(title: string, content: string) {
        const container = this.scene.add.container(-100, 0);
        const titleText = this.scene.add.text(0, -50, title, { fontSize: '32px', color: '#ffffff' });
        const contentText = this.scene.add.text(0, 0, content, { fontSize: '24px', color: '#ffffff' });
        container.add([titleText, contentText]);
        return container;
    }

    createButton(x: number, y: number, text: string, callback: () => void, key: string) {
        const button = this.scene.add.image(x, y, 'btnExit').setInteractive();
        button.on('pointerdown', callback);
        const buttonText = this.scene.add.text(x, y + 20, text, { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5);
        const buttonElement = this.scene.add.container(0, 0, [button, buttonText]);
        buttonElement.setData('key', key);
        return buttonElement;
    }

    findButtonByKey(key: string) {
        return this.buttons.find(button => button.getData('key') === key);
    }
}
