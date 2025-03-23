import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './service/auth.service';
import { NgChartsModule } from 'ng2-charts';
import { FormControl, FormsModule } from '@angular/forms';
import { NavbarComponent } from './shared/common/navbar/navbar.component';
import { MainComponent } from './shared/common/main/main.component';
import { UserdetailService } from './service/userdetail.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, NavbarComponent, NgChartsModule, MainComponent],
  providers: [AuthService],
  templateUrl: './app.component.html',
  standalone: true
})
export class AppComponent {
  title = 'skill-sheet';
  isLoggedIn: boolean = false;
  isShowSidebar: boolean = false;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private router: Router, private userDetailSearvice: UserdetailService) {
    if (sessionStorage.getItem("token") == null) {
      this.router.navigate(['/login']);
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 576) {
      this.isShowSidebar = false;
    }
  }
  showSidebar() {
    this.isShowSidebar = !this.isShowSidebar;
  }
  token: string | null = ''
  ngOnInit(): void {
    this.authService.loggedIn$.subscribe(() => {
      this.cdr.detectChanges();
      this.isLoggedIn = this.authService.isLoggedIn().isLoggedIn;
    });
  }
}
