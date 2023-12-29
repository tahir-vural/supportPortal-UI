import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { City } from 'src/app/model/City';
import { CityService } from 'src/app/service/city.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit, OnDestroy {
  public cities!: City[];
  public editCity!: City;
  public deleteCity!: City;
  private subs = new SubSink();

  constructor(
    private cityService: CityService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.getCities();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public getCities(): void {
    this.subs.add(this.cityService.getAll().subscribe(
      (response: City[]) => {
        this.cities = response;
        this.cities.sort(function (a: any, b: any) {
          return a?.name - b?.name;
        });
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }));
  }

  public onAddCity(addForm: NgForm): void {
    this.clickButton('add-city-form');
    this.subs.add(this.cityService.insert(addForm.value).subscribe(
      (response: City) => {
        this.getCities();
        addForm.reset();
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
        addForm.reset();
      }));
  }

  public onUpdateCity(city: City): void {
    this.subs.add(this.cityService.update(city).subscribe(
      (response: City) => {
        this.getCities();
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }
    ));
  }

  public onDeleteCity(cityId: number): void {
    this.subs.add(this.cityService.deleteById(cityId).subscribe(
      (response: void) => {
        this.getCities();
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }
    ));
  }

  public search(key: string): void {
    const results: City[] = [];
    for (const city of this.cities) {
      if (city.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        city.id == parseInt(key)) {
        results.push(city);
      }
    }
    this.cities = results;
    if (!key) {
      this.getCities();
    }
  }

  public onOpenModal(city: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addCityModal');
    }
    if (mode === 'edit') {
      this.editCity = city;
      button.setAttribute('data-target', '#updateCityModal');
    }
    if (mode === 'delete') {
      this.deleteCity = city;
      button.setAttribute('data-target', '#deleteCityModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
  }

  public onSelect(city: City) {
    this.router.navigate([city.id], { relativeTo: this.activatedRoute })
  }

  // Send notification
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, "An error occured. Please try again.");
    }
  }

  // click button
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click();
  }

}
