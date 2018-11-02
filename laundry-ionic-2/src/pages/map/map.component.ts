import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  NavController,
  NavParams,
  PopoverController,
  Popover,
  AlertController,
  ToastController,
  Platform
} from 'ionic-angular';
import {
  Http,
  Headers,
  RequestOptions
} from '@angular/http';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker
} from "@ionic-native/google-maps";
import { Geolocation } from '@ionic-native/geolocation';
import { MapService } from './map.service';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { AndroidPermissions } from "@ionic-native/android-permissions";
import * as _ from 'underscore';

import 'rxjs/add/operator/debounceTime';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';

import { AuthService } from "../../auth/auth.service";
import { AlertDialogFactory } from '../../app/alert.dialog'
import { LaundryItems } from '../laundryitems/laundryitems';
import { AdditionalNote } from '../modals/additional-note/additional-note';
import { SavedLocations } from '../modals/saved-locations/saved-locations';
import { SavedLocationService } from "../modals/saved-locations/saved-location.service";

import { PreGenModel } from "../../models/preGen.model";

import { globalVars } from "../../app/globalvariables";

declare var google;

@Component({
  selector: 'laundry-map',
  templateUrl: 'map.template.html',
  providers: [
    MapService,
    GoogleMaps,
    AuthService,
    AndroidPermissions,
    AlertDialogFactory,
    SavedLocationService]
})


export class LaundryMap implements AfterViewInit {
  @ViewChild('search') button: ElementRef;
  // @ViewChild('map') mapElement: ElementRef;
  //mapElement: HTMLElement = ViewChild('map');
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  searchTextBox = "";
  zoom: number = 10;
  saved: boolean;
  addition: boolean;
  save: boolean;
  available_locations: Array<Object> = []
  isModalVisible: boolean;
  popOver: Popover;
  postion: any;
  preGenData: PreGenModel;
  address = {
    number: '',
    street: '',
    suburb: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
  };
  lat: number;
  lng: number;

  locationAlias: string;
  inputFieldValue: string = '';
  addressResponse: any;
  userID: string;
  token: string;
  mapLoadErr: any;
  additionalInfoText: string;
  marker;

