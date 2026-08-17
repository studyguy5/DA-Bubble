import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMaskComponent } from './register-mask-component';

describe('RegisterMaskComponent', () => {
  let component: RegisterMaskComponent;
  let fixture: ComponentFixture<RegisterMaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterMaskComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterMaskComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
