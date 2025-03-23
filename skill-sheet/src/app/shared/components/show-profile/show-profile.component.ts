import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserdetailService } from '../../../service/userdetail.service';
import { AuthService } from '../../../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-show-profile',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './show-profile.component.html',
  styleUrl: './show-profile.component.scss'
})
export class ShowProfileComponent implements OnInit, OnChanges {
  @ViewChild('closeModal') closeModal!: ElementRef;
  @Input() userId: number = 0;

  userDetail: any = {}
  user: any = {}
  mydata: any = {}
  imageURL: string = '';
  userSkill: any = {}
  programming: any = {}
  userRequestData: any = {}

  private _snackBar = inject(MatSnackBar);

  editUserForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.pattern(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
    )]
    ),
    confirmPassword: new FormControl('', [Validators.required, Validators.pattern(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
    )]),
    newPassword: new FormControl('', [Validators.required, Validators.pattern(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
    )])
  })

  constructor(private http: HttpClient, private router: Router, private authSearvice: AuthService, private userDetailService: UserdetailService, private cdr: ChangeDetectorRef) {
  }


  ngOnInit() {
    this.user = this.authSearvice.isLoggedIn().userData;
    this.loadData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && changes['userId'].currentValue !== changes['userId'].previousValue) {
      this.loadData()
    }
  }



  loadData() {
    this.http.get(`${"https://localhost:7111/api/UserDetail/UserDetailById"}/${(this.userId == 0) ? this.user.UserId : this.userId}`).subscribe((res) => {
      this.userDetail = res;
      this.userDetail = this.userDetail?.userDetail;
      this.imageURL = "https://localhost:7111/" + this.userDetail.photo;
      this.userDetailService.addData(this.userDetail);
    })

    this.http.get(`${"https://localhost:7111/api/UserSkill"}/${(this.userId == 0) ? this.user.UserId : this.userId}`).subscribe((res) => {
      this.userSkill = res
      this.cdr.detectChanges();
    })
  }

  getProficiencyPercentage(level: string): number {
    switch (level) {
      case 'Beginner': return 25;
      case 'Intermediate': return 50;
      case 'Advanced': return 75;
      case 'Expert': return 100;
      default: return 0;
    }
  }


  filterCategory(search: string) {
    return this.userSkill?.userSkill?.filter((user: { skill: any; category: any; subcategory: any }) =>
      user.skill.includes(search)
      || user.category.includes(search) ||
      user.subcategory.includes(search)
    );
  }

  filterByExcludeSkill() {
    return this.userSkill?.userSkill?.filter((user: { skill: any; category: any; subcategory: any }) =>
      user.category !== 'Programming & Development'
    );
  }
  changePassword(closeModal: HTMLButtonElement) {
    const password = this.editUserForm.get('password')?.value;
    const confirmPassword = this.editUserForm.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      this.editUserForm.get('confirmPassword')?.setErrors({ mustMatch: true });
      return;
    } else {
      this.editUserForm.get('confirmPassword')?.setErrors(null);
    }
    this.userRequestData = {
      username: this.user.Name,
      email: this.user.Email,
      password: this.editUserForm.get('password')?.value,
      newPassword: this.editUserForm.get('newPassword')?.value,
      role: this.user.Role,
    }
    this.http.patch("https://localhost:7111/api/Auth/Password", this.userRequestData).pipe(
      catchError((error) => {
        this._snackBar.open('Password Changed !', 'Remove', {
          horizontalPosition: "right",
          verticalPosition: 'bottom',
        });
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      this._snackBar.open('Password Changed !', 'Remove', {
        horizontalPosition: "right",
        verticalPosition: 'bottom',
      });

      if (this.closeModal) {
        this.closeModal.nativeElement.click();
      }
      closeModal.click();
    })

  }
}
