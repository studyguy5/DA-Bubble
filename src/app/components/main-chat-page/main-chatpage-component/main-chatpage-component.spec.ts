import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainChatpageComponent } from './main-chatpage-component';

describe('MainChatpageComponent', () => {
  let component: MainChatpageComponent;
  let fixture: ComponentFixture<MainChatpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainChatpageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainChatpageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
