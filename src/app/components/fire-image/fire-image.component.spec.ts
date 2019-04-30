import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireImageComponent } from './fire-image.component';

describe('FireImageComponent', () => {
  let component: FireImageComponent;
  let fixture: ComponentFixture<FireImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
