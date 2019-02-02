import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PickUpDetails } from '../pick-up-details/pick-up-details';
import { PreGenModel } from '../../models/preGen.model';
import { CareInstructionsService } from './care-instructions.service';
import { globalVars } from '../../app/globalvariables';
import { AuthService } from "../../auth/auth.service";
//import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { AlertDialogFactory } from "../../app/alert.dialog";
@Component({
  selector: 'care-instructions',
  templateUrl: 'care-instructions.html',
  providers: [AuthService,
    CareInstructionsService,
    AlertDialogFactory]
})

export class CareInstructions {
  preGenData: PreGenModel;
  token: string;
  additionalInfoText: string;
  charcount: Object = {
    ls: 0,
    dc: 0
  }
  dryCleanining;
  laundered;
  constructor(private navCtrl: NavController,
    public navParams: NavParams,
    private careInstructionsService: CareInstructionsService,
    private authService: AuthService,
    private alertCntrl: AlertDialogFactory) {
  }
  onTextEnter(value, counter) {
    this.charcount[counter] = value.length
    console.log(value.length);

  }
  startNextScreen(shirtsIns, dryCleanIns) {
    shirtsIns += this.additionalInfoText || '';
    this.navCtrl.push(PickUpDetails, {
      preGenData: this.preGenData
    });
  }
}