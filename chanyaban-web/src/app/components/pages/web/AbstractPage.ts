/*
 * @license Chanyaban v0.1
 * (c) 2020-2021 KaoGeek. http://kaogeek.dev
 * License: MIT. https://opensource.org/licenses/MIT
 * Author: oilNEWlio <apidech.s@absolute.co.th>
 */

import * as moment from 'moment';
import { Router } from '@angular/router';  
import { AbstractNewTab } from './AbstractNewTab';

export abstract class AbstractPage extends AbstractNewTab {

    protected readonly PAGE_NAME: string; 

    protected find: any; 
    protected data: any = {};
    protected selectedDate: any = {
        startDate: moment().subtract(6, 'days').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
        endDate: moment()
    }; 
    protected paramsDateStr: string = "";

    constructor(PAGE_NAME: string, router: Router) {
        super(router);
        this.PAGE_NAME = PAGE_NAME;
        this.router = router;
        this.find = {};
    }

    public setRangeDate(params?: any): void {
        const urlParams = new URLSearchParams(window.location.search);
        const start = params ? params.start : urlParams.get('start');
        const end = params ? params.end : urlParams.get('end');
        if (start && end) {
            this.paramsDateStr = "?start=" + start + "&end=" + end;
            this.selectedDate.startDate = start ? moment(start, this.FORMAT_DATE) : this.selectedDate.startDate;
            this.selectedDate.endDate = end ? moment(end, this.FORMAT_DATE) : this.selectedDate.endDate;
            if (!this.selectedDate.startDate.isValid()) {
                this.selectedDate.startDate = moment().subtract(6, 'days');
            }
            if (!this.selectedDate.endDate.isValid()) {
                this.selectedDate.endDate = moment();
            }
            if (moment(this.selectedDate.endDate).isBefore(this.selectedDate.startDate)) {
                this.selectedDate = {
                    startDate: moment().subtract(6, 'days'),
                    endDate: moment()
                };
            }
        }
    } 

    public addParamsDate(params: string): string {
        params += "?start=" + moment(this.selectedDate.startDate).format(this.FORMAT_DATE);
        params += "&end=" + moment(this.selectedDate.endDate).format(this.FORMAT_DATE);
        return params
    }

    public queryParamsDate(): any {
        return {
            queryParams: {
                start: moment(this.selectedDate.startDate).format(this.FORMAT_DATE),
                end: moment(this.selectedDate.endDate).format(this.FORMAT_DATE),
            }
        }
    }

    public getMinDate(): any {
        return this.data && this.data.keepDate ? moment(this.data.keepDate) : moment().subtract(1, 'years').add(1, 'days');
    }

    public getMaxDate(): any {
        return moment();
    }
}
