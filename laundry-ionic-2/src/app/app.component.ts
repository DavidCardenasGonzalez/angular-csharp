import { DropOffDetails } from './../pages/drop-off-details/drop-off-details';
import { LoaderComponent } from './../pages/loader/loader';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, NativeStorage } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { JwtHelper, AuthHttp, AuthConfig } from 'angular2-jwt';
import { Http } from "@angular/http";
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig
} from '@ionic-native/background-geolocation';


//import { LaundryMap } from '../pages/map/map.component';
import { ProfileComponent } from '../pages/profile/profile';
import { NotificationComponent } from '../pages/notifications/notifications';
import { RatesListComponent } from '../pages/rates-list/rates-list'
import { SignInPage } from '../pages/sign-in/sign-in'
import { OrdersHistoryPage } from '../pages/orders-history/orders-history';
import { ComplaintsSuggestionsPage } from '../pages/complaints-suggestions/complaints-suggestions';
import { PaymentMethodsPage } from '../pages/payment-methods/payment-methods';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
// import { SpinnerDialog } from '@ionic-native/spinner-dialog';
//import { IonicNativeMapPage } from "../pages/ionic-native-map/ionic-native-map";
import { User } from './user';
import { AuthService } from "./../auth/auth.service";
import { globalVars } from "./globalvariables"
@Component({
  templateUrl: 'app.html',
  providers: [Storage,
    JwtHelper,
    User,
    BackgroundGeolocation,
    AuthService
  ]

})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any; //= SignInPage;

  pages: Array<{ title: string, component: any }>;
  constructor(public platform: Platform,
    private storage: Storage,
    private backgroundGeolocation: BackgroundGeolocation,
    private jwtHelper: JwtHelper,
    private user: User,
    private authService: AuthService
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation

    this.pages = [
      { title: 'Home', component: OrdersHistoryPage },
      { title: 'Profile', component: ProfileComponent },
      { title: 'Payment Method', component: PaymentMethodsPage },
      { title: 'Rates List', component: RatesListComponent },
      //{ title: 'Notifications', component: NotificationComponent },
      { title: 'Complaints and Suggestions', component: ComplaintsSuggestionsPage },
      // { title: 'ForgotPassword', component: DropOffDetails},

      { title: 'Sign Out', component: SignInPage }

    ];

  }

  refreshToken() {
    let SignInURL = globalVars.PostSignInApi();
    let token: string;
    this.storage.get('userDetails')
      .then(
        details => {
          token = this.authService.postCall(SignInURL, details)
        }
      )
    if (!!token) {
      return token;
    } else {
      return null;
    }
  }

  initializeApp() {
    //this.spinnerDialog.show();
    this.platform.ready().then(() => {

      this.storage.get('x-access-token').then(

        token => {
          if (!!token) {
            this.refreshToken();

            // Token exists

            localStorage.setItem('x-access-token', token);
            // localStorage.setItem('userID', this.jwtHelper.decodeToken(token)['_id']);
            this.rootPage = OrdersHistoryPage;
          } else {

            // Token does not exist

            this.rootPage = SignInPage;
            console.log('Could not find X-Access-Token. Please login or signup');
          }
        },
        error => {
          // Other error
          console.log(error);
        }
      );

      setTimeout(() => {
        Splashscreen.hide();
      }, 100);
      // Splashscreen.hide(); 
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    if (page.title == "Sign Out") {
      this.storage.clear().then(((result) => {
        this.nav.setRoot(page.component);
        // localStorage.clear();
      }));
    }
    else
      this.nav.setRoot(page.component);
  }
}
