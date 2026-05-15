import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoCategoria } from './presupuesto-categoria';

describe('PresupuestoCategoria', () => {
  let component: PresupuestoCategoria;
  let fixture: ComponentFixture<PresupuestoCategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresupuestoCategoria],
    }).compileComponents();

    fixture = TestBed.createComponent(PresupuestoCategoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
