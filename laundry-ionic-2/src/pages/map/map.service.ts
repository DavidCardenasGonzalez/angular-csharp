import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http'
import { GoogleMap, LatLng } from "@ionic-native/google-maps";
import { Geolocation } from "@ionic-native/geolocation";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { Storage } from '@ionic/storage';

@Injectable()

export class MapService {
    constructor(private http: Http, private storage: Storage, private geolocation: Geolocation) {
    }
    myApiKey = 'AIzaSyApZPtbOvksktaiJ9APlQlvckBNP9Fb7Iw';
    monterreyLatLng = {
        lat: 25.6487281,
        lng: -100.4431818,
    }
    getJSON = (place: string) => {
        let googleLocationApi = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place}&location=${this.monterreyLatLng.lat},${this.monterreyLatLng.lng}&radius=50000&key=${this.myApiKey}`;
        console.log(googleLocationApi);
        return this.http.get(googleLocationApi)
            .map(res => JSON.parse(res['_body']).results)
        // .map(e=> e.formatted_address)


    }

    reverseGeocoding = (lat, lang) => {
        var googleLocationApi = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat}, ${lang}&key=${this.myApiKey}`;
        console.log(googleLocationApi);
        return this.http.get(googleLocationApi)
            .map(res => JSON.parse(res['_body']).results)
        // .map(e=> e.formatted_address)


    }

    patchAddress = (URL: string, data: any, token?: any) => {
        let headers = new Headers({ 'x-access-token': token });
        let options = new RequestOptions({ headers: headers });
        console.log("Hitting", URL);
        return this.http.patch(URL, data, options);
    }

    getAddress = (URL) => {
        console.log("Hitting", URL);
        return this.http.get(URL);
    }


}