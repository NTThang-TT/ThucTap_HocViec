import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhanSuComponent } from './nhan-su';

describe('NhanSu', () => {
  let component: NhanSuComponent;
  let fixture: ComponentFixture<NhanSuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NhanSuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NhanSuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
