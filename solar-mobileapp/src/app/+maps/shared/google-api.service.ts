import { Injectable } from '@angular/core';


import { config } from '../../shared/smartadmin.config'

const url = 'https://maps.googleapis.com/maps/api/js?key=' + config.GOOGLE_API_KEY + '&callback=__onGoogleLoaded' + '&libraries=places'

const markerClusterUrl = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js';

@Injectable()
export class GoogleAPIService {

  public loadAPI: Promise<any>;

  constructor() {
    this.loadMarkerClustersScript();
    if (window['google']) {
      this.loadAPI = Promise.resolve(window['google'])
    } else {
      this.loadAPI = new Promise((resolve) => {
        window['__onGoogleLoaded'] = (ev) => {
          console.log('google.maps loaded');
          resolve(window['google']);
        };
        this.loadMarkerClustersScript();
        this.loadScript();
      })
    }
  }

  loadScript() {
    const node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);

  }

  loadMarkerClustersScript() {
    const node = document.createElement('script');
    node.src = markerClusterUrl;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);

  }
}
