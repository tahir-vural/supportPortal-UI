import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Agency } from 'src/app/model/Agency';
import { District } from 'src/app/model/District';
import { Neighbourhood } from 'src/app/model/Neighbourhood';
import { AgencyService } from 'src/app/service/agency.service';
import { NeighbourhoodService } from 'src/app/service/neighbourhood.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-Agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.css']
})
export class AgencyComponent implements OnInit, OnDestroy {
  public agencies!: Agency[];
  public editAgency!: Agency;
  public deleteAgency!: Agency;
  public neighbourhoods!: Neighbourhood[];
  public selectedNeighbourhood!: Neighbourhood;
  private subs = new SubSink();

  constructor(
    private agencyService: AgencyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private neighbourhoodService: NeighbourhoodService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.getAllAgencies();
    this.getAllNeighbourhood();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public getAllAgencies(): void {
    this.subs.add(this.agencyService.getAll().subscribe(
      (response: Agency[]) => {
        this.agencies = this.sortData(response);
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }
    ));
  }

  public getAllNeighbourhood(): void {
    this.subs.add(this.neighbourhoodService.getAll().subscribe(
      (response: Neighbourhood[]) => {
        this.neighbourhoods = response;
        this.selectedNeighbourhood = this.neighbourhoods?.[0];
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }
    ));
  }

  public onAddAgency(ngForm: NgForm): void {
    const agency = new Agency();
    agency.agencyName = ngForm.value.agencyName;
    agency.id = ngForm.value.id;
    agency.neighbourhoodId = (this.neighbourhoods.find(result => result.id == ngForm.value.neighbourhoodId) as Neighbourhood);
    this.clickButton('add-Agency-form');

    this.subs.add(this.agencyService.insert(agency).subscribe(
      (response: Agency) => {
        this.getAllAgencies();
        ngForm.reset();
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
        ngForm.reset();
      }
    ));
  }

  public onUpdateAgency(ngForm: NgForm): void {
    const agency = new Agency();
    agency.agencyName = ngForm.value.agencyName;
    agency.id = ngForm.value.id;
    agency.neighbourhoodId = (this.neighbourhoods.find(result => result.id == ngForm.value.neighbourhoodId) as Neighbourhood);
    this.subs.add(this.agencyService.update(agency).subscribe(
      (response: Agency) => {
        this.getAllAgencies();
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }
    ));
  }

  public onDeleteAgency(agencyId: number): void {
    this.subs.add(this.agencyService.deleteById(agencyId).subscribe(
      (response: void) => {
        this.getAllAgencies();
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }
    ));
  }

  public search(key: string): void {
    const results: Agency[] = [];
    for (const Agency of this.agencies) {
      if (Agency.agencyName.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        Agency.id == parseInt(key)) {
        results.push(Agency);
      }
    }
    this.agencies = results;
    if (!key) {
      this.getAllAgencies();
    }
  }

  public onOpenModal(agency: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addAgencyModal');
    }
    if (mode === 'edit') {
      this.editAgency = agency;
      this.selectedNeighbourhood = agency.neighbourhood;
      button.setAttribute('data-target', '#updateAgencyModal');
    }
    if (mode === 'delete') {
      this.deleteAgency = agency;
      button.setAttribute('data-target', '#deleteAgencyModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
  }

  public onSelect(agency: Agency) {
    this.router.navigate([agency.id], { relativeTo: this.activatedRoute })
  }

  private sortData(data: any): Agency[] {
    return data.sort(function (a: any, b: any) {
      return a?.name - b?.name;
    })
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
