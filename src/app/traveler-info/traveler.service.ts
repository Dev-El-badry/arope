import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable,Output,EventEmitter } from "@angular/core";
import { Subject } from 'rxjs';
import { UIService } from '../shared/ui.services';
import { OdooService } from '../shared/odoo.service';
import { PaymentModel } from  './payment.model';
@Injectable()
export class TravelerService {
  listBenfilts=[];
  loadListBenefits = new Subject<any[]>();
  loadResObjExcess = new Subject<any[]>();
  @Output() fire: EventEmitter<any> = new EventEmitter();
  @Output() firePaymentForm: EventEmitter<any> = new EventEmitter();

  paymentForm: PaymentModel = {
    cardNumber: null,
    expirationDate: null,
    cvCode: null
  }

  constructor(private http: HttpClient, private uiService: UIService, private odoo:OdooService) {
    
  }

  /* get payment list data */
  getPaymentFormData() {
    return this.firePaymentForm;
  }
  changePaymentFormData() {
    this.firePaymentForm.emit(this.paymentForm);
  }
  /* end get payment list data */

  getShowValue() {
    return this.fire;
  }

  changeStatusShowValue() {
    this.fire.emit(true)
  }

  fetchfetchBenefits() {
    this.onClear();
    this.uiService.loadingChangedStatus.next(true);
    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });
    const data = {paramlist: {filter: [],
      need: []}};
    this.odoo.call_odoo_function('travel_agency', 'demo', 'demo',
     'travel.benefits', 'search_read', data).subscribe(res => {
      for (const x in res) {
        const cover = res[x].cover;
        const limit = res[x].limit;
        this.listBenfilts.push({
          'cover': cover,
          'limit': limit
        });
      }

      this.loadListBenefits.next(this.listBenfilts);
      this.uiService.loadingChangedStatus.next(false);
   });
  }

  fetchExcess() {
    this.uiService.loadingChangedStatus.next(true);
    const data = {paramlist: {filter: [],
      need: []}};
    this.odoo.call_odoo_function('travel_agency', 'demo', 'demo',
    'travel.excess', 'search_read', data).subscribe(res => {
      this.loadResObjExcess.next(res);
      this.uiService.loadingChangedStatus.next(false);
    });
  }

  onClear() {
    this.loadListBenefits.next([]);
    this.loadResObjExcess.next([]);
    this.listBenfilts = [];
  }

  // fetchBenefits(){
  //   this.http.post('')
  // }
}
