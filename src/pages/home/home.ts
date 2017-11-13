import { RemoteProvider } from './../../providers/remote/remote';
import { ResultPage } from './../result/result';
import { Component, ViewChild, ElementRef} from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [RemoteProvider]
})
export class HomePage {
  @ViewChild('carBrand') carBrand: ElementRef;
  
  model:any;

 allMakes:any;
 allModels:any;

 //brands = [{"value":"s", "name":"select"}, {"value":"h", "name":"honda"}];
 models: any;
 make: any;

  
  
  

  constructor(public navCtrl: NavController, 
    public loadingCtrl: LoadingController,
    private remote: RemoteProvider) {
      this.grabMakeData();
  }


  getSaving(y, m){
    if(y.value.year && m.value && this.make && this.model){
      this.remote.getSavings(y.value.year, m.value, this.make, this.model);
      /*let loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 3000
      });*/
      //this.remote.getPrices(y.value.year, m.value, this.make.name, this.model.name);
      //loader.present();
      //this.navCtrl.push(ResultPage);
     
    }
    
    //console.log(y.value.year+" "+m.value+" "+this.make.name+" "+this.model.name);
  }
  checkbrand(year){
    if(this.make!= "" && year!=""){
      console.log(this.make + year.value.year);
      this.remote.getModel(year.value.year, this.make).then(async ()=>{
        this.allModels = this.remote.getAllModel();
      });
    }
   
   /* if(this.make.name == "honda"){
      console.log(this.make.name);
      this.models = [{"value":"c", "name":"civic"}, {"value":"a", "name":"accord"}];
    }else if(this.make.name == "select"){
      this.models = [];
    }*/
  }

  grabMakeData(){
    this.remote.getMake().then(async()=>{
      this.allMakes = this.remote.getAllMake();
      console.log(this.allMakes);
    });
  }

}
