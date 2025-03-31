import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { catchError, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShowProfileComponent } from "../show-profile/show-profile.component";
import { SkilldataService } from '../../../service/skilldata.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-find-user',
  imports: [CommonModule, ShowProfileComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, ShowProfileComponent],
  templateUrl: './find-user.component.html',
  styleUrl: './find-user.component.scss'
})
export class FindUserComponent implements OnInit {

  skillForm = new FormGroup({
    category: new FormControl('', [Validators.required]),
    subCategory: new FormControl('', [Validators.required]),
    skill: new FormControl('', [Validators.required]),
  });

  @ViewChild('sidebar') sidebar!: ElementRef;

  skillCategory: any = []
  allData: any = []
  skillSubCategory: any = []
  skills: any = []
  searchText: string = ""
  filteredUser: any = []
  userDetail: any = {}
  imageURL: string = ''
  userId: number = 0;
  showPDF: boolean = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private skillDataService: SkilldataService

  ) {
  }

  ngOnInit(): void {
    this.skillDataService.getCategoryData().pipe(
      catchError((error) => {
        console.error("Error occurred:", error);
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      this.skillCategory = res;
      console.log(this.skillCategory)
      this.skillCategory = this.skillCategory.category;
    })

    this.http.get("https://localhost:7111/api/Dashboard").subscribe((res) => {
      this.allData = res
      this.allData = this.allData.data
    })
  }


  OnCategory() {
    this.skillDataService.getSubCategoryDataByID(this.skillForm.get('category')?.value).pipe(
      catchError((error) => {
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      this.skillSubCategory = res;
      this.skillSubCategory = this.skillSubCategory.subCategory;
    })
  }

  OnSubcategory() {
    this.skillDataService.getSkillDataByID(this.skillForm.get('subCategory')?.value).pipe(
      catchError((error) => {
        return throwError(() => error); // Proper error handling
      })
    ).subscribe((res) => {
      this.skills = res;
      this.skills = this.skills.skills;
    })
  }

  OnSkill(skill: string) {
    this.searchText = skill
  }
  generatePdf() {
    this.showPDF=true;
    const element = document.getElementById('hardik');
    if (element) {
   console.log(element)
      html2canvas(element!).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 190; // Adjust to fit A4 width
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.html(element)
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);

        window.open(pdfUrl, '_blank');

        setTimeout(() => {
          const userConfirmation = confirm("Do you want to download the PDF?");
          if (userConfirmation) {
            pdf.save('document.pdf');
          }
this.showPDF=false;

        }, 1000);
      });
    }
  }
  searchUsers() {
    this.filteredUser = this.allData?.allUserDetail.filter((data: { username: string }) =>
      this.allData.userAllData
        .filter((user: { skill: string | null | undefined }) =>
          user.skill?.includes(this.searchText)
        )
        .filter(
          (user: any, index: any, self: any) =>
            index === self.findIndex((u: any) => u.username === user.username) // Remove duplicates based on `skill`
        ).some((user: { username: string }) => user.username === data.username)
    )
  }

  setUserId(id: number) {
    this.userId = id
    this.cdr.detectChanges();
  }
}
