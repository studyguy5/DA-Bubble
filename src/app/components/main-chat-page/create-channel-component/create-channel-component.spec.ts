import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChannelComponent } from './create-channel-component';

describe('CreateChannelComponent', () => {
  let component: CreateChannelComponent;
  let fixture: ComponentFixture<CreateChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChannelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateChannelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
