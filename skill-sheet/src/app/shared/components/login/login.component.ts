import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationCancel, Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderComponent } from '../../common/loader/loader.component';

interface userData {
  role: string,
  username: string,
  password: string,
}
@Component({
  selector: 'app-login',
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  user: any = {}
  alluser: any = {}
  selectedUser: string = ""
  userNames: string[] = []
  load: boolean = false
  userData: any = {}

  loginForm = new FormGroup({
    role: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)
    ])
  });

  private _snackBar = inject(MatSnackBar);

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
  }

  userRole: string = "";
  ngOnInit(): void {
    this.authService.getAllUser().subscribe((res) => {
      this.alluser = res;
      this.alluser = (this.alluser.allUsers);
      console.log(res)
      console.log(this.alluser)
      this.alluser.forEach((element: { role: any; }) => {
      });
    })
  }

  //function for get role which is selected by user
  getRole(e: any) {
    this.loginForm.get('username')?.reset('');
    this.selectedUser = ""
    this.userRole = e.target.value;
    this.userNames = this.alluser.filter((item: { role: string; }) => item.role == this.userRole).map((user: { username: any; }) => user.username)
  }

  isFieldTouched(field: string): boolean | undefined {
    return this.loginForm.get(field)?.dirty || this.loginForm.get(field)?.touched;
  }

  getUserName(e: any) {
    this.selectedUser = e.target.value
  }

  onSubmit() {
    this.load = true;
    this.userData = {
      role: this.loginForm.get('role')?.value,
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value,
    }

    this.authService.login(this.userData).pipe(
      catchError((error) => {
        this.load = false

        this._snackBar.open(error.error.message, 'Remove', {
          horizontalPosition: "right",
          verticalPosition: 'bottom',
        });
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      this.load = false;
      this.userData = res.userData
      sessionStorage.setItem("token", res.token);
      this.authService.setLoginData()
    })
  }
}
