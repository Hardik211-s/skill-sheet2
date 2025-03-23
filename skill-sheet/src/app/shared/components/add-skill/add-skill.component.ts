import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import {MatSliderModule} from '@angular/material/slider';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth.service';
import { SkilldataService } from '../../../service/skilldata.service';
@Component({
  selector: 'add-skill.component',
  templateUrl: 'add-skill.component.html',
  styleUrl: 'add-skill.component.scss',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatInputModule, MatSelectModule,MatSliderModule,CommonModule
  ],
  standalone:true

})
export class AddSkillComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);

  skillCategory: any = []
  skillSubCategory: any = []
  skills: any = []
  disabled = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  myvalue:number=0;
  dummy:any=[]

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
    proficiency: ['', Validators.required],
    experience: ['', Validators.required],
  });

  constructor(private http: HttpClient,private authService:AuthService,private skillDataService:SkilldataService) { }
 
  ngOnInit(): void {
    this.skillDataService.getCategoryData().pipe(
      catchError((error) => {
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      console.log(res)
      this.skillCategory = res;
      this.skillCategory = this.skillCategory.category;
    })
 
  }

  formatLabel(value: number): string {
    this.myvalue=value;
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }
 
  openSnackBar(message: string) {
    this._snackBar.open(message,'Remove', {
      horizontalPosition: "right",
      verticalPosition: 'bottom' ,
    });
  }


  OnCategory() { 
    this.skillDataService.getSubCategoryDataByID(this.firstFormGroup.get('firstCtrl')?.value).pipe(
      catchError((error) => {
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      this.skillSubCategory = res;
      this.skillSubCategory = this.skillSubCategory.subCategory;
    })

  }

  OnSubcategory() {
    this.skillDataService.getSkillDataByID(this.secondFormGroup.get('secondCtrl')?.value).pipe(
      catchError((error) => {
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      this.skills = res;
      this.skills = this.skills.skills;
    })
  }

  resetStepper(fileInput2:HTMLInputElement){
    fileInput2.click();
  }

  OnSkill(fileInput:HTMLInputElement,fileInput2:HTMLInputElement) {
  
    this.skillDataService.addSkill({userId:Number(this.authService.isLoggedIn().userData.UserId),myId:this.thirdFormGroup
      .get('thirdCtrl')?.value,  proficiencyLevel: this.thirdFormGroup
      .get('proficiency')?.value,
      experience: this.thirdFormGroup
      .get('experience')?.value}).pipe(
      catchError((error) => {
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
     fileInput.click()
     fileInput2.click()
    })
  }
}
