import { HttpErrorResponse } from '@angular/common/http';
import { BoundElementProperty } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Currency } from 'src/app/model/Currency';
import { Home } from 'src/app/model/Home';
import { HomeType } from 'src/app/model/HomeType';
import { Neighbourhood } from 'src/app/model/Neighbourhood';
import { RoomNumber } from 'src/app/model/RoomNumber';
import { Status } from 'src/app/model/Status';
import { Type } from 'src/app/model/Type';
import { User } from 'src/app/model/User';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CurrencyService } from 'src/app/service/currency.service';
import { HomeTypeService } from 'src/app/service/home-types.service';
import { HomeService } from 'src/app/service/home.service';
import { NeighbourhoodService } from 'src/app/service/neighbourhood.service';
import { RoomNumbersService } from 'src/app/service/room-numbers.service';
import { StatusService } from 'src/app/service/status.service';
import { TypesService } from 'src/app/service/types.service';
import { UserService } from 'src/app/service/user.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {
  public homes!: Home[];
  public cloneHomes!: Home[];
  public neighbourhoods!: Neighbourhood[];
  public types!: Type[];
  public roomNumbers!: RoomNumber[]
  public currencies!: Currency[];
  public homeTypes!: HomeType[];
  public users!: User[];
  public statuses!: Status[];
  private subs = new SubSink();

  public selectedNeighbourhood!: Neighbourhood;
  public selectedHomeType!: HomeType;
  public selectedRoomNumber!: RoomNumber;
  public selectedType!: Type;
  public selectedCurrency!: Currency;
  public selectedUser!: User;
  public deleteHome!: Home;
  public editHome!: Home;
  public selectedStatus!: Status;
  public filteringRoomNumbers: RoomNumber[] = new Array<RoomNumber>();
  public minPrice: number = 0;
  public maxPrice: number = 0;
  public priceFilterValidation: boolean = true;
  public priceCommaSperated!: string;



  public currentUser!: User;

  constructor(
    private homeService: HomeService,
    private neighbourhoodService: NeighbourhoodService,
    private typeService: TypesService,
    private roomNumberService: RoomNumbersService,
    private currencyService: CurrencyService,
    private homeTypeService: HomeTypeService,
    private userService: UserService,
    private statusServcie: StatusService,
    private notificationService: NotifierService,
    private autheticationService: AuthenticationService,
  ) {

  }

  ngOnInit(): void {
    try {
      this.getAllNeighbourhood();
      this.getAllHome();
      this.getAllCurrency();
      this.getAllHomeType();
      this.getAllRoomNumber();
      this.getAllStatus();
      this.getAllUser();
      this.getAllType();
      this.currentUser = this.autheticationService.getUserFromLocalCache();
    } catch (errorResposne) {
      this.sendNotification(NotificationType.ERROR, `${errorResposne}`);
    }
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public getAllNeighbourhood(): void {
    this.subs.add(this.neighbourhoodService.getAll().subscribe(
      (response: Neighbourhood[]) => {
        this.neighbourhoods = this.sort(response);
        this.selectedNeighbourhood = this.neighbourhoods[0];
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }
    ));
  }

  public getAllType(): void {
    this.subs.add(this.typeService.getAll().subscribe(
      (response: Type[]) => {
        this.types = this.sort(response);
        this.selectedType = this.types[0];
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
      }
    ));
  }
  public getAllRoomNumber(): void {
    this.subs.add(
      this.roomNumberService.getAll().subscribe(
        (response: RoomNumber[]) => {
          this.roomNumbers = this.sort(response);
          this.selectedRoomNumber = this.roomNumbers[0];
        },
        (errorResposne: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
        }
      ));
  }
  public getAllCurrency(): void {
    this.subs.add(
      this.currencyService.getAll().subscribe(
        (response: Currency[]) => {
          this.currencies = this.sort(response);
          this.selectedCurrency = this.currencies[0];
        },
        (errorResposne: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
        }
      ));
  }
  public getAllHomeType(): void {
    this.subs.add(
      this.homeTypeService.getAll().subscribe(
        (response: HomeType[]) => {
          this.homeTypes = this.sort(response);
          this.selectedHomeType = this.homeTypes[0];

        },
        (errorResposne: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
        }
      ));
  }
  public getAllUser(): void {
    this.subs.add(
      this.userService.getAllUsers().subscribe(
        (response: User[]) => {
          this.users = this.sort(response);
          this.selectedUser = this.users[0];
        },
        (errorResposne: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
        }
      ));
  }
  public getAllStatus(): void {
    this.subs.add(
      this.statusServcie.getAll().subscribe(
        (response: Status[]) => {
          this.statuses = this.sort(response);
          this.selectedStatus = this.statuses[0];
        },
        (errorResposne: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
        }
      ));
  }
  // Sort
  private sort(e: any) {
    return e.sort(function (a: any, b: any) {
      return a.id - b.id;
    });
  }

  public onOpenModal(home: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addHomeModal');
    }
    if (mode === 'edit') {
      this.editHome = home;
      button.setAttribute('data-target', '#updateHomeModal');
    }
    if (mode === 'delete') {
      this.deleteHome = home;
      button.setAttribute('data-target', '#deleteHomeModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
  }

  // ***** CRUD**********
  // Read
  public getAllHome(): void {
    this.homeService.getAll().subscribe(
      (response: Home[]) => {
        this.homes = this.sort(response);
        this.cloneHomes = this.homes;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  // Create
  public onAddHome(ngForm: NgForm): void {
    const formData = this.homeService.getFormData(ngForm);
    document.getElementById('add-home-form')?.click();
    this.subs.add(
      this.homeService.insert(formData).subscribe(
        (response: Home) => {
          this.getAllHome();
          ngForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `Yeni bir emlak başarıyla yüklendi`)
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          ngForm.reset();
        }
      ));
  }
  // Update
  public onUpdateHome(ngForm: NgForm): void {
    const userId = ngForm.value.id;
    const formData = this.homeService.getFormData(ngForm);
    this.subs.add(
      this.homeService.update(userId, formData).subscribe(
        (response: Home) => {
          this.getAllHome();
          this.sendNotification(NotificationType.SUCCESS, `başarıyla güncellendi`)
        },
        (errorResposne: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResposne.error.message)

        }
      ));
  }
  // Delete
  public onDeleteHome(contactId: number): void {
    this.homeService.deleteById(contactId).subscribe(
      (response: void) => {
        this.getAllHome();
        this.sendNotification(NotificationType.SUCCESS, `${response} başarıyla silindi`)
      },
      (errorResposne: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResposne.error.message)
      }
    );
  }

  // Search 
  public search(key: string): void {
    const results: Home[] = [];
    for (let home of this.homes) {
      if (home.neighbourhood.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.neighbourhood.district.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.neighbourhood.district.city.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.type.type.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.roomNumber.roomNumber.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.homeType.homeType.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.address.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.details.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.status.status.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.neighbourhood.id == parseInt(key) ||
        home.neighbourhood.district.id == parseInt(key) ||
        home.id == parseInt(key)) {
        results.push(home);
      }
    }
    this.homes = results;
    if (!key) {
      this.getAllHome();
    }
  }
  public selectUser(userId: string): void {
  }
  // Send notification
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, "Bir hata oluştu. Lütfen daha sonra deneyin.");
    }
  }
  public checkboxClick(roomNumber: RoomNumber): void {
    document.getElementById('check-box' + roomNumber.id)?.click();
  }
  public checkboxOnChange(event: any) {
    const checkedBox: HTMLElement | any = document.getElementById(event.target.id);
    const element: HTMLElement | any = document.getElementById(event.target.id.split('-')[1]);
    const checkRoomNumber = this.roomNumbers.find(result => result.id == (checkedBox.id.split('x')[1])) as RoomNumber;
    if (checkedBox.checked) {
      element.style.color = "red";
    } else {
      element.style.color = "white";
    }
    if (this.filteringRoomNumbers.filter(result => result.id == checkRoomNumber?.id).length > 0) {
      let index = this.filteringRoomNumbers.findIndex(result => result.id == checkRoomNumber.id);
      this.filteringRoomNumbers.splice(index, 1);
    }
    else
      this.filteringRoomNumbers.push(checkRoomNumber);
    this.filtering()
  }

  private filtering(): void {
    this.homes = this.cloneHomes;
    let results: Home[] = [];
    if (this.filteringRoomNumbers.length != 0) {
      for (let roomNumber of this.filteringRoomNumbers) {
        results.push(...this.homes.filter(result => {
          return result.roomNumber.id == roomNumber.id;
        }))
      }
    }
    else if (this.filteringRoomNumbers.length == 0) {
      results = this.cloneHomes;
    }
    else {
      results = this.homes;
    }
    this.homes = results;
  }
  public filterValidation(value: any): boolean {
    if (value.key >= 0 && value.key <= 9 || value.key == 'Backspace')
      return true;
    else
      return false;
  }

  public priceFiltering(price: any, priceType: string): void {
    if (priceType == 'minimum') {
      if (price == null)
        this.minPrice = 0;
      else
        this.minPrice = price;
    }
    else if (priceType == 'maximum') {
      if (price == null)
        this.maxPrice = 0
      else
        this.maxPrice = price;
    }
    if (Number(this.minPrice) > Number(this.maxPrice) && this.maxPrice != 0)
      this.priceFilterValidation = false;
    else {
      this.priceFilterValidation = true;
    }
    this.filterBaseOnPrice();
  }

  private filterBaseOnPrice(): void {
    let results: Home[] = []
    // this is done
    if (this.minPrice == 0 && this.maxPrice == 0) {
      results = this.cloneHomes;
    }
    else if (this.minPrice !== 0 && this.maxPrice !== 0) {
      for (let room of this.cloneHomes) {
        if (room.price >= this.minPrice && room.price <= this.maxPrice)
          results.push(room);
      }
    }
    else if (this.minPrice !== 0 && this.maxPrice == 0) {
      for (let room of this.cloneHomes) {
        if (room.price >= this.minPrice)
          results.push(room);
      }
    }
    else if (this.minPrice == 0 && this.maxPrice !== 0) {
      for (let room of this.cloneHomes) {
        if (room.price <= this.maxPrice)
          results.push(room);
      }
    }
    this.homes = results;
  }
  public controlValue(event: any): boolean {
    if ((Number(event.key) >= 0 && Number(event.key) <= 9) || event.key == "Backspace" || event.key == "," || (event.key == "." && (event.target.value.split('.').length < 2))) {
      if (event.target.value.split('.')[1] != null)
        event.target.value = event.target.value.split('.')[0] + "." + event.target.value.split('.')[1];
      else
        event.target.value = event.target.value.split('.')[0];
      return true;
    }
    return false;
  }

}