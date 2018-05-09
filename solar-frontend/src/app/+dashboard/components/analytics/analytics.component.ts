import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { DashboardsServices } from '../../services/dashboards.services';
import { ILoad } from '../../models/load';
import { IDashboardAnalytics } from '../../models/dashboardAnalytics';
import { IChartsData } from '../../models/chartsData';
import { WeatherComponent } from '../weather/weather.component';

declare var L, d3, dc, crossfilter: any;
declare var $;


import { endponitConfig } from '../../../../environments/endpoints';

/**
 * This component deals with rendering charts in dashboard
 */
@Component({
    template: require('./analytics.component.html'),
    encapsulation: ViewEncapsulation.None,
    providers: [DashboardsServices, WeatherComponent]
})

export class AnalyticsComponent implements OnInit {

    public activePageTitle: string;
    public drivers: ILoad[];
    public chartsData: IChartsData[];
    public dashboardAnalytics: IDashboardAnalytics;

    constructor(private router: Router, private dashboardsServices: DashboardsServices, private weatherComponent: WeatherComponent) {
        this.activePageTitle = 'Analytics';
    }

    ngOnInit() {
        this.displayDashBoardAnalytics();
        this.renderDashBoardAnalyticsCharts();
        this.renderDriversCurrentLocationsMap();
    }

    // Displaying dashboard data analytics
    public displayDashBoardAnalytics() {
        this.dashboardsServices.getDashboardAnalytics().subscribe(analyticsData => {
            this.dashboardAnalytics = analyticsData;
        });
    }

