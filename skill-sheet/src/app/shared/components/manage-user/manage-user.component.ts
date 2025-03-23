import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderComponent } from '../../common/loader/loader.component';
// import * as bootstrap from 'bootstrap';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'app-manage-user',
  imports: [ CommonModule, FormsModule, LoaderComponent, ReactiveFormsModule, MatTableModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.scss'
})
export class ManageUserComponent {
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('closeModal2') closeModal2!: ElementRef;

  searchText: string = '';
  user: any[] = [];
  userRequestData: any = {}
  allUsers: any = {}
  load: boolean = false;
  selectedUser: any = {};
  userDelete: any = {};

  private _snackBar = inject(MatSnackBar);

  editUserForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(3),
      Validators.pattern( '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
    ]),
    email: new FormControl('', [Validators.required,Validators.email]),
    username: new FormControl('', [Validators.required])
  });

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.http.get("https://localhost:7111/api/Auth/allUser").subscribe((res) => {
      this.allUsers = res;
      this.user = this.allUsers.allUsers;
    })
  }


  get filteredUsers() {
    return this.user.filter((user: { username: any; role: any; email: any }) =>
      user.username.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.role.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  sortOnUsername() {
    this.allUsers = this.user.sort((a, b) => a.username.localeCompare(b.username));
  }
  sortOnEmail() {
    this.allUsers = this.user.sort((a, b) => a.email.localeCompare(b.email));
  }
  sortOnRole() {
    this.allUsers = this.user.sort((a, b) => a.role.localeCompare(b.role));
  }

  getSeletedUser(user: any) {
    this.selectedUser = user
    this.editUserForm.get('username')?.setValue(this.selectedUser.username);
    this.editUserForm.get('email')?.setValue(this.selectedUser.email);

  }
  closeModal1(closeModal: HTMLButtonElement) {
    closeModal.click();
  }

  editUser(closeModal: HTMLButtonElement) {
    this.load = true
    this.userRequestData = {
      username: this.editUserForm.get('username')?.value,
      email: this.editUserForm.get('email')?.value,
      password: this.editUserForm.get('password')?.value,
      role: "User",
    }
    this.http.patch("https://localhost:7111/api/Auth/Update", this.userRequestData).pipe(
      catchError((error) => {
        this._snackBar.open('Error : User not Edited !', 'Remove', {
          horizontalPosition: "right",
          verticalPosition: 'bottom',
        });
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      this.load = false
      this._snackBar.open('User Edited !', 'Remove', {
        horizontalPosition: "right",
        verticalPosition: 'bottom',
      });

      if (this.closeModal) {
        this.closeModal.nativeElement.click();
      }
    })
  }

  deleteUser(closeModal2: HTMLButtonElement) {
    this.load = true;
    this.userDelete = {
      username: this.selectedUser.username
    }
    this.http.delete(`${"https://localhost:7111/api/Auth/Delete"}/${this.selectedUser.username}`
    ).pipe(
      catchError((error) => {
        this.load = false
        this._snackBar.open(error.error, 'Remove', {
          horizontalPosition: "right",
          verticalPosition: 'bottom',
        });
        return '' // Proper error handling
      })
    ).subscribe((res) => {
      this.load = false;
      this._snackBar.open('User Deleted !', 'Remove', {
        horizontalPosition: "right",
        verticalPosition: 'bottom',
      });
      if (this.closeModal2) {
        this.closeModal2.nativeElement.click();
      }
    })
  }
}
