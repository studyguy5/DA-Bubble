import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordWithEmailComponent } from './reset-password-with-email-component';

describe('ResetPasswordWithEmailComponent', () => {
  let component: ResetPasswordWithEmailComponent;
  let fixture: ComponentFixture<ResetPasswordWithEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordWithEmailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordWithEmailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
