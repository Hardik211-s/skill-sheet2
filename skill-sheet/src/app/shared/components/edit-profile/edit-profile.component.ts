import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserdetailService } from '../../../service/userdetail.service';
import { PersonalDetailComponent } from '../personal-detail/personal-detail.component';

@Component({
  selector: 'app-edit-profile',
  imports: [PersonalDetailComponent, PersonalDetailComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit {
  userDeatil: any = {}

  constructor(private userDetailService: UserdetailService, private cdr: ChangeDetectorRef) {
    this.userDetailService.toggleEdit();
  }

  ngOnInit(): void {
    this.userDetailService.userData$.subscribe((data) => {
      this.cdr.detectChanges();
      this.userDeatil = this.userDetailService.getData(); // Manually trigger change detection
    });
  }
}
