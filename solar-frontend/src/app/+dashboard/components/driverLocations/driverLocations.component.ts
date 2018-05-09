import { Component, Type, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/driverLocations.services';
import { CurrentLoad } from '../../models/dashboard.data';
import { Observable } from 'rxjs/Observable';
import { $WebSocket } from 'angular2-websocket/angular2-websocket'
import { WeatherComponent } from '../weather/weather.component';

declare var L: any;
declare var $;


import { endponitConfig } from '../../../../environments/endpoints';

@Component({
  template: require('./driverLocations.html'),
  providers: [DashboardService, WeatherComponent]
})
export class DriverLocationsComponent {
  public load: CurrentLoad[];
  public getloadsdetails: any = 123;
  public loaddetails: CurrentLoad = new CurrentLoad('', '', '', '', '', '');
  public map;
  public marker;
  public dealerImage = '././assets/img/map/dealer_icon.png'; //window.location.origin+""+document.getElementById("dealer-image").innerText;
  public driverImage = '././assets/img/map/PickupInspector.png'; // window.location.origin+""+document.getElementById("driver-image").innerText;
  public pickupInspectorImage = 'resources/theme/img/map/truck-icon.png';
  public weatherIcon = '././assets/img/map/weather.png';
  public pcpUpInSP_lat = "33.881315";
  public pcpUpInSP_lang = "-84.255382";
  public pcpUpInspName = "Terminal Manager";
  public directions = L.mapbox.directions();
  public myLayer;
  public directionsLayer;
  public routes;
  public origin = [];
  public activePageTitle: string;
  loadListQueryArray: Array<any> = [];
  public loadNumberList = [{ value: '', label: '' }];
  public drivermarker = [];
  public dealermarker = [];
  public waypointmarker = [];
  public weatherDriverlat = ''; 
  public weatherDriverlng = '';
  public weatherLoadnum = '';


  constructor(private dashboardService: DashboardService, private router: Router, private weatherComponent: WeatherComponent) { this.activePageTitle = 'Driver Locations'; }
  ngOnInit() {
    L.mapbox.accessToken = 'pk.eyJ1Ijoia2NlYTk5IiwiYSI6ImNpeGcwZGV3cTAwMGIyb253Z3g5bmJpMnIifQ.B0pZrnhEOmaPwHmmQH1nyw';
    this.map = L.mapbox.map('map', 'mapbox.streets', {
      zoomControl: true,
      minZoom: 2,
      maxZoom: 10
    }).setView([33.891315, -84.255382], 14);


    this.getAcceptedLoads();
  }



  loadQueryData: any = { loadNumber: '' };

  public getloadDetailsbyLoadnum(value: any): void {
    this.clearfields();
    let loadNum = value.value;
    this.weatherLoadnum = loadNum;
    this.dashboardService.getloadsbyloadnumber(loadNum)
      .then(response => {
        this.getLoaddetails(response);
      },
      error => console.log(error));
  }

  private getAcceptedLoads(): void {
    console.info("Getting  all documents  started");
    this.dashboardService.getAcceptedloadNumbers().subscribe(response => {
      this.loadListQueryArray = response.data;
      let loadNumberList = new Array(this.loadListQueryArray.length);

      for (let i = 0; i < this.loadListQueryArray.length; i++) {
        loadNumberList[i] = {
          value: this.loadListQueryArray[i].toString(),
          label: this.loadListQueryArray[i].toString()
        };
      }
      this.loadNumberList = loadNumberList.slice(0);
    },
      error => console.log(error),
      () => console.log('Getting  all documents complete in DocumnetListComponent'));
  }


  public getLoaddetails(resp) {
    this.map.remove();
    this.directions = new L.mapbox.directions();
    this.map = L.mapbox.map('map', 'mapbox.streets', {
      zoomControl: true,
      minZoom: 2,
      maxZoom: 20
    }).setView([33.891315, -84.255382], 13);
    this.getAcceptedLoads();
    this.directionsLayer = L.mapbox.directions.layer(this.directions)
      .addTo(this.map);
    var directionsErrorsControl = L.mapbox.directions.errorsControl('errors', this.directions)
      .addTo(this.map);
    var directionsRoutesControl = L.mapbox.directions.routesControl('routes', this.directions)
      .addTo(this.map);

    let currentloaddetails = this.loaddetails;
    resp.dealerList.sort(function (a, b) {
      return (a.seq - b.seq);
    });
    var marker = "";
    marker = L.icon({
      iconUrl: this.driverImage,
      iconAnchor: [0, 0]
    });
    let geoJson = [];
    geoJson = [{
      "geometry": { "coordinates": [resp.driverLat, resp.driverLong] }
    }];
    this.weatherDriverlat = resp.driverLat;
    this.weatherDriverlng = resp.driverLong;
    this.loaddetails.driverName = resp.driverName;
    document.getElementById('imageDiv').style.display = "block";

    if (this.drivermarker != [] || this.dealermarker != [] || this.waypointmarker != []) {

      this.map.removeLayer(this.drivermarker);
      this.map.removeLayer(this.dealermarker);
      this.map.removeLayer(this.waypointmarker);
    }
    this.drivermarker = L.marker([geoJson[0].geometry.coordinates[0], geoJson[0].geometry.coordinates[1]], { icon: marker })
      .bindPopup("Driver : " + resp.driverName)
      .addTo(this.map);

    //  this.map.removeLayer(dirvermarker);
    this.origin.push(geoJson[0].geometry.coordinates[0], geoJson[0].geometry.coordinates[1]);

    this.directions.setOrigin(L.latLng(geoJson[0].geometry.coordinates[0], geoJson[0].geometry.coordinates[1]));
    resp.dealerList.forEach(function (d) {
      let delaerJson = {
        "geometry": { "coordinates": [d.latitude, d.longtitude] },
      }
      geoJson.push(delaerJson);
    });
    let waypntscount = resp.dealerList.length;
    var delaermarker = L.icon({
      iconUrl: this.dealerImage,
      iconAnchor: [20, 50]
    });
    let totprevcount = 0;
    let totcurrentcount = 0;
    this.map.setView([geoJson[waypntscount - 1].geometry.coordinates[0], geoJson[waypntscount - 1].geometry.coordinates[1]], 10);
    for (let i = 0; i < (resp.dealerList.length); i++) {
      totprevcount = totprevcount + resp.dealerList[i].vinCount;
      this.waypointmarker = L.marker([geoJson[i + 1].geometry.coordinates[0], geoJson[i + 1].geometry.coordinates[1]], { icon: delaermarker })
        .on('click',
        function (e) {
          let prevcount = 0;
          let currentcount = 0;
          let direction = L.mapbox.directions();
          direction.setOrigin(L.latLng(geoJson[0].geometry.coordinates[0], geoJson[0].geometry.coordinates[1]));
          var count = i + 1;
          currentloaddetails.dealerName = resp.dealerList[count].dealerName;
          for (let j = 0; j < count; j++) {
            prevcount = prevcount + resp.dealerList[j + 1].vinCount;
            direction.addWaypoint(i, L.latLng(geoJson[j + 1].geometry.coordinates[0], geoJson[j + 1].geometry.coordinates[1]));
          }
          currentloaddetails.CurrentSkids = resp.dealerList[count].vinCount;
          currentloaddetails.prevSkids = "" + prevcount;
          currentloaddetails.dealerName = resp.dealerList[i].dealerName;
          direction.setDestination(L.latLng(geoJson[i + 1].geometry.coordinates[0], geoJson[i + 1].geometry.coordinates[1]));
          direction.query();
          direction.on('load', function (e) {
            let distance = 0;
            distance = (e.routes[0].distance / 1000) * 0.621371;
            currentloaddetails.estimationDistance = "" + Math.round(distance) + " mi";
            let Totalduration = 0, mins = 0, hours = '';

            Totalduration = (e.routes[0].duration) / (60 * 60);

            if (Totalduration >= 1) {
              mins = ((e.routes[0].duration) - ((Math.floor(Totalduration) * 3600))) / 60;
              hours = Math.floor(Totalduration) + " hrs " + Math.round(mins) + " mins";
              currentloaddetails.estimatedTime = hours;
            }
            else {
              hours = Math.round(((e.routes[0].duration)) / 60) + " mins";
              currentloaddetails.estimatedTime = hours;
            }
          })
        })
        .bindPopup("Dealer : " + resp.dealerList[i].dealerName)
        .addTo(this.map);
      this.directions.addWaypoint(i, L.latLng(geoJson[i + 1].geometry.coordinates[0], geoJson[i + 1].geometry.coordinates[1]));
    }
    currentloaddetails.dealerName = resp.dealerList[waypntscount - 1].dealerName;
    this.dealermarker = L.marker([geoJson[waypntscount].geometry.coordinates[0], geoJson[waypntscount].geometry.coordinates[1]], { icon: delaermarker })
      .bindPopup("Dealer : " + resp.dealerList[waypntscount - 1].dealerName)
      .addTo(this.map)
    this.directions.setDestination(L.latLng(geoJson[waypntscount].geometry.coordinates[0], geoJson[waypntscount].geometry.coordinates[1]));
    this.directions.query();
    this.directions.on('load', function (e) {
      currentloaddetails.prevSkids = "" + totprevcount;
      currentloaddetails.CurrentSkids = resp.dealerList[waypntscount - 1].vinCount;
      currentloaddetails.dealerName = resp.dealerList[waypntscount - 1].dealerName;
      let distance = 0;

      distance = (e.routes[0].distance / 1000) * 0.621371;
      currentloaddetails.estimationDistance = "" + Math.round(distance) + " mi";
      let Totalduration = 0, mins = 0, hours = '';

      Totalduration = (e.routes[0].duration) / (60 * 60);

      if (Totalduration >= 1) {
        mins = ((e.routes[0].duration) - ((Math.floor(Totalduration) * 3600))) / 60;
        hours = Math.floor(Totalduration) + " hrs " + Math.round(mins) + " mins";
        currentloaddetails.estimatedTime = hours;
      }
      else {
        hours = Math.round(((e.routes[0].duration)) / 60) + " mins";
        currentloaddetails.estimatedTime = hours;
      }
    })
  }
  public clearfields() {
    this.loaddetails.CurrentSkids = '';
    this.loaddetails.dealerName = '';
    this.loaddetails.driverName = '';
    this.loaddetails.estimatedTime = '';
    this.loaddetails.estimationDistance = '';
    this.loaddetails.prevSkids = '';
    this.weatherDriverlat = '';
    this.weatherDriverlng = '';
    this.weatherLoadnum = '';
  }
  public viewWeather() {
    console.log(this.weatherDriverlat, this.weatherDriverlng, this.weatherLoadnum, this.loaddetails.driverName);
    this.weatherComponent.displayWeatherInformation(this.weatherDriverlat, this.weatherDriverlng, this.weatherLoadnum, this.loaddetails.driverName);
  }

}
