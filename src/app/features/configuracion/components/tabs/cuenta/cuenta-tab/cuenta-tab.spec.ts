import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentaTab } from './cuenta-tab';

describe('CuentaTab', () => {
  let component: CuentaTab;
  let fixture: ComponentFixture<CuentaTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentaTab],
    }).compileComponents();

    fixture = TestBed.createComponent(CuentaTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
