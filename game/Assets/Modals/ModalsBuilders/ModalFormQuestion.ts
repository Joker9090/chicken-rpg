//hace una clase ModalFormQuestion que sea un container que le vamos a pasar un array con un question(texto), y 4 posibles respuestas que van a ser de tipo LargeButtonWithText
//que se van a crear en el constructor, y que se van a añadir al container

import { formQuestionType } from "@/game/maps/mapCreationFunctions";
import { LargeButtonWithText } from "../ModalComponents/LargeButtonWithText";


export class ModalFormQuestion extends Phaser.GameObjects.Container {
    question: Phaser.GameObjects.Text;
    answers: LargeButtonWithText[];
    constructor(scene: Phaser.Scene, x: number, y: number, activeQuestion: formQuestionType, callback: Function) {
        super(scene, x, y);
        this.question = scene.add.text(0, 0, activeQuestion.question, {
            fontFamily: 'MontserratSemiBold',
            fontSize: '16px',
            color: '#ffffff',
            wordWrap: { width: 500 },
            fixedWidth: 500,
            fixedHeight: 100,
        }).setAlign('center').setOrigin(0.5);
        const groupAnswer = this.scene.add.group();
        this.answers = activeQuestion.answers.map((answer, i) => {
            let lb = new LargeButtonWithText(scene, 0 , 0, 200, 50, answer.text, i, 0, {hover: 0x0056b3, normal: 0x007bff, click: 0x140059}, (row: number, col: number) => {
                console.log('click on Large', row, col, answer.isCorrect);
                callback(answer.isCorrect);
            });

            
            groupAnswer.add(lb);


            return lb;
        });

        let amountStartX = -120;
        let startY = -180;
        let rowHeight = 90;

        this.answers.forEach((answer, i) => {
            Phaser.Actions.GridAlign(groupAnswer.getChildren(), {
                width: 2,
                height: 2,
                cellWidth: 230,
                cellHeight: rowHeight,
                x: amountStartX,
                y: startY + i * rowHeight
            });
        });

        this.add([this.question, ...this.answers]);
    }
}


