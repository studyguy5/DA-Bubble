import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelInfoComponent } from './channel-info-component';

describe('ChannelInfoComponent', () => {
  let component: ChannelInfoComponent;
  let fixture: ComponentFixture<ChannelInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelInfoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
