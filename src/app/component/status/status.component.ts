import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Status } from 'src/app/model/Status';
import { StatusService } from 'src/app/service/status.service';

@Component({
  selector: 'app-Status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  public statuses!: Status[];
  public editStatus!: Status;
  public deleteStatus!: Status;

  constructor(
    private statusService: StatusService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getAll();
  }

  public getAll(): void {
    this.statusService.getAll().subscribe(
      (response: Status[]) => {
        this.statuses = response;
        this.statuses.sort(function (a: any, b: any) {
          return a.id - b.id;
        });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddStatus(addForm: NgForm): void {
    document.getElementById('add-status-form')?.click();
    this.statusService.insert(addForm.value).subscribe(
      (response: Status) => {
        this.getAll();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateStatus(status: Status): void {
    this.statusService.update(status).subscribe(
      (response: Status) => {
        this.getAll();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onDeleteStatus(statusId: number): void {
    this.statusService.deleteById(statusId).subscribe(
      (response: void) => {
        this.getAll();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public search(key: string): void {
    const results: Status[] = [];
    for (const Status of this.statuses) {
      if (Status.status.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        Status.id==parseInt(key)){
        results.push(Status);
      }
    }
    this.statuses = results;
    if (!key) {
      this.getAll();
    }
  }


  public onOpenModal(status: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addStatusModal');
    }
    if (mode === 'edit') {
      this.editStatus = status;
      button.setAttribute('data-target', '#updateStatusModal');
    }
    if (mode === 'delete') {
      this.deleteStatus = status;
      button.setAttribute('data-target', '#deleteStatusModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
  }
  public onSelect(Status:Status) {
    this.router.navigate([Status.id], { relativeTo: this.activatedRoute })
  }

}
