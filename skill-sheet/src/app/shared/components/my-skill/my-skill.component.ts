import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-skill',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './my-skill.component.html',
  styleUrl: './my-skill.component.scss'
})
export class MySkillComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;

  searchText: string = ""
  dummy: any = []
  selectedSkill: any = []
  userRequestData: any = {}

  private _snackBar = inject(MatSnackBar);
  editUserForm = new FormGroup({
    proficiency: new FormControl('', [Validators.required]),
    experience: new FormControl('', [Validators.required]),
  });
  constructor(private http: HttpClient, private authSearvice: AuthService) { }
 

  ngOnInit(): void {
    this.http.get(`${"https://localhost:7111/api/UserSkill/"}${this.authSearvice.isLoggedIn().userData.UserId}`).pipe(
      catchError((error) => {
        console.error("Error occurred:", error);
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      this.dummy = res;
      this.dummy = this.dummy.userSkill
    })
  }

  get filteredUsers() {
    return this.dummy.filter((user: { skill: any; category: any; subcategory: any }) =>
      user.skill.toLowerCase().includes(this.searchText) ||
      user.category.toLowerCase().includes(this.searchText) ||
      user.subcategory.toLowerCase().includes(this.searchText)
    );
  }


  selecteSkill(skill: any) {
    console.log(skill)
    this.selectedSkill = skill
    console.log(this.selectedSkill)
  }

  editSkill(closeModal: HTMLButtonElement) {
    this.userRequestData = {
      proficiencyLevel: this.editUserForm.get('proficiency')?.value,
      experience: this.editUserForm.get('experience')?.value,
      userId: 0,
      skillId: 0,
      userskillId: this.selectedSkill.userSkillId,
    }
    console.log(this.userRequestData)
    this.http.patch(`${"https://localhost:7111/api/UserSkill/"}`, this.userRequestData).pipe(
      catchError((error) => {
        this._snackBar.open(error.error.message, 'Remove', {
          horizontalPosition: "right",
          verticalPosition: 'bottom',
        });
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      this._snackBar.open('Skill Edited !', 'Remove', {
        horizontalPosition: "right",
        verticalPosition: 'bottom',
      });
    })
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    }
  }

  deleteSkill(closeModal: HTMLButtonElement) {
    this.http.delete(`${"https://localhost:7111/api/UserSkill/" + this.selectedSkill.userSkillId}`).pipe(
      catchError((error) => {
        this._snackBar.open(error.error.message, 'Remove', {
          horizontalPosition: "right",
          verticalPosition: 'bottom',
        });
        if (this.closeModal) {
          this.closeModal.nativeElement.click();
        }
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      // window.location.reload()
      this._snackBar.open('Skill Edited !', 'Remove', {
        horizontalPosition: "right",
        verticalPosition: 'bottom',
      });

      if (this.closeModal) {
        this.closeModal.nativeElement.click();
      }
    })
  }

}
