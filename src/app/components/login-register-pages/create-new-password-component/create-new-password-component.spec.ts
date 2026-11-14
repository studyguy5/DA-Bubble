import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewPasswordComponent } from './create-new-password-component';

describe('CreateNewPasswordComponent', () => {
  let component: CreateNewPasswordComponent;
  let fixture: ComponentFixture<CreateNewPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewPasswordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewPasswordComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
