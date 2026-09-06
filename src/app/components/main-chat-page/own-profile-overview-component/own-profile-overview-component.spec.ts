import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnProfileOverviewComponent } from './own-profile-overview-component';

describe('OwnProfileOverviewComponent', () => {
  let component: OwnProfileOverviewComponent;
  let fixture: ComponentFixture<OwnProfileOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnProfileOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnProfileOverviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
