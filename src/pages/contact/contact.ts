import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController) {
    setTimeout(()=>{
      this.navCtrl.setRoot(HomePage);
      this.navCtrl.popToRoot();
    },4200);
  }

}
