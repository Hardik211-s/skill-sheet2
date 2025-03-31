import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/envoronment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface User {
  username: string;
  sex: string;
  birthdate: string;
  joiningDate: string;
  workJapan: boolean;
  country: string;
  fullName: string;
  description: string;
  qualification: string;
  photo: string;
  phoneNo: string;

}

@Injectable({
  providedIn: 'root'
})
export class UserdetailService {

  private userDetailSubject = new BehaviorSubject<User>({
    username: '', sex: '', birthdate: '', joiningDate: ''
    , workJapan: true, country: '', fullName: '', description: '', qualification: '', photo: '', phoneNo: ''
  });

  private isEditPage = new BehaviorSubject<boolean>(false);
  private checkUserDetail = new BehaviorSubject<boolean>(false);  // Initially logged out

  userData$ = this.userDetailSubject.asObservable();
  editUser$ = this.isEditPage.asObservable();
  isUserDetail = this.checkUserDetail.asObservable();
  user: any = {}

  constructor(private http: HttpClient, private authSearvice: AuthService) {
  }
  isUserPresent() {
    return this.checkUserDetail.getValue()
  }

  addData(user: Partial<User>) {
    this.checkUserDetail.next(true)
    this.userDetailSubject.next({ ...this.userDetailSubject.value, ...user });
  }

  toggleEdit() {
    this.isEditPage.next(true);
  }

  getIsEdit() {
    return this.isEditPage.getValue();
  }

  getData() {
    return this.userDetailSubject.getValue();
  }


  userDetailById(id:number){
    return this.http.get(environment.apiUrl + "UserDetail/UserDetailById/"+id);
  }
}
