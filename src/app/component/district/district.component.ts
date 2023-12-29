import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { City } from 'src/app/model/City';
import { District } from 'src/app/model/District';
import { CityService } from 'src/app/service/city.service';
import { DistrictsService } from 'src/app/service/districts.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-District',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.css']
})
export class DistrictComponent implements OnInit {
  public districts!: District[];
  public cities!: City[];
  public editDistrict!: District;
  public deleteDistrict!: District;
  public selectedDistrict!: District;
  private subs = new SubSink();


  constructor(
    private districtService: DistrictsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cityService: CityService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.getAllDistrict();
    this.getAllCities();
  }

  public getAllCities(): void {
    this.subs.add(this.cityService.getAll().subscribe(
      (response: City[]) => {
        this.cities = response;
        this.cities.sort(function (a: any, b: any) {
          return a.id - b.id;
        });
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }
    ));
  }

  public getAllDistrict(): void {
    this.subs.add(this.districtService.getAll().subscribe(
      (response: District[]) => {
        this.districts = response;
        this.districts.sort(function (a: any, b: any) {
          return a.id - b.id;
        });
        this.selectedDistrict = this.districts[0];
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }
    ));
  }

  public onAddDistrict(addForm: NgForm): void {
    const district = new District();
    district.name = addForm.value.name;
    district.city = (this.cities.find(result => result?.id == addForm.value.cityId) as City);
    document.getElementById('add-District-form')?.click();
    this.subs.add(this.districtService.insert(district).subscribe(
      (response: District) => {
        this.getAllDistrict();
        addForm.reset();
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
        addForm.reset();
      }
    ));
  }

  public onUpdateDistrict(ngForm: NgForm): void {
    const district = new District();
    district.id = ngForm.value.id;
    district.name = ngForm.value.name;
    district.city = (this.cities.find(result =>  result.id == ngForm.value.cityId ) as City);
    this.subs.add(this.districtService.update(district).subscribe(
      (response: District) => {
        this.getAllDistrict();
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }
    ));
  }

  public onDeleteDistrict(districtId: number): void {
    this.districtService.deleteById(districtId).subscribe(
      (response: void) => {
        this.getAllDistrict();
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }
    );
  }

  public search(key: string): void {
    const results: District[] = [];
    for (const District of this.districts) {
      if (District.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        District.id == parseInt(key)) {
        results.push(District);
      }
    }
    this.districts = results;
    if (!key) {
      this.getAllDistrict();
    }
  }


  public onOpenModal(district: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addDistrictModal');
    }
    if (mode === 'edit') {
      this.editDistrict = district;
      this.selectedDistrict = district;
      button.setAttribute('data-target', '#updateDistrictModal');
    }
    if (mode === 'delete') {
      this.deleteDistrict = district;
      button.setAttribute('data-target', '#deleteDistrictModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
  }
  public onSelect(district: District) {
    this.router.navigate([district.id], { relativeTo: this.activatedRoute })
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
