import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Priority } from 'src/app/model/Priority';
import { PriorityService } from 'src/app/service/priority.service';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.css']
})
export class PriorityComponent implements OnInit {
  public priorities!: Priority[];
  public editPriority!: Priority;
  public deletePriority!: Priority;

  constructor(
    private priorityService: PriorityService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getAll();
  }

  public getAll(): void {
    this.priorityService.getAll().subscribe(
      (response: Priority[]) => {
        this.priorities = response;
        this.priorities.sort(function (a: any, b: any) {
          return a.id - b.id;
        });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddPriority(addForm: NgForm): void {
    document.getElementById('add-priority-form')?.click();
    this.priorityService.insert(addForm.value).subscribe(
      (response: Priority) => {
        this.getAll();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdatePriority(priority: Priority): void {
    this.priorityService.update(priority).subscribe(
      (response: Priority) => {
        this.getAll();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onDeletePriority(priorityId: number): void {
    this.priorityService.deleteById(priorityId).subscribe(
      (response: void) => {
        this.getAll();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public search(key: string): void {
    const results: Priority[] = [];
    for (const Priority of this.priorities) {
      if (Priority.priority.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        Priority.id == parseInt(key)) {
        results.push(Priority);
      }
    }
    this.priorities = results;
    if (!key) {
      this.getAll();
    }
  }


  public onOpenModal(priority: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addPriorityModal');
    }
    if (mode === 'edit') {
      this.editPriority = priority;
      button.setAttribute('data-target', '#updatePriorityModal');
    }
    if (mode === 'delete') {
      this.deletePriority = priority;
      button.setAttribute('data-target', '#deletePriorityModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
  }
  public onSelect(Priority: Priority) {
    this.router.navigate([Priority.id], { relativeTo: this.activatedRoute })
  }

}
