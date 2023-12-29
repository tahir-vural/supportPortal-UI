import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Type } from 'src/app/model/Type';
import { TypesService } from 'src/app/service/types.service';

@Component({
  selector: 'app-Type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent implements OnInit {
  public types!: Type[];
  public editType!: Type;
  public deleteType!: Type;

  constructor(
    private TypeService: TypesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getAll();
  }

  public getAll(): void {
    this.TypeService.getAll().subscribe(
      (response: Type[]) => {
        this.types = response;
        this.types.sort(function (a: any, b: any) {
          return a.id - b.id;
        });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddType(addForm: NgForm): void {
    document.getElementById('add-Type-form')?.click();
    this.TypeService.insert(addForm.value).subscribe(
      (response: Type) => {
        this.getAll();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateType(type: Type): void {
    this.TypeService.update(type).subscribe(
      (response: Type) => {
        this.getAll();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onDeleteType(typeId: number): void {
    this.TypeService.deleteById(typeId).subscribe(
      (response: void) => {
        this.getAll();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public search(key: string): void {
    const results: Type[] = [];
    for (const Type of this.types) {
      if (Type.type.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        Type.id==parseInt(key)){
        results.push(Type);
      }
    }
    this.types = results;
    if (!key) {
      this.getAll();
    }
  }


  public onOpenModal(Type: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addTypeModal');
    }
    if (mode === 'edit') {
      this.editType = Type;
      button.setAttribute('data-target', '#updateTypeModal');
    }
    if (mode === 'delete') {
      this.deleteType = Type;
      button.setAttribute('data-target', '#deleteTypeModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
  }
  public onSelect(Type:Type) {
    this.router.navigate([Type.id], { relativeTo: this.activatedRoute })
  }

}
