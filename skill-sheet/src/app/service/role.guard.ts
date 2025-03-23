

import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router,private authService:AuthService) {}

  canActivate( route:ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    this.authService.setLoginData()
    const role = this.authService.isLoggedIn().userData;
    if (role.Role==expectedRole) {
      return true; 
    } else { 
      this.router.navigate(['/access-denied']); 
      return false;
    }
  }
}


