import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomNumber } from 'src/app/model/RoomNumber';
import { RoomNumbersService } from 'src/app/service/room-numbers.service';

@Component({
  selector: 'app-RoomNumber',
  templateUrl: './room-number.component.html',
  styleUrls: ['./room-number.component.css']
})
export class RoomNumberComponent implements OnInit {
  public roomNumberes!: RoomNumber[];
  public editRoomNumber!: RoomNumber;
  public deleteRoomNumber!: RoomNumber;

  constructor(
    private roomNumberService: RoomNumbersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getAll();
  }

  public getAll(): void {
    this.roomNumberService.getAll().subscribe(
      (response: RoomNumber[]) => {
        this.roomNumberes = response;
        this.roomNumberes.sort(function (a: any, b: any) {
          return a.id - b.id;
        });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddRoomNumber(addForm: NgForm): void {
    document.getElementById('add-RoomNumber-form')?.click();
    this.roomNumberService.insert(addForm.value).subscribe(
      (response: RoomNumber) => {
        this.getAll();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateRoomNumber(roomNumber: RoomNumber): void {
    this.roomNumberService.update(roomNumber).subscribe(
      (response: RoomNumber) => {
        this.getAll();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onDeleteRoomNumber(roomNumberId: number): void {
    this.roomNumberService.deleteById(roomNumberId).subscribe(
      (response: void) => {
        this.getAll();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public search(key: string): void {
    const results: RoomNumber[] = [];
    for (const RoomNumber of this.roomNumberes) {
      if (RoomNumber.roomNumber.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        RoomNumber.id==parseInt(key)){
        results.push(RoomNumber);
      }
    }
    this.roomNumberes = results;
    if (!key) {
      this.getAll();
    }
  }


  public onOpenModal(roomNumber: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addRoomNumberModal');
    }
    if (mode === 'edit') {
      this.editRoomNumber = roomNumber;
      button.setAttribute('data-target', '#updateRoomNumberModal');
    }
    if (mode === 'delete') {
      this.deleteRoomNumber = roomNumber;
      button.setAttribute('data-target', '#deleteRoomNumberModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
  }
  public onSelect(RoomNumber:RoomNumber) {
    this.router.navigate([RoomNumber.id], { relativeTo: this.activatedRoute })
  }

}
