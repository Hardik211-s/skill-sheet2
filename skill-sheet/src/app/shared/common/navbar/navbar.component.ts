import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  private authStatusSub: Subscription = new Subscription;
  title = 'skill-sheet';
  isLoggedIn: boolean = false;
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('main') main!: ElementRef;

  constructor(private router: Router, private authService: AuthService,private cdr:ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService.loggedIn$.subscribe(status => {
      this.cdr.detectChanges()
      this.isLoggedIn = status;
    })
  }

  
 
  changeUI() {
    this.sidebar.nativeElement.classList.toggle('expand');
    this.main.nativeElement.classList.toggle('expanded');
  }

  logout() {
    this.isLoggedIn = false; 
    sessionStorage.removeItem("token")
    this.authService.logout();

    this.router.navigate(['/login']);
    window.location.reload() // Redirect to login if not authenticated

  }
}
