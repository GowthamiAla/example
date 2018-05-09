import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { DashboardsServices } from '../../services/dashboards.services';
import { IMyOptions, IMyDateModel, IMyDate } from 'mydatepicker';
declare var L, d3, dc, crossfilter, $: any;
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { setTimeout } from 'timers';
/**
 * This component deals with rendering charts in dashboard
 */
@Component({
    templateUrl: './dcLoadAnalysis1.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [DashboardsServices],
    styles: [`
    .FilterDropDownAnimation {
        -webkit-animation-name: none !important;
        -moz-animation-name: flipInX !important;
        -o-animation-name: flipInX !important;
        animation-name: none !important;
        -webkit-animation-duration: 0s !important;
        -moz-animation-duration: .4s !important;
        -o-animation-duration: .4s !important;
        animation-duration: 0s !important;
        -webkit-animation-fill-mode: none !important;
        -moz-animation-fill-mode: both !important;
        -o-animation-fill-mode: both !important;
        animation-fill-mode: none !important;
    }

    .filterFormAlign {
        margin-top: 5px !important;
    }

    .filterDropwdownViewAlign {
        width: 280px !important;
        color: black;
        padding: 0px !important;
    }

    @media only screen and (min-width:768px) {
        .filterDropwdownViewAlign {
            left: -160px !important;
        }
    }

    @media only screen and (max-width: 479px) and (min-width: 320px) {
        .filterDropwdownViewAlign {
            left: -200px !important;
        }
    }

    @media only screen and (min-width:479px) and (max-width:768px) {
        .filterDropwdownViewAlign {
            min-width: 335px !important;
            left: -280px !important;
        }
    }

    `]
})

export class dcLoadAnalysis1Component implements OnInit {
    public DropDownTooglePopup: any;
    public activePageTitle: any;
    public QueryData: any = { startDate: '', endDate: '' };
    public QueryDataEndDate;
    public QueryDataStartDate;
    public isSearchQuerySubmitted: boolean;
    public errorMessage;
    public serviceErrorResponse;
    public serviceErrorData;
    
    private myDatePickerOptions: IMyOptions = {
        // other options...
        // dateFormat: 'mm-dd-yyyy',
        dateFormat: 'yyyy-mm-dd',
        showTodayBtn: false,
        showClearDateBtn: false,
        editableDateField: false,
        height: '30px',
        selectionTxtFontSize: '14px',
        indicateInvalidDate: true,
    };
    constructor(private dashboardServices: DashboardsServices) {
        this.activePageTitle = 'dcLoadAnalysis1';
    }
    ngOnInit() {

        this.QueryData.startDate = '2017-01-01';
        this.QueryData.endDate = '2017-01-28';

        this.QueryData.endDate = { 'date': { 'day': 28, 'month': 1, 'year': 2017 } }
        this.QueryData.startDate = { 'date': { 'day': 1, 'month': 1, 'year': 2017 } }


        this.dashboardServices.getAnalyticsData().toPromise().then((response) => {
            this.renderDashBoardAnalyticsCharts(response)
        },error=>{
            this.serviceErrorResponse = error.exception;
			this.serviceErrorData = true;
        });
    }

