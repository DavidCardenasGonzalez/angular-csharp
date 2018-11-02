import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { ServicesPage } from '../services/services';
import { LaundryItemsService } from './laundryitems.service';
import { LaundryItemData } from '../../models/laundryitem.model';
import { globalVars } from '../../app/globalvariables';
import { PreGenModel } from '../../models/preGen.model';
import { AuthService } from "../../auth/auth.service";

import { AlertDialogFactory } from "../../app/alert.dialog";
@Component ({
    selector: 'laundry_items',
    templateUrl: 'laundryitems.html',
    providers:[AuthService, 
               LaundryItemsService, 
               JwtHelper,
               AlertDialogFactory] 
})

export class LaundryItems implements OnInit{
  selectedItem: any;
  icons: string[];
  titles: string[];
  laundryitems : Array<LaundryItemData> = [];;
  responseArray : Array<Object> = [];
  preGenData: PreGenModel;
  params : Array<Object> = [];
  laundryitems2: any;
  selectedItem2: any;
  token: string;
  refreshController : any;
  hideActivityLoader: boolean;
  grandTotalItemCount: number = 0;
  orderItems: any[] = [];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private items_Service: LaundryItemsService, 
              private storage: Storage,
              private authService: AuthService,
              private alertCntrl: AlertDialogFactory) {
    this.selectedItem = navParams.get('item');
    this.preGenData = navParams.get('preGenData');
    this.token = localStorage.getItem('x-access-token');
    console.log(this.token);
    
    // this.loc = navParams.get('pickupDetails');
}


  ngOnInit(){
    this.getLaundryItems();
    console.log(tokenNotExpired(null, this.token));
  }

  getLaundryItems = () => {
    console.log(this.selectedItem);
    let URL = globalVars.getLaundryitemsApiURL();
    this.authService.getCall(URL)
    .subscribe(res => {
      if(res.status == 200) {
          this.laundryitems =  JSON.parse(res['_body']);;
          console.log(this.laundryitems)
          this.orderItems = this.laundryitems.map(x=>{
            return {
              name : x.name,
              icon: 'kc-jeans',
              quantity: 0
            }
          })
          //this.maplaundryitems(this.laundryitems);
        }
        
    },error=>{

      this.hideActivityLoaders();
    },()=>{
     
      this.hideActivityLoaders();
    })
    console.log("laundryitems",this.laundryitems);
  }

hideActivityLoaders(){

      this.hideActivityLoader = true;
      // check if refreshController is'nt undefined
      if(this.refreshController)
      this.refreshController.complete();
}

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getLaundryItems();
  
   this.refreshController = refresher;
  }

// increment product qty
  incrementQty(item) {
    item.quantity++;
  }

  // decrement product qty
  decrementQty(item) {
    item.quantity--;
  }

// addWashingAmountToTotal(item) : number{

//    return item.rate.wash * item.count  ;
// }
// addDryCleaningAmountToTotal(item) :number{

//   return item.rate.dryclean *item.count  ;
// }
totalAmount(){
  return this.orderItems.reduce(function(sum,obj){
    return obj.quantity + sum;
  },0)
   
}

 startNextScreen()
  {
    let jsonArray : Array<Object> = []
        console.log(this.params);
        
        this.params.forEach(element => {
        // this.grandTotalItemCount += element["count"];
        jsonArray.push({
              name: (element as any).name,
	            rate:(element as any).amount,
	            count: (element as any).count,
	            toWash:(element as any).toWash,
	            toDry:(element as any).toDry,
              

          })
        })
        console.log("this.grandTotalItemCount", this.grandTotalItemCount);
        
        if(!!this.grandTotalItemCount){
          console.log(this.grandTotalItemCount);
          
          console.log('Inside If, jsonArray:', jsonArray);
          
          let laundryData = {laundryItems : jsonArray};
        
        console.log("laundry data = ",laundryData);
        let items = JSON.stringify(laundryData.laundryItems);
        localStorage.setItem('Laundry Items', items);
        let URL =  globalVars.patchLaundryitemsApiURL((this.preGenData.data as any)._id);
        console.log(URL)
        this.authService.patchCall(URL,laundryData)
        .subscribe(res => {
              if(res.status == 200) {
                let response = JSON.parse(res['_body']) 
                
                console.log('final response = ', response);
                this.navCtrl.push(ServicesPage, {
                  preGenData: this.preGenData
                });
              }
          });
        }else{
          this.alertCntrl.openAlertDialog("What's missing?", "No item selected.");
        }
        
      console.log("Next clicked!");
  }
}