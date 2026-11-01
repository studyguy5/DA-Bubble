import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLogoutMiniComponent } from './profile-logout-mini-component';

describe('ProfileLogoutMiniComponent', () => {
  let component: ProfileLogoutMiniComponent;
  let fixture: ComponentFixture<ProfileLogoutMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileLogoutMiniComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileLogoutMiniComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
