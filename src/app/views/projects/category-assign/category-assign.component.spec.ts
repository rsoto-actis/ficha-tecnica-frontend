import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAssignComponent } from './category-assign.component';

describe('CategoryAssignComponent', () => {
  let component: CategoryAssignComponent;
  let fixture: ComponentFixture<CategoryAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryAssignComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
