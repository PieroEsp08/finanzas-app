import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoPage } from './presupuesto-page';

describe('PresupuestoPage', () => {
  let component: PresupuestoPage;
  let fixture: ComponentFixture<PresupuestoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresupuestoPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PresupuestoPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
