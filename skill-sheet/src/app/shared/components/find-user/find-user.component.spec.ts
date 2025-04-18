import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindUserComponent } from './find-user.component';

describe('FindUserComponent', () => {
  let component: FindUserComponent;
  let fixture: ComponentFixture<FindUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
