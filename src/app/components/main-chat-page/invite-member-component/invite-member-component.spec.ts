import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteMemberComponent } from './invite-member-component';

describe('InviteMemberComponent', () => {
  let component: InviteMemberComponent;
  let fixture: ComponentFixture<InviteMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteMemberComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InviteMemberComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
