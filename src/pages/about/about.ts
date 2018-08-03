import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, AlertController, ViewController, Content } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  private imgSrc: String = '';
  //Tablero
  private board: any[] = [];
  // Variable que comprueba que se llenó el tablero
  private filled: boolean = false;
  //Número de la columna de dónde se quiere dejar caer la ficha
  private selectedGhost: number = 4;
  //Varable para saber el turno
  private P1Turn: boolean = true;
  //Variable que se usa para no permitir ningún moviemiento cuando una ficha este cayendo
  protected isWorking: boolean = false;
  //Profundidad de la columna
  private columnLevel: number[] = [0, 0, 0, 0, 0, 0, 0];
  //Número de espacios llenos en el tablero
  private fullSpaces: number = 0;

  //URL de las imágenes de las fichas
  protected P1IMGSRC = 'https://vignette.wikia.nocookie.net/rickandmorty/images/b/b5/Morty_Token_largec.png/revision/latest?cb=20161001191020';
  protected P2IMGSRC = 'https://vignette.wikia.nocookie.net/rickandmorty/images/7/75/Blips_and_Chitz_Coupon.png/revision/latest?cb=20160909050613'

  constructor(private navCtrl: NavController, private alertCtrl: AlertController, private viewCtrl: ViewController) {

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
  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
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
          // Se revisa el tablero de forma horizontal, vertical y en diagonal
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

  //Alerta de Empate
  Tie() {
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

  //Alerta de Ganador
  Winner() {
    let alert = this.alertCtrl.create({
      title: 'You\'ve won',
      subTitle: ':)',
      buttons: [{
        text: 'Okey',
        handler: () => {
          //this.reiniciar();
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
    //Revisamos en caso de que se llene totalmente el tablero
    if (this.isATie()) {
      return this.Tie();
    } else {
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
        if (cntR === 3 && item !== turn) {
          cntR = 0;
        }
        console.log('fila '+fila,',(i-1) '+i);
        console.log('anterior',anterior);

      }
      if (cntR > 4) {
        return this.Winner();
      }else if(cntR===4){
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
        if (cntC === 3 && item !== turn) {
          cntC = 0;
        }
      }
      if (cntC ===4) {
        return this.Winner();
      }

      let difference45R: number = Math.abs(0 - columna);
      let difference45C: number = 6 - fila - 1;
      let minus: number = 0, x = 0, y = 0;
      if (difference45C <= difference45R) {
        minus = difference45C;
      }
      else {
        minus = difference45R;
      }

      x = difference45C - minus;
      y = difference45R - minus;

      // Revisa las columnas de 45°
      while (y <= 6 && x <= 5) {
        console.log("******************************");
        let item = this.board[5 - x].array[y].selectedBy;
        console.log(5 - x + ',' + y);
        let anterior = null;
        if (5 - x !== 5 && y !== 0) {
          console.log("ANTERIOR " + (6 - x) + ',' + (y - 1));
          anterior = this.board[6 - x].array[y - 1].selectedBy;
          console.log("ANTERIOR " + anterior);
        }
        if ((item === turn) && (anterior === turn || cnt45 === 0) && item !== null) {
          cnt45++;
        }
        if (cnt45 === 3 && anterior === null) {
          cnt45 = 0;
        }
        // console.log('contardor', cnt45);
        // console.log('. ' + item);
        // console.log("******************************");
        y++;
        x++;
      }
      if (cnt45 === 4) {
        return this.Winner();
      } else if (cnt45 > 4) {
        return this.Winner();
      }



      let difference135R: number = Math.abs(0 - columna);
      let difference135C: number = 5 - fila;
      let minuss: number = 0, x2 = 0, y2 = 0;
      if (difference135C <= difference135R) {
        minuss = difference135C;
      }
      else {
        minuss = difference135R;
      }

      x2 = difference135C - minuss;
      y2 = difference135R - minuss;


    }




    // Revisa columnas de 135°







  }
  gotoRoot() {
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.popToRoot();
  }
  isATie() {
    let counter: number = 0;
    let showtoast: boolean = false;
    this.columnLevel.forEach((element: number) => {

      if (element === 6)
        counter++;
      if (counter === 7) {
        showtoast = true;
      }
    });
    return showtoast;
  }
}
