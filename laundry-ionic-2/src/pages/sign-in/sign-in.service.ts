import { Injectable } from '@angular/core';
import { Http, Headers,URLSearchParams } from '@angular/http';
//import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class SignInService {
    constructor(private http: Http) { }

    signInUser = (URL, body): any => {
        console.log(URL, body);
        let header = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
            let params = new URLSearchParams();
            params.set('username', body.username)
            params.set('password', body.password)
            params.set('grant_type', 'password')
            params.set('scope', 'openid email phone profile offline_access roles');        
            return this.http.post(URL, params, { headers: header });
    }
}