import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Currency } from 'src/app/model/Currency';
import { Status } from 'src/app/model/Status';
import { Type } from 'src/app/model/Type';
import { Home } from 'src/app/model/Home';
import { HomeType } from 'src/app/model/HomeType';
import { Neighbourhood } from 'src/app/model/Neighbourhood';
import { RoomNumber } from 'src/app/model/RoomNumber';
import { User } from 'src/app/model/User';
import { NeighbourhoodService } from 'src/app/service/neighbourhood.service';
import { HomeService } from 'src/app/service/home.service';
import { TypesService } from 'src/app/service/types.service';
import { RoomNumbersService } from 'src/app/service/room-numbers.service';
import { HomeTypeService } from 'src/app/service/home-types.service';
import { StatusService } from 'src/app/service/status.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { SubSink } from 'subsink';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { FileUploadStatus } from 'src/app/model/file-upload.status';
import { Role } from 'src/app/enum/role.enum';
import { AgencyService } from 'src/app/service/agency.service';
import { Agency } from 'src/app/model/Agency';
import { CurrencyService } from 'src/app/service/currency.service';
import { PriorityService } from 'src/app/service/priority.service';
import { Priority } from 'src/app/model/Priority';
import { RequestedHomes } from 'src/app/model/RequestedHomes';
import { RequestedHomesService } from 'src/app/service/requested-homes.service';
import { UserService } from 'src/app/service/user.service';
import { MatCardXlImage } from '@angular/material';

