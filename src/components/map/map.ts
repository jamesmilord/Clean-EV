import { RemoteProvider } from './../../providers/remote/remote';
import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  LatLng
 } from '@ionic-native/google-maps';
import { Platform } from 'ionic-angular/platform/platform';


/**
 * Generated class for the MapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {
  stations = [];
  data: any;
  long:any;
  lati:any;

  constructor(private googleMaps: GoogleMaps, public platform: Platform, public geo: Geolocation, private remote: RemoteProvider) {
    platform.ready().then(()=> {
      this.geo.getCurrentPosition().then(async res=>{
       await this.remote.getEvStations();
       this.stations = this.remote.getStations();
      
        this.loadMap(res.coords.latitude, res.coords.longitude);
      }).catch(() =>{
        console.log("error can not get location");
      })
      
    });
  }

   loadMap(la, lo) {
    
        let element: HTMLElement = document.getElementById('map');

        let mapOptions: GoogleMapOptions = {
          camera: {
            target: {
              lat: la,
              lng: lo
            },
            zoom: 15,
            tilt: 20
          }
        };


    
        let map: GoogleMap = this.googleMaps.create(element, mapOptions);
        
          
        // Wait the MAP_READY before using any methods.
        map.one(GoogleMapsEvent.MAP_READY)
          .then((data) => {
            if(data){
              for(var i = 0; i < this.stations.length; i++){
                map.addMarker({
                  title: this.stations[i].name+"\n"+this.stations[i].hours+"\n"+this.stations[i].address+"\n"+this.stations[i].tel,
                  icon: 'green',
                  animation: 'DROP',
                  position: {
                    lat: this.stations[i].lat,
                    lng: this.stations[i].long
                  }
                });

              }

            }
    
          });
      }

}
