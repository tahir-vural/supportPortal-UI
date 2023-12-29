import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { District } from 'src/app/model/District';
import { Neighbourhood } from 'src/app/model/Neighbourhood';
import { DistrictsService } from 'src/app/service/districts.service';
import { NeighbourhoodService } from 'src/app/service/neighbourhood.service';

@Component({
  selector: 'app-Neighbourhood',
  templateUrl: './neighbourhood.component.html',
  styleUrls: ['./neighbourhood.component.css']
})
export class NeighbourhoodComponent implements OnInit {
  public neighbourhoodes!: Neighbourhood[];
  public districts!: District[];
  public editNeighbourhood!: Neighbourhood;
  public deleteNeighbourhood!: Neighbourhood;
  public selectedDistrict!: District;

  constructor(
    private neighbourhoodService: NeighbourhoodService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private districtService: DistrictsService
  ) { }

  ngOnInit() {
    this.getAll();
    this.getAllDistricts();
  }

  public getAllDistricts(): void {
    this.districtService.getAll().subscribe(
      (response: District[]) => {
        this.districts = response;
        this.districts.sort(function (a: any, b: any) {
          return a.id - b.id;
        });
        this.selectedDistrict = this.districts?.[0];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getAll(): void {
    this.neighbourhoodService.getAll().subscribe(
      (response: Neighbourhood[]) => {
        this.neighbourhoodes = response;
        this.neighbourhoodes.sort(function (a: any, b: any) {
          return a.id - b.id;
        });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddNeighbourhood(addForm: NgForm): void {
    document.getElementById('add-Neighbourhood-form')?.click();
    this.neighbourhoodService.insert(addForm.value).subscribe(
      (response: Neighbourhood) => {
        this.getAll();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateNeighbourhood(neighbourhood: Neighbourhood): void {
    this.neighbourhoodService.update(neighbourhood).subscribe(
      (response: Neighbourhood) => {
        this.getAll();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onDeleteNeighbourhood(neighbourhoodId: number): void {
    this.neighbourhoodService.deleteById(neighbourhoodId).subscribe(
      (response: void) => {
        this.getAll();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public search(key: string): void {
    const results: Neighbourhood[] = [];
    for (const Neighbourhood of this.neighbourhoodes) {
      if (
        Neighbourhood.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        Neighbourhood.district.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        Neighbourhood.district.city.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        Neighbourhood.id == parseInt(key) ||
        Neighbourhood.district.id == parseInt(key) ||
        Neighbourhood.district.city.id == parseInt(key)
      ) {
        results.push(Neighbourhood);
      }
    }
    this.neighbourhoodes = results;
    if (!key) {
      this.getAll();
    }
  }


  public onOpenModal(neighbourhood: any, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addNeighbourhoodModal');
    }
    if (mode === 'edit') {
      this.editNeighbourhood = neighbourhood;
      this.selectedDistrict = neighbourhood.district;
      button.setAttribute('data-target', '#updateNeighbourhoodModal');
    }
    if (mode === 'delete') {
      this.deleteNeighbourhood = neighbourhood;
      button.setAttribute('data-target', '#deleteNeighbourhoodModal');
    }
    container != null ? container.appendChild(button) : null;
    button.click();
  }
  public onSelect(neighbourhood: Neighbourhood) {
    this.router.navigate([neighbourhood.id], { relativeTo: this.activatedRoute })
  }

}
