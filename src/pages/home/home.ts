import { P1vscpuPage } from './../p1vscpu/p1vscpu';
import { AboutPage } from './../about/about';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }
  addP1vsP2(){
    setTimeout(() => {
        this.navCtrl.push(AboutPage);
    }, 400);
  }
  addP1vsCPU(){
    setTimeout(() => {
      this.navCtrl.push(P1vscpuPage);
  }, 400);
  }

}
