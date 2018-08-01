import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public imgSrc: String = '';
  //Tablero
  public board: any[] = [];
  // Variable que comprueba que se llenó el tablero
  public filled: boolean = false;
  //Número de la columna de dónde se quiere dejar caer la ficha
  public selectedGhost: number = 4;
  //Varable para saber el turno
  public P1Turn: boolean = true;
  //Variable que se usa para no permitir ningún moviemiento cuando una ficha este cayendo
  protected isWorking: boolean = false;
  //Profundidad de la columna
  public columnLevel: number[] = [0, 0, 0, 0, 0, 0, 0];
  //Número de espacios llenos en el tablero
  private fullSpaces: number = 0;

  //URL de las imágenes de las fichas
  protected P1IMGSRC = 'https://vignette.wikia.nocookie.net/rickandmorty/images/b/b5/Morty_Token_largec.png/revision/latest?cb=20161001191020';
  protected P2IMGSRC = 'https://vignette.wikia.nocookie.net/rickandmorty/images/7/75/Blips_and_Chitz_Coupon.png/revision/latest?cb=20160909050613'

  constructor(public navCtrl: NavController, private alertCtrl: AlertController) {

    this.imgSrc = this.P1IMGSRC;
    //Se rellena el tablero con una imagen en blanco
    for (var i = 0; i < 6; i++) {
      let array: any[] = [];
      for (var j = 0; j < 7; j++) {
        array.push({
          selectedBy: null,
          img: 'https://vignette.wikia.nocookie.net/nikita2010/images/d/d2/Blank.png/revision/latest?cb=20130725195235'
        });
      }
      this.board.push({ array: array });
    }
  }

  //Función que se llama cuando se presiona click, hace que la ficha baje en la columna seleccionada
  takeTurn() {
    if (!this.isWorking) {
      let ghost = this.selectedGhost; //columna seleccionada (1-7)
      let selectedColumnLevel = this.columnLevel[ghost - 1] + 1;
      if (selectedColumnLevel < 7) {
        this.playSound();
        this.isWorking = true;
        document.querySelector(`#ghost${ghost}`).classList.add(`animated-${selectedColumnLevel}`);
        setTimeout(() => {
          this.columnLevel[ghost - 1] = selectedColumnLevel;

          //Se le asignan valores a las propiedades del campo del tablero
          // console.log('Columna ', this.selectedGhost);
          // console.log('Fila ', selectedColumnLevel);
          // console.log('Nivel de columna ', this.columnLevel);


          if (this.P1Turn) {
            this.board[6 - selectedColumnLevel].array[ghost - 1].img = this.P1IMGSRC;
            this.board[6 - selectedColumnLevel].array[ghost - 1].selectedBy = 'P1';
          } else {
            this.board[6 - selectedColumnLevel].array[ghost - 1].img = this.P2IMGSRC;
            this.board[6 - selectedColumnLevel].array[ghost - 1].selectedBy = 'P2';
          }

          this.checkAllBoard((6 - selectedColumnLevel), (ghost - 1));
          //Se cambia el turno (variables, imágenes)
          this.selectedGhost = 4;
          this.isWorking = false;
          this.P1Turn = !this.P1Turn;
          if (this.P1Turn) {
            this.imgSrc = this.P1IMGSRC;
          } else {
            this.imgSrc = this.P2IMGSRC;
          }

          document.querySelector(`#ghost${ghost}`).classList.remove(`animated-${selectedColumnLevel}`);
          //Si la columna está completamente llena
          if (selectedColumnLevel == 6) {
            document.querySelector(`#ghost${ghost}`).classList.add('full-column');
          }
          // if (this.checkAllBoard()) {
          //   this.Tie();
          // };
          this.fullSpaces++;
          // console.log('espacios we ', this.fullSpaces);
        }, 1000);
      }
    }
  }

  //Alerta de Empate *aún no se usa*
  Tie() {
    // if (!this.isWorking) {
    // }
    let alert = this.alertCtrl.create({
      title: 'Miss',
      subTitle: 'It\'s a tie!',
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          this.reiniciar();
        }
      }]
    });
    alert.present();
  }

  //Alerta de Empate *aún no se usa*
  Winner() {
    // if (!this.isWorking) {
    // }
    let alert = this.alertCtrl.create({
      title: 'You\'ve won',
      subTitle: ':)',
      buttons: [{
        text: 'Dismiss',
        handler: () => {
          this.reiniciar();
        }
      }]
    });
    alert.present();
  }


  //Cuando el usuario mueve el dedo hacia la derecha
  moveRight() {
    if (!this.isWorking) {
      if (this.selectedGhost != 7) {
        this.selectedGhost++;
      }
    }
  }

  //Cuando el usuario mueve el dedo hacia la derecha
  moveLeft() {
    if (!this.isWorking) {
      if (this.selectedGhost != 1) {
        this.selectedGhost--;
      }
    }
  }

  playSound() {
    let audio = new Audio();
    audio.src = '/assets/sounds/tokenSound.mp3';
    audio.play();
  }

  reiniciar() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
  checkAllBoard(fila, columna) {
    let turn: string = '';
    let cntR: number = 0;
    let cntC: number = 0;
    let cnt45: number = 0;
    let cnt135: number = 0;
    if (this.P1Turn) {
      turn = 'P1';
    } else {
      turn = 'P2';
    }

    //Checa las filas
    for (let i = 0; i < 7; i++) {
      let item = this.board[fila].array[i].selectedBy;
      let anterior = null;
      if (i !== 0) {
        anterior = this.board[fila].array[i - 1].selectedBy;
      }
      if ((item === turn) && (anterior === turn || anterior === null || cntR === 0)) {
        cntR++;
      }
      // console.log(i + '. ' + item);
    }
    if (cntR === 4) {
      return this.Winner();
    }
    // Checaste columnas
    for (let i = 0; i < 6; i++) {
      let item = this.board[i].array[columna].selectedBy;
      let anterior = null;
      if (i !== 0) {
        anterior = this.board[i - 1].array[columna].selectedBy;
      }
      if ((item === turn) && (anterior === turn || anterior === null || cntC === 0)) {
        cntC++;
      }
      console.log(i + '. ' + item);
    }
    if (cntC === 4) {
      return this.Winner();
    }

    let difference45R: number = Math.abs(0-columna);
    let difference45C: number = 6-fila-1;

    console.log("INICIA EN: " + difference45C + ',' + difference45R );
     // Checaste diagonal 35
    //  for (let i = 0; i < 6; i++) {
    //   let item = this.board[i].array[columna].selectedBy;
    //   let anterior = null;
    //   if (i !== 0) {
    //     anterior = this.board[i - 1].array[columna].selectedBy;
    //   }
    //   if ((item === turn) && (anterior === turn || anterior === null || cntC === 0)) {
    //     cntC++;
    //   }
    //   console.log(i + '. ' + item);
    // }
    // if (cntC === 4) {
    //   return this.Winner();
    // }

    // let counter: number = 0;
    // let showtoast: boolean = false;
    // this.columnLevel.forEach((element: number) => {

    //   if (element === 6)
    //     counter++;
    //   if (counter === 7) {
    //     showtoast = true;
    //   }
    // });
    // console.log('contador ', counter);
    // return showtoast;
  }
}
