import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeType } from 'src/app/model/HomeType';
import { HomeTypeService } from 'src/app/service/home-types.service';

@Component({
  selector: 'app-HomeType',
  templateUrl: './home-type.component.html',
  styleUrls: ['./home-type.component.css']
})
export class HomeTypeComponent implements OnInit {
  public homeTypes!: HomeType[];
  public editHomeType!: HomeType;
  public deleteHomeType!: HomeType;

  constructor(
    private homeTypeService: HomeTypeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getAll();
  }

  public getAll(): void {
    this.homeTypeService.getAll().subscribe(
      (response: HomeType[]) => {
        this.homeTypes = response;
        this.homeTypes.sort(function (a: any, b: any) {
          return a.id - b.id;
        });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddHomeType(addForm: NgForm): void {
    document.getElementById('add-HomeType-form')?.click();
    this.homeTypeService.insert(addForm.value).subscribe(
      (response: HomeType) => {
        this.getAll();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateHomeType(homeType: HomeType): void {
    this.homeTypeService.update(homeType).subscribe(
      (response: HomeType) => {
        this.getAll();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onDeleteHomeType(homeTypeId: number): void {
    this.homeTypeService.deleteById(homeTypeId).subscribe(
      (response: void) => {
        this.getAll();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public search(key: string): void {
    const results: HomeType[] = [];
    for (const HomeType of this.homeTypes) {
      if (HomeType.homeType.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        HomeType.id==parseInt(key)){
        results.push(HomeType);
      }
    }
    this.homeTypes = results;
    if (!key) {
      this.getAll();
    }
  }


  public onOpenModal(homeType: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addHomeTypeModal');
    }
    if (mode === 'edit') {
      this.editHomeType = homeType;
      button.setAttribute('data-target', '#updateHomeTypeModal');
    }
    if (mode === 'delete') {
      this.deleteHomeType = homeType;
      button.setAttribute('data-target', '#deleteHomeTypeModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
  }
  public onSelect(homeType:HomeType) {
    this.router.navigate([homeType.id], { relativeTo: this.activatedRoute })
  }

}
