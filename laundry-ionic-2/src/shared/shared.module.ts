import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Geolocation } from '@ionic-native/geolocation';

import { emailValidatorDirective } from './email-validation.directive';

@NgModule({
    declarations: [
        emailValidatorDirective
    ],
    imports: [CommonModule],
    exports: [
        emailValidatorDirective
    ],
    providers: [
        Geolocation
    ]
})
export class SharedModule {
}