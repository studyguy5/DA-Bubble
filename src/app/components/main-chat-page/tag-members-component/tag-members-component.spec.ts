import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagMembersComponent } from './tag-members-component';

describe('TagMembersComponent', () => {
  let component: TagMembersComponent;
  let fixture: ComponentFixture<TagMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagMembersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TagMembersComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
