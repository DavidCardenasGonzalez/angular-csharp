import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, MenuController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JwtHelper } from 'angular2-jwt';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { emailValidator } from '../../shared/email-validation.directive';

import { User } from '../../app/user';
import { SignUpService } from './sign-up.service';
import { SignInService } from './../sign-in/sign-in.service';
import { globalVars } from '../../app/globalvariables';
import { OrdersHistoryPage } from '../orders-history/orders-history';
import { LaundryMap } from '../map/map.component';
import { SignInPage } from '../sign-in/sign-in';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
  providers: [SignUpService,
    SignInService,
    Facebook,
    JwtHelper, Storage,
    User]
})
export class SignUpPage implements OnInit {

  signUpForm: FormGroup;
  submitted = false;
  active = true;
  token: any;
  URL: any = globalVars.PostNewUser(); idToken: any;
  ;
  errors = [];
  ngOnInit() {
    this.buildForm();
  }
  buildForm(): void {
    let emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.signUpForm = this.formBuilder.group({
      username: ['', [
        Validators.required
      ]],
      fullName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]],
      password: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(36)
      ]],
      phoneNumber: ['', [
        Validators.required
      ]],
      email: ['', [
        Validators.required,
        emailValidator(emailReg)
      ]],
    });
  }
  validateForm(data?: any) {
    let errorCount = 0;
    if (!this.signUpForm) { return; }
    const form = this.signUpForm;

    for (const field in this.formsError) {
      const control = form.get(field);

      if (control) {
        this.formsError[field] = '';
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          console.log('Line 79', control.errors);
          this.formsError[field] = messages[key];
          errorCount++;
        }
      }
    }
    return errorCount;
  }
  formsError = {
    fullName: '',
    password: '',
    phoneNumber: '',
    email: '',

  }

  validationMessages = {
    fullName: {
      'required': 'Ingresa un nombre.',
      'minLength': 'El nombre debe contener mínimo 4 letras',
      'maxlength': 'El nombre es demasiado largo'
    },
    password: {
      'required': 'Agrega una contraseña.',
      'minLength': 'La contraseña debe contener mínimo 4 letras',
      'maxlength': 'La contraseña es demasiado larga'
    },
    phoneNumber: {
      'required': 'Agrega tu número telefónico.',
    },
    email: {
      'required': 'Agrega tu correo electronico.',
      'invalidEmail': 'Agrega correctamente tu correo.'
    },
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private jwtHelper: JwtHelper,
    private toastCtrl: ToastController,
    private user: User,
    private signUpService: SignUpService,
    private signInService: SignInService,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private menuController: MenuController) {
    this.menuController.swipeEnable(false);
  }

  ionViewDidLoad() {
    console.log('Line 136', 'ionViewDidLoad SignUpPage');
  }
  signUp() {
    let errorCount = this.validateForm(this.signUpForm.value);
    console.log(errorCount);

    this.submitted = true;
    console.log('Line 141', this.signUpForm.value);

    let URL, data: any;
    URL = globalVars.PostNewUser();
    data = {

      "fullName": this.signUpForm.value.fullName || null,
      "newPassword": this.signUpForm.value.password || null,
      "userName": this.signUpForm.value.phoneNumber || null,
      "email": this.signUpForm.value.email || null,
      isEnabled: true,
      jobTitle: "",
      phoneNumber: this.signUpForm.value.phoneNumber || null,
      roles: ["cliente"],
    }
    let response: any;
    if (!errorCount) {
      this.signUpService.PostNewUser(URL, data)
        .subscribe(res => {
          console.log(res);
          if (res.status == 201) {

            console.log('Line 164', JSON.parse(res['_body']));
            var newData = {
              "username": data.userName,
              "password": data.newPassword
            }
            console.log(newData);

            this.storage.set('userDetails', newData);

            let URL = globalVars.PostSignInApi();
            this.signInService.signInUser(URL, newData).subscribe(
              res => {
                if (res.status == 200) {
                  this.token = JSON.parse(res['_body'])['access_token'];
                  this.idToken = JSON.parse(res['_body'])['id_token'];
                  let userID = this.jwtHelper.decodeToken(this.idToken);

                  localStorage.setItem('x-access-token', this.idToken);
                  localStorage.setItem('userID', this.jwtHelper.decodeToken(this.idToken)['sub']);
                  this.user.saveUserId(userID);
                  localStorage.setItem('userID', userID.sub);
                  this.user.saveUserAccessToken(this.idToken);
                  this.navCtrl.setRoot(OrdersHistoryPage);
                }
              }, err => {
                if (err.status == 401) {
                  this.presentToast(JSON.parse(err['_body'])['message'], "bottom")
                }
              });

          }

        },
          err => {
            this.errors = JSON.parse(err['_body'])[''] ? JSON.parse(err['_body'])[''] : [];
          });
    }

  }
  requestSignIn(data) {
    this.URL = globalVars.PostSignInApi();
    this.signInService.signInUser(this.URL, data)
      .subscribe(res => {
        this.token = JSON.parse(res['_body'])['token'];
        let userID = this.jwtHelper.decodeToken(this.token);
        localStorage.setItem('x-access-token', this.token);
        localStorage.setItem('userID', this.jwtHelper.decodeToken(this.token)['_id']);
        localStorage.setItem('user-id', userID._id);
        this.user.saveUserId(userID);
        this.user.saveUserAccessToken(this.token);
        // this.user.scheduleRefresh(this.token);
      }, err => {
        console.log('Line 217', JSON.stringify(err));

      })
  }
  signinPage() {

    this.navCtrl.setRoot(SignInPage);
  }
  facebook = "facebook";

  presentToast(message, position) {
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      closeButtonText: 'OK',
      showCloseButton: true
    });
    toast.onDidDismiss(() => {
      console.log('Line 353', 'Dismissed toast');
      this.navCtrl.setRoot(SignInPage);
    });

    toast.present();

  }
}
