import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Currency } from 'src/app/model/Currency';
import { CurrencyService } from 'src/app/service/currency.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit, OnDestroy {
  public currencies!: Currency[];
  public editCurrency!: Currency;
  public deleteCurrency!: Currency;
  private subs = new SubSink();

  constructor(
    private currencyService: CurrencyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.getAllCurrency();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  public getAllCurrency(): void {
    this.subs.add(this.currencyService.getAll().subscribe(
      (response: Currency[]) => {
        this.currencies = response;
        this.currencies.sort(function (a: any, b: any) {
          return a.currency - b.currency;
        });
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }
    ));
  }

  public onAddCurrency(addForm: NgForm): void {
    document.getElementById('add-currency-form')?.click();
    this.subs.add(this.currencyService.insert(addForm.value).subscribe(
      (response: Currency) => {
        this.getAllCurrency();
        addForm.reset();
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
        addForm.reset();
      }
    ));
  }

  public onUpdateCurrency(currency: Currency): void {
    this.subs.add(this.currencyService.update(currency).subscribe(
      (response: Currency) => {
        this.getAllCurrency();
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }
    ));
  }

  public onDeleteCurrency(currencyId: number): void {
    this.subs.add(this.currencyService.deleteById(currencyId).subscribe(
      (response: void) => {
        this.getAllCurrency();
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }
    ));
  }

  public search(key: string): void {
    const results: Currency[] = [];
    for (const currency of this.currencies) {
      if (currency.currency.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        currency.id == parseInt(key)) {
        results.push(currency);
      }
    }
    this.currencies = results;
    if (!key) {
      this.getAllCurrency();
    }
  }

  public onOpenModal(currency: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addCurrencyModal');
    }
    if (mode === 'edit') {
      this.editCurrency = currency;
      button.setAttribute('data-target', '#updateCurrencyModal');
    }
    if (mode === 'delete') {
      this.deleteCurrency = currency;
      button.setAttribute('data-target', '#deleteCurrencyModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
  }

  public onSelect(currency: Currency) {
    this.router.navigate([currency.id], { relativeTo: this.activatedRoute })
  }

  // Send notification
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, "An error occured. Please try again.");
    }
  }

}
