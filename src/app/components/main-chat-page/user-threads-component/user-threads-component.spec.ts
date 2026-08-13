import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserThreadsComponent } from './user-threads-component';

describe('UserThreadsComponent', () => {
  let component: UserThreadsComponent;
  let fixture: ComponentFixture<UserThreadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserThreadsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserThreadsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
