import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoTendenciaFinanciera } from './grafico-tendencia-financiera';

describe('GraficoTendenciaFinanciera', () => {
  let component: GraficoTendenciaFinanciera;
  let fixture: ComponentFixture<GraficoTendenciaFinanciera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoTendenciaFinanciera],
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoTendenciaFinanciera);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
