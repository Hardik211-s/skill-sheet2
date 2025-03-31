import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { catchError, throwError } from 'rxjs';
import { UserdetailService } from '../../../service/userdetail.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [NgChartsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit  {

  barChartData: any = []
  userCountData: any = {}
  allUserDetail: any = {}
  pieChart:any;
  allData: any = []
  chartLabels: string[] = ['Programming', 'Web Dev.', 'Cloud comp.', 'DevOps', 'Data Science', 'Soft Skill', 'Al/Ml'];

  public barChartOptions = {
    responsive: true,
    indexAxis: 'x',
    plugins: {
      legend: { display: true }
    }// Horizontal bar chart
  };

  constructor(private http: HttpClient, private userDetailSearvice: UserdetailService,private authService:AuthService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.http.get("https://localhost:7111/api/Dashboard").subscribe((res) => {
      this.allData = res
      this.allData = this.allData.data
      this.countSkill()
      this.createChart()
    })
  }

  //Count perticular skill
  countSkill() {
    this.userCountData = {
      programming: this.filteredUsers("Programming & Development").length,
      webdev: this.filteredUsers("Web Development").length,
      cloud: this.filteredUsers("Cloud Computing").length,
      devops: this.filteredUsers("DevOps & IT Operations").length,
      datascience: this.filteredUsers("Data Analytics").length,
      soft: this.filteredUsers("Business & Soft Skills").length,
      aiml: this.filteredUsers("Machine Learning").length,
    };
    this.updateChartData()
  }

  //Update chart data
  updateChartData() {
    this.barChartData = [
      {
        data: [
          7,
          this.userCountData.webdev,
          this.userCountData.cloud,
          this.userCountData.devops,
          this.userCountData.datascience,
          this.userCountData.soft,
          this.userCountData.aiml,
        ],
        label: 'User Count',
        backgroundColor: [
          '#ADD8E6', // Light Blue
          '#90EE90', // Light Green
          '#FF9999', // Light Red
          '#D8BFD8', // Light Purple
          '#FFD580', // Light Orange
        ],
      },
    ];
    this.cdr.detectChanges();
  }

  //Filter users
  filteredUsers(search: string) {
    if(this.allData.userAllData!=null){
      return this.allData?.userAllData?.filter((user: { skill: any; category: any; subcategory: any }) =>
        user.skill.includes(search)
        || user.category.includes(search) ||
        user.subcategory.includes(search)
      );
    }

  }

  //Filter gender
  filterGender(search:string){
    return this.allData?.allUserDetail?.filter((user: { sex: string}) =>
      user.sex?.includes(search)
    );
  }

  //Filter dotnet developer
  dotNetDev() {
    return this.allData?.allUserDetail?.filter((data: { username: string }) =>
      this.allData.userAllData
    .filter((user: { skill: string }) =>
      ["ASP.NET Core MVC", ".NET Core", "ASP.NET", "Entity Framework"].some((s) =>
        user.skill.includes(s)
      )
    )
    .filter(
      (user: any, index: any, self: any) =>
        index === self.findIndex((u: any) => u.username === user.username) // Remove duplicates based on `skill`
    ).some((user: { username: string }) => user.username === data.username)
    )
  }

  webDev() {
    return this.allData?.userAllData?.filter((user: { category: string }) =>
        ["Web Development"].some((s) =>
          user.category.includes(s)
        )
      )
      .filter(
        (user: any, index: any, self: any) =>
          index === self.findIndex((u: any) => u.username === user.username) // Remove duplicates based on `skill`
      ).length;
  }

  createChart(){
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    this.pieChart = new Chart('pieChartCanvas', {
      type: 'pie',
      data: {
        labels: ['Male','Female'],
        datasets: [{
          data: [this.filterGender("male")?.length, this.filterGender("female")?.length], // Values for the pie chart
          backgroundColor: ['#90EE90','#FF9999'],
          borderColor: ['white'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  }
  

}