    // Displaying charts
    public renderDashBoardAnalyticsCharts() {

        this.dashboardsServices.getChartsData().subscribe(chartsData => {
            var monthlyBubbleChart = dc.bubbleChart('#monthly-bubble-chart');
            var drverEfficiencyChart = dc.pieChart('#driver-efficiency-chart');
            var totalDealersChart = dc.rowChart('#total-dealers-chart');
            var damagedChart = dc.pieChart('#damaged-chart');

            this.chartsData = chartsData;

            var dateFormat = d3.time.format('%Y-%m-%d');

            this.chartsData.forEach(function (d) {
                d.dd = dateFormat.parse(d.date);
                d.month = d3.time.month(d.dd);
            });

            // Cross filters
            var ndx = crossfilter(this.chartsData);
            var all = ndx.groupAll();

            // Monthly delivers cars chart (Bubble Chart)
            var monthNameFormat = d3.time.format("%Y-%b");
            var monthlyDimension = ndx.dimension(function (d) {
                return d.month;
            });

            var colorScale = d3.scale.category20b();


            var monthlyPerformanceGroup = monthlyDimension.group();

            var yRange = [0, d3.max(monthlyPerformanceGroup.all(), function (d) { return d.value + 100; })];

            monthlyBubbleChart
                .width(1000)
                .height(300)
                .margins({ top: 10, right: 50, bottom: 30, left: 40 })
                .dimension(monthlyDimension)
                .group(monthlyPerformanceGroup)
                .keyAccessor(function (p) {
                    return p.key;
                })
                .valueAccessor(function (p) {

                    return p.value;
                })
                .radiusValueAccessor(function (p) {
                    return p.value * 0.1;
                })
                .x(d3.time.scale().domain([new Date(2013, 11, 1), new Date(2016, 12, 1)]))
                .xUnits(d3.time.months)
                .y(d3.scale.linear().domain(yRange))
                .elasticY(true)
                .yAxisPadding(10)
                .clipPadding(10)
                .r(d3.scale.linear().domain([0, 600]))
                .yAxisLabel('No.of Cars Delivered')
                .renderLabel(true)
                .label(function (p) {
                    return [
                        p.value
                    ].join('\n');
                })
                .renderTitle(true)
                .title(function (p) {
                    var monthYearFormat = d3.time.format("%b-%Y");
                    return monthYearFormat(p.key) + ": " + p.value;
                })
                .colors(colorScale);

            // Driver Efficiency Chart
            var driversDimension = ndx.dimension(function (d) {
                return d.driver.toLowerCase();
            });
            var driversGroup = driversDimension.group();

            drverEfficiencyChart.width(600)
                .height(400)
                .radius(150)
                .dimension(driversDimension)
                .group(driversGroup)
                .renderLabel(false)
                .legend(dc.legend())
            //.colors(colorScale);


            // Total Dealers Chart
            var dealersDimension = ndx.dimension(function (d) {
                return d.dealer;
            });
            var dealersGroup = dealersDimension.group();

            totalDealersChart
                .width(800)
                .height(1200)
                .group(dealersGroup)
                .dimension(dealersDimension)
                .elasticX(true)
                .xAxis().ticks(10)
            //.colors(colorScale);

            // Damaged/Undamaged percentage of vins Chart
            var damagedDimension = ndx.dimension(function (d) {
                return d.damaged == '0' ? 'Undamaged' : 'Damaged';
            });
            var damagedGroup = damagedDimension.group();



            damagedChart
                .width(600)
                .height(400)
                .radius(150)
                .dimension(damagedDimension)
                .group(damagedGroup)
                .renderLabel(true)
                .legend(dc.legend())
                .title(function (d) {
                    return d.key + " Count: " + d.value;
                })
                .label(function (d) {
                    if (damagedChart.hasFilter() && !damagedChart.hasFilter(d.key)) {
                        return d.key + ' (0%)';
                    }

                    var label = d.key;
                    if (all.value()) {
                        label += ' (' + Math.round(d.value / all.value() * 100) + '%)';
                    }
                    return label;
                })
                .colors(colorScale);

            //Render charts      
            dc.renderAll();

            //Displaying labels for total dealers chart (horizontal bar chart)
            function addAxisLabels(chartToUpdate, xAxisLabel, yAxisLabel) {
                chartToUpdate.svg()
                    .append("text")
                    .attr("class", "x-axis-label")
                    .attr("text-anchor", "middle")
                    .attr("x", chartToUpdate.width() / 2)
                    .attr("y", chartToUpdate.height())
                    .text(xAxisLabel);

                chartToUpdate.svg()
                    .append("text")
                    .attr("class", "y-axis-label")
                    .attr("text-anchor", "middle")
                    .attr('transform', 'translate(10,' + chartToUpdate.height() / 2 + ') rotate(-90)')
                    .text(yAxisLabel);
            }
            addAxisLabels(totalDealersChart, "Number of Cars", "Dealer");

            //Re-rendering all charts on reset
            $("#monthly-bubble-chart .reset").on('click', function () {
                monthlyBubbleChart.filterAll();
                dc.redrawAll();
            });
            $("#damaged-chart .reset").on('click', function () {
                damagedChart.filterAll();
                dc.redrawAll();
            });
            $("#total-dealers-chart .reset").on('click', function () {
                totalDealersChart.filterAll();
                dc.redrawAll();
            });
            $("#driver-efficiency-chart .reset").on('click', function () {
                drverEfficiencyChart.filterAll();
                dc.redrawAll();
            });
        });
    }

    // Render driver current locations map
    public renderDriversCurrentLocationsMap() {

        var classInstance = this;
        L.mapbox.accessToken = endponitConfig.MAPBOX_ACCESSTOKEN;
        var map = L.mapbox.map('driver_map', 'mapbox.streets')
            .setView([33.831614, -84.208627], 13);

        this.dashboardsServices.getDriverMarkersDetails().subscribe(driverMarkersList => {
            this.drivers = driverMarkersList;
            for (let driver of this.drivers) {
                var marker = L.icon({
                    iconUrl: '../../../../assets/img/app/map/driver.png',
                    id: driver.driverId,
                    iconAnchor: [20, 20]
                });
                var popup = L.popup();
                L.marker([driver.driverLat, driver.driverLong], { icon: marker })
                    .on('mouseover', function (e) {
                        popup.setLatLng(e.latlng)
                            .setContent('<html><b>DriverName : </b>' + driver.driverName +
                            '<br><b>Load Number : </b>' + driver.loadNum + '</html>')
                            .openOn(map);
                    })
                    .on('click', function (e) {
                        classInstance.weatherComponent.displayWeatherInformation(driver.driverLat, driver.driverLong, driver.loadNum, driver.driverName);
                    })
                    .addTo(map);
            }
        });
    }
}