  LatLong: LatLng = new LatLng(43.0741904, -89.3809802);
  constructor(private storage: Storage,
    private platform: Platform,
    private navParams: NavParams,
    private googleMaps: GoogleMaps,
    private navCtrl: NavController,
    private mapService: MapService,
    private geolocation: Geolocation,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController,
    private alertCntrl: AlertDialogFactory,
    private toastController: ToastController,
    private adroidPermissions: AndroidPermissions,
    private savedLocationsService: SavedLocationService,
  ) {
    // this.marker = new google.maps.Marker(null);
    this.token = localStorage.getItem('x-access-token');
    this.userID = localStorage.getItem('userID');
    this.preGenData = navParams.get('preGenData');
    // this.createPreGen(this.preGenApiURL, this.token);
  }
  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }
  ionViewDidLoad() {
    var input = document.getElementById('search');
    var input$ = Observable
      .fromEvent(input, 'keyup')
      .debounceTime(1000)
    input$.subscribe(x => this.autocompleteLocation());
    // this.getCurrentPosition();
  }

  setPositionByLocation(lat, lng, movemap?) {
    this.mapService.reverseGeocoding(lat, lng)
      .subscribe(res => {
        var formatedAddress = _.find(res, function (adr) { return adr.types.some(x => x == "street_address") });

        var number = _.find(formatedAddress.address_components, function (adr) { return adr.types.some(x => x == "street_number") });
        var street = _.find(formatedAddress.address_components, function (adr) { return adr.types.some(x => x == "route") });
        var suburb = _.find(formatedAddress.address_components, function (adr) { return adr.types.some(x => x == "sublocality" || x == "sublocality_level_1") });
        var city = _.find(formatedAddress.address_components, function (adr) { return adr.types.some(x => x == "locality") });
        var state = _.find(formatedAddress.address_components, function (adr) { return adr.types.some(x => x == "administrative_area_level_1") });
        var country = _.find(formatedAddress.address_components, function (adr) { return adr.types.some(x => x == "country") });
        var zipcode = _.find(formatedAddress.address_components, function (adr) { return adr.types.some(x => x == "postal_code") });
        this.address = {
          number: number ? number.long_name : '',
          street: street ? street.long_name : '',
          suburb: suburb ? suburb.long_name : '',
          city: city ? city.long_name : '',
          state: state ? state.long_name : '',
          country: country ? country.long_name : '',
          zipcode: zipcode ? zipcode.long_name : '',
        };
        if(movemap){
          this.map.setCenter({lat:lat, lng:lng})
        }
        this.searchTextBox = this.address.street + ' ' + this.address.number;
      },
        err => {
          console.log(err);
        })
  }

  autocompleteLocation() {
    if (this.searchTextBox.length > 3) {
      let location$ = this.mapService.getJSON(this.searchTextBox)
      location$.subscribe(location => {
        this.available_locations = location.map(function (dir) {
          return {
            name: dir.name,
            description: dir.formatted_address,
            lat: dir.geometry.location.lat,
            lng: dir.geometry.location.lng,
          }
        }
        );
      })
    }
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((position) => {
      this.setPositionByLocation(position.coords.latitude, position.coords.longitude);
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      var that = this;
      this.map.addListener('idle', function() {
          var center = that.map.getCenter();
          that.setPositionByLocation(center.lat(), center.lng());
      });

      // let marker = new google.maps.Marker({
      //   map: this.map,
      //   animation: google.maps.Animation.DROP,
      //   position: this.map.getCenter()
      // });
    },
      err => {
        console.log("Error", err);
        if (err.code == 1) {
          this.alertCntrl.openAlertDialog("Location Error?", "Please turn on location from settings.");
        }
      }
    )
  }


  savedButtonClicked(myEvent) {
    this.saved = this.saved ? false : true;
    let inputs;
    let URL = globalVars.getUsersAddress(this.userID);
    this.authService.getCall(URL).
      subscribe(res => {
        console.log(JSON.parse(res["_body"]));
        inputs = JSON.parse(res["_body"])["data"]["contact"]["address"];
        console.log(inputs);
        this.checkBoxAlertDialog("Saved Locations", inputs)



      })

  }

  checkBoxAlertDialog(title: string, inputs) {
    let alert = this.alertCtrl.create({
      title: title,
    });

    inputs.forEach(input => {
      alert.addInput({
        type: 'radio',
        label: input.alias,
        value: input,
        checked: false
      });
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data:', data);
      }
    });
    alert.present();
    alert.onDidDismiss((data) => {
      console.log(data);
      data ?
        this.locationClicked(data[0]) : null;
    });

  }
  openSavedLocationModal(myEvent) {
    let popover = this.popoverCtrl.create(SavedLocations, { address: this.addressResponse }, { showBackdrop: true });
    popover.present({
      ev: myEvent
    });
    this.saved = this.saved ? false : true;
    popover.onDidDismiss(popoverAddress => {
      popoverAddress ?
        this.locationClicked(popoverAddress) : '';
    });
  }

  saveButtonClicked() {
    this.save = this.save ? false : true;
    let userID = localStorage.getItem("userID");
    let URL = globalVars.UserAddress(userID);
    let data = {
      alias: this.locationAlias,
      address: this.address,
      lat: this.lat,
      long: this.lng
    }
    this.authService.patchCall(URL, data)
      .subscribe(res => {
        if (res.status == 200) {
          console.log(res['_body']);
        }

      });
  }


  openAdditionalNoteDialog(myEvent) {
    let popover = this.popoverCtrl.create(AdditionalNote, {}, { showBackdrop: true });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      if (data) {
        this.additionalInfoText = data + "\n";
        localStorage.setItem("additionalInfoText", this.additionalInfoText);
      }
    })
  }

  additionButtonClicked(myEvent) {
    this.addition = this.addition ? false : true;
    console.log("additionButtonClicked");
    this.openAdditionalNoteDialog(myEvent);
  }

  locationClicked(location) {
    this.setPositionByLocation(location.lat, location.lng, true);
    this.available_locations = [];
  };

  validate(): boolean {
    return (this.lat != null && this.lng != null && this.address != null) ? true : false;
  }
  startNextScreen() {
    console.log("Next clicked!");
    let valid: boolean = this.validate();
    console.log(valid);

    if (valid === true) {
      console.log(this.preGenData);
      this.navCtrl.push(LaundryItems, {
        preGenData: this.preGenData,
        pickupDetails: {
          location: {
            lat: this.lat,
            lng: this.lng,
            address: this.address
          }
        },

      });
    }
    else
      this.alertCntrl.openAlertDialog("What's missing?", "No location selected.");

    // Temporary hack Delete it
    console.log(this.preGenData);
    this.navCtrl.push(LaundryItems, {
      preGenData: this.preGenData,
      pickupDetails: {
        location: {
          lat: this.lat,
          lng: this.lng,
          address: this.address
        }
      },

    });
  }
  presentToast() {

  }
}


