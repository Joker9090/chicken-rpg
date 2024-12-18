import RPG from "@/game/rpg";
import EventsCenterManager from "../../../services/EventsCenter";
import { ModalBase } from "./ModalBase";
import { globalState } from "@/game/GlobalDataManager";
import { ModalFormQuestion } from "./ModalFormQuestion";
import { formQuestionType } from "@/game/maps/mapCreationFunctions";



export class ModalForm extends ModalBase {
    scene: RPG;
    agreeButton: Phaser.GameObjects.Image;
    activeTween: Phaser.Tweens.Tween | null = null;
    lastIndex: number = 0;
    questionsContainer: Phaser.GameObjects.Container;

    constructor(
        scene: RPG,
        x: number,
        y: number,
    ) {
        super(scene, x, y);
        this.scene = scene;

        const globalData: globalState = EventsCenterManager.emitWithResponse(EventsCenterManager.possibleEvents.GET_STATE, null)

        const allNews = globalData.news

        const globalFakeData = {
            items: [
                {
                    question: "¿Cuál es la capital de Francia?",
                    answers: [
                        { text: "Madrid", isCorrect: false },
                        { text: "París", isCorrect: true },
                        { text: "Londres", isCorrect: false },
                        { text: "Berlín", isCorrect: false },
                    ]
                },
                {
                    question: "¿Cuál es el río más largo del mundo?",
                    answers: [
                        { text: "Amazonas", isCorrect: true },
                        { text: "Nilo", isCorrect: false },
                        { text: "Misisipi", isCorrect: false },
                        { text: "Yangtsé", isCorrect: false },
                    ]
                },
                {
                    question: "¿Cuál es el país más grande del mundo?",
                    answers: [
                        { text: "Rusia", isCorrect: true },
                        { text: "Canadá", isCorrect: false },
                        { text: "China", isCorrect: false },
                        { text: "Estados Unidos", isCorrect: false },
                    ]
                },
                {
                    question: "¿Cuál es el océano más grande del mundo?",
                    answers: [
                        { text: "Atlántico", isCorrect: false },
                        { text: "Pacífico", isCorrect: true },
                        { text: "Índico", isCorrect: false },
                        { text: "Ártico", isCorrect: false },
                    ]
                },
            ]
        }

        this.questionsContainer = this.scene.add.container(0, -50);

        const loadQuestions = (questions: formQuestionType[], lastIndex: number) => {
            if(lastIndex > 0) this.questionsContainer.removeAll(true);
            let  activeQuestion = questions[lastIndex];
            console.log("DAVID LOAD QUESTIONS: ", activeQuestion, lastIndex,questions);
            const modalFormQuestion = new ModalFormQuestion(this.scene, 0, 0, activeQuestion , (response: boolean) => {
                console.log("respone modal: ",response);
                if (lastIndex < questions.length - 1) {
                    this.lastIndex = lastIndex + 1;
                    loadQuestions(questions, this.lastIndex);
                } else {
                    this.handleClose();
                }
            });
            this.questionsContainer.add(modalFormQuestion);
            /*questions.forEach((question, i) => {
                const modalFormQuestion = new ModalFormQuestion(this.scene, 0, i * 150, question.question, question.answers.map(answer => answer.text));
                this.questionsContainer.add(modalFormQuestion);
            });*/
        }

        const availableNews = allNews.filter(news => !news.readed);
        if (availableNews.length === 1) this.eventCenter.emit(this.eventCenter.possibleEvents.RESTART_NEWS, undefined);
        //const newsSelected = availableNews[Math.floor(Math.random() * availableNews.length)];
        //EventsCenterManager.emit(this.eventCenter.possibleEvents.READ_NEWSPAPER, newsSelected.id);

        //Modals containers
        const topContainer = this.scene.add.container(0, -170);

        const tweenButtonOver = (_target: any) => {
            this.activeTween = this.scene.tweens.add({
                targets: _target,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 300,
                yoyo: true,
                repeat: -1,
                ease: 'lineal',
            });
        }

        const tweenButtonOut = (_target: any, scale: number = 1) => {
            this.activeTween = this.scene.tweens.add({
                targets: _target,
                scaleX: scale,
                scaleY: scale,
                duration: 200,
                ease: 'Bounce.easeOut'
            });

        }

        //backgroundModal
        const modalBackground = this.scene.add.image(0, 0, "diarioBackground").setOrigin(0.5).setScale(0.5);

        //LEFT BUTTON
        this.agreeButton = this.scene.add.image(0, 0, "btn").setOrigin(0.5).setInteractive();

        const leftTextButton = this.scene.add.text(0, 0, "CONTINUAR", {
            fontFamily: "MontserratSemiBold",
            fontSize: '16px',
            color: '#ffffff',
        }).setOrigin(0.5);



        //TOP CONTAINER
        const btnExit_p = this.scene.add.image(255, -40, "btnExit").setInteractive();

        btnExit_p.on('pointerup', () => {
            this.handleClose();
        });
        btnExit_p.on("pointerover", () => {
            //btnExit_p.setAlpha(0.5);
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOver(btnExit_p);
        });
        btnExit_p.on("pointerout", () => {
            //btnExit_p.setAlpha(1);
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOut(btnExit_p);
        });

        //@ts-ignore
        const title_p = this.scene.add.text(0, -35, "MODAL FORM", {
            fontFamily: "MontserratBold",
            fontStyle: "bold",
            fontSize: '24px',
            color: '#ffffff',
            wordWrap: { width: 300 },
            fixedWidth: 300,
            fixedHeight: 0,
        }).setAlign('center').setOrigin(0.5);

        topContainer.add([
            title_p,
            btnExit_p,
        ]);

        this.agreeButton.on('pointerup', () => { 
            //this.handleClose() 
            loadQuestions(globalFakeData.items, this.lastIndex);
        });


        //Buttons Container
        const buttonsContainer = this.scene.add.container(130, 225);

        //LEFT BUTTON


        this.agreeButton.on("pointerover", () => {
            //this.agreeButton.setAlpha(0.5);
            //leftTextButton.setAlpha(0.5);
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOver(buttonsContainer);
        });
        this.agreeButton.on("pointerout", () => {
            //this.agreeButton.setAlpha(1);
            //leftTextButton.setAlpha(1);
            if (this.activeTween) this.activeTween.stop();
            tweenButtonOut(buttonsContainer);
        });



        buttonsContainer.add([
            this.agreeButton,
            leftTextButton,
        ]);


        this.modalContainerWithElements.add([
            modalBackground,
            topContainer,
            this.questionsContainer,
            buttonsContainer
        ]);
    }
}