    public renderDashBoardAnalyticsCharts(data) {

        const onTimeDeliveryStatsCharts = dc.barChart('#on-time-delivery-stats-chart');
        const priorityChart = dc.rowChart('#priority-chart');
        const earlyvsLateLoadsChart = dc.pieChart('#early-vs-late-loads-chart');
        const colorScale = d3.scale.category20b();
        const dateFormat = d3.time.format('%Y-%m-%d');
        const numberFormat = d3.format('.2f');

        data.forEach(function (d) {
            d.cd = dateFormat.parse(d.createDate);
            d.sad = dateFormat.parse(d.scheduledArrivalDate);
            d.aad = dateFormat.parse(d.actualArrivalDate);
        });

        let mdx = crossfilter(data);
        let all = mdx.groupAll();

        const scheduleArrivalDateDim = mdx.dimension(function (d) {
            return d.sad;
        });

        const loadsGroup = scheduleArrivalDateDim.group();

        const minDate = scheduleArrivalDateDim.bottom(1)[0].sad;
        const maxDate = scheduleArrivalDateDim.top(1)[0].sad;

        mdx = crossfilter(data);
        all = mdx.groupAll();

        const dcDim = mdx.dimension(function (d) {
            return d.destination;
        });

        const dcGroup = dcDim.group();
        onTimeDeliveryStatsCharts
            .width(1000 - 30)
            .height(300)
            .margins({ top: 10, right: 10, bottom: 100, left: 50 })
            .dimension(dcDim)
            .group(dcGroup)
            .brushOn(true)
            .centerBar(true)
            .elasticY(true)
            .valueAccessor(function (d) {
                return d.value;
            })
            .x(d3.scale.ordinal().domain(dcDim.top(Infinity).map(function (d) { return d.destination })))
            .xUnits(dc.units.ordinal)
            .colors(colorScale)
            .renderlet(function (chart) {
                chart.selectAll('g.x text')
                    .style('text-anchor', 'end')
                    .attr('transform', 'translate(-10,0)rotate(315)')
            });

        // WHEN la.high_value = 1 THEN 1 '
        // + ' WHEN la.high_priority = 1 THEN     2

        const priorityDim = mdx.dimension(function (d) {
            let priority;
            if (d.highValue == 1) {
                priority = 'High Value';
            } else if (d.highPriority == 1) {
                priority = 'High Priority';
            } else {
                priority = 'Normal Load';
            }
            return priority;
        });

        const priorityGroup = priorityDim.group();
        priorityChart
            .width(500 - 20)
            .height(300)
            .dimension(priorityDim)
            .group(priorityGroup)
            .x(d3.scale.linear())
            .elasticX(true)
            .ordinalColors(['maroon', 'orange', 'green'])
            .gap(25);

        const earlyDim = mdx.dimension(function (d) {
            const dateOne = new Date(d.sad);
            const dateTwo = new Date(d.aad);
            let earlyLoads;
            if (dateOne <= dateTwo) {
                earlyLoads = 'Early Loads';
            } else if (dateOne > dateTwo) {
                earlyLoads = 'Late Loads';
            }
            return earlyLoads;
        });

        const earlyGroup = earlyDim.group();

        earlyvsLateLoadsChart
            .width(500 - 20)
            .height(300)
            .radius(100)
            .dimension(earlyDim)
            .group(earlyGroup)
            .legend(dc.legend())
            .colors(colorScale)
            .label(function (d) {
                if (earlyvsLateLoadsChart.hasFilter() && !earlyvsLateLoadsChart.hasFilter(d.key)) {
                    return d.key + ' (0%)';
                }

                let label = d.key;
                if (all.value()) {
                    label += ' (' + Math.round(d.value / all.value() * 100) + '%)';
                }
                return label;
            });
        dc.renderAll();

        // Re-rendering all charts on reset
        $('#on-time-delivery-stats-chart .reset').on('click', function () {
            onTimeDeliveryStatsCharts.filterAll();
            dc.redrawAll();
        });
        $('#priority-chart .reset').on('click', function () {
            priorityChart.filterAll();
            dc.redrawAll();
        });
        $('#early-vs-late-loads-chart .reset').on('click', function () {
            earlyvsLateLoadsChart.filterAll();
            dc.redrawAll();
        });

        // changing the text color on charts based on smart admin theme
        if (localStorage.getItem('sm-skin') === 'smart-style-5') {
            d3.selectAll('text').style('fill', 'white');
        }
    }




    openReportsDropDown() {
        this.DropDownTooglePopup = 'open';
    }

    onReportsEventCancel() {
        // closing the dropdown view
        this.DropDownTooglePopup = '';
    }

    onReportsEventSubmit() {
        if (this.QueryData.startDate != '') {
            const st_year = this.QueryData.startDate.date.year;
            const st_month = this.QueryData.startDate.date.month;
            const st_day = this.QueryData.startDate.date.day;
            const startDate = st_year + '-' + st_month + '-' + st_day;

            this.QueryDataStartDate = moment(startDate).format('YYYY-MM-DD');
        } else {
            this.QueryDataStartDate = ''
        }

        if (this.QueryData.endDate != '') {
            const end_year = this.QueryData.endDate.date.year;
            const end_month = this.QueryData.endDate.date.month;
            const end_day = this.QueryData.endDate.date.day;
            const endDate = end_year + '-' + end_month + '-' + end_day;
            this.QueryDataEndDate = moment(endDate).format('YYYY-MM-DD');
        } else {
            this.QueryDataEndDate = '';
        }

        if (this.QueryDataStartDate === '' && this.QueryDataEndDate === '') {
            this.isSearchQuerySubmitted = true;
        } else {
            // this.loading = true;
            try {
                if (new Date(this.QueryDataStartDate) > new Date(this.QueryDataEndDate)) {
                    this.errorMessage = 'End date should be greater than start date';
                    setTimeout(()=>{
                        this.errorMessage='';
                    },2000)
                } else {
                    this.errorMessage = '';

                    const dateRangeObject = {
                        'RP_startdate': this.QueryDataStartDate,
                        'RP_enddate': this.QueryDataEndDate
                    }
                    // this.loading = true;
                    this.dashboardServices.generateReportsData('Analysis', dateRangeObject).toPromise().then((response) => {
                        this.DropDownTooglePopup = '';
                        const blob = new Blob([response], { type: 'application/pdf' });
                        saveAs(blob, 'Performance_Analysis.pdf');
                        const fileURL = URL.createObjectURL(blob);
                        window.open(fileURL);
                    },error=>{
                        this.serviceErrorResponse = error.exception;
                        this.serviceErrorData = true;
                    });
                }
            } catch (error) {
                console.error('Getting  filtered data completed  in Analytics');
            }
            this.isSearchQuerySubmitted = false;
        }
    }
}
