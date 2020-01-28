import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { WelcomeService } from '../../welcome/welcome.service';
import { MatStepper } from '@angular/material';
import { UIService } from '../../shared/ui.services';

@Component({
  selector: 'app-price-card',
  templateUrl: './price-card.component.html',
  styleUrls: ['./price-card.component.css']
})
export class PriceCardComponent implements OnInit {
  totalPrice;
  priceLoadSubs: Subscription;
  isLoading = false;
  isLoadingSubs: Subscription;
  isDisabled = false;
  loadPriceSubs: Subscription;
  @Output() clicked = new EventEmitter();

  constructor(
    private welService: WelcomeService,
    private uiService: UIService
  ) {

  }

  ngOnInit() {
    
    // this.totalPrice = localStorage.getItem('total_price');
    this.loadPriceSubs = this.welService.priceLoad.subscribe(result => {
      this.totalPrice = result;
    });
    console.log('total price', this.totalPrice);
    this.uiService.loadingChangedStatus.subscribe(res => {
      this.isLoading = res;
     
    });

    this.welService.getValuePrice();
  }

  goNextStepper() {
    this.isDisabled = true;
    this.clicked.emit(true);
    window.scrollTo(0, 0)

  }

  ngOnDestroy() {
    if (this.loadPriceSubs) { this.loadPriceSubs.unsubscribe(); }
    if (this.isLoadingSubs) { this.isLoadingSubs.unsubscribe(); }
  }

}

