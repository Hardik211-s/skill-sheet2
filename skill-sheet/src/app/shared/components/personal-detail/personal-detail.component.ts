import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { UserdetailService } from '../../../service/userdetail.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../service/auth.service';
import { environment } from '../../../../environments/envoronment';
import { COUNTRIES } from '../../../constants/countries';
import { DEGREES } from '../../../constants/degrees';
@Component({
  selector: 'app-personal-detail',
  imports: [CommonModule, FormsModule, NgChartsModule, ReactiveFormsModule],
  templateUrl: './personal-detail.component.html',
  styleUrl: './personal-detail.component.scss'
})
export class PersonalDetailComponent implements OnInit {

  countries = COUNTRIES
  degrees: string[] = DEGREES
  selectedFile: File | null = null;
  isSuccess: boolean = false
  showToast: boolean = false;
  addedProfileDetail: any = {}
  isEditImage: boolean = false;
  imageUrl: string | ArrayBuffer | null = null;
  profileData: any = {}
  user: any = {}
  //user for count age and validation for future date in datepicker
  maxDate: string = new Date().toISOString().split('T')[0]; // Formats date as YYYY-MM-DD
  minDate: string = new Date(1950, 0, 1).toISOString().split('T')[0];
  ageDate: string = new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate())
    .toISOString()
    .split('T')[0];
  joinDate: string = new Date().toISOString().split('T')[0];
  dob = new FormControl('');
  private _snackBar = inject(MatSnackBar);

  detailForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    gender: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    birthdate: new FormControl('', [Validators.required]),
    joiningDate: new FormControl('', [Validators.required]),
    workJapan: new FormControl('', [Validators.required]),
    phoneNo: new FormControl('', [Validators.required, Validators.minLength(10)]),
    photo: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    qualification: new FormControl('', [Validators.required])
  });



  constructor(private http: HttpClient, private userDetailService: UserdetailService, private router: Router, private authSearvice: AuthService) {
    this.userDetailService.editUser$.subscribe(() => {
      this.isEditImage = this.userDetailService.getIsEdit(); // Manually trigger change detection
    });
    this.user = this.authSearvice.isLoggedIn().userData;
  }


  ngOnInit(): void {
    this.http.get(environment.apiUrl + "UserDetail/UserDetailById/" + this.user.UserId).pipe(
      catchError((error) => {
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      this.profileData = res
      console.log(this.profileData)
      this.profileData = this.profileData.userDetail
      this.userDetailService.addData(this.profileData)
      this.isEditImage = this.userDetailService.isUserPresent()
      console.log(this.profileData.photo)
      if(this.profileData.photo == null && this.profileData.fullName==null  && this.profileData.phoneNo==0 && this.profileData.description==null && this.profileData.qualification==null){
        this.isEditImage = false
        console.log("pppp")
        }


      if (this.isEditImage) {
        this.profileData.photo = "https://localhost:7111/" + this.profileData?.photo
        this.detailForm.get('photo')?.clearValidators();
        this.detailForm.get('photo')?.updateValueAndValidity();
        this.detailForm.get('username')?.setValue(this.profileData.username)
        this.detailForm.get('lastname')?.setValue(this.profileData.fullName?.split(" ")[1])
        this.detailForm.get('gender')?.setValue(this.profileData.sex)
        this.detailForm.get('country')?.setValue(this.profileData.country)
        this.detailForm.get('birthdate')?.setValue(this.profileData.birthdate)
        this.detailForm.get('joiningDate')?.setValue(this.profileData.joiningDate)
        this.detailForm.get('workJapan')?.setValue(this.profileData.workJapan ? "Yes" : "No")
        this.detailForm.get('phoneNo')?.setValue(this.profileData.phoneNo)
        this.detailForm.get('description')?.setValue(this.profileData.description)
        this.detailForm.get('qualification')?.setValue(this.profileData.qualification)
        this.detailForm.get('photo')?.setValue("")
      }
    })
  }
  isFieldTouched(field: string): boolean | undefined {
    return this.detailForm.get(field)?.dirty || this.detailForm.get(field)?.touched;
  }

  setDummyFile() {
    const content = 'Hello, this is a dummy file!';
    const blob = new Blob([content], { type: 'text/plain' });
    this.selectedFile = new File([blob], 'dummy.txt', { type: 'text/plain' });
  }

  //this is used for show preview of image
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onSubmit() {
    this.profileData = {
      username: this.user.Name,
      lastname: this.detailForm.get('lastname')?.value,
      sex: this.detailForm.get('gender')?.value,
      country: this.detailForm.get('country')?.value,
      birthdate: this.detailForm.get('birthdate')?.value,
      joiningDate: this.detailForm.get('joiningDate')?.value,
      workJapan: (this.detailForm.get('workJapan')?.value == 'Yes') ? 'true' : 'false',
      phoneNo: this.detailForm.get('phoneNo')?.value,
      photo: (this.selectedFile) ? this.detailForm.get('photo')?.value : this.profileData.photo,
      description: this.detailForm.get('description')?.value,
      qualification: this.detailForm.get('qualification')?.value,
      fullName: this.detailForm.get('username')?.value + " " + this.detailForm.get('lastname')?.value,
    }

    const formData = new FormData();

    // Append text fields
    formData.append('username', this.profileData.username);
    formData.append('fullname', this.detailForm.get('username')?.value + " " + this.profileData.lastname);
    formData.append('sex', this.profileData.sex);
    formData.append('birthdate', this.profileData.birthdate);  // Ensure it's in YYYY-MM-DD format
    formData.append('joiningDate', this.profileData.joiningDate);  // Same format
    formData.append('workJapan', this.profileData.workJapan.toString()); // Convert boolean to string
    formData.append('phoneNo', this.profileData.phoneNo); // Convert boolean to string
    formData.append('qualification', this.profileData.qualification ?? ''); // Handle null values
    formData.append('country', this.profileData.country ?? '');
    formData.append('description', this.profileData.description);

      if (this.selectedFile) {
        formData.append('photo', this.selectedFile, this.selectedFile?.name);
      }
      this.http.patch("https://localhost:7111/api/UserDetail/EditUserDetail", formData).pipe(
        catchError((error) => {
          this._snackBar.open('Profile detail not edited !!', 'Remove', {
            horizontalPosition: "right",
            verticalPosition: 'bottom',
          });
          return throwError(() => error); // Proper error handling
        })
      ).subscribe((res) => {
        this.addedProfileDetail = res;
        this._snackBar.open('Profile detail edited successfully !!', 'Remove', {
          horizontalPosition: "right",
          verticalPosition: 'bottom',
        });
        this.router.navigate(['/showdetail'])

      })
    
  }

}
