import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegisterPageComponent } from './login-register-page-component';

describe('LoginRegisterPageComponent', () => {
  let component: LoginRegisterPageComponent;
  let fixture: ComponentFixture<LoginRegisterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginRegisterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginRegisterPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
