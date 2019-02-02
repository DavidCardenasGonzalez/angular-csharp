import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, MenuController, ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { JwtHelper } from 'angular2-jwt';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';

import { emailValidator } from '../../shared/email-validation.directive';

import { User } from '../../app/user';
import { SignInService } from './sign-in.service';
import { OrdersHistoryPage } from '../orders-history/orders-history';
import { SignUpPage } from '../sign-up/sign-up';
import { ForgotPasswordPage } from './../forgot-password/forgot-password';
import { globalVars } from './../../app/globalvariables';

@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
  providers: [SignInService, Storage, JwtHelper, User, Facebook, GooglePlus]
})
export class SignInPage implements OnInit {
  idToken: any;
  signInForm: FormGroup;
  token: string;
  submitted = false;
  active = true;
  ngOnInit(): void{
    this.buildForm();
  }
  buildForm(): void{
    // let emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.signInForm = this.formBuilder.group({
      email: [this.navParams.get('username') ? this.navParams.get('username'): '', [
        Validators.required
        ]],
      password: [this.navParams.get('password') ? this.navParams.get('password'): '',[
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(36)
      ]]
    });
  }
  

  validateForm(data?: any){
    
    if (!this.signInForm) {return;}
    const form = this.signInForm;
    
    for(const field in this.formsError){
      const control = form.get(field);
      
      if(control){
        this.formsError[field] = '';
        const messages = this.validationMessages[field];
        for (const key in control.errors){  
          this.formsError[field] = messages[key];
        }
      }
    }
  }

  formsError = {
    email: '',
    password: ''
  }


  validationMessages = {
    email: {
      'required': 'Email is required.',
      'invalidEmail': 'Invalid Email address.'
    },
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password should contain atleast 4 characters',
      'maxlength': 'Password should be less than 36 characters'
    }
  }
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              // private menuController: MenuController, 
              private signInService: SignInService, 
              private storage: Storage, 
              private jwtHelper: JwtHelper,
              private toastCtrl: ToastController,
              private user: User,
              private formBuilder: FormBuilder) {
  }

  
  ionViewDidLoad() {
    // this.menuController.swipeEnable(false);
    // if(this.navParams.get("signupSucess")){
    //   this.presentToast('Sign Up Sucessful. You can now login.', "top")
    // }
  }
  signIn(user, passwd, social){
    let data;
    if(!social){
      this.validateForm(this.signInForm.value)
      this.submitted = true;
      data = {
        "username": this.signInForm.value.email,
        "password": this.signInForm.value.password
      };
    
    }else{
      data = {
        "username": user,
        "password": passwd
      }
    }
    this.storage.set('userDetails', data);
    
    let URL = globalVars.PostSignInApi();
    this.signInService.signInUser(URL, data).subscribe(
      res => {
          if(res.status == 200){            
              this.token = JSON.parse(res['_body'])['access_token'];
              this.idToken = JSON.parse(res['_body'])['id_token'];
              let userID = this.jwtHelper.decodeToken(this.idToken);              
              localStorage.setItem('x-access-token',this.token);   
              localStorage.setItem('userID',this.jwtHelper.decodeToken(this.idToken)['sub']);
              this.user.saveUserId(userID);
              localStorage.setItem('userID', userID.sub);
              this.user.saveUserAccessToken(this.idToken);
              // this.user.scheduleRefresh(this.token);
              this.navCtrl.setRoot(OrdersHistoryPage);
          }
      }, err => {
        var msj = JSON.parse(err['_body'])['error_description'];
        this.presentToast(msj, "bottom")
      });
  }
 
  signupPage(){
    this.navCtrl.setRoot(SignUpPage);
  }
  
  forgot(){
    this.navCtrl.push(ForgotPasswordPage);
  }
  
  presentToast(message, position){
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      closeButtonText: 'OK',
      showCloseButton: true
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();

  } 

}
