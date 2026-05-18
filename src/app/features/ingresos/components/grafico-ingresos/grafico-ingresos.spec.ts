import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoIngresos } from './grafico-ingresos';

describe('GraficoIngresos', () => {
  let component: GraficoIngresos;
  let fixture: ComponentFixture<GraficoIngresos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoIngresos],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoIngresos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
