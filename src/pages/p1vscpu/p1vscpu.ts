import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, AlertController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-p1vscpu',
  templateUrl: 'p1vscpu.html',
})
export class P1vscpuPage {

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

  async globalTurn() {
    this.takeTurn();
    setTimeout( f => {
      if ( !this.P1Turn ) {
        this.takeTurn();
      }
    }, 1500);
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
            this.isWorking = false;
            this.P1Turn = !this.P1Turn;
            if (this.P1Turn) {
              this.selectedGhost = 4;
              this.imgSrc = this.P1IMGSRC;
            } else {
              this.selectedGhost = this.CPU();
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
    let text : string = 'CPU won', text2 : string = ':(';
    if( this.P1Turn ) {
      text = 'You\'ve won';
      text2 = ':)'
    }
    let alert = this.alertCtrl.create({
      title: text,
      subTitle: text2,
      buttons: [{
        text: 'Ok',
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
        if (item === turn) {
          cntR ++;
        } else {
          cntR = 0;
        }
        if (cntR === 4) {
          break;
        }
      }

      if (cntR === 4) {
        return this.Winner();
      }

      // Checaste columnas
      for (let i = 0; i < 6; i++) {
        let item = this.board[i].array[columna].selectedBy;
        if (item === turn) {
          cntC ++;
        } else {
          cntC = 0;
        }
        if (cntC === 4) {
          break;
        }
      }
      if (cntC === 4) {
        return this.Winner();
      }

      let y: number = fila, x: number = columna;
      let exit: boolean = false;
      let count: number = 0;
  
      //Checa diagonal en 45°
      do {
        let item = this.board[y].array[x].selectedBy;
        if (item === turn) {
          cnt45++;
        }
        if (item === null) {
          exit = true;
        } else {
          x--;
          y++;
        }
        count++;
      } while( !exit && count<4 && y>=0 && y<=5 && x>=0 && x<=6 );

      y = fila;
      x = columna;
      cnt45--;
      count = 0;
      exit = false;
      do {
        let item = this.board[y].array[x].selectedBy;
        if (item === turn) {
          cnt45++;
        }
        if (item === null) {
          exit = true;
        } else {
          x++;
          y--;
        }
        count++;
      } while( !exit && count<4 && y>=0 && y<=5 && x>=0 && x<=6 );
  
      if (cnt45 >= 4) {
        return this.Winner();
      }

      
      y = fila;
      x = columna;
      count = 0;
      exit = false;
      //Checa diagonal en 135
      do {
        let item = this.board[y].array[x].selectedBy;
        if (item === turn) {
          cnt135++;
        }
        if (item === null) {
          exit = true;
        } else {
          x--;
          y--;
        }
        count++;
      } while( !exit && count<4 && y>=0 && y<=5 && x>=0 && x<=6 );

      y = fila;
      x = columna;
      cnt135--;
      count = 0;
      exit = false;
      do {
        let item = this.board[y].array[x].selectedBy;
        if (item === turn) {
          cnt135++;
        }
        if (item === null) {
          exit = true;
        } else {
          x++;
          y++;
        }
        count++;
      } while( !exit && count<4 && y>=0 && y<=5 && x>=0 && x<=6 );

      if (cnt135 >= 4) {
        return this.Winner();
      }

      //Revisamos en caso de que se llene totalmente el tablero
      if (this.isATie()) {
        return this.Tie();
      }
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

  CPU() {
    let col : number = 0;
    do {
      col = Math.floor(Math.random()*(6-0+1)+0)
    } while( this.columnLevel[ col ] >= 6);
    return col+1;
  }
}

