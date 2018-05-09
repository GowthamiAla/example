import { Component, OnInit } from '@angular/core';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { Http, Response, Headers } from '@angular/http';

import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { JsonApiService } from '../../core/api/json-api.service';
import { AuthService } from '../../+auth/auth.service';


import * as _ from 'lodash';
declare var $: any;



@FadeInTop()
@Component({
  selector: 'sa-health-tables',
  templateUrl: './health-tables.component.html',

})
export class HealthTablesComponent implements OnInit {

  userRole = localStorage.getItem('userRole');
  public solarChart;
  public calendarChart;
  datachartoptions;
  minDiskSpace = 0;
  maxDiskSpace = 100;
  remainingDiskSpace;

  constructor(private router: Router, private http: Http, private jsonApiService: JsonApiService, private authService: AuthService) {
  }

  ngOnInit() {

    // solar health
    this.authService.solarHealthItems().subscribe(
      (data: any) => {
        this.solarChart = this.datachart(data.diskSpace);
      },
      error => {
        if (error.status == 400) {
          localStorage.setItem('status', error.status)
          this.router.navigate(['/error']);
        }
      });

    // calendar Health
    this.authService.calendarHealthItems().subscribe(
      (data: any) => {
        this.calendarChart = this.datachart(data.diskSpace);
      },
      error => {
        if (error.status == 401) {
          localStorage.setItem('status', error.status)
          this.router.navigate(['/error']);
        }
      });
  }


  public datachart(diskSpace: any) {

    this.remainingDiskSpace =
      Math.trunc(((diskSpace.total / 1073741824) - (diskSpace.free / 1073741824)) / ((diskSpace.total / 1073741824)) * 100);

    this.datachartoptions = {
      chart: {
        type: 'solidgauge'
      },

      title: 'null',

      pane: {
        center: ['50%', '50%'],
        size: '100%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: '#EEE',
          innerRadius: '100%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },

      tooltip: {
        enabled: false
      },

      // the value axis
      yAxis: {
        stops: [
          [0.1, '#55BF3B'], // green
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
          y: 100,
          text: 'Disk Space'
        },
        labels: {
          y: 16
        },
        min: this.minDiskSpace,
        max: this.maxDiskSpace
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            borderWidth: 0,
            y: -60
          }
        }
      },

      credits: {
        enabled: false
      },

      series: [{
        name: 'Speed',
        data: [this.remainingDiskSpace],
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:25px;color: black' +
            '">{y}</span>' +
            '<span style="font-size:22px;color:silver;>%</span></div>',
        },
        tooltip: {
          valueSuffix: ' % '
        }
      }]

    }
    return this.datachartoptions;
  }
}

