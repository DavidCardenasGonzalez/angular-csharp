import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { emailValidator } from '../../shared/email-validation.directive';
import { ProfileService } from './profile.service';
import { globalVars } from '../../app/globalvariables';
import { AuthService } from "../../auth/auth.service";
@Component ({
    templateUrl: 'profile.html',
    selector: 'profile',
    providers: [
      AuthService,
      ProfileService
    ]
})

export class ProfileComponent implements OnInit{
     
    profileForm: FormGroup;
    submitted = false;
    active = true;
    token: any;
    userID: any;
    URL: string;
    userProfile: Object;
    error: boolean = true;
    ngOnInit(){
      console.log('ngOnInit');
        this.token = localStorage.getItem('x-access-token');
        this.userID = localStorage.getItem('userID');
        this.URL = globalVars.profileAPIURL(this.userID);
        this.profileService.getProfile(this.URL, this.token)
          .subscribe(
            res => {
              if (res.status == 200){
                console.log(res['_body']);
                let response = JSON.parse(res['_body']);
                this.userProfile = {
                  fullName: response.fullName,
                  email: response.email,
                  phoneNumber: response.phoneNumber,
                  // password: response.password
                }

                // console.log(this.profileForm.controls['email1'].value);
              
                
                for (var item in this.userProfile) {
                  if (this.userProfile.hasOwnProperty(item)) {
                      this.profileForm.controls[item].patchValue(this.userProfile[item]);
                  }
                }
              } 
            }
          );
        this.buildForm();
        
    }
    buildForm(): void {
      let emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.profileForm = this.formBuilder.group({
        // username: ['', [
        //   Validators.required
        // ]],
        fullName: ['', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)]],
        // password: ['', [
        //   Validators.required,
        //   Validators.minLength(4),
        //   Validators.maxLength(36)
        // ]],
        phoneNumber: ['', [
          Validators.required
        ]],
        email: ['', [
          Validators.required,
          emailValidator(emailReg)
        ]],
      });
    }

    validateForm(data?: any){
    
    if (!this.profileForm) {return;}
    const form = this.profileForm;
    
    for(const field in this.formsError){
      const control = form.get(field);      
      this.error = true;
      if(control){
        this.formsError[field] = '';
        // this.error = false;
        const messages = this.validationMessages[field];
        for (const key in control.errors){  
          this.error = false;
          console.log(control.errors, field);
          console.log(control);          
          this.formsError[field] = messages[key];
          console.log(this.error);
        }
      }
    }
    return this.error ? true: false;
  }
  formsError = {
    fullName: '',
    // password: '',
    phoneNumber: '',
    email: '',
  }

  validationMessages = {
    fullName: {
      'required': 'Ingresa un nombre.',
      'minLength': 'El nombre debe contener mínimo 4 letras',
      'maxlength': 'El nombre es demasiado largo'
    },
    // password: {
    //   'required': 'Agrega una contraseña.',
    //   'minLength': 'La contraseña debe contener mínimo 4 letras',
    //   'maxlength': 'La contraseña es demasiado larga'
    // },
    phoneNumber: {
      'required': 'Agrega tu número telefónico.',
    },
    email: {
      'required': 'Agrega tu correo electronico.',
      'invalidEmail': 'Agrega correctamente tu correo.'
    },
  } 
  ionViewDidLoad(){
    console.log('ionViewDidLoad');
    
  }
    constructor(private navCtrl: NavController,
                private formBuilder: FormBuilder,
                private profileService: ProfileService,
                private toastCtrl: ToastController,
                private authService: AuthService){
                  // console.log('constructor');
    }

    save(){      
        let error = this.validateForm(this.profileForm.value);
        console.log(error);
        if(!this.profileForm.pristine && this.profileForm.valid){ 
          console.log('No error', this.profileForm.valid); 
          let form = this.profileForm.value;
          console.log(form);
          
          var data = {
            "fullName": this.profileForm.value.fullName || null,
            "userName": this.profileForm.value.phoneNumber || null,
            "email": this.profileForm.value.email || null,
            phoneNumber: this.profileForm.value.phoneNumber || null,
            roles: ["cliente"],
            id: this.userID,
          }
          console.log(data);
          
          this.authService.putCall(this.URL, data)
            .subscribe(
              res => {
                if(res.status == 200){
                  console.log(JSON.parse(res['_body']));
                  this.presentToast();
                }

              });
        }else{ 
          console.log('Error', this.profileForm.valid); 
          this.error = !this.error;   
        }
        // this.profileService.putProfile(this.URL, data, this.token)
        console.log("save clicked");
    }

    presentToast(){
    
    console.log('Inside toast');
    
    let toast = this.toastCtrl.create({
      message: 'Profile Updated',
      position: 'bottom',
      closeButtonText: 'OK',
      showCloseButton: true
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();

  } 
}