
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular/platform/platform';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


/*
  Generated class for the RemoteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RemoteProvider {
  modelArray =[];
  make: any;
  makeArray = [];
  stationsArray=[];
  data:any;
  stations: any;
  long:any;
  lati:any;
  mpgCar:any;
  avg:number;
  avgtotall: number = 0;
  count:number = 0;

  constructor(public http: Http,
    public platform: Platform, 
    public geo: Geolocation) {
    console.log('Hello RemoteProvider Provider');
   
    platform.ready().then(()=>{
      this.geo.getCurrentPosition().then(res=>{
        this.lati = res.coords.latitude;
        this.long = res.coords.longitude;
      }).catch(() =>{
        console.log("error can not get location");
      })
      
    });
  }



  getMake(){
    return this.http.get("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json")
    .map(res=>{
      this.makeArray = [];
      let make = res.json();
      console.log(make.Results[0].Make_Name);
      for(var i = 0; i< 200; i++){
        this.makeArray.push(make.Results[i].Make_Name);
      }
    }).toPromise();
  }
  getModel(y, ma){
    //console.log(mo+" "+ma+" "+ye+" "+lo );
    return this.http.get("https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/"+ma+"/modelyear/"+y+"?format=json")
    .map(res=>{
      let data = res.json();
      console.log(data);
      for(var i = 0; i < data.Results.length; i++){
        console.log(data.Results);
        this.modelArray.push(data.Results[i].Model_Name);
      }
    }).toPromise();
  }

  getEvStations(){
    return this.http.get("https://api.openchargemap.io/v2/poi/?output=json&countrycode=US&maxresults=200&latitude="+this.lati+"&longitude="+this.long)
    .map(res=>{
      this.stationsArray = [];
      let stations = res.json();``
      console.log(stations);
      for(var i = 0; i < stations.length; i++){
        let obj = {"lat":"", "long":"", "name":"", "address":"", "tel":"", "hours":""};
        obj.lat = stations[i].AddressInfo.Latitude;
        obj.long = stations[i].AddressInfo.Longitude;
        obj.tel = stations[i].AddressInfo.ContactTelephone1;
        obj.address = stations[i].AddressInfo.AddressLine1;
        obj.name = stations[i].AddressInfo.Title;
        obj.hours = stations[i].AddressInfo.AccessComments;
        this.stationsArray.push(obj);
      }
      console.log(this.stationsArray);
      
    }).toPromise();
  }

  getGazPrice(){
    return this.http.get("http://api.mygasfeed.com/stations/radius/"+this.lati+"/"+this.long+"/5/reg/price/tozypp5oqi.json")
    .map(res=>{
      let price = res.json();
      console.log(price);
       /*for(var i = 0; i < 15; i++){
        console.log(price.stations[0].reg_price);
       if(price.stations[i].reg_price !== "N/A"|| price.stations[i].reg_price !== "" || price.stations[i].reg_price !== null){
          this.avgtotall= this.avgtotall + price.stations[i].reg_price;
          this.count++
        }
        
      }*/
      this.avgtotall = 2.60;
      console.log(this.avgtotall);
      console.log(this.count);
      this.avg = this.avgtotall/this.count;
      console.log(this.avg);
    }).toPromise();

  }

  getMpg(ma, mo, ye){
    return this.http.get("http://www.fueleconomy.gov/ws/rest/ympg/shared/vehicles?make="+ma+"&model="+mo)
    .map(async (res)=>{
      await this.getGazPrice();
      let mpg = res.json();
      for(var i = 0; i< mpg.vehicle.length; i++){
        if(mpg.vehicle[i].year = ye){
          this.mpgCar = mpg.vehicle[i].city08;
        }else{
          this.mpgCar = mpg.vehicle[0].city08;
        }
      }
      console.log(this.mpgCar);
     

    }
  
  ).toPromise()

  }

  getSavings(y, m, ma, mo ){
    console.log(y+" "+m+" "+ma+" "+mo);
    this.getMpg(ma, mo, y)

  }

  getStations(){
    return this.stationsArray;
  }

  getAllMake(){
    return this.makeArray.sort();
  }

  getAllModel(){
    return this.modelArray;
  }

}