@Component({
  selector: 'app-user-main-page',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit {
  private subs = new SubSink();
  public fileStatus = new FileUploadStatus();
  public filterByRoomNumbersList: RoomNumber[] = new Array<RoomNumber>();
  public homes!: Home[];
  public types!: Type[];
  public statuses!: Status[];
  public agencies!: Agency[];
  public cloneHomes!: Home[];
  public filteredCloneHomes!: Home[];
  public requestedCloneHomes!: RequestedHomes[];
  public filteredHome: Home[] = [];
  public generalFilteredHome: any = [];
  public requestedFilteredHome: RequestedHomes[] = [];
  public cloneRequestedFilteredHome: RequestedHomes[] = [];
  public homeTypes!: HomeType[];
  public userHomeLists!: Home[];
  public cloneUserHomeLists!: Home[];
  public currencies!: Currency[];
  public priorities!: Priority[];
  public roomNumbers!: RoomNumber[]
  public neighbourhoods!: Neighbourhood[];
  public requestedHomes!: RequestedHomes[];

  public user!: User;
  public editHome!: Home;
  public fileName!: string;
  public deleteHome!: Home;
  public selectedHome!: Home;
  public profileImage!: File;
  public selectedType!: Type;
  public selectedStatus!: Status;
  public selectedAgency!: string;
  private currentUserName!: string;
  public editRequestedHome!: RequestedHomes;
  public deleteRequestedHome!: RequestedHomes;
  public selectedCurrency!: Currency;
  public selectedPriority!: Priority;
  public selectedHomeType!: HomeType;
  public selectedRoomNumber!: RoomNumber;
  public selectedNeighbourhood!: Neighbourhood;
  public selectedRequestedHomes!: RequestedHomes;
  public addButton: boolean = false;
  public refreshing: boolean = false;
  public wrongPassword: boolean = false;
  public isPhoneValidated: boolean = false;
  public addRequestButton: boolean = false;
  public isAgencySelected: Boolean = false;
  public filterRoomNumberShow: boolean = false;
  public filterRequestedHomesRoomNumberShow: boolean = false;
  public passwordDoesnotMatch: boolean = false;
  public minPrice: number = 0;
  public maxPrice: number = 0;
  public requestedStatus!: Status;

  constructor(
    private homeService: HomeService,
    private neighbourhoodService: NeighbourhoodService,
    private typeService: TypesService,
    private roomNumberService: RoomNumbersService,
    private homeTypeService: HomeTypeService,
    private statusService: StatusService,
    private autheticationService: AuthenticationService,
    private notificationService: NotificationService,
    private router: Router,
    private agencyService: AgencyService,
    private currencyService: CurrencyService,
    private priorityService: PriorityService,
    private requestedHomesService: RequestedHomesService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.user = this.autheticationService.getUserFromLocalCache();
    this.user.contact = this.phoneValidation(this.reformatContact(this.user.contact));
    this.getAllAgencies();
    this.getAllCurrencies();
    this.getAllHomes();
    this.getAllHomeTypes();
    this.getAllNeighbourhood();
    this.getAllRoomNumbers();
    this.getAllStatuses();
    this.getAllTypes();
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
  public getAllRequestedHomes(): void {
    this.subs.add(
      this.requestedHomesService.getAll().subscribe(
        (response: RequestedHomes[]) => {
          this.requestedHomes = this.sort(response)
          this.requestedHomes = this.requestedHomes.filter(res => res.status.status == this.requestedStatus.status);
          this.requestedFiltering();
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }))
  }
  public getAllAgencies(): void {
    this.subs.add(
      this.agencyService.getAll().subscribe(
        (response: Agency[]) => {
          this.agencies = this.sort(response);
        },
        (errorResposne: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
        }
      )
    )
  }
  public getAllCurrencies(): void {
    this.subs.add(
      this.currencyService.getAll().subscribe(
        (response: Currency[]) => {
          this.currencies = this.sort(response);
          this.selectedCurrency = this.currencies[0];
        },
        (errorResposne: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
        }
      )
    )
  }
  public getAllHomes(): void {
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
  public getAllHomeTypes(): void {
    this.homeTypeService.getAll().subscribe(
      (response: HomeType[]) => {
        this.homeTypes = this.sort(response);
        this.selectedHomeType = this.homeTypes[0];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getAllNeighbourhood(): void {
    this.neighbourhoodService.getAll().subscribe(
      (response: Neighbourhood[]) => {
        this.neighbourhoods = this.sort(response);
        this.selectedNeighbourhood = this.neighbourhoods[0];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getAllRoomNumbers(): void {
    this.roomNumberService.getAll().subscribe(
      (response: RoomNumber[]) => {
        this.roomNumbers = this.sort(response);
        this.selectedRoomNumber = this.roomNumbers[0];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
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
  public getAllTypes(): void {
    this.typeService.getAll().subscribe(
      (response: Type[]) => {
        this.types = this.sort(response);
        this.selectedType = this.types[0];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  public getAllByUserIdContent(): void {
    this.subs.add(
      this.homeService.getAllById(this.user.userId).subscribe(
        (response: Home[]) => {
          this.userHomeLists = this.sort(response)
          this.cloneUserHomeLists = this.userHomeLists;
        }, (errorResposne: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResposne.error.message);
        }
      )
    )
  }
  public isUserCanEdit(requestedHome: RequestedHomes): boolean {
    return this.user.userId == requestedHome.user.userId;
  }
  public onSelect(value: any, type: string): void {
    if (type === 'type-selected') {
      this.selectedType = value;
    }
    else if (type === 'status-selected') {
      this.selectedStatus = value;
    }
    else if (type === 'home-type-selected') {
      this.filterRoomNumberShow = true;
      this.filterRequestedHomesRoomNumberShow = false;
      this.selectedHomeType = value;
      this.filterAfterTypesAndStatusAndHomeTypeSelected()
    }
    else if (type == 'openGeneralHomeInfo') {
      this.selectedHome = value;
    }
    else if (type === 'main-page-selected') {
      this.addButton = false;
      this.addRequestButton = false;
      this.filterRoomNumberShow = false;
      this.filterRequestedHomesRoomNumberShow = false;
    }
    else if (type === 'my-home-selected') {
      this.getAllByUserIdContent();
      this.filterRoomNumberShow = false;
      this.filterRequestedHomesRoomNumberShow = false;
      this.addRequestButton = false;
      this.addButton = true;
    }
    else if (type === 'requested-menu-selected') {
      this.filterRoomNumberShow = false;
      this.filterRequestedHomesRoomNumberShow = false;
      this.addRequestButton = false;
      this.addButton = false;
    }
    else if (type === 'requested-menu-home-selected') {
      this.requestedStatus = value;
      this.addRequestButton = true;
      this.filterRoomNumberShow = false;
      this.filterRequestedHomesRoomNumberShow = true;
      this.getAllPriority();
      this.getAllRequestedHomes();
    }
    else if (type == 'openHomeInfo') {
      this.selectedHome = value;
    }
    else if (type === 'check-box') {
      type = 'check-box' + value.id;
    }
    else if (type === 'requested-check-box') {
      type = 'requested-check-box-' + value.id;
    }
    else if (type === 'openRequestedHomeInfo') {
      this.selectedRequestedHomes = value;
    }
    else if (type === 'profile-selected') {
      this.filterRoomNumberShow = false;
      this.addRequestButton = false;
      this.filterRequestedHomesRoomNumberShow = false;
      this.addButton = false;
    }
    this.clickButton(type);
  }
  public updateProfileImage(): void {
    this.clickButton('profile-image-input');
  }
  // Selected Agency
  public onAgencyChange(state: any): void {
    this.selectedAgency = state.target.value;
    if (this.selectedAgency != "") {
      this.isAgencySelected = true;
    }
    else {
      this.isAgencySelected = false;
    }
  }
  public onUpdateCurrentUser(ngForm: NgForm): void {
    this.refreshing = true;
    this.currentUserName = this.autheticationService.getUserFromLocalCache().username;
    const formData = this.userService.updateUserFormData(this.currentUserName, this.user, ngForm, this.profileImage)
    this.subs.add(
      this.userService.updateUser(formData).subscribe(
        (response: User | any) => {
          this.autheticationService.addUserLocalCache(response);
          this.fileName != null;
          this.profileImage != null;
          this.notificationService.notify(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
          this.refreshing = false;
        }, (errorResposne: HttpErrorResponse) => {
          this.notificationService.notify(NotificationType.ERROR, errorResposne.error.message);
          this.refreshing = false;
          this.profileImage != null;
        }
      ));
  }
  public onProfileImageChange(event: any): void {
    this.fileName = event.target.files[0].name;
    this.profileImage = event.target.files[0];
  }
  // contact Control

  public onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profileImage);
    this.subs.add(
      this.userService.updateProfileImage(formData).subscribe(
        (event: HttpEvent<any>) => {
          this.reportUploadingProgress(event);
        }, (errorResposne: HttpErrorResponse) => {
          this.notificationService.notify(NotificationType.ERROR, errorResposne.error.message);
          this.fileStatus.status = 'done';
        }
      ));
  }
  // on contact input change control
  public onContactInputChangeControl(event: any): void {
    if (event.target.value.length == 16 && event.target.value[1] === '0') {
      this.isPhoneValidated = true;
    } else {
      this.isPhoneValidated = false;
    }
  }
  // contact Control
  public contactValidation(event: any): boolean {
    if ((Number(event.key) >= 0 && Number(event.key) <= 9)) {
      if (event.key === '0' && event.target.value.length === 0)
        event.target.value = '(' + event.target.value;
      if (event.target.value[0] !== '(' && event.target.value[1] !== '0')
        event.target.value = '(0' + event.target.value;
      if (event.target.value.length == 5)
        event.target.value = event.target.value + ')-';
      if (event.target.value.length == 10 || event.target.value.length == 13)
        event.target.value = event.target.value + '-';
      return (event.target.value.length <= 15);
    } else {
      return false;
    }
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
      button.setAttribute('data-target', '#updateHomeModal');
      this.editHome = home;
    }
    if (mode === 'delete') {
      this.deleteHome = home;
      button.setAttribute('data-target', '#deleteHomeModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
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

  public onAddHome(ngForm: NgForm): void {
    const formData = this.homeService.getFormData(ngForm);
    document.getElementById('add-home-form')?.click();
    this.subs.add(
      this.homeService.insert(formData).subscribe(
        (response: Home) => {
          this.getAllByUserIdContent();
          ngForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `Yeni bir emlak başarıyla yüklendi`)
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          ngForm.reset();
        }
      ));
  }
  public onUpdateHome(ngForm: NgForm): void {
    const userId = ngForm.value.id;
    const formData = this.homeService.getFormData(ngForm);
    this.subs.add(
      this.homeService.update(userId, formData).subscribe(
        (response: Home) => {
          this.getAllHomes();
          this.getAllByUserIdContent();
          this.sendNotification(NotificationType.SUCCESS, `başarıyla güncellendi`)
        },
        (errorResposne: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResposne.error.message)
        }
      ));
  }
  public onDeleteHome(contactId: number): void {
    this.homeService.deleteById(contactId).subscribe(
      (response: void) => {
        this.getAllByUserIdContent();
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
      }
    );
  }
  // RequestedHomes Methods
  public onAddRequestedHome(ngForm: NgForm): void {
    const formData = this.requestedHomesService.getFormData(ngForm);
    document.getElementById('add-requested-home-form')?.click();
    this.subs.add(
      this.requestedHomesService.insert(formData).subscribe(
        (response: RequestedHomes) => {
          this.getAllRequestedHomes();
          this.sendNotification(NotificationType.SUCCESS, `Yeni bir emlak başarıyla yüklendi`)
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          ngForm.reset();
        }
      ));
  }
  public onRequestedHomesUpdate(ngForm: NgForm): void {
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
  public onLogOut(): void {
    this.autheticationService.logout();
    this.router.navigate(['/login']);
    this.sendNotification(NotificationType.SUCCESS, "You've been successfully logged out.")
  }
  public requestingPriceFiltering(price: any, priceType: string): void {

  }



  public requestedHomesSearch(event: any): void {
    let key = event.target.value
    const results: RequestedHomes[] = [];
    if (event.key == "Backspace" || !key)
      this.requestedFilteredHome = this.cloneRequestedFilteredHome;
    for (let home of this.requestedFilteredHome) {
      if (
        home.recipientsName.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.priority.priority.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.location.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.budget.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.currency.currency.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.roomNumber.roomNumber.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.status.status.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.floors.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.user.firstName.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.user.lastName.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.user.username.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.note.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        home.id == parseInt(key)) {
        results.push(home);
      }
    }
    this.requestedFilteredHome = results;
  }



  public requestedCheckboxOnChange(event: any) {
    const checkedBox: HTMLElement | any = document.getElementById(event.target.id);
    const element: HTMLElement | any = document.getElementById(event.target.id.split('d-')[1]);
    const checkRoomNumber = this.roomNumbers.find(result => result.id == (checkedBox.id.split('x-')[1])) as RoomNumber;
    if (checkedBox.checked) {
      element.style.color = "red";
    } else {
      element.style.color = "white";
    }
    if (this.filterByRoomNumbersList.filter(result => result.id == checkRoomNumber?.id).length > 0) {
      let index = this.filterByRoomNumbersList.findIndex(result => result.id == checkRoomNumber.id);
      this.filterByRoomNumbersList.splice(index, 1);
    }
    else
      this.filterByRoomNumbersList.push(checkRoomNumber);
    this.requestedFiltering()
  }
  public priceFiltering(price: any, priceType: string): void {
    if (priceType == 'minimum') {
      this.minPrice = (price == null) ? 0 : price;
    }
    else if (priceType == 'maximum') {
      this.maxPrice = (price == null) ? 0 : price;
    }
    this.filterBaseOnPrice();
  }
  public inputValidationControl(value: any): boolean {
    if (value.key >= 0 && value.key <= 9 || value.key == 'Backspace')
      return true;
    else
      return false;
  }
  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }
  public get isManager(): boolean {
    return this.isAdmin || this.getUserRole() === Role.MANAGER;
  }
  public get isHR(): boolean {
    return this.getUserRole() === Role.HR;
  }
  public get isAdminOrManagerOrHR(): boolean {
    return this.isAdmin || this.isManager || this.isHR;
  }
  public phoneValidation(phoneContact: string): string {
    if (phoneContact.length == 16 && phoneContact[0] == '(' && phoneContact[1] == '0') {
      this.isPhoneValidated = true;
    } else {
      this.isPhoneValidated = false;
    }
    return phoneContact;
  }
  //  General Homes filtering
  public roomNumberOnSelectChange(event: any) {
    const checkedBox: HTMLElement | any = document.getElementById(event.target.id);
    const element: HTMLElement | any = document.getElementById(event.target.id.split('-')[1]);
    const checkRoomNumber = this.roomNumbers.find(result => result.id == (checkedBox.id.split('x')[1])) as RoomNumber;
    if (checkedBox.checked) {
      element.style.color = "red";
    } else {
      element.style.color = "white";
    }
    if (this.filterByRoomNumbersList.filter(result => result.id == checkRoomNumber?.id).length > 0) {
      let index = this.filterByRoomNumbersList.findIndex(result => result.id == checkRoomNumber.id);
      this.filterByRoomNumbersList.splice(index, 1);
    }
    else
      this.filterByRoomNumbersList.push(checkRoomNumber);
    this.filtering()
  }

  /* ****
  This filtering is just for general page 
  *** */
  // private Methods
  private filterAfterTypesAndStatusAndHomeTypeSelected(): void {
    if (this.selectedType !== null && this.selectedStatus !== null && this.selectedHomeType !== null)
      this.filteredHome = [];
    for (let home of this.homes)
      if (
        home.type.type.includes(this.selectedType.type) &&
        home.status.status.includes(this.selectedStatus.status) &&
        home.homeType.homeType.includes(this.selectedHomeType.homeType)
      ) {
        this.filteredHome.push(home);
      }
    this.filteredCloneHomes = this.filteredHome;
  }

  public generalSearch(event: any): void {
    let key = event.target.value
    const results: Home[] = [];
    if (event.key == "Backspace" || !key) {
      this.filteredHome = this.filteredCloneHomes;
    }
    for (let home of this.filteredHome) {
      if (home.header.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
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
    this.filteredHome = results;
  }

  // 
  public userHomeSearch(event: any): void {
    let key = event.target.value
    const results: Home[] = [];
    if (event.key == "Backspace" || !key) {
      this.userHomeLists = this.cloneUserHomeLists;
    }
    for (let home of this.userHomeLists) {
      if (home.header.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
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
    this.userHomeLists = results;
  }



  private filtering(): void {
    let results: Home[] = [];
    if (this.filterByRoomNumbersList.length != 0) {
      for (let roomNumber of this.filterByRoomNumbersList) {
        results.push(...this.filteredCloneHomes.filter(result => {
          return result.roomNumber.id == roomNumber.id;
        }))
      }
    }
    else if (this.filterByRoomNumbersList.length == 0) {
      results = this.filteredCloneHomes;
    }
    this.filteredHome = results;
  }



  public passwordRes(): void {
    this.wrongPassword = false;
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
  public showData(home: RequestedHomes): boolean {
    if (this.isAdminOrManagerOrHR) {
      return false;
    }
    if (home.user.userId === this.user.userId)
      return false;
    return true
  }

  // reformat contact
  public reformatContact(editUserContact: any): string {
    var phoneContact = '';
    for (let i = 0; i < editUserContact.length; i++)
      if ((Number(editUserContact[i]) >= 0 && Number(editUserContact[i]) <= 9))
        phoneContact = phoneContact + editUserContact[i]
    if (phoneContact[0] == '0')
      phoneContact = '(' + phoneContact.slice(0, 4) + ')-' + phoneContact.slice(4, 7) + '-' + phoneContact.slice(7, 9) + '-' + phoneContact.slice(9, 11);
    else {
      phoneContact = '(0' + phoneContact.slice(0, 3) + ')-' + phoneContact.slice(3, 6) + '-' + phoneContact.slice(6, 8) + '-' + phoneContact.slice(8, 10);
    }
    return phoneContact;
  }
  // report uploading progress
  private reportUploadingProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        if (event.total) {
          this.fileStatus.percentage = Math.round(100 * event.loaded / event.total);
          this.fileStatus.status = 'progress';
        }
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
          this.sendNotification(NotificationType.SUCCESS, ` ${event.body.firstName}\'s profile image updated successfully`);
          this.fileStatus.status = 'done';
        } else {
          this.sendNotification(NotificationType.ERROR, `unable to upload profile image, Please try again`);
        }
        break;
      default:
        `Finished all processes`;
    }
  }
  public isLink(selectedHomeDetails: any): boolean {
    return selectedHomeDetails?.split('://')[0] == "https" || selectedHomeDetails?.split('://')[0] == "http";
  }
  private requestedFiltering(): void {
    let results: RequestedHomes[] = [];
    if (this.filterByRoomNumbersList.length != 0) {
      for (let roomNumber of this.filterByRoomNumbersList) {
        results.push(...this.requestedHomes.filter(result => {
          return result.roomNumber.id == roomNumber.id;
        }))
      }
    }
    else if (this.filterByRoomNumbersList.length == 0) {
      results = this.requestedHomes;
    }
    this.requestedFilteredHome = results;
    this.cloneRequestedFilteredHome = this.requestedFilteredHome;
  }
  private clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click();
  }
  private sort(e: any) {
    return e.sort(function (a: any, b: any) {
      return a.price - b.price;
    });
  }
  private getUserRole(): string {
    return this.autheticationService.getUserFromLocalCache().role;
  }
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, "An error occured. Please try again.");
    }
  }
  public passwordChangeClick(mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addHomeResModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
  }
  public passwordChange(ngForm: NgForm) {
    const formData = this.userService.passworChange(ngForm)

    if (ngForm.value.newPassword == ngForm.value.confirmPassword) {
      this.passwordDoesnotMatch = false;
      this.subs.add(this.userService.updatePassword(formData).subscribe(
        (response: User | any) => {
          document.getElementById('add-pass-home-form')?.click();
          ngForm.reset();
        },
        (errorResponse: HttpErrorResponse) => {
          this.wrongPassword = true;
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      ))
    }
    else {
      this.passwordDoesnotMatch = true;
    }
  }
  public reset() {
    this.passwordDoesnotMatch = false;
  }


  // rubish
  private filterBaseOnPrice(): void {
    let results: Home[] = []
    if (this.minPrice == 0 && this.maxPrice == 0) {
      results = this.cloneHomes;
    }
    else if (this.minPrice !== 0 && this.maxPrice !== 0) {
      for (let room of this.cloneHomes) {
        if (room.price >= this.minPrice && room.price <= this.maxPrice) {
          results.push(room);
        }
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
    this.filteredHome = results;

  }
}
