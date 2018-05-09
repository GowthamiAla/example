import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { IMyOptions, IMyDateModel, IMyDate } from 'mydatepicker';
import { Observable } from 'rxjs/Observable';
import { DashboardsServices } from '../../services/dashboards.services';
import { ModalDirective } from 'ngx-bootstrap';
import { endponitConfig } from '../../../../environments/endpoints';
import * as moment from 'moment';
import { saveAs } from 'file-saver';

declare var L, d3, dc, crossfilter, $: any;
const self = this;
/**
 * This component deals with rendering charts in dashboard
 */
@Component({
    templateUrl: './dcLoadAnalysis2.component.html',
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

    .filterFormAlign{
    margin-top: 5px !important;
    }

  .filterDropwdownViewAlign{
    width: 280px !important;
  color:black;
  padding:0px !important;
  }
  @media only screen and (min-width:768px){
    .filterDropwdownViewAlign{
    left: -160px !important;
    }
    }
    @media only screen and (max-width: 479px) and (min-width: 320px){
      .filterDropwdownViewAlign{
      left:-200px !important;
      }
    }
    @media only screen and (min-width:479px) and (max-width:768px){
      .filterDropwdownViewAlign{
      min-width: 335px !important;
      left: -280px !important;
      }
      }`]
})

export class dcLoadAnalysis2Component implements OnInit {

    public activePageTitle: any;
    private headers: Headers;
    public DropDownTooglePopup: any;
    public QueryData: any = { startDate: '', endDate: '' };
    public QueryDataEndDate;
    public QueryDataStartDate;
    public isSearchQuerySubmitted: boolean;
    public errorMessage;
    public vendorNumber;
    public vendorName;
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




    options = {
        dom: 'Bfrtip',
        buttons: [
            {
                text: '<i class="fa fa-refresh"></i> Refresh',
                className: 'btn bg-color-blueLight  txt-color-white btn-sm dataTableCustomButtonMargin',
                action: function (e, dt, node, config) {
                    if ($.fn.DataTable.isDataTable('#DataTable table')) {
                        var table = $('#DataTable table').DataTable();
                        table.ajax.reload();
                    }
                }
            }
        ],
        ajax: (responseData, callback, settings) => {
            let url;
            if (this.vendorName) {
                url = endponitConfig.ANALYTICS_API_ENDPOINT + 'getVendorRelatedLoadAppointments/' +
                    this.vendorNumber + '/' + this.vendorName;
            } else {
                url = endponitConfig.ANALYTICS_API_ENDPOINT + 'getVendorRelatedLoadAppointments/' +
                    this.vendorNumber;
            }
            this.http.get(url, { headers: this.headers })
                .map(this.extractData)
                .catch(error => {
                    // In a real world app, we might use a remote logging infrastructure
                    // We'd also dig deeper into the error to get a better message
                    const errMsg = (error.message) ? error.message :
                        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
                    console.error(errMsg); // log to console instead

                    // this.navigateToLogin( this.errorMessage)
                    localStorage.setItem('status', '401')
                    // 401 unauthorized response so log user out of client
                    window.location.href = '/#/error';
                    return Observable.throw(errMsg);
                })
                .subscribe((respData) => {
                    callback({
                        aaData: respData,
                    })
                })
        },
        columns: [
            { data: 'apptNbr', responsivePriority: 5 }, { data: 'destination', responsivePriority: 2 },
            { data: 'scheduledArrivalDate', responsivePriority: 1 }, { data: 'actualArrivalDate', responsivePriority: 4 }, {
                data: 'vndName', responsivePriority: 6,
            }, {
                data: 'apptTypNbr',
                responsivePriority: 3,
                render: (data, type, row) => {
                    data = +data;
                    let statusName;
                    if (data === 1) {
                        statusName = 'Load Created'
                    } else if (data === 2) {
                        statusName = 'Load Assigned'
                    } else if (data === 3) {
                        statusName = 'Driver Login'
                    } else if (data === 4) {
                        statusName = 'Load Accepted'
                    } else if (data === 5) {
                        statusName = 'Load Completed'
                    } else {
                        statusName = 'No Status'
                    }
                    return statusName
                }
            }
        ],
    }

    // add event popover event declaration
    @ViewChild('analyticspopup') public analyticspopup: ModalDirective;
    public showChildModal(): void {
        this.analyticspopup.show();
    }

    public hideChildModal(): void {
        this.analyticspopup.hide();
    }

    constructor(private dashboardServices: DashboardsServices, private http: Http, private route: ActivatedRoute) {
        this.activePageTitle = 'dcLoadAnalysis2';
        this.headers = new Headers();
        this.headers.append('Authorization', localStorage.getItem('Authentication'));
        this.headers.append('Content-Type', 'application/json');
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


    private extractData(res) {
        const body = res.json();
        if (body) {
            return body.data
        } else {
            return {}
        }
    }


    public dispalyDate(cellvalue, options, rowObject) {
        if (cellvalue === '1900-01-01') {
            return '';
        } else {
            return cellvalue;
        }
    }

    // replace icons with FontAwesome icons like above
    public updatePagerIcons(table) {
        const replacement = {
            'ui-icon-seek-first': 'ace-icon fa fa-angle-double-left bigger-140',
            'ui-icon-seek-prev': 'ace-icon fa fa-angle-left bigger-140',
            'ui-icon-seek-next': 'ace-icon fa fa-angle-right bigger-140',
            'ui-icon-seek-end': 'ace-icon fa fa-angle-double-right bigger-140'
        };
        $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function () {
            const icon = $(this);
            const $class = $.trim(icon.attr('class').replace('ui-icon', ''));
            if ($class in replacement) {
                icon.attr('class', 'ui-icon ' + replacement[$class]);
            }
        })
    }


    public renderDashBoardAnalyticsCharts(data) {

        const bubbleCloud = dc.bubbleCloud('#dc-loads-size-chart');
        const vendorsChart = dc.barChart('#vendor-loads-chart');
        const dcCompositeChart = dc.compositeChart('#dc-composite-chart');

        // const appType: any;
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

        const dcDim = mdx.dimension(function (d) {
            return d.destination;
        });

        const dcGroup = dcDim.group().reduceSum(function (d) { return d.cartons; });

        bubbleCloud.
            width(1000 - 200)
            .height(450)
            .elasticRadius(true)
            .r(d3.scale.linear().domain([0, 500]))
            .maxBubbleRelativeSize(0.12)
            .radiusValueAccessor(function (d) {
                return d.value;
            })
            .dimension(dcDim)
            .group(dcGroup)
            .colors(colorScale)
            .x(d3.scale.ordinal());


        const vendorDim = mdx.dimension(function (d) {
            return d.vndName;
        });

        const vendorGroup = vendorDim.group();

        const classInstance = this;

        vendorsChart.width(1000 - 30)
            .height(300)
            .margins({ top: 10, right: 10, bottom: 100, left: 20 })
            .dimension(vendorDim)
            .group(vendorGroup)
            .elasticY(true)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .colors(colorScale)
            .renderlet(function (chart) {
                chart.selectAll('g.x text')
                    .style('text-anchor', 'end')
                    .attr('transform', 'translate(-10,0)rotate(315)')
            })
            .on('renderlet.somename', function (chart) {
                chart.selectAll('rect').on('click', function (d) {
                    const array = bubbleCloud.filters();
                    classInstance.vendorNumber = d.x;
                    let dcName;
                    array.forEach(dcData => {
                        if (dcName) {
                            dcName = dcName + ',' + dcData
                        } else {
                            dcName = dcData;
                        }
                    });
                    classInstance.vendorName = dcName;
                    classInstance.analyticspopup.show();
                })
            });

        const dcDimension = mdx.dimension(function (d) { return d.destination; });

        const earlyLoadsGroup = dcDimension.group().reduce(
            function (p, v) {
                const dateOne = new Date(v.sad);
                const dateTwo = new Date(v.aad);
                if (dateTwo.getDate() <= dateOne.getDate()) {
                    ++p.count;
                }
                return p;
            },
            function (p, v) {
                const dateOne = new Date(v.sad);
                const dateTwo = new Date(v.aad);
                if (dateTwo.getDate() <= dateOne.getDate()) {
                    --p.count;
                }
                return p;
            },
            function () {
                return { count: 0 };
            }
        );

        const lateLoadsGroup = dcDimension.group().reduce(
            function (p, v) {
                const dateOne = new Date(v.sad);
                const dateTwo = new Date(v.aad);
                if (dateTwo.getDate() > dateOne.getDate()) {
                    ++p.count;
                }
                return p;
            },
            function (p, v) {
                const dateOne = new Date(v.sad);
                const dateTwo = new Date(v.aad);
                if (dateTwo.getDate() > dateOne.getDate()) {
                    --p.count;
                }
                return p;
            },
            function () {
                return { count: 0 };
            }
        );


        dcCompositeChart.width(1000 - 30)
            .height(400)
            .margins({ top: 10, right: 10, bottom: 100, left: 20 })
            .dimension(dcDimension)
            .transitionDuration(500)
            .elasticY(true)
            .brushOn(true)
            .title(function (d) {
                return d.key + ' : ' + d.value.count;
            })
            .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
            .renderlet(function (chart) {
                chart.selectAll('g.x text')
                    .style('text-anchor', 'end')
                    .attr('transform', 'translate(-10,0)rotate(315)')
            })
            .x(d3.scale.ordinal().domain(dcDimension.top(Infinity).map(function (d) { return d.destination })))
            .xUnits(dc.units.ordinal)
            .compose([
                dc.lineChart(dcCompositeChart)
                    .group(earlyLoadsGroup, 'Early Loads')
                    .valueAccessor(function (d) { return d.value.count; }),
                dc.lineChart(dcCompositeChart)
                    .group(lateLoadsGroup, 'Late Loads')
                    .valueAccessor(function (d) { return d.value.count; })
                    .colors('red')
            ]);
        dc.renderAll();

        $('#dc-loads-size-chart .reset').on('click', function () {
            bubbleCloud.filterAll();
            dc.redrawAll();
        });
        $('#vendor-loads-chart .reset').on('click', function () {
            vendorsChart.filterAll();
            dc.redrawAll();
        });
        $('#dc-composite-chart .reset').on('click', function () {
            dcCompositeChart.filterAll();
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

        if (this.QueryDataStartDate == '' && this.QueryDataEndDate == '') {
            this.isSearchQuerySubmitted = true;
        } else {
            // this.loading = true;
            try {
                if (new Date(this.QueryDataStartDate) > new Date(this.QueryDataEndDate)) {
                    this.errorMessage = 'End date should be greater than start date';

                    setTimeout(() => {
                        this.errorMessage = '';
                    }, 3000)
                } else {
                    this.errorMessage = '';

                    const dateRangeObject = {
                        'RP_startdate': this.QueryDataStartDate,
                        'RP_enddate': this.QueryDataEndDate
                    }

                    // this.loading = true;
                    this.dashboardServices.generateReportsData('Dc_analysis', dateRangeObject).toPromise().then((response) => {
                        this.DropDownTooglePopup = '';
                        const blob = new Blob([response], { type: 'application/pdf' });
                        saveAs(blob, 'Vendor_vs_LoadAnalysis.pdf');
                        const fileURL = URL.createObjectURL(blob);
                        window.open(fileURL);
                    });
                }
            } catch (error) {
                console.error('Getting  filtered data completed  in Analytics');
            }
            this.isSearchQuerySubmitted = false;
        }
    }
}
