import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelUserSelectionComponent } from './channel-user-selection-component';

describe('ChannelUserSelectionComponent', () => {
  let component: ChannelUserSelectionComponent;
  let fixture: ComponentFixture<ChannelUserSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelUserSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelUserSelectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
