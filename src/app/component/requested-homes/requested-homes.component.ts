import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Priority } from 'src/app/model/Priority';
import { RequestedHomes } from 'src/app/model/RequestedHomes';
import { RoomNumber } from 'src/app/model/RoomNumber';
import { Status } from 'src/app/model/Status';
import { User } from 'src/app/model/User';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PriorityService } from 'src/app/service/priority.service';
import { RequestedHomesService } from 'src/app/service/requested-homes.service';
import { RoomNumbersService } from 'src/app/service/room-numbers.service';
import { StatusService } from 'src/app/service/status.service';
import { UserService } from 'src/app/service/user.service';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-requested-homes',
  templateUrl: './requested-homes.component.html',
  styleUrls: ['./requested-homes.component.css']
})
export class RequestedHomesComponent implements OnInit {
  private subs = new SubSink();

  public requestedHomes!: RequestedHomes[];
  public editRequestedHome!: RequestedHomes;
  public deleteRequestedHome!: RequestedHomes;
  public user!: User;
  public roomNumbers!: RoomNumber[]
  public selectedRequestedHomes!: RequestedHomes;
  public selectedRoomNumber!: RoomNumber;
  public users!: User[];
  public selectedPriority!: Priority;
  public priorities!: Priority[];
  public selectedStatus!: Status;
  public statuses!: Status[];
  public selectedUser!:User;


  constructor(
    private requestedHomesService: RequestedHomesService,
    private autheticationService: AuthenticationService,
    private notificationService: NotificationService,
    private userService: UserService,
    private roomNumberService: RoomNumbersService,
    private priorityService: PriorityService,
    private statusService: StatusService,

  ) { }

  ngOnInit() {
    this.user = this.autheticationService.getUserFromLocalCache();
    this.getAllRequestedHomes();
    this.getAllUser();
    this.getAllRoomNumbers();
    this.getAllPriority();
    this.getAllStatuses();
  }
  public getAllStatuses(): void {
    this.statusService.getAll().subscribe(
      (response: Status[]) => {
        this.statuses = this.sort(response);
        this.selectedStatus = this.statuses[0];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getAllPriority(): void {
    this.subs.add(this.priorityService.getAll().subscribe(
      (response: Priority[]) => {
        this.priorities = this.sort(response);
        this.selectedPriority = this.priorities[0];
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    ))
  }
  public onSelect(value: any, type: string): void {

    if (type === 'openRequestedHomeInfo') {
      this.selectedRequestedHomes = value;
    }
    this.clickButton(type);
  }
  public getAllUser(): void {
    this.subs.add(
      this.userService.getAllUsers().subscribe(
        (result: User[]) => {
          this.users = this.sort(result);
        }
        , (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    )
  }
  public getAllRoomNumbers(): void {
    this.roomNumberService.getAll().subscribe(
      (response: RoomNumber[]) => {
        this.roomNumbers = this.sort(response);
        this.selectedRoomNumber = this.roomNumbers[0];
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    );
  }
  public getAllRequestedHomes(): void {
    this.subs.add(
      this.requestedHomesService.getAll().subscribe(
        (response: RequestedHomes[]) => {
          this.requestedHomes = this.sort(response)
          this.selectedRequestedHomes = this.requestedHomes[0];
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }))
  }
  private sort(e: any) {
    return e.sort(function (a: any, b: any) {
      return a.price - b.price;
    });
  }

  public onAddRequestedHome(ngForm: NgForm): void {
    const formData = this.requestedHomesService.getFormData(ngForm);
    document.getElementById('add-requested-home-form')?.click();
    this.subs.add(
      this.requestedHomesService.insert(formData).subscribe(
        (response: RequestedHomes) => {
          this.getAllRequestedHomes();
          this.sendNotification(NotificationType.SUCCESS, `Yeni bir emlak başarıyla yüklendi`)
          ngForm.reset();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          ngForm.reset();
        }
      ));
  }

  public onUpdateRequestedHomes(ngForm: NgForm): void {
    const userId = ngForm.value.id;
    const formData = this.requestedHomesService.getFormData(ngForm);
    this.subs.add(
      this.requestedHomesService.update(userId, formData).subscribe(
        (response: RequestedHomes) => {
          this.getAllRequestedHomes();
          this.sendNotification(NotificationType.SUCCESS, `başarıyla güncellendi`)
        },
        (errorResposne: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResposne.error.message)
        }
      ));
  }

  public search(key: string): void {
    const results: RequestedHomes[] = [];
    for (const requestedHomes of this.requestedHomes) {
      if (requestedHomes.recipientsName.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        requestedHomes.id == parseInt(key)) {
        results.push(requestedHomes);
      }
    }
    this.requestedHomes = results;
    if (!key) {
      this.getAllRequestedHomes();
    }
  }


  public onOpenModal(requestedHomes: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addRequestedHomesModal');
    }
    if (mode === 'edit') {
      this.editRequestedHome = requestedHomes;
      button.setAttribute('data-target', '#updateRequestedHomesModal');
    }
    if (mode === 'delete') {
      this.deleteRequestedHome = requestedHomes;
      button.setAttribute('data-target', '#deleteRequestedHomesModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
  }
  // public onSelect(RequestedHomes: RequestedHomes) {
  //   this.router.navigate([RequestedHomes.id], { relativeTo: this.activatedRoute })
  // }
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, "An error occured. Please try again.");
    }
  }
  public onOpenRequestedModal(requestedHome: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addRequestedHomeModal');
    }
    if (mode === 'edit') {
      button.setAttribute('data-target', '#updateRequestedHomeModal');
      this.editRequestedHome = requestedHome;
    }
    if (mode === 'delete') {
      this.deleteRequestedHome = requestedHome;
      button.setAttribute('data-target', '#deleteRequestedHomeModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
  }
  public onRequestedDeleteHome(contactId: number): void {
    this.requestedHomesService.deleteById(contactId).subscribe(
      (response: void) => {
        this.getAllRequestedHomes();
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message)
      }
    );
  }
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click();
  }
}