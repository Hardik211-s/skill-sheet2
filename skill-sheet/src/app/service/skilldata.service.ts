import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/envoronment';

@Injectable({
  providedIn: 'root'
})
export class SkilldataService {


  apiUrl=environment.apiUrl+'SkillData'

  constructor(private http:HttpClient) { }

  getCategoryData(): Observable<any> {
    return this.http.get(this.apiUrl+'/Category');
  }
  
  getSubCategoryData(): Observable<any> {
    return this.http.get(this.apiUrl+'/Subcategory');
  }

  getSkillData(): Observable<any> {
    return this.http.get(this.apiUrl+'/Skill');
  }

 

  getSubCategoryDataByID(id:string |null | undefined): Observable<any> {
    return this.http.get(this.apiUrl+'/Subcategory/'+id);
  }

  getSkillDataByID(id:string | null | undefined ): Observable<any> {
    return this.http.get(this.apiUrl+'/Skill/'+id);
  }

  addSkill(skilldata:any): Observable<any> {
    return this.http.post(environment.apiUrl+'UserSkill',skilldata);
  }
}
