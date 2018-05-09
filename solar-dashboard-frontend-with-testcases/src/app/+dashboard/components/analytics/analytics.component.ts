import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { IMyOptions, IMyDateModel, IMyDate } from 'mydatepicker';
import { DashboardsServices } from '../../services/dashboards.services';
import * as moment from 'moment';
declare var L, d3, dc, crossfilter, $: any;
import { saveAs } from 'file-saver';

/**
 * This component deals with rendering charts in dashboard
 */
@Component({
    templateUrl: './analytics.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [DashboardsServices],
})

export class AnalyticsComponent implements OnInit {

    public activePageTitle: any;
    public QueryData: any = { startDate: '', endDate: '' };
    public isSearchQuerySubmitted: boolean;
    private model: Object = { date: { year: 2018, month: 10, day: 9 } };
    private startDate: any;
    private endDate: any;
    public dummyPreview: any;
    public QueryDataEndDate;
    public QueryDataStartDate;
    public errorMessage: String;
    public serviceErrorResponse;
    public serviceErrorData;

    private selDate: any; // IMyDate = {year: 0, month: 0, day: 0};

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
        this.activePageTitle = 'Analytics';


    }
    ngOnInit() {
        $('#noData').hide();
        // default date for get all apointments
        // this.startDate = '2017-01-01';
        // this.endDate = '2017-01-28';

        this.QueryData.startDate = '2017-01-01';
        this.QueryData.endDate = '2017-01-28';

        this.QueryData.endDate = { 'date': { 'day': 28, 'month': 1, 'year': 2017 } }
        this.QueryData.startDate = { 'date': { 'day': 1, 'month': 1, 'year': 2017 } }


        // get all analytics data
        this.dashboardServices.getAnalyticsData().toPromise().then((response) => {
            this.renderDashBoardAnalyticsCharts(response)
        },error=>{ 
            this.serviceErrorResponse = error.exception;
			this.serviceErrorData = true;
        });
    }


    /**
    *  This method gets all filtered dealers details
    */
    public QuerySubmit(): void {
        if (this.QueryData.startDate !== '') {
            const st_year = this.QueryData.startDate.date.year;
            const st_month = this.QueryData.startDate.date.month;
            const st_day = this.QueryData.startDate.date.day;
            const startDate = st_year + '-' + st_month + '-' + st_day;

            this.QueryDataStartDate = moment(startDate).format('YYYY-MM-DD');
        } else {
            this.QueryDataStartDate = ''
        }

        if (this.QueryData.endDate !== '') {
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
                } else {
                    this.errorMessage = '';
                    // this.loading = true;
                    this.dashboardServices.getAllAppointments(this.QueryDataStartDate,
                        this.QueryDataEndDate).toPromise().then((response) => {
                        this.renderDashBoardAnalyticsCharts(response)
                    });
                }
            } catch (error) {
                    this.serviceErrorResponse = error.exception;
                    this.serviceErrorData = true;

                console.error('Getting  filtered data completed  in Analytics');
            }
            this.isSearchQuerySubmitted = false;
        }
    };


    generateReports() {
        if (this.QueryData.startDate !== '') {
            const st_year = this.QueryData.startDate.date.year;
            const st_month = this.QueryData.startDate.date.month;
            const st_day = this.QueryData.startDate.date.day;
            const startDate = st_year + '-' + st_month + '-' + st_day;

            this.QueryDataStartDate = moment(startDate).format('YYYY-MM-DD');
        } else {
            this.QueryDataStartDate = ''
        }

        if (this.QueryData.endDate !== '') {
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
                } else {
                    this.errorMessage = '';
                    // this.loading = true;
                    const dateRangeObject = {
                        'RP_startdate': this.QueryDataStartDate,
                        'RP_enddate': this.QueryDataEndDate
                    }
                    this.dashboardServices.generateReportsData('Analytics_Report', dateRangeObject).toPromise().then((response) => {
                        // this.renderDashBoardAnalyticsCharts(response)
                        const blob = new Blob([response], { type: 'application/pdf' });
                        saveAs(blob, 'Analytics.pdf');
                        const fileURL = URL.createObjectURL(blob);
                        window.open(fileURL);
                    });
                }
            } catch (error) {
                    this.serviceErrorResponse = error.exception;
                    this.serviceErrorData = true;
                console.error('Getting  filtered data completed  in Analytics');
            }
            this.isSearchQuerySubmitted = false;
        }
    }
    public QueryReset(): void {
        this.errorMessage = '';
        this.isSearchQuerySubmitted = false;
        // this.loading = true;
        this.QueryData.endDate = { 'date': { 'day': 28, 'month': 1, 'year': 2017 } }
        this.QueryData.startDate = { 'date': { 'day': 1, 'month': 1, 'year': 2017 } }
        this.QueryDataStartDate = '2017-01-01';
        this.QueryDataEndDate = '2017-01-28';
        this.dashboardServices.getAllAppointments(this.QueryDataStartDate, this.QueryDataEndDate).toPromise().then((response) => {
            this.renderDashBoardAnalyticsCharts(response)
        },error=>{ 
            this.serviceErrorResponse = error.exception;
			this.serviceErrorData = true;
        });
    };
    public renderDashBoardAnalyticsCharts(data) {
        if (data.length === 0) {
            $('#data').hide();
            $('#noData').show();
        } else {
            $('#noData').hide();
            $('#data').show();
            // this.loading = false;
            const loadsChart = dc.barChart('#dc-vs-loads-chart');
            const statusChart = dc.pieChart('#status-chart');
            const appttypeChart = dc.pieChart('#appointment-type-chart');
            const dcChart = dc.barChart('#dc-chart');
            const dataCount = dc.dataCount('#dc-data-count');
            const dataTable = dc.dataTable('.dc-data-table');
            const colorScale = d3.scale.category20b();
            const dateFormat = d3.time.format('%Y-%m-%d');
            const numberFormat = d3.format('.2f');

            data.forEach(function (d) {
                d.cd = dateFormat.parse(d.createDate);
                d.sad = dateFormat.parse(d.scheduledArrivalDate);
                d.aad = dateFormat.parse(d.actualArrivalDate);
            });

            const mdx = crossfilter(data);
            const all = mdx.groupAll();
            const scheduleArrivalDateDim = mdx.dimension(function (d) {
                return d.sad;
            });

            const loadsGroup = scheduleArrivalDateDim.group();

            const minDate = scheduleArrivalDateDim.bottom(1)[0].sad;
            const maxDate = scheduleArrivalDateDim.top(1)[0].sad;

            const width = $('#chartWidth').width();

            loadsChart.width(990 - 30)
                .height(150)
                .dimension(scheduleArrivalDateDim)
                .group(loadsGroup)
                .brushOn(true)
                .elasticX(true)
                .elasticY(true)
                .x(d3.time.scale().domain([minDate, maxDate]))
                .xUnits(d3.time.days)
                .colors(colorScale);

            const statusDim = mdx.dimension(function (d) {
                return d.appointmentStatus;
            });

            const statusGroup = statusDim.group();

            statusChart
                .width(500 - 30)
                .height(200)
                .radius(100)
                .dimension(statusDim)
                .group(statusGroup)
                .on('pretransition', function (chart) {
                    chart.selectAll('text.pie-slice').text(function (d) {
                        const percent = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100;
                        if (percent > 10) {
                            return d.data.key + '-' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
                        } else {
                            return '';
                        }
                    })
                })
                .legend(dc.legend())
                .colors(colorScale);

            const appttypeDim = mdx.dimension(function (d) {
                return d.apptTypNbr;
            });

            const appttypeGroup = appttypeDim.group();

            appttypeChart
                .width(500 - 20)
                .height(200)
                .radius(100)
                .dimension(appttypeDim)
                .group(appttypeGroup)
                .legend(dc.legend())
                .colors(colorScale);

            const getApptTypeName = function (apptType) {
                let name = '';
                switch (apptType) {
                    case '4':
                        name = 'Store to DC';
                        break;
                    case '2':
                        name = 'Carrier to DC';
                        break;
                    case '5':
                        name = 'DC to DC';
                        break;
                    case '11':
                        name = 'Merge Center to DC';
                        break;
                    default:
                        name = apptType;
                }
                return name;
            };

            appttypeChart.on('pretransition', function (chart) {

                chart.selectAll('.dc-legend-item text')
                    .text(' ')
                    .append('tspan')
                    .text(function (d) {
                        return getApptTypeName(d.name)
                    });

                chart.selectAll('text.pie-slice').text(function (d) {
                    const percent = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100;
                    if (percent > 10) {
                        return getApptTypeName(d.data.key) + '-' +
                            dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
                    } else {
                        return '';
                    }
                })
            });

            const destinationDim = mdx.dimension(function (d) {
                return d.destination;
            });

            const destinationGroup = destinationDim.group();
            const classInstance = this;
            dcChart.width(990 - 30)
                .height(250)
                .margins({ top: 20, right: 10, bottom: 80, left: 80 })
                .dimension(destinationDim)
                .group(destinationGroup)
                .brushOn(true)
                .elasticY(true)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                // .colors(colorScale)
                .renderlet(function (chart) {
                    chart.selectAll('g.x text')
                        .style('text-anchor', 'end')
                        .attr('transform', 'translate(-10,0)rotate(315)')
                })

            dataCount
                .dimension(mdx)
                .group(all)
                .html({
                    some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> loads' +
                        ' | <a href="javascript:dc.filterAll(); dc.renderAll();">Reset All</a>',
                    all: 'All loads selected. Please click on the graph to apply filters.'
                });

            dataTable
                .dimension(scheduleArrivalDateDim)
                .group(function (d) {
                    const format = d3.format('02d');
                    return d.destination;
                })
                .size(100)
                .columns([
                    {
                        label: 'Load Number',
                        format: function (d) { return d.apptNbr; }
                    },
                    {
                        label: 'Arrival Date',
                        format: function (d) { return d.actualArrivalDate; }
                    },
                    {
                        label: 'Cartons',
                        format: function (d) { return d.cartons; }
                    },
                    {
                        label: 'Locn Name',
                        format: function (d) { return d.locnName; }
                    },
                    {
                        label: 'Trailer',
                        format: function (d) { return d.trlrNbr; }
                    },
                    {
                        label: 'Freight Type',
                        format: function (d) { return d.frgtTypNbr; }
                    },
                    {
                        label: 'Yard',
                        format: function (d) { return d.yardNbr + '-' + d.yardAreaNbr; }
                    },
                    {
                        label: 'Vendor',
                        format: function (d) { return d.vndName; }
                    }
                ])
                .sortBy(function (d) {
                    return d.destination;
                })
                .order(d3.ascending)
                .on('renderlet', function (table) {
                    table.selectAll('.dc-table-group').classed('info', true);
                });

            dc.renderAll();

            // Re-rendering all charts on reset
            $('#status-chart .reset').on('click', function () {
                statusChart.filterAll();
                dc.redrawAll();
            });
            $('#appointment-type-chart .reset').on('click', function () {
                appttypeChart.filterAll();
                dc.redrawAll();
            });
            $('#dc-vs-loads-chart .reset').on('click', function () {
                loadsChart.filterAll();
                dc.redrawAll();
            });
            $('#dc-chart .reset').on('click', function () {
                dcChart.filterAll();
                dc.redrawAll();
            });

            // changing the text color on charts based on smart admin theme
            if (localStorage.getItem('sm-skin') === 'smart-style-5') {
                d3.selectAll('text').style('fill', 'white');
            }

            /* window.onresize = function () {
                 var width = $('#chartDrawWIdth').width();
                 loadsChart
                     .width(width - 25)
                     .height(150)
                     .rescale()
                     .redraw();
                 dcChart
                     .width(width - 25)
                     .height(300)
                     .rescale()
                     .redraw();
                 dataTable
                     .width(width - 25)
                     .rescale()
                     .redraw();
                 if (width <= 847) {
                     width = width;
                 } else {
                     width = width / 2;
                 }

                 statusChart
                     .width((width) - 25)
                     .height(300)
                     .redraw();

                 appttypeChart
                     .width((width) - 25)
                     .height(300)
                     .redraw();
             };*/
        }
    }
}

