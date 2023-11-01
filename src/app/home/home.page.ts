import { Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import {icon, Marker} from 'leaflet';
import { Inject, Input, OnInit } from '@angular/core';
// import { error } from 'console';

// export const DEFAULT_LAT=-23.96512;
// export const DEFAULT_LON=-46.38381;
const iconRetinaUrl='assets/marker-icon-2x.png';
const iconUrl='assets/marker-icon.png';
const shadowUrl='assets/marker-shadow.png';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage  implements OnInit{
private map:any;
// @Input() lat: number = DEFAULT_LAT;
// @Input() lon: number = DEFAULT_LON;

lat: number = 0;
lon: number = 0;
whatchID: any;

  
  constructor() {}

  getLocalizacao(){
    this.whatchID = navigator.geolocation.watchPosition((postion)=>{
      this.lat = postion.coords.latitude;
      this.lon = postion.coords.longitude;
      this.initMap();
    }, (error)=>{
      console.log(error.code+ - "Mensagem: "+error.message)
    });
  }

  ngOnInit(): void {
    // this.initMap();
  }
private initMap(){
  //Configuração do mapa
  this.map=L.map('map',{
    center: [this.lat, this.lon],
    attributionControl: false,
    zoom: 10
  });
  //Personalizar os ícones
  var iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });
  L.Marker.prototype.options.icon= iconDefault;

  //Marca com popup
  const lon = this.lon+0.009;
  const lat = this.lat+0.009;
  /*
  const marker = L.marker(
    [lat + 0.005, lon + 0.005]
  ).bindPopup("Outro Local");
  marker.addTo(this.map);
  */

  //Titulo
  const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom: 19,
    attribution: '&copy; <a href="https://etecdrc.com.br/cms/">Etec</a>'
  });

  //Marca circular
  const mark = L.circleMarker([
    this.lat, this.lon
  ]);
  mark.addTo(this.map);

//Criar uma rota
L.Routing.control({
  router: L.Routing.osrmv1({
    serviceUrl: 'https://router.project-osrm.org/route/v1/'
  }),
  showAlternatives: true,
  fitSelectedRoutes: true,
  show: false, //Informa as direções na tela
  routeWhileDragging: true,
  waypoints: [
    L.latLng(this.lat, this.lon),
    L.latLng(lat, lon)
  ]
}).addTo(this.map);

  
  tiles.addTo(this.map);
  
}

}
